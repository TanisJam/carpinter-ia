import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="container mx-auto px-4 py-16 text-center space-y-12">
        {/* Hero */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Disena tu placard ideal con{" "}
            <span className="text-primary">inteligencia artificial</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Ingresa tus medidas, personaliza el interior y visualiza tu placard
            en 3D. Sin conocimientos tecnicos, en minutos.
          </p>
        </div>

        {/* CTA */}
        <div>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/configurador">Comenzar a disenar</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <div className="text-3xl">📐</div>
              <h3 className="font-semibold">Medidas exactas</h3>
              <p className="text-sm text-muted-foreground">
                Ingresa ancho, alto y profundidad con controles intuitivos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <div className="text-3xl">🧊</div>
              <h3 className="font-semibold">Vista 3D en vivo</h3>
              <p className="text-sm text-muted-foreground">
                Visualiza tu placard desde cualquier angulo mientras lo
                personalizas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <div className="text-3xl">🤖</div>
              <h3 className="font-semibold">Sugerencias con IA</h3>
              <p className="text-sm text-muted-foreground">
                Obtene layouts optimizados generados por inteligencia
                artificial.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
