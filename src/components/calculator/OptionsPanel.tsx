import { Settings, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ACTIVITY_CONFIGS } from '@/constants/taxRates'
import type { ActivityType } from '@/types'

interface OptionsPanelProps {
  activityType: ActivityType
  hasACRE: boolean
  onACREChange: (value: boolean) => void
  hasVersementLiberatoire: boolean
  onVersementLiberatoireChange: (value: boolean) => void
}

export function OptionsPanel({
  activityType,
  hasACRE,
  onACREChange,
  hasVersementLiberatoire,
  onVersementLiberatoireChange,
}: OptionsPanelProps) {
  const config = ACTIVITY_CONFIGS[activityType]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          Options fiscales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="acre" className="text-sm font-medium cursor-pointer">
                ACRE — Aide à la création
              </Label>
              <p className="text-xs text-muted-foreground max-w-xs">
                50% de réduction sur les cotisations sociales pendant la 1ère année.
                Réservée aux créateurs éligibles (demandeur d&apos;emploi, RSA, jeune…)
              </p>
            </div>
            <Switch id="acre" checked={hasACRE} onCheckedChange={onACREChange} />
          </div>
          {hasACRE && (
            <div className="ml-0 rounded-md bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-800 space-y-1">
                <p>
                  Taux réduit appliqué :{' '}
                  <Badge variant="info" className="text-xs">
                    {config.cotisationsSocialesACRE}%
                  </Badge>{' '}
                  au lieu de {config.cotisationsSociales}%
                </p>
                <p>Valable pour les 12 premiers mois d&apos;activité.</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="vl" className="text-sm font-medium cursor-pointer">
                Versement libératoire de l&apos;IR
              </Label>
              <p className="text-xs text-muted-foreground max-w-xs">
                Payer l&apos;impôt sur le revenu en même temps que les cotisations, à un taux
                forfaitaire de {config.versementLiberatoire}%. Condition : RFR N-2 ≤ 28 797 €/part.
              </p>
            </div>
            <Switch
              id="vl"
              checked={hasVersementLiberatoire}
              onCheckedChange={onVersementLiberatoireChange}
            />
          </div>
          {hasVersementLiberatoire && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <div className="text-xs text-green-800 space-y-1">
                <p>
                  Taux IR forfaitaire appliqué :{' '}
                  <Badge variant="success" className="text-xs">
                    {config.versementLiberatoire}% du CA
                  </Badge>
                </p>
                <p>
                  L&apos;impôt est collecté par l&apos;URSSAF en même temps que vos cotisations
                  sociales.
                </p>
              </div>
            </div>
          )}
          {!hasVersementLiberatoire && (
            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              Sans versement libératoire, votre CA (après abattement de{' '}
              <strong>{config.abattementFiscal}%</strong>) s&apos;ajoute à vos revenus et est
              soumis au barème progressif de l&apos;IR.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
