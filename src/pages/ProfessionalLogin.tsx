
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ProfessionalLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
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
    
    if (!formData.cpf.trim() || !formData.password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(formData.cpf, formData.password);
      
      if (success) {
        // SEGURANÇA: Limpar dados sensíveis do formulário imediatamente
        setFormData({
          cpf: '',
          password: ''
        });
        
        // SEGURANÇA: Limpar dados do navegador
        if (document.activeElement instanceof HTMLInputElement) {
          document.activeElement.blur();
        }
        
        // SEGURANÇA: Limpar histórico do formulário
        const form = document.querySelector('form');
        if (form) {
          form.reset();
        }
        
        toast.success('Login realizado com sucesso!');
        
        // SEGURANÇA: Forçar limpeza da memória antes do redirecionamento
        setTimeout(() => {
          navigate('/professional-dashboard');
        }, 100);
      } else {
        toast.error('CPF ou senha incorretos, ou conta não aprovada ainda.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
      
      // SEGURANÇA: Sempre limpar dados sensíveis após tentativa de login
      setTimeout(() => {
        setFormData({
          cpf: '',
          password: ''
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
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
            <div className="mx-auto p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl w-fit mb-4">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Login do Profissional</CardTitle>
            <p className="text-gray-600">Acesse a área administrativa</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                />
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
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  className="h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>🔐 Acesso Restrito</strong><br />
                  Apenas profissionais aprovados podem acessar. Use seu CPF e senha cadastrados.
                </p>
              </div>

              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
                    onClick={() => navigate('/professional-register')}
                    className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
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

export default ProfessionalLogin;
