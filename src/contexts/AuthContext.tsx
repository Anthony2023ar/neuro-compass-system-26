import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  cpf: string;
  user_type: 'patient' | 'professional' | 'admin';
  phone?: string;
  birth_date?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (cpf: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do perfil",
          variant: "destructive",
        });
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (cpf: string, password?: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Para pacientes, apenas CPF
      if (!password) {
        // Buscar usuário por CPF
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('cpf', cpf)
          .eq('user_type', 'patient')
          .single();

        if (profileError || !profileData) {
          toast({
            title: "Erro",
            description: "Paciente não encontrado. Verifique o CPF.",
            variant: "destructive",
          });
          return false;
        }

        // Simular login sem senha para paciente
        setProfile(profileData as Profile);
        setUser({ id: profileData.id } as User);
        
        toast({
          title: "Sucesso!",
          description: `Bem-vindo, ${profileData.full_name}!`,
        });
        return true;
      }

      // Para profissionais e admins, verificar senha
      const { data: professionalData, error: professionalError } = await supabase
        .from('professionals')
        .select('*, profiles(*)')
        .eq('profiles.cpf', cpf)
        .eq('password', password)
        .single();

      if (professionalError || !professionalData) {
        toast({
          title: "Erro",
          description: "CPF ou senha incorretos.",
          variant: "destructive",
        });
        return false;
      }

      if (!professionalData.approved && professionalData.profiles.user_type === 'professional') {
        toast({
          title: "Acesso Negado",
          description: "Sua conta ainda não foi aprovada pelo administrador.",
          variant: "destructive",
        });
        return false;
      }

      setProfile(professionalData.profiles as Profile);
      setUser({ id: professionalData.profiles.id } as User);
      
      toast({
        title: "Sucesso!",
        description: `Bem-vindo, ${professionalData.profiles.full_name}!`,
      });
      return true;

    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);

      // Verificar se CPF já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('cpf')
        .eq('cpf', userData.cpf)
        .single();

      if (existingProfile) {
        toast({
          title: "Erro",
          description: "CPF já cadastrado no sistema.",
          variant: "destructive",
        });
        return false;
      }

      // Criar UUID único para o usuário
      const userId = crypto.randomUUID();

      // Inserir na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData.full_name,
          cpf: userData.cpf,
          phone: userData.phone,
          user_type: userData.user_type,
          birth_date: userData.birth_date,
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        toast({
          title: "Erro",
          description: "Erro ao criar perfil.",
          variant: "destructive",
        });
        return false;
      }

      // Se for profissional, inserir na tabela professionals
      if (userData.user_type === 'professional') {
        const { error: professionalError } = await supabase
          .from('professionals')
          .insert({
            id: userId,
            course: userData.course,
            specialties: userData.specialties,
            password: userData.password,
            approved: false,
          });

        if (professionalError) {
          console.error('Erro ao criar profissional:', professionalError);
          toast({
            title: "Erro",
            description: "Erro ao criar dados profissionais.",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Cadastro realizado!",
          description: "Aguarde a aprovação do administrador para fazer login.",
        });
      } else if (userData.user_type === 'patient') {
        // Se for paciente, inserir na tabela patients
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            id: userId,
            father_name: userData.father_name,
            mother_name: userData.mother_name,
          });

        if (patientError) {
          console.error('Erro ao criar paciente:', patientError);
          toast({
            title: "Erro",
            description: "Erro ao criar dados do paciente.",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Cadastro realizado!",
          description: "Agora você pode fazer login com seu CPF.",
        });
      }

      return true;

    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}