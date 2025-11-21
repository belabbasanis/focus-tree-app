import { X } from 'lucide-react';
import { Sprite } from '../types/sprite';
import { cn } from '../lib/utils';

interface MobileSpriteSelectorProps {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  onSelectSprite: (spriteId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Preview card component with consistent sizing aligned with grid constraints
const SpritePreviewCard = ({ 
  sprite, 
  isSelected, 
  onClick 
}: { 
  sprite: Sprite; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square border-2 transition-none overflow-hidden",
        isSelected
          ? 'bg-white border-white'
          : 'bg-black border-white hover:bg-white'
      )}
      style={{ imageRendering: 'pixelated' }}
      title={sprite.name}
    >
      {/* Preview Frame */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        {/* Sprite Image - sized consistently (80% of thumbnail to show full sprite) */}
        <img
          src={sprite.imageUrl}
          alt={sprite.name}
          style={{
            width: '80%',
            height: 'auto',
            maxHeight: '80%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
          }}
        />
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none border-2 border-white">
          <div className="w-2 h-2 bg-white" style={{ imageRendering: 'pixelated' }} />
        </div>
      )}
    </button>
  );
};

// Small preview for header - consistent sizing
const SpriteHeaderPreview = ({ sprite }: { sprite: Sprite }) => {
  return (
    <div className="w-10 h-10 bg-black border-2 border-white flex items-center justify-center overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      <img
        src={sprite.imageUrl}
        alt={sprite.name}
        style={{
          width: '80%',
          height: 'auto',
          maxHeight: '80%',
          objectFit: 'contain',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

const MobileSpriteSelector = ({
  sprites,
  selectedSpriteId,
  onSelectSprite,
  isOpen,
  onClose,
}: MobileSpriteSelectorProps) => {
  const selectedSprite = selectedSpriteId 
    ? sprites.find(s => s.id === selectedSpriteId)
    : null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[60] bg-black border-t-2 border-white shadow-none transition-transform duration-300 ease-in-out flex flex-col",
      isOpen ? "translate-y-0" : "translate-y-full"
    )}
    style={{ imageRendering: 'pixelated' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-white flex-shrink-0">
        <div className="flex items-center gap-3">
          {selectedSprite ? (
            <>
              <SpriteHeaderPreview sprite={selectedSprite} />
              <span className="font-retro text-xs text-white uppercase">
                {selectedSprite.name}
              </span>
            </>
          ) : (
            <span className="font-retro text-xs text-white uppercase">SELECT SPRITE</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 border-2 border-white bg-black hover:bg-white hover:text-black transition-none"
          style={{ imageRendering: 'pixelated' }}
          aria-label="Close drawer"
        >
          <X className="w-4 h-4 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4" style={{ maxHeight: '60vh' }}>
        <div className="grid grid-cols-4 gap-2">
          {sprites.map((sprite) => (
            <SpritePreviewCard
              key={sprite.id}
              sprite={sprite}
              isSelected={selectedSpriteId === sprite.id}
              onClick={() => {
                onSelectSprite(sprite.id);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSpriteSelector;
