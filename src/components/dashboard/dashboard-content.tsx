'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, ExternalLink, LogOut } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BankInfoForm } from './bank-info-form'

interface DashboardContentProps {
  affiliate: any
  referralLink: any
  prospects: any[]
  commissions: any[]
}

export function DashboardContent({ 
  affiliate, 
  referralLink, 
  prospects, 
  commissions 
}: DashboardContentProps) {
  const router = useRouter()
  const supabase = createClient()
  const [copied, setCopied] = useState(false)

  const referralUrl = `${window.location.origin}/ref/${referralLink?.code}`
  
  const totalEarned = commissions.reduce((sum, com) => sum + com.amount, 0)
  const pendingAmount = commissions
    .filter(com => !com.paid)
    .reduce((sum, com) => sum + com.amount, 0)
  const clientCount = prospects.filter(p => p.status === 'client').length

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 overflow-hidden flex flex-col">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto p-6 relative z-10 flex-1 flex flex-col max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-yellow-50">Tableau de bord</h1>
            <p className="text-yellow-100/70 mt-1">Bienvenue, {affiliate.name}</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Clics total</CardDescription>
              <CardTitle className="text-2xl text-yellow-50">{referralLink?.clicks || 0}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Prospects</CardDescription>
              <CardTitle className="text-2xl text-yellow-50">{prospects.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Clients</CardDescription>
              <CardTitle className="text-2xl text-yellow-50">{clientCount}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Gains totaux</CardDescription>
              <CardTitle className="text-2xl text-yellow-500">{totalEarned.toFixed(2)} €</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-4 bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-yellow-50">Votre lien d'affiliation</CardTitle>
            <CardDescription className="text-yellow-100/70">
              Partagez ce lien pour gagner 20% de commission sur chaque client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-emerald-950/50 border border-yellow-500/30 rounded-md text-yellow-50"
              />
              <Button 
                onClick={copyToClipboard}
                className="bg-yellow-500 hover:bg-yellow-600 text-emerald-950"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copié!' : 'Copier'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="prospects" className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-emerald-900/50 border border-yellow-500/20">
            <TabsTrigger value="prospects" className="text-yellow-100/70 data-[state=active]:bg-yellow-500 data-[state=active]:text-emerald-950">
              Prospects
            </TabsTrigger>
            <TabsTrigger value="commissions" className="text-yellow-100/70 data-[state=active]:bg-yellow-500 data-[state=active]:text-emerald-950">
              Commissions
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-yellow-100/70 data-[state=active]:bg-yellow-500 data-[state=active]:text-emerald-950">
              Profil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prospects" className="flex-1 overflow-hidden flex flex-col">
            <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur flex-1 overflow-auto">
              <CardHeader>
                <CardTitle className="text-yellow-50">Vos prospects</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto">
                <div className="min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-yellow-500/20">
                        <TableHead className="text-yellow-100/70">Nom</TableHead>
                        <TableHead className="text-yellow-100/70">Entreprise</TableHead>
                        <TableHead className="text-yellow-100/70">Email</TableHead>
                        <TableHead className="text-yellow-100/70">Statut</TableHead>
                        <TableHead className="text-yellow-100/70">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prospects.map((prospect) => (
                        <TableRow key={prospect.id} className="border-yellow-500/20">
                          <TableCell className="text-yellow-50">{prospect.name}</TableCell>
                          <TableCell className="text-yellow-50">{prospect.company}</TableCell>
                          <TableCell className="text-yellow-50">{prospect.email}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                prospect.status === 'client' ? 'bg-yellow-500 text-emerald-950' :
                                prospect.status === 'qualified' ? 'bg-yellow-500/50 text-yellow-50' :
                                'bg-emerald-800/50 text-yellow-100/70 border-yellow-500/30'
                              }
                            >
                              {prospect.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-yellow-100/70">
                            {format(new Date(prospect.created_at), 'dd MMM yyyy', { locale: fr })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="flex-1 overflow-hidden flex flex-col">
            <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur flex-1 overflow-auto">
              <CardHeader>
                <CardTitle className="text-yellow-50">Vos commissions</CardTitle>
                <CardDescription className="text-yellow-100/70">
                  En attente: <span className="text-yellow-500 font-semibold">{pendingAmount.toFixed(2)} €</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <div className="min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-yellow-500/20">
                        <TableHead className="text-yellow-100/70">Client</TableHead>
                        <TableHead className="text-yellow-100/70">Montant facture</TableHead>
                        <TableHead className="text-yellow-100/70">Commission (20%)</TableHead>
                        <TableHead className="text-yellow-100/70">Statut</TableHead>
                        <TableHead className="text-yellow-100/70">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((commission) => (
                        <TableRow key={commission.id} className="border-yellow-500/20">
                          <TableCell className="text-yellow-50">
                            {commission.invoices?.prospects?.name} - {commission.invoices?.prospects?.company}
                          </TableCell>
                          <TableCell className="text-yellow-50">{commission.invoices?.amount.toFixed(2)} €</TableCell>
                          <TableCell className="font-semibold text-yellow-500">
                            {commission.amount.toFixed(2)} €
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={commission.paid 
                                ? 'bg-yellow-500 text-emerald-950' 
                                : 'bg-emerald-800/50 text-yellow-100/70 border-yellow-500/30'
                              }
                            >
                              {commission.paid ? 'Payé' : 'En attente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-yellow-100/70">
                            {format(new Date(commission.created_at), 'dd MMM yyyy', { locale: fr })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="flex-1 overflow-auto">
            <BankInfoForm 
              affiliateId={affiliate.id} 
              initialBankInfo={affiliate.bank_info}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}