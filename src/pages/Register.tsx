import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    documentType: "",
    documentNumber: "",
    memberCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be registration logic
    navigate("/validar-identidad");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url('/placeholder.svg')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl font-bold">CS</div>
            </div>
            <h1 className="text-white text-3xl font-bold tracking-wider">
              CLUB
              <br />
              SALVADOREÑO
            </h1>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-white font-medium mb-2 block"
                >
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-white font-medium mb-2 block"
                >
                  Apellidos
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Ingrese sus apellidos"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-white font-medium mb-2 block"
                >
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Tipo de Documento */}
              <div>
                <Label
                  htmlFor="documentType"
                  className="text-white font-medium mb-2 block"
                >
                  Tipo de Documento
                </Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) =>
                    handleInputChange("documentType", value)
                  }
                >
                  <SelectTrigger className="bg-white/90 border-white/30 text-slate-900">
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dui">
                      DUI - Documento Único de Identidad
                    </SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="licencia">
                      Licencia de Conducir
                    </SelectItem>
                    <SelectItem value="cedula">Cédula de Identidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* No. de Documento */}
              <div>
                <Label
                  htmlFor="documentNumber"
                  className="text-white font-medium mb-2 block"
                >
                  No. de Documento
                </Label>
                <Input
                  id="documentNumber"
                  type="text"
                  placeholder="Ingrese su número de documento"
                  value={formData.documentNumber}
                  onChange={(e) =>
                    handleInputChange("documentNumber", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Código de miembro */}
              <div>
                <Label
                  htmlFor="memberCode"
                  className="text-white font-medium mb-2 block"
                >
                  Código de miembro
                </Label>
                <Input
                  id="memberCode"
                  type="text"
                  placeholder="Ingrese su código de miembro"
                  value={formData.memberCode}
                  onChange={(e) =>
                    handleInputChange("memberCode", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <Label
                  htmlFor="phone"
                  className="text-white font-medium mb-2 block"
                >
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ingrese su teléfono"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-white font-medium mb-2 block"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-white font-medium mb-2 block"
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme su contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                  className="bg-white/90 border-white/30 mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-white text-sm leading-relaxed"
                >
                  Aceptar los términos y condiciones
                </Label>
              </div>

              {/* Register Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!acceptTerms}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 text-lg font-medium"
                >
                  Registrarse
                </Button>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-white">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-200 hover:text-white underline font-medium"
              >
                Inicia Sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
