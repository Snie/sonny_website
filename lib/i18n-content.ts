/**
 * Typed, validated access to structured translation content.
 *
 * `next-intl`'s `t.raw()` returns `any`, so assigning its result to a typed
 * variable is an unchecked claim — a malformed or incomplete locale file would
 * compile cleanly and crash at render. `getEntries` validates the shape at the
 * boundary and fails loud with a message that names the offending key, turning a
 * silent runtime crash into a debuggable error.
 */

/** A single work-experience entry (`experience.entries[]`). */
export interface TimelineEntry {
	role: string;
	company: string;
	city: string;
	period: string;
	description: string;
}

/** A single academic-work entry (`academic.entries[]`). */
export interface AcademicEntry {
	title: string;
	institution: string;
	city: string;
	period: string;
	description: string;
}

/** A single education entry (`education.entries[]`). */
export interface EducationEntry {
	degree: string;
	institution: string;
	city: string;
	period: string;
	grade: string;
	specialisation: string;
	thesis: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validate that `raw` (typically `t.raw(...)`) is an array of objects and return
 * it typed as `T[]`. `key` is the translation path, used only in error messages.
 *
 * This guarantees the value is iterable and that each item is an object before a
 * component maps over it; it does not assert individual field presence, which is
 * covered by the translation-completeness checks across locale files.
 */
export function getEntries<T>(raw: unknown, key: string): T[] {
	if (!Array.isArray(raw)) {
		throw new Error(
			`Expected translation "${key}" to be an array of entries, received ${typeof raw}.`,
		);
	}
	for (const [index, item] of raw.entries()) {
		if (!isRecord(item)) {
			throw new Error(`Expected "${key}[${index}]" to be an object, received ${typeof item}.`);
		}
	}
	return raw as T[];
}
