import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WeddingProvider } from "./contexts/WeddingContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateWedding from "./pages/CreateWedding";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PublicInvitation from "./pages/PublicInvitation";
import PublicCountdown from "./pages/PublicCountdown";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WeddingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateWedding />
                  </ProtectedRoute>
                }
              />
              <Route path="/invitation/:shareToken" element={<PublicInvitation />} />
              <Route path="/countdown/:shareToken" element={<PublicCountdown />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WeddingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
