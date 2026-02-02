import { useState } from 'react';
import { Keyboard, Moon, Sun } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { apiClient } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useGlobalShortcuts, useSaveShortcut } from '@/hooks/useKeyboardShortcuts';

const SHORTCUTS = [
  { keys: ['Ctrl', 'Shift', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['Ctrl', 'G'], description: 'Go to Generator', category: 'Navigation' },
  { keys: ['Ctrl', 'M'], description: 'Go to Mapper', category: 'Navigation' },
  { keys: ['Ctrl', 'E'], description: 'Go to Explorer', category: 'Navigation' },
  { keys: ['Ctrl', 'Shift', 'S'], description: 'Go to Settings', category: 'Navigation' },
  { keys: ['Ctrl', '/'], description: 'Show shortcuts help', category: 'Navigation' },
  { keys: ['Ctrl', 'S'], description: 'Save changes', category: 'Actions' },
  { keys: ['Ctrl', 'Shift', 'C'], description: 'Copy generated code', category: 'Actions' },
  { keys: ['Escape'], description: 'Close modal / cancel', category: 'Actions' },
];

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [apiBaseUrl, setApiBaseUrl] = useState(apiClient.getBaseUrl());
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    apiClient.setBaseUrl(apiBaseUrl);
    setHasChanges(false);
    toast({
      title: 'Settings saved',
      description: 'Your configuration has been updated.',
    });
  };

  useGlobalShortcuts();
  useSaveShortcut(handleSave, hasChanges);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your TypeGen preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-muted-foreground" />
                ) : (
                  <Sun size={20} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize how TypeGen looks</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Keyboard size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">Keyboard Shortcuts</h2>
                <p className="text-sm text-muted-foreground">Quick navigation with keyboard</p>
              </div>
            </div>
            {/* Navigation Shortcuts */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Navigation
              </p>
              {SHORTCUTS.filter((s) => s.category === 'Navigation').map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-0.5 text-xs font-mono rounded border border-border bg-muted"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Shortcuts */}
            <div className="space-y-1 pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Actions
              </p>
              {SHORTCUTS.filter((s) => s.category === 'Actions').map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-0.5 text-xs font-mono rounded border border-border bg-muted"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
