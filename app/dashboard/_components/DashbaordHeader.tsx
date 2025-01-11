"use client";
import MotionWrapperDelay from "@/app/_components/FramerMotionStuff/MotionWrapperDelay";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

function DashbaordHeader() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      variants={{
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <div className="p-7 bg-primary rounded-lg  text-white flex justify-between items-center">
        <h2 className="font-bold text-4xl gradient-title">My Stories</h2>
        <div className="flex gap-3 items-center">
          <Image
            src={"/coin.png"}
            alt="Coin"
            height={60}
            width={60}
            className="animate-pulse"
          />
          <span className="text-2xl">{userDetail?.credit} Credits Left</span>
          <Link href={"/buy-credits"}>
            <Button color="secondary" className="gradient-background2">
              Buy More Credits
            </Button>
          </Link>
        </div>
      </div>
    </MotionWrapperDelay>
  );
}

export default DashbaordHeader;
