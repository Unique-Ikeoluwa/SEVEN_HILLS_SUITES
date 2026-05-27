import { FiBookmark } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? <FaHeart size={14} color="#ef4444" /> : <FaRegHeart size={14} color="#374151" />;
}

export function SaveButtons({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  return (
    <div className="absolute top-3 left-3 flex gap-2">
      <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
        <FiBookmark size={14} />
      </button>
      <button
        onClick={onToggle}
        className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
      >
        <HeartIcon filled={saved} />
      </button>
    </div>
  );
}