# Calculateur auto-entrepreneur 2025

Application web qui estime en temps réel ce qu'un micro-entrepreneur paie
réellement sur son chiffre d'affaires : cotisations URSSAF, contributions,
impôt sur le revenu et seuils de TVA, avec les barèmes 2025.

## Fonctionnalités

- **Choix de l'activité** (vente, prestation de services, libéral…) avec les taux correspondants
- **Saisie du chiffre d'affaires** et calcul instantané du net
- **Options** : ACRE et versement libératoire de l'impôt
- **Détail des prélèvements** : cotisations sociales, CFP, TFCC, IR forfaitaire, abattement et revenu imposable
- **TVA** : alerte selon les seuils de franchise et prise en compte des achats
- Alerte en cas de dépassement du plafond du régime

## Stack

| Rôle | Techno |
| --- | --- |
| Front | React 19, TypeScript (mode strict) |
| Build | Vite |
| Style | Tailwind CSS v4 |
| Composants | Radix UI, sur le modèle shadcn/ui |

## Lancer le projet

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # vérification TypeScript + build de production
```

## Architecture

Toute la logique de calcul est faite de fonctions pures, séparées de l'interface :

```
constants/taxRates.ts      barèmes et taux 2025
utils/taxCalculations.ts   calculs (cotisations, TVA, plafonds)
hooks/useTaxCalculator.ts  état de l'application
components/calculator/     formulaires et résultats
```

> Outil d'estimation : les montants n'ont pas de valeur officielle.
> Pour un calcul exact, se référer à l'URSSAF.

---

Réalisé par [Liam Abraham](https://github.com/Liam-tech0).
