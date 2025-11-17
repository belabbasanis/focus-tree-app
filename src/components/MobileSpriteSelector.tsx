import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { Sprite } from '../types/sprite';
import { cn } from '../lib/utils';

interface MobileSpriteSelectorProps {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  onSelectSprite: (spriteId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MobileSpriteSelector = ({
  sprites,
  selectedSpriteId,
  onSelectSprite,
  isOpen,
  onClose,
}: MobileSpriteSelectorProps) => {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out",
      isOpen ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
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
              <span className="font-medium font-grotesk">
                {sprites.find(s => s.id === selectedSpriteId)?.name}
              </span>
            </>
          ) : (
            <span className="font-medium font-grotesk">Select a sprite</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="px-4 pb-4 pt-4 overflow-y-auto max-h-60">
        <div className="grid grid-cols-4 gap-2">
          {sprites.map((sprite) => (
            <button
              key={sprite.id}
              onClick={() => {
                onSelectSprite(sprite.id);
                onClose();
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
  );
};

export default MobileSpriteSelector;
