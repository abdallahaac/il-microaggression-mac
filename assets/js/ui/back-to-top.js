import { qs } from "../utils/dom.js";

export const initBackToTop = () => {
	const backToTopBtn = qs("#back-to-top-btn");
	if (!backToTopBtn) return;

	const progressCircle = backToTopBtn.querySelector(".progress-ring__circle");
	if (!progressCircle) return;

	const radius = progressCircle.r.baseVal.value;
	const circumference = 2 * Math.PI * radius;

	progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
	progressCircle.style.strokeDashoffset = circumference;

	const setProgress = (percent) => {
		const offset = circumference - (percent / 100) * circumference;
		progressCircle.style.strokeDashoffset = offset;
	};

	window.addEventListener("scroll", () => {
		const scrollHeight =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;
		const scrollTop = window.scrollY;
		const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

		setProgress(scrollPercent);

		if (scrollTop > 300) {
			backToTopBtn.classList.add("visible");
		} else {
			backToTopBtn.classList.remove("visible");
		}
	});

	backToTopBtn.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
};
