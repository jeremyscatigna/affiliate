'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, DollarSign, CreditCard, Upload, FileText, Download } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BankInfoModal } from './bank-info-modal'
import { InvoiceUploadModal } from './invoice-upload-modal'

interface AdminDashboardProps {
  affiliates: any[]
  prospects: any[]
  invoices: any[]
}

export function AdminDashboard({ affiliates, prospects, invoices }: AdminDashboardProps) {
  const supabase = createClient()
  const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null)
  const [bankInfoModalOpen, setBankInfoModalOpen] = useState(false)
  const [invoiceUploadModalOpen, setInvoiceUploadModalOpen] = useState(false)

  const handleAffiliateStatusChange = async (affiliateId: string, newStatus: string) => {
    await supabase
      .from('affiliates')
      .update({ status: newStatus })
      .eq('id', affiliateId)
    
    window.location.reload()
  }

  const handleProspectStatusChange = async (prospectId: string, newStatus: string) => {
    await supabase
      .from('prospects')
      .update({ status: newStatus })
      .eq('id', prospectId)
    
    window.location.reload()
  }


  const handleMarkCommissionPaid = async (commissionId: string) => {
    await supabase
      .from('commissions')
      .update({ 
        paid: true,
        paid_at: new Date().toISOString()
      })
      .eq('id', commissionId)
    
    window.location.reload()
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  const totalCommissions = affiliates.reduce((sum, aff) => 
    sum + (aff.commissions?.reduce((s: number, c: any) => s + c.amount, 0) || 0), 0
  )

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 overflow-hidden flex flex-col">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto p-6 relative z-10 flex-1 flex flex-col max-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-yellow-50">Administration</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Affiliés actifs</CardDescription>
              <CardTitle className="text-2xl text-yellow-50">
                {affiliates.filter(a => a.status === 'approved').length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Total prospects</CardDescription>
              <CardTitle className="text-2xl text-yellow-50">{prospects.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Revenus totaux</CardDescription>
              <CardTitle className="text-2xl text-yellow-50">{totalRevenue.toFixed(2)} €</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100/70">Commissions dues</CardDescription>
              <CardTitle className="text-2xl text-yellow-500">{totalCommissions.toFixed(2)} €</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="affiliates" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mb-4 bg-emerald-900/50 border border-yellow-500/20">
            <TabsTrigger value="affiliates" className="text-yellow-100/70 data-[state=active]:bg-yellow-500 data-[state=active]:text-emerald-950">Affiliés</TabsTrigger>
            <TabsTrigger value="prospects" className="text-yellow-100/70 data-[state=active]:bg-yellow-500 data-[state=active]:text-emerald-950">Prospects</TabsTrigger>
            <TabsTrigger value="invoices" className="text-yellow-100/70 data-[state=active]:bg-yellow-500 data-[state=active]:text-emerald-950">Factures</TabsTrigger>
          </TabsList>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="flex-1 overflow-hidden">
            <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur h-full overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-yellow-50">Gestion des affiliés</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto flex-1">
                <div className="min-w-full">
                  <Table>
                  <TableHeader>
                    <TableRow className="border-yellow-500/20">
                      <TableHead className="text-yellow-100/70">Nom</TableHead>
                      <TableHead className="text-yellow-100/70">Email</TableHead>
                      <TableHead className="text-yellow-100/70">Code</TableHead>
                      <TableHead className="text-yellow-100/70">Clics</TableHead>
                      <TableHead className="text-yellow-100/70">Prospects</TableHead>
                      <TableHead className="text-yellow-100/70">Commissions</TableHead>
                      <TableHead className="text-yellow-100/70">Statut</TableHead>
                      <TableHead className="text-yellow-100/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates.map((affiliate) => {
                      const totalCommission = affiliate.commissions?.reduce((s: number, c: any) => s + c.amount, 0) || 0
                      const unpaidCommission = affiliate.commissions?.filter((c: any) => !c.paid).reduce((s: number, c: any) => s + c.amount, 0) || 0
                      
                      return (
                        <TableRow key={affiliate.id} className="border-yellow-500/20">
                          <TableCell className="text-yellow-50">{affiliate.name}</TableCell>
                          <TableCell className="text-yellow-50">{affiliate.email}</TableCell>
                          <TableCell className="text-yellow-50">{affiliate.referral_links?.[0]?.code}</TableCell>
                          <TableCell className="text-yellow-50">{affiliate.referral_links?.[0]?.clicks || 0}</TableCell>
                          <TableCell className="text-yellow-50">{affiliate.prospects?.length || 0}</TableCell>
                          <TableCell>
                            <span className="text-yellow-50">{totalCommission.toFixed(2)} €</span>
                            {unpaidCommission > 0 && (
                              <span className="text-sm text-yellow-500 block">
                                ({unpaidCommission.toFixed(2)} € à payer)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                affiliate.status === 'approved' ? 'bg-yellow-500 text-emerald-950' :
                                affiliate.status === 'suspended' ? 'bg-red-600/80 text-white' :
                                'bg-emerald-800/50 text-yellow-100/70 border-yellow-500/30'
                              }
                            >
                              {affiliate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {affiliate.status !== 'approved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                  onClick={() => handleAffiliateStatusChange(affiliate.id, 'approved')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {affiliate.status !== 'suspended' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                  onClick={() => handleAffiliateStatusChange(affiliate.id, 'suspended')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                onClick={() => {
                                  setSelectedAffiliate(affiliate)
                                  setBankInfoModalOpen(true)
                                }}
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prospects Tab */}
          <TabsContent value="prospects" className="flex-1 overflow-hidden">
            <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur h-full overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-yellow-50">Liste des prospects</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto flex-1">
                <div className="min-w-full">
                  <Table>
                  <TableHeader>
                    <TableRow className="border-yellow-500/20">
                      <TableHead className="text-yellow-100/70">Nom</TableHead>
                      <TableHead className="text-yellow-100/70">Entreprise</TableHead>
                      <TableHead className="text-yellow-100/70">Email</TableHead>
                      <TableHead className="text-yellow-100/70">Affilié</TableHead>
                      <TableHead className="text-yellow-100/70">Statut</TableHead>
                      <TableHead className="text-yellow-100/70">Date</TableHead>
                      <TableHead className="text-yellow-100/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospects.map((prospect) => (
                      <TableRow key={prospect.id} className="border-yellow-500/20">
                        <TableCell className="text-yellow-50">{prospect.name}</TableCell>
                        <TableCell className="text-yellow-50">{prospect.company}</TableCell>
                        <TableCell className="text-yellow-50">{prospect.email}</TableCell>
                        <TableCell className="text-yellow-50">{prospect.affiliates?.name || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              prospect.status === 'client' ? 'bg-yellow-500 text-emerald-950' :
                              prospect.status === 'qualified' ? 'bg-yellow-500/50 text-yellow-50' :
                              prospect.status === 'lost' ? 'bg-red-600/80 text-white' :
                              'bg-emerald-800/50 text-yellow-100/70 border-yellow-500/30'
                            }
                          >
                            {prospect.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-yellow-100/70">
                          {format(new Date(prospect.created_at), 'dd MMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <select
                            className="text-sm border border-yellow-500/30 rounded px-2 py-1 bg-emerald-950/50 text-yellow-50"
                            value={prospect.status}
                            onChange={(e) => handleProspectStatusChange(prospect.id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="client">Client</option>
                            <option value="lost">Lost</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="flex-1 overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={() => setInvoiceUploadModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold"
              >
                <Upload className="h-4 w-4 mr-2" />
                Créer une facture
              </Button>
            </div>
            
            <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur flex-1 overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-yellow-50">Factures et commissions</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto flex-1">
                <div className="min-w-full">
                  <Table>
                  <TableHeader>
                    <TableRow className="border-yellow-500/20">
                      <TableHead className="text-yellow-100/70">N° Facture</TableHead>
                      <TableHead className="text-yellow-100/70">Client</TableHead>
                      <TableHead className="text-yellow-100/70">Montant</TableHead>
                      <TableHead className="text-yellow-100/70">Commission (20%)</TableHead>
                      <TableHead className="text-yellow-100/70">Affilié</TableHead>
                      <TableHead className="text-yellow-100/70">Statut</TableHead>
                      <TableHead className="text-yellow-100/70">Fichier</TableHead>
                      <TableHead className="text-yellow-100/70">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => {
                      const commission = affiliates
                        .flatMap(a => a.commissions || [])
                        .find((c: any) => c.invoice_id === invoice.id)
                      
                      return (
                        <TableRow key={invoice.id} className="border-yellow-500/20">
                          <TableCell className="font-mono text-yellow-50">
                            {invoice.invoice_number || '-'}
                          </TableCell>
                          <TableCell className="text-yellow-50">
                            {invoice.prospects?.name} - {invoice.prospects?.company}
                          </TableCell>
                          <TableCell className="text-yellow-50">{invoice.amount.toFixed(2)} €</TableCell>
                          <TableCell className="font-semibold text-yellow-500">
                            {(invoice.amount * 0.2).toFixed(2)} €
                          </TableCell>
                          <TableCell className="text-yellow-50">
                            {affiliates.find(a => a.id === invoice.prospects?.affiliate_id)?.name || '-'}
                          </TableCell>
                          <TableCell>
                            {commission ? (
                              commission.paid ? (
                                <Badge className="bg-yellow-500 text-emerald-950">Payé</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                  onClick={() => handleMarkCommissionPaid(commission.id)}
                                >
                                  Marquer payé
                                </Button>
                              )
                            ) : <span className="text-yellow-100/70">-</span>}
                          </TableCell>
                          <TableCell>
                            {invoice.file_url ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                asChild
                                className="text-yellow-500 hover:bg-yellow-500/10"
                              >
                                <a href={invoice.file_url} target="_blank" rel="noopener noreferrer">
                                  <FileText className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-yellow-100/70">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-yellow-100/70">
                            {format(new Date(invoice.created_at), 'dd MMM yyyy', { locale: fr })}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {selectedAffiliate && (
          <BankInfoModal
            affiliate={selectedAffiliate}
            open={bankInfoModalOpen}
            onOpenChange={setBankInfoModalOpen}
          />
        )}
        
        <InvoiceUploadModal
          prospects={prospects}
          open={invoiceUploadModalOpen}
          onOpenChange={setInvoiceUploadModalOpen}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </div>
  )
}