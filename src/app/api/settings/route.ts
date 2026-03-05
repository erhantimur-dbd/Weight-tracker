import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [notifications, user] = await Promise.all([
    prisma.notificationSettings.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { goalWeight: true },
    }),
  ]);

  return NextResponse.json({
    morningTime: notifications?.morningTime || "08:00",
    eveningTime: notifications?.eveningTime || "19:00",
    enabled: notifications?.enabled ?? true,
    weighInReminder: notifications?.weighInReminder ?? true,
    mealReminder: notifications?.mealReminder ?? true,
    workoutReminder: notifications?.workoutReminder ?? true,
    goalWeight: user?.goalWeight || null,
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await Promise.all([
    prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      update: {
        morningTime: body.morningTime,
        eveningTime: body.eveningTime,
        enabled: body.enabled,
        weighInReminder: body.weighInReminder,
        mealReminder: body.mealReminder,
        workoutReminder: body.workoutReminder,
      },
      create: {
        userId: session.user.id,
        morningTime: body.morningTime,
        eveningTime: body.eveningTime,
        enabled: body.enabled,
        weighInReminder: body.weighInReminder,
        mealReminder: body.mealReminder,
        workoutReminder: body.workoutReminder,
      },
    }),
    body.goalWeight !== undefined
      ? prisma.user.update({
          where: { id: session.user.id },
          data: { goalWeight: body.goalWeight },
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
