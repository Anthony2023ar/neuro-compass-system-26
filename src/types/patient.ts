
export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  age: number;
  cpf: string;
  fatherName: string;
  motherName: string;
  phone1: string;
  phone2?: string;
  createdAt: string;
  updatedAt: string;
  nextVisit?: {
    date: string;
    time: string;
  };
  medicalReports?: MedicalReport[];
  vaccines?: Vaccine[];
  activities?: Activity[];
  photos?: Photo[];
  sessions?: Session[];
}

export interface MedicalReport {
  id: string;
  title: string;
  description: string;
  date: string;
  fileUrl?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  date: string;
  batch?: string;
  healthcare?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  score?: number;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
}

export interface Session {
  id: string;
  date: string;
  duration: number; // em minutos
  description: string;
  activities: string[];
  observations: string;
  progress: 'excellent' | 'good' | 'regular' | 'needs_improvement';
}
