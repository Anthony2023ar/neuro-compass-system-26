export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          patient_id: string
          professional_id: string
          session_date: string | null
          title: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          patient_id: string
          professional_id: string
          session_date?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          patient_id?: string
          professional_id?: string
          session_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string
          professional_id: string
          status: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          professional_id: string
          status?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          professional_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          description: string | null
          id: string
          meeting_date: string
          meeting_link: string | null
          professional_id: string
          title: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          meeting_date: string
          meeting_link?: string | null
          professional_id: string
          title: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          meeting_date?: string
          meeting_link?: string | null
          professional_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          image_url: string | null
          message: string
          patient_id: string
          sender_id: string
          sent_at: string | null
        }
        Insert: {
          id?: string
          image_url?: string | null
          message: string
          patient_id: string
          sender_id: string
          sent_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string | null
          message?: string
          patient_id?: string
          sender_id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_type: string | null
          read: boolean | null
          recipient_id: string | null
          sender_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_type?: string | null
          read?: boolean | null
          recipient_id?: string | null
          sender_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string | null
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_requests: {
        Row: {
          cpf: string
          created_at: string | null
          full_name: string
          id: string
          phone: string
          processed_at: string | null
          professional_id: string
          status: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          full_name: string
          id?: string
          phone: string
          processed_at?: string | null
          professional_id: string
          status?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string
          processed_at?: string | null
          professional_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_requests_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string | null
          documents: Json | null
          father_name: string | null
          id: string
          mother_name: string | null
          photo_url: string | null
          professional_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          documents?: Json | null
          father_name?: string | null
          id: string
          mother_name?: string | null
          photo_url?: string | null
          professional_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          documents?: Json | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          photo_url?: string | null
          professional_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          approved: boolean | null
          course: string | null
          created_at: string | null
          documents: Json | null
          id: string
          last_payment_date: string | null
          password: string
          payment_required: boolean | null
          payment_status: string | null
          specialties: string[] | null
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          course?: string | null
          created_at?: string | null
          documents?: Json | null
          id: string
          last_payment_date?: string | null
          password: string
          payment_required?: boolean | null
          payment_status?: string | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          course?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          last_payment_date?: string | null
          password?: string
          payment_required?: boolean | null
          payment_status?: string | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          cpf: string
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          birth_date?: string | null
          cpf: string
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          patient_id: string
          photo_url: string
          professional_id: string
          taken_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          patient_id: string
          photo_url: string
          professional_id: string
          taken_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          patient_id?: string
          photo_url?: string
          professional_id?: string
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_photos_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: string
          created_at: string | null
          id: string
          patient_id: string
          professional_id: string
          report_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          patient_id: string
          professional_id: string
          report_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          patient_id?: string
          professional_id?: string
          report_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
