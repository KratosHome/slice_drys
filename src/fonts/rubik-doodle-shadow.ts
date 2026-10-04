import assets from './rubik-doodle-shadow-assets.json'

// The same font faces stay available for mixed-language text. Only the active
// locale's alphabet is preloaded; other faces load when their glyphs are used.
export const rubikDoodleShadow = {
  variable: 'font-rubik-doodle-shadow',
  preloads: {
    uk: [assets.ui, assets.cyrillic],
    en: [assets.ui, assets.latin],
  },
}
