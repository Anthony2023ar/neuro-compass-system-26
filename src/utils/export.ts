
import { Patient } from '@/types/patient';
import { Professional } from '@/types/professional';

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportPatientsData = () => {
  const patients: Patient[] = JSON.parse(localStorage.getItem('patients') || '[]');
  const exportData = patients.map(patient => ({
    'Nome Completo': patient.fullName,
    'CPF': patient.cpf,
    'Idade': patient.age,
    'Data de Nascimento': patient.birthDate,
    'Nome do Pai': patient.fatherName,
    'Nome da Mãe': patient.motherName,
    'Telefone 1': patient.phone1,
    'Telefone 2': patient.phone2 || '',
    'Data de Cadastro': new Date(patient.id).toLocaleDateString('pt-BR')
  }));
  
  exportToCSV(exportData, `pacientes_${new Date().toISOString().split('T')[0]}`);
};

export const exportProfessionalsData = () => {
  const professionals: Professional[] = JSON.parse(localStorage.getItem('professionals') || '[]');
  const exportData = professionals.map(professional => ({
    'Nome Completo': professional.fullName,
    'CPF': professional.cpf,
    'Data de Nascimento': professional.birthDate,
    'Curso': professional.course,
    'Telefone': professional.phone,
    'Status': professional.approved ? 'Aprovado' : 'Pendente',
    'Data de Cadastro': new Date(professional.id).toLocaleDateString('pt-BR')
  }));
  
  exportToCSV(exportData, `profissionais_${new Date().toISOString().split('T')[0]}`);
};

export const exportAllData = () => {
  const patients: Patient[] = JSON.parse(localStorage.getItem('patients') || '[]');
  const professionals: Professional[] = JSON.parse(localStorage.getItem('professionals') || '[]');
  
  const exportData = [
    ...patients.map(patient => ({
      'Tipo': 'Paciente',
      'Nome Completo': patient.fullName,
      'CPF': patient.cpf,
      'Telefone': patient.phone1,
      'Data de Cadastro': new Date(patient.id).toLocaleDateString('pt-BR')
    })),
    ...professionals.map(professional => ({
      'Tipo': 'Profissional',
      'Nome Completo': professional.fullName,
      'CPF': professional.cpf,
      'Telefone': professional.phone,
      'Data de Cadastro': new Date(professional.id).toLocaleDateString('pt-BR')
    }))
  ];
  
  exportToCSV(exportData, `backup_completo_${new Date().toISOString().split('T')[0]}`);
};
