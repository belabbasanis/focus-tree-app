import { Plus } from 'lucide-react';
import CustomIcon from './CustomIcon';
import { LAYOUT, ICON, BTN } from '../lib/ui';

interface BottomNavBarProps {
  onNavigateToTimer: () => void;
  onOpenSpriteSelector: () => void;
  isDrawerOpen: boolean;
}

const BottomNavBar = ({ 
  onNavigateToTimer, 
  onOpenSpriteSelector, 
  isDrawerOpen 
}: BottomNavBarProps) => {
  if (isDrawerOpen) return null;

  return (
    <div className={`${LAYOUT.navContainer} ${LAYOUT.zNav}`}>
      <button
        onClick={onNavigateToTimer}
        className={BTN.nav}
        style={ICON.pixel}
        aria-label="Timer"
      >
        <CustomIcon src="/icons/Time.png" alt="Timer" className={ICON.nav} />
      </button>
      <button
        onClick={onOpenSpriteSelector}
        className={BTN.nav}
        style={ICON.pixel}
        aria-label="Add"
      >
        <Plus className={`${ICON.nav} text-white`} style={ICON.lucideWhite} />
      </button>
      <button
        className={BTN.nav}
        style={ICON.pixel}
        aria-label="Timechamber"
      >
        <CustomIcon src="/icons/Timechamber.png" alt="Timechamber" className={ICON.nav} />
      </button>
    </div>
  );
};

export default BottomNavBar;

