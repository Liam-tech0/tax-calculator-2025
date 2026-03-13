import { useState } from 'react'
import { ShoppingCart, Plus, Trash2, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TVA_RATES, TVA_RATE_LABELS } from '@/constants/taxRates'
import { formatCurrency } from '@/utils/taxCalculations'
import type { Purchase, TvaRate } from '@/types'

interface PurchasesSectionProps {
  purchases: Purchase[]
  isSubjectToTva: boolean
  onAdd: (description: string, amountHT: number, tvaRate: TvaRate) => void
  onRemove: (id: string) => void
}

interface FormState {
  description: string
  amountHT: string
  tvaRate: TvaRate
}

const INITIAL_FORM: FormState = {
  description: '',
  amountHT: '',
  tvaRate: 20,
}

export function PurchasesSection({ purchases, isSubjectToTva, onAdd, onRemove }: PurchasesSectionProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [showForm, setShowForm] = useState(false)

  const totalHT = purchases.reduce((sum, p) => sum + p.amountHT, 0)
  const totalTva = purchases.reduce((sum, p) => sum + p.amountHT * (p.tvaRate / 100), 0)
  const totalTTC = totalHT + totalTva

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amountHT.replace(',', '.'))
    if (!form.description.trim() || isNaN(amount) || amount <= 0) return
    onAdd(form.description.trim(), amount, form.tvaRate)
    setForm(INITIAL_FORM)
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            Achats professionnels
            {purchases.length > 0 && (
              <Badge variant="secondary">{purchases.length}</Badge>
            )}
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSubjectToTva && (
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              En franchise de TVA, vous ne pouvez pas récupérer la TVA sur vos achats.
              Cette section sert uniquement à suivre vos dépenses professionnelles.
            </AlertDescription>
          </Alert>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <h4 className="text-sm font-medium">Nouvel achat</h4>
            <div className="space-y-2">
              <Label htmlFor="purchase-desc">Description</Label>
              <Input
                id="purchase-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="ex : Ordinateur portable"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="purchase-amount">Montant HT (€)</Label>
                <Input
                  id="purchase-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amountHT}
                  onChange={(e) => setForm({ ...form, amountHT: e.target.value })}
                  placeholder="ex : 800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase-tva">Taux TVA</Label>
                <Select
                  value={String(form.tvaRate)}
                  onValueChange={(v) => setForm({ ...form, tvaRate: Number(v) as TvaRate })}
                >
                  <SelectTrigger id="purchase-tva">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TVA_RATES.map((rate) => (
                      <SelectItem key={rate} value={String(rate)}>
                        {TVA_RATE_LABELS[rate]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Ajouter
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => { setShowForm(false); setForm(INITIAL_FORM) }}
              >
                Annuler
              </Button>
            </div>
          </form>
        )}

        {purchases.length === 0 && !showForm && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Aucun achat enregistré</p>
            <p className="text-xs mt-1">Ajoutez vos achats professionnels pour calculer la TVA déductible</p>
          </div>
        )}

        {purchases.length > 0 && (
          <>
            <div className="space-y-2">
              {purchases.map((purchase) => {
                const tvaMontant = purchase.amountHT * (purchase.tvaRate / 100)
                const ttc = purchase.amountHT + tvaMontant
                return (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{purchase.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(purchase.amountHT)} HT
                        {purchase.tvaRate > 0 && (
                          <>
                            {' '}+ {formatCurrency(tvaMontant)} TVA ({purchase.tvaRate}%)
                            {' = '}{formatCurrency(ttc)} TTC
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="outline" className="text-xs">
                        TVA {purchase.tvaRate}%
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onRemove(purchase.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total HT</p>
                <p className="font-semibold">{formatCurrency(totalHT)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total TVA</p>
                <p className="font-semibold text-green-700">{formatCurrency(totalTva)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total TTC</p>
                <p className="font-semibold">{formatCurrency(totalTTC)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
