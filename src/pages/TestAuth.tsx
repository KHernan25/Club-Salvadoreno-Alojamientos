import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getCurrentSession,
  isAuthenticated,
  requireAuth,
} from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestAuth = () => {
  const navigate = useNavigate();
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      console.log("🧪 TestAuth: Checking authentication");

      const user = getCurrentUser();
      const session = getCurrentSession();
      const authenticated = isAuthenticated();
      const authRequired = requireAuth();

      const data = {
        user,
        session,
        authenticated,
        authRequired,
        timestamp: new Date().toISOString(),
      };

      console.log("🧪 TestAuth data:", data);
      setAuthData(data);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test de Autenticación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => navigate("/backoffice/login")}>
                Ir a Backoffice Login
              </Button>
              <Button onClick={() => navigate("/admin/dashboard")}>
                Ir a Admin Dashboard
              </Button>
            </div>

            {authData && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Estado de Autenticación:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(authData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAuth;
