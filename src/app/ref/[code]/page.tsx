'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ReferralPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  
  const supabase = createClient()

  useEffect(() => {
    // Track click
    const trackClick = async () => {
      try {
        await supabase.rpc('increment_clicks', { referral_code: code })
      } catch (err) {
        console.error('Error tracking click:', err)
      }
    }
    
    trackClick()
  }, [code, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Get affiliate ID from code
      const { data: linkData, error: linkError } = await supabase
        .from('referral_links')
        .select('affiliate_id')
        .eq('code', code)
        .single()

      if (linkError || !linkData) {
        throw new Error('Lien de parrainage invalide')
      }

      // Create prospect
      const { error: prospectError } = await supabase
        .from('prospects')
        .insert({
          affiliate_id: linkData.affiliate_id,
          ...formData
        })

      if (prospectError) throw prospectError

      // Redirect to WhatsApp
      const whatsappNumber = '+33745142792' // Replace with your number
      const message = encodeURIComponent(
        `Bonjour, je suis ${formData.name} de ${formData.company}.\n` +
        `J'aimerais discuter de vos solutions IA.\n` +
        `Mon email : ${formData.email}`
      )
      
      window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-4">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-lg relative z-10 bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <Image 
            src="/bcj-logo.png" 
            alt="BCJ Logo" 
            width={100} 
            height={100} 
            className="mx-auto drop-shadow-xl"
          />
          <div>
            <CardTitle className="text-3xl font-bold text-yellow-50">Solutions IA sur mesure</CardTitle>
            <CardDescription className="text-lg mt-2 text-yellow-100/70">
              Transformez votre business avec des agents IA personnalisés
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-yellow-50">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Jean Dupont"
                className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-yellow-50">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="jean@entreprise.com"
                className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-yellow-50">Entreprise</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                placeholder="Nom de votre entreprise"
                className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-yellow-50">Message (optionnel)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez brièvement vos besoins..."
                rows={3}
                className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold" 
              size="lg" 
              disabled={loading}
            >
              {loading ? 'Envoi...' : 'Discuter sur WhatsApp'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}