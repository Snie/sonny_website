# Data Model: 001-portfolio-onepager

**Date**: 2026-03-31

This is a fully static site with no database. All data lives in TypeScript
constants and i18n message files. The entities below define the shapes used
by components.

## Entities

### TimelineEntry

Represents a single work experience entry in the career timeline.

```typescript
interface TimelineEntry {
  role: string;        // Job title
  company: string;     // Employer name
  city: string;        // City of employment
  period: string;      // e.g. "Jan 2023 – Present"
  description: string; // Brief description of responsibilities
}
```

**Instances**: 6 entries, reverse-chronological order.
**Source**: `messages/{locale}.json` under `experience.entries[]`.

### EducationCard

Represents a university degree.

```typescript
interface EducationCard {
  degree: string;         // e.g. "MSc in Informatics"
  institution: string;    // "Università della Svizzera italiana (USI)"
  city: string;           // "Lugano"
  period: string;         // e.g. "2018 – 2020"
  grade: string;          // e.g. "110/110 cum laude"
  specialisation: string; // e.g. "Software Design"
}
```

**Instances**: 2 (MSc, BSc).
**Source**: `messages/{locale}.json` under `education.entries[]`.

### Locale

Supported languages for URL-based routing.

```typescript
type Locale = "en" | "it" | "de" | "fr";
const defaultLocale: Locale = "en";
const locales: Locale[] = ["en", "it", "de", "fr"];
```

### Message Dictionary Structure

Each `messages/{locale}.json` file follows this shape:

```typescript
interface Messages {
  hero: {
    title: string;       // "Ciao, I'm Sonny"
    intro: string;       // Intro phrase below title
  };
  authorNote: {
    text: string;        // Personal paragraph
  };
  about: {
    text: string;        // Professional bio
  };
  experience: {
    heading: string;
    entries: TimelineEntry[];
  };
  education: {
    heading: string;
    entries: EducationCard[];
  };
}
```

## State

- **Theme**: `"light" | "dark" | "system"` — managed by `next-themes`, persisted
  in localStorage.
- **Locale**: Derived from URL segment (`/en`, `/it`, `/de`, `/fr`). No client
  state — the URL is the source of truth.

## Validation Rules

- All `TimelineEntry` fields are non-empty strings.
- All `EducationCard` fields are non-empty strings.
- `institution` for both education entries MUST include "USI" or
  "Università della Svizzera italiana".
- Exactly 6 timeline entries and 2 education entries per locale file.

## State Transitions

None. This is a static read-only page with no user-mutable data.
