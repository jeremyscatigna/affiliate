import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get affiliate data
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!affiliate) {
    redirect('/login')
  }

  // Get referral link
  const { data: referralLink } = await supabase
    .from('referral_links')
    .select('*')
    .eq('affiliate_id', user.id)
    .single()

  // Get prospects
  const { data: prospects } = await supabase
    .from('prospects')
    .select('*')
    .eq('affiliate_id', user.id)
    .order('created_at', { ascending: false })

  // Get commissions with invoice data
  const { data: commissions } = await supabase
    .from('commissions')
    .select(`
      *,
      invoices (
        amount,
        paid_at,
        prospects (
          name,
          company
        )
      )
    `)
    .eq('affiliate_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardContent 
      affiliate={affiliate}
      referralLink={referralLink}
      prospects={prospects || []}
      commissions={commissions || []}
    />
  )
}