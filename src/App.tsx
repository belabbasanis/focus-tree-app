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
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden fixed inset-0 font-grotesk">
      {viewMode === 'timer' ? (
        <PomodoroTimer onNavigateHome={() => setViewMode('grid')} />
      ) : (
        <>
          {/* Top Stats Bar */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-50">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-grotesk font-medium text-gray-700">1</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-grotesk font-medium text-gray-700">25m</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-grotesk font-medium text-gray-700">0</span>
            </div>
          </div>

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

          {/* Bottom Navigation Bar for Grid View */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-50">
            <button
              onClick={() => setViewMode('timer')}
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Timer"
            >
              <TreePine className="w-6 h-6 text-indigo-600" />
            </button>
            <button
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Add"
            >
              <Plus className="w-6 h-6 text-indigo-600" />
            </button>
            <button
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6 text-indigo-600" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
