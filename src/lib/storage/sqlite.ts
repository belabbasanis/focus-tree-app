/**
 * SQLite storage implementation for native platforms
 */

import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import type { IStorage } from './index';
import type { Session, GridPlacement, StorageResult } from './types';
import { createStorageError } from './errors';

const DB_NAME = 'focustree';
const DB_VERSION = 1;

export class SQLiteStorage implements IStorage {
  private connection: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;

  async initialize(): Promise<StorageResult<void>> {
    console.log('[FT][SQL][INIT] Starting SQLite initialization');
    
    try {
      // Only use SQLite on native platforms
      if (!Capacitor.isNativePlatform()) {
        console.log('[FT][SQL][INIT] Not native platform, skipping SQLite');
        return { 
          success: false, 
          error: createStorageError('STORAGE_ERROR', 'SQLite only available on native platforms') 
        };
      }

      console.log('[FT][SQL][INIT] Creating SQLiteConnection');
      this.connection = new SQLiteConnection(CapacitorSQLite);
      
      console.log('[FT][SQL][INIT] Creating connection with:', {
        database: DB_NAME,
        encrypted: false,
        mode: 'no-encryption',
        version: DB_VERSION,
        readonly: false
      });
      
      this.db = await this.connection.createConnection(
        DB_NAME,
        false, // encrypted
        'no-encryption',
        DB_VERSION,
        false // readonly
      );

      console.log('[FT][SQL][INIT] Connection created, opening database');
      await this.db.open();
      console.log('[FT][SQL][INIT] Database opened successfully');
      
      // Verify database is open
      const isOpen = await this.db.isDBOpen();
      console.log('[FT][SQL][INIT] Database open check:', isOpen);
      
      console.log('[FT][SQL][INIT] Creating tables');
      await this.createTables();
      console.log('[FT][SQL][INIT] Tables created successfully');
      console.log('[FT][SQL][INIT] Initialization complete');
      
      return { success: true, data: undefined };
    } catch (error) {
      console.error('[FT][SQL][INIT][ERROR]', error);
      return { 
        success: false, 
        error: createStorageError('STORAGE_ERROR', 'Failed to initialize database', error) 
      };
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Sessions table (append-only)
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        startedAt TEXT NOT NULL,
        endedAt TEXT,
        duration INTEGER NOT NULL
      )
    `);

    // Grid table (idempotent writes)
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS grid (
        id TEXT PRIMARY KEY,
        row INTEGER NOT NULL,
        col INTEGER NOT NULL,
        spriteId TEXT NOT NULL,
        UNIQUE(row, col)
      )
    `);
  }

  async getAllSessions(): Promise<StorageResult<Session[]>> {
    try {
      if (!this.db) {
        return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
      }

      const result = await this.db.query('SELECT * FROM sessions ORDER BY startedAt DESC');
      return { success: true, data: result.values as Session[] };
    } catch (error) {
      return { 
        success: false, 
        error: createStorageError('STORAGE_ERROR', 'Failed to get sessions', error) 
      };
    }
  }

  async addSession(session: Omit<Session, 'id'> & { id?: string }): Promise<StorageResult<Session>> {
    console.log('[FT][SQL][ADD_SESSION]', session);
    console.log('[FT][SQL][ADD_SESSION] db exists:', !!this.db);
    console.log('[FT][SQL][ADD_SESSION] connection exists:', !!this.connection);
    
    try {
      if (!this.db) {
        console.error('[FT][SQL][ERROR] Database not initialized - db is null');
        return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
      }

      // Verify database is still open
      try {
        const isOpen = await this.db.isDBOpen();
        console.log('[FT][SQL][ADD_SESSION] Database is open:', isOpen);
        if (!isOpen.result) {
          console.error('[FT][SQL][ERROR] Database is not open, attempting to reopen');
          await this.db.open();
          console.log('[FT][SQL][ADD_SESSION] Database reopened');
        }
      } catch (checkError) {
        console.error('[FT][SQL][ERROR] Failed to check if database is open:', checkError);
        // Try to reopen anyway
        try {
          await this.db.open();
          console.log('[FT][SQL][ADD_SESSION] Database reopened after check error');
        } catch (reopenError) {
          console.error('[FT][SQL][ERROR] Failed to reopen database:', reopenError);
          throw reopenError;
        }
      }

      const id = session.id || crypto.randomUUID();
      const fullSession: Session = { ...session, id };

      const statement = 'INSERT INTO sessions (id, startedAt, endedAt, duration) VALUES (?, ?, ?, ?)';
      const values = [id, fullSession.startedAt, fullSession.endedAt, fullSession.duration];
      
      console.log('[FT][SQL][INSERT]', {
        statement,
        values,
        session: fullSession,
      });

      try {
        const result = await this.db.run(statement, values);
        console.log('[FT][SQL][RESULT]', result);
        
        return { success: true, data: fullSession };
      } catch (err) {
        console.error('[FT][SQL][ERROR]', err);
        throw err;
      }
    } catch (error) {
      console.error('[FT][SQL][ERROR] Outer catch:', error);
      return { 
        success: false, 
        error: createStorageError('CONSTRAINT_ERROR', 'Failed to add session', error) 
      };
    }
  }

  async getPlacedSprites(): Promise<StorageResult<GridPlacement[]>> {
    try {
      if (!this.db) {
        return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
      }

      const result = await this.db.query('SELECT * FROM grid');
      return { success: true, data: result.values as GridPlacement[] };
    } catch (error) {
      return { 
        success: false, 
        error: createStorageError('STORAGE_ERROR', 'Failed to get placed sprites', error) 
      };
    }
  }

  async addPlacedSprite(placement: Omit<GridPlacement, 'id'> & { id?: string }): Promise<StorageResult<GridPlacement>> {
    try {
      if (!this.db) {
        return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
      }

      const id = placement.id || crypto.randomUUID();
      const fullPlacement: GridPlacement = { ...placement, id };

      // Idempotent: Use INSERT OR REPLACE
      await this.db.run(
        'INSERT OR REPLACE INTO grid (id, row, col, spriteId) VALUES (?, ?, ?, ?)',
        [id, fullPlacement.row, fullPlacement.col, fullPlacement.spriteId]
      );

      return { success: true, data: fullPlacement };
    } catch (error) {
      return { 
        success: false, 
        error: createStorageError('CONSTRAINT_ERROR', 'Failed to add placed sprite', error) 
      };
    }
  }

  async removePlacedSprite(id: string): Promise<StorageResult<void>> {
    try {
      if (!this.db) {
        return { success: false, error: createStorageError('STORAGE_ERROR', 'Database not initialized') };
      }

      await this.db.run('DELETE FROM grid WHERE id = ?', [id]);
      return { success: true, data: undefined };
    } catch (error) {
      return { 
        success: false, 
        error: createStorageError('STORAGE_ERROR', 'Failed to remove placed sprite', error) 
      };
    }
  }

  async close(): Promise<void> {
    if (this.db && this.connection) {
      await this.connection.closeConnection(DB_NAME, false);
      this.db = null;
      this.connection = null;
    }
  }
}

