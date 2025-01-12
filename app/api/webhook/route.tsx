// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Function to validate PayFast signature for ITN (Instant Transaction Notification)
function validateITNSignature(data: any, receivedSignature: string): boolean {
  // Create a new object without the signature field
  const { signature, ...dataWithoutSignature } = data;

  // Define required keys in PayFast's order for the notify URL
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

  // Build parameter string in PayFast's exact order
  const pfParamString = notifyKeys
    .map((key) => {
      const value = dataWithoutSignature[key];
      // Only include parameters that are actually present in the data
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

  // Add passphrase if set
  const passPhrase = process.env.PAYFAST_SALT_PASSPHRASE;
  const finalString = passPhrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(passPhrase)}`
    : pfParamString;

  // Calculate signature
  const calculatedSignature = crypto
    .createHash("md5")
    .update(finalString)
    .digest("hex");

  console.log("ITN Validation Details:", {
    pfParamString: finalString,
    calculatedSignature,
    receivedSignature,
  });

  return calculatedSignature === receivedSignature;
}

export async function POST(req: NextRequest) {
  console.log("Webhook triggered");

  try {
    // Parse the raw body
    const rawBodyStr = await req.text();
    console.log("Raw request body:", rawBodyStr);

    // Parse the form data
    const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));
    console.log("Parsed PayFast data:", pfData);

    // Validate the signature
    const isValidSignature = validateITNSignature(pfData, pfData.signature);
    console.log("Signature validation result:", isValidSignature);

    if (!isValidSignature) {
      console.error("Invalid signature");
      // Still return 200 as per PayFast docs, but don't process the payment
      return NextResponse.json({ error: "Invalid signature" });
    }

    // Verify payment status
    if (pfData.payment_status !== "COMPLETE") {
      console.log(`Payment status not complete: ${pfData.payment_status}`);
      return NextResponse.json({ message: "Payment not complete" });
    }

    // Extract user data
    const userEmail = pfData.custom_str1;
    const creditsToAdd = parseInt(pfData.custom_int1);

    if (!userEmail || isNaN(creditsToAdd)) {
      console.error("Invalid data:", { userEmail, creditsToAdd });
      return NextResponse.json({ error: "Invalid data" });
    }

    // Update user credits
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.userEmail, userEmail));

    if (users.length === 0) {
      console.error(`User not found: ${userEmail}`);
      return NextResponse.json({ error: "User not found" });
    }

    const user = users[0];
    const currentCredit = user.credit ?? 0;
    const newCreditAmount = currentCredit + creditsToAdd;

    await db
      .update(Users)
      .set({ credit: newCreditAmount })
      .where(eq(Users.userEmail, userEmail));

    // Always return 200 status for PayFast
    return NextResponse.json({
      message: "Credits updated successfully",
      data: {
        userEmail,
        creditsAdded: creditsToAdd,
        newTotal: newCreditAmount,
      },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return 200 as per PayFast docs
    return NextResponse.json({ error: "Internal server error" });
  }
}
