
export interface Professional {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  course: string;
  phone: string;
  password: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  specialties?: string[];
  patients?: string[]; // IDs dos pacientes
}

export interface ProfessionalStats {
  totalPatients: number;
  activeSessions: number;
  completedSessions: number;
  upcomingAppointments: number;
}
