"use client";

import { useState, useEffect } from "react";

interface Client {
  id: string;
  name: string | null;
  email: string;
}

export default function ExportPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [dataType, setDataType] = useState("weight");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((data: Client[]) => setClients(data))
      .catch(() => {});
  }, []);

  const handleExport = async () => {
    if (!selectedClient) return;
    setExporting(true);

    const res = await fetch(
      `/api/admin/export?clientId=${selectedClient}&type=${dataType}`
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataType}-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Data <span className="text-gold">Export</span>
      </h1>

      <div className="card max-w-lg">
        <h2 className="font-semibold mb-4">Export Client Data (CSV)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-muted mb-1">
              Client
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="input-dark"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-dark-muted mb-1">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="input-dark"
            >
              <option value="weight">Weight Entries</option>
              <option value="exercise">Exercise Log</option>
              <option value="food">Food Log</option>
              <option value="all">All Data</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="btn-gold w-full"
            disabled={!selectedClient || exporting}
          >
            {exporting ? "Exporting..." : "Download CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
