import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  User, 
  CheckCircle2,
  Calendar,
  RefreshCw,
  Plus,
  Activity,
  Users,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { format, addMinutes, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Appointment } from '@/types/medical';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
  revenue: number;
}

interface UnifiedScheduleProps {
  appointments: Appointment[];
  selectedDate: Date;
  onRefresh: () => void;
  onBookSlot?: (time: string) => void;
  onDateSelect?: (date: Date) => void;
  isLoading?: boolean;
}

const UnifiedSchedule: React.FC<UnifiedScheduleProps> = ({ 
  appointments, 
  selectedDate,
  onRefresh,
  onBookSlot,
  onDateSelect,
  isLoading = false 
}) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate time slots from 7:00 AM to 6:00 PM every 30 minutes
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date();
    startTime.setHours(7, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0);

    let currentTime = startTime;
    
    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      
      const bookedAppointments = appointments.filter(apt => 
        isSameDay(new Date(apt.date), selectedDate) &&
        apt.timeSlot.startTime === timeString
      );

      const capacity = 4;
      const booked = bookedAppointments.length;
      const revenue = bookedAppointments.reduce((sum, apt) => sum + apt.totalAmount, 0);
      
      slots.push({
        time: timeString,
        available: booked < capacity,
        capacity,
        booked,
        revenue
      });

      currentTime = addMinutes(currentTime, 30);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  const availableSlots = timeSlots.filter(slot => slot.available);
  const totalRevenue = timeSlots.reduce((sum, slot) => sum + slot.revenue, 0);
  const totalBooked = timeSlots.reduce((sum, slot) => sum + slot.booked, 0);
  const totalAvailable = timeSlots.reduce((sum, slot) => sum + (slot.capacity - slot.booked), 0);

  const getSlotStatusColor = (slot: TimeSlot) => {
    const percentage = (slot.booked / slot.capacity) * 100;
    if (percentage === 0) return 'bg-medical-success/10 text-medical-success border-medical-success/20';
    if (percentage < 50) return 'bg-medical-warning/10 text-medical-warning border-medical-warning/20';
    if (percentage < 100) return 'bg-medical-error/10 text-medical-error border-medical-error/20';
    return 'bg-muted text-muted-foreground border-muted';
  };

  const getSlotAppointments = (timeSlot: string) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), selectedDate) &&
      apt.timeSlot.startTime === timeSlot
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-subtle">
        <div>
          <h2 className="text-xl font-bold text-foreground">Agenda Disponible</h2>
          <p className="text-sm text-muted-foreground">
            {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
          </p>
          <p className="text-xs text-muted-foreground">
            Última actualización: {format(lastUpdate, 'HH:mm:ss')}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Actualizar
        </Button>
      </div>

      {/* Quick Stats
      <div className="grid grid-cols-3 gap-4 p-4 border-b bg-card/50">
        <div className="text-center">
          <div className="text-lg font-bold text-medical-success">{totalAvailable}</div>
          <div className="text-xs text-muted-foreground">Disponibles</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{totalBooked}</div>
          <div className="text-xs text-muted-foreground">Agendadas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Ingresos</div>
        </div>
      </div>
      */}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {timeSlots.map(slot => {
            const slotAppointments = getSlotAppointments(slot.time);
            const isExpanded = expandedSlot === slot.time;
            const available = slot.capacity - slot.booked;
            
            return (
              <Card 
                key={slot.time} 
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  slot.available ? "hover:shadow-card cursor-pointer" : "opacity-75",
                  isExpanded && "ring-2 ring-primary/20"
                )}
              >
                {/* Main slot header */}
                <div 
                  className="p-4 flex items-center justify-between"
                  onClick={() => setExpandedSlot(isExpanded ? null : slot.time)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-primary">
                        {slot.time}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(addMinutes(new Date(`2000-01-01T${slot.time}`), 30), 'HH:mm')}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSlotStatusColor(slot)}>
                          <Activity className="h-3 w-3 mr-1" />
                          {available > 0 ? `${available} disponible${available > 1 ? 's' : ''}` : 'Completo'}
                        </Badge>
                        
                        {slot.revenue > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            ${slot.revenue.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {slot.booked}/{slot.capacity} pacientes
                        </div>
                        
                        {/* Progress bar */}
                        <div className="flex-1 max-w-[100px]">
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {slot.available && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookSlot?.(slot.time);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && slotAppointments.length > 0 && (
                  <div className="px-4 pb-4 border-t bg-muted/30 animate-accordion-down">
                    <div className="pt-3 space-y-2">
                      {slotAppointments.map(appointment => (
                        <div 
                          key={appointment.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-card border hover:shadow-sm transition-all duration-200"
                        >
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {appointment.medicalCodes.map(code => code.code).join(', ')}
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-medium text-primary">
                              ${appointment.totalAmount.toLocaleString()}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {appointment.status === 'SCHEDULED' ? 'Agendada' : 
                               appointment.status === 'CONFIRMED' ? 'Confirmada' : appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UnifiedSchedule;