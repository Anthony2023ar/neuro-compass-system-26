
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  User, 
  Calendar, 
  FileText, 
  Syringe, 
  BookOpen, 
  Camera, 
  Clock,
  Phone,
  LogOut,
  Heart,
  Activity,
  Puzzle,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Dados fictícios para demonstração - em uma aplicação real, viriam de uma API
  const nextVisit = {
    date: "2024-01-15",
    time: "14:30"
  };

  const treatmentTypes = [
    "Avaliação Neuropsicopedagógica",
    "Intervenção Cognitiva", 
    "Estimulação da Linguagem",
    "Treinamento de Memória e Atenção",
    "Acompanhamento Escolar",
    "Orientação Familiar",
    "Reforço Psicopedagógico",
    "Atividades Lúdicas de Desenvolvimento",
    "Sessões com recursos visuais e gamificação"
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // Será redirecionado pela ProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Área do Paciente</h1>
                <p className="text-sm text-gray-600">Olá, {user.fullName}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Dados Cadastrais */}
          <Card className="lg:col-span-1 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                Dados Cadastrais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                <p className="text-gray-800">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">CPF</p>
                <p className="text-gray-800">{user.cpf}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Idade</p>
                <p className="text-gray-800">{user.age} anos</p>
              </div>
              {user.fatherName && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome do Pai</p>
                  <p className="text-gray-800">{user.fatherName}</p>
                </div>
              )}
              {user.motherName && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome da Mãe</p>
                  <p className="text-gray-800">{user.motherName}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Telefones</p>
                {user.phone1 && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone1}</span>
                  </div>
                )}
                {user.phone2 && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone2}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Próxima Visita */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Próxima Visita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{new Date(nextVisit.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{nextVisit.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de Informações */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Laudos Médicos */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Laudos Médicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Nenhum laudo cadastrado</p>
                </CardContent>
              </Card>

              {/* Vacinas */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Syringe className="h-5 w-5 text-red-600" />
                    Vacinas Recebidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Nenhuma vacina registrada</p>
                </CardContent>
              </Card>

              {/* Atividades */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Atividades Realizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Nenhuma atividade registrada</p>
                </CardContent>
              </Card>

              {/* Fotos dos Avanços */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5 text-indigo-600" />
                    Fotos dos Avanços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Nenhuma foto cadastrada</p>
                </CardContent>
              </Card>
            </div>

            {/* Sessões Neuropsicopedagógicas */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Descrição das Sessões Neuropsicopedagógicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Nenhuma sessão registrada ainda</p>
              </CardContent>
            </Card>

            {/* Tipos de Atendimento */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Puzzle className="h-5 w-5 text-teal-600" />
                  Tipos de Atendimento Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-2">
                  {treatmentTypes.map((type, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="justify-start p-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border border-blue-200"
                    >
                      {index < 4 && <Heart className="mr-2 h-3 w-3" />}
                      {index >= 4 && index < 7 && <Activity className="mr-2 h-3 w-3" />}
                      {index >= 7 && <Gamepad2 className="mr-2 h-3 w-3" />}
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
