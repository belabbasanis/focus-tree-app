import CustomIcon from './CustomIcon';
import { LAYOUT, ICON, TEXT, BTN } from '../lib/ui';

interface TopStatsBarProps {
  currentStreak: number;
  isLoading: boolean;
  onStreakClick?: () => void;
}

const TopStatsBar = ({ currentStreak, isLoading, onStreakClick }: TopStatsBarProps) => {
  return (
    <div className={`${LAYOUT.statsContainer} ${LAYOUT.zStats}`}>
      <button
        onClick={onStreakClick}
        className={`${LAYOUT.statsItem} ${onStreakClick ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.1)]' : ''}`}
        style={ICON.pixel}
        aria-label="View streak details"
        disabled={!onStreakClick}
      >
        <CustomIcon src="/icons/streak_32.png" alt="Streak" className={ICON.stats} />
        <span className={`${TEXT.sm} ${TEXT.retro}`}>{isLoading ? '...' : currentStreak}</span>
      </button>
      <div className={LAYOUT.statsItem} style={ICON.pixel}>
        <CustomIcon src="/icons/time_32.png" alt="Time" className={ICON.stats} />
        <span className={`${TEXT.sm} ${TEXT.retro}`}>25</span>
      </div>
      <div className={LAYOUT.statsItem} style={ICON.pixel}>
        <CustomIcon src="/icons/Coin.png" alt="Coin" className={ICON.stats} />
        <span className={`${TEXT.sm} ${TEXT.retro}`}>0</span>
      </div>
    </div>
  );
};

export default TopStatsBar;

