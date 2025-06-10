import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const IdentityValidation = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleGetCode = () => {
    if (selectedMethod) {
      // Here would be OTP generation logic
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate("/register");
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
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

          {/* Validation Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">
                Valida tu identidad
              </h2>
              <p className="text-blue-100 text-sm">
                Selecciona dónde prefieres{" "}
                <span className="font-medium">enviemos</span>
                <br />
                <span className="font-medium">el código de validación</span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <RadioGroup
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                className="space-y-4"
              >
                {/* Phone Option */}
                <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                  <RadioGroupItem
                    value="phone"
                    id="phone"
                    className="border-white text-white"
                  />
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-3 text-white cursor-pointer flex-1"
                  >
                    <Phone className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Teléfono móvil:</div>
                      <div className="text-sm text-blue-100">
                        +503 •••• 5669
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Email Option */}
                <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                  <RadioGroupItem
                    value="email"
                    id="email"
                    className="border-white text-white"
                  />
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-3 text-white cursor-pointer flex-1"
                  >
                    <Mail className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Email:</div>
                      <div className="text-sm text-blue-100">
                        gher •••••••• @gmail.com
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGetCode}
                disabled={!selectedMethod}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Obtener código
              </Button>

              <Button
                onClick={handleCancel}
                variant="ghost"
                className="w-full text-white hover:bg-white/10 py-3 text-lg font-medium"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityValidation;
