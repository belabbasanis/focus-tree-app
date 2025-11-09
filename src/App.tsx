import { useState } from 'react';
import IsometricGrid from './components/IsometricGrid';
import MobileSpriteSelector from './components/MobileSpriteSelector';
import { PlacedSprite } from './types/sprite';
import { SPRITES } from './config/sprites';

function App() {
  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>(null);
  const [placedSprites, setPlacedSprites] = useState<PlacedSprite[]>([]);

  const handleSelectSprite = (spriteId: string) => {
    setSelectedSpriteId(spriteId);
  };

  const handlePlaceSprite = (row: number, col: number) => {
    if (!selectedSpriteId) return;

    const sprite = SPRITES.find((s) => s.id === selectedSpriteId);
    if (!sprite) return;

    setPlacedSprites((prev) => {
      const filtered = prev.filter((s) => s.row !== row || s.col !== col);
      return [
        ...filtered,
        {
          spriteId: sprite.id,
          sprite: sprite,
          row,
          col,
        },
      ];
    });
  };

  const selectedSprite = SPRITES.find((s) => s.id === selectedSpriteId) || null;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden fixed inset-0">
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <IsometricGrid
          rows={16}
          cols={16}
          selectedSprite={selectedSprite}
          placedSprites={placedSprites}
          onPlaceSprite={handlePlaceSprite}
        />
      </div>

      <MobileSpriteSelector
        sprites={SPRITES}
        selectedSpriteId={selectedSpriteId}
        onSelectSprite={handleSelectSprite}
      />
    </div>
  );
}

export default App;
