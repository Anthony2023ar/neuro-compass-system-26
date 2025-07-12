import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Save, X, UserCheck } from 'lucide-react';
import { Professional } from '@/types/professional';
import { useProfessionals } from '@/hooks/useProfessionals';
import { validateCPF, validatePhone } from '@/utils/validation';

interface ProfessionalEditFormProps {
  professional: Professional;
  onSave?: (professional: Professional) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const ProfessionalEditForm: React.FC<ProfessionalEditFormProps> = ({
  professional,
  onSave,
  onCancel,
  onClose
}) => {
  const { editProfessional, loading } = useProfessionals();
  const [formData, setFormData] = useState<Professional>(professional);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(professional);
  }, [professional]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      approved: checked
    }));
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Curso é obrigatório';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
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
      const updatedProfessional = await editProfessional(professional.id, formData);
      if (updatedProfessional && onSave) {
        onSave(updatedProfessional);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    }
  };

  const handleCancel = () => {
    setFormData(professional);
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
          <UserCheck className="h-5 w-5 text-green-600" />
          Editar Profissional
          <Badge 
            variant={formData.approved ? "default" : "secondary"} 
            className="ml-auto"
          >
            {formData.approved ? 'Aprovado' : 'Pendente'}
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

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Curso e Senha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Input
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className={errors.course ? 'border-red-500' : ''}
              />
              {errors.course && (
                <p className="text-sm text-red-500">{errors.course}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Status de Aprovação */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="approved"
                checked={formData.approved}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="approved" className="text-sm font-medium">
                Profissional Aprovado
              </Label>
            </div>
            <p className="text-xs text-gray-600">
              {formData.approved 
                ? 'Profissional pode acessar o sistema' 
                : 'Profissional aguarda aprovação para acessar o sistema'
              }
            </p>
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

export default ProfessionalEditForm;