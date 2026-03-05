import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const client = await prisma.user.findUnique({
    where: { id, role: "CLIENT" },
    include: {
      weights: { orderBy: { date: "desc" }, take: 30 },
      exercises: { orderBy: { date: "desc" }, take: 30 },
      foodEntries: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Calculate streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate.getTime() + 24 * 60 * 60 * 1000);
    const hasEntry = client.weights.some(
      (w) => w.date >= dayStart && w.date < dayEnd
    );
    if (!hasEntry && checkDate < today) break;
    if (hasEntry) streak++;
    checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
  }

  return NextResponse.json({
    id: client.id,
    name: client.name,
    email: client.email,
    image: client.image,
    goalWeight: client.goalWeight,
    createdAt: client.createdAt,
    streak,
    weights: client.weights,
    exercises: client.exercises,
    foodEntries: client.foodEntries,
  });
}
