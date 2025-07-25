// Database models index
export { UserModel, type User } from "./User";
export {
  RegistrationRequestModel,
  type RegistrationRequest,
} from "./RegistrationRequest";
export { NotificationModel, type Notification } from "./Notification";
export {
  PasswordResetTokenModel,
  type PasswordResetToken,
} from "./PasswordResetToken";

// Nuevos modelos con precios por temporada
export { AccommodationModel, type Accommodation, type AccommodationPriceHistory } from "./Accommodation";
export { ReservationModel, type Reservation, type ReservationDailyBreakdown } from "./Reservation";
export { HolidayModel, type Holiday } from "./Holiday";
