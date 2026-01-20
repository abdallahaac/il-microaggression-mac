import { qs, qsa } from "../utils/dom.js";

export const initTranscriptToggles = () => {
	const toggles = qsa(".transcript-toggle");
	if (toggles.length === 0) return;

	const setExpanded = (toggle, content, expanded) => {
		toggle.setAttribute("aria-expanded", String(expanded));
		content.classList.toggle("is-open", expanded);
	};

	toggles.forEach((toggle) => {
		const targetId = toggle.getAttribute("aria-controls");
		const content = targetId ? qs(`#${targetId}`) : null;
		if (!content) return;

		const isExpanded = toggle.getAttribute("aria-expanded") === "true";
		setExpanded(toggle, content, isExpanded);

		toggle.addEventListener("click", () => {
			const expanded = toggle.getAttribute("aria-expanded") === "true";
			setExpanded(toggle, content, !expanded);
		});
	});
};
