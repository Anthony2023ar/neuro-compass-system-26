
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { savePatient, calculateAge } from '@/services/localStorage';
import { patientSchema, type PatientFormData } from '@/utils/validation';

const PatientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    birthDate: '',
    cpf: '',
    fatherName: '',
    motherName: '',
    phone1: '',
    phone2: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      patientSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const patientData = {
        ...formData,
        age: calculateAge(formData.birthDate)
      };
      
      savePatient(patientData);
      
      toast.success('✅ Cadastro realizado com sucesso!', {
        duration: 4000,
      });
      
      setTimeout(() => {
        navigate('/patient-login');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-fit mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Cadastro do Paciente</CardTitle>
            <p className="text-gray-600">Crie sua conta para acessar o sistema</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Nome Completo *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.fullName ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                  />
                  {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                    Data de Nascimento *
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.birthDate ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                  />
                  {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate}</p>}
                  {formData.birthDate && (
                    <p className="text-sm text-gray-600">
                      Idade: {calculateAge(formData.birthDate)} anos
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                    CPF *
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.cpf ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                  />
                  {errors.cpf && <p className="text-sm text-red-600">{errors.cpf}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-sm font-medium text-gray-700">
                    Nome do Pai *
                  </Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Nome completo do pai"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.fatherName ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                  />
                  {errors.fatherName && <p className="text-sm text-red-600">{errors.fatherName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherName" className="text-sm font-medium text-gray-700">
                    Nome da Mãe *
                  </Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    type="text"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="Nome completo da mãe"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.motherName ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                  />
                  {errors.motherName && <p className="text-sm text-red-600">{errors.motherName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone1" className="text-sm font-medium text-gray-700">
                    Telefone Principal *
                  </Label>
                  <Input
                    id="phone1"
                    name="phone1"
                    type="tel"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.phone1 ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                  />
                  {errors.phone1 && <p className="text-sm text-red-600">{errors.phone1}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone2" className="text-sm font-medium text-gray-700">
                    Telefone Secundário
                  </Label>
                  <Input
                    id="phone2"
                    name="phone2"
                    type="tel"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000 (opcional)"
                    disabled={isLoading}
                    className="h-12 border-2 border-gray-200 focus:border-blue-400"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Já tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/patient-login')}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Faça login
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientRegister;
