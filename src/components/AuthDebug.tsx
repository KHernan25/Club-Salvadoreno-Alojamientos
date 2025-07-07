import { useState, useEffect } from "react";
import {
  getCurrentUser,
  getCurrentSession,
  isAuthenticated,
  isSessionValid,
} from "@/lib/auth-service";
import { getAuthToken } from "@/lib/api-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const updateDebugInfo = () => {
    const currentUser = getCurrentUser();
    const currentSession = getCurrentSession();
    const authenticated = isAuthenticated();
    const sessionValid = isSessionValid();
    const authToken = getAuthToken();

    setDebugInfo({
      currentUser,
      currentSession,
      authenticated,
      sessionValid,
      hasAuthToken: !!authToken,
      authToken: authToken ? authToken.substring(0, 20) + "..." : null,
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!debugInfo) return null;

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 bg-white shadow-lg border-2 border-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-blue-700">
          🔐 Auth Debug - {debugInfo.timestamp.split("T")[1].split(".")[0]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Autenticado:</span>
          <Badge variant={debugInfo.authenticated ? "default" : "destructive"}>
            {debugInfo.authenticated ? "SÍ" : "NO"}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span>Sesión válida:</span>
          <Badge variant={debugInfo.sessionValid ? "default" : "destructive"}>
            {debugInfo.sessionValid ? "SÍ" : "NO"}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span>Token API:</span>
          <Badge variant={debugInfo.hasAuthToken ? "default" : "secondary"}>
            {debugInfo.hasAuthToken ? "SÍ" : "NO"}
          </Badge>
        </div>

        {debugInfo.currentUser && (
          <div className="border-t pt-2 mt-2">
            <div>
              <strong>Usuario:</strong> {debugInfo.currentUser.fullName}
            </div>
            <div>
              <strong>Email:</strong> {debugInfo.currentUser.email}
            </div>
            <div>
              <strong>Rol:</strong> {debugInfo.currentUser.role}
            </div>
            <div>
              <strong>Activo:</strong>{" "}
              {debugInfo.currentUser.isActive ? "SÍ" : "NO"}
            </div>
          </div>
        )}

        {debugInfo.currentSession && (
          <div className="border-t pt-2 mt-2">
            <div>
              <strong>Login:</strong>{" "}
              {new Date(
                debugInfo.currentSession.loginTime,
              ).toLocaleTimeString()}
            </div>
            <div>
              <strong>Remember:</strong>{" "}
              {debugInfo.currentSession.rememberMe ? "SÍ" : "NO"}
            </div>
          </div>
        )}

        <Button size="sm" className="w-full mt-2" onClick={updateDebugInfo}>
          🔄 Actualizar
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthDebug;
