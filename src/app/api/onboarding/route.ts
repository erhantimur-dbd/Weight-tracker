import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await Promise.all([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboarded: true,
        goalWeight: body.goalWeight || null,
      },
    }),
    prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      update: {
        morningTime: body.morningTime || "08:00",
        eveningTime: body.eveningTime || "19:00",
        weighInReminder: body.weighInReminder ?? true,
        mealReminder: body.mealReminder ?? true,
        workoutReminder: body.workoutReminder ?? true,
      },
      create: {
        userId: session.user.id,
        morningTime: body.morningTime || "08:00",
        eveningTime: body.eveningTime || "19:00",
        weighInReminder: body.weighInReminder ?? true,
        mealReminder: body.mealReminder ?? true,
        workoutReminder: body.workoutReminder ?? true,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
