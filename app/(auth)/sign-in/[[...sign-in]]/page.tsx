import MotionWrapperDelay from "@/app/_components/FramerMotionStuff/MotionWrapperDelay";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid=cols-1 md:grid-cols-2 ">
      <div className="">
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <Image
            src="/loginImage.png"
            alt="Login-Image"
            height={1000}
            width={700}
            className="w-full"
          />
        </MotionWrapperDelay>
      </div>
      <div className="flex justify-center items-center h-screen order-first md:order-last">
        <SignIn />
      </div>
    </div>
  );
}
