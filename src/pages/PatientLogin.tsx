
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier.trim()) {
      toast.error('Por favor, preencha o CPF ou Nome Completo');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(formData.identifier, 'patient');
      
      if (success) {
        toast.success('Bem-vindo(a) à 🧠 Neuropsicopedagogia!', {
          duration: 3000,
        });
        
        setTimeout(() => {
          navigate('/patient-dashboard');
        }, 1000);
      } else {
        toast.error('Paciente não encontrado. Verifique o CPF ou Nome Completo ou cadastre-se primeiro.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardTitle className="text-2xl font-bold text-gray-800">Login do Paciente</CardTitle>
            <p className="text-gray-600">Acesse sua área pessoal</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                  CPF ou Nome Completo *
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="Digite seu CPF ou Nome Completo"
                  disabled={isLoading}
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Primeira vez aqui?</strong><br />
                  Use seu CPF ou nome completo cadastrado no sistema. Se não possui cadastro, registre-se primeiro.
                </p>
              </div>

              

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/patient-register')}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Cadastre-se aqui
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

export default PatientLogin;
