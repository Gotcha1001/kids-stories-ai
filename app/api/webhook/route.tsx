// app/api/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Keep the original signature validation function unchanged
function validateITNSignature(data: any, receivedSignature: string): boolean {
  const { signature, ...dataWithoutSignature } = data;
  const notifyKeys = [
    "m_payment_id",
    "pf_payment_id",
    "payment_status",
    "item_name",
    "item_description",
    "amount_gross",
    "amount_fee",
    "amount_net",
    "custom_str1",
    "custom_str2",
    "custom_str3",
    "custom_str4",
    "custom_str5",
    "custom_int1",
    "custom_int2",
    "custom_int3",
    "custom_int4",
    "custom_int5",
    "name_first",
    "name_last",
    "email_address",
    "merchant_id",
  ];

  const pfParamString = notifyKeys
    .map((key) => {
      const value = dataWithoutSignature[key];
      if (value !== undefined) {
        return `${key}=${encodeURIComponent(String(value)).replace(
          /%20/g,
          "+"
        )}`;
      }
      return null;
    })
    .filter((item) => item !== null)
    .join("&");

  const passPhrase = process.env.PAYFAST_SALT_PASSPHRASE;
  const finalString = passPhrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(passPhrase)}`
    : pfParamString;

  const calculatedSignature = crypto
    .createHash("md5")
    .update(finalString)
    .digest("hex");

  console.log("Signature Validation Details:", {
    calculatedSignature,
    receivedSignature,
    match: calculatedSignature === receivedSignature,
  });

  return calculatedSignature === receivedSignature;
}

export async function POST(req: NextRequest) {
  console.log("🔵 PayFast Webhook Triggered");

  try {
    // Parse the raw body
    const rawBodyStr = await req.text();
    console.log("📥 Raw webhook payload:", rawBodyStr);

    // Parse the form data
    const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));
    console.log("🔍 Parsed PayFast data:", pfData);

    // Validate the signature
    const isValidSignature = validateITNSignature(pfData, pfData.signature);
    console.log("✅ Signature validation result:", isValidSignature);

    if (!isValidSignature) {
      console.error("❌ Invalid signature received");
      return NextResponse.json({ error: "Invalid signature" });
    }

    // Verify payment status
    console.log("💰 Payment status:", pfData.payment_status);
    if (pfData.payment_status !== "COMPLETE") {
      console.log(`⚠️ Payment not complete: ${pfData.payment_status}`);
      return NextResponse.json({ message: "Payment not complete" });
    }

    // Extract and validate user data
    const userEmail = pfData.custom_str1;
    const creditsToAdd = parseInt(pfData.custom_int1);

    console.log("👤 Processing update for:", {
      userEmail,
      creditsToAdd,
      paymentId: pfData.pf_payment_id,
    });

    if (!userEmail || isNaN(creditsToAdd)) {
      console.error("❌ Invalid data received:", { userEmail, creditsToAdd });
      return NextResponse.json({ error: "Invalid data" });
    }

    // Fetch current user data
    console.log("🔍 Fetching user data for:", userEmail);
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.userEmail, userEmail));

    if (users.length === 0) {
      console.error("❌ User not found in database:", userEmail);
      return NextResponse.json({ error: "User not found" });
    }

    const user = users[0];
    const currentCredit = user.credit ?? 0;
    const newCreditAmount = currentCredit + creditsToAdd;

    console.log("💳 Credit calculation:", {
      currentCredit,
      creditsToAdd,
      newCreditAmount,
    });

    // Update user credits
    console.log("📝 Updating user credits in database...");
    const updateResult = await db
      .update(Users)
      .set({ credit: newCreditAmount })
      .where(eq(Users.userEmail, userEmail));

    console.log("✅ Database update completed:", updateResult);

    // Return success response
    return NextResponse.json({
      message: "Credits updated successfully",
      data: {
        userEmail,
        creditsAdded: creditsToAdd,
        newTotal: newCreditAmount,
        paymentId: pfData.pf_payment_id,
      },
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
