
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Check, 
  X, 
  Clock, 
  User,
  Phone,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Professional } from '@/types/professional';
import { toast } from 'sonner';

interface ProfessionalApprovalProps {
  professionals: Professional[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRefresh: () => void;
}

const ProfessionalApproval: React.FC<ProfessionalApprovalProps> = ({ 
  professionals, 
  onApprove, 
  onReject, 
  onRefresh 
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingProfessionals = professionals.filter(p => !p.approved);
  const approvedProfessionals = professionals.filter(p => p.approved);

  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      onApprove(id);
      toast.success(`Profissional ${name} aprovado com sucesso!`);
    } catch (error) {
      toast.error('Erro ao aprovar profissional');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja negar o cadastro de ${name}?`)) {
      setProcessingId(id);
      try {
        onReject(id);
        toast.success(`Cadastro de ${name} negado`);
      } catch (error) {
        toast.error('Erro ao negar cadastro');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendentes de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingProfessionals.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              Aprovados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedProfessionals.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-blue-600" />
              Total de Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{professionals.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Profissionais Pendentes */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Profissionais Pendentes de Aprovação ({pendingProfessionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Curso/Formação</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProfessionals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum profissional pendente de aprovação
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingProfessionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {professional.fullName}
                        </div>
                      </TableCell>
                      <TableCell>{professional.cpf}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          {professional.course}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {professional.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(professional.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            onClick={() => handleApprove(professional.id, professional.fullName)} 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 h-8"
                            disabled={processingId === professional.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button 
                            onClick={() => handleReject(professional.id, professional.fullName)} 
                            size="sm" 
                            variant="outline"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={processingId === professional.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Negar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Profissionais Aprovados (resumo) */}
      {approvedProfessionals.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Profissionais Aprovados ({approvedProfessionals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedProfessionals.slice(0, 6).map((professional) => (
                <div key={professional.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">{professional.fullName}</p>
                      <p className="text-sm text-green-600">{professional.course}</p>
                      <p className="text-xs text-green-500">
                        Aprovado em {formatDate(professional.updatedAt)}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Aprovado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {approvedProfessionals.length > 6 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                E mais {approvedProfessionals.length - 6} profissionais aprovados...
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessionalApproval;
