
import { Patient } from '@/types/patient';
import { Professional } from '@/types/professional';

const STORAGE_KEYS = {
  PATIENTS: 'patients',
  PROFESSIONALS: 'professionals',
  CURRENT_USER: 'currentUser',
  SESSION_TIMESTAMP: 'sessionTimestamp',
  ADMIN_SESSION: 'adminSession'
};

// Funções para Pacientes
export const getPatients = (): Patient[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return [];
  }
};

export const savePatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient => {
  try {
    const patients = getPatients();
    const newPatient: Patient = {
      ...patient,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  } catch (error) {
    console.error('Erro ao salvar paciente:', error);
    throw error;
  }
};

export const updatePatient = (id: string, updates: Partial<Patient>): Patient | null => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    patients[index] = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return patients[index];
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    return null;
  }
};

export const deletePatient = (id: string): boolean => {
  try {
    const patients = getPatients();
    const filteredPatients = patients.filter(p => p.id !== id);
    
    if (filteredPatients.length === patients.length) {
      return false; // Paciente não encontrado
    }
    
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filteredPatients));
    return true;
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    return false;
  }
};

export const getPatientById = (id: string): Patient | null => {
  const patients = getPatients();
  return patients.find(p => p.id === id) || null;
};

export const searchPatients = (query: string): Patient[] => {
  const patients = getPatients();
  const lowerQuery = query.toLowerCase();
  
  return patients.filter(patient => 
    patient.fullName.toLowerCase().includes(lowerQuery) ||
    patient.cpf.includes(query) ||
    patient.fatherName.toLowerCase().includes(lowerQuery) ||
    patient.motherName.toLowerCase().includes(lowerQuery)
  );
};

// Funções para Profissionais
export const getProfessionals = (): Professional[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    return [];
  }
};

export const saveProfessional = (professional: Omit<Professional, 'id' | 'createdAt' | 'updatedAt' | 'approved'>): Professional => {
  try {
    const professionals = getProfessionals();
    const newProfessional: Professional = {
      ...professional,
      id: generateId(),
      approved: false, // Por padrão, profissionais precisam ser aprovados
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    professionals.push(newProfessional);
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(professionals));
    return newProfessional;
  } catch (error) {
    console.error('Erro ao salvar profissional:', error);
    throw error;
  }
};

export const updateProfessional = (id: string, updates: Partial<Professional>): Professional | null => {
  try {
    const professionals = getProfessionals();
    const index = professionals.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    professionals[index] = {
      ...professionals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(professionals));
    return professionals[index];
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    return null;
  }
};

export const deleteProfessional = (id: string): boolean => {
  try {
    const professionals = getProfessionals();
    const filteredProfessionals = professionals.filter(p => p.id !== id);
    
    if (filteredProfessionals.length === professionals.length) {
      return false; // Profissional não encontrado
    }
    
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(filteredProfessionals));
    return true;
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    return false;
  }
};

export const getProfessionalById = (id: string): Professional | null => {
  const professionals = getProfessionals();
  return professionals.find(p => p.id === id) || null;
};

export const getPendingProfessionals = (): Professional[] => {
  const professionals = getProfessionals();
  return professionals.filter(p => !p.approved);
};

export const getApprovedProfessionals = (): Professional[] => {
  const professionals = getProfessionals();
  return professionals.filter(p => p.approved);
};

// Funções de Sessão
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.PROFESSIONALS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TIMESTAMP);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
};

export const exportAllData = (): string => {
  try {
    const data = {
      patients: getPatients(),
      professionals: getProfessionals(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return '';
  }
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.patients && Array.isArray(data.patients)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(data.patients));
    }
    
    if (data.professionals && Array.isArray(data.professionals)) {
      localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(data.professionals));
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};

// Função para calcular idade
export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Função para gerar IDs únicos
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Função para inicializar dados de exemplo (apenas para desenvolvimento)
export const initializeSampleData = (): void => {
  if (getPatients().length === 0) {
    const samplePatient = {
      fullName: "Maria Silva Santos",
      birthDate: "1985-03-15",
      age: calculateAge("1985-03-15"),
      cpf: "123.456.789-00",
      fatherName: "João Santos",
      motherName: "Ana Silva",
      phone1: "(11) 99999-9999",
      phone2: "(11) 88888-8888"
    };
    
    savePatient(samplePatient);
  }
  
  if (getProfessionals().length === 0) {
    const sampleProfessional = {
      fullName: "Dr. Carlos Oliveira",
      cpf: "987.654.321-00",
      birthDate: "1980-01-01",
      course: "Pós-graduação em Neuropsicopedagogia",
      phone: "(11) 77777-7777",
      password: "123456"
    };
    
    const professional = saveProfessional(sampleProfessional);
    updateProfessional(professional.id, { approved: true }); // Aprovar automaticamente para testes
  }
};

// Funções de validação
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica sequências inválidas
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let digit1 = ((sum * 10) % 11) % 10;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  let digit2 = ((sum * 10) % 11) % 10;
  
  return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
};

export const validatePhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  phone = phone.replace(/[^\d]/g, '');
  
  // Verifica se tem 10 ou 11 dígitos
  return phone.length === 10 || phone.length === 11;
};
