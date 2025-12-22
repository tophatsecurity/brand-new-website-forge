
import { Toaster } from "@/components/ui/toaster";
import PartnerDashboardPage from "./pages/partner/PartnerDashboardPage";
import PartnerDealsPage from "./pages/partner/PartnerDealsPage";
import PriceCalculatorPage from "./pages/admin/PriceCalculatorPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import ProgramManagerRoute from "@/components/auth/ProgramManagerRoute";

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
import Lightfoot from "./pages/Lightfoot";
import Orange from "./pages/Orange";
import OnboardProduct from "./pages/OnboardProduct";
import AuroraSense from "./pages/AuroraSense";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SecurityPerpetual from "./pages/SecurityPerpetual";
import Licensing from "./pages/Licensing";
import Entitlements from "./pages/Entitlements";
import Catalog from "./pages/Catalog";
import Downloads from "./pages/Downloads";
import Support from "./pages/Support";
import SupportTickets from "./pages/SupportTickets";
import Credits from "./pages/Credits";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import UseOfCookies from "./pages/UseOfCookies";

// Admin Pages
import UsersPage from "./pages/admin/UsersPage";
import ActionsPage from "./pages/admin/ActionsPage";
import PermissionsPage from "./pages/admin/PermissionsPage";
import DownloadsAdminPage from "./pages/admin/DownloadsAdminPage";
import LicensingAdminPage from "./pages/admin/LicensingAdminPage";
import CatalogAdminPage from "./pages/admin/CatalogAdminPage";
import CreditsAdminPage from "./pages/admin/CreditsAdminPage";
import OnboardingAdminPage from "./pages/admin/OnboardingAdminPage";
import SettingsAdminPage from "./pages/admin/SettingsAdminPage";
import CRMAdminPage from "./pages/admin/CRMAdminPage";
import RoleAssignmentPage from "./pages/admin/RoleAssignmentPage";
import PaymentApprovalsPage from "./pages/admin/PaymentApprovalsPage";
import FeatureRequestsAdminPage from "./pages/admin/FeatureRequestsAdminPage";
import SupportAdminPage from "./pages/admin/SupportAdminPage";
import FeatureRequests from "./pages/FeatureRequests";
import Onboarding from "./pages/Onboarding";
import RolesReference from "./pages/RolesReference";

// Partner Pages (formerly VAR)
import DealRegistrationPage from "./pages/var/DealRegistrationPage";

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/use-of-cookies" element={<UseOfCookies />} />
              
              {/* Product routes */}
              <Route path="/seekcap" element={<SeekCap />} />
              <Route path="/ddx" element={<DDX />} />
              <Route path="/ddx/use-cases" element={<DDXUseCases />} />
              <Route path="/paraguard" element={<ParaGuard />} />
              <Route path="/secondlook" element={<SecondLook />} />
              <Route path="/security-perpetual" element={<SecurityPerpetual />} />
              <Route path="/lightfoot" element={<Lightfoot />} />
              <Route path="/orange" element={<Orange />} />
              <Route path="/aurorasense" element={<AuroraSense />} />
              <Route path="/onboard" element={<OnboardProduct />} />
              
              {/* Protected routes requiring authentication and approval */}
              <Route path="/admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
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
              <Route path="/entitlements" element={
                <ProtectedRoute>
                  <Entitlements />
                </ProtectedRoute>
              } />
              <Route path="/catalog" element={
                <ProtectedRoute>
                  <Catalog />
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
              <Route path="/support/tickets" element={
                <ProtectedRoute>
                  <SupportTickets />
                </ProtectedRoute>
              } />
              <Route path="/credits" element={
                <ProtectedRoute>
                  <Credits />
                </ProtectedRoute>
              } />
              
              {/* Partner routes */}
              <Route path="/partner" element={
                <ProtectedRoute>
                  <PartnerDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/partner/deals" element={
                <ProtectedRoute>
                  <PartnerDealsPage />
                </ProtectedRoute>
              } />
              <Route path="/partner/calculator" element={
                <ProtectedRoute>
                  <PriceCalculatorPage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              } />
              <Route path="/admin/roles" element={
                <AdminRoute>
                  <RoleAssignmentPage />
                </AdminRoute>
              } />
              <Route path="/admin/actions" element={
                <AdminRoute>
                  <ActionsPage />
                </AdminRoute>
              } />
              <Route path="/admin/permissions" element={
                <AdminRoute>
                  <PermissionsPage />
                </AdminRoute>
              } />
              <Route path="/admin/downloads" element={
                <AdminRoute>
                  <DownloadsAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/licensing" element={
                <AdminRoute>
                  <LicensingAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/entitlements" element={
                <AdminRoute>
                  <LicensingAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/catalog" element={
                <AdminRoute>
                  <CatalogAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/credits" element={
                <AdminRoute>
                  <CreditsAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/onboarding" element={
                <AdminRoute>
                  <OnboardingAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <SettingsAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/crm" element={
                <AdminRoute>
                  <CRMAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/support" element={
                <AdminRoute>
                  <SupportAdminPage />
                </AdminRoute>
              } />
              <Route path="/admin/payment-approvals" element={
                <AdminRoute>
                  <PaymentApprovalsPage />
                </AdminRoute>
              } />
              <Route path="/admin/feature-requests" element={
                <ProgramManagerRoute>
                  <FeatureRequestsAdminPage />
                </ProgramManagerRoute>
              } />
              
              {/* User feature requests route */}
              <Route path="/feature-requests" element={
                <ProtectedRoute>
                  <FeatureRequests />
                </ProtectedRoute>
              } />
              
              {/* Roles Reference Page */}
              <Route path="/roles-reference" element={
                <AdminRoute>
                  <RolesReference />
                </AdminRoute>
              } />
              
              {/* VAR Routes */}
              <Route path="/var/deals" element={
                <ProtectedRoute>
                  <DealRegistrationPage />
                </ProtectedRoute>
              } />
              
              {/* Public onboarding route - accessible without login */}
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Settings route */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
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
