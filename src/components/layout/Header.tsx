import { Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AutoEntrepreneur Tax</h1>
            <p className="text-xs text-muted-foreground">Calculateur de charges et taxes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">Taux 2025</Badge>
          <Badge variant="secondary">France</Badge>
        </div>
      </div>
    </header>
  )
}
