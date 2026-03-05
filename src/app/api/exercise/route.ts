import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.exerciseEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 50,
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const entry = await prisma.exerciseEntry.create({
    data: {
      userId: session.user.id,
      name: body.name,
      type: body.type,
      duration: body.duration,
      calories: body.calories,
      sets: body.sets,
      reps: body.reps,
      weight: body.weight,
      notes: body.notes,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, completed } = await req.json();

  await prisma.exerciseEntry.updateMany({
    where: { id, userId: session.user.id },
    data: { completedAt: completed ? new Date() : null },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.exerciseEntry.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
