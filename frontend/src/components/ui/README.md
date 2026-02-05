# Composants UI - Structure organisée

## Organisation par catégories

Le dossier `ui` est organisé en sous-dossiers pour faciliter la navigation :

### 📝 `forms/` - Composants de formulaire
- `Input.jsx` - Wrapper générique pour tous les champs
- `FieldInput.jsx` - Champ texte classique
- `FieldTextArea.jsx` - Zone texte multilignes
- `Checkbox.jsx` - Case à cocher
- `RadioOption.jsx` - Option radio
- `Select.jsx` - Menu déroulant
- `UploadBox.jsx` - Zone d'upload

### 🏷️ `tags/` - Composants de tags
- `TagInput.jsx` - Saisie de tags avec autocomplétion
- `TagFilter.jsx` - Filtre de tags pour la galerie

### 🧭 `navigation/` - Composants de navigation
- `Stepper.jsx` - Indicateur d'étapes
- `LanguageSwitcher.jsx` - Sélecteur de langue

### 💬 `feedback/` - Composants de feedback/état
- `Loader.jsx` - Indicateur de chargement
- `ProgressBar.jsx` - Barre de progression
- `Modal.jsx` - Fenêtre modale

### 🎨 `display/` - Composants d'affichage
- `Card.jsx` - Carte réutilisable
- `Badge.jsx` - Badge/étiquette

### ⚡ `actions/` - Composants d'action
- `Button.jsx` - Bouton réutilisable

### 🔧 `common/` - Composants communs/utilitaire
- `Icons.jsx` - Icônes factorisées
- `ThemeToggle.jsx` - Toggle dark/light mode

## Utilisation

### Import direct
```jsx
import TagInput from '../ui/tags/TagInput';
import Button from '../ui/actions/Button';
```

### Import via index.js (recommandé)
```jsx
import { TagInput, Button, Icons } from '../ui';
```

## Avantages de cette structure

✅ **Organisation claire** : Chaque composant est dans sa catégorie logique  
✅ **Navigation facile** : Plus simple de trouver un composant  
✅ **Maintenance** : Modifications isolées par catégorie  
✅ **Scalabilité** : Facile d'ajouter de nouveaux composants
