import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import RouteGuard from "./components/RouteGuard";
import Index from "./pages/Index";
import Accommodations from "./pages/Accommodations";
import ApartmentDetail from "./pages/ApartmentDetail";
import CasaDetail from "./pages/CasaDetail";
import SuiteDetail from "./pages/SuiteDetail";
import Corinto from "./pages/Corinto";
import ElSunzal from "./pages/ElSunzal";
import CorintoCasas from "./pages/CorintoCasas";
import CorintoApartamentos from "./pages/CorintoApartamentos";
import ElSunzalCasas from "./pages/ElSunzalCasas";
import ElSunzalApartamentos from "./pages/ElSunzalApartamentos";
import ElSunzalSuites from "./pages/ElSunzalSuites";
import Reservations from "./pages/Reservations";
import PaymentGateway from "./pages/PaymentGateway";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import MyReservations from "./pages/MyReservations";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IdentityValidation from "./pages/IdentityValidation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthDemo from "./pages/AuthDemo";
import NavigationDemo from "./pages/NavigationDemo";
import TranslationTest from "./pages/TranslationTest";
import CountryClub from "./pages/CountryClub";
import NotFound from "./pages/NotFound";
import BackofficeLogin from "./pages/BackofficeLogin";
import UploadDocuments from "./pages/UploadDocuments";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAccommodations from "./pages/AdminAccommodations";
import AdminReservations from "./pages/AdminReservations";
import AdminCalendar from "./pages/AdminCalendar";
import AdminPricing from "./pages/AdminPricing";
import AdminMessages from "./pages/AdminMessages";
import AdminSettings from "./pages/AdminSettings";
import AdminProfile from "./pages/AdminProfile";
import AdminSiteContent from "./pages/AdminSiteContent";
import AdminRegistrationRequests from "./pages/AdminRegistrationRequests";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserActivationDebug from "./pages/UserActivationDebug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteGuard>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Index />} />

              {/* Backoffice Login */}
              <Route path="/backoffice" element={<BackofficeLogin />} />
              <Route path="/backoffice/login" element={<BackofficeLogin />} />
              <Route path="/alojamientos" element={<Accommodations />} />
              <Route path="/apartamento/:id" element={<ApartmentDetail />} />
              <Route path="/casa/:id" element={<CasaDetail />} />
              <Route path="/suite/:id" element={<SuiteDetail />} />
              <Route path="/corinto" element={<Corinto />} />
              <Route path="/el-sunzal" element={<ElSunzal />} />
              <Route path="/corinto/casas" element={<CorintoCasas />} />
              <Route
                path="/corinto/apartamentos"
                element={<CorintoApartamentos />}
              />
              <Route path="/el-sunzal/casas" element={<ElSunzalCasas />} />
              <Route
                path="/el-sunzal/apartamentos"
                element={<ElSunzalApartamentos />}
              />
              <Route path="/el-sunzal/suites" element={<ElSunzalSuites />} />
              <Route path="/reservas" element={<Reservations />} />
              <Route path="/pago" element={<PaymentGateway />} />
              <Route
                path="/confirmacion/:reservationCode"
                element={<ReservationConfirmation />}
              />
              <Route
                path="/confirmacion"
                element={<ReservationConfirmation />}
              />
              <Route path="/mis-reservas" element={<MyReservations />} />
              <Route path="/perfil" element={<UserProfile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload-documents" element={<UploadDocuments />} />
              <Route
                path="/validar-identidad"
                element={<IdentityValidation />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/demo" element={<AuthDemo />} />
              <Route path="/navigation-demo" element={<NavigationDemo />} />
              <Route path="/translation-test" element={<TranslationTest />} />
              <Route path="/country-club" element={<CountryClub />} />

              {/* Debug Tools - Development only */}
              <Route path="/debug/users" element={<UserActivationDebug />} />

              {/* Admin Routes - Protected for backoffice roles only */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute requiredRole="mercadeo">
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute requiredRole="atencion_miembro">
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users/new"
                element={
                  <AdminProtectedRoute requiredRole="atencion_miembro">
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/registration-requests"
                element={
                  <AdminProtectedRoute requiredRole="atencion_miembro">
                    <AdminRegistrationRequests />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/accommodations"
                element={
                  <AdminProtectedRoute requiredRole="anfitrion">
                    <AdminAccommodations />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/reservations"
                element={
                  <AdminProtectedRoute requiredRole="monitor">
                    <AdminReservations />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/reservations/new"
                element={
                  <AdminProtectedRoute requiredRole="monitor">
                    <AdminReservations />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/reservations/:id"
                element={
                  <AdminProtectedRoute requiredRole="monitor">
                    <AdminReservations />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/calendar"
                element={
                  <AdminProtectedRoute requiredRole="anfitrion">
                    <AdminCalendar />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/pricing"
                element={
                  <AdminProtectedRoute requiredRole="super_admin">
                    <AdminPricing />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminProtectedRoute requiredRole="mercadeo">
                    <AdminMessages />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminProtectedRoute requiredRole="super_admin">
                    <AdminSettings />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <AdminProtectedRoute requiredRole="atencion_miembro">
                    <AdminProfile />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/site-content"
                element={
                  <AdminProtectedRoute requiredRole="mercadeo">
                    <AdminSiteContent />
                  </AdminProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteGuard>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
