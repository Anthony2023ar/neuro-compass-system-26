import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Download, 
  Database, 
  Calendar,
  LogOut,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { exportPatientsData, exportProfessionalsData, exportAllData } from '@/utils/export';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalProfessionals: 0,
    approvedProfessionals: 0,
    pendingProfessionals: 0
  });

  useEffect(() => {
    // Verificar se está logado como admin
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }

    // Carregar estatísticas
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    
    setStats({
      totalPatients: patients.length,
      totalProfessionals: professionals.length,
      approvedProfessionals: professionals.filter((p: any) => p.approved).length,
      pendingProfessionals: professionals.filter((p: any) => !p.approved).length
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    toast.success('Logout realizado com sucesso');
    navigate('/');
  };

  const handleExportPatients = () => {
    try {
      exportPatientsData();
      toast.success('Dados de pacientes exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar dados de pacientes');
    }
  };

  const handleExportProfessionals = () => {
    try {
      exportProfessionalsData();
      toast.success('Dados de profissionais exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar dados de profissionais');
    }
  };

  const handleExportAll = () => {
    try {
      exportAllData();
      toast.success('Backup completo exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup completo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Administração</h1>
                <p className="text-sm text-gray-600">Gestão do Sistema</p>
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
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Estatísticas */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                Total de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalPatients}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <UserCheck className="h-4 w-4 text-green-600" />
                Profissionais Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approvedProfessionals}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4 text-yellow-600" />
                Profissionais Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingProfessionals}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalPatients + stats.totalProfessionals}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Aprovação de Profissionais */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Aprovação de Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Profissionais Pendentes: {stats.pendingProfessionals}</strong>
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Gerencie e aprove cadastros de novos profissionais
                </p>
                <Button 
                  onClick={() => navigate('/professional-approval')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Gerenciar Aprovações
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.approvedProfessionals}</div>
                  <div className="text-sm text-gray-600">Aprovados</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingProfessionals}</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acesso ao Banco de Dados Interno */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Banco de Dados Interno
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Sistema de Planilhas Internas</strong>
                </p>
                <p className="text-sm text-blue-700 mb-3">
                  Visualize, edite e gerencie todos os dados em formato de planilha
                </p>
                <Button 
                  onClick={() => navigate('/database')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Acessar Banco de Dados
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalPatients}</div>
                  <div className="text-sm text-gray-600">Pacientes</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalProfessionals}</div>
                  <div className="text-sm text-gray-600">Profissionais</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup e Export */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-red-600" />
                Backup e Export de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Backup Completo do Sistema</strong>
                </p>
                <p className="text-sm text-red-700 mb-3">
                  Exporta todos os dados em planilha CSV
                </p>
                <Button 
                  onClick={handleExportAll}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Backup Completo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleExportPatients}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Pacientes
                </Button>
                
                <Button 
                  onClick={handleExportProfessionals}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Profissionais
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Sistema */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Último Backup</p>
                  <p className="text-gray-800">{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Status do Sistema</p>
                  <Badge className="bg-green-100 text-green-800">Operacional</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Versão</p>
                  <p className="text-gray-800">1.1.0 - Sistema de Aprovação + Banco Interno</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Administrador responsável pela gestão do sistema de neuropsicopedagogia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
