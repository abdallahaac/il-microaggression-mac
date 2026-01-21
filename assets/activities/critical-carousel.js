const criticalCarouselSlides = [
	{
		title: "Evaluate Evidence",
		image: "",
		alt: "Slide illustration",
		text: "Critical thinkers assess the source, reliability, and bias of data and research.",
	},
	{
		title: "Identify Assumptions",
		image: "",
		alt: "Slide illustration",
		text: "Ask whats being taken for granted and whether those assumptions hold up.",
	},
	{
		title: "Clarify the Question",
		image: "",
		alt: "Slide illustration",
		text: "Before solving anything, make sure youre solving the right problem.",
	},
	{
		title: "Compare Perspectives",
		image: "",
		alt: "Slide illustration",
		text: "Look for competing explanations and test which one fits the facts best.",
	},
	{
		title: "Reason Step-by-Step",
		image: "",
		alt: "Slide illustration",
		text: "Build conclusions from evidence, not vibes and explain your chain of reasoning.",
	},
	{
		title: "Reflect and Improve",
		image: "",
		alt: "Slide illustration",
		text: "Review your conclusion and ask what could change your mind with new evidence.",
	},
];

let criticalCarouselActive = 0;

const criticalStage = document.getElementById("critical-carousel-stage");
const criticalTitle = document.getElementById("critical-carousel-title");
const criticalCountLabel = document.getElementById("critical-carousel-countLabel");
const criticalCountWrap = document.getElementById("critical-carousel-countWrap");
const criticalLive = document.getElementById("critical-carousel-live");
const criticalPrev = document.getElementById("critical-carousel-prev");
const criticalNext = document.getElementById("critical-carousel-next");

function criticalEscapeHtml(str) {
	return String(str).replace(/[&<>"']/g, (m) => {
		return (
			{
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#039;",
			}[m] || m
		);
	});
}

function criticalRenderSlides() {
	criticalStage.innerHTML = "";

	criticalCarouselSlides.forEach((s, idx) => {
		const slide = document.createElement("div");
		slide.className = "slide";
		slide.dataset.idx = idx;

		slide.innerHTML = `
			<div class="slide__body">
				<div class="slide__imgCol">
					${
						s.image
							? `<img class="slide__img" src="${s.image}" alt="${criticalEscapeHtml(
									s.alt || "",
							  )}" />`
							: `
								<div class="slide__imgPlaceholder" role="img" aria-label="${criticalEscapeHtml(
									s.alt || "Image placeholder",
							  )}">
									<div class="slide__imgPlaceholderInner">
										<svg viewBox="0 0 96 72" role="presentation" focusable="false" aria-hidden="true">
											<rect x="6" y="6" width="84" height="60" rx="6" fill="#eef3f9" stroke="#d6dde8" stroke-width="2"></rect>
											<circle cx="30" cy="30" r="8" fill="#c5cfdd"></circle>
											<path d="M16 56l18-18 12 12 14-14 20 20" fill="none" stroke="#b5c0d0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
										</svg>
									</div>
								</div>
							`
					}
				</div>
				<div class="slide__textCol">
					<p class="slide__text">${s.text}</p>
				</div>
			</div>
		`;

		criticalStage.appendChild(slide);
	});

	criticalUpdateUI(true);
}

function criticalSetTransforms() {
	const all = criticalStage.querySelectorAll(".slide");
	all.forEach((el, idx) => {
		const pos = idx - criticalCarouselActive;
		el.style.transform = `translateX(${pos * 100}%)`;
		el.classList.toggle("is-active", idx === criticalCarouselActive);
	});
}

function criticalUpdateUI(skipLive) {
	const s = criticalCarouselSlides[criticalCarouselActive];
	criticalTitle.textContent = s.title;
	criticalCountLabel.textContent = `${criticalCarouselActive + 1} / ${
		criticalCarouselSlides.length
	}`;
	criticalCountWrap.setAttribute(
		"aria-label",
		`Slide ${criticalCarouselActive + 1} of ${criticalCarouselSlides.length}`,
	);

	criticalSetTransforms();

	if (!skipLive) {
		criticalLive.textContent = `Slide ${criticalCarouselActive + 1}`;
	}
}

function criticalNextSlide() {
	criticalCarouselActive =
		criticalCarouselActive + 1 < criticalCarouselSlides.length
			? criticalCarouselActive + 1
			: 0;
	criticalUpdateUI(false);
}

function criticalPrevSlide() {
	criticalCarouselActive =
		criticalCarouselActive - 1 >= 0
			? criticalCarouselActive - 1
			: criticalCarouselSlides.length - 1;
	criticalUpdateUI(false);
}

criticalPrev.addEventListener("click", criticalPrevSlide);
criticalNext.addEventListener("click", criticalNextSlide);

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") criticalPrevSlide();
	if (e.key === "ArrowRight") criticalNextSlide();
});

criticalRenderSlides();
