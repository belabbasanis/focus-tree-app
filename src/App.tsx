import { useState } from 'react';
import IsometricGrid from './components/IsometricGrid';
import MobileSpriteSelector from './components/MobileSpriteSelector';
import PomodoroTimer from './components/PomodoroTimer';
import { PlacedSprite } from './types/sprite';
import { SPRITES } from './config/sprites';
import { Timer, Grid } from 'lucide-react';

type ViewMode = 'grid' | 'timer';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('timer');
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
      {/* View Toggle Button */}
      <button
        onClick={() => setViewMode((prev) => (prev === 'timer' ? 'grid' : 'timer'))}
        className="fixed top-4 right-4 z-50 bg-white/90 hover:bg-white text-indigo-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={viewMode === 'timer' ? 'Switch to Grid View' : 'Switch to Timer View'}
      >
        {viewMode === 'timer' ? (
          <Grid className="w-6 h-6" />
        ) : (
          <Timer className="w-6 h-6" />
        )}
      </button>

      {viewMode === 'timer' ? (
        <PomodoroTimer />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
