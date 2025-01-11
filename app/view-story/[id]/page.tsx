"use client";
import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import BookCoverPage from "../_components/BookCoverPage";
import StoryPages from "../_components/StoryPages";
import LastPage from "../_components/LastPage";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { eq } from "drizzle-orm";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

function ViewStory({ params }: any) {
  const [story, setStory] = useState<any>();
  const [bookDimensions, setBookDimensions] = useState({
    width: 650,
    height: 867,
    usePortrait: false,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<typeof HTMLFlipBook | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setBookDimensions({
          width: Math.min(screenWidth - 40, 400),
          height: Math.min(((screenWidth - 40) * 4) / 3, 533),
          usePortrait: true,
        });
      } else if (screenWidth < 768) {
        setBookDimensions({
          width: (screenWidth - 100) / 2,
          height: (((screenWidth - 100) / 2) * 4) / 3,
          usePortrait: false,
        });
      } else if (screenWidth < 1024) {
        setBookDimensions({
          width: (screenWidth - 140) / 2,
          height: (((screenWidth - 140) / 2) * 4) / 3,
          usePortrait: false,
        });
      } else {
        setBookDimensions({
          width: 600,
          height: 650,
          usePortrait: false,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getStory();
  }, []);

  useEffect(() => {
    if (story?.output?.chapters) {
      // Add 2 to account for cover and last page
      setTotalPages(story.output.chapters.length + 2);
    }
  }, [story]);

  const getStory = async () => {
    const result = await db
      .select()
      .from(StoryData)
      .where(eq(StoryData.storyId, params.id));
    setStory(result[0]);
  };

  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const { coverImage, output } = story;
  const { title, chapters } = output || {};

  return (
    <div className="min-h-screen px-5 sm:px-8 md:px-10 lg:px-20 py-10">
      <h2 className="gradient-title font-bold text-2xl sm:text-3xl md:text-4xl text-center font-sans mb-10">
        {title}
      </h2>

      <div className="flex justify-center items-center">
        {coverImage && chapters && (
          <div className="relative flex justify-center w-full">
            {/* @ts-ignore */}
            <HTMLFlipBook
              width={bookDimensions.width}
              height={bookDimensions.height}
              showCover={true}
              className="shadow-lg"
              usePortrait={bookDimensions.usePortrait}
              startPage={0}
              size="fixed"
              minWidth={bookDimensions.width}
              maxWidth={bookDimensions.width}
              minHeight={bookDimensions.height}
              maxHeight={bookDimensions.height}
              drawShadow={true}
              flippingTime={1000}
              useMouseEvents={false}
              onFlip={handlePageFlip}
              ref={bookRef}
            >
              <div className="bg-slate-200 border h-full rounded-lg">
                <BookCoverPage
                  imageUrl={coverImage}
                  width={bookDimensions.width}
                  height={bookDimensions.height}
                />
              </div>

              {chapters.map((chapter: any, index: number) => (
                <div
                  key={index}
                  className="bg-slate-200 border h-full rounded-lg"
                  style={{
                    padding: `${Math.max(30, bookDimensions.width * 0.06)}px`,
                    width: bookDimensions.width,
                    height: bookDimensions.height,
                  }}
                >
                  <StoryPages storyChapters={chapter} />
                </div>
              ))}

              <div className="bg-slate-200 border h-full rounded-lg">
                <LastPage />
              </div>
            </HTMLFlipBook>
            {currentPage < totalPages - 1 && (
              <button
                className="absolute top-1/2 -translate-y-1/2 sm:right-2 -right-6 lg:-right-4 z-10"
                onClick={() => {
                  if (bookRef.current) {
                    (bookRef.current as any)?.pageFlip().flipNext();
                  }
                }}
              >
                <IoIosArrowDroprightCircle className="text-[40px] text-primary cursor-pointer hover:scale-110 transition-transform zoom" />
              </button>
            )}
            {currentPage > 0 && (
              <button
                className="absolute top-1/2 -translate-y-1/2 sm:left-2 -left-6 lg:-left-4 z-10"
                onClick={() => {
                  if (bookRef.current) {
                    (bookRef.current as any)?.pageFlip().flipPrev();
                  }
                }}
              >
                <IoIosArrowDropleftCircle className="text-[40px] text-primary cursor-pointer hover:scale-110 transition-transform zoom" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStory;
