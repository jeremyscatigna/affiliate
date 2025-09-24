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
      affiliates: {
        Row: {
          id: string
          email: string
          name: string
          bank_info: Json | null
          status: 'pending' | 'approved' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          bank_info?: Json | null
          status?: 'pending' | 'approved' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          bank_info?: Json | null
          status?: 'pending' | 'approved' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      referral_links: {
        Row: {
          id: string
          affiliate_id: string
          code: string
          clicks: number
          created_at: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          code: string
          clicks?: number
          created_at?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          code?: string
          clicks?: number
          created_at?: string
        }
      }
      prospects: {
        Row: {
          id: string
          affiliate_id: string
          name: string
          email: string
          company: string
          message: string | null
          status: 'new' | 'contacted' | 'qualified' | 'client' | 'lost'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          name: string
          email: string
          company: string
          message?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'client' | 'lost'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          name?: string
          email?: string
          company?: string
          message?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'client' | 'lost'
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          prospect_id: string
          amount: number
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prospect_id: string
          amount: number
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prospect_id?: string
          amount?: number
          paid_at?: string | null
          created_at?: string
        }
      }
      commissions: {
        Row: {
          id: string
          affiliate_id: string
          invoice_id: string
          amount: number
          paid: boolean
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          invoice_id: string
          amount: number
          paid?: boolean
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          invoice_id?: string
          amount?: number
          paid?: boolean
          paid_at?: string | null
          created_at?: string
        }
      }
    }
  }
}