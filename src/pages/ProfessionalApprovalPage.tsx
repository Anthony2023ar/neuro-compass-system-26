
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  UserCheck, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Professional } from '@/types/professional';
import { getProfessionals, updateProfessional } from '@/services/localStorage';
import ProfessionalApproval from '@/components/ProfessionalApproval';

const ProfessionalApprovalPage = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se está logado como admin
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }

    loadProfessionals();
  }, [navigate]);

  const loadProfessionals = () => {
    setIsLoading(true);
    try {
      const professionalsData = getProfessionals();
      setProfessionals(professionalsData);
    } catch (error) {
      toast.error('Erro ao carregar profissionais');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    const updatedProfessional = updateProfessional(id, { approved: true });
    if (updatedProfessional) {
      setProfessionals(prev => 
        prev.map(p => p.id === id ? updatedProfessional : p)
      );
    }
  };

  const handleReject = (id: string) => {
    // Remover profissional negado do sistema
    const updatedProfessionals = professionals.filter(p => p.id !== id);
    setProfessionals(updatedProfessionals);
    localStorage.setItem('professionals', JSON.stringify(updatedProfessionals));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-red-600 mx-auto mb-2" />
          <p className="text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

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
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Aprovação de Profissionais</h1>
                <p className="text-sm text-gray-600">Gerencie cadastros pendentes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={loadProfessionals} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <ProfessionalApproval
          professionals={professionals}
          onApprove={handleApprove}
          onReject={handleReject}
          onRefresh={loadProfessionals}
        />
      </div>
    </div>
  );
};

export default ProfessionalApprovalPage;
