import Image from "next/image";
import Link from "next/link";
import React from "react";
import MotionWrapperDelay from "./FramerMotionStuff/MotionWrapperDelay";
import { Button } from "@nextui-org/button";

function Hero() {
  return (
    <div className="relative">
      <div className="px-10 md:px-28 lg:px-44 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="gradient-title font-extrabold text-[70px] py-10">
              Create Magical Stories For Children In Seconds
            </h2>

            <p className="text-2xl text-primary">
              Create fun and personalised stories that shall bring your family
              so much joy and inspiration from scratch
            </p>

            <Link href={"/create-story"}>
              <Button
                size="lg"
                color="primary"
                className="mt-5 font-bold text-2xl p-8"
              >
                Create Story
              </Button>
            </Link>
          </div>
          <div className="flex justify-center">
            <MotionWrapperDelay
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 3, delay: 0.2 }}
              variants={{
                hidden: { opacity: 0, x: 100 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <Image
                src={"/logo2.png"}
                alt="Hero"
                width={700}
                height={400}
                className=""
              />
            </MotionWrapperDelay>
          </div>
        </div>

        {/* Motion Wrapper for the Bottom Image */}
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 3, delay: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: -100 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {/* Center the image horizontally and push it below the other content */}
          <div className="flex justify-center mt-16 horizontal-rotate ">
            <Image
              src="/child.png"
              alt="Create Story"
              width={300}
              height={200}
            />
          </div>
        </MotionWrapperDelay>
      </div>
    </div>
  );
}

export default Hero;
