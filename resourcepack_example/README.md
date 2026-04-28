# Resourcepack Structure

Pour créer un resourcepack, tu dois créer un fichier `.zip` avec cette structure:

```
resourcepack.zip
├── pack.json
├── img/
│   ├── pomme.png (image principale du clicker)
│   ├── golden_apple.png (pomme dorée)
│   ├── apple.png (curseur par défaut)
│   └── green_apple.png (curseur interactif)
└── sounds/
    └── UISoundClick.mp3 (son du clic)
```

## pack.json

Le fichier `pack.json` doit contenir les chemins relatifs des ressources dans le ZIP:

```json
{
  "appleImage": "img/pomme.png",
  "goldenAppleImage": "img/golden_apple.png",
  "sound": "sounds/UISoundClick.mp3",
  "cursorDefault": "img/apple.png",
  "cursorDefaultHotspotX": 16,
  "cursorDefaultHotspotY": 16,
  "cursorInteractive": "img/green_apple.png",
  "cursorInteractiveHotspotX": 16,
  "cursorInteractiveHotspotY": 16,
  "favicon": "img/pomme.png"
}
```

## Propriétés

- `appleImage` - Image de la pomme cliquable
- `goldenAppleImage` - Image de la pomme dorée bonus
- `sound` - Son du clic
- `cursorDefault` - Curseur normal (fond)
- `cursorDefaultHotspotX/Y` - Point actif du curseur normal (généralement 16,16)
- `cursorInteractive` - Curseur des éléments cliquables
- `cursorInteractiveHotspotX/Y` - Point actif du curseur interactif
- `favicon` - Icône du site (tab)

## Hotspots

Les hotspots (X, Y) définissent le point cliquable exact du curseur image:
- Pour une image 32x32, le hotspot optimal est (16, 16) = centre
- Pour une image 16x16, le hotspot optimal est (8, 8) = centre

## Comment utiliser

1. Créer ton resourcepack en ZIP avec la structure ci-dessus
2. Ouvrir AppleClicker
3. Cliquer sur le bouton "📦 Load Resourcepack"
4. Sélectionner ton fichier `.zip`
5. Le resourcepack se charge et se sauvegarde automatiquement!

Le resourcepack persiste dans `localStorage`, donc il se recharge à la prochaine visite.

Tu peux revenir au resourcepack par défaut avec le bouton "🔄 Default Resourcepack"
