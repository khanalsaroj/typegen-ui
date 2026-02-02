import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/components/CommandPalette';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette />
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />

      <div className={cn('min-h-screen sidebar-transition', isCollapsed ? 'pl-16' : 'pl-60')}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
