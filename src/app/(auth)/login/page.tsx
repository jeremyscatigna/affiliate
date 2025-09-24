import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md relative z-10 bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <Image 
            src="/bcj-logo.png" 
            alt="BCJ Logo" 
            width={80} 
            height={80} 
            className="mx-auto drop-shadow-xl"
          />
          <div>
            <CardTitle className="text-2xl text-yellow-50">Connexion affilié</CardTitle>
            <CardDescription className="text-yellow-100/70 mt-2">
              Connectez-vous pour accéder à votre tableau de bord
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="text-center text-sm text-yellow-100/60">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-yellow-500 hover:text-yellow-400 hover:underline">
            Créer un compte
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}