# Icons might be missing when a custom theme overrides `icons` member

## Search terms

theme, icons, cache

## Expected Behavior

When a custom theme overrides the `icons` member, the icons correctly appear on
all generated pages.

## Actual Behavior

TypeDoc fails to show icons on all generated pages. Compare the navigation on
the right hand side of the two screenshots:

- default theme:

- custom theme (see the reproduction repository linked in reproduction steps):


I believe this is due to [this
call](https://github.com/TypeStrong/typedoc/blob/7a3f52175a5450e3637fb5dcd22d121028828f83/src/lib/output/renderer.ts#L243)
to `clearSeenIconCache()` function as it is [imported from the default
theme](https://github.com/TypeStrong/typedoc/blob/7a3f52175a5450e3637fb5dcd22d121028828f83/src/lib/output/renderer.ts#L27).
If the custom theme overrides the icons, the icon cache will not be correctly
invalidated and some generated pages might refer to icons that do not exist.

This is further confirmed by printing the order in which pages are rendered:

```
$ npm run docs-custom-theme

> typedoc-custom-theme-demo@2.0.0 docs-custom-theme
> tsc && typedoc src --plugin ./dist/index.js --theme icon-override

Loaded plugin C:\dev\typedoc-custom-icons-bug\dist\index.js
warning Failed to resolve link to "DeclarationReflection.cssClasses" in comment for IconOverrideTheme.applyReflectionClasses.applyReflectionClasses
warning Failed to resolve link to "UrlMapping" in comment for IconOverrideTheme.getUrls.getUrls
Rendering modules.html
Rendering index.html
Rendering classes/IconOverrideTheme.html
Rendering classes/IconOverrideThemeContext.html
Rendering functions/load.html
Documentation generated at ./docs
```

The icons on `modules.html` page are all shown correctly:

But the class icon on `classes/IconOverrideTheme.html` is not:

as it attempts to use (`<use href="#icon-128-path"></use>`) an element that
does not exist on the page.

## Steps to reproduce the bug

1. Clone the [reproduction repository](https://github.com/ejuda/typedoc-custom-icons-bug).
2. `npm ci`
3. `npm run docs-custom-theme`
4. This will generate documentation into `docs` directory.

The custom theme's `icon.tsx` is copied straight from the default theme's
[`icon.tsx`](https://github.com/TypeStrong/typedoc/blob/ed173381b3074cd7d512b1936d73bb4dc843d7b2/src/lib/output/themes/default/partials/icon.tsx)
file, but the icons are filled in to make the distinction between the default
and custom themes clearer.

For ease of comparison, `npm run docs` command will generate documentation
using the default theme.

## Environment

- Typedoc version: 0.23.24
- TypeScript version: 4.9.5
- Node.js version: 18.13.0
- OS: Windows 10
