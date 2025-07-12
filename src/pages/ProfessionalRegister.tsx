
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveProfessional } from '@/services/localStorage';
import { professionalSchema, type ProfessionalFormData } from '@/utils/validation';

const ProfessionalRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfessionalFormData>({
    fullName: '',
    cpf: '',
    birthDate: '',
    course: '',
    phone: '',
    password: ''
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
      professionalSchema.parse(formData);
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      saveProfessional(formData);
      
      toast.success(
        '✅ Cadastro realizado! Aguarde: sua solicitação será analisada em até 24 horas. Você receberá uma mensagem no WhatsApp confirmando sua solicitação.',
        {
          duration: 6000,
        }
      );
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error('Erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 px-4">
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
            <div className="mx-auto p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl w-fit mb-4">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Cadastro do Profissional</CardTitle>
            <p className="text-gray-600">Registre-se como neuropsicopedagogo</p>
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
                    className={`h-12 border-2 ${errors.fullName ? 'border-red-400' : 'border-gray-200'} focus:border-purple-400`}
                  />
                  {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
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
                    className={`h-12 border-2 ${errors.cpf ? 'border-red-400' : 'border-gray-200'} focus:border-purple-400`}
                  />
                  {errors.cpf && <p className="text-sm text-red-600">{errors.cpf}</p>}
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
                    className={`h-12 border-2 ${errors.birthDate ? 'border-red-400' : 'border-gray-200'} focus:border-purple-400`}
                  />
                  {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium text-gray-700">
                    Curso Realizado *
                  </Label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="Ex: Pós-graduação em Neuropsicopedagogia"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.course ? 'border-red-400' : 'border-gray-200'} focus:border-purple-400`}
                  />
                  {errors.course && <p className="text-sm text-red-600">{errors.course}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.phone ? 'border-red-400' : 'border-gray-200'} focus:border-purple-400`}
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Crie uma senha segura"
                    disabled={isLoading}
                    className={`h-12 border-2 ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:border-purple-400`}
                  />
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
                    onClick={() => navigate('/professional-login')}
                    className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
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

export default ProfessionalRegister;
