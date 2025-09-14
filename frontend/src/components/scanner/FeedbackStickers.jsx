import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Users, 
  Smile, 
  BookOpen, 
  Award, 
  DollarSign, 
  Eye, 
  ThumbsUp 
} from "lucide-react";

const stickerOptions = [
  { 
    id: "innovative", 
    label: "Innovative", 
    icon: Lightbulb, 
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    activeColor: "bg-yellow-500 text-white" 
  },
  { 
    id: "professional", 
    label: "Professional", 
    icon: Users, 
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    activeColor: "bg-blue-500 text-white" 
  },
  { 
    id: "friendly", 
    label: "Friendly", 
    icon: Smile, 
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    activeColor: "bg-green-500 text-white" 
  },
  { 
    id: "informative", 
    label: "Informative", 
    icon: BookOpen, 
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    activeColor: "bg-purple-500 text-white" 
  },
  { 
    id: "high_quality", 
    label: "High Quality", 
    icon: Award, 
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    activeColor: "bg-orange-500 text-white" 
  },
  { 
    id: "good_value", 
    label: "Good Value", 
    icon: DollarSign, 
    color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    activeColor: "bg-emerald-500 text-white" 
  },
  { 
    id: "impressive", 
    label: "Impressive", 
    icon: Eye, 
    color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    activeColor: "bg-pink-500 text-white" 
  },
  { 
    id: "would_recommend", 
    label: "Would Recommend", 
    icon: ThumbsUp, 
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    activeColor: "bg-indigo-500 text-white" 
  }
];

export default function FeedbackStickers({ selectedStickers, onStickersChange }) {
  const toggleSticker = (stickerId) => {
    const newStickers = selectedStickers.includes(stickerId)
      ? selectedStickers.filter(id => id !== stickerId)
      : [...selectedStickers, stickerId];
    
    onStickersChange(newStickers);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Add Feedback Stickers ({selectedStickers.length} selected)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stickerOptions.map((sticker) => {
          const isSelected = selectedStickers.includes(sticker.id);
          const Icon = sticker.icon;
          
          return (
            <button
              key={sticker.id}
              type="button"
              onClick={() => toggleSticker(sticker.id)}
              className={`
                p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 
                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${isSelected 
                  ? `${sticker.activeColor} border-transparent shadow-lg` 
                  : `${sticker.color} border-gray-200 hover:border-gray-300`
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="text-xs leading-tight">{sticker.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      {selectedStickers.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Selected feedback:</p>
          <div className="flex flex-wrap gap-2">
            {selectedStickers.map((stickerId) => {
              const sticker = stickerOptions.find(s => s.id === stickerId);
              const Icon = sticker?.icon;
              return sticker ? (
                <Badge key={stickerId} variant="secondary" className="flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  {sticker.label}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}