export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          public_about_body: string | null;
          public_about_title: string | null;
          brand_accent_color: string;
          brand_alt_color: string;
          brand_logo_url: string | null;
          brand_primary_color: string;
          brand_surface_color: string;
          booking_notice_hours: number;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          created_by: string | null;
          default_booking_buffer_minutes: number;
          id: string;
          name: string;
          public_contact_body: string | null;
          public_contact_title: string | null;
          public_description: string | null;
          public_headline: string | null;
          public_id: string;
          public_site_enabled: boolean;
          public_tagline: string | null;
          slot_interval_minutes: number;
          slug: string;
          status: Database["public"]["Enums"]["organization_status"];
          timezone: string;
          updated_at: string;
        };
        Insert: {
          public_about_body?: string | null;
          public_about_title?: string | null;
          brand_accent_color?: string;
          brand_alt_color?: string;
          brand_logo_url?: string | null;
          brand_primary_color?: string;
          brand_surface_color?: string;
          booking_notice_hours?: number;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          created_by?: string | null;
          default_booking_buffer_minutes?: number;
          id?: string;
          name: string;
          public_contact_body?: string | null;
          public_contact_title?: string | null;
          public_description?: string | null;
          public_headline?: string | null;
          public_id?: string;
          public_site_enabled?: boolean;
          public_tagline?: string | null;
          slot_interval_minutes?: number;
          slug: string;
          status?: Database["public"]["Enums"]["organization_status"];
          timezone: string;
          updated_at?: string;
        };
        Update: {
          public_about_body?: string | null;
          public_about_title?: string | null;
          brand_accent_color?: string;
          brand_alt_color?: string;
          brand_logo_url?: string | null;
          brand_primary_color?: string;
          brand_surface_color?: string;
          booking_notice_hours?: number;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          created_by?: string | null;
          default_booking_buffer_minutes?: number;
          id?: string;
          name?: string;
          public_contact_body?: string | null;
          public_contact_title?: string | null;
          public_description?: string | null;
          public_headline?: string | null;
          public_id?: string;
          public_site_enabled?: boolean;
          public_tagline?: string | null;
          slot_interval_minutes?: number;
          slug?: string;
          status?: Database["public"]["Enums"]["organization_status"];
          timezone?: string;
          updated_at?: string;
        };
      };
      organization_members: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          organization_id: string;
          role: Database["public"]["Enums"]["membership_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          organization_id: string;
          role?: Database["public"]["Enums"]["membership_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          organization_id?: string;
          role?: Database["public"]["Enums"]["membership_role"];
          updated_at?: string;
          user_id?: string;
        };
      };
      services: {
        Row: {
          buffer_minutes: number;
          created_at: string;
          currency: string;
          description: string | null;
          duration_minutes: number;
          id: string;
          is_active: boolean;
          name: string;
          organization_id: string;
          price_amount: number;
          public_id: string;
          updated_at: string;
        };
        Insert: {
          buffer_minutes?: number;
          created_at?: string;
          currency?: string;
          description?: string | null;
          duration_minutes: number;
          id?: string;
          is_active?: boolean;
          name: string;
          organization_id: string;
          price_amount?: number;
          public_id?: string;
          updated_at?: string;
        };
        Update: {
          buffer_minutes?: number;
          created_at?: string;
          currency?: string;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          is_active?: boolean;
          name?: string;
          organization_id?: string;
          price_amount?: number;
          public_id?: string;
          updated_at?: string;
        };
      };
      availability_rules: {
        Row: {
          created_at: string;
          end_minute: number;
          id: string;
          is_active: boolean;
          organization_id: string;
          start_minute: number;
          updated_at: string;
          weekday: number;
        };
        Insert: {
          created_at?: string;
          end_minute: number;
          id?: string;
          is_active?: boolean;
          organization_id: string;
          start_minute: number;
          updated_at?: string;
          weekday: number;
        };
        Update: {
          created_at?: string;
          end_minute?: number;
          id?: string;
          is_active?: boolean;
          organization_id?: string;
          start_minute?: number;
          updated_at?: string;
          weekday?: number;
        };
      };
      blocked_dates: {
        Row: {
          blocked_on: string;
          created_at: string;
          id: string;
          organization_id: string;
          reason: string | null;
        };
        Insert: {
          blocked_on: string;
          created_at?: string;
          id?: string;
          organization_id: string;
          reason?: string | null;
        };
        Update: {
          blocked_on?: string;
          created_at?: string;
          id?: string;
          organization_id?: string;
          reason?: string | null;
        };
      };
      time_off_periods: {
        Row: {
          created_at: string;
          ends_at: string;
          id: string;
          organization_id: string;
          reason: string | null;
          starts_at: string;
        };
        Insert: {
          created_at?: string;
          ends_at: string;
          id?: string;
          organization_id: string;
          reason?: string | null;
          starts_at: string;
        };
        Update: {
          created_at?: string;
          ends_at?: string;
          id?: string;
          organization_id?: string;
          reason?: string | null;
          starts_at?: string;
        };
      };
      customers: {
        Row: {
          created_at: string;
          email: string | null;
          first_booked_at: string | null;
          full_name: string;
          id: string;
          internal_notes: string | null;
          last_booked_at: string | null;
          notes: string | null;
          organization_id: string;
          phone: string | null;
          public_id: string;
          status: Database["public"]["Enums"]["customer_status"];
          tags: string[];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          first_booked_at?: string | null;
          full_name: string;
          id?: string;
          internal_notes?: string | null;
          last_booked_at?: string | null;
          notes?: string | null;
          organization_id: string;
          phone?: string | null;
          public_id?: string;
          status?: Database["public"]["Enums"]["customer_status"];
          tags?: string[];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          first_booked_at?: string | null;
          full_name?: string;
          id?: string;
          internal_notes?: string | null;
          last_booked_at?: string | null;
          notes?: string | null;
          organization_id?: string;
          phone?: string | null;
          public_id?: string;
          status?: Database["public"]["Enums"]["customer_status"];
          tags?: string[];
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          booking_window: string;
          buffer_minutes: number;
          cancelled_at: string | null;
          confirmed_at: string | null;
          created_at: string;
          created_by_member_id: string | null;
          customer_email: string | null;
          customer_id: string | null;
          customer_name: string;
          customer_notes: string | null;
          customer_phone: string | null;
          ends_at: string;
          id: string;
          internal_notes: string | null;
          organization_id: string;
          public_id: string;
          service_currency: string;
          service_duration_minutes: number;
          service_id: string;
          service_name_snapshot: string | null;
          service_price_amount: number;
          source: string;
          starts_at: string;
          status: Database["public"]["Enums"]["booking_status"];
          updated_at: string;
        };
        Insert: {
          booking_window?: string;
          buffer_minutes?: number;
          cancelled_at?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          created_by_member_id?: string | null;
          customer_email?: string | null;
          customer_id?: string | null;
          customer_name: string;
          customer_notes?: string | null;
          customer_phone?: string | null;
          ends_at: string;
          id?: string;
          internal_notes?: string | null;
          organization_id: string;
          public_id?: string;
          service_currency?: string;
          service_duration_minutes?: number;
          service_id: string;
          service_name_snapshot?: string | null;
          service_price_amount?: number;
          source?: string;
          starts_at: string;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Update: {
          booking_window?: string;
          buffer_minutes?: number;
          cancelled_at?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          created_by_member_id?: string | null;
          customer_email?: string | null;
          customer_id?: string | null;
          customer_name?: string;
          customer_notes?: string | null;
          customer_phone?: string | null;
          ends_at?: string;
          id?: string;
          internal_notes?: string | null;
          organization_id?: string;
          public_id?: string;
          service_currency?: string;
          service_duration_minutes?: number;
          service_id?: string;
          service_name_snapshot?: string | null;
          service_price_amount?: number;
          source?: string;
          starts_at?: string;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
      };
      notification_outbox: {
        Row: {
          booking_id: string | null;
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at: string;
          id: string;
          organization_id: string;
          payload: Json;
          processed_at: string | null;
          send_after: string;
          status: Database["public"]["Enums"]["outbox_status"];
          template_key: string;
        };
        Insert: {
          booking_id?: string | null;
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          id?: string;
          organization_id: string;
          payload?: Json;
          processed_at?: string | null;
          send_after?: string;
          status?: Database["public"]["Enums"]["outbox_status"];
          template_key: string;
        };
        Update: {
          booking_id?: string | null;
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          id?: string;
          organization_id?: string;
          payload?: Json;
          processed_at?: string | null;
          send_after?: string;
          status?: Database["public"]["Enums"]["outbox_status"];
          template_key?: string;
        };
      };
      billing_plans: {
        Row: {
          booking_limit_per_month: number | null;
          created_at: string;
          id: string;
          is_active: boolean;
          monthly_price_amount: number;
          name: string;
          service_limit: number | null;
          staff_limit: number | null;
        };
        Insert: {
          booking_limit_per_month?: number | null;
          created_at?: string;
          id: string;
          is_active?: boolean;
          monthly_price_amount?: number;
          name: string;
          service_limit?: number | null;
          staff_limit?: number | null;
        };
        Update: {
          booking_limit_per_month?: number | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          monthly_price_amount?: number;
          name?: string;
          service_limit?: number | null;
          staff_limit?: number | null;
        };
      };
      organization_subscriptions: {
        Row: {
          created_at: string;
          current_period_ends_at: string | null;
          id: string;
          organization_id: string;
          plan_id: string;
          status: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_period_ends_at?: string | null;
          id?: string;
          organization_id: string;
          plan_id: string;
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current_period_ends_at?: string | null;
          id?: string;
          organization_id?: string;
          plan_id?: string;
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show";
      customer_status: "lead" | "active" | "vip" | "inactive";
      membership_role: "owner" | "admin" | "staff";
      notification_channel: "email" | "sms" | "webhook";
      organization_status: "active" | "trialing" | "suspended";
      outbox_status: "queued" | "processing" | "sent" | "failed";
      subscription_status:
        | "inactive"
        | "trialing"
        | "active"
        | "past_due"
        | "cancelled";
    };
    Functions: {
      create_public_booking: {
        Args: {
          p_customer_email: string;
          p_customer_name: string;
          p_customer_notes?: string | null;
          p_customer_phone?: string | null;
          p_organization_slug: string;
          p_service_id: string;
          p_starts_at: string;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
