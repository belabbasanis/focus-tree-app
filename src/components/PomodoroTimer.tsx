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
    <div className="h-screen w-screen flex flex-col fixed inset-0 relative overflow-hidden">
      {/* Static Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/bg-calm-sea.png)',
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4" style={{ paddingTop: '140px' }}>
        <div className="flex flex-col items-center space-y-4">
          {/* Timer - using Neue Pixel font */}
          <div className="text-white text-8xl md:text-9xl font-pixel font-bold tracking-wider drop-shadow-2xl" style={{
            textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
            letterSpacing: '0.1em'
          }}>
            {formatTime(timeRemaining)}
          </div>
          
          {/* Focus Session Label - using PX Grotesk Pan */}
          <div className="text-white/90 text-xl md:text-2xl font-grotesk font-medium">
            Focus Session
          </div>

          {/* Preset Buttons - Chip style toggle buttons - Hidden when running */}
          {!isRunning && (
            <div className="flex gap-3 mt-6">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'px-4 py-2 rounded-full font-grotesk font-medium text-sm transition-all duration-200',
                    selectedDuration === preset
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  )}
                >
                  {preset} min
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar - Centered horizontally */}
      <div className="relative z-10 fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6">
        {isRunning ? (
          <>
            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Reset"
            >
              <RotateCcw className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={handlePause}
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Pause"
            >
              <Pause className="w-6 h-6 text-gray-800" fill="currentColor" />
            </button>
            <button
              onClick={handleStop}
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Stop"
            >
              <Square className="w-5 h-5 text-gray-800" fill="currentColor" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onNavigateHome}
              className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/50 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Home"
            >
              <Home className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleStart}
              className="w-16 h-16 rounded-full bg-black hover:bg-gray-900 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Start"
            >
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </button>
            <button
              className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/50 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
