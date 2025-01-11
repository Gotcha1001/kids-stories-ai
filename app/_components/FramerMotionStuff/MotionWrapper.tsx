"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionWrapperProps = {
  children: ReactNode;
};

const MotionWrapper = ({ children }: MotionWrapperProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.2,
        transition: { type: "spring", stiffness: 500, damping: 20 },
      }}
      whileTap={{
        scale: 0.9,
        transition: { type: "spring", stiffness: 500, damping: 20 },
      }}
      className="flex justify-center items-center" // Center the child content if necessary
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
