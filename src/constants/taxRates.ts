import type { ActivityType } from '@/types'

export interface ActivityConfig {
  label: string
  description: string
  cotisationsSociales: number
  cotisationsSocialesACRE: number
  cfp: number
  tfcc: number
  versementLiberatoire: number
  abattementFiscal: number
  plafondCA: number
  tvaSeuil: number
  tvaSeuilMajore: number
}

export const ACTIVITY_CONFIGS: Record<ActivityType, ActivityConfig> = {
  BIC_VENTE: {
    label: 'Vente de marchandises (BIC)',
    description: 'Achat-revente, commerce, hébergement',
    cotisationsSociales: 12.3,
    cotisationsSocialesACRE: 6.15,
    cfp: 0.1,
    tfcc: 0.015,
    versementLiberatoire: 1.0,
    abattementFiscal: 71,
    plafondCA: 188700,
    tvaSeuil: 85000,
    tvaSeuilMajore: 93500,
  },
  BIC_SERVICES_ARTISAN: {
    label: 'Prestations de services artisanales (BIC)',
    description: 'Artisans, travaux, réparations',
    cotisationsSociales: 21.2,
    cotisationsSocialesACRE: 10.6,
    cfp: 0.3,
    tfcc: 0.48,
    versementLiberatoire: 1.7,
    abattementFiscal: 50,
    plafondCA: 77700,
    tvaSeuil: 37500,
    tvaSeuilMajore: 41250,
  },
  BIC_SERVICES_COMMERCIAL: {
    label: 'Prestations de services commerciales (BIC)',
    description: 'Services commerciaux, agents commerciaux',
    cotisationsSociales: 21.2,
    cotisationsSocialesACRE: 10.6,
    cfp: 0.1,
    tfcc: 0.044,
    versementLiberatoire: 1.7,
    abattementFiscal: 50,
    plafondCA: 77700,
    tvaSeuil: 37500,
    tvaSeuilMajore: 41250,
  },
  BNC_LIBERALES_RG: {
    label: 'Activités libérales — Régime général (BNC)',
    description: 'Consultants, formateurs, traducteurs, graphistes…',
    cotisationsSociales: 24.6,
    cotisationsSocialesACRE: 12.3,
    cfp: 0.1,
    tfcc: 0,
    versementLiberatoire: 2.2,
    abattementFiscal: 34,
    plafondCA: 77700,
    tvaSeuil: 37500,
    tvaSeuilMajore: 41250,
  },
  BNC_CIPAV: {
    label: 'Activités libérales réglementées — CIPAV (BNC)',
    description: 'Architectes, experts-comptables, kinésithérapeutes…',
    cotisationsSociales: 23.2,
    cotisationsSocialesACRE: 11.6,
    cfp: 0.2,
    tfcc: 0,
    versementLiberatoire: 2.2,
    abattementFiscal: 34,
    plafondCA: 77700,
    tvaSeuil: 37500,
    tvaSeuilMajore: 41250,
  },
}

export const TVA_RATES = [0, 5.5, 10, 20] as const

export const TVA_RATE_LABELS: Record<number, string> = {
  0: '0% (exonéré)',
  5.5: '5,5% (taux réduit)',
  10: '10% (taux intermédiaire)',
  20: '20% (taux normal)',
}

export const URSSAF_PAYMENT_PERIODS = ['Mensuel', 'Trimestriel'] as const
