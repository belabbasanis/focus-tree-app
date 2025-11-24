import CustomIcon from './CustomIcon';
import { LAYOUT, ICON, TEXT } from '../lib/ui';

interface TopStatsBarProps {
  totalSessions: number;
  isLoading: boolean;
}

const TopStatsBar = ({ totalSessions, isLoading }: TopStatsBarProps) => {
  return (
    <div className={`${LAYOUT.statsContainer} ${LAYOUT.zStats}`}>
      <div className={LAYOUT.statsItem} style={ICON.pixel}>
        <CustomIcon src="/icons/streak_32.png" alt="Streak" className={ICON.stats} />
        <span className={`${TEXT.sm} ${TEXT.retro}`}>{isLoading ? '...' : totalSessions}</span>
      </div>
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

