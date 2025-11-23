/**
 * Error utilities for storage layer
 */

import type { StorageError } from './types';

export function createStorageError(
  code: StorageError['code'],
  message: string,
  cause?: unknown
): StorageError {
  return { code, message, cause };
}

export function isStorageError(error: unknown): error is StorageError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    (error.code === 'STORAGE_ERROR' || 
     error.code === 'SCHEMA_ERROR' || 
     error.code === 'CONSTRAINT_ERROR')
  );
}

