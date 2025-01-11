"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import MotionWrapperDelay from "../_components/FramerMotionStuff/MotionWrapperDelay";
import StorySubjectInput from "./_components/StorySubjectInput";
import StoryType from "./_components/StoryType";
import AgeGroup from "./_components/AgeGroup";
import ImageStyle from "./_components/ImageStyle";
import { Button } from "@nextui-org/button";
import { chatSession } from "@/config/GeminiAi";
import { db } from "@/config/db";
import { StoryData, Users } from "@/config/schema";
import uuid4 from "uuid4";
import CustomLoader from "./_components/CustomLoader";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "../_context/UserDetailContext";
import { eq } from "drizzle-orm";

const CREATE_STORY_PROMPT = process.env.NEXT_PUBLIC_CREATE_STORY_PROMPT;

export interface fieldData {
  fieldName: string;
  fieldValue: string;
}

export interface formDataType {
  storySubject: string;
  storyType: string;
  imageStyle: string;
  ageGroup: string;
}

function CreateStory() {
  const [formData, setFormData] = useState<formDataType>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useUser();
  const notify = (msg: string) => toast(msg);
  const notifyError = (msg: string) => toast.error(msg);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  //use to add data to the form
  const onHandleUserSelection = (data: fieldData) => {
    setFormData((prev: any) => ({
      ...prev,
      [data.fieldName]: data.fieldValue,
    }));
    console.log(formData);
  };

  const GenerateStory = async () => {
    if (userDetail.credit <= 0) {
      notifyError("You dont have enough credits!");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = CREATE_STORY_PROMPT?.replace(
      "{ageGroup}",
      formData?.ageGroup ?? ""
    )
      .replace("{storyType}", formData?.storyType ?? "")
      .replace("{storySubject}", formData?.storySubject ?? "")
      .replace("{imageStyle}", formData?.imageStyle ?? "");

    //1. Generate AI story

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const story = JSON.parse(result?.response.text());

      //Generate Image
      const imageResp = await axios.post("/api/generate-image", {
        prompt:
          "Add text with title: " +
          story?.title +
          " in bold text for book cover," +
          story?.coverImagePrompt,
      });
      const AiImageUrl = imageResp?.data?.imageUrl;

      // save the image
      const imageResult = await axios.post("/api/save-image", {
        url: AiImageUrl,
      });

      const FirebaseStorageImageUrl = imageResult.data.imageUrl;

      console.log(result?.response.text());

      const resp = await SaveInDb(
        result?.response.text(),
        FirebaseStorageImageUrl
      );
      console.log(resp);

      if (resp && resp.length > 0) {
        notify("Story Generated");
        await UpdateUserCredits();
        router?.replace("/view-story/" + resp[0].storyId);
      } else {
        console.error("No response from SaveInDb");
      }

      setLoading(false);
    } catch (error) {
      notifyError("Server Error, Try Again...");
      setLoading(false);
    }
  };

  //2. Save In DB
  const SaveInDb = async (output: string, imageUrl: string) => {
    const recordId = uuid4();
    setLoading(true);
    try {
      const result = await db
        .insert(StoryData)
        .values({
          storyId: recordId,
          ageGroup: formData?.ageGroup,
          imageStyle: formData?.imageStyle,
          storySubject: formData?.storySubject,
          storyType: formData?.storyType,
          output: JSON.parse(output),
          coverImage: imageUrl,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userImage: user?.imageUrl,
          userName: user?.fullName,
        })
        .returning({ storyId: StoryData?.storyId });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
    }
  };

  const UpdateUserCredits = async () => {
    const result = await db
      .update(Users)
      .set({
        credit: Number(userDetail?.credit - 1),
      })
      .where(
        eq(Users?.userEmail, user?.primaryEmailAddress?.emailAddress ?? "")
      )
      .returning({ id: Users.id });
  };

  return (
    <div className="min-h-screen">
      <div className="p-10 md:px-20 lg:px-40 mt-5">
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
          <h2 className="font-extrabold text-[70px] text-primary text-center">
            Create Your Story
          </h2>
        </MotionWrapperDelay>
        <p className="text-center text-2xl">
          Unlock your creativity with AI: Craft Stories Like Never Before With
          Simplicity and Ease
        </p>
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
          <div className="flex justify-center mt-10 horizontal-rotate">
            <Image
              src="/child.png"
              alt="Create Story"
              width={300}
              height={200}
            />
          </div>
        </MotionWrapperDelay>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
          {/* Story subject */}
          <StorySubjectInput userSelection={onHandleUserSelection} />
          {/* Story Type */}
          <StoryType userSelection={onHandleUserSelection} />
          {/* Age Group */}
          <AgeGroup userSelection={onHandleUserSelection} />
          {/* Image Style */}
          <ImageStyle userSelection={onHandleUserSelection} />
        </div>
        <div className="flex justify-center md:justify-end my-10 flex-col  items-center">
          <Button
            disabled={loading}
            onClick={GenerateStory}
            color="primary"
            className={`p-10 text-2xl ${loading ? "animate-pulse" : ""}`}
          >
            {loading ? "Generating..." : "Generate Story"}
          </Button>
          <span>1 Credit Per Story </span>
        </div>
        <CustomLoader isLoading={loading} />
      </div>
    </div>
  );
}

export default CreateStory;
