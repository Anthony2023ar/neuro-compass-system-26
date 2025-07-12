import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { Patient } from '@/types/patient';
import { Professional } from '@/types/professional';

interface DataTableProps {
  type: 'patients' | 'professionals';
  data: Patient[] | Professional[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onExport?: () => void;
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ 
  type, 
  data, 
  onEdit, 
  onDelete, 
  onAdd, 
  onExport,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.cpf.includes(searchTerm);
    
    if (type === 'professionals') {
      const professional = item as Professional;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'approved' && professional.approved) ||
                           (filterStatus === 'pending' && !professional.approved);
      return matchesSearch && matchesStatus;
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando dados...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {type === 'patients' ? 'Base de Dados - Pacientes' : 'Base de Dados - Profissionais'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onAdd && (
              <Button onClick={onAdd} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            )}
            {onExport && (
              <Button onClick={onExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {type === 'professionals' && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="approved">Aprovados</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Completo</TableHead>
                <TableHead>CPF</TableHead>
                {type === 'patients' ? (
                  <>
                    <TableHead>Idade</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data Nascimento</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Curso</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                  </>
                )}
                <TableHead>Data Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={type === 'patients' ? 7 : 7} className="text-center py-8 text-gray-500">
                    Nenhum {type === 'patients' ? 'paciente' : 'profissional'} encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.fullName}</TableCell>
                    <TableCell>{item.cpf}</TableCell>
                     {type === 'patients' ? (
                      <>
                        <TableCell>{(item as Patient).age || calculateAge(item.birthDate)} anos</TableCell>
                        <TableCell>{(item as Patient).phone1}</TableCell>
                        <TableCell>{formatDate(item.birthDate)}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{(item as Professional).course}</TableCell>
                        <TableCell>{(item as Professional).phone}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={(item as Professional).approved ? "default" : "secondary"}
                            className={
                              (item as Professional).approved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {(item as Professional).approved ? 'Aprovado' : 'Pendente'}
                          </Badge>
                        </TableCell>
                      </>
                    )}
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <Button 
                            onClick={() => onEdit(item)} 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            onClick={() => onDelete(item.id)} 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Total de registros: {filteredData.length}
          {searchTerm && ` (filtrados de ${data.length})`}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
