# Sonny Personal WebSite Specification

The product specification — the WHAT and WHY, owned by the human. Implementation conventions that
used to live here now load automatically as path-scoped rules (see
[Implementation conventions](#implementation-conventions)).

## Purpose

Sonny Personal Website is meant to provide information about him. Serve as an online resume,
demonstrate his skills in programming and also his AI skills. Pages should be eye-catching and cause
users to say wow. At the same time, pages must be functional and not performance-demanding.

## Users & Key Flows

The page is static, no users nor specific flow are needed.

## Database schema

The page is static, no database needed.

## Implementation conventions

These load on demand as path-scoped rules when you touch the matching files:

| Convention | Rule | Loads when |
| --- | --- | --- |
| Styling & design system (`ContentSection`, theme tokens, accent colors) | `.claude/rules/styling.md` | editing `*.tsx` / `*.css` |
| Internationalization (next-intl, adding translations, newlines) | `.claude/rules/i18n.md` | editing `messages/**` or `app/[locale]/**` |
| Testing (conventions + commands) | `.claude/rules/testing.md` | editing tests |
