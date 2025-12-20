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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_navigation: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          route: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon: string
          id?: string
          route: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          route?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      license_activations: {
        Row: {
          activated_at: string
          host_identifier: string
          host_ip: string | null
          host_name: string | null
          id: string
          is_active: boolean
          last_seen_at: string
          license_id: string
          metadata: Json | null
        }
        Insert: {
          activated_at?: string
          host_identifier: string
          host_ip?: string | null
          host_name?: string | null
          id?: string
          is_active?: boolean
          last_seen_at?: string
          license_id: string
          metadata?: Json | null
        }
        Update: {
          activated_at?: string
          host_identifier?: string
          host_ip?: string | null
          host_name?: string | null
          id?: string
          is_active?: boolean
          last_seen_at?: string
          license_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "license_activations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "product_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      license_catalog: {
        Row: {
          base_price: number | null
          changelog: string | null
          created_at: string
          credit_packages: Json | null
          credits_included: number | null
          demo_duration_days: number
          demo_features: string[] | null
          demo_seats: number
          description: string
          id: string
          is_active: boolean
          latest_stable_version: string | null
          license_model: string
          maintenance_included: boolean | null
          min_version: string | null
          price_per_credit: number | null
          price_tier: string | null
          product_name: string
          product_type: string
          release_date: string | null
          subscription_period_months: number | null
          support_level: string | null
          updated_at: string
          version: string | null
          version_stage: string | null
        }
        Insert: {
          base_price?: number | null
          changelog?: string | null
          created_at?: string
          credit_packages?: Json | null
          credits_included?: number | null
          demo_duration_days?: number
          demo_features?: string[] | null
          demo_seats?: number
          description: string
          id?: string
          is_active?: boolean
          latest_stable_version?: string | null
          license_model?: string
          maintenance_included?: boolean | null
          min_version?: string | null
          price_per_credit?: number | null
          price_tier?: string | null
          product_name: string
          product_type?: string
          release_date?: string | null
          subscription_period_months?: number | null
          support_level?: string | null
          updated_at?: string
          version?: string | null
          version_stage?: string | null
        }
        Update: {
          base_price?: number | null
          changelog?: string | null
          created_at?: string
          credit_packages?: Json | null
          credits_included?: number | null
          demo_duration_days?: number
          demo_features?: string[] | null
          demo_seats?: number
          description?: string
          id?: string
          is_active?: boolean
          latest_stable_version?: string | null
          license_model?: string
          maintenance_included?: boolean | null
          min_version?: string | null
          price_per_credit?: number | null
          price_tier?: string | null
          product_name?: string
          product_type?: string
          release_date?: string | null
          subscription_period_months?: number | null
          support_level?: string | null
          updated_at?: string
          version?: string | null
          version_stage?: string | null
        }
        Relationships: []
      }
      license_tiers: {
        Row: {
          created_at: string
          description: string
          id: string
          max_seats: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          max_seats?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          max_seats?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      permission_types: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_downloads: {
        Row: {
          catalog_id: string | null
          description: string | null
          file_url: string
          id: string
          is_latest: boolean
          product_name: string
          product_type: string
          release_date: string
          version: string
        }
        Insert: {
          catalog_id?: string | null
          description?: string | null
          file_url: string
          id?: string
          is_latest?: boolean
          product_name: string
          product_type: string
          release_date?: string
          version: string
        }
        Update: {
          catalog_id?: string | null
          description?: string | null
          file_url?: string
          id?: string
          is_latest?: boolean
          product_name?: string
          product_type?: string
          release_date?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_downloads_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "license_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      product_licenses: {
        Row: {
          activation_date: string | null
          addons: string[] | null
          allowed_networks: string[] | null
          assigned_to: string | null
          concurrent_sessions: number | null
          created_at: string
          expiry_date: string
          features: string[] | null
          id: string
          last_active: string | null
          license_key: string
          max_hosts: number | null
          product_name: string
          seats: number
          status: string
          tier_id: string
          updated_at: string
          usage_hours_limit: number | null
        }
        Insert: {
          activation_date?: string | null
          addons?: string[] | null
          allowed_networks?: string[] | null
          assigned_to?: string | null
          concurrent_sessions?: number | null
          created_at?: string
          expiry_date: string
          features?: string[] | null
          id?: string
          last_active?: string | null
          license_key: string
          max_hosts?: number | null
          product_name: string
          seats?: number
          status: string
          tier_id: string
          updated_at?: string
          usage_hours_limit?: number | null
        }
        Update: {
          activation_date?: string | null
          addons?: string[] | null
          allowed_networks?: string[] | null
          assigned_to?: string | null
          concurrent_sessions?: number | null
          created_at?: string
          expiry_date?: string
          features?: string[] | null
          id?: string
          last_active?: string | null
          license_key?: string
          max_hosts?: number | null
          product_name?: string
          seats?: number
          status?: string
          tier_id?: string
          updated_at?: string
          usage_hours_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_licenses_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "license_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean | null
          created_at: string
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_documents: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          catalog_id: string | null
          created_at: string
          credits_purchased: number
          credits_remaining: number | null
          credits_used: number
          id: string
          package_name: string | null
          price_paid: number | null
          purchased_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          catalog_id?: string | null
          created_at?: string
          credits_purchased?: number
          credits_remaining?: number | null
          credits_used?: number
          id?: string
          package_name?: string | null
          price_paid?: number | null
          purchased_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          catalog_id?: string | null
          created_at?: string
          credits_purchased?: number
          credits_remaining?: number | null
          credits_used?: number
          id?: string
          package_name?: string | null
          price_paid?: number | null
          purchased_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "license_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          display_density: string | null
          email_notifications: boolean | null
          id: string
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_density?: string | null
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_density?: string | null
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_roles: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      promote_to_admin: { Args: { user_email: string }; Returns: undefined }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "moderator"
        | "var"
        | "customer_rep"
        | "customer"
      permission_type: "downloads" | "support" | "admin"
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
      app_role: [
        "admin",
        "user",
        "moderator",
        "var",
        "customer_rep",
        "customer",
      ],
      permission_type: ["downloads", "support", "admin"],
    },
  },
} as const
