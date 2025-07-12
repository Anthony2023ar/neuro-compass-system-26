
import { z } from 'zod';

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  const digits = cleanCPF.split('').map(Number);
  
  // Validar primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== digits[9]) return false;
  
  // Validar segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== digits[10]) return false;
  
  return true;
};

// Validação de telefone
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Schemas de validação
export const patientSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  fatherName: z.string().min(2, 'Nome do pai deve ter pelo menos 2 caracteres'),
  motherName: z.string().min(2, 'Nome da mãe deve ter pelo menos 2 caracteres'),
  phone1: z.string().refine(validatePhone, 'Telefone inválido'),
  phone2: z.string().optional()
});

export const professionalSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  course: z.string().min(5, 'Curso deve ter pelo menos 5 caracteres'),
  phone: z.string().refine(validatePhone, 'Telefone inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export type PatientFormData = z.infer<typeof patientSchema>;
export type ProfessionalFormData = z.infer<typeof professionalSchema>;
