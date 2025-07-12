
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  fullName: string;
  cpf: string;
  type: 'patient' | 'professional' | 'admin';
  birthDate?: string;
  age?: number;
  phone1?: string;
  phone2?: string;
  fatherName?: string;
  motherName?: string;
  course?: string;
  password?: string;
  approved?: boolean;
  sessionId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, type: 'patient' | 'professional' | 'admin', password?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  userType: 'patient' | 'professional' | 'admin' | null;
  hasValidSession: () => boolean;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verifica se há uma sessão válida ao inicializar
    refreshSession();
  }, []);

  const generateSessionId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const refreshSession = () => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const sessionTimestamp = localStorage.getItem('sessionTimestamp');
      
      if (savedUser && sessionTimestamp) {
        const currentTime = Date.now();
        const sessionTime = parseInt(sessionTimestamp);
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
        
        if (currentTime - sessionTime < sessionDuration) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } else {
          // Sessão expirada
          localStorage.removeItem('currentUser');
          localStorage.removeItem('sessionTimestamp');
          localStorage.removeItem('adminSession');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      logout();
    }
  };

  const hasValidSession = (): boolean => {
    const savedUser = localStorage.getItem('currentUser');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const adminSession = localStorage.getItem('adminSession');
    
    if (adminSession === 'true') return true;
    
    if (savedUser && sessionTimestamp) {
      const currentTime = Date.now();
      const sessionTime = parseInt(sessionTimestamp);
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
      
      return currentTime - sessionTime < sessionDuration;
    }
    
    return false;
  };

  const login = async (identifier: string, type: 'patient' | 'professional' | 'admin', password?: string): Promise<boolean> => {
    try {
      // Login administrativo
      if (type === 'admin') {
        if (identifier === 'irisaves' && password === 'iris123Aa') {
          const adminUser: User = {
            id: 'admin-001',
            fullName: 'Administrador',
            cpf: '000.000.000-00',
            type: 'admin',
            sessionId: generateSessionId()
          };
          
          setUser(adminUser);
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          localStorage.setItem('adminSession', 'true');
          return true;
        }
        return false;
      }

      if (type === 'patient') {
        // Para pacientes, busca por CPF ou nome
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find((p: any) => 
          p.cpf === identifier || p.fullName.toLowerCase().includes(identifier.toLowerCase())
        );
        
        if (patient) {
          const userData: User = {
            id: patient.id,
            fullName: patient.fullName,
            cpf: patient.cpf,
            type: 'patient',
            birthDate: patient.birthDate,
            age: patient.age,
            phone1: patient.phone1,
            phone2: patient.phone2,
            fatherName: patient.fatherName,
            motherName: patient.motherName,
            sessionId: generateSessionId()
          };
          
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          return true;
        }
      } else {
        // Para profissionais, verifica CPF, senha e aprovação
        if (!password) return false;
        
        const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
        const professional = professionals.find((p: any) => 
          p.cpf === identifier && p.password === password && p.approved === true
        );
        
        if (professional) {
          const userData: User = {
            id: professional.id,
            fullName: professional.fullName,
            cpf: professional.cpf,
            type: 'professional',
            course: professional.course,
            phone1: professional.phone,
            approved: professional.approved,
            sessionId: generateSessionId()
          };
          
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('adminSession');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    userType: user?.type || null,
    hasValidSession,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
