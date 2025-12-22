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
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      crm_accounts: {
        Row: {
          account_type: string | null
          address_line1: string | null
          address_line2: string | null
          annual_revenue: number | null
          city: string | null
          country: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          employee_count: number | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          owner_id: string | null
          parent_account_id: string | null
          payment_approved_by: string | null
          payment_verified: boolean | null
          payment_verified_at: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          stripe_customer_id: string | null
          tags: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          account_type?: string | null
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          employee_count?: number | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          parent_account_id?: string | null
          payment_approved_by?: string | null
          payment_verified?: boolean | null
          payment_verified_at?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          account_type?: string | null
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          employee_count?: number | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          parent_account_id?: string | null
          payment_approved_by?: string | null
          payment_verified?: boolean | null
          payment_verified_at?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          account_id: string | null
          activity_type: string
          completed_at: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          duration_minutes: number | null
          id: string
          outcome: string | null
          owner_id: string | null
          priority: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          activity_type: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          outcome?: string | null
          owner_id?: string | null
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          activity_type?: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          outcome?: string | null
          owner_id?: string | null
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          account_id: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string
          custom_fields: Json | null
          department: string | null
          email: string | null
          first_name: string
          id: string
          is_primary: boolean | null
          job_title: string | null
          last_contacted_at: string | null
          last_name: string
          lead_source: string | null
          mobile: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          department?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_primary?: boolean | null
          job_title?: string | null
          last_contacted_at?: string | null
          last_name: string
          lead_source?: string | null
          mobile?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          department?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_primary?: boolean | null
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string
          lead_source?: string | null
          mobile?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          account_id: string | null
          actual_close_date: string | null
          amount: number | null
          competitors: string[] | null
          contact_id: string | null
          created_at: string
          currency: string | null
          custom_fields: Json | null
          description: string | null
          expected_close_date: string | null
          id: string
          lead_source: string | null
          name: string
          next_step: string | null
          notes: string | null
          owner_id: string | null
          probability: number | null
          stage: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          actual_close_date?: string | null
          amount?: number | null
          competitors?: string[] | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_source?: string | null
          name: string
          next_step?: string | null
          notes?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          actual_close_date?: string | null
          amount?: number | null
          competitors?: string[] | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_source?: string | null
          name?: string
          next_step?: string | null
          notes?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_onboarding: {
        Row: {
          account_id: string | null
          assigned_rep: string | null
          company_name: string | null
          completed_at: string | null
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          current_step: number
          id: string
          notes: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["onboarding_status"]
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          assigned_rep?: string | null
          company_name?: string | null
          completed_at?: string | null
          contact_email: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          current_step?: number
          id?: string
          notes?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          total_steps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          assigned_rep?: string | null
          company_name?: string | null
          completed_at?: string | null
          contact_email?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          current_step?: number
          id?: string
          notes?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_onboarding_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_payment_methods: {
        Row: {
          account_id: string | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          created_at: string
          id: string
          is_default: boolean | null
          stripe_customer_id: string
          stripe_payment_method_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_customer_id: string
          stripe_payment_method_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_customer_id?: string
          stripe_payment_method_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_payment_methods_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      download_statistics: {
        Row: {
          download_id: string
          downloaded_at: string
          id: string
          ip_address: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          download_id: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          download_id?: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_statistics_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "download_counts"
            referencedColumns: ["download_id"]
          },
          {
            foreignKeyName: "download_statistics_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "product_downloads"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          priority: string | null
          product_name: string
          status: string
          submitted_by: string | null
          submitted_by_email: string | null
          title: string
          updated_at: string
          vote_count: number
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          product_name: string
          status?: string
          submitted_by?: string | null
          submitted_by_email?: string | null
          title: string
          updated_at?: string
          vote_count?: number
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          product_name?: string
          status?: string
          submitted_by?: string | null
          submitted_by_email?: string | null
          title?: string
          updated_at?: string
          vote_count?: number
        }
        Relationships: []
      }
      feature_votes: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_onboarding: {
        Row: {
          company_name: string | null
          completed_at: string | null
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          converted_user_id: string | null
          created_at: string
          current_step: number
          data: Json | null
          id: string
          session_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["onboarding_status"]
          total_steps: number
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          completed_at?: string | null
          contact_email: string
          contact_name?: string | null
          contact_phone?: string | null
          converted_user_id?: string | null
          created_at?: string
          current_step?: number
          data?: Json | null
          id?: string
          session_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          total_steps?: number
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          completed_at?: string | null
          contact_email?: string
          contact_name?: string | null
          contact_phone?: string | null
          converted_user_id?: string | null
          created_at?: string
          current_step?: number
          data?: Json | null
          id?: string
          session_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          total_steps?: number
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
          billing_period: string | null
          changelog: string | null
          created_at: string
          credit_packages: Json | null
          credits_included: number | null
          demo_duration_days: number
          demo_features: string[] | null
          demo_seats: number
          description: string
          development_status: string | null
          documentation_url: string | null
          end_of_life_date: string | null
          end_of_support_date: string | null
          feature_highlights: string[] | null
          id: string
          is_active: boolean
          latest_stable_version: string | null
          license_model: string
          maintenance_included: boolean | null
          min_version: string | null
          monthly_price: number | null
          next_release_date: string | null
          next_release_version: string | null
          price_per_credit: number | null
          price_tier: string | null
          product_name: string
          product_owner: string | null
          product_type: string
          release_date: string | null
          repository_url: string | null
          roadmap_status: string | null
          sku: string | null
          subscription_period_months: number | null
          support_level: string | null
          target_market: string | null
          updated_at: string
          version: string | null
          version_stage: string | null
        }
        Insert: {
          base_price?: number | null
          billing_period?: string | null
          changelog?: string | null
          created_at?: string
          credit_packages?: Json | null
          credits_included?: number | null
          demo_duration_days?: number
          demo_features?: string[] | null
          demo_seats?: number
          description: string
          development_status?: string | null
          documentation_url?: string | null
          end_of_life_date?: string | null
          end_of_support_date?: string | null
          feature_highlights?: string[] | null
          id?: string
          is_active?: boolean
          latest_stable_version?: string | null
          license_model?: string
          maintenance_included?: boolean | null
          min_version?: string | null
          monthly_price?: number | null
          next_release_date?: string | null
          next_release_version?: string | null
          price_per_credit?: number | null
          price_tier?: string | null
          product_name: string
          product_owner?: string | null
          product_type?: string
          release_date?: string | null
          repository_url?: string | null
          roadmap_status?: string | null
          sku?: string | null
          subscription_period_months?: number | null
          support_level?: string | null
          target_market?: string | null
          updated_at?: string
          version?: string | null
          version_stage?: string | null
        }
        Update: {
          base_price?: number | null
          billing_period?: string | null
          changelog?: string | null
          created_at?: string
          credit_packages?: Json | null
          credits_included?: number | null
          demo_duration_days?: number
          demo_features?: string[] | null
          demo_seats?: number
          description?: string
          development_status?: string | null
          documentation_url?: string | null
          end_of_life_date?: string | null
          end_of_support_date?: string | null
          feature_highlights?: string[] | null
          id?: string
          is_active?: boolean
          latest_stable_version?: string | null
          license_model?: string
          maintenance_included?: boolean | null
          min_version?: string | null
          monthly_price?: number | null
          next_release_date?: string | null
          next_release_version?: string | null
          price_per_credit?: number | null
          price_tier?: string | null
          product_name?: string
          product_owner?: string | null
          product_type?: string
          release_date?: string | null
          repository_url?: string | null
          roadmap_status?: string | null
          sku?: string | null
          subscription_period_months?: number | null
          support_level?: string | null
          target_market?: string | null
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
      onboarding_emails: {
        Row: {
          email_type: string
          error_message: string | null
          id: string
          message_id: string | null
          onboarding_id: string
          recipient_email: string
          sent_at: string
          status: string
          subject: string
        }
        Insert: {
          email_type: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          onboarding_id: string
          recipient_email: string
          sent_at?: string
          status?: string
          subject: string
        }
        Update: {
          email_type?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          onboarding_id?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_emails_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "customer_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          data: Json | null
          id: string
          is_completed: boolean
          onboarding_id: string
          step_description: string | null
          step_name: string
          step_number: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_completed?: boolean
          onboarding_id: string
          step_description?: string | null
          step_name: string
          step_number: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_completed?: boolean
          onboarding_id?: string
          step_description?: string | null
          step_name?: string
          step_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "customer_onboarding"
            referencedColumns: ["id"]
          },
        ]
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
      product_comments: {
        Row: {
          catalog_id: string | null
          content: string
          created_at: string
          download_id: string | null
          id: string
          is_internal: boolean | null
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          catalog_id?: string | null
          content: string
          created_at?: string
          download_id?: string | null
          id?: string
          is_internal?: boolean | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          catalog_id?: string | null
          content?: string
          created_at?: string
          download_id?: string | null
          id?: string
          is_internal?: boolean | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comments_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "license_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "download_counts"
            referencedColumns: ["download_id"]
          },
          {
            foreignKeyName: "product_comments_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "product_downloads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_documents: {
        Row: {
          catalog_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          document_type: string
          download_id: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          catalog_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_type?: string
          download_id?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          catalog_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_type?: string
          download_id?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "license_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "download_counts"
            referencedColumns: ["download_id"]
          },
          {
            foreignKeyName: "product_documents_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "product_downloads"
            referencedColumns: ["id"]
          },
        ]
      }
      product_downloads: {
        Row: {
          announcement_date: string | null
          catalog_id: string | null
          description: string | null
          expected_release_date: string | null
          file_size: number | null
          file_url: string
          id: string
          is_latest: boolean
          package_format: string | null
          pre_order_available: boolean | null
          product_name: string
          product_type: string
          release_date: string
          release_notes: string | null
          sha256_hash: string | null
          status: string
          version: string
          visibility: string
        }
        Insert: {
          announcement_date?: string | null
          catalog_id?: string | null
          description?: string | null
          expected_release_date?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_latest?: boolean
          package_format?: string | null
          pre_order_available?: boolean | null
          product_name: string
          product_type: string
          release_date?: string
          release_notes?: string | null
          sha256_hash?: string | null
          status?: string
          version: string
          visibility?: string
        }
        Update: {
          announcement_date?: string | null
          catalog_id?: string | null
          description?: string | null
          expected_release_date?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_latest?: boolean
          package_format?: string | null
          pre_order_available?: boolean | null
          product_name?: string
          product_type?: string
          release_date?: string
          release_notes?: string | null
          sha256_hash?: string | null
          status?: string
          version?: string
          visibility?: string
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
          account_id: string | null
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
          account_id?: string | null
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
          account_id?: string | null
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
            foreignKeyName: "product_licenses_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
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
      support_tickets: {
        Row: {
          account_id: string | null
          assigned_team: string | null
          assigned_to: string | null
          category: string | null
          contact_id: string | null
          created_at: string
          custom_fields: Json | null
          description: string
          escalated: boolean | null
          escalated_at: string | null
          escalated_to: string | null
          escalation_reason: string | null
          first_response_at: string | null
          flag_reason: string | null
          flagged_for_review: boolean | null
          id: string
          license_id: string | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status: string | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          product_name: string | null
          requester_email: string
          requester_id: string | null
          requester_name: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          sla_due_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tags: string[] | null
          ticket_number: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assigned_team?: string | null
          assigned_to?: string | null
          category?: string | null
          contact_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          description: string
          escalated?: boolean | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          first_response_at?: string | null
          flag_reason?: string | null
          flagged_for_review?: boolean | null
          id?: string
          license_id?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          product_name?: string | null
          requester_email: string
          requester_id?: string | null
          requester_name?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          sla_due_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tags?: string[] | null
          ticket_number: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assigned_team?: string | null
          assigned_to?: string | null
          category?: string | null
          contact_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          description?: string
          escalated?: boolean | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          first_response_at?: string | null
          flag_reason?: string | null
          flagged_for_review?: boolean | null
          id?: string
          license_id?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          product_name?: string | null
          requester_email?: string
          requester_id?: string | null
          requester_name?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          sla_due_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          tags?: string[] | null
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "crm_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "product_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_attachments: {
        Row: {
          comment_id: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          ticket_id: string
          uploaded_by: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          ticket_id: string
          uploaded_by?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          ticket_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "ticket_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_comments: {
        Row: {
          content: string
          created_at: string
          flag_reason: string | null
          flagged: boolean | null
          id: string
          is_internal: boolean | null
          is_resolution: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_status: string | null
          ticket_id: string
          updated_at: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          flag_reason?: string | null
          flagged?: boolean | null
          id?: string
          is_internal?: boolean | null
          is_resolution?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_status?: string | null
          ticket_id: string
          updated_at?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          flag_reason?: string | null
          flagged?: boolean | null
          id?: string
          is_internal?: boolean | null
          is_resolution?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_status?: string | null
          ticket_id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_watchers: {
        Row: {
          created_at: string
          id: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_watchers_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
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
      download_counts: {
        Row: {
          download_id: string | null
          last_downloaded_at: string | null
          product_name: string | null
          product_type: string | null
          total_downloads: number | null
          unique_users: number | null
          version: string | null
        }
        Relationships: []
      }
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
        | "account_rep"
        | "marketing"
        | "free"
        | "program_manager"
        | "support"
      onboarding_status: "not_started" | "in_progress" | "completed" | "on_hold"
      permission_type: "downloads" | "support" | "admin"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_customer"
        | "waiting_internal"
        | "resolved"
        | "closed"
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
        "account_rep",
        "marketing",
        "free",
        "program_manager",
        "support",
      ],
      onboarding_status: ["not_started", "in_progress", "completed", "on_hold"],
      permission_type: ["downloads", "support", "admin"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_customer",
        "waiting_internal",
        "resolved",
        "closed",
      ],
    },
  },
} as const
