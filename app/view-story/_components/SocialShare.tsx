import { Button } from "@nextui-org/button";
import { FaShareAlt } from "react-icons/fa";
import React from "react";

interface ShareData {
  url: string;
  title: string;
  text: string;
}

const SocialShare: React.FC = () => {
  const shareData: ShareData = {
    url: typeof window !== "undefined" ? window.location.href : "",
    title: "Check out this story!",
    text: "I found this interesting story",
  };

  // Generic share function with type safety
  const openShareWindow = (url: string): void => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},left=${left},top=${top}`;
    window.open(url, "share", params);
  };

  // Share handlers for different platforms
  const handlers = {
    facebook: (): void => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareData.url
      )}`;
      openShareWindow(url);
    },
    twitter: (): void => {
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareData.url
      )}&text=${encodeURIComponent(shareData.text)}`;
      openShareWindow(url);
    },
    linkedin: (): void => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareData.url
      )}`;
      openShareWindow(url);
    },
    telegram: (): void => {
      const url = `https://t.me/share/url?url=${encodeURIComponent(
        shareData.url
      )}&text=${encodeURIComponent(shareData.text)}`;
      openShareWindow(url);
    },
    whatsapp: (): void => {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareData.text + " " + shareData.url
      )}`;
      openShareWindow(url);
    },
    pinterest: (): void => {
      const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        shareData.url
      )}&description=${encodeURIComponent(shareData.text)}`;
      openShareWindow(url);
    },
    reddit: (): void => {
      const url = `https://reddit.com/submit?url=${encodeURIComponent(
        shareData.url
      )}&title=${encodeURIComponent(shareData.title)}`;
      openShareWindow(url);
    },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Share this story</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          onClick={handlers.facebook}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Facebook
        </Button>
        <Button
          onClick={handlers.twitter}
          className="bg-sky-500 hover:bg-sky-600 text-white"
        >
          Twitter
        </Button>
        <Button
          onClick={handlers.whatsapp}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          WhatsApp
        </Button>
        <Button
          onClick={handlers.telegram}
          className="bg-blue-400 hover:bg-blue-500 text-white"
        >
          Telegram
        </Button>
        <Button
          onClick={handlers.linkedin}
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          LinkedIn
        </Button>
        <Button
          onClick={handlers.pinterest}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Pinterest
        </Button>
        <Button
          onClick={handlers.reddit}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Reddit
        </Button>
        {shareData.url &&
          typeof navigator !== "undefined" &&
          navigator.share && (
            <Button
              onClick={() => navigator.share(shareData)}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              <FaShareAlt />
              Share
            </Button>
          )}
      </div>
    </div>
  );
};

export default SocialShare;
