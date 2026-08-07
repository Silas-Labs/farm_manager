// Project: Farm Manager | Module: offlineStore.js
// Per-user IndexedDB store mirroring backend records for Crops, Expenses and
// Harvests, plus an outbox that backs the sync queue. Not raw localStorage
// because records need structured, queryable storage with sync metadata.
//
// Record shape mirrors the backend:
//   crops:     { id, name, brand, variety, duration, stage, planted_date, expected_harvest_date, created_at, updated_at }
//   expenses:  { id, title, amount, category, expense_type, date, notes, created_at, crop_id }
//   harvests:  { id, crop_id, crop_name, yield, unit, revenue, harvest_date, notes, created_at }
//
// Every record carries a "_sync" meta object:
//   { status: 'synced' | 'pending' | 'failed', serverId, operation, error }

export const DB_VERSION = 1;

export const SYNC_STATUS = {
  SYNCED: "synced",
  PENDING: "pending",
  FAILED: "failed",
};

const TABLES = ["crops", "expenses", "harvests", "outbox"];

export function dbName(userId) {
  return `farm_manager_${userId}`;
}

function openDB(userId) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName(userId), DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      TABLES.forEach((table) => {
        if (!db.objectStoreNames.contains(table)) {
          db.createObjectStore(table, {
            keyPath: "id",
            autoIncrement: table === "outbox",
          });
        }
      });
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txComplete(db, storeName, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = fn(store);
    tx.oncomplete = () => resolve(request?.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function getAll(userId, table) {
  const db = await openDB(userId);
  try {
    return (await txComplete(db, table, "readonly", (s) => s.getAll())) || [];
  } finally {
    db.close();
  }
}

async function get(userId, table, id) {
  const db = await openDB(userId);
  try {
    return await txComplete(db, table, "readonly", (s) => s.get(id));
  } finally {
    db.close();
  }
}

async function put(userId, table, record) {
  const db = await openDB(userId);
  try {
    await txComplete(db, table, "readwrite", (s) => s.put(record));
    return record;
  } finally {
    db.close();
  }
}

async function remove(userId, table, id) {
  const db = await openDB(userId);
  try {
    await txComplete(db, table, "readwrite", (s) => s.delete(id));
  } finally {
    db.close();
  }
}

async function saveLocal(userId, table, record, sync = {}) {
  return put(userId, table, { ...record, _sync: sync });
}

async function migrateId(userId, table, oldId, newRecord) {
  const db = await openDB(userId);
  try {
    await txComplete(db, table, "readwrite", (s) => {
      s.delete(oldId);
      s.put(newRecord);
    });
    return newRecord;
  } finally {
    db.close();
  }
}

export const offlineStore = {
  dbName,
  getAll,
  get,
  put,
  remove,
  saveLocal,
  migrateId,
  SYNC_STATUS,
};
