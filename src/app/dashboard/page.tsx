"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  currentWeight: number | null;
  goalWeight: number | null;
  weightChange7d: number | null;
  streak: number;
  todayCalories: number;
  todayExercises: number;
  recentWeights: { date: string; weight: number }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const progress =
    data?.currentWeight && data?.goalWeight
      ? Math.min(
          100,
          Math.max(
            0,
            ((data.currentWeight - data.goalWeight) /
              (data.currentWeight - data.goalWeight + 0.1)) *
              100
          )
        )
      : 0;

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back,{" "}
          <span className="text-gold">
            {session?.user?.name?.split(" ")[0] || "Champion"}
          </span>
        </h1>
        <p className="text-dark-muted mt-1">
          It never gets easier, you just get stronger.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Current Weight
          </p>
          <p className="text-2xl font-bold">
            {data?.currentWeight ? `${data.currentWeight} kg` : "—"}
          </p>
          {data?.weightChange7d !== null && data?.weightChange7d !== undefined && (
            <p
              className={`text-xs mt-1 ${
                data.weightChange7d <= 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              {data.weightChange7d > 0 ? "+" : ""}
              {data.weightChange7d.toFixed(1)} kg this week
            </p>
          )}
        </div>

        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Goal Weight
          </p>
          <p className="text-2xl font-bold">
            {data?.goalWeight ? `${data.goalWeight} kg` : "—"}
          </p>
          {data?.goalWeight && data?.currentWeight && (
            <p className="text-xs text-gold mt-1">
              {Math.abs(data.currentWeight - data.goalWeight).toFixed(1)} kg to
              go
            </p>
          )}
        </div>

        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Today&apos;s Calories
          </p>
          <p className="text-2xl font-bold">{data?.todayCalories || 0}</p>
          <p className="text-xs text-dark-muted mt-1">kcal logged</p>
        </div>

        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Check-in Streak
          </p>
          <p className="text-2xl font-bold text-gold">
            {data?.streak || 0} days
          </p>
          <p className="text-xs text-dark-muted mt-1">Keep it going!</p>
        </div>
      </div>

      {data?.recentWeights && data.recentWeights.length > 0 && (
        <div className="card mb-8">
          <h2 className="font-semibold mb-4">Weight Trend (Last 14 Days)</h2>
          <div className="h-48 flex items-end gap-1">
            {data.recentWeights.map((w, i) => {
              const min = Math.min(...data.recentWeights.map((w) => w.weight));
              const max = Math.max(...data.recentWeights.map((w) => w.weight));
              const range = max - min || 1;
              const height = ((w.weight - min) / range) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-dark-muted">
                    {w.weight}
                  </span>
                  <div
                    className="w-full bg-gold/30 rounded-t"
                    style={{ height: `${Math.max(20, height)}%` }}
                  >
                    <div
                      className="w-full bg-gold rounded-t"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <span className="text-[8px] text-dark-muted">
                    {new Date(w.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/weight"
          className="card hover:border-gold transition-colors text-center"
        >
          <span className="text-2xl">⚖️</span>
          <p className="font-semibold mt-2">Log Weight</p>
        </Link>
        <Link
          href="/dashboard/exercise"
          className="card hover:border-gold transition-colors text-center"
        >
          <span className="text-2xl">🏋️</span>
          <p className="font-semibold mt-2">Log Exercise</p>
        </Link>
        <Link
          href="/dashboard/food"
          className="card hover:border-gold transition-colors text-center"
        >
          <span className="text-2xl">🍎</span>
          <p className="font-semibold mt-2">Log Food</p>
        </Link>
      </div>
    </div>
  );
}
