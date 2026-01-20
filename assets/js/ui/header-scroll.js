import { qs } from "../utils/dom.js";

export const initHeaderScroll = () => {
	const header = qs("#header-nav");
	if (!header) return;

	const onScroll = () => {
		header.classList.toggle("scrolled", window.scrollY > 50);
	};

	window.addEventListener("scroll", onScroll);
	onScroll();
};
