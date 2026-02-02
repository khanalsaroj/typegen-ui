import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Clock,
  Code2,
  Database,
  FileCode,
  History,
  Keyboard,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
  Trash2,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { RecentAction, useRecentActions } from '@/hooks/useRecentActions';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { recentActions, addRecentAction, clearRecentActions } = useRecentActions();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback(
    (
      command: () => void,
      actionId: string,
      actionLabel: string,
      actionType: 'navigation' | 'action',
    ) => {
      setOpen(false);
      addRecentAction({ id: actionId, label: actionLabel, type: actionType });
      command();
    },
    [addRecentAction],
  );

  useEffect(() => {
    const pathToLabel: Record<string, string> = {
      '/': 'Dashboard',
      '/generator': 'Type Generator',
      '/mapper': 'Mapper Generator',
      '/connections': 'Connections',
      '/settings': 'Settings',
      '/coming-soon': 'Coming Soon',
    };

    const label = pathToLabel[location.pathname];
    if (label) {
      addRecentAction({ id: location.pathname, label, type: 'navigation' });
    }
  }, [location.pathname, addRecentAction]);

  const getIconForAction = (action: RecentAction) => {
    const iconMap: Record<string, ReactNode> = {
      '/': <LayoutDashboard size={16} />,
      '/generator': <Code2 size={16} />,
      '/mapper': <FileCode size={16} />,
      '/connections': <Database size={16} />,
      '/settings': <Settings size={16} />,
      '/coming-soon': <Clock size={16} />,
      'toggle-theme': theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
      'show-shortcuts': <Keyboard size={16} />,
    };
    return iconMap[action.id] || <History size={16} />;
  };

  const navigationItems: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
      shortcut: '⌘⇧D',
      action: () => navigate('/'),
      keywords: ['home', 'main'],
    },
    {
      id: 'generator',
      label: 'Type Generator',
      icon: <Code2 size={16} />,
      shortcut: '⌘G',
      action: () => navigate('/generator'),
      keywords: ['types', 'generate', 'code'],
    },
    {
      id: 'mapper',
      label: 'Mapper Generator',
      icon: <FileCode size={16} />,
      shortcut: '⌘M',
      action: () => navigate('/mapper'),
      keywords: ['crud', 'repository', 'dao'],
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: <Database size={16} />,
      action: () => navigate('/connections'),
      keywords: ['database', 'connect'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      shortcut: '⌘⇧S',
      action: () => navigate('/settings'),
      keywords: ['preferences', 'config'],
    },
    {
      id: 'coming-soon',
      label: 'Coming Soon',
      icon: <Clock size={16} />,
      action: () => navigate('/coming-soon'),
      keywords: ['future', 'planned'],
    },
  ];

  const actionItems: CommandItem[] = [
    {
      id: 'toggle-theme',
      label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        toast({
          title: `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`,
        });
      },
      keywords: ['theme', 'dark', 'light', 'mode'],
    },
    {
      id: 'show-shortcuts',
      label: 'View Keyboard Shortcuts',
      icon: <Keyboard size={16} />,
      shortcut: '⌘/',
      action: () => {
        navigate('/settings');
        toast({
          title: 'Keyboard Shortcuts',
          description: 'View all shortcuts in the Settings page',
        });
      },
      keywords: ['keyboard', 'hotkeys', 'keybindings'],
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {recentActions.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentActions.map((action) => (
                <CommandItem
                  key={`recent-${action.id}-${action.timestamp}`}
                  value={`recent ${action.label}`}
                  onSelect={() => {
                    setOpen(false);
                    if (action.type === 'navigation') {
                      navigate(action.id);
                    } else {
                      const foundAction = actionItems.find((a) => a.id === action.id);
                      if (foundAction) {
                        foundAction.action();
                      }
                    }
                  }}
                >
                  <span className="mr-2 text-muted-foreground">{getIconForAction(action)}</span>
                  {action.label}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {action.type === 'navigation' ? 'Page' : 'Action'}
                  </span>
                </CommandItem>
              ))}
              <CommandItem
                value="clear recent history"
                onSelect={() => {
                  clearRecentActions();
                  toast({ title: 'Recent history cleared' });
                }}
                className="text-muted-foreground"
              >
                <span className="mr-2 text-muted-foreground">
                  <Trash2 size={16} />
                </span>
                Clear Recent History
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(item.action, item.id, item.label, 'navigation')}
            >
              <span className="mr-2 text-muted-foreground">{item.icon}</span>
              {item.label}
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {actionItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(item.action, item.id, item.label, 'action')}
            >
              <span className="mr-2 text-muted-foreground">{item.icon}</span>
              {item.label}
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandPalette;
