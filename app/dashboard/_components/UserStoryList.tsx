"use client";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import StoryItemCard from "./StoryItemCard";
import FeatureMotionWrapper from "@/app/_components/FramerMotionStuff/FeatureMotionWrapper";
import CustomLoader from "@/app/create-story/_components/CustomLoader";

export type StoryItemType = {
  id: number;
  ageGroup: string;
  coverImage: string;
  imageStyle: string;
  output: {
    title: string; // Add title directly under output
    coverImagePrompt: string;
    chapters: {
      title: string;
      description: string;
      textPrompt: string;
      imagePrompt: string;
    }[];
  };
  coverImagePrompt: string;
  storyId: string;
  storySubject: string;
  storyType: string;
  userEmail: string;
  userImage: string;
  userName: string;
};

function UserStoryList() {
  const { user } = useUser();
  const [storyList, setStoryList] = useState<StoryItemType[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && getUserStory();
  }, [user]);

  const getUserStory = async () => {
    setLoading(true);
    const result: any = await db
      .select()
      .from(StoryData)
      .where(
        eq(StoryData.userEmail, user?.primaryEmailAddress?.emailAddress ?? "")
      )
      .orderBy(desc(StoryData.id));
    console.log(result);
    setStoryList(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
      {storyList &&
        storyList.map((item: StoryItemType, index: number) => (
          <FeatureMotionWrapper key={index} index={index}>
            <StoryItemCard story={item} />
          </FeatureMotionWrapper>
        ))}
      {loading && <CustomLoader isLoading={loading} />}
    </div>
  );
}

export default UserStoryList;
