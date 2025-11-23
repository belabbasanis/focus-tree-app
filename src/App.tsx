import { useState } from 'react';
import IsometricGrid from './components/IsometricGrid';
import MobileSpriteSelector from './components/MobileSpriteSelector';
import PomodoroTimer from './components/PomodoroTimer';
import { SPRITES } from './config/sprites';
import { Plus } from 'lucide-react';
import { useProgression } from './contexts/ProgressionContext';

type ViewMode = 'grid' | 'timer';

// CustomIcon helper component for pixelated icons
const CustomIcon = ({ 
  src, 
  alt, 
  className = "w-3 h-3" 
}: { 
  src: string; 
  alt: string; 
  className?: string;
}) => (
  <img 
    src={src} 
    alt={alt} 
    className={className}
    style={{ imageRendering: 'pixelated' }}
  />
);

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  const { 
    placedSprites, 
    totalSessions, 
    canPlace, 
    addPlacedSprite,
    isLoading 
  } = useProgression();

  const handleSelectSprite = (spriteId: string) => {
    setSelectedSpriteId(spriteId);
  };

  const handlePlaceSprite = (row: number, col: number) => {
    if (!selectedSpriteId) return;
    if (!canPlace) return; // Enforce placement limit

    addPlacedSprite(row, col, selectedSpriteId);
  };

  const selectedSprite = SPRITES.find((s) => s.id === selectedSpriteId) || null;

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden fixed inset-0 font-retro" style={{ imageRendering: 'pixelated' }}>
      {viewMode === 'timer' ? (
        <PomodoroTimer onNavigateHome={() => setViewMode('grid')} />
      ) : (
        <>
          {/* Top Stats Bar - Retro Style */}
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-50">
            <div className="bg-black border-2 border-white px-3 py-1 flex items-center gap-2" style={{ imageRendering: 'pixelated' }}>
              <CustomIcon src="/icons/Streak.png" alt="Streak" className="w-6 h-6" />
              <span className="text-sm font-retro">{isLoading ? '...' : totalSessions}</span>
            </div>
            <div className="bg-black border-2 border-white px-3 py-1 flex items-center gap-2" style={{ imageRendering: 'pixelated' }}>
              <CustomIcon src="/icons/Time.png" alt="Time" className="w-6 h-6" />
              <span className="text-sm font-retro">25</span>
            </div>
            <div className="bg-black border-2 border-white px-3 py-1 flex items-center gap-2" style={{ imageRendering: 'pixelated' }}>
              <CustomIcon src="/icons/Coin.png" alt="Coin" className="w-6 h-6" />
              <span className="text-sm font-retro">0</span>
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
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-40">
              <button
                onClick={() => setViewMode('timer')}
                className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-[rgba(255,140,0,0.2)] transition-none"
                style={{ imageRendering: 'pixelated' }}
                aria-label="Timer"
              >
                <CustomIcon src="/icons/Time.png" alt="Timer" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-[rgba(255,140,0,0.2)] transition-none"
                style={{ imageRendering: 'pixelated' }}
                aria-label="Add"
              >
                <Plus className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
              </button>
              <button
                className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-[rgba(255,140,0,0.2)] transition-none"
                style={{ imageRendering: 'pixelated' }}
                aria-label="Timechamber"
              >
                <CustomIcon src="/icons/Timechamber.png" alt="Timechamber" className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
