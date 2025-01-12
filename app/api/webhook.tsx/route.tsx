import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  console.log("Webhook triggered");

  if (!req.body) {
    console.error("No request body provided");
    return NextResponse.json(
      { error: "No request body provided" },
      { status: 400 }
    );
  }

  try {
    const rawBodyStr = await req.text();
    console.log("Raw request body:", rawBodyStr);

    const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));
    console.log("Parsed PayFast data:", pfData);

    if (pfData.payment_status !== "COMPLETE") {
      console.log(`Payment status not complete: ${pfData.payment_status}`);
      return NextResponse.json({ message: "Payment not complete" });
    }

    const userEmail = pfData.custom_str1;
    const creditsToAdd = parseInt(pfData.custom_int1);

    if (!userEmail || isNaN(creditsToAdd)) {
      console.error("Invalid data:", { userEmail, creditsToAdd });
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.userEmail, userEmail));
    console.log("User query result:", users);

    if (users.length === 0) {
      console.error(`User not found: ${userEmail}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    const currentCredit = user.credit ?? 0;
    const newCreditAmount = currentCredit + creditsToAdd;

    console.log(
      `Updating credits for ${userEmail}: ${currentCredit} + ${creditsToAdd}`
    );
    const updateResult = await db
      .update(Users)
      .set({ credit: newCreditAmount })
      .where(eq(Users.userEmail, userEmail));
    console.log("Update result:", updateResult);

    return NextResponse.json({ message: "Credits updated successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
