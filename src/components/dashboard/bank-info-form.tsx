'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save } from 'lucide-react'

interface BankInfoFormProps {
  affiliateId: string
  initialBankInfo: any
}

export function BankInfoForm({ affiliateId, initialBankInfo }: BankInfoFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [bankInfo, setBankInfo] = useState({
    accountHolder: initialBankInfo?.accountHolder || '',
    iban: initialBankInfo?.iban || '',
    bic: initialBankInfo?.bic || '',
    bankName: initialBankInfo?.bankName || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const { error } = await (supabase as any)
        .from('affiliates')
        .update({ bank_info: bankInfo })
        .eq('id', affiliateId)

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('Error saving bank info:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-yellow-50">Informations bancaires</CardTitle>
        <CardDescription className="text-yellow-100/70">
          Ces informations sont nécessaires pour recevoir vos commissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {saved && (
            <Alert className="bg-yellow-500/20 border-yellow-500/50">
              <AlertDescription className="text-yellow-50">
                Informations bancaires sauvegardées avec succès
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="accountHolder" className="text-yellow-50">Titulaire du compte</Label>
            <Input
              id="accountHolder"
              value={bankInfo.accountHolder}
              onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
              placeholder="Nom complet du titulaire"
              required
              className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban" className="text-yellow-50">IBAN</Label>
            <Input
              id="iban"
              value={bankInfo.iban}
              onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
              placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
              required
              className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bic" className="text-yellow-50">BIC/SWIFT</Label>
            <Input
              id="bic"
              value={bankInfo.bic}
              onChange={(e) => setBankInfo({ ...bankInfo, bic: e.target.value })}
              placeholder="XXXXXXXX"
              required
              className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-yellow-50">Nom de la banque</Label>
            <Input
              id="bankName"
              value={bankInfo.bankName}
              onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
              placeholder="Ex: BNP Paribas"
              required
              className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}