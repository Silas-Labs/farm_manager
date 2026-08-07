// Project: Farm Manager | Module: dataActions.js
// Offline-first write layer. Pages call these instead of the raw API modules
// for create/update/delete so every change lands in the local store first
// (optimistic) and is queued for the server by the sync manager.

import { saveAndQueue, deleteAndQueue } from "./syncManager";

export const dataActions = {
  createCrop: (data) => saveAndQueue("crops", { ...data }),
  updateCrop: (id, data) => saveAndQueue("crops", { ...data, id }),
  deleteCrop: (id) => deleteAndQueue("crops", id),

  createExpense: (data) => saveAndQueue("expenses", { ...data }),
  updateExpense: (id, data) => saveAndQueue("expenses", { ...data, id }),
  deleteExpense: (id) => deleteAndQueue("expenses", id),

  createHarvest: (data) => saveAndQueue("harvests", { ...data }),
  updateHarvest: (id, data) => saveAndQueue("harvests", { ...data, id }),
  deleteHarvest: (id) => deleteAndQueue("harvests", id),
};
