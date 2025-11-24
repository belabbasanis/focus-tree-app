/**
 * Streak calculation utility
 * Calculates daily streaks based on completed focus sessions
 */

import type { Session } from './storage/types';

/**
 * Calculate the current streak based on completed sessions
 * Streak increments when a session is completed on a day, and resets if a day is missed
 * 
 * @param sessions - Array of all sessions
 * @returns Current streak count (number of consecutive days with at least one completed session)
 */
export function calculateStreak(sessions: Session[]): number {
  // Filter to only completed sessions (must have endedAt)
  const completedSessions = sessions.filter(session => session.endedAt !== null);
  
  if (completedSessions.length === 0) {
    return 0;
  }

  // Extract unique dates from completed sessions (using local date, ignoring time)
  const sessionDates = new Set<string>();
  
  completedSessions.forEach(session => {
    if (session.endedAt) {
      const date = new Date(session.endedAt);
      // Convert to local date string (YYYY-MM-DD format)
      const dateStr = date.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
      sessionDates.add(dateStr);
    }
  });

  // Convert to array and sort descending (most recent first)
  const sortedDates = Array.from(sessionDates)
    .map(dateStr => new Date(dateStr + 'T00:00:00')) // Add time to avoid timezone issues
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDates.length === 0) {
    return 0;
  }

  // Get today's date (local, ignoring time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toLocaleDateString('en-CA');

  // Get yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  // Determine starting point for streak calculation
  const mostRecentDateStr = sortedDates[0].toLocaleDateString('en-CA');
  
  // If most recent session is not today or yesterday, streak is broken
  if (mostRecentDateStr !== todayStr && mostRecentDateStr !== yesterdayStr) {
    return 0;
  }

  // Start counting from the most recent date
  let streak = 0;
  let expectedDate = new Date(sortedDates[0]);
  expectedDate.setHours(0, 0, 0, 0);

  // Count consecutive days backwards
  for (const sessionDate of sortedDates) {
    const checkDate = new Date(sessionDate);
    checkDate.setHours(0, 0, 0, 0);
    const checkDateStr = checkDate.toLocaleDateString('en-CA');
    const expectedDateStr = expectedDate.toLocaleDateString('en-CA');

    if (checkDateStr === expectedDateStr) {
      streak++;
      // Move to previous day
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap found (date doesn't match expected), streak is broken
      break;
    }
  }

  return streak;
}

