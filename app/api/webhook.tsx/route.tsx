import { NextRequest, NextResponse } from "next/server";
import rawBody from "raw-body";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { error: "No request body provided" },
      { status: 400 }
    );
  }

  try {
    const rawBodyStr = await req.text(); // Retrieve raw body as a string
    const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));

    // Log the received data
    console.log("Received PayFast notification:", pfData);

    if (pfData.payment_status === "COMPLETE") {
      const userEmail = pfData.custom_str1;
      const creditsToAdd = parseInt(pfData.custom_int1);

      const user = await db
        .select()
        .from(Users)
        .where(eq(Users.userEmail, userEmail));

      if (user.length > 0) {
        const currentCredit = user[0].credit ?? 0;
        await db
          .update(Users)
          .set({ credit: currentCredit + creditsToAdd })
          .where(eq(Users.userEmail, userEmail));
        console.log(`Credits updated for user ${userEmail}: +${creditsToAdd}`);
      }

      return NextResponse.json({ message: "Credits updated successfully" });
    }

    return NextResponse.json({ message: "Notification received" });
  } catch (error) {
    console.error("Error processing PayFast notification:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
