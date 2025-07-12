
import { validateCPF, validatePhone } from './validation';

export interface ValidationError {
  field: string;
  message: string;
}

export interface PatientFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  phone1: string;
  phone2?: string;
}

export interface ProfessionalFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  course: string;
  phone: string;
  password: string;
}

export const validatePatientForm = (data: PatientFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Nome completo
  if (!data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Nome completo é obrigatório' });
  } else if (data.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Nome deve ter pelo menos 2 caracteres' });
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.fullName.trim())) {
    errors.push({ field: 'fullName', message: 'Nome deve conter apenas letras e espaços' });
  }

  // CPF
  if (!data.cpf.trim()) {
    errors.push({ field: 'cpf', message: 'CPF é obrigatório' });
  } else if (!validateCPF(data.cpf)) {
    errors.push({ field: 'cpf', message: 'CPF inválido' });
  }

  // Data de nascimento
  if (!data.birthDate) {
    errors.push({ field: 'birthDate', message: 'Data de nascimento é obrigatória' });
  } else {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    
    if (birthDate > today) {
      errors.push({ field: 'birthDate', message: 'Data de nascimento não pode ser no futuro' });
    } else if (birthDate < minDate) {
      errors.push({ field: 'birthDate', message: 'Data de nascimento inválida' });
    }
  }

  // Nome da mãe
  if (!data.motherName.trim()) {
    errors.push({ field: 'motherName', message: 'Nome da mãe é obrigatório' });
  } else if (data.motherName.trim().length < 2) {
    errors.push({ field: 'motherName', message: 'Nome da mãe deve ter pelo menos 2 caracteres' });
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.motherName.trim())) {
    errors.push({ field: 'motherName', message: 'Nome da mãe deve conter apenas letras e espaços' });
  }

  // Nome do pai
  if (!data.fatherName.trim()) {
    errors.push({ field: 'fatherName', message: 'Nome do pai é obrigatório' });
  } else if (data.fatherName.trim().length < 2) {
    errors.push({ field: 'fatherName', message: 'Nome do pai deve ter pelo menos 2 caracteres' });
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.fatherName.trim())) {
    errors.push({ field: 'fatherName', message: 'Nome do pai deve conter apenas letras e espaços' });
  }

  // Telefone principal
  if (!data.phone1.trim()) {
    errors.push({ field: 'phone1', message: 'Telefone principal é obrigatório' });
  } else if (!validatePhone(data.phone1)) {
    errors.push({ field: 'phone1', message: 'Telefone principal inválido' });
  }

  // Telefone secundário (opcional)
  if (data.phone2 && data.phone2.trim() && !validatePhone(data.phone2)) {
    errors.push({ field: 'phone2', message: 'Telefone secundário inválido' });
  }

  return errors;
};

export const validateProfessionalForm = (data: ProfessionalFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Nome completo
  if (!data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Nome completo é obrigatório' });
  } else if (data.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Nome deve ter pelo menos 2 caracteres' });
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.fullName.trim())) {
    errors.push({ field: 'fullName', message: 'Nome deve conter apenas letras e espaços' });
  }

  // CPF
  if (!data.cpf.trim()) {
    errors.push({ field: 'cpf', message: 'CPF é obrigatório' });
  } else if (!validateCPF(data.cpf)) {
    errors.push({ field: 'cpf', message: 'CPF inválido' });
  }

  // Data de nascimento
  if (!data.birthDate) {
    errors.push({ field: 'birthDate', message: 'Data de nascimento é obrigatória' });
  } else {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxAge = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
    
    if (birthDate > today) {
      errors.push({ field: 'birthDate', message: 'Data de nascimento não pode ser no futuro' });
    } else if (birthDate > minAge) {
      errors.push({ field: 'birthDate', message: 'Profissional deve ter pelo menos 18 anos' });
    } else if (birthDate < maxAge) {
      errors.push({ field: 'birthDate', message: 'Data de nascimento inválida' });
    }
  }

  // Curso
  if (!data.course.trim()) {
    errors.push({ field: 'course', message: 'Curso/Formação é obrigatório' });
  } else if (data.course.trim().length < 5) {
    errors.push({ field: 'course', message: 'Curso deve ter pelo menos 5 caracteres' });
  }

  // Telefone
  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'Telefone é obrigatório' });
  } else if (!validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Telefone inválido' });
  }

  // Senha
  if (!data.password) {
    errors.push({ field: 'password', message: 'Senha é obrigatória' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' });
  } else if (!/(?=.*[a-z])/.test(data.password)) {
    errors.push({ field: 'password', message: 'Senha deve conter pelo menos uma letra minúscula' });
  } else if (!/(?=.*[A-Z])/.test(data.password)) {
    errors.push({ field: 'password', message: 'Senha deve conter pelo menos uma letra maiúscula' });
  } else if (!/(?=.*\d)/.test(data.password)) {
    errors.push({ field: 'password', message: 'Senha deve conter pelo menos um número' });
  }

  return errors;
};

export const formatFormErrors = (errors: ValidationError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(error => {
    errorMap[error.field] = error.message;
  });
  return errorMap;
};
