import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { DRAWER, ICON, TEXT, BTN, COLOR, LAYOUT } from '../lib/ui';
import CustomIcon from './CustomIcon';
import type { Session } from '../lib/storage/types';

interface StreakDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  sessions: Session[];
  onStartSession: () => void;
}

const StreakDrawer = ({
  isOpen,
  onClose,
  currentStreak,
  sessions,
  onStartSession,
}: StreakDrawerProps) => {
  // Get unique dates with sessions
  const sessionDates = new Set<string>();
  sessions
    .filter(session => session.endedAt !== null)
    .forEach(session => {
      if (session.endedAt) {
        const date = new Date(session.endedAt);
        const dateStr = date.toLocaleDateString('en-CA');
        sessionDates.add(dateStr);
      }
    });

  // Generate last 7 days for week view
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-CA');
    const hasSession = sessionDates.has(dateStr);
    const isToday = i === 0;
    const dayName = dayNames[date.getDay()];
    days.push({ date, dateStr, hasSession, isToday, dayName });
  }

  return (
    <>
      {/* Semi-transparent black overlay with blur */}
      <div
        className={cn(
          DRAWER.overlay,
          isOpen ? DRAWER.overlayOpen : DRAWER.overlayClosed
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div className={cn(
        DRAWER.container,
        isOpen ? DRAWER.open : DRAWER.closed
      )}
      style={ICON.pixel}
      >
      <div className={DRAWER.header}>
        <div className={LAYOUT.centeredFlex} style={{ gap: '0.75rem' }}>
          <span className={`${TEXT.retro} ${TEXT.xs} ${COLOR.white} ${TEXT.uppercase}`}>
            STREAK
          </span>
        </div>
        <button
          onClick={onClose}
          className={BTN.close}
          style={ICON.pixel}
          aria-label="Close drawer"
        >
          <X className={`${ICON.small} ${COLOR.white}`} style={ICON.lucideWhite} />
        </button>
      </div>

      <div className={DRAWER.content} style={{ paddingBottom: '2rem' }}>
        {/* Large Flame Icon at Top - Centered */}
        <div className={LAYOUT.centeredFlex} style={{ marginBottom: '1rem' }}>
          <CustomIcon 
            src="/icons/flame_104.png" 
            alt="Streak flame" 
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        
        {/* Streak Number - Centered */}
        <div className={LAYOUT.centeredColumn} style={{ marginBottom: '1.5rem' }}>
          <div className={`${COLOR.white} ${TEXT.retro}`} style={{ fontSize: '3rem', lineHeight: '1.2' }}>
            {currentStreak}
          </div>
          <div className={`${COLOR.white} ${TEXT.sm} ${TEXT.retro} ${TEXT.uppercase}`} style={{ opacity: 0.9 }}>
            {currentStreak === 1 ? 'day streak' : 'day streak'}
          </div>
        </div>

        {/* Week View - Last 7 Days */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="flex gap-2">
            {days.map((day) => {
              return (
                <div
                  key={day.dateStr}
                  className="flex-1 flex flex-col items-center"
                >
                  {/* Day Name - Outside Container */}
                  <span
                    className={cn(
                      TEXT.xs,
                      TEXT.retro,
                      COLOR.white,
                      "mb-2 opacity-70"
                    )}
                    style={ICON.pixel}
                  >
                    {day.dayName.slice(0, 2)}
                  </span>
                  
                  {/* Icon Container */}
                  <div
                    className={cn(
                      "w-full aspect-square flex items-center justify-center border-2 transition-none",
                      "min-w-[24px] min-h-[24px]",
                      day.isToday && "ring-2 ring-white ring-offset-2 ring-offset-black"
                    )}
                    style={{
                      ...ICON.pixel,
                      borderColor: day.hasSession 
                        ? 'rgba(255, 0, 0, 0.2)' // #FF0000 opacity-20 for hot streak
                        : 'rgba(0, 98, 154, 0.6)', // #00629A opacity-60 for cold streak
                    }}
                    title={day.dateStr}
                  >
                    <CustomIcon
                      src={day.hasSession ? "/icons/Streak.png" : "/icons/cold-streak_32.png"}
                      alt={day.hasSession ? "Streak day" : "Missed day"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button - Full Width, Bigger for Mobile */}
        <div className="w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
          <button
            onClick={() => {
              onStartSession();
              onClose();
            }}
            className={cn(
              BTN.preset,
              "w-full py-4 text-lg md:text-base"
            )}
            style={ICON.pixel}
          >
            START FOCUS SESSION
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default StreakDrawer;

