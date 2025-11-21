import { useState } from 'react';
import IsometricGrid from './components/IsometricGrid';
import MobileSpriteSelector from './components/MobileSpriteSelector';
import PomodoroTimer from './components/PomodoroTimer';
import { PlacedSprite } from './types/sprite';
import { SPRITES } from './config/sprites';
import { Flame, Clock, Coins, TreePine, Plus, Settings } from 'lucide-react';

type ViewMode = 'grid' | 'timer';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>(null);
  const [placedSprites, setPlacedSprites] = useState<PlacedSprite[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden fixed inset-0 font-retro" style={{ imageRendering: 'pixelated' }}>
      {viewMode === 'timer' ? (
        <PomodoroTimer onNavigateHome={() => setViewMode('grid')} />
      ) : (
        <>
          {/* Top Stats Bar - Retro Style */}
          <div className="fixed top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-50">
            <div className="bg-black border-2 border-white px-3 py-1 flex items-center gap-2" style={{ imageRendering: 'pixelated' }}>
              <Flame className="w-3 h-3 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="text-xs font-retro">1</span>
            </div>
            <div className="bg-black border-2 border-white px-3 py-1 flex items-center gap-2" style={{ imageRendering: 'pixelated' }}>
              <Clock className="w-3 h-3 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="text-xs font-retro">25M</span>
            </div>
            <div className="bg-black border-2 border-white px-3 py-1 flex items-center gap-2" style={{ imageRendering: 'pixelated' }}>
              <Coins className="w-3 h-3 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="text-xs font-retro">0</span>
            </div>
          </div>

          <div className="flex-1">
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
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />

          {/* Bottom Navigation Bar - Retro Style */}
          {!isDrawerOpen && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-40">
              <button
                onClick={() => setViewMode('timer')}
                className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black transition-none"
                style={{ imageRendering: 'pixelated' }}
                aria-label="Timer"
              >
                <TreePine className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              </button>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black transition-none"
                style={{ imageRendering: 'pixelated' }}
                aria-label="Add"
              >
                <Plus className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              </button>
              <button
                className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black transition-none"
                style={{ imageRendering: 'pixelated' }}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
