import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Message {
  id: string;
  message: string;
  sender_id: string;
  sent_at: string;
  image_url?: string;
  sender_name?: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buscar paciente associado (se for profissional) ou usar próprio ID (se for paciente)
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (profile && isOpen) {
      loadPatientAndMessages();
    }
  }, [profile, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadPatientAndMessages = async () => {
    if (!profile) return;

    try {
      let patientId = null;

      if (profile.user_type === 'patient') {
        patientId = profile.id;
      } else if (profile.user_type === 'professional') {
        // Por simplicidade, vou pegar o primeiro paciente do profissional
        // Em um sistema real, você teria uma interface para selecionar o paciente
        const { data: patients } = await supabase
          .from('patients')
          .select('id')
          .eq('professional_id', profile.id)
          .limit(1);

        if (patients && patients.length > 0) {
          patientId = patients[0].id;
        }
      }

      if (patientId) {
        setCurrentPatientId(patientId);
        await loadMessages(patientId);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const loadMessages = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .eq('patient_id', patientId)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      const messagesWithNames = data.map(msg => ({
        ...msg,
        sender_name: msg.profiles?.full_name || 'Usuário'
      }));

      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentPatientId || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          patient_id: currentPatientId,
          sender_id: profile.id,
          message: newMessage.trim(),
        });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao enviar mensagem",
          variant: "destructive",
        });
        return;
      }

      setNewMessage('');
      await loadMessages(currentPatientId);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!profile) return null;

  return (
    <>
      {/* Botão Flutuante */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg ${
          isOpen ? 'hidden' : 'flex'
        } bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Expandido */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Chat</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mensagens */}
          <ScrollArea className="flex-1 p-4 h-[360px]">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === profile.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender_id === profile.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.sender_id !== profile.id && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {msg.sender_name}
                      </p>
                    )}
                    {msg.image_url && (
                      <img
                        src={msg.image_url}
                        alt="Imagem enviada"
                        className="max-w-full rounded mb-2"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(msg.sent_at), 'HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !newMessage.trim()}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}