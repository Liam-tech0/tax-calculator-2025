import { BarChart3, Euro, TrendingDown, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/utils/taxCalculations'
import { ACTIVITY_CONFIGS } from '@/constants/taxRates'
import type { TaxBreakdown, ActivityType } from '@/types'

interface TaxResultsProps {
  breakdown: TaxBreakdown
  revenue: number
  activityType: ActivityType
  hasVersementLiberatoire: boolean
}

interface LineItemProps {
  label: string
  sublabel?: string
  amount: number
  rate?: number
  variant?: 'default' | 'deduct' | 'highlight' | 'total'
}

function LineItem({ label, sublabel, amount, rate, variant = 'default' }: LineItemProps) {
  const isDeduct = variant === 'deduct'
  const isTotal = variant === 'total'
  const isHighlight = variant === 'highlight'

  return (
    <div
      className={`flex items-center justify-between py-2 ${
        isTotal ? 'font-semibold text-base' : 'text-sm'
      } ${isHighlight ? 'bg-primary/5 -mx-2 px-2 rounded' : ''}`}
    >
      <div>
        <span className={isDeduct ? 'text-red-600' : isTotal ? '' : 'text-foreground'}>
          {label}
        </span>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
      <div className="text-right">
        <span
          className={`font-medium tabular-nums ${
            isDeduct ? 'text-red-600' : isHighlight ? 'text-green-700' : ''
          }`}
        >
          {isDeduct ? '− ' : ''}{formatCurrency(amount)}
        </span>
        {rate !== undefined && rate > 0 && (
          <p className="text-xs text-muted-foreground">{formatPercent(rate)}</p>
        )}
      </div>
    </div>
  )
}

export function TaxResults({ breakdown, revenue, activityType, hasVersementLiberatoire }: TaxResultsProps) {
  const config = ACTIVITY_CONFIGS[activityType]

  if (revenue === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Résultats du calcul
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Euro className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Entrez votre chiffre d&apos;affaires pour voir les résultats</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalChargesPercent = (breakdown.totalCharges / revenue) * 100

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Résultats du calcul
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <LineItem
            label="Chiffre d'affaires"
            amount={revenue}
          />
          <Separator />

          <div className="pt-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Cotisations & contributions URSSAF
            </p>
          </div>

          <LineItem
            label="Cotisations sociales"
            sublabel={`Retraite, maladie, allocations familiales`}
            amount={breakdown.cotisationsSociales}
            rate={breakdown.cotisationsSocialesRate}
            variant="deduct"
          />
          <LineItem
            label="CFP — Formation professionnelle"
            amount={breakdown.cfp}
            rate={breakdown.cfpRate}
            variant="deduct"
          />
          {breakdown.tfcc > 0 && (
            <LineItem
              label="TFCC — Chambre consulaire"
              amount={breakdown.tfcc}
              rate={breakdown.tfccRate}
              variant="deduct"
            />
          )}

          <Separator />

          <LineItem
            label="Net après cotisations URSSAF"
            amount={breakdown.netRevenueBeforeTax}
            variant="highlight"
          />

          {hasVersementLiberatoire && (
            <>
              <Separator />
              <div className="pt-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Impôt sur le revenu (versement libératoire)
                </p>
              </div>
              <LineItem
                label="IR forfaitaire"
                amount={breakdown.ir}
                rate={breakdown.irRate}
                variant="deduct"
              />
              <Separator />
              <LineItem
                label="Net après IR"
                amount={breakdown.netRevenueAfterTax}
                variant="highlight"
              />
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold">Total charges ({totalChargesPercent.toFixed(1)}%)</span>
            <span className="font-bold text-red-600 tabular-nums">
              − {formatCurrency(breakdown.totalCharges)}
            </span>
          </div>
        </CardContent>
      </Card>

      {!hasVersementLiberatoire && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Impôt sur le revenu (barème progressif)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <LineItem
                label="CA brut"
                amount={revenue}
              />
              <LineItem
                label={`Abattement forfaitaire ${config.abattementFiscal}%`}
                sublabel="Déduit automatiquement pour frais professionnels"
                amount={revenue * (config.abattementFiscal / 100)}
                variant="deduct"
              />
              <Separator />
              <LineItem
                label="Revenu imposable (à déclarer)"
                amount={breakdown.revenuImposable}
                variant="highlight"
              />
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5 inline mr-1" />
              Ce montant s&apos;ajoute à vos autres revenus et est soumis au barème
              progressif de l&apos;IR (0%, 11%, 30%, 41%, 45% selon votre foyer fiscal).
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Taux de charges global</p>
              <p className="text-3xl font-bold text-primary">{totalChargesPercent.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">du CA</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Net disponible</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(hasVersementLiberatoire ? breakdown.netRevenueAfterTax : breakdown.netRevenueBeforeTax)}
              </p>
              <Badge variant="success" className="text-xs mt-1">
                {hasVersementLiberatoire ? 'après IR' : 'avant IR'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
