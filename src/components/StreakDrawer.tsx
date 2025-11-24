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
            STREAK: {currentStreak} DAYS
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

      <div className={DRAWER.content}>
        {/* Current Streak Display */}
        <div className={LAYOUT.centeredColumn} style={{ marginBottom: '2rem' }}>
          <div className={`${COLOR.white} ${TEXT.lg} ${TEXT.retro} ${TEXT.uppercase}`}>
            {currentStreak} DAY STREAK
          </div>
          <div className={`${COLOR.white} ${TEXT.sm} ${TEXT.retro}`} style={{ opacity: 0.7 }}>
            Keep it going!
          </div>
        </div>

        {/* Week View - Last 7 Days */}
        <div style={{ marginBottom: '2rem' }}>
          <div className={`${COLOR.white} ${TEXT.xs} ${TEXT.retro} ${TEXT.uppercase}`} style={{ marginBottom: '1rem' }}>
            THIS WEEK
          </div>
          <div className="flex gap-2">
            {days.map((day) => {
              const dayNumber = day.date.getDate();
              
              return (
                <div
                  key={day.dateStr}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center border-2 transition-none py-3",
                    day.hasSession
                      ? "bg-white border-white"
                      : "bg-black border-white",
                    day.isToday && "ring-2 ring-white ring-offset-2 ring-offset-black"
                  )}
                  style={ICON.pixel}
                  title={day.dateStr}
                >
                  <span
                    className={cn(
                      TEXT.xs,
                      TEXT.retro,
                      day.hasSession ? COLOR.black : COLOR.white,
                      "opacity-70 mb-1"
                    )}
                  >
                    {day.dayName}
                  </span>
                  <CustomIcon
                    src={day.hasSession ? "/icons/hot-streak_32.png" : "/icons/cold-streak_32.png"}
                    alt={day.hasSession ? "Streak day" : "Missed day"}
                    className={ICON.stats}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className={LAYOUT.centeredFlex}>
          <button
            onClick={() => {
              onStartSession();
              onClose();
            }}
            className={BTN.presetSelected}
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

