# Styles — Architecture factorisée

**Certification :** tous les styles de l'application sont dans `src/styles/`. Aucun mélange avec la logique ou les composants (pas de `style={}`, pas de CSS-in-JS).

## Structure

| Fichier / Dossier | Rôle |
|-------------------|------|
| **base.css** | Point d'entrée unique ; importe tout dans l'ordre ci-dessous |
| **theme.css** | Tokens (couleurs, ombres) |
| **layout.css** | Navbar + Footer (partagés par Home et page Dépôt) |
| **deposit.css** | Page formulaire « Dépôt un film » uniquement |
| **components.css** | Composants UI réutilisables |
| **pages/public/home/** | Page d'accueil |
| **pages/public/home/index.css** | Entrée home ; importe hero, sections, footer |
| **pages/public/home/hero.css** | Hero, vidéo, navbar flottante, CTA |
| **pages/public/home/sections.css** | Container, sections, cartes, grilles |
| **pages/public/home/footer.css** | Overrides footer sur la homepage |
| **pages/public/home/_variables.css** | Variables home (optionnel) |
| **pages/users/login-register.css** | Page login / register |

## Règles

1. **Un seul endroit par concern** : layout dans `layout.css`, home dans `pages/public/home/`, formulaire dans `deposit.css`.
2. **Pas de duplication** : navbar et footer définis une fois dans `layout.css`.
3. **Composants** : uniquement des `className` ; les styles correspondants sont dans `src/styles/`.
