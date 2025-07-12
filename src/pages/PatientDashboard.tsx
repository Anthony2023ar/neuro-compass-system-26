
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Gamepad2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientById } from '@/services/localStorage';
import type { Patient } from '@/types/patient';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatientData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          // Buscar dados completos do paciente
          const fullPatientData = getPatientById(user.id);
          if (fullPatientData) {
            setPatientData(fullPatientData);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do paciente:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPatientData();
  }, [user?.id]);

  // Dados fictícios para demonstração - serão substituídos pelos dados reais
  const nextVisit = patientData?.nextVisit || {
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
    // SEGURANÇA: Limpar dados do paciente da memória
    setPatientData(null);
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // Será redirecionado pela ProtectedRoute
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do paciente...</p>
        </div>
      </div>
    );
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

      <div className="container mx-auto px-4 py-8">{patientData ? (
        <div className="grid lg:grid-cols-3 gap-8">{/* Dados Cadastrais */}
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
                <p className="text-gray-800">{patientData.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Idade</p>
                <p className="text-gray-800">{patientData.age} anos</p>
              </div>
              {patientData.fatherName && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome do Pai</p>
                  <p className="text-gray-800">{patientData.fatherName}</p>
                </div>
              )}
              {patientData.motherName && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome da Mãe</p>
                  <p className="text-gray-800">{patientData.motherName}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Telefones</p>
                {patientData.phone1 && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="h-4 w-4" />
                    <span>{patientData.phone1}</span>
                  </div>
                )}
                {patientData.phone2 && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="h-4 w-4" />
                    <span>{patientData.phone2}</span>
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
                {nextVisit.date ? (
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
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Nenhuma consulta agendada. Entre em contato com seu neuropsicopedagogo.
                    </AlertDescription>
                  </Alert>
                )}
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
                  {patientData.medicalReports && patientData.medicalReports.length > 0 ? (
                    <div className="space-y-2">
                      {patientData.medicalReports.map((report, index) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg">
                          <p className="font-medium text-orange-800">{report.title}</p>
                          <p className="text-sm text-orange-700">{report.description}</p>
                          <p className="text-xs text-orange-600">{report.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhum laudo cadastrado</p>
                  )}
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
                  {patientData.vaccines && patientData.vaccines.length > 0 ? (
                    <div className="space-y-2">
                      {patientData.vaccines.map((vaccine, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="font-medium text-red-800">{vaccine.name}</span>
                          <span className="text-sm text-red-600">{vaccine.date}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma vacina registrada</p>
                  )}
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
                  {patientData.activities && patientData.activities.length > 0 ? (
                    <div className="space-y-2">
                      {patientData.activities.map((activity, index) => (
                        <div key={index} className="p-3 bg-purple-50 rounded-lg">
                          <p className="font-medium text-purple-800">{activity.title}</p>
                          <p className="text-sm text-purple-700">{activity.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-purple-600">{activity.date}</span>
                            <Badge variant={activity.completed ? "default" : "secondary"}>
                              {activity.completed ? 'Concluída' : 'Em andamento'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma atividade registrada</p>
                  )}
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
                  {patientData.photos && patientData.photos.length > 0 ? (
                    <div className="space-y-2">
                      {patientData.photos.map((photo, index) => (
                        <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                          <p className="font-medium text-indigo-800">{photo.title}</p>
                          <p className="text-sm text-indigo-700">{photo.description}</p>
                          <p className="text-xs text-indigo-600">{photo.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma foto cadastrada</p>
                  )}
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
                {patientData.sessions && patientData.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {patientData.sessions.map((session, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-blue-800">{session.date}</span>
                          <Badge variant="outline" className="text-blue-700">
                            {session.duration} min
                          </Badge>
                        </div>
                        <p className="text-blue-700 mb-2">{session.description}</p>
                        {session.activities && session.activities.length > 0 && (
                          <div className="text-sm text-blue-600">
                            <strong>Atividades:</strong> {session.activities.join(', ')}
                          </div>
                        )}
                        {session.observations && (
                          <p className="text-sm text-blue-600 mt-1">
                            <strong>Observações:</strong> {session.observations}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 mb-4">Nenhuma sessão registrada ainda</p>
                )}
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
      ) : (
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não foi possível carregar os dados completos do paciente. Alguns dados podem estar limitados por segurança.
          </AlertDescription>
        </Alert>
      )}
      </div>
    </div>
  );
};

export default PatientDashboard;
