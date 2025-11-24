import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';
import { cn } from '../lib/utils';
import { useProgression } from '../contexts/ProgressionContext';
import { LAYOUT, ICON, TEXT, BTN, COLOR } from '../lib/ui';
import CustomIcon from './CustomIcon';

const PRESETS = [5, 10, 15]; // seconds for testing

const PomodoroTimer = ({ onNavigateHome }: { onNavigateHome: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(5); // 5 seconds for testing
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(5); // seconds for testing
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const sessionStartedRef = useRef<boolean>(false);
  const { addSession } = useProgression();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle countdown
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  // Handle session completion - separate effect that watches for completion
  useEffect(() => {
    if (timeRemaining === 0 && sessionStartedRef.current && sessionStartTimeRef.current) {
      console.log('[FT][TIMER] session finished, attempting to save');
      
      const startedAt = sessionStartTimeRef.current;
      const endedAt = new Date();
      
      addSession({
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        duration: selectedDuration, // already in seconds for testing
      });
      
      console.log('[FT][SAVE] addSession called');
      
      // Reset session tracking
      sessionStartTimeRef.current = null;
      sessionStartedRef.current = false;
    }
  }, [timeRemaining, selectedDuration, addSession]);

  const handleStart = () => {
    sessionStartTimeRef.current = new Date();
    sessionStartedRef.current = true;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration); // already in seconds for testing
    // Don't save incomplete sessions - reset start time
    sessionStartTimeRef.current = null;
    sessionStartedRef.current = false;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration); // already in seconds for testing
    // Don't save incomplete sessions - reset start time
    sessionStartTimeRef.current = null;
    sessionStartedRef.current = false;
  };

  const handlePresetSelect = (seconds: number) => {
    if (!isRunning) {
      setSelectedDuration(seconds);
      setTimeRemaining(seconds); // already in seconds for testing
    }
  };

  return (
    <div className={`${LAYOUT.timerContainer}`} style={ICON.pixel}>
      {/* Retro CRT Background - Simple black with scanlines */}
      <div className={`${LAYOUT.absoluteFull} ${COLOR.bgDark}`} />

      {/* Content */}
      <div className={LAYOUT.contentContainer} style={{ paddingTop: '140px' }}>
        <div className={LAYOUT.centeredColumn}>
          {/* Timer - Retro pixel font */}
          <div className={`${COLOR.white} ${TEXT.timer}`} style={{
            ...TEXT.timerShadow,
            ...ICON.pixel,
          }}>
            {formatTime(timeRemaining)}
          </div>
          
          {/* Focus Session Label */}
          <div className={`${COLOR.white} ${TEXT.lg} ${TEXT.retro} ${TEXT.uppercase}`}>
            FOCUS SESSION
          </div>

          {/* Preset Buttons - Retro style */}
          {!isRunning && (
            <div className={LAYOUT.presetContainer}>
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    selectedDuration === preset
                      ? BTN.presetSelected
                      : BTN.preset
                  )}
                  style={ICON.pixel}
                >
                  {preset} SEC
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar - Retro Style */}
      <div className={`${LAYOUT.navContainer} ${LAYOUT.zNav}`}>
        {isRunning ? (
          <>
            <button
              onClick={handleReset}
              className={BTN.nav}
              style={ICON.pixel}
              aria-label="Reset"
            >
              <RotateCcw className={`${ICON.nav} text-white`} style={ICON.lucideWhite} />
            </button>
            <button
              onClick={handlePause}
              className={BTN.nav}
              style={ICON.pixel}
              aria-label="Pause"
            >
              <Pause className={`${ICON.nav} text-white`} fill="currentColor" style={ICON.lucideWhite} />
            </button>
            <button
              onClick={handleStop}
              className={BTN.nav}
              style={ICON.pixel}
              aria-label="Stop"
            >
              <Square className={`${ICON.nav} text-white`} fill="currentColor" style={ICON.lucideWhite} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onNavigateHome}
              className={BTN.nav}
              style={ICON.pixel}
              aria-label="Garden"
            >
              <CustomIcon src="/icons/Palm.png" alt="Garden" className={ICON.nav} />
            </button>
            <button
              onClick={handleStart}
              className={BTN.play}
              style={ICON.pixel}
              aria-label="Start"
            >
              <Play className={`${ICON.nav} text-black`} fill="currentColor" />
            </button>
            <button
              className={BTN.nav}
              style={ICON.pixel}
              aria-label="Settings"
            >
              <CustomIcon src="/icons/Settings.png" alt="Settings" className={ICON.nav} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
