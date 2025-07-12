
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, X, User } from 'lucide-react';
import { Patient } from '@/types/patient';
import { usePatients } from '@/hooks/usePatients';
import { validateCPF, validatePhone } from '@/utils/validation';
import { calculateAge } from '@/services/localStorage';

interface PatientEditFormProps {
  patient: Patient;
  onSave?: (patient: Patient) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({
  patient,
  onSave,
  onCancel,
  onClose
}) => {
  const { editPatient, loading } = usePatients();
  const [formData, setFormData] = useState<Patient>(patient);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(patient);
  }, [patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Recalcular idade se a data de nascimento mudou
      ...(name === 'birthDate' ? { age: calculateAge(value) } : {})
    }));

    // Limpar erro do campo quando o usuário digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.motherName.trim()) {
      newErrors.motherName = 'Nome da mãe é obrigatório';
    }

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = 'Nome do pai é obrigatório';
    }

    if (!formData.phone1.trim()) {
      newErrors.phone1 = 'Telefone principal é obrigatório';
    } else if (!validatePhone(formData.phone1)) {
      newErrors.phone1 = 'Telefone inválido';
    }

    if (formData.phone2 && !validatePhone(formData.phone2)) {
      newErrors.phone2 = 'Telefone secundário inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updatedPatient = await editPatient(patient.id, formData);
      if (updatedPatient && onSave) {
        onSave(updatedPatient);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const handleCancel = () => {
    setFormData(patient);
    setErrors({});
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Editar Paciente
          <Badge variant="outline" className="ml-auto">
            {formData.age} anos
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              className={errors.cpf ? 'border-red-500' : ''}
            />
            {errors.cpf && (
              <p className="text-sm text-red-500">{errors.cpf}</p>
            )}
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento *</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              className={errors.birthDate ? 'border-red-500' : ''}
            />
            {errors.birthDate && (
              <p className="text-sm text-red-500">{errors.birthDate}</p>
            )}
          </div>

          {/* Nome da Mãe */}
          <div className="space-y-2">
            <Label htmlFor="motherName">Nome da Mãe *</Label>
            <Input
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
              className={errors.motherName ? 'border-red-500' : ''}
            />
            {errors.motherName && (
              <p className="text-sm text-red-500">{errors.motherName}</p>
            )}
          </div>

          {/* Nome do Pai */}
          <div className="space-y-2">
            <Label htmlFor="fatherName">Nome do Pai *</Label>
            <Input
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              className={errors.fatherName ? 'border-red-500' : ''}
            />
            {errors.fatherName && (
              <p className="text-sm text-red-500">{errors.fatherName}</p>
            )}
          </div>

          {/* Telefones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone1">Telefone Principal *</Label>
              <Input
                id="phone1"
                name="phone1"
                value={formData.phone1}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                className={errors.phone1 ? 'border-red-500' : ''}
              />
              {errors.phone1 && (
                <p className="text-sm text-red-500">{errors.phone1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone2">Telefone Secundário</Label>
              <Input
                id="phone2"
                name="phone2"
                value={formData.phone2 || ''}
                onChange={handleInputChange}
                placeholder="(11) 88888-8888"
                className={errors.phone2 ? 'border-red-500' : ''}
              />
              {errors.phone2 && (
                <p className="text-sm text-red-500">{errors.phone2}</p>
              )}
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Cadastrado em:</strong> {formatDate(formData.createdAt)}</p>
              <p><strong>Última atualização:</strong> {formatDate(formData.updatedAt)}</p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientEditForm;
