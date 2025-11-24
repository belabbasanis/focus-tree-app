/**
 * IndexedDB storage implementation for web platform
 */

import type { IStorage } from './index';
import type { Session, GridPlacement, StorageResult } from './types';
import { createStorageError } from './errors';

const DB_NAME = 'focustree';
const STORE_SESSIONS = 'sessions';
const STORE_GRID = 'grid';
const STORE_SETTINGS = 'settings';

export class WebStorage implements IStorage {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<StorageResult<void>> {
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'Failed to open IndexedDB') 
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve({ success: true, data: undefined });
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
          db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(STORE_GRID)) {
          const gridStore = db.createObjectStore(STORE_GRID, { keyPath: 'id' });
          gridStore.createIndex('row_col', ['row', 'col'], { unique: true });
        }
        
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };
    });
  }

  async getAllSessions(): Promise<StorageResult<Session[]>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_SESSIONS], 'readonly');
      const store = transaction.objectStore(STORE_SESSIONS);
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions = request.result as Session[];
        // Sort by startedAt descending
        sessions.sort((a, b) => 
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
        resolve({ success: true, data: sessions });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'Failed to get sessions') 
        });
      };
    });
  }

  async addSession(session: Omit<Session, 'id'> & { id?: string }): Promise<StorageResult<Session>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    const id = session.id || crypto.randomUUID();
    const fullSession: Session = { ...session, id };

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_SESSIONS], 'readwrite');
      const store = transaction.objectStore(STORE_SESSIONS);
      const request = store.add(fullSession);

      request.onsuccess = () => {
        resolve({ success: true, data: fullSession });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('CONSTRAINT_ERROR', 'Failed to add session') 
        });
      };
    });
  }

  async getPlacedSprites(): Promise<StorageResult<GridPlacement[]>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_GRID], 'readonly');
      const store = transaction.objectStore(STORE_GRID);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve({ success: true, data: request.result as GridPlacement[] });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'Failed to get placed sprites') 
        });
      };
    });
  }

  async addPlacedSprite(placement: Omit<GridPlacement, 'id'> & { id?: string }): Promise<StorageResult<GridPlacement>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    const id = placement.id || crypto.randomUUID();
    const fullPlacement: GridPlacement = { ...placement, id };

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_GRID], 'readwrite');
      const store = transaction.objectStore(STORE_GRID);
      const request = store.put(fullPlacement); // put = idempotent

      request.onsuccess = () => {
        resolve({ success: true, data: fullPlacement });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('CONSTRAINT_ERROR', 'Failed to add placed sprite') 
        });
      };
    });
  }

  async removePlacedSprite(id: string): Promise<StorageResult<void>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_GRID], 'readwrite');
      const store = transaction.objectStore(STORE_GRID);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve({ success: true, data: undefined });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'Failed to remove placed sprite') 
        });
      };
    });
  }

  async getSetting(key: string): Promise<StorageResult<string | null>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_SETTINGS], 'readonly');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve({ success: true, data: result ? result.value : null });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'Failed to get setting') 
        });
      };
    });
  }

  async setSetting(key: string, value: string): Promise<StorageResult<void>> {
    if (!this.db) {
      return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_SETTINGS], 'readwrite');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.put({ key, value });

      request.onsuccess = () => {
        resolve({ success: true, data: undefined });
      };

      request.onerror = () => {
        resolve({ 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'Failed to set setting') 
        });
      };
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

