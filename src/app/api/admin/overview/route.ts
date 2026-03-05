import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      weights: { orderBy: { date: "desc" }, take: 7 },
      exercises: { where: { date: { gte: weekAgo } } },
      foodEntries: { where: { date: { gte: today } } },
    },
  });

  const pendingInvites = await prisma.invitation.count({
    where: { invitedById: session.user.id, accepted: false },
  });

  const clientData = clients.map((client) => {
    const lastWeight = client.weights[0];
    const lastActivity = [
      ...client.weights.map((w) => w.date),
      ...client.exercises.map((e) => e.date),
      ...client.foodEntries.map((f) => f.date),
    ].sort((a, b) => b.getTime() - a.getTime())[0];

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      image: client.image,
      lastWeight: lastWeight?.weight || null,
      lastActive: lastActivity?.toISOString() || null,
      streak: 0,
      weightsThisWeek: client.weights.filter(
        (w) => w.date >= weekAgo
      ).length,
      exercisesThisWeek: client.exercises.length,
      foodLogsToday: client.foodEntries.length,
    };
  });

  const activeToday = clientData.filter(
    (c) =>
      c.lastActive &&
      new Date(c.lastActive).toDateString() === today.toDateString()
  ).length;

  const totalWithActivity = clientData.filter(
    (c) => c.weightsThisWeek > 0 || c.exercisesThisWeek > 0
  ).length;
  const avgCompliance = clients.length
    ? Math.round((totalWithActivity / clients.length) * 100)
    : 0;

  return NextResponse.json({
    totalClients: clients.length,
    activeToday,
    avgCompliance,
    pendingInvites,
    clients: clientData,
  });
}
