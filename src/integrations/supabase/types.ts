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
      categories: {
        Row: {
          banner_url: string | null
          blurb: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          blurb?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          blurb?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          admin_notes: string | null
          carrier: string | null
          configuration: Json | null
          created_at: string
          currency: string | null
          email: string | null
          id: string
          is_archived: boolean
          is_read: boolean
          message: string
          metadata: Json
          name: string
          phone: string | null
          product_slug: string | null
          shipping_address: Json | null
          source: string
          status: string
          subject: string | null
          total_amount: number | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          carrier?: string | null
          configuration?: Json | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          is_archived?: boolean
          is_read?: boolean
          message: string
          metadata?: Json
          name: string
          phone?: string | null
          product_slug?: string | null
          shipping_address?: Json | null
          source?: string
          status?: string
          subject?: string | null
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          carrier?: string | null
          configuration?: Json | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          is_archived?: boolean
          is_read?: boolean
          message?: string
          metadata?: Json
          name?: string
          phone?: string | null
          product_slug?: string | null
          shipping_address?: Json | null
          source?: string
          status?: string
          subject?: string | null
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gifts: {
        Row: {
          audience: string | null
          created_at: string
          cta_label: string | null
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          occasion: string | null
          price_from: number | null
          product_slug: string | null
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string | null
          created_at?: string
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          occasion?: string | null
          price_from?: number | null
          product_slug?: string | null
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string | null
          created_at?: string
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          occasion?: string | null
          price_from?: number | null
          product_slug?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_automations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          last_run_at: string | null
          name: string
          run_count: number
          subject_override: string | null
          template_name: string
          trigger_status: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name: string
          run_count?: number
          subject_override?: string | null
          template_name: string
          trigger_status: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name?: string
          run_count?: number
          subject_override?: string | null
          template_name?: string
          trigger_status?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string
          href: string
          id: string
          is_active: boolean
          label: string
          menu_key: string
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_active?: boolean
          label: string
          menu_key: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_active?: boolean
          label?: string
          menu_key?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
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
      orders: {
        Row: {
          admin_notes: string | null
          carrier: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          discount: number
          enquiry_id: string | null
          estimated_delivery: string | null
          id: string
          items: Json
          order_code: string
          payment_status: string
          shipping_address: Json | null
          shipping_cost: number
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          carrier?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          discount?: number
          enquiry_id?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          order_code: string
          payment_status?: string
          shipping_address?: Json | null
          shipping_cost?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          carrier?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          discount?: number
          enquiry_id?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          order_code?: string
          payment_status?: string
          shipping_address?: Json | null
          shipping_cost?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          blocks: Json
          created_at: string
          hero_image_url: string | null
          id: string
          is_published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      popups: {
        Row: {
          active: boolean
          created_at: string
          cta_label: string | null
          delay_seconds: number
          description: string | null
          end_at: string | null
          frequency: string
          id: string
          image_url: string | null
          link_url: string | null
          pages: string[]
          priority: number
          size: string
          start_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_label?: string | null
          delay_seconds?: number
          description?: string | null
          end_at?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          link_url?: string | null
          pages?: string[]
          priority?: number
          size?: string
          start_at?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_label?: string | null
          delay_seconds?: number
          description?: string | null
          end_at?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          link_url?: string | null
          pages?: string[]
          priority?: number
          size?: string
          start_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          categories: string[]
          category: string
          created_at: string
          currency: string
          description: string | null
          diamond_type: string | null
          id: string
          images: Json
          is_active: boolean
          is_featured: boolean
          low_stock_threshold: number
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
          stock_quantity: number
          subcategory: string | null
          track_inventory: boolean
          updated_at: string
          video_url: string | null
        }
        Insert: {
          categories?: string[]
          category: string
          created_at?: string
          currency?: string
          description?: string | null
          diamond_type?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          is_featured?: boolean
          low_stock_threshold?: number
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
          stock_quantity?: number
          subcategory?: string | null
          track_inventory?: boolean
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          categories?: string[]
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          diamond_type?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          is_featured?: boolean
          low_stock_threshold?: number
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
          stock_quantity?: number
          subcategory?: string | null
          track_inventory?: boolean
          updated_at?: string
          video_url?: string | null
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
      settings: {
        Row: {
          body_scripts: string | null
          google_analytics_id: string | null
          header_scripts: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          body_scripts?: string | null
          google_analytics_id?: string | null
          header_scripts?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          body_scripts?: string | null
          google_analytics_id?: string | null
          header_scripts?: string | null
          id?: string
          updated_at?: string | null
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
      gen_order_code: { Args: never; Returns: string }
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
