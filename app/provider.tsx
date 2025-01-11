"use client";
import { NextUIProvider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import AnimatedBackground from "./_components/AnimatedBackground";
import MotionWrapperDelay from "./_components/FramerMotionStuff/MotionWrapperDelay";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "./_context/UserDetailContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetail, setUserDetail] = useState<any>();
  const currentYear = new Date().getFullYear();

  const { user } = useUser();

  useEffect(() => {
    user && saveNewUserIfNotExist();
  }, [user]);

  const saveNewUserIfNotExist = async () => {
    //check if the user exists or not
    const userResp = await db
      .select()
      .from(Users)
      .where(
        eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress ?? "")
      );
    console.log("Existing User:", userResp);

    // If not add the new user to the Data base
    if (!userResp[0]) {
      const result = await db
        .insert(Users)
        .values({
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userImage: user?.imageUrl,
          userName: user?.fullName,
        })
        .returning({
          userEmail: Users.userEmail,
          userName: Users.userName,
          userImage: Users.userImage,
          credits: Users.credit,
        });
      console.log("New User:", result[0]);
      setUserDetail(result[0]);
    } else {
      setUserDetail(userResp[0]);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "" }}
      >
        <NextUIProvider>
          <AnimatedBackground />
          <Header />
          <main className="relative z-10">
            {children}
            <ToastContainer
              theme="light"
              toastClassName="!bg-purple-700 !text-white"
              progressClassName="!bg-blue-500"
            />
          </main>
          <MotionWrapperDelay
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <footer className="relative z-10 bg-indigo-300 py-10 bg-opacity-10 gradient-background2 p-10">
              <div className="mx-auto px-4 text-center text-gray-200">
                <p>© {currentYear} CodeNow101. All Rights Reserved</p>
              </div>
            </footer>
          </MotionWrapperDelay>
        </NextUIProvider>
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
