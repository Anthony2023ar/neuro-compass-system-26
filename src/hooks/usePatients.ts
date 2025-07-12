
import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';
import { 
  getPatients, 
  savePatient, 
  updatePatient, 
  deletePatient, 
  getPatientById,
  searchPatients 
} from '@/services/localStorage';
import { useNotification } from '@/hooks/useNotification';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = getPatients();
      setPatients(data);
    } catch (error) {
      showError('Erro ao carregar pacientes');
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newPatient = savePatient(patientData);
      setPatients(prev => [...prev, newPatient]);
      showSuccess('Paciente cadastrado com sucesso!');
      return newPatient;
    } catch (error) {
      showError('Erro ao cadastrar paciente');
      console.error('Erro ao cadastrar paciente:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editPatient = async (id: string, updates: Partial<Patient>) => {
    setLoading(true);
    try {
      const updatedPatient = updatePatient(id, updates);
      if (updatedPatient) {
        setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
        showSuccess('Dados do paciente atualizados!');
        return updatedPatient;
      } else {
        showError('Paciente não encontrado');
        return null;
      }
    } catch (error) {
      showError('Erro ao atualizar paciente');
      console.error('Erro ao atualizar paciente:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removePatient = async (id: string) => {
    try {
      const success = deletePatient(id);
      if (success) {
        setPatients(prev => prev.filter(p => p.id !== id));
        showSuccess('Paciente removido com sucesso!');
        return true;
      } else {
        showError('Erro ao remover paciente');
        return false;
      }
    } catch (error) {
      showError('Erro ao remover paciente');
      console.error('Erro ao remover paciente:', error);
      return false;
    }
  };

  const findPatient = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
  };

  const searchPatientsByQuery = (query: string): Patient[] => {
    return searchPatients(query);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return {
    patients,
    loading,
    addPatient,
    editPatient,
    removePatient,
    findPatient,
    searchPatientsByQuery,
    loadPatients
  };
};
