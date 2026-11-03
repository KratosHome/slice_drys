# Rubik Doodle Shadow font preparation

`subset-font.py` is a **manual font maintenance tool**. Python and fontTools are
not used by the website, the browser, `npm run dev`, or `npm run build`.
The application serves the committed WOFF2 files as ordinary static assets.

The complete stylesheet has five faces: common UI symbols (including the quantity
control’s `+`), Cyrillic, Latin, digits, and remaining punctuation. Splitting digits
from punctuation avoids downloading the large punctuation face for pagination or
the weight slider. Their CSS ranges are disjoint.
All 227 characters from the original site subset remain available, including
Ukrainian letters, apostrophes, punctuation, and currency symbols. Ukrainian pages
preload UI + Cyrillic; English pages preload UI + Latin. Mixed-language text can
still request any other face when needed.

The homepage has seven disjoint faces for each locale. The first face combines
the uppercase `main.products-slider.title` with its space and dash glyphs, so
the first screen needs only one font request. Each locale has a separate merged
critical asset; the opposite alphabet's pure critical letters remain separate
in the deferred stylesheet. `progressive.localeFaces` records the seven selected
faces and `progressive.localePreloadBytes` records their initial byte count.
The initial font-face rule is inlined in the head (under 400 bytes per locale),
so they do not add a render-blocking stylesheet request. Font binaries remain
ordinary cached WOFF2 assets. The remaining faces are registered from a
separate stylesheet when lower sections approach the viewport, or immediately
on scrolling, navigation, focus, and other interactions. Restored scroll
positions and direct section links also request them immediately. An idle page
at the top does not fetch the remaining alphabet. There is no fixed waiting
period and no content is hidden. Until the remaining
faces load, the existing metric-adjusted Arial fallback keeps the text readable.
An inert `noscript` stylesheet supplies every face when JavaScript is disabled.

Catalog and blog-list pages inline common controls plus a small locale-specific
face covering the visible Blog, Type, Weight and Filter labels. Product and article
pages inline controls only: they do not preload an alphabet. Only the small
heading face is preloaded on the catalog/blog list. Glyphs are taken from the
translation files, and the numeric face loads only where its digits are used.
The inner full stylesheet retains all 227 supported characters. It is registered
on interaction or when visible/nearby Rubik text needs characters outside the
initial set. An IntersectionObserver checks the actual rendered text; a
MutationObserver includes streamed recommendations and newly mounted content.
Without IntersectionObserver the complete stylesheet is registered immediately;
without JavaScript it is supplied by noscript. Failed stylesheet requests remain
retryable on the next interaction. Other routes keep the complete stylesheet.

`RubikDoodleShadowFonts` selects the critical profile or complete stylesheet during
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
  URLs, homepage preloads, and inner critical rules; used by `rubik-doodle-shadow-fonts.tsx` in the
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

## Verification

Run `bun test src/fonts/rubik-font-profile.test.ts` to check route selection,
translation/control glyph coverage, disjoint complete character coverage, and
immutable asset integrity. The generator additionally checks outlines, advance
widths and vertical metrics against the pinned upstream TTF. Browser checks
should cover direct UK/EN loads, scroll, restored positions, client navigation,
menu/cart interaction and text that streams after hydration. Keep previously
committed hashed files available for cached HTML compatibility when adding new
assets.
