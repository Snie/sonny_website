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
<ContentSection maxWidth="4xl" heading={t("heading")}>
  {/* Section content */}
</ContentSection>
```

### Theme Colors

The site uses a dual-color accent system that adapts to the theme:

**Dark mode:**
- Primary accent: Terminal green `#00ff00` (rgb 0, 255, 0)

**Light mode:**
- Primary accent: Cyan `#00ffff` (rgb 0, 255, 255)

**Implementation pattern:**
```tsx
const isDark = resolvedTheme === "dark";
const accentColor = isDark ? "#00ff00" : "#00ffff";
```

All accent colors must switch based on theme to maintain consistent visual identity across light and dark modes.

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

**Text with newlines:** Use `\n` in JSON, then render with `jsonTextToHtml()` utility (`/lib/text-utils.tsx`).

