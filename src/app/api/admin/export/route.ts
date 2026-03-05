import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = req.nextUrl.searchParams.get("clientId");
  const type = req.nextUrl.searchParams.get("type") || "weight";

  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  let csv = "";

  if (type === "weight" || type === "all") {
    const weights = await prisma.weightEntry.findMany({
      where: { userId: clientId },
      orderBy: { date: "desc" },
    });
    csv += "Date,Weight (kg),Notes\n";
    weights.forEach((w) => {
      csv += `${w.date.toISOString().split("T")[0]},${w.weight},"${w.notes || ""}"\n`;
    });
    if (type === "all") csv += "\n";
  }

  if (type === "exercise" || type === "all") {
    const exercises = await prisma.exerciseEntry.findMany({
      where: { userId: clientId },
      orderBy: { date: "desc" },
    });
    if (type === "all") csv += "--- Exercise Log ---\n";
    csv += "Date,Name,Type,Sets,Reps,Weight (kg),Duration (min),Calories,Completed,Notes\n";
    exercises.forEach((e) => {
      csv += `${e.date.toISOString().split("T")[0]},${e.name},${e.type},${e.sets || ""},${e.reps || ""},${e.weight || ""},${e.duration || ""},${e.calories || ""},${e.completedAt ? "Yes" : "No"},"${e.notes || ""}"\n`;
    });
    if (type === "all") csv += "\n";
  }

  if (type === "food" || type === "all") {
    const food = await prisma.foodEntry.findMany({
      where: { userId: clientId },
      orderBy: { date: "desc" },
    });
    if (type === "all") csv += "--- Food Log ---\n";
    csv += "Date,Name,Meal,Calories,Protein (g),Carbs (g),Fat (g)\n";
    food.forEach((f) => {
      csv += `${f.date.toISOString().split("T")[0]},${f.name},${f.mealType || ""},${f.calories},${f.protein || ""},${f.carbs || ""},${f.fat || ""}\n`;
    });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-export.csv"`,
    },
  });
}
