"use client";

import { useState, useEffect } from "react";

interface ExerciseEntry {
  id: string;
  name: string;
  type: string;
  duration: number | null;
  calories: number | null;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  notes: string | null;
  date: string;
  completedAt: string | null;
  scheduledAt: string | null;
}

const exerciseTypes = [
  "Strength",
  "Cardio",
  "HIIT",
  "Yoga",
  "Stretching",
  "Sports",
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Class",
  "Other",
];

export default function ExercisePage() {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [form, setForm] = useState({
    name: "",
    type: "Strength",
    duration: "",
    calories: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
    scheduledAt: "",
  });
  const [loading, setLoading] = useState(false);

  const loadEntries = () => {
    fetch("/api/exercise")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setLoading(true);

    await fetch("/api/exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        type: form.type,
        duration: form.duration ? parseInt(form.duration) : null,
        calories: form.calories ? parseInt(form.calories) : null,
        sets: form.sets ? parseInt(form.sets) : null,
        reps: form.reps ? parseInt(form.reps) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        notes: form.notes || null,
        scheduledAt: form.scheduledAt || null,
      }),
    });

    setForm({
      name: "",
      type: "Strength",
      duration: "",
      calories: "",
      sets: "",
      reps: "",
      weight: "",
      notes: "",
      scheduledAt: "",
    });
    setLoading(false);
    loadEntries();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await fetch("/api/exercise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    loadEntries();
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/exercise?id=${id}`, { method: "DELETE" });
    loadEntries();
  };

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Exercise <span className="text-gold">Logger</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="font-semibold mb-4">Log Exercise</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="input-dark"
                  placeholder="Bench Press"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="input-dark"
                >
                  {exerciseTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={form.sets}
                    onChange={(e) =>
                      setForm({ ...form, sets: e.target.value })
                    }
                    className="input-dark"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={form.reps}
                    onChange={(e) =>
                      setForm({ ...form, reps: e.target.value })
                    }
                    className="input-dark"
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: e.target.value })
                    }
                    className="input-dark"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    className="input-dark"
                    placeholder="45"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Calories Burned
                </label>
                <input
                  type="number"
                  value={form.calories}
                  onChange={(e) =>
                    setForm({ ...form, calories: e.target.value })
                  }
                  className="input-dark"
                  placeholder="300"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Schedule For (optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm({ ...form, scheduledAt: e.target.value })
                  }
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  className="input-dark"
                  placeholder="Felt strong today..."
                />
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Log Exercise"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-semibold mb-4">Recent Exercises</h2>
            {entries.length === 0 ? (
              <p className="text-dark-muted text-sm">
                No exercises logged yet. Get moving!
              </p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      entry.completedAt
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-dark-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleComplete(
                                entry.id,
                                !!entry.completedAt
                              )
                            }
                            className={`w-5 h-5 rounded border flex items-center justify-center text-xs ${
                              entry.completedAt
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-dark-border hover:border-gold"
                            }`}
                          >
                            {entry.completedAt ? "✓" : ""}
                          </button>
                          <span className="font-semibold">{entry.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold">
                            {entry.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-dark-muted">
                          {entry.sets && (
                            <span>{entry.sets} sets</span>
                          )}
                          {entry.reps && (
                            <span>{entry.reps} reps</span>
                          )}
                          {entry.weight && (
                            <span>{entry.weight} kg</span>
                          )}
                          {entry.duration && (
                            <span>{entry.duration} min</span>
                          )}
                          {entry.calories && (
                            <span>{entry.calories} kcal</span>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-dark-muted mt-1">
                            {entry.notes}
                          </p>
                        )}
                        <p className="text-xs text-dark-muted mt-1">
                          {new Date(entry.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                          {entry.scheduledAt &&
                            ` • Scheduled: ${new Date(
                              entry.scheduledAt
                            ).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-dark-muted hover:text-red-500 text-sm ml-2"
                      >
                        ✕
                      </button>
                    </div>
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
