import { useTaxCalculator } from '@/hooks/useTaxCalculator'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ActivitySelector } from '@/components/calculator/ActivitySelector'
import { RevenueInput } from '@/components/calculator/RevenueInput'
import { OptionsPanel } from '@/components/calculator/OptionsPanel'
import { PurchasesSection } from '@/components/calculator/PurchasesSection'
import { TvaSection } from '@/components/calculator/TvaSection'
import { TaxResults } from '@/components/calculator/TaxResults'

export function App() {
  const {
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
    taxBreakdown,
    tvaStatus,
    abovePlafond,
  } = useTaxCalculator()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Calculateur de taxes Auto-Entrepreneur
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estimez vos cotisations sociales, contributions et impôts en France en 2025.
            Renseignez votre chiffre d&apos;affaires et vos achats professionnels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ActivitySelector value={activityType} onChange={setActivityType} />
            <RevenueInput
              revenue={revenue}
              activityType={activityType}
              onChange={setRevenue}
              abovePlafond={abovePlafond}
            />
            <OptionsPanel
              activityType={activityType}
              hasACRE={hasACRE}
              onACREChange={setHasACRE}
              hasVersementLiberatoire={hasVersementLiberatoire}
              onVersementLiberatoireChange={setHasVersementLiberatoire}
            />
          </div>

          <div className="space-y-6">
            <TaxResults
              breakdown={taxBreakdown}
              revenue={revenue}
              activityType={activityType}
              hasVersementLiberatoire={hasVersementLiberatoire}
            />
            <TvaSection
              tvaStatus={tvaStatus}
              tvaCollectee={taxBreakdown.tvaCollectee}
              tvaDeductible={taxBreakdown.tvaDeductible}
              tvaAReverser={taxBreakdown.tvaAReverser}
              revenue={revenue}
            />
            <PurchasesSection
              purchases={purchases}
              isSubjectToTva={tvaStatus.isSubjectToTva}
              onAdd={addPurchase}
              onRemove={removePurchase}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
