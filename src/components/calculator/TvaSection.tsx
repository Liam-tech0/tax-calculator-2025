import { Receipt, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/taxCalculations'
import type { TvaStatus } from '@/types'

interface TvaSectionProps {
  tvaStatus: TvaStatus
  tvaCollectee: number
  tvaDeductible: number
  tvaAReverser: number
  revenue: number
}

export function TvaSection({
  tvaStatus,
  tvaCollectee,
  tvaDeductible,
  tvaAReverser,
  revenue,
}: TvaSectionProps) {
  const { isSubjectToTva, isNearThreshold, thresholdBase, thresholdMajore, percentageOfThreshold } =
    tvaStatus

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          Statut TVA
          {isSubjectToTva ? (
            <Badge variant="warning">Assujetti à la TVA</Badge>
          ) : (
            <Badge variant="success">Franchise en base</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSubjectToTva && (
          <>
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Franchise en base de TVA — Art. 293B CGI</AlertTitle>
              <AlertDescription>
                Votre CA est inférieur au seuil de {thresholdBase.toLocaleString('fr-FR')} €.
                Vous n&apos;êtes pas assujetti à la TVA : vous facturez HT et n&apos;avez pas à
                reverser de TVA.
                <br />
                Mention obligatoire sur vos factures : <em>&quot;TVA non applicable — art. 293B CGI&quot;</em>
              </AlertDescription>
            </Alert>
            {revenue > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>CA actuel : {formatCurrency(revenue)}</span>
                  <span>Seuil majoré : {formatCurrency(thresholdMajore)}</span>
                </div>
                <Progress
                  value={percentageOfThreshold}
                  className={
                    isNearThreshold ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                  }
                />
                <p className="text-xs text-muted-foreground text-right">
                  {percentageOfThreshold.toFixed(0)}% du seuil de franchise ({formatCurrency(thresholdBase)})
                </p>
              </div>
            )}
            {isNearThreshold && (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Proche du seuil TVA</AlertTitle>
                <AlertDescription>
                  Votre CA approche du seuil de {thresholdBase.toLocaleString('fr-FR')} €.
                  Si vous dépassez {thresholdMajore.toLocaleString('fr-FR')} € (seuil majoré),
                  la TVA devient exigible immédiatement.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {isSubjectToTva && (
          <>
            <Alert variant="warning">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Vous êtes assujetti à la TVA</AlertTitle>
              <AlertDescription>
                Votre CA ({formatCurrency(revenue)}) dépasse le seuil de{' '}
                {thresholdBase.toLocaleString('fr-FR')} €. Vous devez facturer la TVA et la
                reverser à l&apos;administration fiscale (déduction faite de la TVA sur vos
                achats professionnels).
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">TVA collectée</p>
                <p className="text-lg font-bold text-blue-800">{formatCurrency(tvaCollectee)}</p>
                <p className="text-xs text-blue-500">à 20%</p>
              </div>
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                <p className="text-xs text-green-600 font-medium mb-1">TVA déductible</p>
                <p className="text-lg font-bold text-green-800">{formatCurrency(tvaDeductible)}</p>
                <p className="text-xs text-green-500">sur achats</p>
              </div>
              <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-center">
                <p className="text-xs text-orange-600 font-medium mb-1">TVA à reverser</p>
                <p className="text-lg font-bold text-orange-800">{formatCurrency(tvaAReverser)}</p>
                <p className="text-xs text-orange-500">au fisc</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
