import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Stethoscope, Shield, ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingChat } from "@/components/FloatingChat";

const Index = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  // Se usuário logado, mostrar menu smart
  if (profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <FloatingChat />
        <div className="container mx-auto px-4 py-8">
          {/* Header com perfil */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Bem-vindo, {profile.full_name}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sistema de Neuropsicopedagogia - Acesse suas áreas específicas
            </p>
          </div>

          {/* Menu por tipo de usuário */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {profile.user_type === 'patient' && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl w-fit mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">Minha Área</CardTitle>
                  <CardDescription className="text-gray-600">
                    Acompanhe seu tratamento e evolução
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/patient-dashboard')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {profile.user_type === 'professional' && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl w-fit mb-3">
                    <Stethoscope className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">Área Profissional</CardTitle>
                  <CardDescription className="text-gray-600">
                    Gerencie pacientes e atividades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/professional-dashboard')}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {profile.user_type === 'admin' && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl w-fit mb-3">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">Painel Admin</CardTitle>
                  <CardDescription className="text-gray-600">
                    Gestão completa do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Acessar Painel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ações rápidas */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl w-fit mb-3">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">Chat</CardTitle>
                <CardDescription className="text-gray-600">
                  Comunicação instantânea
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => {/* Chat já está flutuante */}}
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                >
                  Chat Flutuante Ativo
                </Button>
              </CardContent>
            </Card>

            {(profile.user_type === 'professional' || profile.user_type === 'patient') && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl w-fit mb-3">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">Agenda</CardTitle>
                  <CardDescription className="text-gray-600">
                    Consultas e compromissos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(profile.user_type === 'professional' ? '/professional-dashboard' : '/patient-dashboard')}
                    variant="outline"
                    className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    Ver Agenda
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Botão de Logout */}
          <div className="mt-16 text-center">
            <Button 
              onClick={logout}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Sair do Sistema
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se não logado, mostrar página de login
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sistema de Neuropsicopedagogia
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plataforma completa para gestão de pacientes e profissionais especializados em neuropsicopedagogia
          </p>
        </div>

        {/* Cards de Acesso */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Área do Paciente */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl w-fit mb-3">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Área do Paciente</CardTitle>
              <CardDescription className="text-gray-600">
                Acesse sua área pessoal e acompanhe seu tratamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/patient-login')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Fazer Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate('/patient-register')}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Criar Conta
              </Button>
            </CardContent>
          </Card>

          {/* Área do Profissional */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl w-fit mb-3">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Área do Profissional</CardTitle>
              <CardDescription className="text-gray-600">
                Gerencie seus pacientes e atividades profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/professional-login')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Fazer Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate('/professional-register')}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Cadastrar-se
              </Button>
            </CardContent>
          </Card>

          {/* Área Administrativa */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl w-fit mb-3">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Área Administrativa</CardTitle>
              <CardDescription className="text-gray-600">
                Acesso restrito para gestão do sistema e backup de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin-login')}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Acesso Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800 text-center">
                  Área restrita para administradores
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Sistema */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sobre o Sistema
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Para Pacientes</h3>
                <p>Acompanhe seu tratamento, visualize atividades realizadas e mantenha contato com seu neuropsicopedagogo.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Para Profissionais</h3>
                <p>Gerencie seus pacientes, registre atividades e acompanhe o progresso de cada caso.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Administração</h3>
                <p>Sistema de backup completo, exportação de dados e gestão de usuários.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;