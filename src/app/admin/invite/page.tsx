"use client";

import { useState, useEffect } from "react";

interface Invitation {
  id: string;
  email: string;
  accepted: boolean;
  createdAt: string;
  expiresAt: string;
}

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const loadInvitations = () => {
    fetch("/api/admin/invitations")
      .then((r) => r.json())
      .then(setInvitations)
      .catch(() => {});
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Invitation sent to ${email}. Share this link: ${data.inviteUrl}`);
      setEmail("");
      loadInvitations();
    } else {
      setMessage(data.error || "Failed to send invitation");
    }
    setLoading(false);
  };

  const deleteInvite = async (id: string) => {
    await fetch(`/api/admin/invitations?id=${id}`, { method: "DELETE" });
    loadInvitations();
  };

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Invite <span className="text-gold">Clients</span>
      </h1>

      <div className="max-w-2xl">
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Send Invitation</h2>
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark flex-1"
              placeholder="client@example.com"
              required
            />
            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Invite"}
            </button>
          </form>
          {message && (
            <p className="mt-3 text-sm text-gold break-all">{message}</p>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Sent Invitations</h2>
          {invitations.length === 0 ? (
            <p className="text-dark-muted text-sm">No invitations sent yet.</p>
          ) : (
            <div className="space-y-2">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-2 border-b border-dark-border last:border-0"
                >
                  <div>
                    <span className="font-medium">{inv.email}</span>
                    <div className="flex gap-3 text-xs text-dark-muted mt-0.5">
                      <span>
                        Sent{" "}
                        {new Date(inv.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span
                        className={
                          inv.accepted ? "text-green-400" : "text-amber-500"
                        }
                      >
                        {inv.accepted ? "Accepted" : "Pending"}
                      </span>
                    </div>
                  </div>
                  {!inv.accepted && (
                    <button
                      onClick={() => deleteInvite(inv.id)}
                      className="text-dark-muted hover:text-red-500 text-sm"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
