import { useState, useMemo } from 'react'
import { calculateTaxes, getTvaStatus, isAbovePlafond } from '@/utils/taxCalculations'
import type { ActivityType, Purchase, TaxInput, TvaRate } from '@/types'

const DEFAULT_ACTIVITY: ActivityType = 'BNC_LIBERALES_RG'

export function useTaxCalculator() {
  const [activityType, setActivityType] = useState<ActivityType>(DEFAULT_ACTIVITY)
  const [revenue, setRevenue] = useState<number>(0)
  const [hasACRE, setHasACRE] = useState(false)
  const [hasVersementLiberatoire, setHasVersementLiberatoire] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>([])

  const input: TaxInput = {
    activityType,
    revenue,
    hasACRE,
    hasVersementLiberatoire,
    purchases,
  }

  const taxBreakdown = useMemo(() => calculateTaxes(input), [
    activityType,
    revenue,
    hasACRE,
    hasVersementLiberatoire,
    purchases,
  ])

  const tvaStatus = useMemo(
    () => getTvaStatus(revenue, activityType),
    [revenue, activityType]
  )

  const abovePlafond = useMemo(
    () => isAbovePlafond(revenue, activityType),
    [revenue, activityType]
  )

  function addPurchase(description: string, amountHT: number, tvaRate: TvaRate) {
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      description,
      amountHT,
      tvaRate,
    }
    setPurchases((prev) => [...prev, newPurchase])
  }

  function removePurchase(id: string) {
    setPurchases((prev) => prev.filter((p) => p.id !== id))
  }

  function updatePurchase(id: string, updates: Partial<Omit<Purchase, 'id'>>) {
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  return {
    activityType,
    setActivityType,
    revenue,
    setRevenue,
    hasACRE,
    setHasACRE,
    hasVersementLiberatoire,
    setHasVersementLiberatoire,
    purchases,
    addPurchase,
    removePurchase,
    updatePurchase,
    taxBreakdown,
    tvaStatus,
    abovePlafond,
  }
}
