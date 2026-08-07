// Project: Farm Manager | Module: syncManager.js
import { offlineStore, SYNC_STATUS } from "./offlineStore";
import { cropsAPI, expensesAPI, harvestsAPI } from "../services/api";

const OUTBOX = "outbox";

const API = {
  crops: {
    create: (p) => cropsAPI.create(p),
    update: (id, p) => cropsAPI.update(id, p),
    delete: (id) => cropsAPI.delete(id),
  },
  expenses: {
    create: (p) => expensesAPI.create(p),
    update: (id, p) => expensesAPI.update(id, p),
    delete: (id) => expensesAPI.delete(id),
  },
  harvests: {
    create: (p) => harvestsAPI.create(p),
    update: (id, p) => harvestsAPI.update(id, p),
    delete: (id) => harvestsAPI.delete(id),
  },
};

function currentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id;
  } catch {
    return null;
  }
}

function isOfflineError(error) {
  return (
    !error.response ||
    error.code === "ECONNABORTED" ||
    error.message === "Network Error"
  );
}

const listeners = new Set();

export function subscribeSync(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  listeners.forEach((fn) => fn());
}

function stripMeta(record) {
  const { _sync, ...rest } = record || {};
  return rest;
}

// Drop fields the backend derives / must not be sent back.
function toPayload(record) {
  const { id, created_at, updated_at, ...rest } = stripMeta(record);
  return rest;
}

/**
 * Save a record locally (optimistic) and queue it for the server.
 * record.id set       -> update op
 * record.id unset     -> create op (server id unknown yet)
 */
export async function saveAndQueue(entity, record, sync = {}) {
  const userId = currentUserId();
  if (!userId) return record;

  const isCreate = record.id == null;
  const localId = isCreate ? `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` : record.id;

  const entry = {
    entity,
    op: isCreate ? "create" : "update",
    serverId: isCreate ? null : record.id,
    localId,
    payload: toPayload(record),
    attempts: 0,
  };

  const localRecord = {
    ...record,
    id: localId,
    _sync: { status: SYNC_STATUS.PENDING, operation: isCreate ? "create" : "update", ...sync },
  };

  await offlineStore.saveLocal(userId, entity, localRecord);
  await offlineStore.put(userId, OUTBOX, entry);
  notify();
  if (navigator.onLine) flush(userId);
  return localRecord;
}

export async function deleteAndQueue(entity, id) {
  const userId = currentUserId();
  if (!userId) return;

  const local = await offlineStore.get(userId, entity, id);

  if (!local?._sync?.serverId) {
    // Never synced: drop the local copy and any pending ops for it.
    await offlineStore.remove(userId, entity, id);
    const pending = await offlineStore.getAll(userId, OUTBOX);
    for (const entry of pending) {
      if (entry.entity === entity && (entry.localId === id || entry.serverId === null)) {
        await offlineStore.remove(userId, OUTBOX, entry.id);
      }
    }
    notify();
    return;
  }

  await offlineStore.saveLocal(userId, entity, {
    ...local,
    _sync: { status: SYNC_STATUS.PENDING, operation: "delete" },
  });
  await offlineStore.put(userId, OUTBOX, {
    entity,
    op: "delete",
    serverId: local._sync.serverId,
    localId: id,
    attempts: 0,
  });
  notify();
  if (navigator.onLine) flush(userId);
}

/**
 * Flush the outbox in insertion order. A failed record never blocks the rest.
 * v1 conflict strategy: last-write-wins (no field-level merge).
 */
export async function flush(userId = currentUserId()) {
  if (!userId || !navigator.onLine) return;

  const queue = await offlineStore.getAll(userId, OUTBOX);
  for (const entry of queue) {
    const adapter = API[entry.entity];
    if (!adapter) {
      await offlineStore.remove(userId, OUTBOX, entry.id);
      continue;
    }

    try {
      if (entry.op === "delete") {
        await adapter.delete(entry.serverId);
        await offlineStore.remove(userId, entry.entity, entry.serverId);
        await offlineStore.remove(userId, OUTBOX, entry.id);
        continue;
      }

      const res = await adapter[entry.op](
        entry.op === "create" ? entry.payload : entry.serverId,
        entry.payload,
      );
      const serverRecord = res?.data?.data || res?.data;

      if (entry.op === "create") {
        const stored = await offlineStore.get(userId, entry.entity, entry.localId);
        const synced = {
          ...(stored ? stripMeta(stored) : {}),
          ...serverRecord,
          _sync: { status: SYNC_STATUS.SYNCED, serverId: serverRecord.id },
        };
        await offlineStore.migrateId(userId, entry.entity, entry.localId, synced);
      } else {
        const stored = await offlineStore.get(userId, entry.entity, entry.serverId);
        await offlineStore.saveLocal(userId, entry.entity, {
          ...(stored ? stripMeta(stored) : {}),
          ...serverRecord,
          _sync: { status: SYNC_STATUS.SYNCED, serverId: serverRecord.id },
        });
      }

      await offlineStore.remove(userId, OUTBOX, entry.id);
    } catch (error) {
      if (isOfflineError(error)) {
        return; // connection dropped mid-flush; keep queue for later
      }
      const key = entry.op === "create" ? entry.localId : entry.serverId;
      const stored = await offlineStore.get(userId, entry.entity, key);
      if (stored) {
        await offlineStore.saveLocal(userId, entry.entity, {
          ...stored,
          _sync: {
            ...stored._sync,
            status: SYNC_STATUS.FAILED,
            error: error.response?.data?.error || error.message,
          },
        });
      }
      entry.attempts += 1;
      if (entry.attempts < 3) {
        await offlineStore.put(userId, OUTBOX, entry);
      } else {
        await offlineStore.remove(userId, OUTBOX, entry.id);
      }
    }
  }

  notify();
}

let initialized = false;

/**
 * Listen for connectivity changes; flush the queue when the connection
 * returns, and once on boot when online.
 */
export function initSyncManager() {
  if (initialized) return;
  initialized = true;

  window.addEventListener("online", () => {
    flush();
  });

  const userId = currentUserId();
  if (userId && navigator.onLine) {
    flush(userId);
  }
}

export function resetSyncManager() {
  initialized = false;
  flush();
}
