'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, Calculator } from 'lucide-react'

interface InvoiceUploadModalProps {
  prospects: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InvoiceUploadModal({ prospects, open, onOpenChange, onSuccess }: InvoiceUploadModalProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    prospectId: '',
    amount: '',
    invoiceNumber: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Get prospect and affiliate info
      const prospect = prospects.find(p => p.id === formData.prospectId)
      if (!prospect || !prospect.affiliate_id) {
        throw new Error('Prospect invalide ou pas d\'affilié associé')
      }

      let fileUrl = null
      let fileName = null

      // Upload file to Supabase Storage if provided
      if (file) {
        const fileExt = file.name.split('.').pop()
        const uploadFileName = `${Date.now()}-${formData.invoiceNumber}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(uploadFileName, file)

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('invoices')
          .getPublicUrl(uploadFileName)
          
        fileUrl = publicUrl
        fileName = file.name
      }

      // Create invoice
      const { data: invoice, error: invoiceError } = await (supabase as any)
        .from('invoices')
        .insert({
          prospect_id: formData.prospectId,
          amount: parseFloat(formData.amount),
          invoice_number: formData.invoiceNumber,
          file_url: fileUrl,
          file_name: fileName,
          paid_at: new Date().toISOString()
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Create commission (20%)
      const commissionAmount = parseFloat(formData.amount) * 0.2
      const { error: commissionError } = await (supabase as any)
        .from('commissions')
        .insert({
          affiliate_id: prospect.affiliate_id,
          invoice_id: invoice.id,
          amount: commissionAmount
        })

      if (commissionError) throw commissionError

      // Update prospect to client
      await (supabase as any)
        .from('prospects')
        .update({ status: 'client' })
        .eq('id', formData.prospectId)

      onSuccess()
      onOpenChange(false)
      
      // Reset form
      setFormData({ prospectId: '', amount: '', invoiceNumber: '' })
      setFile(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedProspect = prospects.find(p => p.id === formData.prospectId)
  const commissionAmount = formData.amount ? (parseFloat(formData.amount) * 0.2).toFixed(2) : '0.00'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-emerald-900 border-yellow-500/20">
        <DialogHeader>
          <DialogTitle className="text-yellow-50">Créer une facture</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="prospect" className="text-yellow-50">Prospect</Label>
            <select
              id="prospect"
              className="w-full px-3 py-2 border border-yellow-500/30 rounded-md bg-emerald-950/50 text-yellow-50"
              value={formData.prospectId}
              onChange={(e) => setFormData({ ...formData, prospectId: e.target.value })}
              required
            >
              <option value="">Sélectionner un prospect</option>
              {prospects
                .filter(p => p.status !== 'client' && p.status !== 'lost')
                .map(prospect => (
                  <option key={prospect.id} value={prospect.id}>
                    {prospect.name} - {prospect.company} 
                    {prospect.affiliates?.name && ` (Affilié: ${prospect.affiliates.name})`}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="text-yellow-50">Numéro de facture</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              placeholder="FAC-2024-001"
              required
              className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-yellow-50">Montant HT (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="1000.00"
              required
              className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-yellow-50">Fichier facture (optionnel)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="flex-1 bg-emerald-950/50 border-yellow-500/30 text-yellow-50 file:text-yellow-50"
              />
              {file && (
                <FileText className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <p className="text-xs text-yellow-100/70">PDF, PNG ou JPG</p>
          </div>

          {selectedProspect && formData.amount && (
            <div className="p-4 bg-emerald-950/50 border border-yellow-500/30 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm text-yellow-50">
                <Calculator className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Calcul commission</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-yellow-100/70">Affilié: {selectedProspect.affiliates?.name || 'Aucun'}</p>
                <p className="text-yellow-100/70">Montant facture: {formData.amount} €</p>
                <p className="font-semibold text-yellow-500">
                  Commission (20%): {commissionAmount} €
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold"
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Création...' : 'Créer la facture'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}