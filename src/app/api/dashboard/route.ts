import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [user, latestWeight, weekAgoWeight, recentWeights, todayFood, todayExercises] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { goalWeight: true },
      }),
      prisma.weightEntry.findFirst({
        where: { userId },
        orderBy: { date: "desc" },
      }),
      prisma.weightEntry.findFirst({
        where: { userId, date: { lte: sevenDaysAgo } },
        orderBy: { date: "desc" },
      }),
      prisma.weightEntry.findMany({
        where: { userId, date: { gte: fourteenDaysAgo } },
        orderBy: { date: "asc" },
        take: 14,
      }),
      prisma.foodEntry.aggregate({
        where: { userId, date: { gte: today } },
        _sum: { calories: true },
      }),
      prisma.exerciseEntry.count({
        where: { userId, date: { gte: today } },
      }),
    ]);

  // Calculate streak
  let streak = 0;
  let checkDate = new Date(today);
  while (true) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate.getTime() + 24 * 60 * 60 * 1000);
    const hasEntry = await prisma.weightEntry.findFirst({
      where: { userId, date: { gte: dayStart, lt: dayEnd } },
    });
    if (!hasEntry && checkDate < today) break;
    if (hasEntry) streak++;
    checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    if (streak > 365) break;
  }

  return NextResponse.json({
    currentWeight: latestWeight?.weight || null,
    goalWeight: user?.goalWeight || null,
    weightChange7d:
      latestWeight && weekAgoWeight
        ? latestWeight.weight - weekAgoWeight.weight
        : null,
    streak,
    todayCalories: todayFood._sum.calories || 0,
    todayExercises,
    recentWeights: recentWeights.map((w) => ({
      date: w.date.toISOString(),
      weight: w.weight,
    })),
  });
}
