
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Calendar, Eye, Edit } from 'lucide-react';
import { Patient } from '@/types/patient';
import { usePatients } from '@/hooks/usePatients';

interface PatientSearchProps {
  onSelectPatient?: (patient: Patient) => void;
  onEditPatient?: (patient: Patient) => void;
  showActions?: boolean;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ 
  onSelectPatient, 
  onEditPatient, 
  showActions = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { searchPatientsByQuery, patients } = usePatients();

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      const results = searchPatientsByQuery(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    } else if (searchQuery.length === 0) {
      setSearchResults(patients.slice(0, 10)); // Mostrar os primeiros 10 quando não há busca
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchPatientsByQuery, patients]);

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar por nome, CPF, nome do pai ou da mãe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {isSearching && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Buscando...</p>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {searchResults.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{patient.fullName}</h3>
                    <Badge variant="outline">
                      {calculateAge(patient.birthDate)} anos
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>CPF:</strong> {patient.cpf}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {patient.phone1}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(patient.birthDate)}
                    </div>
                    <div>
                      <strong>Mãe:</strong> {patient.motherName}
                    </div>
                  </div>
                </div>

                {showActions && (
                  <div className="flex gap-2 ml-4">
                    {onSelectPatient && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectPatient(patient)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    )}
                    {onEditPatient && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditPatient(patient)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum paciente encontrado</p>
          <p className="text-sm text-gray-400">Tente uma busca diferente</p>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
