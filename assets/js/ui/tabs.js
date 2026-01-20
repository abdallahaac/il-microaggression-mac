import { qs, qsa } from "../utils/dom.js";

export const initTabs = () => {
	const tabNav = qs(".tab-nav");
	const tabButtons = qsa(".tab-button");
	const tabPanels = qsa(".tab-panel");

	if (!tabNav || tabButtons.length === 0 || tabPanels.length === 0) return;

	const activateTab = (button) => {
		tabButtons.forEach((btn) => {
			btn.classList.remove("active");
			btn.setAttribute("aria-selected", "false");
			btn.setAttribute("tabindex", "-1");
		});
		tabPanels.forEach((panel) => {
			panel.classList.remove("active");
		});

		button.classList.add("active");
		button.setAttribute("aria-selected", "true");
		button.setAttribute("tabindex", "0");
		const targetPanel = qs(`#${button.getAttribute("aria-controls")}`);
		if (targetPanel) targetPanel.classList.add("active");
	};

	tabNav.addEventListener("click", (event) => {
		const button = event.target.closest(".tab-button");
		if (button) activateTab(button);
	});

	tabNav.addEventListener("keydown", (event) => {
		let newIndex;
		const currentIndex = tabButtons.findIndex(
			(tab) => tab === document.activeElement,
		);

		if (event.key === "ArrowRight") {
			newIndex = (currentIndex + 1) % tabButtons.length;
			event.preventDefault();
		} else if (event.key === "ArrowLeft") {
			newIndex =
				(currentIndex - 1 + tabButtons.length) % tabButtons.length;
			event.preventDefault();
		}

		if (newIndex !== undefined) {
			tabButtons[newIndex].focus();
			activateTab(tabButtons[newIndex]);
		}
	});
};
