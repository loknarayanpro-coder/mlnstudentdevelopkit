export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      application_events: {
        Row: {
          application_id: string
          created_at: string
          event_at: string
          id: string
          kind: string
          notes: string | null
          result: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          event_at: string
          id?: string
          kind: string
          notes?: string | null
          result?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          event_at?: string
          id?: string
          kind?: string
          notes?: string | null
          result?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "placement_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_attempts: {
        Row: {
          attempted_on: string
          correct: number
          created_at: string
          id: string
          minutes: number
          topic: string
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempted_on?: string
          correct: number
          created_at?: string
          id?: string
          minutes?: number
          topic: string
          total_questions: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          attempted_on?: string
          correct?: number
          created_at?: string
          id?: string
          minutes?: number
          topic?: string
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coding_attempts: {
        Row: {
          attempted_at: string
          created_at: string
          id: string
          minutes: number
          problem_id: string
          success: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          attempted_at?: string
          created_at?: string
          id?: string
          minutes?: number
          problem_id: string
          success: boolean
          updated_at?: string
          user_id?: string
        }
        Update: {
          attempted_at?: string
          created_at?: string
          id?: string
          minutes?: number
          problem_id?: string
          success?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coding_attempts_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_problems: {
        Row: {
          approach: string | null
          created_at: string
          difficulty: string
          id: string
          next_revision: string | null
          notes: string | null
          platform: string | null
          revision_count: number
          solved_at: string | null
          status: string
          title: string
          topic: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          approach?: string | null
          created_at?: string
          difficulty?: string
          id?: string
          next_revision?: string | null
          notes?: string | null
          platform?: string | null
          revision_count?: number
          solved_at?: string | null
          status?: string
          title: string
          topic?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Update: {
          approach?: string | null
          created_at?: string
          difficulty?: string
          id?: string
          next_revision?: string | null
          notes?: string | null
          platform?: string | null
          revision_count?: number
          solved_at?: string | null
          status?: string
          title?: string
          topic?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          notes: string | null
          planned_minutes: number
          position: number
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          planned_minutes?: number
          position?: number
          priority?: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          planned_minutes?: number
          position?: number
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_notes: {
        Row: {
          body: string | null
          created_at: string
          held_on: string | null
          id: string
          kind: string
          score: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          held_on?: string | null
          id?: string
          kind?: string
          score?: number | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          held_on?: string | null
          id?: string
          kind?: string
          score?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_questions: {
        Row: {
          answer: string | null
          confident: boolean
          created_at: string
          id: string
          question: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          confident?: boolean
          created_at?: string
          id?: string
          question: string
          subject: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          answer?: string | null
          confident?: boolean
          created_at?: string
          id?: string
          question?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_topics: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          subject: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          subject: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          subject?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      placement_applications: {
        Row: {
          company: string
          company_type: string
          created_at: string
          deadline: string | null
          eligibility: string | null
          id: string
          notes: string | null
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          company_type?: string
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          id?: string
          notes?: string | null
          role: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          company?: string
          company_type?: string
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          id?: string
          notes?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          backlogs: number
          branch: string
          career_goal: string | null
          created_at: string
          daily_hours: number
          full_name: string | null
          id: string
          onboarded: boolean
          placement_target: string
          primary_language: string
          proficiency: string
          semester: number
          timezone: string
          updated_at: string
        }
        Insert: {
          backlogs?: number
          branch?: string
          career_goal?: string | null
          created_at?: string
          daily_hours?: number
          full_name?: string | null
          id: string
          onboarded?: boolean
          placement_target?: string
          primary_language?: string
          proficiency?: string
          semester?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          backlogs?: number
          branch?: string
          career_goal?: string | null
          created_at?: string
          daily_hours?: number
          full_name?: string | null
          id?: string
          onboarded?: boolean
          placement_target?: string
          primary_language?: string
          proficiency?: string
          semester?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          completed: boolean
          created_at: string
          due_date: string | null
          id: string
          is_milestone: boolean
          project_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          is_milestone?: boolean
          project_id: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          is_milestone?: boolean
          project_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          demo_url: string | null
          description: string | null
          github_url: string | null
          id: string
          name: string
          status: string
          tech_stack: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          name: string
          status?: string
          tech_stack?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          name?: string
          status?: string
          tech_stack?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_versions: {
        Row: {
          checklist: Json
          created_at: string
          id: string
          label: string
          link: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist?: Json
          created_at?: string
          id?: string
          label: string
          link?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          checklist?: Json
          created_at?: string
          id?: string
          label?: string
          link?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          position: number
          title: string
          updated_at: string
          user_id: string
          week_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          position?: number
          title: string
          updated_at?: string
          user_id?: string
          week_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          position?: number
          title?: string
          updated_at?: string
          user_id?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "roadmap_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_weeks: {
        Row: {
          completed: boolean
          created_at: string
          focus: string | null
          id: string
          milestone: string | null
          roadmap_id: string
          title: string
          updated_at: string
          user_id: string
          week_number: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          focus?: string | null
          id?: string
          milestone?: string | null
          roadmap_id: string
          title: string
          updated_at?: string
          user_id?: string
          week_number: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          focus?: string | null
          id?: string
          milestone?: string | null
          roadmap_id?: string
          title?: string
          updated_at?: string
          user_id?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_weeks_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          start_date: string
          title: string
          total_weeks: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          start_date?: string
          title: string
          total_weeks?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          start_date?: string
          title?: string
          total_weeks?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          category: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          notes: string | null
          paused_at: string | null
          paused_seconds: number
          started_at: string
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          paused_at?: string | null
          paused_seconds?: number
          started_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          paused_at?: string | null
          paused_seconds?: number
          started_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "daily_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_progress: {
        Row: {
          confidence: number
          created_at: string
          id: string
          status: string
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          id?: string
          status?: string
          topic_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          confidence?: number
          created_at?: string
          id?: string
          status?: string
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_events: {
        Row: {
          created_at: string
          event: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_reminders: boolean
          revision_intervals: number[]
          updated_at: string
          user_id: string
          week_start: number
        }
        Insert: {
          created_at?: string
          email_reminders?: boolean
          revision_intervals?: number[]
          updated_at?: string
          user_id?: string
          week_start?: number
        }
        Update: {
          created_at?: string
          email_reminders?: boolean
          revision_intervals?: number[]
          updated_at?: string
          user_id?: string
          week_start?: number
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          created_at: string
          id: string
          improve: string | null
          rating: number | null
          updated_at: string
          user_id: string
          week_start: string
          went_well: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          improve?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
          week_start: string
          went_well?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          improve?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
          week_start?: string
          went_well?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      dashboard_stats: { Args: { _today: string }; Returns: Json }
      delete_my_account: { Args: never; Returns: undefined }
      stop_study_session: {
        Args: { _id: string }
        Returns: {
          category: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          notes: string | null
          paused_at: string | null
          paused_seconds: number
          started_at: string
          task_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "study_sessions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
