// Project: Farm Manager | Module: useEntityData.js
// Local-first read hook. Renders from the IndexedDB store instantly (works
// offline), then reconciles with the backend when online. Subscription to the
// sync manager keeps the list fresh after local writes and sync flushes.

import { useEffect, useState, useCallback } from "react";
import { offlineStore, SYNC_STATUS } from "./offlineStore";
import { subscribeSync } from "./syncManager";

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id;
  } catch {
    return null;
  }
}

function isSynced(record) {
  return record._sync?.status === SYNC_STATUS.SYNCED;
}

export function useEntityData(entity, fetchRemote, mapData = (res) => res) {
  const [records, setRecords] = useState([]);
  const userId = getUserId();

  const readLocal = useCallback(async () => {
    if (userId == null) return [];
    const local = (await offlineStore.getAll(userId, entity)) || [];
    return local.filter((r) => r._sync?.operation !== "delete");
  }, [entity, userId]);

  const reconcile = useCallback(async () => {
    if (!navigator.onLine || userId == null) return;

    let serverRecords = [];
    try {
      const res = await fetch();
      serverRecords = mapData(res) || [];
    } catch {
      return;
    }

    const local = (await offlineStore.getAll(userId, entity)) || [];
    const localByServerId = {};
    local.forEach((e) => {
      if (e._sync?.serverId != null) localByServerId[e._sync.serverId] = e;
    });
    const serverIds = new Set(serverRecords.map((r) => r.id));

    // Local-first: keep any non-synced local record (pending/failed) as is.
    const display = [];
    local.forEach((e) => {
      if (e._sync?.operation === "delete") return;
      if (!isSynced(e) || !serverIds.has(e.id)) display.push(e);
    });

    // Overlay server truth for records that have no unresolved local change.
    const toPersist = [];
    serverRecords.forEach((r) => {
      const localRec = localByServerId[r.id];
      if (localRec && !isSynced(localRec)) return; // local edit/delete wins
      const synced = { ...r, _sync: { status: SYNC_STATUS.SYNCED, serverId: r.id } };
      const idx = display.findIndex((d) => d.id === r.id);
      if (idx >= 0) display[idx] = synced;
      else display.push(synced);
      toPersist.push(synced);
    });

    // Persist server truth locally so it is available offline.
    await Promise.all(
      toPersist.map((s) =>
        offlineStore.saveLocal(userId, entity, s, { status: SYNC_STATUS.SYNCED, serverId: s.id }),
      ),
    );

    setRecords(display);
  }, [entity, fetch, mapData, userId]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!active) return;
      const result = await readLocal();
      if (!active) return;
      setRecords(result);
      if (navigator.onLine) reconcile();
    };

    load();

    const refresh = () => {
      readLocal().then((r) => active && setRecords(r));
      if (navigator.onLine) reconcile();
    };
    const unsub = subscribeSync(refresh);

    const onOnline = () => reconcile();
    const onOffline = () => {
      readLocal().then((r) => active && setRecords(r));
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      active = false;
      unsub();
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [reconcile, readLocal]);

  return records;
}