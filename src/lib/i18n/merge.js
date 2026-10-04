/**
 * The translation fallback and lookup, with no reactive state, so the
 * self-check can run it under plain Node. One file per language stays the
 * rule; this only reads them.
 */

/**
 * Every key English has, taken from `over` where present. A key `over` lacks
 * falls back to English with `mark` in front, because a silent fallback makes
 * an untranslated tool look finished.
 */
export function withFallback(base, over, mark = "") {
	if (base && typeof base === "object") {
		const out = Array.isArray(base) ? [] : {};
		for (const k of Object.keys(base))
			out[k] = withFallback(base[k], over?.[k], mark);
		return out;
	}
	if (over === undefined)
		return typeof base === "string" && mark ? mark + base : base;
	return over;
}

/** Fill {placeholders} from an object. Unknown ones stay visible, not blanked. */
export function fmt(template, params) {
	if (!params) return template;
	return template.replace(/[{]([a-zA-Z]+)[}]/g, (whole, key) =>
		Object.hasOwn(params, key) ? String(params[key]) : whole,
	);
}

/** Look up a dotted key ("rle.intro") under `root`; undefined if absent. */
export const at = (root, key) => key.split(".").reduce((o, k) => o?.[k], root);

/** Dotted paths of keys English has and `over` lacks. Empty is the goal. */
export function missingKeys(base, over, prefix = "") {
	if (base && typeof base === "object")
		return Object.keys(base).flatMap((k) =>
			missingKeys(base[k], over?.[k], `${prefix}${k}.`),
		);
	return over === undefined ? [prefix.slice(0, -1)] : [];
}
