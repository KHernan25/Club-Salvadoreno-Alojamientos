// Componente de desarrollo para mostrar usuarios registrados

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { registeredUsers, User } from "@/lib/user-database";
import { Trash2, Eye, EyeOff } from "lucide-react";

const DevRegisteredUsers = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para obtener todos los usuarios registrados (localStorage + estáticos)
  const getRegisteredUsers = (): User[] => {
    const localStorageUsers = localStorage.getItem(
      "club_salvadoreno_registered_users",
    );
    const dynamicUsers = localStorageUsers ? JSON.parse(localStorageUsers) : [];

    // Combinar usuarios estáticos con los del localStorage
    // Usar Map para evitar duplicados por ID
    const allUsersMap = new Map();

    // Agregar usuarios estáticos primero
    registeredUsers.forEach((user) => allUsersMap.set(user.id, user));

    // Agregar/sobrescribir con usuarios del localStorage
    dynamicUsers.forEach((user: User) => allUsersMap.set(user.id, user));

    return Array.from(allUsersMap.values());
  };

  const [allRegisteredUsers, setAllRegisteredUsers] =
    useState(getRegisteredUsers());

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const refreshUsers = () => {
    setAllRegisteredUsers(getRegisteredUsers());
  };

  const clearAllUsers = () => {
    localStorage.removeItem("club_salvadoreno_registered_users");
    setAllRegisteredUsers(getRegisteredUsers());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="mb-2 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        {isVisible ? "Ocultar" : "Ver"} Usuarios Registrados (
        {allRegisteredUsers.length})
      </Button>

      {isVisible && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              Usuarios Registrados
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={refreshUsers}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Refresh
              </Button>
              <Button
                onClick={clearAllUsers}
                size="sm"
                variant="destructive"
                className="text-xs"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {registeredUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay usuarios registrados aún
            </p>
          ) : (
            <div className="space-y-3">
              {registeredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 bg-gray-50 rounded border text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">
                      {user.fullName}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <div>
                      <strong>Usuario:</strong> {user.username}
                    </div>
                    <div>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                      <strong>Contraseña:</strong> {user.password}
                    </div>
                    <div>
                      <strong>Teléfono:</strong> {user.phone}
                    </div>
                    <div>
                      <strong>Registrado:</strong>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Puedes usar estas credenciales para hacer login
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevRegisteredUsers;
