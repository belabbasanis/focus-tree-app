/**
 * Storage interface and factory
 */

import { Capacitor } from '@capacitor/core';
import { SQLiteStorage } from './sqlite';
import { WebStorage } from './web';
import type { Session, GridPlacement, StorageResult } from './types';

export interface IStorage {
  // Sessions (append-only)
  getAllSessions(): Promise<StorageResult<Session[]>>;
  addSession(session: Omit<Session, 'id'> & { id?: string }): Promise<StorageResult<Session>>;
  
  // Grid (idempotent writes)
  getPlacedSprites(): Promise<StorageResult<GridPlacement[]>>;
  addPlacedSprite(placement: Omit<GridPlacement, 'id'> & { id?: string }): Promise<StorageResult<GridPlacement>>;
  removePlacedSprite(id: string): Promise<StorageResult<void>>;
  
  // Settings (key-value store)
  getSetting(key: string): Promise<StorageResult<string | null>>;
  setSetting(key: string, value: string): Promise<StorageResult<void>>;
  
  // Lifecycle
  initialize(): Promise<StorageResult<void>>;
  close(): Promise<void>;
}

/**
 * Factory function to create the appropriate storage implementation
 * based on the platform (SQLite for native, IndexedDB for web)
 */
export function createStorage(): IStorage {
  if (Capacitor.isNativePlatform()) {
    return new SQLiteStorage();
  }
  return new WebStorage();
}

// Re-export types for convenience
export type { Session, GridPlacement, StorageResult, StorageError, Setting } from './types';

