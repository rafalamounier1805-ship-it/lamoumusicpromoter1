export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      billing_charges: {
        Row: {
          amount_cents: number;
          client_name: string;
          created_at: string;
          currency: string;
          due_date: string | null;
          gateway: string | null;
          gateway_reference: string | null;
          id: string;
          owner_id: string;
          paid_at: string | null;
          plan_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount_cents?: number;
          client_name: string;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          gateway?: string | null;
          gateway_reference?: string | null;
          id?: string;
          owner_id?: string;
          paid_at?: string | null;
          plan_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          client_name?: string;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          gateway?: string | null;
          gateway_reference?: string | null;
          id?: string;
          owner_id?: string;
          paid_at?: string | null;
          plan_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "billing_charges_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "billing_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      billing_plans: {
        Row: {
          active: boolean;
          code: string;
          created_at: string;
          currency: string;
          cycle: string;
          entitlements: string | null;
          id: string;
          name: string;
          owner_id: string;
          price_cents: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          code: string;
          created_at?: string;
          currency?: string;
          cycle?: string;
          entitlements?: string | null;
          id?: string;
          name: string;
          owner_id?: string;
          price_cents?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          code?: string;
          created_at?: string;
          currency?: string;
          cycle?: string;
          entitlements?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
          price_cents?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      core_provider_checks: {
        Row: {
          created_at: string;
          error: string | null;
          id: string;
          latency_ms: number | null;
          model: string;
          ok: boolean;
          output_chars: number | null;
          owner_id: string;
          provider: string;
          slot: string;
        };
        Insert: {
          created_at?: string;
          error?: string | null;
          id?: string;
          latency_ms?: number | null;
          model: string;
          ok?: boolean;
          output_chars?: number | null;
          owner_id?: string;
          provider: string;
          slot?: string;
        };
        Update: {
          created_at?: string;
          error?: string | null;
          id?: string;
          latency_ms?: number | null;
          model?: string;
          ok?: boolean;
          output_chars?: number | null;
          owner_id?: string;
          provider?: string;
          slot?: string;
        };
        Relationships: [];
      };
      core_provider_slots: {
        Row: {
          created_at: string;
          id: string;
          model: string;
          owner_id: string;
          provider: string;
          role: string;
          slot: string;
          state: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          model: string;
          owner_id?: string;
          provider: string;
          role?: string;
          slot: string;
          state?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          model?: string;
          owner_id?: string;
          provider?: string;
          role?: string;
          slot?: string;
          state?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          company: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_self_responsible: boolean;
          phone: string | null;
          responsible_email: string | null;
          responsible_name: string | null;
          role_title: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_self_responsible?: boolean;
          phone?: string | null;
          responsible_email?: string | null;
          responsible_name?: string | null;
          role_title?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_self_responsible?: boolean;
          phone?: string | null;
          responsible_email?: string | null;
          responsible_name?: string | null;
          role_title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
