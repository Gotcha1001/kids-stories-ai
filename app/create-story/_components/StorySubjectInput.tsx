import MotionWrapperDelay from "@/app/_components/FramerMotionStuff/MotionWrapperDelay";
import { Textarea } from "@nextui-org/input";
import React from "react";

function StorySubjectInput({ userSelection }: any) {
  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      variants={{
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div>
        <label className="font-bold text-4xl gradient-title">
          1. Subject Of The Story
        </label>
        <Textarea
          placeholder="Write the Subject of the Story that you want to generate"
          size="lg"
          classNames={{
            input: "resize-y min-h-[230px] text-2xl p-5",
          }}
          className="mt-3 max-w-lg"
          onChange={(e) =>
            userSelection({
              fieldValue: e.target.value,
              fieldName: "storySubject",
            })
          }
        />
      </div>
    </MotionWrapperDelay>
  );
}

export default StorySubjectInput;
