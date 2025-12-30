export type Patient = {
  id: string;

  nomPaciente: string;
  numId: string;
  
  firstName: string;
  middleName?: string;
  lastName1: string;
  lastName2?: string;
  identificationType?: string;
  identificationNumber?: string;
  birthDate?: string;
  gender?: string;
  email?: string;
  livesInCountry?: boolean;
  country?: string;
  profession?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  exactAddress?: string;
  notes?: string;
  religion?: string;
  ethnicGroup?: string;
  habeasData?: boolean;
  privacyAuthorization?: boolean;
  restrictions?: string[];
  createdAt?: string;
  updatedAt?: string;
};

// types/medical.ts
/*
export type Patient = {
  id?: string;

  nomPaciente: string;

  numId: string;

  // ---- Campos opcionales que vienen del backend ----
  primerNom?: string;
  segundoNom?: string;
  primerApe?: string;
  segundoApe?: string;

  sexo?: string;
  codTipoDoc?: string;
  fechaNacimiento?: string;

  telHab?: string;
  telOfic?: string;
  telOpc?: string;

  direccionHab?: string;

  correoElectronico?: string;

  estadoExp?: string;
  fechaExpediente?: string;

  usuario?: string;
  fechaActualiza?: string;
};
*/


export interface MedicalCode {
  id: string;
  code: string;
  name: string;
  type: 'CHQ' | 'LAB' | 'CONSULTATION' | 'RADIOLOGY' | 'ENDOSCOPY';
  price: number;
  duration: number; // minutes
  requiresPreparation?: boolean;
  description?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  capacity: number;
  currentBookings: number;
  branchId: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  medicalCodes: MedicalCode[];
  date: string;
  timeSlot: TimeSlot;
  branchId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalAmount: number;
  coverageLetter?: string;
  attachments?: string[];
  notes?: string;
  restrictions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  services: MedicalCode[];
}

export interface Alert {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  patientId?: string;
  appointmentId?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  todayAppointments: number;
  availableSlots: number;
  patientsByTimeSlot: Record<string, number>;
  revenueByService: Record<string, number>;
}