import { TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ACTIVITY_CONFIGS } from '@/constants/taxRates'
import type { ActivityType } from '@/types'

interface RevenueInputProps {
  revenue: number
  activityType: ActivityType
  onChange: (value: number) => void
  abovePlafond: boolean
}

export function RevenueInput({ revenue, activityType, onChange, abovePlafond }: RevenueInputProps) {
  const config = ACTIVITY_CONFIGS[activityType]
  const percentOfPlafond = Math.min(100, (revenue / config.plafondCA) * 100)
  const isNearPlafond = !abovePlafond && percentOfPlafond >= 85

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\s/g, '').replace(',', '.')
    const parsed = parseFloat(raw)
    onChange(isNaN(parsed) ? 0 : parsed)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Chiffre d&apos;affaires annuel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="revenue">Montant (€ HT)</Label>
          <div className="relative">
            <Input
              id="revenue"
              type="number"
              min="0"
              step="100"
              value={revenue || ''}
              onChange={handleChange}
              placeholder="ex : 45 000"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              €
            </span>
          </div>
        </div>

        {revenue > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 €</span>
              <span>
                Plafond : {config.plafondCA.toLocaleString('fr-FR')} €
              </span>
            </div>
            <Progress
              value={percentOfPlafond}
              className={
                abovePlafond
                  ? '[&>div]:bg-destructive'
                  : isNearPlafond
                  ? '[&>div]:bg-yellow-500'
                  : '[&>div]:bg-primary'
              }
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentOfPlafond.toFixed(0)}% du plafond
            </p>
          </div>
        )}

        {abovePlafond && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Plafond dépassé</AlertTitle>
            <AlertDescription>
              Votre CA de {revenue.toLocaleString('fr-FR')} € dépasse le plafond de{' '}
              {config.plafondCA.toLocaleString('fr-FR')} €. Si cela se produit deux années
              consécutives, vous perdez le régime micro-entreprise.
            </AlertDescription>
          </Alert>
        )}

        {isNearPlafond && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attention au plafond</AlertTitle>
            <AlertDescription>
              Vous approchez du plafond ({config.plafondCA.toLocaleString('fr-FR')} €).
              Il vous reste {(config.plafondCA - revenue).toLocaleString('fr-FR')} € de marge.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
