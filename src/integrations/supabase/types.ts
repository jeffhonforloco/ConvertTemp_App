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
      ad_networks: {
        Row: {
          api_key: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          network_type: Database["public"]["Enums"]["ad_network_type"]
          publisher_id: string | null
          revenue_share: number | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          network_type: Database["public"]["Enums"]["ad_network_type"]
          publisher_id?: string | null
          revenue_share?: number | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          network_type?: Database["public"]["Enums"]["ad_network_type"]
          publisher_id?: string | null
          revenue_share?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ad_revenue: {
        Row: {
          clicks: number | null
          cpc: number | null
          cpm: number | null
          created_at: string
          date: string
          id: string
          impressions: number | null
          network_id: string | null
          revenue: number | null
        }
        Insert: {
          clicks?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          date: string
          id?: string
          impressions?: number | null
          network_id?: string | null
          revenue?: number | null
        }
        Update: {
          clicks?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          date?: string
          id?: string
          impressions?: number | null
          network_id?: string | null
          revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_revenue_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "ad_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_slots: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          network_id: string | null
          size: string | null
          slot_id: string
          slot_type: Database["public"]["Enums"]["ad_slot_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          network_id?: string | null
          size?: string | null
          slot_id: string
          slot_type: Database["public"]["Enums"]["ad_slot_type"]
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          network_id?: string | null
          size?: string | null
          slot_id?: string
          slot_type?: Database["public"]["Enums"]["ad_slot_type"]
        }
        Relationships: [
          {
            foreignKeyName: "ad_slots_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "ad_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_events: {
        Row: {
          auth_user_id: string | null
          created_at: string
          from_unit: string
          from_value: number
          id: string
          locale: string | null
          method: string
          session_id: string
          to_unit: string
          to_value: number
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          from_unit: string
          from_value: number
          id?: string
          locale?: string | null
          method: string
          session_id: string
          to_unit: string
          to_value: number
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          from_unit?: string
          from_value?: number
          id?: string
          locale?: string | null
          method?: string
          session_id?: string
          to_unit?: string
          to_value?: number
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interaction_events: {
        Row: {
          action: string
          auth_user_id: string | null
          created_at: string
          id: string
          properties: Json | null
          session_id: string
          user_id: string
        }
        Insert: {
          action: string
          auth_user_id?: string | null
          created_at?: string
          id?: string
          properties?: Json | null
          session_id: string
          user_id: string
        }
        Update: {
          action?: string
          auth_user_id?: string | null
          created_at?: string
          id?: string
          properties?: Json | null
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      page_view_events: {
        Row: {
          auth_user_id: string | null
          created_at: string
          id: string
          locale: string | null
          page: string
          referrer: string | null
          session_id: string
          url: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          id?: string
          locale?: string | null
          page: string
          referrer?: string | null
          session_id: string
          url?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          id?: string
          locale?: string | null
          page?: string
          referrer?: string | null
          session_id?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown
          requests_count: number | null
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address: unknown
          requests_count?: number | null
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown
          requests_count?: number | null
          window_start?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          keywords: string[] | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          path: string
          schema_markup: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path: string
          schema_markup?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path?: string
          schema_markup?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      ad_network_type:
        | "google_adsense"
        | "media_net"
        | "propeller_ads"
        | "ezoic"
      ad_slot_type: "banner_top" | "banner_bottom" | "sidebar" | "in_content"
      user_role: "admin" | "user"
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
    Enums: {
      ad_network_type: [
        "google_adsense",
        "media_net",
        "propeller_ads",
        "ezoic",
      ],
      ad_slot_type: ["banner_top", "banner_bottom", "sidebar", "in_content"],
      user_role: ["admin", "user"],
    },
  },
} as const
