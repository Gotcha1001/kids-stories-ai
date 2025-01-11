import { MdPlayCircle } from "react-icons/md";
import LastPage from "./LastPage";

function StoryPages({ storyChapters }: { storyChapters: any }) {
  const playSpeech = (text: string) => {
    const synth = window?.speechSynthesis;
    const textToSpeech = new SpeechSynthesisUtterance(text);
    synth.speak(textToSpeech);
  };

  return (
    <div className="container mx-auto px-4 relative">
      {/* Main Story Title */}
      <h2 className="text-4xl font-extrabold mb-4 text-center font-serif text-amber-900 flex justify-center items-center">
        {storyChapters?.title}
        <MdPlayCircle
          onClick={() => playSpeech(storyChapters?.textPrompt)}
          className="text-4xl cursor-pointer ml-4"
        />
      </h2>

      {/* Main Story Description */}
      <p className="text-xl font-semibold text-amber-800 mb-6 text-center font-serif">
        {storyChapters?.description}
      </p>

      {/* Main Story Content */}
      <div className="relative max-w-4xl mx-auto chapter-style">
        <div className="relative">
          <p className="text-lg leading-loose text-amber-950 font-serif">
            {storyChapters?.textPrompt}
          </p>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="chapters space-y-28 mt-12 max-w-4xl mx-auto">
        {storyChapters?.chapters?.map((chapter: any, index: number) => (
          <div key={index} className="chapter-style">
            {/* Chapter Title */}
            <h3 className="text-2xl font-bold text-amber-900 mb-2">
              {chapter.title}
            </h3>

            {/* Chapter Description */}
            <p className="text-lg font-medium text-amber-800 mb-4">
              {chapter.description}
            </p>

            {/* Chapter Content */}
            <p className="text-base text-amber-950 leading-loose">
              {chapter.textPrompt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryPages;
