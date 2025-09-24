'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create affiliate record
        const { error: affiliateError } = await supabase
          .from('affiliates')
          .insert({
            id: authData.user.id,
            email,
            name,
          })

        if (affiliateError) throw affiliateError

        // Generate referral code
        const code = `${name.toLowerCase().replace(/\s+/g, '')}_${Math.random().toString(36).substr(2, 6)}`
        
        const { error: linkError } = await supabase
          .from('referral_links')
          .insert({
            affiliate_id: authData.user.id,
            code,
          })

        if (linkError) throw linkError

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
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
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jean Dupont"
          required
          className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-yellow-50">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          required
          className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-yellow-50">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-emerald-950/50 border-yellow-500/30 text-yellow-50 placeholder:text-yellow-100/40"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold" 
        disabled={loading}
      >
        {loading ? 'Création...' : 'Créer mon compte'}
      </Button>
    </form>
  )
}