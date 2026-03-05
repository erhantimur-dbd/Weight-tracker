import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invitations = await prisma.invitation.findMany({
    where: { invitedById: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invitations);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const existing = await prisma.invitation.findFirst({
    where: { email, invitedById: session.user.id, accepted: false },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Invitation already pending for this email" },
      { status: 400 }
    );
  }

  const invitation = await prisma.invitation.create({
    data: {
      email,
      invitedById: session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/invite/${invitation.token}`;

  return NextResponse.json({ ok: true, inviteUrl, id: invitation.id });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.invitation.deleteMany({
    where: { id, invitedById: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
