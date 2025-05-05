
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";
import SeekCap from "./pages/SeekCap";
import DDX from "./pages/DDX";
import DDXUseCases from "./pages/DDXUseCases";
import ParaGuard from "./pages/ParaGuard";
import SecondLook from "./pages/SecondLook";
import Careers from "./pages/Careers";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SecurityPerpetual from "./pages/SecurityPerpetual";
import Licensing from "./pages/Licensing";
import Downloads from "./pages/Downloads";
import Support from "./pages/Support";

// Admin Pages
import UsersPage from "./pages/admin/UsersPage";
import ActionsPage from "./pages/admin/ActionsPage";
import PermissionsPage from "./pages/admin/PermissionsPage";
import DownloadsAdminPage from "./pages/admin/DownloadsAdminPage";
import LicensingAdminPage from "./pages/admin/LicensingAdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/team" element={<Team />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              
              {/* Product routes */}
              <Route path="/seekcap" element={<SeekCap />} />
              <Route path="/ddx" element={<DDX />} />
              <Route path="/ddx/use-cases" element={<DDXUseCases />} />
              <Route path="/paraguard" element={<ParaGuard />} />
              <Route path="/secondlook" element={<SecondLook />} />
              <Route path="/security-perpetual" element={<SecurityPerpetual />} />
              
              {/* Protected routes requiring authentication and approval */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/licensing" element={
                <ProtectedRoute>
                  <Licensing />
                </ProtectedRoute>
              } />
              <Route path="/downloads" element={
                <ProtectedRoute>
                  <Downloads />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/actions" element={
                <ProtectedRoute requireAdmin={true}>
                  <ActionsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/permissions" element={
                <ProtectedRoute requireAdmin={true}>
                  <PermissionsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/downloads" element={
                <ProtectedRoute requireAdmin={true}>
                  <DownloadsAdminPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/licensing" element={
                <ProtectedRoute requireAdmin={true}>
                  <LicensingAdminPage />
                </ProtectedRoute>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
