# Rubik Doodle Shadow font preparation

`subset-font.py` is a **manual font maintenance tool**. Python and fontTools are
not used by the website, the browser, `npm run dev`, or `npm run build`.
The application serves the committed WOFF2 files as ordinary static assets.

The script keeps the original four faces for other routes: common UI symbols,
Cyrillic, Latin, and remaining punctuation/digits. Their CSS ranges are disjoint.
All 227 characters from the original site subset remain available, including
Ukrainian letters, apostrophes, punctuation, and currency symbols. Ukrainian pages
preload UI + Cyrillic; English pages preload UI + Latin. Mixed-language text can
still request any other face when needed.

The homepage has six disjoint faces for each locale. The first face combines
the uppercase `main.products-slider.title` with its space and dash glyphs, so
the first screen needs only one font request. Each locale has a separate merged
critical asset; the opposite alphabet's pure critical letters remain separate
in the deferred stylesheet. `progressive.localeFaces` records the six selected
faces and `progressive.localePreloadBytes` records their initial byte count.
The initial font-face rule is inlined in the head (under 400 bytes per locale),
so they do not add a render-blocking stylesheet request. Font binaries remain
ordinary cached WOFF2 assets. The remaining faces are registered from a
separate stylesheet after first-screen fonts and
the hero image are ready and painted, or immediately on scrolling, navigation,
focus, and other interactions. Nearby lower sections also trigger registration.
There is no fixed waiting period and no content is hidden. Until the remaining
faces load, the existing metric-adjusted Arial fallback keeps the text readable.
An inert `noscript` stylesheet supplies every face when JavaScript is disabled.

`RubikDoodleShadowFonts` selects the homepage or complete stylesheet during
server rendering through `usePathname`; it also handles client navigation.
The shared application CSS registers only the unchanged fallback and variable.
Putting complete Rubik faces back into that shared stylesheet would cause
offscreen text to request the entire alphabet during the first render.

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
- `src/fonts/rubik-doodle-shadow.css`: generated fallback metrics and variable.
- `src/fonts/rubik-doodle-shadow-assets.json`: generated URLs shared by preloads
  and CSS. `src/fonts/rubik-doodle-shadow.ts` chooses the preloads by locale.
- `src/fonts/rubik-doodle-shadow-loading.json`: generated immutable stylesheet
  URLs and homepage preloads; used by `rubik-doodle-shadow-fonts.tsx` in the
  locale layout. Keep the original variable class and shared CSS import; render
  this component in the head instead of preloading fonts unconditionally there.

## Rebuild only when maintaining the font assets

Use Python 3.11 or newer with `fontTools[woff]==4.66.1` in a separate environment.
Obtain the original TTF from `sourceDownloadUrl` in `subset.json`, then run from the
repository root:

```sh
python scripts/fonts/rubik-doodle-shadow/subset-font.py /path/to/RubikDoodleShadow-Regular.ttf
npx prettier --write src/fonts/rubik-doodle-shadow.css src/fonts/rubik-doodle-shadow-assets.json scripts/fonts/rubik-doodle-shadow/subset.json
```

The command regenerates the original and progressive WOFF2 assets, immutable
public stylesheets, metadata, fallback CSS, and URL manifests.
Review their diff and check both locales before committing a font change. If
asset contents change, remove obsolete hashed WOFF2 files after confirming they
are no longer referenced. Keep the license with the fonts.
