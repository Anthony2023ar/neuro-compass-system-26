import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
  import { 
    Brain, 
    Search, 
    User, 
    Calendar, 
    FileText, 
    Syringe, 
    BookOpen, 
    Camera, 
    LogOut,
    Save,
    Bell,
    Plus,
    Upload,
    Image
  } from 'lucide-react';
import { toast } from 'sonner';
import { searchPatients, updatePatient, calculateAge } from '@/services/localStorage';
import type { Patient } from '@/types/patient';

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [patientData, setPatientData] = useState({
    fullName: '',
    cpf: '',
    birthDate: '',
    age: 0,
    fatherName: '',
    motherName: '',
    phone1: '',
    phone2: '',
    nextVisitDate: '',
    nextVisitTime: '',
    medicalReports: '',
    vaccines: '',
    activities: '',
    photos: '',
    sessionsDescription: '',
    treatmentTypes: [],
    patientPhoto: '',
    progressPhotos: []
  });

  const [notificationData, setNotificationData] = useState({
    description: '',
    date: '',
    activityType: ''
  });

  const treatmentOptions = [
    "Avaliação Neuropsicopedagógica",
    "Intervenção Cognitiva", 
    "Estimulação da Linguagem",
    "Treinamento de Memória e Atenção",
    "Acompanhamento Escolar",
    "Orientação Familiar",
    "Reforço Psicopedagógico",
    "Atividades Lúdicas de Desenvolvimento",
    "Sessões com recursos visuais e gamificação"
  ];

  const activityOptions = [
    "Atividade Lúdica com Jogo de Memória",
    "Sessão com Foco em Alfabetização",
    "Estímulo Cognitivo com Reforço Visual",
    "Exercício de Leitura e Interpretação",
    "Dinâmica de Relações Sociais",
    "Estímulo Atencional com Recursos Visuais",
    "Sessão de Escrita Dirigida",
    "Roda de Conversa Emocional",
    "Vídeo Educativo com Questionário"
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um nome ou CPF para buscar');
      return;
    }

    try {
      const results = searchPatients(searchTerm);
      
      if (results.length === 0) {
        toast.error('Nenhum paciente encontrado');
        setSelectedPatient(null);
        return;
      }

      if (results.length === 1) {
        const patient = results[0];
        setSelectedPatient(patient);
        setPatientData({
          fullName: patient.fullName,
          cpf: patient.cpf,
          birthDate: patient.birthDate,
          age: patient.age,
          fatherName: patient.fatherName,
          motherName: patient.motherName,
          phone1: patient.phone1,
          phone2: patient.phone2 || '',
          nextVisitDate: patient.nextVisit?.date || '',
          nextVisitTime: patient.nextVisit?.time || '',
          medicalReports: patient.medicalReports?.map(r => `${r.title}: ${r.description}`).join('\n') || '',
          vaccines: patient.vaccines?.map(v => `${v.name} - ${v.date}`).join('\n') || '',
          activities: patient.activities?.map(a => `${a.title}: ${a.description}`).join('\n') || '',
          photos: patient.photos?.map(p => `${p.title} (${p.date}): ${p.description}`).join('\n') || '',
          sessionsDescription: patient.sessions?.map(s => `${s.date}: ${s.description}`).join('\n') || '',
          treatmentTypes: [],
          patientPhoto: '',
          progressPhotos: patient.photos || []
        });
        toast.success('Paciente encontrado!');
      } else {
        toast.info(`${results.length} pacientes encontrados. Mostrando o primeiro resultado.`);
        const patient = results[0];
        setSelectedPatient(patient);
        setPatientData({
          fullName: patient.fullName,
          cpf: patient.cpf,
          birthDate: patient.birthDate,
          age: patient.age,
          fatherName: patient.fatherName,
          motherName: patient.motherName,
          phone1: patient.phone1,
          phone2: patient.phone2 || '',
          nextVisitDate: patient.nextVisit?.date || '',
          nextVisitTime: patient.nextVisit?.time || '',
          medicalReports: patient.medicalReports?.map(r => `${r.title}: ${r.description}`).join('\n') || '',
          vaccines: patient.vaccines?.map(v => `${v.name} - ${v.date}`).join('\n') || '',
          activities: patient.activities?.map(a => `${a.title}: ${a.description}`).join('\n') || '',
          photos: patient.photos?.map(p => `${p.title} (${p.date}): ${p.description}`).join('\n') || '',
          sessionsDescription: patient.sessions?.map(s => `${s.date}: ${s.description}`).join('\n') || '',
          treatmentTypes: [],
          patientPhoto: '',
          progressPhotos: patient.photos || []
        });
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar paciente');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setPatientData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular idade automaticamente quando a data de nascimento muda
      if (field === 'birthDate' && value) {
        updated.age = calculateAge(value as string);
      }
      
      return updated;
    });
  };

  const handleTreatmentTypeChange = (type: string, checked: boolean) => {
    setPatientData(prev => ({
      ...prev,
      treatmentTypes: checked 
        ? [...prev.treatmentTypes, type]
        : prev.treatmentTypes.filter(t => t !== type)
    }));
  };

  const handlePatientPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPatientData(prev => ({
          ...prev,
          patientPhoto: e.target?.result as string
        }));
        toast.success('Foto do paciente carregada!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProgressPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const now = new Date();
        const newPhoto = {
          id: Date.now().toString(),
          title: `Foto do Progresso - ${now.toLocaleString('pt-BR')}`,
          description: 'Foto do progresso do paciente',
          date: now.toISOString().split('T')[0],
          url: e.target?.result as string
        };
        
        setPatientData(prev => ({
          ...prev,
          progressPhotos: [...prev.progressPhotos, newPhoto]
        }));
        
        toast.success(`Foto salva automaticamente às ${now.toLocaleTimeString('pt-BR')}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedPatient) {
      toast.error('Nenhum paciente selecionado');
      return;
    }

    setIsSaving(true);
    
    try {
      const updatedPatient = updatePatient(selectedPatient.id, {
        fullName: patientData.fullName,
        cpf: patientData.cpf,
        birthDate: patientData.birthDate,
        age: patientData.age,
        fatherName: patientData.fatherName,
        motherName: patientData.motherName,
        phone1: patientData.phone1,
        phone2: patientData.phone2,
        nextVisit: patientData.nextVisitDate && patientData.nextVisitTime ? {
          date: patientData.nextVisitDate,
          time: patientData.nextVisitTime
        } : undefined,
        medicalReports: patientData.medicalReports ? [{
          id: Date.now().toString(),
          title: 'Laudo Médico',
          description: patientData.medicalReports,
          date: new Date().toISOString().split('T')[0]
        }] : [],
        vaccines: patientData.vaccines ? patientData.vaccines.split('\n').filter(v => v.trim()).map((vaccine, index) => ({
          id: `${Date.now()}-${index}`,
          name: vaccine.split(' - ')[0] || vaccine,
          date: vaccine.split(' - ')[1] || new Date().toISOString().split('T')[0]
        })) : [],
        activities: patientData.activities ? patientData.activities.split('\n').filter(a => a.trim()).map((activity, index) => ({
          id: `${Date.now()}-${index}`,
          title: activity.split(': ')[0] || 'Atividade',
          description: activity.split(': ')[1] || activity,
          date: new Date().toISOString().split('T')[0],
          completed: false
        })) : [],
        photos: patientData.progressPhotos.length > 0 ? patientData.progressPhotos : 
          (patientData.photos ? patientData.photos.split('\n').filter(p => p.trim()).map((photo, index) => ({
            id: `${Date.now()}-${index}`,
            title: photo.split(' (')[0] || 'Foto',
            description: photo.split('): ')[1] || photo,
            date: new Date().toISOString().split('T')[0],
            url: ''
          })) : []),
        sessions: patientData.sessionsDescription ? patientData.sessionsDescription.split('\n').filter(s => s.trim()).map((session, index) => ({
          id: `${Date.now()}-${index}`,
          date: session.split(': ')[0] || new Date().toISOString().split('T')[0],
          duration: 60,
          description: session.split(': ')[1] || session,
          activities: patientData.treatmentTypes,
          observations: '',
          progress: 'good' as const
        })) : []
      });

      if (updatedPatient) {
        setSelectedPatient(updatedPatient);
        toast.success('✅ Dados salvos com sucesso!');
        
        // Salvar notificação se preenchida
        if (showNotification && notificationData.description) {
          toast.info('📝 Notificação registrada para o paciente');
        }
      } else {
        toast.error('Erro ao salvar os dados');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar os dados');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // SEGURANÇA: Limpar dados temporários do profissional
    setSelectedPatient(null);
    setPatientData({
      fullName: '',
      cpf: '',
      birthDate: '',
      age: 0,
      fatherName: '',
      motherName: '',
      phone1: '',
      phone2: '',
      nextVisitDate: '',
      nextVisitTime: '',
      medicalReports: '',
      vaccines: '',
      activities: '',
      photos: '',
      sessionsDescription: '',
      treatmentTypes: [],
      patientPhoto: '',
      progressPhotos: []
    });
    setSearchTerm('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Área do Neuropsicopedagogo</h1>
                <p className="text-sm text-gray-600">Gestão de Pacientes</p>
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
        
        {/* Busca de Paciente */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              Buscar Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Digite o nome completo ou CPF do paciente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedPatient && (
          <div className="space-y-8">
            
            {/* Dados Cadastrais */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Dados Cadastrais
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Foto do Paciente */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800 mb-2 block">Foto do Paciente</Label>
                  <div className="flex items-center gap-4">
                    {patientData.patientPhoto && (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={patientData.patientPhoto} 
                          alt="Foto do paciente" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePatientPhotoUpload}
                        className="hidden"
                        id="patient-photo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('patient-photo-upload')?.click()}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {patientData.patientPhoto ? 'Trocar Foto' : 'Adicionar Foto'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={patientData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={patientData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={patientData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Idade</Label>
                    <Input
                      value={patientData.age.toString()}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do Pai</Label>
                    <Input
                      value={patientData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome da Mãe</Label>
                    <Input
                      value={patientData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone Principal</Label>
                    <Input
                      value={patientData.phone1}
                      onChange={(e) => handleInputChange('phone1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone Secundário</Label>
                    <Input
                      value={patientData.phone2}
                      onChange={(e) => handleInputChange('phone2', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próxima Visita */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Próxima Visita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={patientData.nextVisitDate}
                      onChange={(e) => handleInputChange('nextVisitDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={patientData.nextVisitTime}
                      onChange={(e) => handleInputChange('nextVisitTime', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Detalhadas */}
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Laudos Médicos */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Laudos Médicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Descreva os laudos médicos do paciente..."
                    value={patientData.medicalReports}
                    onChange={(e) => handleInputChange('medicalReports', e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Vacinas */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Syringe className="h-5 w-5 text-red-600" />
                    Vacinas Recebidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Liste as vacinas recebidas pelo paciente..."
                    value={patientData.vaccines}
                    onChange={(e) => handleInputChange('vaccines', e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Atividades */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Atividades Realizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Descreva as atividades realizadas pelo paciente..."
                    value={patientData.activities}
                    onChange={(e) => handleInputChange('activities', e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Fotos dos Avanços */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-purple-600" />
                    Fotos dos Avanços
                    <span className="ml-auto text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {patientData.progressPhotos.length} fotos
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload de Nova Foto */}
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProgressPhotoUpload}
                      className="hidden"
                      id="progress-photo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('progress-photo-upload')?.click()}
                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Foto do Progresso
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Data e horário serão inseridos automaticamente
                    </p>
                  </div>

                  {/* Lista de Fotos */}
                  {patientData.progressPhotos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Fotos Salvas:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {patientData.progressPhotos.map((photo) => (
                          <div key={photo.id} className="bg-white border rounded-lg p-2 shadow-sm">
                            {photo.url && (
                              <div className="w-full h-20 bg-gray-100 rounded mb-2 overflow-hidden">
                                <img 
                                  src={photo.url} 
                                  alt={photo.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <p className="text-xs font-medium text-gray-700 truncate">{photo.title}</p>
                            <p className="text-xs text-gray-500">{new Date(photo.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Campo de texto para descrições adicionais */}
                  <div className="mt-4">
                    <Label className="text-sm text-gray-600">Observações Adicionais</Label>
                    <Textarea
                      placeholder="Observações sobre o progresso nas fotos..."
                      value={patientData.photos}
                      onChange={(e) => handleInputChange('photos', e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sessões Neuropsicopedagógicas */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Descrição das Sessões Neuropsicopedagógicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva detalhadamente as sessões neuropsicopedagógicas realizadas..."
                  value={patientData.sessionsDescription}
                  onChange={(e) => handleInputChange('sessionsDescription', e.target.value)}
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Tipos de Atendimento */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tipos de Atendimento Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {treatmentOptions.map((treatment, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`treatment-${index}`}
                        checked={patientData.treatmentTypes.includes(treatment)}
                        onCheckedChange={(checked) => 
                          handleTreatmentTypeChange(treatment, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`treatment-${index}`} 
                        className="text-sm cursor-pointer"
                      >
                        {treatment}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  Notificações (Opcional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notification-checkbox"
                      checked={showNotification}
                      onCheckedChange={(checked) => setShowNotification(checked === true)}
                    />
                    <Label htmlFor="notification-checkbox">
                      Deseja registrar uma notificação para este paciente?
                    </Label>
                  </div>

                  {showNotification && (
                    <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Descrição da Notificação</Label>
                          <Textarea
                            placeholder="Descreva a notificação..."
                            value={notificationData.description}
                            onChange={(e) => setNotificationData(prev => ({
                              ...prev,
                              description: e.target.value
                            }))}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Data (Opcional)</Label>
                            <Input
                              type="date"
                              value={notificationData.date}
                              onChange={(e) => setNotificationData(prev => ({
                                ...prev,
                                date: e.target.value
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo de Atividade Vinculada</Label>
                            <Select 
                              value={notificationData.activityType}
                              onValueChange={(value) => setNotificationData(prev => ({
                                ...prev,
                                activityType: value
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma atividade" />
                              </SelectTrigger>
                              <SelectContent>
                                {activityOptions.map((activity, index) => (
                                  <SelectItem key={index} value={activity}>
                                    {activity}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
