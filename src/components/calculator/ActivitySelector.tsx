import { Info } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ACTIVITY_CONFIGS } from '@/constants/taxRates'
import type { ActivityType } from '@/types'

interface ActivitySelectorProps {
  value: ActivityType
  onChange: (value: ActivityType) => void
}

const ACTIVITY_TYPE_CATEGORY: Record<ActivityType, string> = {
  BIC_VENTE: 'BIC',
  BIC_SERVICES_ARTISAN: 'BIC',
  BIC_SERVICES_COMMERCIAL: 'BIC',
  BNC_LIBERALES_RG: 'BNC',
  BNC_CIPAV: 'BNC',
}

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  const config = ACTIVITY_CONFIGS[value]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Type d&apos;activité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="activity-type">Catégorie fiscale</Label>
          <Select value={value} onValueChange={(v) => onChange(v as ActivityType)}>
            <SelectTrigger id="activity-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ACTIVITY_CONFIGS) as [ActivityType, typeof ACTIVITY_CONFIGS[ActivityType]][]).map(
                ([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    {cfg.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {config && (
          <div className="rounded-md bg-muted/50 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={ACTIVITY_TYPE_CATEGORY[value] === 'BIC' ? 'info' : 'secondary'}>
                {ACTIVITY_TYPE_CATEGORY[value]}
              </Badge>
              <span className="text-sm text-muted-foreground">{config.description}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cotisations : </span>
                <span className="font-semibold">{config.cotisationsSociales}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Plafond CA : </span>
                <span className="font-semibold">
                  {config.plafondCA.toLocaleString('fr-FR')} €
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Abattement fiscal : </span>
                <span className="font-semibold">{config.abattementFiscal}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Seuil TVA : </span>
                <span className="font-semibold">
                  {config.tvaSeuil.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
