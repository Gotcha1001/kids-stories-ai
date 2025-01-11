import { NextRequest, NextResponse } from "next/server";
import rawBody from "raw-body";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const buf = await rawBody(req.body);
  const rawBodyStr = buf.toString("utf8");
  const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));

  console.log("Received PayFast notification:", pfData);

  if (pfData.payment_status === "COMPLETE") {
    const userEmail = pfData.custom_str1;
    const creditsToAdd = parseInt(pfData.custom_int1);

    try {
      const user = await db
        .select()
        .from(Users)
        .where(eq(Users.userEmail, userEmail));

      if (user.length > 0) {
        const currentCredit = user[0].credit ?? 0;
        await db
          .update(Users)
          .set({
            credit: currentCredit + creditsToAdd,
          })
          .where(eq(Users.userEmail, userEmail));
        console.log(`Credits updated for user ${userEmail}: +${creditsToAdd}`);
      }

      return NextResponse.json({ message: "Credits updated successfully" });
    } catch (error) {
      console.error("Error updating credits:", error);
      return NextResponse.json(
        { message: "Error updating credits" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Notification received" });
}
