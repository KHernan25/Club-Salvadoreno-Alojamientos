import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import Index from "./pages/Index";
import Accommodations from "./pages/Accommodations";
import ApartmentDetail from "./pages/ApartmentDetail";
import CasaDetail from "./pages/CasaDetail";
import SuiteDetail from "./pages/SuiteDetail";
import Corinto from "./pages/Corinto";
import ElSunzal from "./pages/ElSunzal";
import CorintoCasas from "./pages/CorintoCasas";
import ElSunzalCasas from "./pages/ElSunzalCasas";
import ElSunzalApartamentos from "./pages/ElSunzalApartamentos";
import ElSunzalSuites from "./pages/ElSunzalSuites";
import Reservations from "./pages/Reservations";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import MyReservations from "./pages/MyReservations";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IdentityValidation from "./pages/IdentityValidation";
import ForgotPassword from "./pages/ForgotPassword";
import AuthDemo from "./pages/AuthDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteGuard>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/alojamientos" element={<Accommodations />} />
            <Route path="/apartamento/:id" element={<ApartmentDetail />} />
            <Route path="/casa/:id" element={<CasaDetail />} />
            <Route path="/suite/:id" element={<SuiteDetail />} />
            <Route path="/corinto" element={<Corinto />} />
            <Route path="/el-sunzal" element={<ElSunzal />} />
            <Route path="/corinto/casas" element={<CorintoCasas />} />
            <Route path="/el-sunzal/casas" element={<ElSunzalCasas />} />
            <Route
              path="/el-sunzal/apartamentos"
              element={<ElSunzalApartamentos />}
            />
            <Route path="/el-sunzal/suites" element={<ElSunzalSuites />} />
            <Route path="/reservas" element={<Reservations />} />
            <Route
              path="/confirmacion/:reservationCode"
              element={<ReservationConfirmation />}
            />
            <Route path="/confirmacion" element={<ReservationConfirmation />} />
            <Route path="/mis-reservas" element={<MyReservations />} />
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/validar-identidad" element={<IdentityValidation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/demo" element={<AuthDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
