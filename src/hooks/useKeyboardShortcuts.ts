import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      for (const shortcut of shortcuts) {
        if (isInput && shortcut.key.toLowerCase() !== 'escape') {
          continue;
        }

        const ctrlMatch = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useSaveShortcut(onSave: () => void, enabled: boolean = true) {
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      description: 'Save',
      action: () => {
        if (enabled) onSave();
      },
    },
  ]);
}

export function useEscapeKey(onEscape: () => void) {
  useKeyboardShortcuts([
    {
      key: 'Escape',
      description: 'Close',
      action: onEscape,
    },
  ]);
}

export function useCopyShortcut(getText: () => string) {
  const { toast } = useToast();

  useKeyboardShortcuts([
    {
      key: 'c',
      ctrl: true,
      shift: true,
      description: 'Copy code',
      action: async () => {
        const text = getText();
        if (text) {
          await navigator.clipboard.writeText(text);
          toast({ title: 'Copied to clipboard' });
        }
      },
    },
  ]);
}

export function useGlobalShortcuts() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'g',
      ctrl: true,
      description: 'Go to Generator',
      action: () => navigate('/generator'),
    },
    {
      key: 'm',
      ctrl: true,
      description: 'Go to Mapper',
      action: () => navigate('/mapper'),
    },
    {
      key: 'd',
      ctrl: true,
      shift: true,
      description: 'Go to Dashboard',
      action: () => navigate('/'),
    },
    {
      key: 's',
      ctrl: true,
      shift: true,
      description: 'Go to Settings',
      action: () => navigate('/settings'),
    },
    {
      key: 'e',
      ctrl: true,
      description: 'Go to Explorer',
      action: () => navigate('/explorer'),
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show shortcuts help',
      action: () => {
        toast({
          title: 'Keyboard Shortcuts',
          description: 'Press Ctrl+Shift+S to open Settings and view all shortcuts',
        });
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}
