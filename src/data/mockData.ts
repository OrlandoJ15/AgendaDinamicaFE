import { Patient, MedicalCode, TimeSlot, Appointment, Branch, DashboardStats } from '@/types/medical';

// Mock Patients Data
export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'María',
    lastName: 'González',
    dni: '12345678',
    phone: '555-0101',
    email: 'maria.gonzalez@email.com',
    birthDate: '1985-03-15',
    restrictions: ['Alergia a penicilina'],
    notes: 'Paciente con historial de diabetes'
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    dni: '87654321',
    phone: '555-0102',
    email: 'carlos.rodriguez@email.com',
    birthDate: '1978-11-22',
    restrictions: [],
    notes: ''
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Martínez',
    dni: '45678912',
    phone: '555-0103',
    email: 'ana.martinez@email.com',
    birthDate: '1992-07-08',
    restrictions: ['Hipertensión'],
    notes: 'Requiere medicación especial'
  },
  {
    id: '4',
    firstName: 'Roberto',
    lastName: 'Silva',
    dni: '78912345',
    phone: '555-0104',
    email: 'roberto.silva@email.com',
    birthDate: '1965-01-30',
    restrictions: ['Diabetes tipo 2', 'Alergia a aspirina'],
    notes: 'Paciente de alto riesgo'
  }
];

// Mock Medical Codes
export const mockMedicalCodes: MedicalCode[] = [
  // CHQ Codes
  {
    id: 'chq1',
    code: 'CHQ001',
    name: 'Chequeo Médico General',
    type: 'CHQ',
    price: 150000,
    duration: 45,
    description: 'Examen médico general completo'
  },
  {
    id: 'chq2',
    code: 'CHQ002',
    name: 'Chequeo Cardiológico',
    type: 'CHQ',
    price: 250000,
    duration: 60,
    requiresPreparation: true,
    description: 'Evaluación cardiológica con ECG'
  },
  {
    id: 'chq3',
    code: 'CHQ003',
    name: 'Chequeo Ginecológico',
    type: 'CHQ',
    price: 180000,
    duration: 40,
    description: 'Examen ginecológico completo'
  },
  // Laboratory Codes
  {
    id: 'lab1',
    code: 'LAB001',
    name: 'Hemograma Completo',
    type: 'LAB',
    price: 45000,
    duration: 15,
    requiresPreparation: true,
    description: 'Análisis de sangre completo'
  },
  {
    id: 'lab2',
    code: 'LAB002',
    name: 'Perfil Lipídico',
    type: 'LAB',
    price: 65000,
    duration: 15,
    requiresPreparation: true,
    description: 'Análisis de colesterol y triglicéridos'
  },
  {
    id: 'lab3',
    code: 'LAB003',
    name: 'Glucosa en Ayunas',
    type: 'LAB',
    price: 25000,
    duration: 10,
    requiresPreparation: true,
    description: 'Medición de glucosa en sangre'
  },
  // Consultation Codes
  {
    id: 'cons1',
    code: 'CONS001',
    name: 'Consulta Medicina General',
    type: 'CONSULTATION',
    price: 80000,
    duration: 30,
    description: 'Consulta médica general'
  },
  {
    id: 'cons2',
    code: 'CONS002',
    name: 'Consulta Cardiología',
    type: 'CONSULTATION',
    price: 150000,
    duration: 45,
    description: 'Consulta especializada en cardiología'
  },
  {
    id: 'cons3',
    code: 'CONS003',
    name: 'Consulta Dermatología',
    type: 'CONSULTATION',
    price: 120000,
    duration: 30,
    description: 'Consulta dermatológica'
  },
  // Radiology Codes
  {
    id: 'rad1',
    code: 'RAD001',
    name: 'Radiografía de Tórax',
    type: 'RADIOLOGY',
    price: 85000,
    duration: 20,
    description: 'Radiografía simple de tórax'
  },
  {
    id: 'rad2',
    code: 'RAD002',
    name: 'Ecografía Abdominal',
    type: 'RADIOLOGY',
    price: 120000,
    duration: 30,
    requiresPreparation: true,
    description: 'Ecografía de abdomen completo'
  },
  {
    id: 'rad3',
    code: 'RAD003',
    name: 'Tomografía Computarizada',
    type: 'RADIOLOGY',
    price: 350000,
    duration: 45,
    requiresPreparation: true,
    description: 'TC con contraste'
  },
  // Endoscopy Codes
  {
    id: 'endo1',
    code: 'ENDO001',
    name: 'Endoscopia Digestiva Alta',
    type: 'ENDOSCOPY',
    price: 280000,
    duration: 30,
    requiresPreparation: true,
    description: 'Endoscopia de esófago, estómago y duodeno'
  },
  {
    id: 'endo2',
    code: 'ENDO002',
    name: 'Colonoscopia',
    type: 'ENDOSCOPY',
    price: 320000,
    duration: 60,
    requiresPreparation: true,
    description: 'Colonoscopia diagnóstica completa'
  }
];

// Mock Time Slots (7:00 AM to 6:00 PM, every 30 minutes)
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 7;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endTime = minute === 30 
        ? `${(hour + 1).toString().padStart(2, '0')}:00`
        : `${hour.toString().padStart(2, '0')}:30`;
      
      slots.push({
        id: `slot-${hour}-${minute}`,
        startTime,
        endTime,
        isAvailable: Math.random() > 0.3, // 70% chance of being available
        capacity: Math.floor(Math.random() * 3) + 2, // 2-4 capacity
        currentBookings: Math.floor(Math.random() * 2), // 0-1 current bookings
        branchId: 'branch1'
      });
    }
  }
  
  return slots;
};

// Mock Branches
export const mockBranches: Branch[] = [
  {
    id: 'branch1',
    name: 'Sede Principal',
    address: 'Av. Principal 123, Centro',
    phone: '555-0001',
    capacity: 50,
    services: mockMedicalCodes
  },
  {
    id: 'branch2',
    name: 'Sede Norte',
    address: 'Calle Norte 456, Zona Norte',
    phone: '555-0002',
    capacity: 30,
    services: mockMedicalCodes.filter(code => code.type !== 'ENDOSCOPY')
  }
];

// Mock Appointments
export const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const timeSlots = generateTimeSlots();
  const today = new Date();
  
  // Generate appointments for today and next few days
  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + dayOffset);
    
    // Generate 3-8 random appointments per day
    const appointmentCount = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < appointmentCount; i++) {
      const randomPatient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
      const randomTimeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const randomCodes = [
        mockMedicalCodes[Math.floor(Math.random() * mockMedicalCodes.length)]
      ];
      
      // Occasionally add a second code
      if (Math.random() > 0.7) {
        const secondCode = mockMedicalCodes[Math.floor(Math.random() * mockMedicalCodes.length)];
        if (!randomCodes.find(c => c.id === secondCode.id)) {
          randomCodes.push(secondCode);
        }
      }
      
      const totalAmount = randomCodes.reduce((sum, code) => sum + code.price, 0);
      
      const statuses: Appointment['status'][] = ['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
      const randomStatus = dayOffset === 0 
        ? (Math.random() > 0.2 ? 'CONFIRMED' : 'SCHEDULED') // Today's appointments are mostly confirmed
        : statuses[Math.floor(Math.random() * statuses.length)];
      
      appointments.push({
        id: `apt-${dayOffset}-${i}`,
        patientId: randomPatient.id,
        patient: randomPatient,
        medicalCodes: randomCodes,
        date: appointmentDate.toISOString().split('T')[0],
        timeSlot: randomTimeSlot,
        branchId: 'branch1',
        status: randomStatus,
        totalAmount,
        notes: Math.random() > 0.6 ? 'Paciente requiere atención especial' : '',
        coverageLetter: Math.random() > 0.8 ? 'Cobertura autorizada por seguro médico' : '',
        attachments: [],
        restrictions: randomPatient.restrictions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  return appointments;
};

// Mock Dashboard Stats
export const generateDashboardStats = (appointments: Appointment[]): DashboardStats => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  
  // Generate patient count by time slot
  const patientsByTimeSlot: Record<string, number> = {};
  const timeSlots = generateTimeSlots();
  
  // Initialize all time slots with 0
  timeSlots.forEach(slot => {
    patientsByTimeSlot[slot.startTime] = 0;
  });
  
  // Count patients for each time slot
  todayAppointments.forEach(apt => {
    if (patientsByTimeSlot[apt.timeSlot.startTime] !== undefined) {
      patientsByTimeSlot[apt.timeSlot.startTime]++;
    }
  });
  
  // Generate revenue by service
  const revenueByService: Record<string, number> = {};
  appointments.forEach(apt => {
    apt.medicalCodes.forEach(code => {
      if (!revenueByService[code.name]) {
        revenueByService[code.name] = 0;
      }
      revenueByService[code.name] += code.price;
    });
  });
  
  return {
    totalAppointments: appointments.length,
    totalRevenue: appointments.reduce((sum, apt) => sum + apt.totalAmount, 0),
    todayAppointments: todayAppointments.length,
    availableSlots: timeSlots.filter(slot => slot.isAvailable && slot.currentBookings < slot.capacity).length,
    patientsByTimeSlot,
    revenueByService
  };
};