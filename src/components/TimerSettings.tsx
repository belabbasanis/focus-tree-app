import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { DRAWER, ICON, TEXT, BTN, COLOR, LAYOUT } from '../lib/ui';
import { createStorage } from '../lib/storage';

interface TimerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onPresetsChange: (presets: number[]) => void;
  currentPresets: number[];
}

const DEFAULT_PRESETS = [15, 25, 45]; // minutes - production defaults

const TimerSettings = ({
  isOpen,
  onClose,
  onPresetsChange,
  currentPresets,
}: TimerSettingsProps) => {
  const [presets, setPresets] = useState<number[]>(currentPresets);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setPresets(currentPresets);
  }, [currentPresets]);

  const handlePresetChange = (index: number, value: number) => {
    const newPresets = [...presets];
    newPresets[index] = Math.max(1, Math.min(120, value)); // Clamp between 1-120 minutes
    setPresets(newPresets);
  };

  const handleAddPreset = () => {
    if (presets.length < 5) {
      setPresets([...presets, 25]); // Default new preset to 25 minutes
    }
  };

  const handleRemovePreset = (index: number) => {
    if (presets.length > 1) {
      const newPresets = presets.filter((_, i) => i !== index);
      setPresets(newPresets);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const storage = createStorage();
    await storage.initialize();
    
    // Save presets as JSON string
    const result = await storage.setSetting('timer_presets', JSON.stringify(presets));
    
    if (result.success) {
      onPresetsChange(presets);
      onClose();
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    setPresets(DEFAULT_PRESETS);
  };

  const formatMinutes = (minutes: number): string => {
    return `${minutes} MIN`;
  };

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
            TIMER SETTINGS
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
        {/* Presets Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div className={`${COLOR.white} ${TEXT.xs} ${TEXT.retro} ${TEXT.uppercase}`} style={{ marginBottom: '1rem' }}>
            SESSION DURATIONS
          </div>
          
          <div className={LAYOUT.centeredColumn} style={{ gap: '0.75rem' }}>
            {presets.map((preset, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <button
                  onClick={() => handlePresetChange(index, preset - 1)}
                  className="bg-black border-2 border-white h-8 w-8 flex items-center justify-center transition-none hover:bg-[rgba(255,255,255,0.1)]"
                  style={ICON.pixel}
                  aria-label="Decrease"
                >
                  <span className="w-4 h-4 text-white flex items-center justify-center">−</span>
                </button>
                <div className={`${LAYOUT.statsItem} flex-1`} style={ICON.pixel}>
                  <span className={`${TEXT.sm} ${TEXT.retro} ${COLOR.white}`}>
                    {formatMinutes(preset)}
                  </span>
                </div>
                <button
                  onClick={() => handlePresetChange(index, preset + 1)}
                  className="bg-black border-2 border-white h-8 w-8 flex items-center justify-center transition-none hover:bg-[rgba(255,255,255,0.1)]"
                  style={ICON.pixel}
                  aria-label="Increase"
                >
                  <span className="w-4 h-4 text-white flex items-center justify-center">+</span>
                </button>
                {presets.length > 1 && (
                  <button
                    onClick={() => handleRemovePreset(index)}
                    className="bg-black border-2 border-white h-8 w-8 flex items-center justify-center transition-none hover:bg-white hover:text-black"
                    style={ICON.pixel}
                    aria-label="Remove preset"
                  >
                    <X className={`${ICON.small} ${COLOR.white}`} style={ICON.lucideWhite} />
                  </button>
                )}
              </div>
            ))}
            
            {presets.length < 5 && (
              <button
                onClick={handleAddPreset}
                className={BTN.preset}
                style={ICON.pixel}
              >
                + ADD PRESET
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={LAYOUT.centeredFlex} style={{ gap: '1rem' }}>
          <button
            onClick={handleReset}
            className={BTN.preset}
            style={ICON.pixel}
            disabled={isSaving}
          >
            RESET
          </button>
          <button
            onClick={handleSave}
            className={BTN.presetSelected}
            style={ICON.pixel}
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default TimerSettings;

