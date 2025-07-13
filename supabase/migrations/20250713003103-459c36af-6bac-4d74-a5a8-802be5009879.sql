
-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('patient', 'professional', 'admin')) NOT NULL,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de profissionais
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  course TEXT,
  specialties TEXT[],
  password TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  payment_required BOOLEAN DEFAULT true,
  payment_status TEXT DEFAULT 'pending',
  last_payment_date DATE,
  documents JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de pacientes
CREATE TABLE public.patients (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  father_name TEXT,
  mother_name TEXT,
  photo_url TEXT,
  documents JSONB DEFAULT '{}',
  professional_id UUID REFERENCES public.professionals(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de atividades
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL,
  image_url TEXT,
  session_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de laudos
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  report_type TEXT DEFAULT 'medical',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fotos de progresso
CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  photo_url TEXT NOT NULL,
  description TEXT,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de agenda
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de mensagens do chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de notificações internas
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.professionals(id),
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'general',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de reuniões
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT,
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de solicitações de troca de senha
CREATE TABLE public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  full_name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies para professionals
CREATE POLICY "Professionals can view their own data" ON public.professionals
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Professionals can update their own data" ON public.professionals
  FOR UPDATE USING (auth.uid() = id);

-- Policies para patients
CREATE POLICY "Patients can view their own data" ON public.patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Professionals can view their patients" ON public.patients
  FOR SELECT USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para activities
CREATE POLICY "Patients can view their activities" ON public.activities
  FOR SELECT USING (patient_id IN (SELECT id FROM public.patients WHERE auth.uid() = id));

CREATE POLICY "Professionals can view and manage activities for their patients" ON public.activities
  FOR ALL USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para reports
CREATE POLICY "Patients can view their reports" ON public.reports
  FOR SELECT USING (patient_id IN (SELECT id FROM public.patients WHERE auth.uid() = id));

CREATE POLICY "Professionals can manage reports for their patients" ON public.reports
  FOR ALL USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para progress_photos
CREATE POLICY "Patients can view their progress photos" ON public.progress_photos
  FOR SELECT USING (patient_id IN (SELECT id FROM public.patients WHERE auth.uid() = id));

CREATE POLICY "Professionals can manage progress photos for their patients" ON public.progress_photos
  FOR ALL USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para appointments
CREATE POLICY "Patients can view their appointments" ON public.appointments
  FOR SELECT USING (patient_id IN (SELECT id FROM public.patients WHERE auth.uid() = id));

CREATE POLICY "Professionals can manage appointments for their patients" ON public.appointments
  FOR ALL USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para messages
CREATE POLICY "Users can view messages for their patients" ON public.messages
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE auth.uid() = id) OR
    patient_id IN (SELECT id FROM public.patients WHERE professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id))
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policies para notifications
CREATE POLICY "Professionals can view their notifications" ON public.notifications
  FOR SELECT USING (recipient_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para meetings
CREATE POLICY "Professionals can view their meetings" ON public.meetings
  FOR SELECT USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

CREATE POLICY "Professionals can update their meeting confirmations" ON public.meetings
  FOR UPDATE USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

-- Policies para password_reset_requests
CREATE POLICY "Users can view their own password reset requests" ON public.password_reset_requests
  FOR SELECT USING (professional_id IN (SELECT id FROM public.professionals WHERE auth.uid() = id));

CREATE POLICY "Users can create password reset requests" ON public.password_reset_requests
  FOR INSERT WITH CHECK (true);

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, cpf, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'cpf', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'patient')
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
