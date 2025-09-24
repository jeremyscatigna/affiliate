'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'

interface BankInfoModalProps {
  affiliate: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BankInfoModal({ affiliate, open, onOpenChange }: BankInfoModalProps) {
  const bankInfo = affiliate.bank_info

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-emerald-900 border-yellow-500/20">
        <DialogHeader>
          <DialogTitle className="text-yellow-50">Informations bancaires - {affiliate.name}</DialogTitle>
        </DialogHeader>
        
        {bankInfo ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-yellow-100/70">Titulaire</p>
              <p className="font-medium text-yellow-50">{bankInfo.accountHolder}</p>
            </div>
            
            <div>
              <p className="text-sm text-yellow-100/70">IBAN</p>
              <p className="font-medium font-mono text-yellow-50">{bankInfo.iban}</p>
            </div>
            
            <div>
              <p className="text-sm text-yellow-100/70">BIC/SWIFT</p>
              <p className="font-medium text-yellow-50">{bankInfo.bic}</p>
            </div>
            
            <div>
              <p className="text-sm text-yellow-100/70">Banque</p>
              <p className="font-medium text-yellow-50">{bankInfo.bankName}</p>
            </div>

            <div className="pt-4 border-t border-yellow-500/20">
              <p className="text-sm text-yellow-100/70">Commissions à payer</p>
              <p className="font-semibold text-lg text-yellow-500">
                {affiliate.commissions
                  ?.filter((c: any) => !c.paid)
                  .reduce((s: number, c: any) => s + c.amount, 0)
                  .toFixed(2)} €
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-yellow-100/70">
            <CreditCard className="h-12 w-12 mx-auto mb-2 text-yellow-500/30" />
            <p>Aucune information bancaire renseignée</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}