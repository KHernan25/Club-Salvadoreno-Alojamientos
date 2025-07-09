import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays, Filter, Building2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  selectedAccommodationType?: string;
  onAccommodationTypeChange?: (type: string) => void;
  selectedDateRange?: { from: Date; to: Date } | undefined;
  onDateRangeChange?: (range: { from: Date; to: Date } | undefined) => void;
  availableDates?: Date[];
  bookedDates?: Date[];
  className?: string;
}

const MiniCalendar = ({
  selectedDate,
  onDateSelect,
  selectedAccommodationType = "all",
  onAccommodationTypeChange,
  selectedDateRange,
  onDateRangeChange,
  availableDates = [],
  bookedDates = [],
  className,
}: MiniCalendarProps) => {
  const [tempRange, setTempRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const accommodationTypes = [
    { value: "apartamento", label: "Apartamentos", icon: "🏠" },
    { value: "casa", label: "Casas", icon: "🏡" },
    { value: "suite", label: "Suites", icon: "🏨" },
  ];

  const handleDateSelect = (date: Date | undefined) => {
    if (onDateSelect) {
      onDateSelect(date);
    }

    // If range mode is enabled
    if (onDateRangeChange && date) {
      if (!tempRange.from || (tempRange.from && tempRange.to)) {
        // Start new range
        setTempRange({ from: date, to: undefined });
      } else {
        // Complete the range
        const newRange = {
          from: tempRange.from < date ? tempRange.from : date,
          to: tempRange.from < date ? date : tempRange.from,
        };
        setTempRange(newRange);
        onDateRangeChange(newRange);
      }
    }
  };

  const clearDateRange = () => {
    setTempRange({});
    if (onDateRangeChange) {
      onDateRangeChange(undefined);
    }
  };

  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.toDateString() === date.toDateString() &&
        (selectedAccommodationType === "all" ||
          selectedAccommodationType === "apartamento" ||
          selectedAccommodationType === "casa" ||
          selectedAccommodationType === "suite"),
    );
  };

  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some(
      (availableDate) => availableDate.toDateString() === date.toDateString(),
    );
  };

  const modifiers = {
    booked: bookedDates,
    available: availableDates,
    selected: selectedDate ? [selectedDate] : [],
    range_start: tempRange.from ? [tempRange.from] : [],
    range_end: tempRange.to ? [tempRange.to] : [],
    range_middle:
      tempRange.from && tempRange.to
        ? Array.from(
            {
              length:
                (tempRange.to.getTime() - tempRange.from.getTime()) /
                (1000 * 60 * 60 * 24),
            },
            (_, i) => {
              const date = new Date(tempRange.from!);
              date.setDate(date.getDate() + i + 1);
              return date;
            },
          ).filter((date) => date < tempRange.to!)
        : [],
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: "#ef4444",
      color: "white",
      fontWeight: "bold",
    },
    available: {
      backgroundColor: "#22c55e",
      color: "white",
    },
    selected: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    range_start: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
    },
    range_end: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
    },
    range_middle: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <CalendarDays className="mr-2 h-5 w-5 text-blue-600" />
          Calendario de Filtros
        </CardTitle>
        <CardDescription>
          Filtra por tipo de alojamiento y fecha
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Accommodation Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tipo de Alojamiento</Label>
          <Select
            value={selectedAccommodationType}
            onValueChange={onAccommodationTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {accommodationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fecha</Label>
          <div className="space-y-2">
            {/* Single Date Picker */}
            {onDateSelect && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Date Range Picker */}
            {onDateRangeChange && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !tempRange.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tempRange.from ? (
                          format(tempRange.from, "dd/MM", { locale: es })
                        ) : (
                          <span>Desde</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={tempRange.from}
                        onSelect={(date) =>
                          setTempRange((prev) => ({ ...prev, from: date }))
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !tempRange.to && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tempRange.to ? (
                          format(tempRange.to, "dd/MM", { locale: es })
                        ) : (
                          <span>Hasta</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={tempRange.to}
                        onSelect={(date) => {
                          setTempRange((prev) => ({ ...prev, to: date }));
                          if (tempRange.from && date) {
                            onDateRangeChange({
                              from:
                                tempRange.from < date ? tempRange.from : date,
                              to: tempRange.from < date ? date : tempRange.from,
                            });
                          }
                        }}
                        initialFocus
                        locale={es}
                        disabled={(date) =>
                          tempRange.from ? date < tempRange.from : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {(tempRange.from || tempRange.to) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearDateRange}
                    className="w-full"
                  >
                    Limpiar Rango
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mini Calendar View */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vista Rápida</Label>
          <div className="border rounded-lg p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="scale-90 -m-2"
              locale={es}
              showOutsideDays={false}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Leyenda</Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span>Rango</span>
            </div>
          </div>
        </div>

        {/* Current Selection Info */}
        {selectedAccommodationType !== "all" && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Filtrado por:{" "}
                {
                  accommodationTypes.find(
                    (t) => t.value === selectedAccommodationType,
                  )?.label
                }
              </span>
            </div>
          </div>
        )}

        {selectedDateRange && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-green-900">
              Rango seleccionado:
            </div>
            <div className="text-sm text-green-700">
              {format(selectedDateRange.from, "PPP", { locale: es })} -{" "}
              {format(selectedDateRange.to, "PPP", { locale: es })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniCalendar;
