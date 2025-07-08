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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StarRating } from "@/components/ui/star-rating";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().min(1, "Debes dar una calificación").max(5),
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no debe exceder 100 caracteres"),
  comment: z
    .string()
    .min(20, "El comentario debe tener al menos 20 caracteres")
    .max(1000, "El comentario no debe exceder 1000 caracteres"),
  wouldRecommend: z.boolean(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  accommodationId: string;
  reservationId: string;
  accommodationName: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  accommodationId,
  reservationId,
  accommodationName,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPro, setCurrentPro] = useState("");
  const [currentCon, setCurrentCon] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
      wouldRecommend: true,
      pros: [],
      cons: [],
    },
  });

  const handleSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        pros,
        cons,
      });
      toast.success(
        "Reseña enviada exitosamente. Será revisada antes de publicarse.",
      );
      form.reset();
      setPros([]);
      setCons([]);
    } catch (error) {
      toast.error("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPro = () => {
    if (
      currentPro.trim() &&
      pros.length < 5 &&
      !pros.includes(currentPro.trim())
    ) {
      setPros([...pros, currentPro.trim()]);
      setCurrentPro("");
    }
  };

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const addCon = () => {
    if (
      currentCon.trim() &&
      cons.length < 5 &&
      !cons.includes(currentCon.trim())
    ) {
      setCons([...cons, currentCon.trim()]);
      setCurrentCon("");
    }
  };

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Escribe tu reseña</CardTitle>
        <CardDescription>
          Comparte tu experiencia en {accommodationName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calificación general *</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size="lg"
                    />
                  </FormControl>
                  <FormDescription>
                    Califica tu experiencia del 1 al 5
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la reseña *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Excelente experiencia con vista al mar"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Un título corto que resuma tu experiencia
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu reseña *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu experiencia en detalle..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comparte los detalles de tu estadía (mínimo 20 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pros */}
            <div className="space-y-3">
              <FormLabel>Lo que más te gustó (opcional)</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={currentPro}
                  onChange={(e) => setCurrentPro(e.target.value)}
                  placeholder="Ej: Vista espectacular"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addPro())
                  }
                  disabled={pros.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addPro}
                  disabled={!currentPro.trim() || pros.length >= 5}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {pros.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pros.map((pro, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {pro}
                      <button
                        type="button"
                        onClick={() => removePro(index)}
                        className="hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <FormDescription>Máximo 5 aspectos positivos</FormDescription>
            </div>

            {/* Cons */}
            <div className="space-y-3">
              <FormLabel>Aspectos a mejorar (opcional)</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={currentCon}
                  onChange={(e) => setCurrentCon(e.target.value)}
                  placeholder="Ej: WiFi lento"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCon())
                  }
                  disabled={cons.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCon}
                  disabled={!currentCon.trim() || cons.length >= 5}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {cons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cons.map((con, index) => (
                    <Badge key={index} variant="destructive" className="gap-1">
                      {con}
                      <button
                        type="button"
                        onClick={() => removeCon(index)}
                        className="hover:bg-red-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <FormDescription>Máximo 5 aspectos a mejorar</FormDescription>
            </div>

            {/* Would Recommend */}
            <FormField
              control={form.control}
              name="wouldRecommend"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Recomendaría este alojamiento</FormLabel>
                    <FormDescription>
                      ¿Recomendar��as este lugar a otros huéspedes?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Reseña"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
