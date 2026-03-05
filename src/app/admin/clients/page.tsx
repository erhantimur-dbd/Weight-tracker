"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Client {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  goalWeight: number | null;
  _count: {
    weights: number;
    exercises: number;
    foodEntries: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        All <span className="text-gold">Clients</span>
      </h1>

      {clients.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-dark-muted">No clients yet.</p>
          <Link
            href="/admin/invite"
            className="btn-gold inline-block mt-4"
          >
            Invite Your First Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="card hover:border-gold transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                {client.image ? (
                  <img
                    src={client.image}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                    {(client.name || client.email)[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {client.name || "Unnamed"}
                  </p>
                  <p className="text-xs text-dark-muted">{client.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-gold">
                    {client._count.weights}
                  </p>
                  <p className="text-[10px] text-dark-muted">Weigh-ins</p>
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {client._count.exercises}
                  </p>
                  <p className="text-[10px] text-dark-muted">Workouts</p>
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {client._count.foodEntries}
                  </p>
                  <p className="text-[10px] text-dark-muted">Food Logs</p>
                </div>
              </div>
              {client.goalWeight && (
                <p className="text-xs text-dark-muted mt-2">
                  Goal: {client.goalWeight} kg
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
