"use client";

import { useState, useEffect } from "react";

interface Settings {
  morningTime: string;
  eveningTime: string;
  enabled: boolean;
  weighInReminder: boolean;
  mealReminder: boolean;
  workoutReminder: boolean;
  goalWeight: number | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    morningTime: "08:00",
    eveningTime: "19:00",
    enabled: true,
    weighInReminder: true,
    mealReminder: true,
    workoutReminder: true,
    goalWeight: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="text-gold">Settings</span>
      </h1>

      <div className="max-w-lg space-y-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Goal</h2>
          <div>
            <label className="block text-sm text-dark-muted mb-1">
              Target Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.goalWeight || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  goalWeight: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                })
              }
              className="input-dark"
              placeholder="75.0"
            />
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Notification Schedule</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable Notifications</span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    enabled: !settings.enabled,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.enabled ? "bg-gold" : "bg-dark-border"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.enabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm text-dark-muted mb-1">
                Morning Check-in Time
              </label>
              <input
                type="time"
                value={settings.morningTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    morningTime: e.target.value,
                  })
                }
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-sm text-dark-muted mb-1">
                Evening Check-in Time
              </label>
              <input
                type="time"
                value={settings.eveningTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    eveningTime: e.target.value,
                  })
                }
                className="input-dark"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Reminder Types</h2>
          <div className="space-y-3">
            {[
              {
                key: "weighInReminder" as const,
                label: "Daily Weigh-in Reminder",
              },
              {
                key: "mealReminder" as const,
                label: "Meal Logging Reminder",
              },
              {
                key: "workoutReminder" as const,
                label: "Workout Reminder",
              },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{label}</span>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      [key]: !settings[key],
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings[key] ? "bg-gold" : "bg-dark-border"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      settings[key]
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="btn-gold w-full" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
