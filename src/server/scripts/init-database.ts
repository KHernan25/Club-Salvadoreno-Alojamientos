// Script para inicializar datos de demostración en la base de datos
import { database } from "../lib/database";

export const initializeDemoData = () => {
  console.log("🔄 Inicializando datos de demostración...");

  // Los datos ya se inicializan automáticamente en el constructor de la base de datos
  // Este script puede usarse para agregar datos adicionales específicos del entorno

  // Verificar que los datos se hayan cargado correctamente
  const accommodations = database.getAllAccommodations();
  const reservations = database.getAllReservations();
  const reviews = database.getAllReviews();
  const notifications = database.getAllNotifications();

  console.log(`✅ ${accommodations.length} alojamientos cargados`);
  console.log(`✅ ${reservations.length} reservas cargadas`);
  console.log(`✅ ${reviews.length} reseñas cargadas`);
  console.log(`✅ ${notifications.length} notificaciones cargadas`);

  // Estadísticas por ubicación
  const elSunzalAccommodations = accommodations.filter(
    (acc) => acc.location === "el-sunzal",
  );
  const corintoAccommodations = accommodations.filter(
    (acc) => acc.location === "corinto",
  );

  console.log(`📍 El Sunzal: ${elSunzalAccommodations.length} alojamientos`);
  console.log(`📍 Corinto: ${corintoAccommodations.length} alojamientos`);

  // Estadísticas por tipo
  const apartamentos = accommodations.filter(
    (acc) => acc.type === "apartamento",
  );
  const casas = accommodations.filter((acc) => acc.type === "casa");
  const suites = accommodations.filter((acc) => acc.type === "suite");

  console.log(`🏠 ${apartamentos.length} apartamentos`);
  console.log(`🏡 ${casas.length} casas`);
  console.log(`🏨 ${suites.length} suites`);

  console.log("🎉 Base de datos inicializada correctamente");

  return {
    accommodations: accommodations.length,
    reservations: reservations.length,
    reviews: reviews.length,
    notifications: notifications.length,
  };
};

// Exportar función para usar en el servidor
export default initializeDemoData;
