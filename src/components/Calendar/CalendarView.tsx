import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TimeSlot, Appointment } from '@/types/medical';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onDateDoubleClick?: (date: Date) => void;
  onDateClick?: (date: Date) => void;
  appointments: Appointment[];
  timeSlots: TimeSlot[];
  onCreateAppointment: any;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  onDateDoubleClick,
  onDateClick,
  appointments
}) => {

  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Control interno para distinguir click / doble click
  const lastClickRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleDateInteraction = (date: Date) => {
    const now = Date.now();
    const delta = now - lastClickRef.current;
    lastClickRef.current = now;

    // Doble click detectado
    if (delta < 220) {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      onDateDoubleClick?.(date);
      return;
    }

    // Click simple (se espera un poco por si viene un doble click)
    clickTimeoutRef.current = setTimeout(() => {
      onDateClick?.(date);
      onDateSelect(date);
    }, 200);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date: Date) =>
    appointments.filter(apt => isSameDay(new Date(apt.date), date));

  return (
    <div className="h-full flex flex-col">

      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-bold text-foreground">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(date => {
            const dayAppointments = getAppointmentsForDate(date);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            return (
              <Card
                key={date.toISOString()}
                className={cn(
                  "p-3 cursor-pointer transition-all duration-200 hover:shadow-card min-h-[100px]",
                  isSelected && "ring-2 ring-primary bg-primary/10",
                  !isSameMonth(date, currentMonth) && "opacity-40",
                  isToday && "bg-blue-50 border-blue-400"
                )}
                onClick={() => handleDateInteraction(date)}
              >

                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-medium", isToday && "text-blue-600 font-bold")}>
                      {format(date, 'd')}
                    </span>

                    {dayAppointments.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayAppointments.length}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    {dayAppointments.slice(0, 2).map(apt => (
                      <div
                        key={apt.id}
                        className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                      >
                        {apt.patient.firstName} {apt.patient.lastName1}
                      </div>
                    ))}

                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayAppointments.length - 2} más
                      </div>
                    )}
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;