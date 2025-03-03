export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      battery_groups: {
        Row: {
          id: string
          name: string
          type: string
          kind: 'disposable' | 'rechargeable'
          count: number
          voltage: number
          notes: string | null
          image_url: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          kind: 'disposable' | 'rechargeable'
          count: number
          voltage: number
          notes?: string | null
          image_url?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          kind?: 'disposable' | 'rechargeable'
          count?: number
          voltage?: number
          notes?: string | null
          image_url?: string | null
          created_at?: string
          user_id?: string
        }
      }
      batteries: {
        Row: {
          id: string
          group_id: string
          slot_number: number
          status: 'charged' | 'in_use' | 'empty' | 'disposed'
          last_checked: string | null
          last_changed_at: string | null
          device_id: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          group_id: string
          slot_number?: number
          status: 'charged' | 'in_use' | 'empty' | 'disposed'
          last_checked?: string | null
          last_changed_at?: string | null
          device_id?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          group_id?: string
          slot_number?: number
          status?: 'charged' | 'in_use' | 'empty' | 'disposed'
          last_checked?: string | null
          last_changed_at?: string | null
          device_id?: string | null
          created_at?: string
          user_id?: string
        }
      }
      battery_usage_history: {
        Row: {
          id: string
          battery_id: string
          device_id: string
          started_at: string
          ended_at: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          battery_id: string
          device_id: string
          started_at: string
          ended_at?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          battery_id?: string
          device_id?: string
          started_at?: string
          ended_at?: string | null
          created_at?: string
          user_id?: string
        }
      }
      devices: {
        Row: {
          id: string
          name: string
          type: 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy'
          battery_type: string
          battery_count: number
          purchase_date: string | null
          notes: string | null
          image_url: string | null
          created_at: string
          user_id: string
          last_battery_change: string | null
        }
        Insert: {
          id?: string
          name: string
          type: 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy'
          battery_type: string
          battery_count: number
          purchase_date?: string | null
          notes?: string | null
          image_url?: string | null
          created_at?: string
          user_id: string
          last_battery_change?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy'
          battery_type?: string
          battery_count?: number
          purchase_date?: string | null
          notes?: string | null
          image_url?: string | null
          created_at?: string
          user_id?: string
          last_battery_change?: string | null
        }
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
  }
}