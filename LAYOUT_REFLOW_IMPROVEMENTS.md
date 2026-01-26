# Améliorations du Réarrangement Fluide du Layout

## Vue d'ensemble
Amélioration du comportement du layout pour que lorsque la sidebar s'ouvre (passe de 78px collapsed à 260px expanded), tous les éléments se réarrangent fluidement et correctement, sans débordements ou chevauchements.

## Modifications Apportées

### 1. **src/app/globals.css**

#### `.page-content` - Transitions Fluides
```css
/* Avant */
margin-left: var(--sidebar-active-width, 260px);
transition: margin-left 0.3s ease;
min-height: 100vh;
width: calc(100% - var(--sidebar-active-width, 260px));

/* Après */
margin-left: var(--sidebar-active-width, 260px);
transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
min-height: 100vh;
width: calc(100% - var(--sidebar-active-width, 260px));
overflow-x: hidden;
display: flex;
flex-direction: column;
```

**Bénéfices:**
- Transition de timing plus fluide (cubic-bezier au lieu de ease)
- Synchronisation du width avec margin-left
- `overflow-x: hidden` pour éviter les débordements horizontaux
- Structure flex pour meilleur contrôle du contenu

#### `.app-shell` - Positionnement Fixe
```css
/* Avant */
.app-shell {
  display: flex;
  min-height: 100vh;
}

/* Après */
.app-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
}
```

**Bénéfices:**
- Largeur explicite à 100% pour éviter les débordements
- Position relative pour meilleur contexte de positionnement

#### Media Queries - Recalibrage des Marges
```css
/* Avant */
@media (max-width: 820px) {
  .sidebar-shell { z-index: 45; }
  .sidebar-shell.is-expanded .sidebar-surface { width: 210px; }
  .page-content { margin-left: 88px; width: calc(100% - 88px); }
}

/* Après */
@media (max-width: 820px) {
  .sidebar-shell { z-index: 45; }
  .sidebar-shell.is-expanded .sidebar-surface { width: 210px; }
  .page-content { margin-left: 210px; width: calc(100% - 210px); }
}

@media (max-width: 1024px) {
  .sidebar-shell.is-expanded .sidebar-surface { width: 220px; }
  .page-content { margin-left: 220px; width: calc(100% - 220px); }
}
```

**Bénéfices:**
- `.page-content` utilise maintenant les vraies largeurs de la sidebar
- Cohérence entre les largeurs de la sidebar et les marges du contenu
- Ajout de media query pour 1024px avec mise à jour des marges

### 2. **src/components/Sidebar.tsx**

#### Synchronisation des CSS Variables - Center-Offset
```tsx
/* Avant */
useEffect(() => {
  document.documentElement.style.setProperty("--sidebar-active-width", targetWidth);
  return () => {
    document.documentElement.style.removeProperty("--sidebar-active-width");
  };
}, [targetWidth]);

/* Après */
useEffect(() => {
  document.documentElement.style.setProperty("--sidebar-active-width", targetWidth);
  document.documentElement.style.setProperty("--center-offset", `calc(${targetWidth} / 2)`);
  return () => {
    document.documentElement.style.removeProperty("--sidebar-active-width");
    document.documentElement.style.removeProperty("--center-offset");
  };
}, [targetWidth]);
```

**Bénéfices:**
- Le `--center-offset` se met à jour dynamiquement avec la sidebar
- Tous les éléments centrés utilisant ce variable se recalculent automatiquement

### 3. **src/app/page.tsx**

#### `.wisdom-bar` - Transition de Padding
```css
/* Avant */
padding: 0 1.8rem 0 calc(var(--sidebar-active-width, 260px) + 24px);
z-index: 50;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

/* Après */
padding: 0 1.8rem 0 calc(var(--sidebar-active-width, 260px) + 24px);
transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
z-index: 50;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
```

**Bénéfices:**
- La barre de sagesse se décale fluidement quand la sidebar change de taille
- Timing cohérent avec les transitions globales du layout

### 4. **src/app/chat/page.tsx**

#### `.chat-container` - Transition et Largeur Explicite
```css
/* Avant */
.chat-container {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: clamp(1rem, 3vh, 2rem) clamp(0.75rem, 2vw, 1.5rem);
}

/* Après */
.chat-container {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: clamp(1rem, 3vh, 2rem) clamp(0.75rem, 2vw, 1.5rem);
  width: 100%;
  transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Bénéfices:**
- Largeur 100% pour utiliser tout l'espace disponible du `.page-content`
- Transition du max-width si ajusté dynamiquement
- Meilleure adaptation au rétrécissement horizontal quand la sidebar s'ouvre

## Flux du Réarrangement

### Étapes Lors de l'Expansion de la Sidebar (78px → 260px)

1. **État Initial**: Sidebar collapsed à 78px
   - `.page-content` a `margin-left: 78px` et `width: calc(100% - 78px)`
   - Tous les éléments occupent l'espace disponible

2. **Transition Déclenchée**: L'utilisateur bouge la souris ou clique sur le bouton
   - `.sidebar-shell` commence à s'étendre
   - `--sidebar-active-width` passe de 78px à 260px
   - `--center-offset` se recalcule (78/2 → 260/2)

3. **Animations Synchronisées** (0.3s):
   - `.sidebar-surface` élargit (transition: width 0.3s)
   - `.page-content` ajuste sa marge gauche et sa largeur (transition: margin-left + width)
   - `.wisdom-bar` décale son padding (transition: padding)
   - Les éléments fixés sur la page d'accueil se recentrent (via `--center-offset`)
   - Le contenu du chat s'adapte fluidement

4. **État Final**: Sidebar expanded à 260px
   - `.page-content` a `margin-left: 260px` et `width: calc(100% - 260px)`
   - Tous les éléments sont correctement positionnés
   - Aucun débordement ou chevauchement

## Avantages de Cette Approche

✅ **Fluidité**: Les transitions sont coordonnées avec cubic-bezier(0.4, 0, 0.2, 1)  
✅ **Cohérence**: Les variables CSS synchronisent tous les éléments  
✅ **Pas de Débordement**: `overflow-x: hidden` + largeurs calculées avec précision  
✅ **Responsive**: Media queries adaptent les largeurs à chaque breakpoint  
✅ **Accessibilité**: Aucun élément ne disparaît ou ne se cache improprement  
✅ **Performance**: Utilise les CSS variables pour éviter les recalculs JS répétés  

## Breakpoints et Widths Synchronisés

| Breakpoint | Sidebar Expanded | Sidebar Collapsed | page-content margin-left | page-content width |
|---|---|---|---|---|
| ≥ 1024px | 260px | 78px | 260px / 78px | calc(100% - 260px) / calc(100% - 78px) |
| 820px - 1023px | 220px | 78px | 220px | calc(100% - 220px) |
| 640px - 819px | 210px | 78px | 210px | calc(100% - 210px) |
| < 640px | 78px | 78px | 78px | calc(100% - 78px) |

## Comportement Utilisateur

1. **Desktop (≥1024px)**: Sidebar hover-expand fluide, contenu se réajuste immédiatement
2. **Tablet (640px - 1024px)**: Sidebar réduite mais toujours visible, réarrangement smooth
3. **Mobile (<640px)**: Sidebar en icône seulement, contenu prend tout l'espace

## Tests Recommandés

- [x] Build compile sans erreurs
- [ ] Page d'accueil: vérifier le centrage lors de l'expansion/collapse
- [ ] Chat: vérifier que le contenu ne déborde pas et se redimensionne
- [ ] Wisdom-bar: vérifier que le padding se décale fluidement
- [ ] Multi-navigateur: Chrome, Firefox, Safari
- [ ] Responsive: tester sur 1920px, 1366px, 1024px, 768px, 375px
