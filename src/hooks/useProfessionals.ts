
import { useState, useEffect } from 'react';
import { Professional } from '@/types/professional';
import { 
  getProfessionals, 
  saveProfessional, 
  updateProfessional, 
  deleteProfessional,
  getProfessionalById,
  getPendingProfessionals,
  getApprovedProfessionals
} from '@/services/localStorage';
import { useNotification } from '@/hooks/useNotification';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const loadProfessionals = async () => {
    setLoading(true);
    try {
      const data = getProfessionals();
      setProfessionals(data);
    } catch (error) {
      showError('Erro ao carregar profissionais');
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProfessional = async (professionalData: Omit<Professional, 'id' | 'createdAt' | 'updatedAt' | 'approved'>) => {
    setLoading(true);
    try {
      const newProfessional = saveProfessional(professionalData);
      setProfessionals(prev => [...prev, newProfessional]);
      showSuccess('Profissional cadastrado! Aguardando aprovação.');
      return newProfessional;
    } catch (error) {
      showError('Erro ao cadastrar profissional');
      console.error('Erro ao cadastrar profissional:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editProfessional = async (id: string, updates: Partial<Professional>) => {
    setLoading(true);
    try {
      const updatedProfessional = updateProfessional(id, updates);
      if (updatedProfessional) {
        setProfessionals(prev => prev.map(p => p.id === id ? updatedProfessional : p));
        showSuccess('Dados do profissional atualizados!');
        return updatedProfessional;
      } else {
        showError('Profissional não encontrado');
        return null;
      }
    } catch (error) {
      showError('Erro ao atualizar profissional');
      console.error('Erro ao atualizar profissional:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeProfessional = async (id: string) => {
    try {
      const success = deleteProfessional(id);
      if (success) {
        setProfessionals(prev => prev.filter(p => p.id !== id));
        showSuccess('Profissional removido com sucesso!');
        return true;
      } else {
        showError('Erro ao remover profissional');
        return false;
      }
    } catch (error) {
      showError('Erro ao remover profissional');
      console.error('Erro ao remover profissional:', error);
      return false;
    }
  };

  const approveProfessional = async (id: string) => {
    return await editProfessional(id, { approved: true });
  };

  const rejectProfessional = async (id: string) => {
    return await removeProfessional(id);
  };

  const findProfessional = (id: string): Professional | undefined => {
    return professionals.find(p => p.id === id);
  };

  const getPending = (): Professional[] => {
    return getPendingProfessionals();
  };

  const getApproved = (): Professional[] => {
    return getApprovedProfessionals();
  };

  useEffect(() => {
    loadProfessionals();
  }, []);

  return {
    professionals,
    loading,
    addProfessional,
    editProfessional,
    removeProfessional,
    approveProfessional,
    rejectProfessional,
    findProfessional,
    getPending,
    getApproved,
    loadProfessionals
  };
};
