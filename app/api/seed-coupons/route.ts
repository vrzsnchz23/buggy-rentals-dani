import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.coupon.count();
  if (existing > 0) return NextResponse.json({ message: "Coupons already seeded", count: existing });

  await db.coupon.createMany({
    data: [
      {
        partnerName: "Banana Beach Club",
        title: "Free Entry",
        description: "Enjoy complimentary beach access at Banana Beach Club, one of Cozumel's most beautiful beach clubs on the east side. Show this screen at the entrance.",
        imageEmoji: "🍌",
        active: true,
        sortOrder: 1,
      },
      {
        partnerName: "Sabores de Cozumel",
        title: "Tequila Tasting + Chocolate & Maiz",
        description: "Experience an authentic Cozumel tasting session: premium tequila shots paired with traditional chocolate and maiz. An unforgettable Mexican cultural experience. Show this screen at Sabores.",
        imageEmoji: "🌮",
        active: true,
        sortOrder: 2,
      },
    ],
  });

  return NextResponse.json({ message: "Partner coupons seeded successfully!" });
}
