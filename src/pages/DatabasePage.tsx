import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Database, 
  ArrowLeft, 
  Users, 
  UserCheck,
  Download,
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';
import { Patient } from '@/types/patient';
import { Professional } from '@/types/professional';
import { exportPatientsData, exportProfessionalsData, exportAllData } from '@/utils/export';
import { usePatients } from '@/hooks/usePatients';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useNotification } from '@/hooks/useNotification';
import DataTable from '@/components/DataTable';
import PatientSearch from '@/components/PatientSearch';
import PatientEditForm from '@/components/PatientEditForm';
import ProfessionalEditForm from '@/components/ProfessionalEditForm';
import DataImportExport from '@/components/DataImportExport';

const DatabasePage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();
  const { patients, loading: patientsLoading, loadPatients, removePatient } = usePatients();
  const { professionals, loading: professionalsLoading, loadProfessionals, removeProfessional } = useProfessionals();
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfessionalEditModalOpen, setIsProfessionalEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('patients');

  useEffect(() => {
    // Verificar se está logado como admin
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }
  }, [navigate]);

  const stats = {
    totalPatients: patients.length,
    totalProfessionals: professionals.length,
    approvedProfessionals: professionals.filter(p => p.approved).length,
    pendingProfessionals: professionals.filter(p => !p.approved).length
  };

  const handleRefreshData = () => {
    loadPatients();
    loadProfessionals();
    showSuccess('Dados atualizados!');
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      await removePatient(id);
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      await removeProfessional(id);
    }
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsProfessionalEditModalOpen(true);
  };

  const handleExportPatients = () => {
    try {
      exportPatientsData();
      showSuccess('Dados de pacientes exportados com sucesso!');
    } catch (error) {
      showError('Erro ao exportar dados de pacientes');
    }
  };

  const handleExportProfessionals = () => {
    try {
      exportProfessionalsData();
      showSuccess('Dados de profissionais exportados com sucesso!');
    } catch (error) {
      showError('Erro ao exportar dados de profissionais');
    }
  };

  const handleExportAll = () => {
    try {
      exportAllData();
      showSuccess('Backup completo exportado com sucesso!');
    } catch (error) {
      showError('Erro ao exportar backup completo');
    }
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    loadPatients();
    setIsEditModalOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPatient(null);
  };

  const handleSaveProfessional = (updatedProfessional: Professional) => {
    loadProfessionals();
    setIsProfessionalEditModalOpen(false);
    setSelectedProfessional(null);
  };

  const handleCloseProfessionalEditModal = () => {
    setIsProfessionalEditModalOpen(false);
    setSelectedProfessional(null);
  };

  const handleImportPatients = (importedData: any[]) => {
    // Salvar dados importados no localStorage
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    const allPatients = [...existingPatients, ...importedData];
    localStorage.setItem('patients', JSON.stringify(allPatients));
    loadPatients();
  };

  const handleImportProfessionals = (importedData: any[]) => {
    // Salvar dados importados no localStorage
    const existingProfessionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const allProfessionals = [...existingProfessionals, ...importedData];
    localStorage.setItem('professionals', JSON.stringify(allProfessionals));
    loadProfessionals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/admin-dashboard')}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Base de Dados</h1>
                <p className="text-sm text-gray-600">Sistema de Planilhas Internas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleRefreshData} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
              <Button onClick={handleExportAll} className="bg-red-600 hover:bg-red-700" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Backup Geral
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                Total Pacientes
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
                <UserCheck className="h-4 w-4 text-yellow-600" />
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
                <Database className="h-4 w-4 text-purple-600" />
                Total Registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalPatients + stats.totalProfessionals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Busca Avançada e Tabelas de Dados */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patients">Pacientes ({stats.totalPatients})</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais ({stats.totalProfessionals})</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            {/* Busca de Pacientes */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Busca Avançada de Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatientSearch
                  onSelectPatient={(patient) => console.log('Ver paciente:', patient)}
                  onEditPatient={handleEditPatient}
                  showActions={true}
                />
              </CardContent>
            </Card>

            {/* Tabela de Pacientes */}
            <DataTable
              type="patients"
              data={patients}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
              onAdd={() => navigate('/patient-register')}
              onExport={handleExportPatients}
            />

            {/* Importação/Exportação de Pacientes */}
            <DataImportExport
              type="patients"
              data={patients}
              onImport={handleImportPatients}
              onExport={handleExportPatients}
            />
          </TabsContent>

          <TabsContent value="professionals" className="space-y-6">
            <DataTable
              type="professionals"
              data={professionals}
              onEdit={handleEditProfessional}
              onDelete={handleDeleteProfessional}
              onAdd={() => navigate('/professional-register')}
              onExport={handleExportProfessionals}
            />

            {/* Importação/Exportação de Profissionais */}
            <DataImportExport
              type="professionals"
              data={professionals}
              onImport={handleImportProfessionals}
              onExport={handleExportProfessionals}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Edição de Paciente */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <PatientEditForm
              patient={selectedPatient}
              onSave={handleSavePatient}
              onClose={handleCloseEditModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Profissional */}
      <Dialog open={isProfessionalEditModalOpen} onOpenChange={setIsProfessionalEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Profissional</DialogTitle>
          </DialogHeader>
          {selectedProfessional && (
            <ProfessionalEditForm
              professional={selectedProfessional}
              onSave={handleSaveProfessional}
              onClose={handleCloseProfessionalEditModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabasePage;
