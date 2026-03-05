import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import VehiclesPage from "./pages/VehiclesPage";
import MissionsPage from "./pages/MissionsPage";
import MissionDetailPage from "./pages/MissionDetailPage";
import NewMissionPage from "./pages/NewMissionPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  React.useEffect(() => {
    const onError = (message: any, source?: string, lineno?: number, colno?: number, error?: Error) => {
      // Ignorar erros de script externo e módulos não encontrados
      if (String(message).includes('ResizeObserver') || String(message).includes('Script error')) {
        return;
      }
      console.error('window.onerror', message, source, lineno, colno, error);
    };
    const onUnhandled = (e: PromiseRejectionEvent) => {
      // Ignorar erros desnecessários
      if (String(e.reason).includes('ResizeObserver') || String(e.reason).includes('abort')) {
        return;
      }
      console.error('unhandledrejection', e);
    };
    window.addEventListener('error', onError as any);
    window.addEventListener('unhandledrejection', onUnhandled);
    return () => {
      window.removeEventListener('error', onError as any);
      window.removeEventListener('unhandledrejection', onUnhandled);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
                <Route path="/missions" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
                <Route path="/missions/new" element={<ProtectedRoute><NewMissionPage /></ProtectedRoute>} />
                <Route path="/missions/:id" element={<ProtectedRoute><MissionDetailPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
