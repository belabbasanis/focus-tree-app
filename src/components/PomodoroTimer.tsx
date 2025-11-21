import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Square, Home, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const PRESETS = [15, 25, 45]; // minutes

const PomodoroTimer = ({ onNavigateHome }: { onNavigateHome: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration * 60);
  };

  const handlePresetSelect = (minutes: number) => {
    if (!isRunning) {
      setSelectedDuration(minutes);
      setTimeRemaining(minutes * 60);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col fixed inset-0 relative overflow-hidden bg-black" style={{ imageRendering: 'pixelated' }}>
      {/* Retro CRT Background - Simple black with scanlines */}
      <div className="absolute inset-0 bg-black" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4" style={{ paddingTop: '140px' }}>
        <div className="flex flex-col items-center space-y-4">
          {/* Timer - Retro pixel font */}
          <div className="text-white text-8xl md:text-9xl font-retro" style={{
            textShadow: '4px 4px 0px #000000',
            letterSpacing: '0.1em',
            imageRendering: 'pixelated',
          }}>
            {formatTime(timeRemaining)}
          </div>
          
          {/* Focus Session Label */}
          <div className="text-white text-lg md:text-xl font-retro uppercase">
            FOCUS SESSION
          </div>

          {/* Preset Buttons - Retro style */}
          {!isRunning && (
            <div className="flex gap-3 mt-6">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'px-4 py-2 border-2 border-white font-retro text-xs uppercase transition-none',
                    selectedDuration === preset
                      ? 'bg-white text-black'
                      : 'bg-black text-white hover:bg-white hover:text-black'
                  )}
                  style={{ imageRendering: 'pixelated' }}
                >
                  {preset} MIN
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar - Retro Style */}
      <div className="relative z-10 fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6">
        {isRunning ? (
          <>
            <button
              onClick={handleReset}
              className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white transition-none"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Reset"
            >
              <RotateCcw className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
            <button
              onClick={handlePause}
              className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white transition-none"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Pause"
            >
              <Pause className="w-5 h-5 text-white" fill="currentColor" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
            <button
              onClick={handleStop}
              className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white transition-none"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Stop"
            >
              <Square className="w-4 h-4 text-white" fill="currentColor" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onNavigateHome}
              className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white transition-none"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Home"
            >
              <Home className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
            <button
              onClick={handleStart}
              className="bg-white border-2 border-white w-14 h-14 flex items-center justify-center hover:bg-black hover:text-white transition-none"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Start"
            >
              <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
            </button>
            <button
              className="bg-black border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white transition-none"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-white" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
