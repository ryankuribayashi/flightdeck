export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          callsign: string;
          display_name: string | null;
          home_airport: string | null;
          avatar_url: string | null;
          rank: string;
          spotted_count: number;
          airports_count: number;
          nm_logged: number;
          airlines_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          callsign: string;
          display_name?: string | null;
          home_airport?: string | null;
          avatar_url?: string | null;
          rank?: string;
          spotted_count?: number;
          airports_count?: number;
          nm_logged?: number;
          airlines_count?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          caption: string | null;
          aircraft_type: string | null;
          icao_type: string | null;
          airline: string | null;
          flight_number: string | null;
          origin_airport: string | null;
          destination_airport: string | null;
          altitude: string | null;
          speed: string | null;
          airport: string | null;
          is_live: boolean;
          is_instant: boolean;
          likes_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          caption?: string | null;
          aircraft_type?: string | null;
          icao_type?: string | null;
          airline?: string | null;
          flight_number?: string | null;
          origin_airport?: string | null;
          destination_airport?: string | null;
          altitude?: string | null;
          speed?: string | null;
          airport?: string | null;
          is_live?: boolean;
          is_instant?: boolean;
          likes_count?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          media_url: string;
          airport: string | null;
          is_live: boolean;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_url: string;
          airport?: string | null;
          is_live?: boolean;
          expires_at?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['stories']['Insert']>;
      };
      squadrons: {
        Row: {
          id: string;
          name: string;
          tail_code: string;
          color: string;
          created_by: string;
          member_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tail_code: string;
          color?: string;
          created_by: string;
          member_count?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['squadrons']['Insert']>;
      };
      squadron_members: {
        Row: { squadron_id: string; user_id: string; role: string; joined_at: string };
        Insert: { squadron_id: string; user_id: string; role?: string; joined_at?: string };
        Update: Partial<Database['public']['Tables']['squadron_members']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          squadron_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          squadron_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      tail_watchlist: {
        Row: {
          id: string;
          user_id: string;
          registration: string;
          aircraft_type: string | null;
          airline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          registration: string;
          aircraft_type?: string | null;
          airline?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tail_watchlist']['Insert']>;
      };
      flight_log: {
        Row: {
          id: string;
          user_id: string;
          origin: string;
          destination: string;
          airline: string | null;
          flight_number: string | null;
          aircraft_type: string | null;
          seat_class: string | null;
          flight_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          origin: string;
          destination: string;
          airline?: string | null;
          flight_number?: string | null;
          aircraft_type?: string | null;
          seat_class?: string | null;
          flight_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['flight_log']['Insert']>;
      };
      likes: {
        Row: { post_id: string; user_id: string };
        Insert: { post_id: string; user_id: string };
        Update: never;
      };
    };
  };
}
