import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

// Add your admin email here
const ADMIN_EMAIL = 'sos@bettercalljerem.com'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/login')
  }

  // Get all affiliates
  const { data: affiliates } = await supabase
    .from('affiliates')
    .select(`
      *,
      referral_links (code, clicks),
      prospects (count),
      commissions (amount, paid)
    `)
    .order('created_at', { ascending: false })

  // Get all prospects with affiliate info
  const { data: prospects } = await supabase
    .from('prospects')
    .select(`
      *,
      affiliates (name, email)
    `)
    .order('created_at', { ascending: false })

  // Get all invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      prospects (name, company, affiliate_id)
    `)
    .order('created_at', { ascending: false })

  return (
    <AdminDashboard
      affiliates={affiliates || []}
      prospects={prospects || []}
      invoices={invoices || []}
    />
  )
}