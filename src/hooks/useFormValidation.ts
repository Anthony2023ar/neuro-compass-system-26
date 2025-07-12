import { useState } from 'react';

export interface ValidationRule {
  field: string;
  validator: (value: any, formData?: any) => string | null;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any, rules: ValidationRule[]): string | null => {
    const rule = rules.find(r => r.field === field);
    if (!rule) return null;
    
    return rule.validator(value);
  };

  const validateForm = (formData: any, rules: ValidationRule[]): boolean => {
    const newErrors: Record<string, string> = {};

    rules.forEach(rule => {
      const value = formData[rule.field];
      const error = rule.validator(value, formData);
      if (error) {
        newErrors[rule.field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    setErrors
  };
};

// Validadores comuns
export const validators = {
  required: (message = 'Campo obrigatório') => (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return null;
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `Deve ter pelo menos ${min} caracteres`;
    }
    return null;
  },

  email: (message = 'Email inválido') => (value: string) => {
    if (value && !value.includes('@')) {
      return message;
    }
    return null;
  },

  cpf: (validateFn: (cpf: string) => boolean, message = 'CPF inválido') => (value: string) => {
    if (value && !validateFn(value)) {
      return message;
    }
    return null;
  },

  phone: (validateFn: (phone: string) => boolean, message = 'Telefone inválido') => (value: string) => {
    if (value && !validateFn(value)) {
      return message;
    }
    return null;
  }
};