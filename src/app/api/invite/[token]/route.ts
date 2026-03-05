import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation || invitation.accepted || invitation.expiresAt < new Date()) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, email: invitation.email });
}
