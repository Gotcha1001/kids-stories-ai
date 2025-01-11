import { NextApiRequest, NextApiResponse } from "next";
import rawBody from "raw-body";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const buf = await rawBody(req);
  const rawBodyStr = buf.toString("utf8");
  const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));

  // Log the received data
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

      return res.status(200).send("OK");
    } catch (error) {
      console.error("Error updating credits:", error);
      return res.status(500).json({ message: "Error updating credits" });
    }
  }

  return res.status(200).send("OK");
}
