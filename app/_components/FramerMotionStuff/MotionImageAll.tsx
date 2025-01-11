// components/MotionImageAll.tsx
"use client"; // Ensures this component runs on the client side

import { motion } from "framer-motion";
import Image from "next/image";

interface MotionImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const MotionImageAll: React.FC<MotionImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }} // Scale effect on hover
      whileTap={{ scale: 0.95 }} // Scale effect on tap
      transition={{ type: "spring", stiffness: 300 }} // Spring transition
      className={`w-full flex justify-center items-center ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full max-h-[600px] object-contain rounded-md"
      />
    </motion.div>
  );
};

export default MotionImageAll;
