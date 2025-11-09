import { Sprite } from '../types/sprite';

interface SpriteSelectorProps {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  onSelectSprite: (spriteId: string) => void;
}

const SpriteSelector = ({
  sprites,
  selectedSpriteId,
  onSelectSprite,
}: SpriteSelectorProps) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl p-6">
      <h2 className="text-slate-200 font-semibold text-lg mb-4">
        Select a Sprite
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-2 max-h-[400px] overflow-y-auto">
        {sprites.map((sprite) => (
          <button
            key={sprite.id}
            onClick={() => onSelectSprite(sprite.id)}
            className={`relative aspect-square rounded-lg transition-all duration-200 overflow-hidden ${
              selectedSpriteId === sprite.id
                ? 'bg-blue-600 ring-2 ring-blue-400 scale-110 z-10'
                : 'bg-slate-700 hover:bg-slate-600 hover:scale-105'
            }`}
            title={sprite.name}
          >
            <img
              src={sprite.imageUrl}
              alt={sprite.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {selectedSpriteId === sprite.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-600 bg-opacity-30 rounded-lg">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-slate-400 text-sm mt-4">
        {selectedSpriteId
          ? 'Click on a grid tile to place the sprite'
          : 'Select a sprite from above to start placing'}
      </p>
    </div>
  );
};

export default SpriteSelector;
