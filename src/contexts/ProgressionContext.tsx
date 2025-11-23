import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { createStorage, type Session, type GridPlacement, type IStorage } from '../lib/storage';
import { SPRITES } from '../config/sprites';
import type { PlacedSprite } from '../types/sprite';

interface ProgressionState {
  sessions: Session[];
  placedSprites: PlacedSprite[];
  totalSessions: number;
  allowedSprites: number;
  usedSprites: number;
  canPlace: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ProgressionContextValue extends ProgressionState {
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  addPlacedSprite: (row: number, col: number, spriteId: string) => Promise<void>;
  removePlacedSprite: (id: string) => Promise<void>;
}

const ProgressionContext = createContext<ProgressionContextValue | null>(null);

export function ProgressionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressionState>({
    sessions: [],
    placedSprites: [],
    totalSessions: 0,
    allowedSprites: 1,
    usedSprites: 0,
    canPlace: true,
    isLoading: true,
    error: null,
  });

  // Use useRef to persist storage instance across renders
  // This ensures the same instance is initialized and used for all operations
  const storageRef = useRef<IStorage | null>(null);
  if (!storageRef.current) {
    storageRef.current = createStorage();
    console.log('[FT][CTX] Created new storage instance');
  }
  const storage = storageRef.current;

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      console.log('[FT][CTX][INIT] Initializing storage');
      const initResult = await storage.initialize();
      console.log('[FT][CTX][INIT] Storage init result:', initResult.success ? 'SUCCESS' : initResult.error.message);
      
      if (!initResult.success) {
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false, error: initResult.error.message }));
        }
        return;
      }

      const [sessionsResult, spritesResult] = await Promise.all([
        storage.getAllSessions(),
        storage.getPlacedSprites(),
      ]);

      if (!mounted) return;

      if (!sessionsResult.success) {
        setState(prev => ({ ...prev, isLoading: false, error: sessionsResult.error.message }));
        return;
      }

      if (!spritesResult.success) {
        setState(prev => ({ ...prev, isLoading: false, error: spritesResult.error.message }));
        return;
      }

      const sessions = sessionsResult.data;
      const gridPlacements = spritesResult.data;
      
      // Convert grid placements to PlacedSprite format
      const placedSprites: PlacedSprite[] = gridPlacements
        .map(placement => {
          const sprite = SPRITES.find(s => s.id === placement.spriteId);
          if (!sprite) return null;
          return {
            spriteId: placement.spriteId,
            sprite,
            row: placement.row,
            col: placement.col,
          };
        })
        .filter((s): s is PlacedSprite => s !== null);

      const totalSessions = sessions.length;
      const allowedSprites = 1 + totalSessions;
      const usedSprites = placedSprites.length;
      const canPlace = usedSprites < allowedSprites;

      setState({
        sessions,
        placedSprites,
        totalSessions,
        allowedSprites,
        usedSprites,
        canPlace,
        isLoading: false,
        error: null,
      });
    }

    loadData();

    return () => {
      mounted = false;
      storage.close();
    };
  }, []);

  const addSession = async (session: Omit<Session, 'id'>) => {
    console.log('[FT][CTX][ADD_SESSION] Calling storage.addSession on instance:', !!storage);
    const result = await storage.addSession(session);
    if (!result.success) {
      setState(prev => ({ ...prev, error: result.error.message }));
      return;
    }

    setState(prev => {
      const newSessions = [result.data, ...prev.sessions];
      const totalSessions = newSessions.length;
      const allowedSprites = 1 + totalSessions;
      return {
        ...prev,
        sessions: newSessions,
        totalSessions,
        allowedSprites,
        canPlace: prev.usedSprites < allowedSprites,
      };
    });
  };

  const addPlacedSprite = async (row: number, col: number, spriteId: string) => {
    // Use composite key for id: row-col
    const id = `${row}-${col}`;
    const result = await storage.addPlacedSprite({ id, row, col, spriteId });
    if (!result.success) {
      setState(prev => ({ ...prev, error: result.error.message }));
      return;
    }

    const sprite = SPRITES.find(s => s.id === spriteId);
    if (!sprite) {
      setState(prev => ({ ...prev, error: `Sprite ${spriteId} not found` }));
      return;
    }

    setState(prev => {
      const newPlacedSprites = [
        ...prev.placedSprites.filter(s => !(s.row === row && s.col === col)),
        {
          spriteId,
          sprite,
          row,
          col,
        },
      ];
      const usedSprites = newPlacedSprites.length;
      return {
        ...prev,
        placedSprites: newPlacedSprites,
        usedSprites,
        canPlace: usedSprites < prev.allowedSprites,
        error: null,
      };
    });
  };

  const removePlacedSprite = async (id: string) => {
    const result = await storage.removePlacedSprite(id);
    if (!result.success) {
      setState(prev => ({ ...prev, error: result.error.message }));
      return;
    }

    setState(prev => {
      // Parse id as row-col format
      const [rowStr, colStr] = id.split('-');
      const row = parseInt(rowStr, 10);
      const col = parseInt(colStr, 10);
      
      const newPlacedSprites = prev.placedSprites.filter(
        s => !(s.row === row && s.col === col)
      );
      const usedSprites = newPlacedSprites.length;
      return {
        ...prev,
        placedSprites: newPlacedSprites,
        usedSprites,
        canPlace: usedSprites < prev.allowedSprites,
        error: null,
      };
    });
  };

  return (
    <ProgressionContext.Provider
      value={{
        ...state,
        addSession,
        addPlacedSprite,
        removePlacedSprite,
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
}

export function useProgression() {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within ProgressionProvider');
  }
  return context;
}

