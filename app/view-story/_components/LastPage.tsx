import { Button } from "@nextui-org/button";
import { FaShareAlt, FaCopy } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface ShareData {
  url: string;
  title: string;
  text: string;
}

const LastPage: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const shareUrl = id
    ? `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/view-story/${id}`
    : "";

  const openShareWindow = (url: string): void => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},left=${left},top=${top}`;
    window.open(url, "share", params);
  };

  const shareData: ShareData = {
    url: shareUrl,
    title: "Check out this story!",
    text: "I found this interesting story",
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlers = {
    facebook: (): void => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      openShareWindow(url);
    },
    twitter: (): void => {
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareData.text)}`;
      openShareWindow(url);
    },
    linkedin: (): void => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`;
      openShareWindow(url);
    },
    whatsapp: (): void => {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareData.text + " " + shareUrl
      )}`;
      openShareWindow(url);
    },
    telegram: (): void => {
      const url = `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareData.text)}`;
      openShareWindow(url);
    },
    pinterest: (): void => {
      const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        shareUrl
      )}&description=${encodeURIComponent(shareData.text)}`;
      openShareWindow(url);
    },
    reddit: (): void => {
      const url = `https://reddit.com/submit?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareData.title)}`;
      openShareWindow(url);
    },
    email: (): void => {
      const url = `mailto:?subject=${encodeURIComponent(
        shareData.title
      )}&body=${encodeURIComponent(shareData.text + " " + shareUrl)}`;
      window.location.href = url;
    },
  };

  return (
    <div className="relative bg-[#f3e2b3] p-12 rounded-lg shadow-xl h-full overflow-hidden">
      {/* Burnt edges effect */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[#2e1b12] to-transparent opacity-60 z-0"></div>

      {/* Content container */}
      <div className="relative z-10">
        <h2 className="text-center text-4xl text-[#3a0a00] font-extrabold mb-8 tracking-wide">
          The End
        </h2>
        <div className="flex flex-col items-center gap-6">
          {/* Share and Copy Buttons */}
          <div className="flex gap-4">
            {/* <Button
              size="lg"
              className="bg-white text-[#3a0a00] hover:bg-opacity-90 transition duration-300 transform hover:scale-105"
              onClick={copyToClipboard}
            >
              <FaCopy className="mr-2" />
              {copySuccess ? "Copied!" : "Copy Link"}
            </Button> */}
            {typeof navigator !== "undefined" && navigator.share && (
              <Button
                size="lg"
                className="bg-white text-[#3a0a00] hover:bg-opacity-90 transition duration-300 transform hover:scale-105"
                onClick={() => navigator.share(shareData)}
              >
                <FaShareAlt className="mr-2" />
                Share Story
              </Button>
            )}
          </div>

          {/* Social Media Share Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-[#1877f2] text-white hover:bg-opacity-90"
              onClick={handlers.facebook}
            >
              Facebook
            </Button>
            <Button
              className="bg-[#1da1f2] text-white hover:bg-opacity-90"
              onClick={handlers.twitter}
            >
              Twitter
            </Button>
            <Button
              className="bg-[#25d366] text-white hover:bg-opacity-90"
              onClick={handlers.whatsapp}
            >
              WhatsApp
            </Button>
            <Button
              className="bg-[#0088cc] text-white hover:bg-opacity-90"
              onClick={handlers.telegram}
            >
              Telegram
            </Button>
            <Button
              className="bg-[#0077b5] text-white hover:bg-opacity-90"
              onClick={handlers.linkedin}
            >
              LinkedIn
            </Button>
            <Button
              className="bg-[#E60023] text-white hover:bg-opacity-90"
              onClick={handlers.pinterest}
            >
              Pinterest
            </Button>
            <Button
              className="bg-[#FF4500] text-white hover:bg-opacity-90"
              onClick={handlers.reddit}
            >
              Reddit
            </Button>
            <Button
              className="bg-gray-600 text-white hover:bg-opacity-90"
              onClick={handlers.email}
            >
              Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastPage;
