import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Minimize2,
  Maximize2,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent" | "bot";
  timestamp: Date;
  senderName?: string;
}

interface LiveChatProps {
  className?: string;
}

const LiveChat = ({ className }: LiveChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
      senderName: "Asistente Virtual",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Auto-responses for common questions
  const getAutoResponse = (message: string): string | null => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("reserva") || lowerMessage.includes("booking")) {
      return "Para hacer una reserva, puedes navegar a la sección de alojamientos y seleccionar las fechas de tu preferencia. ¿Necesitas ayuda con algo específico de tu reserva?";
    }

    if (lowerMessage.includes("precio") || lowerMessage.includes("costo")) {
      return "Los precios varían según el tipo de alojamiento y las fechas. Puedes ver los precios actualizados en cada listado de propiedad. ¿Te interesa algún tipo de alojamiento en particular?";
    }

    if (
      lowerMessage.includes("cancelar") ||
      lowerMessage.includes("cancelation")
    ) {
      return "Para cancelaciones, por favor revisa nuestra política en tu reserva o contacta directamente con nuestro equipo. ¿Necesitas ayuda con una cancelación específica?";
    }

    if (lowerMessage.includes("pago") || lowerMessage.includes("payment")) {
      return "Aceptamos varios métodos de pago seguros. Durante el proceso de reserva podrás ver todas las opciones disponibles. ¿Tienes alguna pregunta específica sobre pagos?";
    }

    if (
      lowerMessage.includes("ubicacion") ||
      lowerMessage.includes("location")
    ) {
      return "Nuestras propiedades están ubicadas en Corinto y El Sunzal. ¿Te interesa información sobre alguna ubicación específica?";
    }

    if (
      lowerMessage.includes("hola") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi")
    ) {
      return "¡Hola! Es un placer ayudarte. ¿En qué puedo asistirte hoy? Puedo ayudarte con reservas, precios, ubicaciones y más.";
    }

    return null;
  };

  // Send message function
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate response delay
    setTimeout(
      () => {
        const autoResponse = getAutoResponse(inputMessage);

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            autoResponse ||
            "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto. Mientras tanto, puedes revisar nuestro centro de ayuda para respuestas inmediatas.",
          sender: autoResponse ? "bot" : "agent",
          timestamp: new Date(),
          senderName: autoResponse ? "Asistente Virtual" : "Agente de Soporte",
        };

        setMessages((prev) => [...prev, responseMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick response buttons
  const quickResponses = [
    "¿Cómo hago una reserva?",
    "¿Cuáles son los precios?",
    "¿Dónde están ubicados?",
    "Política de cancelación",
  ];

  const handleQuickResponse = (response: string) => {
    setInputMessage(response);
    setTimeout(sendMessage, 100);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          <span className="sr-only">Abrir chat de soporte</span>
        </Button>

        {/* Online indicator */}
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card
        className={cn(
          "w-80 shadow-2xl transition-all duration-300",
          isMinimized ? "h-16" : "h-96",
        )}
      >
        <CardHeader className="p-4 bg-blue-600 text-white rounded-t-lg flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="h-5 w-5" />
              {isConnected && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                Soporte en Vivo
              </CardTitle>
              <p className="text-xs text-blue-100">
                {isConnected ? "En línea" : "Desconectado"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-blue-500"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-blue-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    {message.sender !== "user" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        {message.sender === "bot" ? (
                          <Bot className="h-4 w-4 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-900",
                      )}
                    >
                      {message.sender !== "user" && message.senderName && (
                        <p className="text-xs font-medium text-slate-600 mb-1">
                          {message.senderName}
                        </p>
                      )}
                      <p>{message.text}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-slate-500",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-slate-100 rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick responses */}
            {messages.length <= 1 && (
              <div className="p-3 border-t border-slate-200">
                <p className="text-xs text-slate-600 mb-2">
                  Preguntas frecuentes:
                </p>
                <div className="flex flex-wrap gap-1">
                  {quickResponses.map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickResponse(response)}
                      className="text-xs h-7 px-2"
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-slate-200">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 min-h-[40px] max-h-20 resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LiveChat;
