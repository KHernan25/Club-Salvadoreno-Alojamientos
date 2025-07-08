import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, X } from "lucide-react";
import { toast } from "sonner";

const hostResponseSchema = z.object({
  response: z
    .string()
    .min(10, "La respuesta debe tener al menos 10 caracteres")
    .max(500, "La respuesta no debe exceder 500 caracteres"),
});

type HostResponseFormData = z.infer<typeof hostResponseSchema>;

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  hostResponse?: {
    response: string;
    respondedAt: Date;
    respondedBy: string;
  };
}

interface HostResponseFormProps {
  review: Review;
  onSubmit: (reviewId: string, response: string) => Promise<void>;
  onCancel?: () => void;
  trigger?: React.ReactNode;
  asDialog?: boolean;
}

export const HostResponseForm: React.FC<HostResponseFormProps> = ({
  review,
  onSubmit,
  onCancel,
  trigger,
  asDialog = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<HostResponseFormData>({
    resolver: zodResolver(hostResponseSchema),
    defaultValues: {
      response: "",
    },
  });

  const handleSubmit = async (data: HostResponseFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(review.id, data.response);
      toast.success("Respuesta enviada exitosamente");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Error al enviar la respuesta. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const responseTemplates = [
    {
      label: "Agradecimiento",
      text: "¡Muchas gracias por tu reseña! Nos alegra saber que disfrutaste tu estadía con nosotros.",
    },
    {
      label: "Respuesta a crítica constructiva",
      text: "Agradecemos tus comentarios. Tomamos nota de tus observaciones para mejorar nuestros servicios.",
    },
    {
      label: "Invitación a regresar",
      text: "Esperamos tenerte de vuelta pronto. ¡Siempre será un placer recibirte!",
    },
  ];

  const insertTemplate = (template: string) => {
    const currentValue = form.getValues("response");
    const newValue = currentValue ? `${currentValue} ${template}` : template;
    form.setValue("response", newValue);
  };

  const FormContent = () => (
    <div className="space-y-4">
      {/* Review Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">{review.userName}</h4>
          <Badge variant="outline">{review.rating} ⭐</Badge>
        </div>
        <h5 className="font-medium text-sm mb-1">{review.title}</h5>
        <p className="text-sm text-gray-600 line-clamp-3">{review.comment}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Response Templates */}
          <div className="space-y-2">
            <FormLabel>Plantillas de respuesta (opcional)</FormLabel>
            <div className="flex flex-wrap gap-2">
              {responseTemplates.map((template, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTemplate(template.text)}
                  className="text-xs"
                >
                  {template.label}
                </Button>
              ))}
            </div>
            <FormDescription>
              Haz clic en una plantilla para insertarla en tu respuesta
            </FormDescription>
          </div>

          {/* Response Textarea */}
          <FormField
            control={form.control}
            name="response"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tu respuesta *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escribe tu respuesta al huésped..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Responde de manera profesional y constructiva (10-500
                  caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Guidelines */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <h5 className="font-medium text-blue-900 mb-2">
              Pautas para responder:
            </h5>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• Agradece al huésped por tomarse el tiempo de escribir</li>
              <li>• Mantén un tono profesional y cordial</li>
              <li>• Aborda cualquier preocupación mencionada</li>
              <li>• Invita al huésped a regresar si es apropiado</li>
              <li>• Evita respuestas genéricas o automáticas</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Respuesta
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  if (asDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Responder
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Responder a la reseña</DialogTitle>
            <DialogDescription>
              Envía una respuesta profesional a este huésped
            </DialogDescription>
          </DialogHeader>
          <FormContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Responder a la reseña
        </CardTitle>
        <CardDescription>
          Envía una respuesta profesional a este huésped
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
};

interface ExistingHostResponseProps {
  response: {
    response: string;
    respondedAt: Date;
    respondedBy: string;
  };
  onEdit?: () => void;
  canEdit?: boolean;
}

export const ExistingHostResponse: React.FC<ExistingHostResponseProps> = ({
  response,
  onEdit,
  canEdit = false,
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            <MessageSquare className="h-3 w-3 mr-1" />
            Respuesta del anfitrión
          </Badge>
          <span className="text-xs text-gray-600">
            {new Date(response.respondedAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {canEdit && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
      <p className="text-gray-700 text-sm mb-2">{response.response}</p>
      <div className="text-xs text-gray-600">- {response.respondedBy}</div>
    </div>
  );
};

// Quick response component for admin dashboard
interface QuickHostResponseProps {
  reviewId: string;
  onSubmit: (reviewId: string, response: string) => Promise<void>;
}

export const QuickHostResponse: React.FC<QuickHostResponseProps> = ({
  reviewId,
  onSubmit,
}) => {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickSubmit = async () => {
    if (!response.trim() || response.length < 10) {
      toast.error("La respuesta debe tener al menos 10 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reviewId, response);
      toast.success("Respuesta enviada");
      setResponse("");
    } catch (error) {
      toast.error("Error al enviar respuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Respuesta rápida..."
        className="flex-1 min-h-[60px]"
        disabled={isSubmitting}
      />
      <Button
        onClick={handleQuickSubmit}
        disabled={isSubmitting || !response.trim()}
        size="sm"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
