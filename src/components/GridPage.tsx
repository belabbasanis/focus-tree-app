import { useState } from 'react';
import { SPRITES } from '../config/sprites';
import { useProgression } from '../contexts/ProgressionContext';
import IsometricGrid from './IsometricGrid';
import MobileSpriteSelector from './MobileSpriteSelector';
import TopStatsBar from './TopStatsBar';
import BottomNavBar from './BottomNavBar';
import StreakDrawer from './StreakDrawer';
import { LAYOUT } from '../lib/ui';
import type { Sprite } from '../types/sprite';

interface GridPageProps {
  selectedSpriteId: string | null;
  onSelectSprite: (spriteId: string | null) => void;
  onPlaceSprite: (row: number, col: number) => void;
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onNavigateToTimer: () => void;
}

const GridPage = ({
  selectedSpriteId,
  onSelectSprite,
  onPlaceSprite,
  isDrawerOpen,
  onOpenDrawer,
  onCloseDrawer,
  onNavigateToTimer,
}: GridPageProps) => {
  const [isStreakDrawerOpen, setIsStreakDrawerOpen] = useState<boolean>(false);
  const { placedSprites, totalSessions, canPlace, isLoading, allowedSprites, usedSprites, currentStreak, sessions } = useProgression();

  const selectedSprite = SPRITES.find((s) => s.id === selectedSpriteId) || null;
  const availableSprites = allowedSprites - usedSprites;

  return (
    <>
      <TopStatsBar 
        currentStreak={currentStreak} 
        isLoading={isLoading}
        onStreakClick={() => setIsStreakDrawerOpen(true)}
      />

      <div className={LAYOUT.flex1}>
        <IsometricGrid
          rows={16}
          cols={16}
          selectedSprite={selectedSprite}
          placedSprites={placedSprites}
          onPlaceSprite={onPlaceSprite}
        />
      </div>

      <MobileSpriteSelector
        sprites={SPRITES.filter(s => s.layer === 'secondary')}
        selectedSpriteId={selectedSpriteId}
        onSelectSprite={onSelectSprite}
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        canPlace={canPlace}
        availableSprites={availableSprites}
      />

      <BottomNavBar
        onNavigateToTimer={onNavigateToTimer}
        onOpenSpriteSelector={onOpenDrawer}
        isDrawerOpen={isDrawerOpen}
      />

      <StreakDrawer
        isOpen={isStreakDrawerOpen}
        onClose={() => setIsStreakDrawerOpen(false)}
        currentStreak={currentStreak}
        sessions={sessions}
        onStartSession={onNavigateToTimer}
      />
    </>
  );
};

export default GridPage;

