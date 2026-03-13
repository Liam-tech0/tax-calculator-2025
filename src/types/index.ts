export type ActivityType =
  | 'BIC_VENTE'
  | 'BIC_SERVICES_ARTISAN'
  | 'BIC_SERVICES_COMMERCIAL'
  | 'BNC_LIBERALES_RG'
  | 'BNC_CIPAV'

export type TvaRate = 0 | 5.5 | 10 | 20

export interface Purchase {
  id: string
  description: string
  amountHT: number
  tvaRate: TvaRate
}

export interface TaxInput {
  activityType: ActivityType
  revenue: number
  hasACRE: boolean
  hasVersementLiberatoire: boolean
  purchases: Purchase[]
}

export interface TaxBreakdown {
  cotisationsSociales: number
  cotisationsSocialesRate: number
  cfp: number
  cfpRate: number
  tfcc: number
  tfccRate: number
  ir: number
  irRate: number
  totalCharges: number
  tvaCollectee: number
  tvaDeductible: number
  tvaAReverser: number
  netRevenueBeforeTax: number
  netRevenueAfterTax: number
  abattementFiscal: number
  revenuImposable: number
}

export interface TvaStatus {
  isSubjectToTva: boolean
  isNearThreshold: boolean
  thresholdBase: number
  thresholdMajore: number
  percentageOfThreshold: number
}
