import { X } from 'lucide-react';
import { Sprite } from '../types/sprite';
import { cn } from '../lib/utils';
import { CARD, DRAWER, ICON, TEXT, BTN, COLOR, LAYOUT, SPRITE } from '../lib/ui';

interface MobileSpriteSelectorProps {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  onSelectSprite: (spriteId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  canPlace: boolean;
  availableSprites: number;
}

// Preview card component with consistent sizing aligned with grid constraints
const SpritePreviewCard = ({ 
  sprite, 
  isSelected,
  isLocked,
  onClick 
}: { 
  sprite: Sprite; 
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        isSelected ? CARD.spriteSelected : CARD.sprite,
        isLocked && CARD.spriteLocked
      )}
      style={ICON.pixel}
      title={isLocked ? 'Placement limit reached' : sprite.name}
    >
      {/* Preview Frame */}
      <div className={CARD.previewFrame}>
        {/* Sprite Image - sized consistently (80% of thumbnail to show full sprite) */}
        <img
          src={sprite.imageUrl}
          alt={sprite.name}
          style={SPRITE.thumbnail}
        />
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className={CARD.selectionIndicator}>
          <div className={`${ICON.indicator} ${COLOR.bgWhite}`} style={ICON.pixel} />
        </div>
      )}

      {/* Lock overlay - always visible when locked (mobile-friendly) */}
      {isLocked && (
        <div className={CARD.lockOverlay}>
          <img
            src="/icons/lock.png"
            alt="Locked"
            className={CARD.lockIcon}
            style={ICON.pixel}
          />
        </div>
      )}
    </button>
  );
};

// Small preview for header - consistent sizing
const SpriteHeaderPreview = ({ sprite }: { sprite: Sprite }) => {
  return (
    <div className={CARD.headerPreview} style={ICON.pixel}>
      <img
        src={sprite.imageUrl}
        alt={sprite.name}
        style={SPRITE.thumbnail}
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
  canPlace,
  availableSprites,
}: MobileSpriteSelectorProps) => {
  const selectedSprite = selectedSpriteId 
    ? sprites.find(s => s.id === selectedSpriteId)
    : null;

  return (
    <div className={cn(
      DRAWER.container,
      isOpen ? DRAWER.open : DRAWER.closed
    )}
    style={ICON.pixel}
    >
      <div className={DRAWER.header}>
        <div className={LAYOUT.centeredFlex} style={{ gap: '0.75rem' }}>
          {selectedSprite ? (
            <>
              <SpriteHeaderPreview sprite={selectedSprite} />
              <span className={`${TEXT.retro} ${TEXT.xs} ${COLOR.white} ${TEXT.uppercase}`}>
                {selectedSprite.name}
              </span>
            </>
          ) : (
            <span className={`${TEXT.retro} ${TEXT.xs} ${COLOR.white} ${TEXT.uppercase}`}>
              SELECT SPRITE ({availableSprites})
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className={BTN.close}
          style={ICON.pixel}
          aria-label="Close drawer"
        >
          <X className={`${ICON.small} ${COLOR.white}`} style={ICON.lucideWhite} />
        </button>
      </div>

      <div className={DRAWER.content} style={{ maxHeight: '60vh' }}>
        <div className={DRAWER.contentGrid}>
          {sprites.map((sprite) => (
            <SpritePreviewCard
              key={sprite.id}
              sprite={sprite}
              isSelected={selectedSpriteId === sprite.id}
              isLocked={!canPlace}
              onClick={() => {
                if (canPlace) {
                  onSelectSprite(sprite.id);
                  onClose();
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSpriteSelector;
