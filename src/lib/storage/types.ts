/**
 * Core type definitions for the storage layer
 */

export interface Session {
  id: string;
  startedAt: string; // ISO 8601 timestamp
  endedAt: string | null; // ISO 8601 timestamp, null if ongoing
  duration: number; // seconds
}

export interface GridPlacement {
  id: string;
  row: number;
  col: number;
  spriteId: string;
}

export interface StorageError {
  code: 'STORAGE_ERROR' | 'SCHEMA_ERROR' | 'CONSTRAINT_ERROR';
  message: string;
  cause?: unknown;
}

export type StorageResult<T> = 
  | { success: true; data: T }
  | { success: false; error: StorageError };

