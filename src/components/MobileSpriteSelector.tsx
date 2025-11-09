import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Sprite } from '../types/sprite';
import { cn } from '../lib/utils';

interface MobileSpriteSelectorProps {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  onSelectSprite: (spriteId: string) => void;
}

const MobileSpriteSelector = ({
  sprites,
  selectedSpriteId,
  onSelectSprite,
}: MobileSpriteSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {selectedSpriteId ? (
            <>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={sprites.find(s => s.id === selectedSpriteId)?.imageUrl}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">
                {sprites.find(s => s.id === selectedSpriteId)?.name}
              </span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">+</span>
              </div>
              <span className="font-medium">Select a sprite</span>
            </>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 overflow-y-auto max-h-60" style={{ overflow: 'hidden' }}>
          <div className="grid grid-cols-4 gap-2">
            {sprites.map((sprite) => (
              <button
                key={sprite.id}
                onClick={() => {
                  onSelectSprite(sprite.id);
                  setIsExpanded(false);
                }}
                className={cn(
                  "relative aspect-square rounded-lg transition-all duration-200 overflow-hidden",
                  selectedSpriteId === sprite.id
                    ? 'bg-blue-500 ring-2 ring-blue-300 scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                )}
                title={sprite.name}
              >
                <img
                  src={sprite.imageUrl}
                  alt={sprite.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {selectedSpriteId === sprite.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-600/30 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSpriteSelector;
