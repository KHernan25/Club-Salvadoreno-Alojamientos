import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Accommodations from "./pages/Accommodations";
import ApartmentDetail from "./pages/ApartmentDetail";
import Reservations from "./pages/Reservations";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import MyReservations from "./pages/MyReservations";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IdentityValidation from "./pages/IdentityValidation";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/alojamientos" element={<Accommodations />} />
          <Route path="/apartamento/:id" element={<ApartmentDetail />} />
          <Route path="/reservas" element={<Reservations />} />
          <Route
            path="/confirmacion/:reservationCode"
            element={<ReservationConfirmation />}
          />
          <Route path="/confirmacion" element={<ReservationConfirmation />} />
          <Route path="/mis-reservas" element={<MyReservations />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/validar-identidad" element={<IdentityValidation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
