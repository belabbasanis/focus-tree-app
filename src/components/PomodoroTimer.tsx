import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const PRESETS = [15, 25, 45]; // minutes

const PomodoroTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // default 25 minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to MM:SS
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

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
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
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center fixed inset-0">
      <div className="flex flex-col items-center justify-center space-y-8 px-4">
        {/* Timer Display */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-indigo-900 text-7xl md:text-8xl font-mono font-bold tracking-wider drop-shadow-lg">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-indigo-700 text-lg md:text-xl font-medium">
            Focus Session
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartPause}
            className="bg-white/90 hover:bg-white text-indigo-600 rounded-full p-4 md:p-5 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="bg-white/90 hover:bg-white text-indigo-600 rounded-full p-4 md:p-5 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Reset"
          >
            <RotateCcw className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="flex gap-3 mt-4">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetSelect(preset)}
              disabled={isRunning}
              className={cn(
                'px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-200',
                selectedDuration === preset
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 text-indigo-600 hover:bg-white shadow-md hover:scale-105',
                isRunning && 'opacity-50 cursor-not-allowed hover:scale-100'
              )}
            >
              {preset} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;

