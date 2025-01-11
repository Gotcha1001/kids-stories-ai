"use client";
import FeatureMotionWrapper from "@/app/_components/FramerMotionStuff/FeatureMotionWrapper";
import Image from "next/image";
import React, { useState } from "react";

export interface OptionField {
  label: string;
  imageUrl: string;
  isFree: boolean;
}

function StoryType({ userSelection }: any) {
  const OptionList = [
    {
      label: "Story Book",
      imageUrl: "/story1.jpg",
      isFree: true,
    },
    {
      label: "Bed Story",
      imageUrl: "/story2.jpg",
      isFree: true,
    },
    {
      label: "Educational",
      imageUrl: "/story3.jpg",
      isFree: true,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string>();

  const onUserSelect = (item: OptionField) => {
    setSelectedOption(item.label);
    userSelection({
      fieldValue: item?.label,
      fieldName: "storyType",
    });
  };

  return (
    <div className="w-full">
      <label className="font-bold text-4xl gradient-title">2. Story Type</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
        {OptionList.map((item, index) => (
          <FeatureMotionWrapper key={index} index={index}>
            <div
              className={`relative grayscale hover:grayscale-0 cursor-pointer p-1 w-full ${
                selectedOption == item.label
                  ? "grayscale-0 border-2 rounded-3xl border-primary"
                  : "grayscale"
              }`}
              onClick={() => onUserSelect(item)}
            >
              <h2 className="absolute bottom-5 text-white font-bold text-center w-full text-2xl z-10 [text-shadow:_2px_2px_0_rgb(79_70_229),_-2px_-2px_0_rgb(79_70_229),_2px_-2px_0_rgb(79_70_229),_-2px_2px_0_rgb(79_70_229)]">
                {item.label}
              </h2>
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={item.imageUrl}
                  alt={item.label}
                  fill
                  className="object-cover rounded-3xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                />
              </div>
            </div>
          </FeatureMotionWrapper>
        ))}
      </div>
    </div>
  );
}

export default StoryType;
