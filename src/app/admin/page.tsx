"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminData {
  totalClients: number;
  activeToday: number;
  avgCompliance: number;
  pendingInvites: number;
  clients: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    lastWeight: number | null;
    lastActive: string | null;
    streak: number;
    weightsThisWeek: number;
    exercisesThisWeek: number;
    foodLogsToday: number;
  }[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Coach <span className="text-gold">Dashboard</span>
        </h1>
        <p className="text-dark-muted mt-1">
          Monitor your clients&apos; progress and accountability
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Total Clients
          </p>
          <p className="text-2xl font-bold text-gold">
            {data?.totalClients || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Active Today
          </p>
          <p className="text-2xl font-bold">{data?.activeToday || 0}</p>
        </div>
        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Avg Compliance
          </p>
          <p className="text-2xl font-bold">
            {data?.avgCompliance || 0}%
          </p>
        </div>
        <div className="card">
          <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">
            Pending Invites
          </p>
          <p className="text-2xl font-bold">{data?.pendingInvites || 0}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Client Overview</h2>
          <Link href="/admin/invite" className="btn-gold text-sm px-4 py-2">
            Invite Client
          </Link>
        </div>

        {!data?.clients?.length ? (
          <p className="text-dark-muted text-sm">
            No clients yet.{" "}
            <Link href="/admin/invite" className="text-gold hover:underline">
              Invite your first client
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-dark-muted text-left">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Streak</th>
                  <th className="pb-3 font-medium">Weigh-ins</th>
                  <th className="pb-3 font-medium">Workouts</th>
                  <th className="pb-3 font-medium">Food Logs</th>
                  <th className="pb-3 font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {data.clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-dark-border last:border-0"
                  >
                    <td className="py-3">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="flex items-center gap-2 hover:text-gold transition-colors"
                      >
                        {client.image ? (
                          <img
                            src={client.image}
                            alt=""
                            className="w-7 h-7 rounded-full"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                            {(client.name || client.email)[0].toUpperCase()}
                          </div>
                        )}
                        <span>{client.name || client.email}</span>
                      </Link>
                    </td>
                    <td className="py-3">
                      {client.lastWeight
                        ? `${client.lastWeight} kg`
                        : "—"}
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          client.streak > 0 ? "text-gold" : "text-dark-muted"
                        }
                      >
                        {client.streak}d
                      </span>
                    </td>
                    <td className="py-3">{client.weightsThisWeek}/7</td>
                    <td className="py-3">{client.exercisesThisWeek}</td>
                    <td className="py-3">{client.foodLogsToday}</td>
                    <td className="py-3 text-dark-muted">
                      {client.lastActive
                        ? new Date(client.lastActive).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short" }
                          )
                        : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
