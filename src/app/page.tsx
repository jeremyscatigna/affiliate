import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Users, DollarSign, BarChart, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/50 z-10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            <Image 
              src="/bcj-logo.png" 
              alt="BCJ Logo" 
              width={150} 
              height={150} 
              className="mx-auto mb-8 drop-shadow-2xl"
            />
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-50">
              Programme<br/>
              <span className="text-yellow-500 italic font-serif">D'affiliation BCJ</span>
            </h1>
            
            <p className="text-xl text-yellow-100/70 mb-10 max-w-2xl mx-auto">
              Rejoignez notre programme d'affiliation et gagnez 20% de commission 
              en partageant notre expertise en Agents IA sur mesure.
            </p>
            
            <div className="flex gap-4 justify-center items-center">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Devenir affilié
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 px-8 py-6 text-lg"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center gap-6 mt-12 text-sm">
              <span className="bg-emerald-800/50 text-yellow-100/80 px-4 py-2 rounded-full backdrop-blur">
                Co-pilote Tech à la demande
              </span>
              <span className="bg-emerald-800/50 text-yellow-100/80 px-4 py-2 rounded-full backdrop-blur">
                Ex-CTO
              </span>
              <span className="bg-emerald-800/50 text-yellow-100/80 px-4 py-2 rounded-full backdrop-blur">
                +10 ans XP
              </span>
              <span className="bg-emerald-800/50 text-yellow-100/80 px-4 py-2 rounded-full backdrop-blur">
                Brutalement honnête
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-yellow-50">
          Pourquoi rejoindre notre programme ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-yellow-50">Commission généreuse</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-100/70">
                Recevez 20% de commission sur chaque facture payée par vos clients référés.
                Aucune limite sur vos gains potentiels.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-yellow-50">Support dédié</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-100/70">
                Nous nous occupons de tout : vente, développement, support.
                Vous n'avez qu'à partager votre lien unique.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-emerald-900/50 border-yellow-500/20 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-yellow-50">Suivi en temps réel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-100/70">
                Dashboard détaillé pour suivre vos prospects, conversions et commissions
                en temps réel.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-emerald-950/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-yellow-50">
            Comment ça marche ?
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 text-emerald-950 rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-yellow-50">Inscrivez-vous</h3>
                  <p className="text-yellow-100/70">
                    Créez votre compte affilié en quelques secondes et obtenez votre lien unique.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 text-emerald-950 rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-yellow-50">Partagez</h3>
                  <p className="text-yellow-100/70">
                    Recommandez nos services IA à votre réseau en partageant votre lien d'affiliation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 text-emerald-950 rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-yellow-50">Gagnez</h3>
                  <p className="text-yellow-100/70">
                    Recevez 20% de commission sur chaque paiement effectué par vos clients référés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 backdrop-blur">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl text-yellow-50 mb-4">
              Prêt à commencer ?
            </CardTitle>
            <CardDescription className="text-xl text-yellow-100/80">
              Rejoignez notre programme d'affiliation et commencez à gagner dès aujourd'hui.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Créer mon compte affilié
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="mt-8 flex justify-center items-center gap-8 text-yellow-100/60">
              <div>
                <p className="text-2xl font-bold text-yellow-500">20%</p>
                <p className="text-sm">Commission</p>
              </div>
              <div className="w-px h-12 bg-yellow-500/30" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">∞</p>
                <p className="text-sm">Revenus</p>
              </div>
              <div className="w-px h-12 bg-yellow-500/30" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">24/7</p>
                <p className="text-sm">Dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}