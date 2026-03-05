"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ClientDetail {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  goalWeight: number | null;
  createdAt: string;
  weights: { id: string; weight: number; date: string; notes: string | null }[];
  exercises: {
    id: string;
    name: string;
    type: string;
    date: string;
    completedAt: string | null;
  }[];
  foodEntries: {
    id: string;
    name: string;
    calories: number;
    mealType: string | null;
    date: string;
  }[];
  streak: number;
}

export default function ClientDetailPage() {
  const params = useParams();
  const [client, setClient] = useState<ClientDetail | null>(null);

  useEffect(() => {
    fetch(`/api/admin/clients/${params.id}`)
      .then((r) => r.json())
      .then(setClient)
      .catch(() => {});
  }, [params.id]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-dark-muted">Loading...</p>
      </div>
    );
  }

  const latestWeight = client.weights[0]?.weight;
  const min = client.weights.length
    ? Math.min(...client.weights.map((w) => w.weight))
    : 0;
  const max = client.weights.length
    ? Math.max(...client.weights.map((w) => w.weight))
    : 0;

  return (
    <div>
      <Link
        href="/admin/clients"
        className="text-dark-muted hover:text-gold text-sm mb-4 inline-block"
      >
        ← Back to Clients
      </Link>

      <div className="flex items-center gap-4 mb-8">
        {client.image ? (
          <img
            src={client.image}
            alt=""
            className="w-14 h-14 rounded-full"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl font-bold">
            {(client.name || client.email)[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {client.name || "Unnamed Client"}
          </h1>
          <p className="text-dark-muted text-sm">{client.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-xs text-dark-muted uppercase tracking-wider mb-1">
            Current Weight
          </p>
          <p className="text-2xl font-bold">
            {latestWeight ? `${latestWeight} kg` : "—"}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-dark-muted uppercase tracking-wider mb-1">
            Goal Weight
          </p>
          <p className="text-2xl font-bold">
            {client.goalWeight ? `${client.goalWeight} kg` : "—"}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-dark-muted uppercase tracking-wider mb-1">
            Streak
          </p>
          <p className="text-2xl font-bold text-gold">{client.streak}d</p>
        </div>
        <div className="card">
          <p className="text-xs text-dark-muted uppercase tracking-wider mb-1">
            Member Since
          </p>
          <p className="text-2xl font-bold">
            {new Date(client.createdAt).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {client.weights.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Weight History</h2>
          <div className="h-48 flex items-end gap-1.5">
            {client.weights
              .slice(0, 30)
              .reverse()
              .map((w) => {
                const range = max - min || 1;
                const height = ((w.weight - min) / range) * 100;
                return (
                  <div
                    key={w.id}
                    className="flex-1 flex flex-col items-center gap-1"
                    title={`${w.weight} kg — ${new Date(w.date).toLocaleDateString()}`}
                  >
                    <span className="text-[9px] text-dark-muted">{w.weight}</span>
                    <div
                      className="w-full bg-gold rounded-t"
                      style={{ height: `${Math.max(15, height)}%` }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">
            Recent Exercises ({client.exercises.length})
          </h2>
          {client.exercises.length === 0 ? (
            <p className="text-dark-muted text-sm">No exercises logged.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {client.exercises.slice(0, 20).map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between py-1.5 border-b border-dark-border last:border-0"
                >
                  <div>
                    <span className="font-medium text-sm">{ex.name}</span>
                    <span className="text-xs text-gold ml-2">{ex.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ex.completedAt && (
                      <span className="text-green-400 text-xs">✓</span>
                    )}
                    <span className="text-xs text-dark-muted">
                      {new Date(ex.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">
            Recent Food Logs ({client.foodEntries.length})
          </h2>
          {client.foodEntries.length === 0 ? (
            <p className="text-dark-muted text-sm">No food logged.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {client.foodEntries.slice(0, 20).map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between py-1.5 border-b border-dark-border last:border-0"
                >
                  <div>
                    <span className="font-medium text-sm">{food.name}</span>
                    {food.mealType && (
                      <span className="text-xs text-dark-muted ml-2">
                        {food.mealType}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gold">
                    {food.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
