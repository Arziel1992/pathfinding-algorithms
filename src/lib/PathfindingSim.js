/**
 * @file PathfindingSim.js — Simulation runner for pathfinding algorithms.
 *
 * Owns the running generator and the animation timer.
 * Pure JS — no Svelte, no DOM. Callbacks bridge to App.svelte's reactive state.
 */

export class PathfindingSim {
	constructor() {
		/** @type {Generator|null} */
		this._gen = null;
		/** @type {number|null} */
		this._timer = null;
		/** @type {((step: object) => void)|null} */
		this._onStep = null;
		/** @type {(() => void)|null} */
		this._onDone = null;

		this.running = false;
		this.paused = false;
		this.finished = false;
	}

	/**
	 * Attach a generator and callbacks without starting the timer.
	 * @param {Generator} gen
	 * @param {(step: object) => void} onStep  called for every yielded value
	 * @param {() => void}             onDone  called when the generator finishes
	 */
	init(gen, onStep, onDone) {
		this._stop();
		this._gen = gen;
		this._onStep = onStep;
		this._onDone = onDone;
		this.running = true;
		this.paused = true; // paused until play() or step() is called
		this.finished = false;
	}

	/**
	 * Start auto-stepping at the given interval.
	 * @param {number} delayMs
	 */
	play(delayMs = 30) {
		if (!this.running || this.finished) return;
		this.paused = false;
		this._clearTimer();
		this._timer = setInterval(() => this._advance(), delayMs);
	}

	/** Pause the animation timer (does not discard the generator). */
	pause() {
		this.paused = true;
		this._clearTimer();
	}

	/** Advance exactly one step (for step-through mode). */
	step() {
		if (!this.running || this.finished) return;
		this._advance();
	}

	/** Cancel the current run and discard the generator. */
	stop() {
		this._stop();
	}

	// ─── private ────────────────────────────────────────────────────────────────

	_advance() {
		if (!this._gen) return;
		const { value, done } = this._gen.next();
		if (done) {
			this._finish();
			return;
		}
		if (!value) return;
		this._onStep?.(value);
		if (value.kind === "path" || value.kind === "fail") {
			this._finish();
		}
	}

	_finish() {
		this._clearTimer();
		this.finished = true;
		this.running = false;
		this._onDone?.();
	}

	_stop() {
		this._clearTimer();
		this._gen = null;
		this.running = false;
		this.paused = false;
		this.finished = false;
	}

	_clearTimer() {
		if (this._timer !== null) {
			clearInterval(this._timer);
			this._timer = null;
		}
	}
}
