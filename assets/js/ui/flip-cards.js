import { qsa } from "../utils/dom.js";

export const initFlipCards = () => {
	const flipCards = qsa(".flip-card");
	if (flipCards.length === 0) return;

	const toggleFlip = (card) => {
		const isPressed = card.getAttribute("aria-pressed") === "true";
		card.setAttribute("aria-pressed", String(!isPressed));
	};

	const toggleSrHidden = (card) => {
		const isPressed = card.getAttribute("aria-pressed") === "true";
		const front = card.querySelector(".flip-card-front");
		const back = card.querySelector(".flip-card-back");

		if (front) front.setAttribute("aria-hidden", String(isPressed));
		if (back) back.setAttribute("aria-hidden", String(!isPressed));
	};

	flipCards.forEach((card) => {
		card.addEventListener("click", () => {
			toggleFlip(card);
			toggleSrHidden(card);
		});

		card.addEventListener("keydown", (event) => {
			if ((event.code === "Enter" || event.code === "Space") && !event.repeat) {
				event.preventDefault();
				toggleFlip(card);
				toggleSrHidden(card);
			}
		});
	});
};
