// Project: Farm Manager | Module: SyncBadge.jsx
import React from "react";

const CONFIG = {
  pending: {
    label: "Pending sync",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  failed: {
    label: "Sync failed",
    cls: "bg-red-50 text-red-700 border-red-200",
  },
};

export const SyncBadge = ({ record }) => {
  const status = record?._sync?.status;
  if (!status || status === "synced") return null;

  const config = CONFIG[status] || CONFIG.pending;
  return (
    <span
      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.cls}`}
      title={record?._sync?.error || config.label}
    >
      {config.label}
    </span>
  );
};
