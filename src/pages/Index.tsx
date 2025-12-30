import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

import CalendarView from '@/components/Calendar/CalendarView';
import AppointmentModal from '@/components/Appointments/AppointmentModal';
import PatientModal from '@/components/Patients/PatientModal';
import UnifiedSchedule from '@/components/Schedule/UnifiedSchedule';
import { LoginForm } from '@/components/Auth/LoginForm';

import CartasSeguroPanel from '@/components/Dashboard/CartaSegurosPanel';
import { patientService } from '@/services/patientService';
import type { Patient, Appointment, TimeSlot } from '@/types/medical';
import { mockMedicalCodes, generateMockAppointments, generateTimeSlots } from '@/data/mockData';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('calendar');

  // 🔍 Campos de búsqueda
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 📌 Carga inicial
  /*useEffect(() => {
    setAppointments(generateMockAppointments());
    setTimeSlots(generateTimeSlots());

    (async () => {
      const all = await patientService.getAll();
      setPatients(all);
    })();
  }, []);*/

  // 🔍 BÚSQUEDA POR NOMBRE (DEBOUNCE REAL)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (
        !primerNombre.trim() &&
        !segundoNombre.trim() &&
        !primerApellido.trim() &&
        !segundoApellido.trim()
      ) {
        const all = await patientService.getAll();
        setPatients(all);
        return;
      }

      setIsSearching(true);
      try {
        const results = await patientService.getByName(
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido
        );
        setPatients(results);
      } catch (err) {
        console.error(err);
        setPatients([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [primerNombre, segundoNombre, primerApellido, segundoApellido]);

  // 🪪 BÚSQUEDA POR IDENTIFICACIÓN (DEBOUNCE REAL)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!identificacion.trim()) {
        const all = await patientService.getAll();
        setPatients(all);
        return;
      }

      setIsSearching(true);
      try {
        const result = await patientService.getByIdentification(identificacion);
        setPatients(result ? [result] : []);
      } catch (err) {
        console.error(err);
        setPatients([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [identificacion]);

  // 💾 Guardar paciente
  const handleSavePatient = (patient: Patient) => {
    setPatients(prev => {
      const exists = prev.find(p => p.id === patient.id);
      return exists
        ? prev.map(p => (p.id === patient.id ? patient : p))
        : [...prev, patient];
    });
    setIsPatientModalOpen(false);
    setSelectedPatient(undefined);
  };

  const handleLogin = (auth: boolean) => setIsAuthenticated(auth);
  const handleLogout = () => setIsAuthenticated(false);

  if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 sticky top-0 z-50">
        <div className="flex justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">Agenda Inteligente</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <Settings className="h-4 w-4 mr-2" /> Salir
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-96 border-r bg-card/30">
          <UnifiedSchedule
            appointments={appointments}
            selectedDate={selectedDate}
            onRefresh={() => {}}
            onBookSlot={() => {}}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="pizarra">Pizarra</TabsTrigger>
              <TabsTrigger value="patients">Pacientes</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <CalendarView
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onDateDoubleClick={() => {}}
                appointments={appointments}
                timeSlots={timeSlots}
                onCreateAppointment={() => {}}
              />
            </TabsContent>

            <TabsContent value="pizarra">
              <CartasSeguroPanel />
            </TabsContent>

            <TabsContent value="patients">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <Input placeholder="Primer Nombre" value={primerNombre} onChange={e => setPrimerNombre(e.target.value)} />
                  <Input placeholder="Segundo Nombre" value={segundoNombre} onChange={e => setSegundoNombre(e.target.value)} />
                  <Input placeholder="Primer Apellido" value={primerApellido} onChange={e => setPrimerApellido(e.target.value)} />
                  <Input placeholder="Segundo Apellido" value={segundoApellido} onChange={e => setSegundoApellido(e.target.value)} />
                  <Button onClick={() => setIsPatientModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Nuevo
                  </Button>
                </div>

                <Input
                  placeholder="Buscar por Identificación"
                  value={identificacion}
                  onChange={e => setIdentificacion(e.target.value)}
                />

                {isSearching && <p className="text-sm text-muted-foreground">Buscando...</p>}

                {patients.map(patient => (
                  <Card key={patient.id} className="p-4">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {patient.nomPaciente}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Identificación: {patient.numId}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedPatient(patient);
                        setIsPatientModalOpen(true);
                      }}>
                        Editar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        onCreateAppointment={() => {}}
        availableCodes={mockMedicalCodes}
        existingPatients={patients}
      />

      <PatientModal
        isOpen={isPatientModalOpen}
        onOpenChange={setIsPatientModalOpen}
        onSave={handleSavePatient}
        initialData={selectedPatient}
      />
    </div>
  );
};

export default Index;
