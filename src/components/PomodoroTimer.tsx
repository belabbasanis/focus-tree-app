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
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(5); // seconds for testing
  const [showRipple, setShowRipple] = useState<boolean>(false);
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
      
      // Set completion state
      setIsCompleted(true);
      setIsRunning(false);
      
      // Reset session tracking
      sessionStartTimeRef.current = null;
      sessionStartedRef.current = false;
      
      // Auto-reset after 2 seconds to allow starting new session
      setTimeout(() => {
        setIsCompleted(false);
        setTimeRemaining(selectedDuration); // Reset to selected duration
      }, 2000);
    }
  }, [timeRemaining, selectedDuration, addSession]);

  const handleStart = () => {
    setIsCompleted(false); // Reset completion state
    sessionStartTimeRef.current = new Date();
    sessionStartedRef.current = true;
    setIsRunning(true);
    setShowRipple(true);
    // Reset ripple after animation completes
    setTimeout(() => setShowRipple(false), 1500);
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
      {/* Static first frame - always visible when not running */}
      {!isRunning && (
        <div 
          className={`${LAYOUT.absoluteFull}`}
          style={{
            backgroundImage: 'url(/videos/loop-calm-farm-frame1.png)', // Static first frame - user needs to provide this
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...ICON.pixel,
          }}
        />
      )}
      
      {/* Animated GIF Background - appears with ripple when timer starts */}
      {isRunning && (
        <div 
          className={`${LAYOUT.absoluteFull} ${showRipple ? 'ripple-reveal' : ''}`}
          style={{
            backgroundImage: 'url(/videos/loop-calm-farm.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...ICON.pixel,
          }}
        />
      )}
      
      {/* Dark overlay - lighter when animated for contrast */}
      <div 
        className={`${LAYOUT.absoluteFull} ${COLOR.bgDark}`} 
        style={{ opacity: isRunning ? 0.3 : 1 }}
      />

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
          
          {/* Dynamic Session Label */}
          <div className={`${COLOR.white} ${TEXT.lg} ${TEXT.retro} ${TEXT.uppercase}`}>
            {isCompleted ? 'SESSION COMPLETE' : isRunning ? 'FOCUSING' : 'FOCUS SESSION'}
          </div>

          {/* Preset Buttons - Retro style */}
          {!isRunning && !isCompleted && (
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
              <CustomIcon src="/icons/garden_32.png" alt="Garden" className={ICON.nav} />
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
