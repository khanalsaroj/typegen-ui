import { useCallback, useEffect, useState } from 'react';

export interface RecentAction {
  id: string;
  label: string;
  type: 'navigation' | 'action';
  timestamp: number;
}

const STORAGE_KEY = 'command-palette-recent-actions';
const MAX_RECENT_ACTIONS = 5;

function loadRecentActions(): RecentAction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load recent actions:', error);
  }
  return [];
}

function saveRecentActions(actions: RecentAction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch (error) {
    console.error('Failed to save recent actions:', error);
  }
}

export function useRecentActions() {
  const [recentActions, setRecentActions] = useState<RecentAction[]>(loadRecentActions);

  useEffect(() => {
    saveRecentActions(recentActions);
  }, [recentActions]);

  const addRecentAction = useCallback((action: Omit<RecentAction, 'timestamp'>) => {
    setRecentActions((prev) => {
      const filtered = prev.filter((a) => a.id !== action.id && a.label !== action.label);

      return [{ ...action, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT_ACTIONS);
    });
  }, []);

  const clearRecentActions = useCallback(() => {
    setRecentActions([]);
  }, []);

  return {
    recentActions,
    addRecentAction,
    clearRecentActions,
  };
}
