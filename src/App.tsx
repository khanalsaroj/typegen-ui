import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import Index from './pages/Index';
import { Connections } from './pages/Connections/Connections';
import { Generator } from './pages/Generator/Generator';
import { Mapper } from './pages/Mapper/Mapper';
import { Settings } from './pages/Settings/Settings';
import { ComingSoon } from './pages/ComingSoon/ComingSoon';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/mapper" element={<Mapper />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
