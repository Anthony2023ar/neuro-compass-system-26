
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import PatientDashboard from "./pages/PatientDashboard";
import ProfessionalLogin from "./pages/ProfessionalLogin";
import ProfessionalRegister from "./pages/ProfessionalRegister";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DatabasePage from "./pages/DatabasePage";
import ProfessionalApprovalPage from "./pages/ProfessionalApprovalPage";
import NotFound from "./pages/NotFound";
import { initializeSampleData } from "@/services/localStorage";

const queryClient = new QueryClient();

// Inicializar dados de exemplo
initializeSampleData();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/patient-register" element={<PatientRegister />} />
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute requiredUserType="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/professional-login" element={<ProfessionalLogin />} />
            <Route path="/professional-register" element={<ProfessionalRegister />} />
            <Route 
              path="/professional-dashboard" 
              element={
                <ProtectedRoute requiredUserType="professional">
                  <ProfessionalDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredUserType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/database" 
              element={
                <ProtectedRoute requiredUserType="admin">
                  <DatabasePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professional-approval" 
              element={
                <ProtectedRoute requiredUserType="admin">
                  <ProfessionalApprovalPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
