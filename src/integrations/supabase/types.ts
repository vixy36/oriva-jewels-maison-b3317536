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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_archived: boolean
          is_read: boolean
          message: string
          metadata: Json
          name: string
          phone: string | null
          product_slug: string | null
          source: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_archived?: boolean
          is_read?: boolean
          message: string
          metadata?: Json
          name: string
          phone?: string | null
          product_slug?: string | null
          source?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_archived?: boolean
          is_read?: boolean
          message?: string
          metadata?: Json
          name?: string
          phone?: string | null
          product_slug?: string | null
          source?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          badge: string | null
          category: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          discount_type: string
          discount_value: number | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean
          priority: number
          promo_code: string | null
          starts_at: string | null
          subtitle: string | null
          terms: string | null
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          category?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          priority?: number
          promo_code?: string | null
          starts_at?: string | null
          subtitle?: string | null
          terms?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          category?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          priority?: number
          promo_code?: string | null
          starts_at?: string | null
          subtitle?: string | null
          terms?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          currency: string
          description: string | null
          diamond_type: string | null
          id: string
          images: Json
          is_active: boolean
          is_featured: boolean
          metal_options: Json
          mrp: number | null
          name: string
          offer_id: string | null
          price_from: number | null
          product_code: string | null
          short_description: string | null
          show_price: boolean
          slug: string
          sort_order: number
          specs: Json
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          currency?: string
          description?: string | null
          diamond_type?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          is_featured?: boolean
          metal_options?: Json
          mrp?: number | null
          name: string
          offer_id?: string | null
          price_from?: number | null
          product_code?: string | null
          short_description?: string | null
          show_price?: boolean
          slug: string
          sort_order?: number
          specs?: Json
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          diamond_type?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          is_featured?: boolean
          metal_options?: Json
          mrp?: number | null
          name?: string
          offer_id?: string | null
          price_from?: number | null
          product_code?: string | null
          short_description?: string | null
          show_price?: boolean
          slug?: string
          sort_order?: number
          specs?: Json
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_meta: {
        Row: {
          canonical: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          json_ld: Json | null
          keywords: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          robots: string | null
          route_path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          canonical?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          json_ld?: Json | null
          keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          robots?: string | null
          route_path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          canonical?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          json_ld?: Json | null
          keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          robots?: string | null
          route_path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          label: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          label?: string | null
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          label?: string | null
          updated_at?: string
          value?: Json
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
