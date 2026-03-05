"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    goalWeight: "",
    morningTime: "08:00",
    eveningTime: "19:00",
    weighInReminder: true,
    mealReminder: true,
    workoutReminder: true,
  });
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalWeight: form.goalWeight ? parseFloat(form.goalWeight) : null,
        morningTime: form.morningTime,
        eveningTime: form.eveningTime,
        weighInReminder: form.weighInReminder,
        mealReminder: form.mealReminder,
        workoutReminder: form.workoutReminder,
      }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full gold-glow">
        <div className="text-center mb-8">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            1 Level Up
          </span>
          <h1
            className="text-2xl font-bold mt-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {step === 1 ? "Set Your Goal" : "Notification Preferences"}
          </h1>
          <div className="flex justify-center gap-2 mt-4">
            <div
              className={`w-8 h-1 rounded ${
                step >= 1 ? "bg-gold" : "bg-dark-border"
              }`}
            />
            <div
              className={`w-8 h-1 rounded ${
                step >= 2 ? "bg-gold" : "bg-dark-border"
              }`}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1">
                What&apos;s your goal weight? (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.goalWeight}
                onChange={(e) =>
                  setForm({ ...form, goalWeight: e.target.value })
                }
                className="input-dark"
                placeholder="75.0"
              />
              <p className="text-xs text-dark-muted mt-1">
                You can change this later in settings
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="btn-gold w-full"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1">
                Morning Check-in Time
              </label>
              <input
                type="time"
                value={form.morningTime}
                onChange={(e) =>
                  setForm({ ...form, morningTime: e.target.value })
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
                value={form.eveningTime}
                onChange={(e) =>
                  setForm({ ...form, eveningTime: e.target.value })
                }
                className="input-dark"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium">Reminders</p>
              {[
                {
                  key: "weighInReminder" as const,
                  label: "Daily Weigh-in",
                },
                {
                  key: "mealReminder" as const,
                  label: "Meal Logging",
                },
                {
                  key: "workoutReminder" as const,
                  label: "Workout",
                },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-dark-muted">{label}</span>
                  <button
                    onClick={() =>
                      setForm({ ...form, [key]: !form[key] })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      form[key] ? "bg-gold" : "bg-dark-border"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        form[key]
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-dark-border rounded-lg py-2.5 text-dark-muted hover:text-dark-text transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="btn-gold flex-1"
                disabled={saving}
              >
                {saving ? "Setting up..." : "Let's Go"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
