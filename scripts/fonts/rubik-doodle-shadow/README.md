# Rubik Doodle Shadow font preparation

`subset-font.py` is a **manual font maintenance tool**. Python and fontTools are
not used by the website, the browser, `npm run dev`, or `npm run build`.
The application serves the committed WOFF2 files as ordinary static assets.

The script divides the original font into four smaller files: common UI symbols,
Cyrillic, Latin, and remaining punctuation/digits. The CSS ranges are disjoint.
All 227 characters from the original site subset remain available, including
Ukrainian letters, apostrophes, punctuation, and currency symbols. Ukrainian pages
preload UI + Cyrillic; English pages preload UI + Latin. Mixed-language text can
still request any other face when needed.

The script checks the pinned source SHA-256, character coverage, glyph outlines,
advance widths, and vertical metrics. It also records the unchanged Arial
fallback metrics, so this optimization preserves the font's appearance and sizing.
Python is used because fontTools provides reliable font subsetting and inspection;
rewriting this utility in JavaScript would not improve the website's performance.

## Files

- `subset.json`: source URL/hash, fontTools version, face hashes, coverage, and
  verification results.
- `public/fonts/rubik-doodle-shadow/`: generated WOFF2 assets and the original
  SIL Open Font License (`OFL.txt`). Asset filenames include their content hash
  so they can be cached immutably.
- `src/fonts/rubik-doodle-shadow.css`: generated font faces and fallback metrics.
- `src/fonts/rubik-doodle-shadow-assets.json`: generated URLs shared by preloads
  and CSS. `src/fonts/rubik-doodle-shadow.ts` chooses the preloads by locale.

## Rebuild only when maintaining the font assets

Use Python 3.11 or newer with `fontTools[woff]==4.66.1` in a separate environment.
Obtain the original TTF from `sourceDownloadUrl` in `subset.json`, then run from the
repository root:

```sh
python scripts/fonts/rubik-doodle-shadow/subset-font.py /path/to/RubikDoodleShadow-Regular.ttf
npx prettier --write src/fonts/rubik-doodle-shadow.css src/fonts/rubik-doodle-shadow-assets.json scripts/fonts/rubik-doodle-shadow/subset.json
```

The command regenerates the four WOFF2 assets, metadata, CSS, and URL manifest.
Review their diff and check both locales before committing a font change. If
asset contents change, remove obsolete hashed WOFF2 files after confirming they
are no longer referenced. Keep the license with the fonts.
