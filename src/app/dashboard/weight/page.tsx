"use client";

import { useState, useEffect } from "react";

interface WeightEntry {
  id: string;
  weight: number;
  unit: string;
  notes: string | null;
  date: string;
}

export default function WeightPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEntries = () => {
    fetch("/api/weight")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    setLoading(true);

    await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: parseFloat(weight), notes }),
    });

    setWeight("");
    setNotes("");
    setLoading(false);
    loadEntries();
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/weight?id=${id}`, { method: "DELETE" });
    loadEntries();
  };

  const min = entries.length
    ? Math.min(...entries.map((e) => e.weight))
    : 0;
  const max = entries.length
    ? Math.max(...entries.map((e) => e.weight))
    : 0;

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Weight <span className="text-gold">Tracker</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="font-semibold mb-4">Log Weight</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-dark"
                  placeholder="80.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-dark"
                  placeholder="After morning workout..."
                />
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Log Weight"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {entries.length > 0 && (
            <div className="card mb-6">
              <h2 className="font-semibold mb-4">Trend</h2>
              <div className="h-52 flex items-end gap-1.5">
                {entries
                  .slice(0, 30)
                  .reverse()
                  .map((entry, i) => {
                    const range = max - min || 1;
                    const height =
                      ((entry.weight - min) / range) * 100;
                    return (
                      <div
                        key={entry.id}
                        className="flex-1 flex flex-col items-center gap-1"
                        title={`${entry.weight} kg — ${new Date(
                          entry.date
                        ).toLocaleDateString()}`}
                      >
                        <span className="text-[9px] text-dark-muted">
                          {entry.weight}
                        </span>
                        <div
                          className="w-full bg-gold rounded-t transition-all"
                          style={{
                            height: `${Math.max(15, height)}%`,
                          }}
                        />
                        <span className="text-[8px] text-dark-muted">
                          {new Date(entry.date).getDate()}/
                          {new Date(entry.date).getMonth() + 1}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="font-semibold mb-4">History</h2>
            {entries.length === 0 ? (
              <p className="text-dark-muted text-sm">
                No entries yet. Log your first weigh-in!
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2 border-b border-dark-border last:border-0"
                  >
                    <div>
                      <span className="font-semibold text-gold">
                        {entry.weight} kg
                      </span>
                      <span className="text-dark-muted text-sm ml-3">
                        {new Date(entry.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {entry.notes && (
                        <span className="text-dark-muted text-xs ml-2">
                          — {entry.notes}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-dark-muted hover:text-red-500 text-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
