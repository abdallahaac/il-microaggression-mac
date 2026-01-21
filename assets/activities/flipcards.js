const flipcardsPrefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

function flipcardsFirstFocusable(root) {
	const selectors = [
		"a[href]",
		"button:not([disabled])",
		"input:not([disabled])",
		"select:not([disabled])",
		"textarea:not([disabled])",
		"[tabindex]:not([tabindex='-1'])",
	];
	return root.querySelector(selectors.join(","));
}

function flipcardsSafeJsonParse(str, fallback) {
	try {
		return JSON.parse(str);
	} catch {
		return fallback;
	}
}

if (!customElements.get("d2l-cplus-card")) {
	class D2LCPlusCard extends HTMLElement {
		static get observedAttributes() {
			return ["title-only", "image-only", "align-center"];
		}

		constructor() {
			super();
			this.attachShadow({ mode: "open" });

			this.shadowRoot.innerHTML = `
				<style>
					:host {
						background: #fff;
						border: 1px solid var(--d2l-color-gypsum, #cdd5dc);
						border-radius: 6px;
						box-sizing: border-box;
						display: block;
						height: 100%;
						min-height: 200px;
						width: 100%;
						overflow: hidden;
					}

					.container {
						display: flex;
						flex-direction: column;
						height: 100%;
					}

					.header ::slotted(img[slot="header"]) {
						display: block;
						width: 100%;
						max-height: 250px;
						object-fit: cover;
						object-position: 50% 50%;
					}

					:host([image-only]) .header ::slotted(img[slot="header"]) {
						max-height: 475px;
					}

					/* ---------- CONTENT AREA ---------- */
					.content {
						flex: 1;
						display: flex;
						padding: 24px 24px 0 24px;
					}

					.content slot {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: center;
						flex: 1;
						width: 100%;
					}

					/* Make the "title-only" card vertically centered (like your screenshot) */
					:host([title-only]) .content {
						padding: 0 24px;
					}

					:host([title-only]) .content slot {
						justify-content: center;
					}

					/* Title + text (NOW works because they're direct slotted nodes) */
					.content ::slotted(.title) {
						color: #202122;
						font-size: 20px;
						font-weight: 700;
						letter-spacing: 0.2px;
						line-height: 30px;
						margin: 0;
						overflow-wrap: anywhere;
					}

					.content ::slotted(.text) {
						margin: 18px 0 0 0;
						color: #494c4e;
						font-size: 19px;
						line-height: 28px;
						overflow-wrap: anywhere;
					}

					/* If there is ONLY text, remove the extra spacing */
					.content ::slotted(.text:only-child) {
						margin-top: 0;
					}

					/* Center align option (like Creator+ cards) */
					:host([align-center]) .content {
						text-align: center;
					}

					:host([align-center]) .content slot {
						align-items: center;
					}
					:host([align-center]) .content ::slotted(.text) {
						text-align: center;
					}

					/* ---------- FOOTER ---------- */
					.footer {
						display: flex;
						justify-content: center;
						align-items: center;
						margin-top: auto;
						padding: 16px 24px 18px 24px;
					}

					/* Your "reply/flip" icon wrapper */
					.footer ::slotted(.flip-icon) {
						display: inline-flex;
						align-items: center;
						justify-content: center;
						width: 34px;
						height: 34px;
						border-radius: 6px;
						transition: background 160ms ease;
					}

					.footer ::slotted(.flip-icon:hover) {
						background: #f2f3f4;
					}

					/* Keep footer nice even if someone adds extra footer content later */
					.footer ::slotted(*) {
						pointer-events: auto;
					}

					/* Hide content/badge when image-only */
					:host([image-only]) .content {
						display: none;
					}
				</style>

				<div class="container">
					<div class="header"><slot name="header"></slot></div>
					<div class="content"><slot name="content"></slot></div>
					<div class="footer"><slot name="footer"></slot></div>
				</div>
			`;
		}
	}

	customElements.define("d2l-cplus-card", D2LCPlusCard);
}

if (!customElements.get("d2l-cplus-flipper")) {
	class D2LCPlusFlipper extends HTMLElement {
		static get observedAttributes() {
			return ["is-flipped"];
		}

		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this.isFlipped = false;
			this.isFlipping = false;

			this.shadowRoot.innerHTML = `
				<style>
					:host {
						display: block;
						margin-bottom: 6px;
					}

					.flipper-container {
						cursor: pointer;
						height: 100%;
						perspective: 1000px;
						transition: transform 300ms ease-out 50ms;
						outline: none;
					}

					.flipper-container:hover {
						transform: translateY(-4px);
					}

					.flipper-container:focus {
						outline: none;
					}

					.flipper-content {
						border: 1px solid rgba(0, 0, 0, 0);
						border-radius: 6px;
						display: grid;
						grid-template-columns: minmax(50px, 1fr);
						height: 100%;
						transform-origin: center left;
						transform-style: preserve-3d;
						transition: transform 1000ms, box-shadow 200ms;
					}

					:host([is-flipped]) .flipper-content {
						transform: translateX(100%) rotateY(180deg);
					}

					.side {
						backface-visibility: hidden;
						grid-column: 1 / 1;
						grid-row: 1 / 1;
						transition: box-shadow 200ms;
					}

					#back {
						transform: rotateY(-180deg);
					}

					.flipper-container:hover .flipper-content {
						box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--brand-blue, #006fbb);
					}

					@media print {
						.flipper-content {
							display: flex;
							transform: none !important;
						}
						#back {
							transform: none !important;
						}
						.side {
							flex: 1;
						}
					}

					@media (prefers-reduced-motion: reduce) {
						.flipper-container,
						.flipper-content {
							transition: none !important;
						}
					}
				</style>

				<div class="flipper-container" tabindex="0" role="button" aria-label="Flip card">
					<div class="flipper-content">
						<div class="side" id="front" aria-hidden="false">
							<slot name="front"></slot>
						</div>
						<div class="side" id="back" aria-hidden="true">
							<slot name="back"></slot>
						</div>
					</div>
				</div>
			`;
		}

		connectedCallback() {
			this._container = this.shadowRoot.querySelector(".flipper-container");
			this._content = this.shadowRoot.querySelector(".flipper-content");
			this._frontSide = this.shadowRoot.querySelector("#front");
			this._backSide = this.shadowRoot.querySelector("#back");

			this._container.addEventListener("click", () => this._toggleFlip());
			this._container.addEventListener("keydown", (e) => {
				if (e.code === "Enter" || e.code === "Space") {
					e.preventDefault();
					this._toggleFlip();
				}
			});

			this._content.addEventListener("transitionend", (e) => {
				if (e.propertyName !== "transform") return;
				this.isFlipping = false;
				const slot = this.isFlipped
					? this.shadowRoot.querySelector("slot[name='back']")
					: this.shadowRoot.querySelector("slot[name='front']");
				const assigned = slot.assignedElements({ flatten: true });
				const root = assigned?.[0];
				if (!root) return;
				const focusTarget = flipcardsFirstFocusable(root) || root;
				if (focusTarget && typeof focusTarget.focus === "function") {
					focusTarget.focus();
				}
			});

			this._syncAria();
		}

		attributeChangedCallback(name) {
			if (name === "is-flipped") {
				this.isFlipped = this.hasAttribute("is-flipped");
				this._syncAria();
			}
		}

		_syncAria() {
			if (!this._frontSide || !this._backSide) return;
			this._frontSide.setAttribute("aria-hidden", String(this.isFlipped));
			this._backSide.setAttribute("aria-hidden", String(!this.isFlipped));
		}

		_toggleFlip() {
			if (this.isFlipping) return;
			this.isFlipping = true;
			this.isFlipped = !this.isFlipped;
			if (this.isFlipped) this.setAttribute("is-flipped", "");
			else this.removeAttribute("is-flipped");

			if (flipcardsPrefersReducedMotion) {
				this.isFlipping = false;
				this._syncAria();
			}
		}
	}

	customElements.define("d2l-cplus-flipper", D2LCPlusFlipper);
}

if (!customElements.get("d2l-cplus-flipcards")) {
	class D2LCPlusFlipcards extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._rows = [];
			this._instructions = "";
			this._columnsPerRow = 2;

			this.shadowRoot.innerHTML = `
				<style>
					:host {
						display: block;
						color: #494c4e;
						font-family: Lato, system-ui, sans-serif;
					}

					.instructions {
						color: #494c4e;
						font-size: 16px;
						line-height: 24px;
						margin: 0 0 18px;
						overflow-wrap: anywhere;
					}

					.rows-container {
						display: grid;
						row-gap: 18px;
						overflow: hidden;
						padding-inline: 8px;
						padding-block-start: 8px;
					}

					.row {
						display: grid;
						gap: 18px 24px;
						grid-template-columns: repeat(var(--cols), minmax(50px, 470px));
					}

					.title {
						color: #494c4e;
						font-size: 20px;
						font-weight: 700;
						letter-spacing: 0.2px;
						line-height: 30px;
						text-align: center;
					}

					.text {
						margin: 18px 0 0 0;
						color: #494c4e;
						font-size: 19px;
						line-height: 28px;
						text-align: center;
						overflow-wrap: anywhere;
					}

					.text:only-child {
						margin-top: 0;
					}

					@media (max-width: 822px) {
						.row {
							column-gap: 12px;
						}
					}

					@media (max-width: 598px) {
						.row {
							grid-template-columns: minmax(50px, 1fr);
						}
					}

					@media print {
						.row {
							grid-template-columns: minmax(50px, 1fr);
						}
					}
				</style>

				<div class="container">
					<p class="instructions" id="inst"></p>
					<div class="rows-container" id="rows"></div>
				</div>
			`;
		}

		connectedCallback() {
			this._instructions =
				typeof this.dataset.instructions === "string"
					? this.dataset.instructions
					: "";
			this._rows =
				typeof this.dataset.rows === "string"
					? flipcardsSafeJsonParse(this.dataset.rows, [])
					: [];
			this._columnsPerRow = this._calculateColumnsPerRow();
			this._render();
		}

		_calculateColumnsPerRow() {
			try {
				if (!Array.isArray(this._rows)) return 2;
				const maxRowLen = Math.max(
					2,
					...this._rows.map((r) => (Array.isArray(r) ? r.length : 0)),
				);
				return maxRowLen;
			} catch {
				return 2;
			}
		}

		_renderCardSide(side, card, colIndex, rowIndex) {
			const title = card?.[`${side}Title`] || "";
			const text = card?.[`${side}Text`] || "";
			const img = card?.[`${side}Image`] || { url: "", alt: "" };

			const titleOnly = Boolean(!text && !img?.url && title);
			const imageOnly = Boolean(!text && img?.url && !title);
			const flipIconId = `flip-icon-${side}-${rowIndex}-${colIndex}`;

			return `
				<d2l-cplus-card ${titleOnly ? "title-only" : ""} ${imageOnly ? "image-only" : ""} align-center>
					${img?.url ? `<img slot="header" alt="${img.alt || ""}" src="${img.url}">` : ""}
					${title ? `<div slot="content" class="title">${title}</div>` : ""}
					${text ? `<p slot="content" class="text">${text}</p>` : ""}
					<div slot="footer">
						<span style="position:absolute; left:-9999px;">
							Click to flip the card
						</span>
						<span class="flip-icon" id="${flipIconId}" aria-hidden="true">
							<d2l-icon icon="tier1:reply" style="vertical-align: middle;"></d2l-icon>
						</span>
						<d2l-tooltip for="${flipIconId}" for-type="label" position="top">
							Flip
						</d2l-tooltip>
					</div>
				</d2l-cplus-card>
			`;
		}

		_render() {
			const instEl = this.shadowRoot.getElementById("inst");
			const rowsEl = this.shadowRoot.getElementById("rows");

			instEl.textContent = this._instructions || "";
			rowsEl.innerHTML = "";

			(this._rows || []).forEach((row, rowIndex) => {
				const rowWrap = document.createElement("div");
				rowWrap.className = "row";
				rowWrap.style.setProperty("--cols", String(this._columnsPerRow));

				(row || []).forEach((card, colIndex) => {
					const flipper = document.createElement("d2l-cplus-flipper");
					const front = document.createElement("div");
					front.slot = "front";
					front.innerHTML = this._renderCardSide(
						"front",
						card,
						colIndex,
						rowIndex,
					);
					const back = document.createElement("div");
					back.slot = "back";
					back.innerHTML = this._renderCardSide(
						"back",
						card,
						colIndex,
						rowIndex,
					);
					flipper.appendChild(front);
					flipper.appendChild(back);
					rowWrap.appendChild(flipper);
				});

				rowsEl.appendChild(rowWrap);
			});
		}
	}

	customElements.define("d2l-cplus-flipcards", D2LCPlusFlipcards);
}
