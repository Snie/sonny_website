# Sonny Personal WebSite Specification

## Purpose

Sonny Personal Website is meant to provide information about him. Serve as an online resume, demonstrate his skills in programming and also his AI skills.
Pages should be eye-catching and cause users to say wow. At the same time, pages must be functional and not performance-demanding.

## Users & Key Flows

The page is static, no users nor specific flow are needed.

## Database schema

The page is static, no database needed.

## Design System

### Section Standards

All content sections use the `ContentSection` component (`/components/ui/content-section.tsx`) to maintain visual consistency across the site.

**Usage example:**

```tsx
<ContentSection maxWidth="5xl" heading={t("heading")}>
  {/* Section content */}
</ContentSection>
```

### Theme Colors

The site uses a dual-color accent system that adapts to the theme via CSS custom properties.

**Dark mode:**

- Primary accent: Terminal green `#00ff00` (rgb 0, 255, 0)

**Light mode:**

- Primary accent: Cyan `#00ffff` (rgb 0, 255, 255)

**Design Tokens (defined in `app/globals.css`):**

| Token | Purpose |
| ------- | --------- |
| `--theme-accent` | Primary accent color (OKLCH format) |
| `--theme-accent-rgb` | RGB components for canvas/JS use |
| `--hero-glow` | Hero section glow effect |
| `--chart-accent` | Chart accent color |
| `--chart-text` | Chart text color |
| `--chart-grid` | Chart grid lines |
| `--hex-stroke` | Hex grid stroke color |

**Implementation patterns:**

```tsx
// For inline styles (React)
style={{ filter: 'drop-shadow(0 1.2px 1.2px var(--hero-glow))' }}

// For canvas/ApexCharts (client-side only)
useEffect(() => {
  const accentRgb = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-accent-rgb')
    .trim();
  // Convert to hex or use directly
}, [resolvedTheme]);

// For Tailwind utilities
className="text-theme-accent"
```

**Rule:** Never hardcode `#00ff00` or `#00ffff`. Always use CSS custom properties for theme consistency and maintainability.

## Internationalization (i18n)

The site uses **next-intl** for multilanguage support with locale-based routing.

### Structure

**Translation files:** `/messages/[locale].json`

- `en.json` — English (default)
- and swiss national languages

**Routing:** `/app/[locale]/` — locale prefix in URL (e.g., `/en`, `/it`)

### Adding translations to a new section

1. **Add translation keys to JSON files:**

   ```json
   // messages/en.json
   {
     "sectionName": {
       "heading": "Section Heading",
       "text": "Section content"
     }
   }
   ```
IMPORTANT! Make each translation sound like it was written natively rather than translated from English.

2. **Use in component:**

   ```tsx
   import { useTranslations } from "next-intl";

   export function SectionName() {
     const t = useTranslations("sectionName");

     return (
       <ContentSection heading={t("heading")}>
         <p>{t("text")}</p>
       </ContentSection>
     );
   }
   ```

3. **For arrays (timelines, cards):**

   ```tsx
   const entries = t.raw("entries") as EntryType[];
   ```

**Text with newlines:**

Use `\n` in JSON, then render with `jsonTextToHtml()` utility (`/lib/text-utils.tsx`).
