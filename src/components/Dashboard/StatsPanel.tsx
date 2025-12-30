import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import { DashboardStats } from '@/types/medical';

interface StatsPanelProps {
  stats: DashboardStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const timeSlotLabels = {
    '07:00': '7:00 AM',
    '07:30': '7:30 AM',
    '08:00': '8:00 AM',
    '08:30': '8:30 AM',
    '09:00': '9:00 AM',
    '09:30': '9:30 AM',
    '10:00': '10:00 AM',
    '10:30': '10:30 AM',
    '11:00': '11:00 AM',
    '11:30': '11:30 AM',
    '12:00': '12:00 PM',
    '12:30': '12:30 PM',
    '13:00': '1:00 PM',
    '13:30': '1:30 PM',
    '14:00': '2:00 PM',
    '14:30': '2:30 PM',
    '15:00': '3:00 PM',
    '15:30': '3:30 PM',
    '16:00': '4:00 PM',
    '16:30': '4:30 PM',
    '17:00': '5:00 PM',
    '17:30': '5:30 PM',
  };

  const getMaxPatients = () => {
    const values = Object.values(stats.patientsByTimeSlot);
    return Math.max(...values, 0);
  };

  const getMaxRevenue = () => {
    const values = Object.values(stats.revenueByService);
    return Math.max(...values, 0);
  };

  return (
    <div className="space-y-6">
      {/* Main Stats 
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">Citas de Hoy</p>
              <p className="text-2xl font-bold">{stats.todayAppointments}</p>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-accent text-accent-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-foreground/80 text-sm">Ingresos del Día</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 border-medical-blue bg-medical-blue/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Citas</p>
              <p className="text-2xl font-bold text-medical-blue">{stats.totalAppointments}</p>
            </div>
            <Users className="h-8 w-8 text-medical-blue" />
          </div>
        </Card>

        <Card className="p-6 border-medical-green bg-medical-green/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Horarios Libres</p>
              <p className="text-2xl font-bold text-medical-green">{stats.availableSlots}</p>
            </div>
            <Clock className="h-8 w-8 text-medical-green" />
          </div>
        </Card>
      </div>
      */}

      {/* Time Slot Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Distribución por Horarios
          </h3>
          <Badge variant="outline">Pacientes por franja de 30min</Badge>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.patientsByTimeSlot).map(([time, count]) => {
            const percentage = getMaxPatients() > 0 ? (count / getMaxPatients()) * 100 : 0;
            return (
              <div key={time} className="flex items-center gap-3">
                <div className="w-16 text-sm font-mono text-muted-foreground">
                  {timeSlotLabels[time as keyof typeof timeSlotLabels] || time}
                </div>
                <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {count} pacientes
                  </div>
                </div>
                <div className="w-12 text-right">
                  <Badge variant={count > 3 ? "destructive" : count > 1 ? "default" : "secondary"}>
                    {count}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Revenue by Service 
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5 text-accent" />
            Ingresos por Servicio
          </h3>
          <Badge variant="outline">Revenue breakdown</Badge>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.revenueByService).map(([service, revenue]) => {
            const percentage = getMaxRevenue() > 0 ? (revenue / getMaxRevenue()) * 100 : 0;
            return (
              <div key={service} className="flex items-center gap-3">
                <div className="w-20 text-sm text-muted-foreground truncate">
                  {service}
                </div>
                <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-accent transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    ${revenue.toLocaleString()}
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium">
                  ${revenue.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Proyectado</span>
            <span className="text-lg font-bold text-primary">
              ${Object.values(stats.revenueByService).reduce((a, b) => a + b, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      */}

      {/* Quick Metrics 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Promedio por cita</p>
              <p className="font-bold">
                ${stats.totalAppointments > 0 ? Math.round(stats.totalRevenue / stats.totalAppointments).toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ocupación</p>
              <p className="font-bold">
                {stats.totalAppointments > 0 ? Math.round((stats.totalAppointments / (stats.totalAppointments + stats.availableSlots)) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-medical-green/10 rounded-lg">
              <Users className="h-5 w-5 text-medical-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacidad restante</p>
              <p className="font-bold text-medical-green">{stats.availableSlots} slots</p>
            </div>
          </div>
        </Card>
      </div>
      */}

    </div>
  );
};

export default StatsPanel;