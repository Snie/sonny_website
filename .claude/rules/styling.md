---
paths:
  - "**/*.tsx"
  - "**/*.css"
---

# Styling & Design System

Loaded automatically when editing components or styles.

## Section standards

All content sections use the `ContentSection` component (`components/ui/content-section.tsx`) to
maintain visual consistency across the site.

```tsx
<ContentSection maxWidth="5xl" heading={t("heading")}>
  {/* Section content */}
</ContentSection>
```

## Theme colors

Dual-color accent system that adapts to the theme via CSS custom properties.

- Dark mode primary accent: terminal green `#00ff00` (rgb 0, 255, 0)
- Light mode primary accent: cyan `#00ffff` (rgb 0, 255, 255)

Design tokens (defined in `app/globals.css`):

| Token | Purpose |
| --- | --- |
| `--theme-accent` | Primary accent color (OKLCH format) |
| `--theme-accent-rgb` | RGB components for canvas/JS use |
| `--hero-glow` | Hero section glow effect |
| `--chart-accent` | Chart accent color |
| `--chart-text` | Chart text color |
| `--chart-grid` | Chart grid lines |
| `--hex-stroke` | Hex grid stroke color |

Implementation patterns:

```tsx
// Inline styles (React)
style={{ filter: "drop-shadow(0 1.2px 1.2px var(--hero-glow))" }}

// Canvas / ApexCharts (client-side only)
useEffect(() => {
  const accentRgb = getComputedStyle(document.documentElement)
    .getPropertyValue("--theme-accent-rgb")
    .trim();
}, [resolvedTheme]);

// Tailwind utilities
className = "text-theme-accent";
```

**Rule:** never hardcode `#00ff00` or `#00ffff`. Always use CSS custom properties for theme
consistency and maintainability.
