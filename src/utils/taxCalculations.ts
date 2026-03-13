import { ACTIVITY_CONFIGS } from '@/constants/taxRates'
import type { TaxInput, TaxBreakdown, TvaStatus } from '@/types'

export function calculateTaxes(input: TaxInput): TaxBreakdown {
  const { activityType, revenue, hasACRE, hasVersementLiberatoire, purchases } = input
  const config = ACTIVITY_CONFIGS[activityType]

  const cotisationsRate = hasACRE
    ? config.cotisationsSocialesACRE
    : config.cotisationsSociales

  const cotisationsSociales = round2(revenue * (cotisationsRate / 100))
  const cfp = round2(revenue * (config.cfp / 100))
  const tfcc = revenue >= 5000 ? round2(revenue * (config.tfcc / 100)) : 0

  let ir = 0
  let irRate = 0
  if (hasVersementLiberatoire) {
    irRate = config.versementLiberatoire
    ir = round2(revenue * (irRate / 100))
  }

  const totalCharges = cotisationsSociales + cfp + tfcc + ir

  const abattementFiscal = config.abattementFiscal
  const revenuImposable = round2(revenue * (1 - abattementFiscal / 100))

  const tvaStatus = getTvaStatus(revenue, activityType)
  let tvaCollectee = 0
  let tvaDeductible = 0

  if (tvaStatus.isSubjectToTva) {
    tvaCollectee = round2(revenue * 0.2)
    tvaDeductible = purchases.reduce((sum, p) => {
      return sum + round2(p.amountHT * (p.tvaRate / 100))
    }, 0)
  }

  const tvaAReverser = Math.max(0, round2(tvaCollectee - tvaDeductible))

  const netRevenueBeforeTax = round2(revenue - cotisationsSociales - cfp - tfcc)
  const netRevenueAfterTax = round2(netRevenueBeforeTax - ir - tvaAReverser)

  return {
    cotisationsSociales,
    cotisationsSocialesRate: cotisationsRate,
    cfp,
    cfpRate: config.cfp,
    tfcc,
    tfccRate: config.tfcc,
    ir,
    irRate,
    totalCharges,
    tvaCollectee,
    tvaDeductible,
    tvaAReverser,
    netRevenueBeforeTax,
    netRevenueAfterTax,
    abattementFiscal,
    revenuImposable,
  }
}

export function getTvaStatus(revenue: number, activityType: string): TvaStatus {
  const config = ACTIVITY_CONFIGS[activityType as keyof typeof ACTIVITY_CONFIGS]
  const isSubjectToTva = revenue > config.tvaSeuil
  const isNearThreshold = !isSubjectToTva && revenue > config.tvaSeuil * 0.85
  const percentageOfThreshold = Math.min(100, round2((revenue / config.tvaSeuil) * 100))

  return {
    isSubjectToTva,
    isNearThreshold,
    thresholdBase: config.tvaSeuil,
    thresholdMajore: config.tvaSeuilMajore,
    percentageOfThreshold,
  }
}

export function isAbovePlafond(revenue: number, activityType: string): boolean {
  const config = ACTIVITY_CONFIGS[activityType as keyof typeof ACTIVITY_CONFIGS]
  return revenue > config.plafondCA
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
