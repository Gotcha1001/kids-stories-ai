import Image from "next/image";
import React from "react";

function BookCoverPage({
  imageUrl,
  width,
  height,
}: {
  imageUrl: string;
  width: number;
  height: number;
}) {
  console.log(imageUrl);
  return (
    <div style={{ width, height }} className="relative">
      <Image
        src={imageUrl}
        alt="Cover Image"
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
    </div>
  );
}

export default BookCoverPage;
