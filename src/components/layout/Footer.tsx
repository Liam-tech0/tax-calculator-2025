export function Footer() {
  return (
    <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
      <p>
        Données basées sur les taux URSSAF 2025 &bull; À titre indicatif uniquement
      </p>
      <p className="mt-1">
        Sources :{' '}
        <span className="font-medium">urssaf.fr</span>
        {' · '}
        <span className="font-medium">autoentrepreneur.urssaf.fr</span>
        {' · '}
        <span className="font-medium">service-public.fr</span>
      </p>
    </footer>
  )
}
