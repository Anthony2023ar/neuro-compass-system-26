import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Patient } from '@/types/patient';
import { Professional } from '@/types/professional';
import { useNotification } from '@/hooks/useNotification';

interface DataImportExportProps {
  type: 'patients' | 'professionals';
  data: Patient[] | Professional[];
  onImport?: (data: any[]) => void;
  onExport?: () => void;
}

const DataImportExport: React.FC<DataImportExportProps> = ({
  type,
  data,
  onImport,
  onExport
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);
  const { showSuccess, showError } = useNotification();

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Arquivo deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const importedData = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const item: any = {};
        
        headers.forEach((header, index) => {
          item[header] = values[index] || '';
        });

        // Validação básica
        if (item.fullName && item.cpf) {
          // Adicionar campos obrigatórios se não existirem
          item.id = item.id || crypto.randomUUID();
          item.createdAt = item.createdAt || new Date().toISOString();
          item.updatedAt = new Date().toISOString();
          
          if (type === 'professionals') {
            item.approved = item.approved === 'true' || item.approved === '1';
          }
          
          importedData.push(item);
        }
      }

      if (importedData.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo');
      }

      if (onImport) {
        onImport(importedData);
      }

      setImportResult({
        success: true,
        message: `${importedData.length} registro(s) importado(s) com sucesso`,
        count: importedData.length
      });

      showSuccess(`${importedData.length} registro(s) importado(s) com sucesso!`);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao importar arquivo';
      setImportResult({
        success: false,
        message
      });
      showError(message);
    } finally {
      setIsImporting(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  const handleExportData = () => {
    try {
      if (!data || data.length === 0) {
        showError('Não há dados para exportar');
        return;
      }

      // Preparar dados para CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(item => 
          headers.map(header => 
            typeof (item as any)[header] === 'string' 
              ? `"${(item as any)[header]}"` 
              : (item as any)[header]
          ).join(',')
        )
      ].join('\n');

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${type}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Dados exportados com sucesso!');
      
      if (onExport) {
        onExport();
      }

    } catch (error) {
      showError('Erro ao exportar dados');
    }
  };

  const getExpectedHeaders = () => {
    if (type === 'patients') {
      return 'fullName, cpf, birthDate, motherName, fatherName, phone1, phone2';
    } else {
      return 'fullName, cpf, birthDate, course, phone, password, approved';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          Importar/Exportar Planilhas
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Exportar */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Exportar Dados</h3>
          <p className="text-sm text-gray-600">
            Baixar todos os {type === 'patients' ? 'pacientes' : 'profissionais'} em formato CSV
          </p>
          <Button 
            onClick={handleExportData}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!data || data.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar {data?.length || 0} registro(s)
          </Button>
        </div>

        {/* Importar */}
        <div className="space-y-3 border-t pt-6">
          <h3 className="font-semibold text-gray-800">Importar Dados</h3>
          <p className="text-sm text-gray-600">
            Carregar dados de arquivo CSV. Os dados serão adicionados aos existentes.
          </p>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Formato esperado:</strong><br />
              {getExpectedHeaders()}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="importFile">Selecionar arquivo CSV</Label>
            <Input
              id="importFile"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileImport}
              disabled={isImporting}
            />
          </div>

          {isImporting && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Processando arquivo...
            </div>
          )}

          {importResult && (
            <Alert className={importResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {importResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={importResult.success ? 'text-green-800' : 'text-red-800'}>
                {importResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Instruções */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p><strong>Dicas:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Use vírgula (,) como separador de campos</li>
            <li>A primeira linha deve conter os nomes dos campos</li>
            <li>Campos de texto devem estar entre aspas se contiverem vírgulas</li>
            <li>Para profissionais, o campo 'approved' deve ser 'true' ou 'false'</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImportExport;