import { useState } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import GridPage from './components/GridPage';
import { useProgression } from './contexts/ProgressionContext';
import { LAYOUT, ICON, TEXT, COLOR } from './lib/ui';

type ViewMode = 'grid' | 'timer';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  const { addPlacedSprite, canPlace } = useProgression();

  const handleSelectSprite = (spriteId: string | null) => {
    // If clicking the same sprite or passing null, deselect it
    if (selectedSpriteId === spriteId) {
      setSelectedSpriteId(null);
    } else {
      setSelectedSpriteId(spriteId);
    }
  };

  const handlePlaceSprite = (row: number, col: number) => {
    if (!selectedSpriteId) return;
    if (!canPlace) return; // Enforce placement limit

    addPlacedSprite(row, col, selectedSpriteId);
  };

  return (
    <div className={`${LAYOUT.fullScreen} ${COLOR.bgDark} ${COLOR.white} ${LAYOUT.columnFlex} ${LAYOUT.overflowHidden} ${LAYOUT.fixedFull} ${TEXT.retro}`} style={ICON.pixel}>
      {viewMode === 'timer' ? (
        <PomodoroTimer onNavigateHome={() => setViewMode('grid')} />
      ) : (
        <GridPage
          selectedSpriteId={selectedSpriteId}
          onSelectSprite={handleSelectSprite}
          onPlaceSprite={handlePlaceSprite}
          isDrawerOpen={isDrawerOpen}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onCloseDrawer={() => setIsDrawerOpen(false)}
          onNavigateToTimer={() => setViewMode('timer')}
        />
      )}
    </div>
  );
}

export default App;
