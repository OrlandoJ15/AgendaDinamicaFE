import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  Upload,
  X,
  Plus,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Patient, MedicalCode, TimeSlot, Alert as AlertType } from '@/types/medical';
import { cn } from '@/lib/utils';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTimeSlot: TimeSlot | null;
  onCreateAppointment: (appointmentData: any) => void;
  availableCodes: MedicalCode[];
  existingPatients: Patient[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTimeSlot,
  onCreateAppointment,
  availableCodes,
  existingPatients
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<MedicalCode[]>([]);
  const [notes, setNotes] = useState('');
  const [coverageLetter, setCoverageLetter] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [searchPatient, setSearchPatient] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    email: '',
    birthDate: '',
    restrictions: ''
  });

  // Simulated validation function
  const validateAppointment = () => {
    const newAlerts: AlertType[] = [];

    // Check for patient restrictions
    if (patient?.restrictions && patient.restrictions.length > 0) {
      newAlerts.push({
        id: '1',
        type: 'WARNING',
        title: 'Restricciones médicas',
        message: `El paciente tiene restricciones: ${patient.restrictions.join(', ')}`,
        timestamp: new Date().toISOString(),
        patientId: patient.id
      });
    }

    // Check for duplicate appointments (simulated)
    const isDuplicate = false; // This would check against existing appointments
    if (isDuplicate) {
      newAlerts.push({
        id: '2',
        type: 'ERROR',
        title: 'Cita duplicada',
        message: 'Ya existe una cita para este paciente en el mismo horario',
        timestamp: new Date().toISOString(),
        patientId: patient?.id
      });
    }

    // Check if codes require special preparation
    const preparationCodes = selectedCodes.filter(code => code.requiresPreparation);
    if (preparationCodes.length > 0) {
      newAlerts.push({
        id: '3',
        type: 'INFO',
        title: 'Preparación requerida',
        message: `Los siguientes estudios requieren preparación: ${preparationCodes.map(c => c.name).join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    setAlerts(newAlerts);
    return newAlerts.filter(alert => alert.type === 'ERROR').length === 0;
  };

  const calculateTotal = () => {
    return selectedCodes.reduce((total, code) => total + code.price, 0);
  };

  const handlePatientSelect = (selectedPatient: Patient) => {
    setPatient(selectedPatient);
    setIsNewPatient(false);
    setCurrentStep(2);
  };

  const handleCreateNewPatient = () => {
    if (newPatientData.firstName && newPatientData.lastName && newPatientData.dni) {
      const patient: Patient = {
        id: Date.now().toString(),
        ...newPatientData,
        restrictions: newPatientData.restrictions ? newPatientData.restrictions.split(',').map(r => r.trim()) : []
      };
      setPatient(patient);
      setCurrentStep(2);
    }
  };

  const handleCodeToggle = (code: MedicalCode) => {
    setSelectedCodes(prev => {
      const exists = prev.find(c => c.id === code.id);
      if (exists) {
        return prev.filter(c => c.id !== code.id);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleConfirmAppointment = () => {
    if (validateAppointment()) {
      const appointmentData = {
        patient,
        medicalCodes: selectedCodes,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes,
        coverageLetter,
        attachments,
        totalAmount: calculateTotal()
      };
      onCreateAppointment(appointmentData);
      onClose();
    }
  };

  const filteredPatients = existingPatients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.dni}`.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const resetModal = () => {
    setCurrentStep(1);
    setPatient(null);
    setSelectedCodes([]);
    setNotes('');
    setCoverageLetter('');
    setAttachments([]);
    setAlerts([]);
    setSearchPatient('');
    setIsNewPatient(false);
    setNewPatientData({
      firstName: '',
      lastName: '',
      dni: '',
      phone: '',
      email: '',
      birthDate: '',
      restrictions: ''
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Nueva Cita - {selectedTimeSlot && format(selectedDate, 'dd MMMM yyyy', { locale: es })}
            <Badge variant="outline" className="ml-2">
              {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep >= step 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {step}
              </div>
              <span className={cn(
                "ml-2 text-sm",
                currentStep >= step ? "text-foreground" : "text-muted-foreground"
              )}>
                {step === 1 ? "Paciente" : step === 2 ? "Servicios" : "Confirmación"}
              </span>
              {step < 3 && <div className="w-8 h-px bg-border mx-4" />}
            </div>
          ))}
        </div>

        {/* Step 1: Patient Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="search-patient">Buscar paciente existente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-patient"
                    placeholder="Buscar por nombre o DNI..."
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsNewPatient(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paciente
              </Button>
            </div>

            {!isNewPatient && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredPatients.map(p => (
                  <Card
                    key={p.id}
                    className="p-4 cursor-pointer hover:shadow-card transition-all duration-200"
                    onClick={() => handlePatientSelect(p)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{p.firstName} {p.lastName}</h4>
                        <p className="text-sm text-muted-foreground">DNI: {p.dni} | Tel: {p.phone}</p>
                      </div>
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {isNewPatient && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Datos del nuevo paciente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={newPatientData.firstName}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={newPatientData.lastName}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      value={newPatientData.dni}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, dni: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={newPatientData.phone}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatientData.email}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newPatientData.birthDate}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="restrictions">Restricciones médicas (separadas por coma)</Label>
                    <Input
                      id="restrictions"
                      value={newPatientData.restrictions}
                      onChange={(e) => setNewPatientData(prev => ({ ...prev, restrictions: e.target.value }))}
                      placeholder="Ej: Alergia a medicamentos, Diabetes, etc."
                    />
                  </div>
                </div>
                <Button onClick={handleCreateNewPatient} className="mt-4">
                  Crear y Continuar
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Seleccionar servicios médicos</h3>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-xl font-bold text-primary">${calculateTotal().toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {availableCodes.map(code => {
                const isSelected = selectedCodes.find(c => c.id === code.id);
                return (
                  <Card
                    key={code.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:shadow-card"
                    )}
                    onClick={() => handleCodeToggle(code)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            code.type === 'CHQ' ? 'default' :
                            code.type === 'LAB' ? 'secondary' :
                            code.type === 'CONSULTATION' ? 'outline' :
                            code.type === 'RADIOLOGY' ? 'destructive' : 'default'
                          }>
                            {code.code}
                          </Badge>
                          <Badge variant="outline">{code.type}</Badge>
                        </div>
                        <h4 className="font-medium">{code.name}</h4>
                        <p className="text-sm text-muted-foreground">{code.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${code.price.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {code.duration}min
                          </span>
                        </div>
                        {code.requiresPreparation && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Requiere preparación
                          </Badge>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Plus className="h-4 w-4 text-primary-foreground rotate-45" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones, requerimientos especiales..."
                />
              </div>

              <div>
                <Label htmlFor="coverage">Carta de cobertura</Label>
                <Textarea
                  id="coverage"
                  value={coverageLetter}
                  onChange={(e) => setCoverageLetter(e.target.value)}
                  placeholder="Información sobre la cobertura médica..."
                />
              </div>
            </div>

            <Button onClick={() => setCurrentStep(3)} disabled={selectedCodes.length === 0}>
              Continuar
            </Button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map(alert => (
                  <Alert key={alert.id} className={cn(
                    alert.type === 'ERROR' && "border-medical-error bg-medical-error/10",
                    alert.type === 'WARNING' && "border-medical-warning bg-medical-warning/10",
                    alert.type === 'INFO' && "border-medical-blue bg-medical-blue/10"
                  )}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{alert.title}:</strong> {alert.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Resumen de la cita</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Paciente</h4>
                  <p>{patient?.firstName} {patient?.lastName}</p>
                  <p className="text-sm text-muted-foreground">DNI: {patient?.dni}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Fecha y hora</h4>
                  <p>{format(selectedDate, 'dd MMMM yyyy', { locale: es })}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Servicios seleccionados</h4>
                <div className="space-y-2">
                  {selectedCodes.map(code => (
                    <div key={code.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>{code.name} ({code.code})</span>
                      <span>${code.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Volver
              </Button>
              <Button 
                onClick={handleConfirmAppointment}
                disabled={alerts.some(alert => alert.type === 'ERROR')}
                className="flex-1"
              >
                Confirmar Cita
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;