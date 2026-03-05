import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      goalWeight: true,
      _count: {
        select: {
          weights: true,
          exercises: true,
          foodEntries: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}
