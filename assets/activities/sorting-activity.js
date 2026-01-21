const sortCategories = [
	{ id: "aaron", title: "Aaron's", total: 1 },
	{ id: "soraiya", title: "Soraiya's", total: 1 },
];

const sortItems = [
	{
		id: "i1",
		text: "Responds quickly without analyzing the situation carefully. ",

		categoryId: "aaron",
		feedbackCorrect:
			"Critical thinking takes time and effort. We need to move from automatic thinking to more deliberate and analytical thinking, but Aaron rushes to judgment.",
		feedbackIncorrect:
			"Critical thinking takes time and effort. We need to move from automatic thinking to more deliberate and analytical thinking, but Aaron rushes to judgment. ",
	},
	{
		id: "i2",
		text: "Takes time to analyze the situation more carefully and to seek new information. ",

		categoryId: "soraiya",
		feedbackCorrect:
			"Critical thinking requires us to take the time to carefully analyze a situation. Through our analysis, questions will likely emerge causing us to seek out new information. ",
		feedbackIncorrect:
			"Critical thinking requires us to take the time to carefully analyze a situation. Through our analysis, questions will likely emerge causing us to seek out new information. ",
	},
];

const sortSelected = Object.fromEntries(sortItems.map((it) => [it.id, "0"]));
let sortActiveItemId = null;
let sortHasChecked = false;
let sortIsChecking = false;

const sortCategoryGrid = document.getElementById("sortCategoryGrid");
const sortItemsList = document.getElementById("sortItemsList");
const sortItemsDropzone = document.getElementById("sortItemsDropzone");
const sortLive = document.getElementById("sortLive");
const sortItemsMenuWrap = document.getElementById("sortItemsMenuWrap");
const sortItemsDropdown = document.getElementById("sortItemsDropdown");
const sortItemsDropdownMenu = document.getElementById("sortItemsDropdownMenu");
const sortItemsDropdownSubmit = document.querySelector(
	".sort-items-dropdown-submit",
);
const sortCheckBtn = document.getElementById("sortCheckBtn");
const sortTryAgainBtn = document.getElementById("sortTryAgainBtn");
const sortActions = document.getElementById("sortActions");

function sortGetItem(itemId) {
	return sortItems.find((it) => it.id === itemId);
}

function sortIsCorrect(itemId) {
	const item = sortGetItem(itemId);
	if (!item) return false;
	return sortSelected[itemId] === item.categoryId;
}

function sortCountCorrect() {
	return sortItems.filter((it) => sortIsCorrect(it.id)).length;
}

function sortAnnounce(msg) {
	if (sortLive) sortLive.textContent = msg;
}

function sortCountInCategory(catId) {
	return Object.values(sortSelected).filter((v) => v === catId).length;
}

function sortSelectItem(itemId) {
	if (sortHasChecked) return;
	sortActiveItemId = sortActiveItemId === itemId ? null : itemId;
	sortRender();
}

function sortMoveSelectedTo(catId) {
	if (sortHasChecked) return;
	if (!sortActiveItemId) return;
	sortSelected[sortActiveItemId] = catId;
	sortAnnounce(`Moved item to ${catId === "0" ? "Sortable Items" : catId}`);
	sortActiveItemId = null;
	sortRender();
}

function sortSetItemToCategory(itemId, catId) {
	if (sortHasChecked) return;
	sortSelected[itemId] = catId;
}

function sortGetItemsInCategory(catId) {
	return sortItems.filter((it) => sortSelected[it.id] === catId);
}

sortItemsDropzone.addEventListener("dragover", (e) => {
	e.preventDefault();
	if (sortHasChecked) return;
	sortItemsDropzone.classList.add("drag-over");
});

sortItemsDropzone.addEventListener("dragleave", () => {
	sortItemsDropzone.classList.remove("drag-over");
});

sortItemsDropzone.addEventListener("drop", (e) => {
	e.preventDefault();
	sortItemsDropzone.classList.remove("drag-over");
	if (sortHasChecked) return;

	const itemId = e.dataTransfer.getData("text/plain");
	if (!itemId) return;

	sortSelected[itemId] = "0";
	sortActiveItemId = null;
	sortRender();
});

sortItemsDropzone.addEventListener("click", (e) => {
	if (sortHasChecked) return;
	if (!sortActiveItemId) return;

	const clickedCard = e.target.closest(".sortable");
	if (clickedCard) return;

	sortMoveSelectedTo("0");
});

sortItemsDropzone.addEventListener("keydown", (e) => {
	if (sortHasChecked) return;
	if (!sortActiveItemId) return;
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		sortMoveSelectedTo("0");
	}
});

function sortApplyPoolMenuSelection(chosenIds) {
	for (const itemId of chosenIds) {
		sortSetItemToCategory(itemId, "0");
	}
	sortActiveItemId = null;
	sortRender();
}

function sortApplyMenuSelection(categoryId, chosenIds) {
	if (sortHasChecked) return;
	for (const itemId of chosenIds) {
		sortSetItemToCategory(itemId, categoryId);
	}

	const currentlyInCategory = sortGetItemsInCategory(categoryId).map(
		(it) => it.id,
	);
	for (const itemId of currentlyInCategory) {
		if (!chosenIds.includes(itemId)) {
			sortSetItemToCategory(itemId, "0");
		}
	}

	sortActiveItemId = null;
	sortRender();
}

function sortRender() {
	document.body.classList.toggle("is-checked", sortHasChecked);

	sortCategoryGrid.innerHTML = "";
	sortCategories.forEach((cat) => {
		const wrap = document.createElement("div");
		wrap.className = "category";

		const dropdownId = `sort-dropdown-${cat.id}`;

		wrap.innerHTML = `
			<div class="category-header">
				<div class="category-title">${cat.title}</div>
				<div class="category-menu">
					<d2l-dropdown-context-menu text="${cat.title}" id="${dropdownId}">
						<d2l-dropdown-menu trap-focus max-height="500" no-auto-close>
							<d2l-menu label="${cat.title}">
								${sortItems
									.map((it) => {
										const isHere = sortSelected[it.id] === cat.id;
										return `
											<d2l-menu-item-checkbox
												id="${it.id}"
												text="${it.text.replaceAll('"', "&quot;")}"
												${isHere ? "selected" : ""}
											></d2l-menu-item-checkbox>
										`;
									})
									.join("")}
							</d2l-menu>
							<d2l-button-subtle primary slot="footer"
								class="dropdown-submit-button"
								text="Submit">
							</d2l-button-subtle>
						</d2l-dropdown-menu>
					</d2l-dropdown-context-menu>
				</div>
			</div>
			<div class="category-content ${
				sortActiveItemId ? "ready-to-drop" : ""
			}" data-dropzone="${cat.id}" role="button" tabindex="0"
				aria-label="Drop into ${cat.title}">
				<p class="category-info">
					Sortable Items: ${sortCountInCategory(cat.id)} / ${cat.total}
				</p>
				<ul class="category-items" id="sort-cat-${cat.id}"></ul>
				<div class="category-plus" aria-hidden="true">
					<d2l-icon icon="tier1:plus-large-thick"></d2l-icon>
				</div>
			</div>
		`;

		sortCategoryGrid.appendChild(wrap);

		const list = wrap.querySelector(`#sort-cat-${cat.id}`);
		sortItems.forEach((it) => {
			if (sortSelected[it.id] !== cat.id) return;
			list.appendChild(sortBuildSortable(it));
		});

		const dropzone = wrap.querySelector(".category-content");
		dropzone.addEventListener("click", () => sortMoveSelectedTo(cat.id));
		dropzone.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				sortMoveSelectedTo(cat.id);
			}
		});

		dropzone.addEventListener("dragover", (e) => {
			e.preventDefault();
			if (sortHasChecked) return;
			dropzone.classList.add("drag-over");
		});
		dropzone.addEventListener("dragleave", () => {
			dropzone.classList.remove("drag-over");
		});
		dropzone.addEventListener("drop", (e) => {
			e.preventDefault();
			dropzone.classList.remove("drag-over");
			if (sortHasChecked) return;

			const itemId = e.dataTransfer.getData("text/plain");
			if (!itemId) return;

			sortSelected[itemId] = cat.id;
			sortActiveItemId = null;
			sortRender();
		});

		const contextMenu = wrap.querySelector(`#${dropdownId}`);
		const dropdownMenu = wrap.querySelector("d2l-dropdown-menu");
		const submitBtn = wrap.querySelector(".dropdown-submit-button");

		dropdownMenu.addEventListener("d2l-dropdown-open", () => {
			if (sortHasChecked) return;
			const checkboxes = dropdownMenu.querySelectorAll(
				"d2l-menu-item-checkbox",
			);
			checkboxes.forEach((cb) => {
				const id = cb.id;
				if (sortSelected[id] === cat.id) cb.setAttribute("selected", "");
				else cb.removeAttribute("selected");
			});
		});

		submitBtn.addEventListener("click", () => {
			if (sortHasChecked) return;
			const chosen = Array.from(
				dropdownMenu.querySelectorAll("d2l-menu-item-checkbox[selected]"),
			).map((el) => el.id);

			sortApplyMenuSelection(cat.id, chosen);

			if (typeof dropdownMenu.close === "function") dropdownMenu.close();
			if ("opened" in contextMenu) contextMenu.opened = false;
		});
	});

	sortItemsList.innerHTML = "";
	let poolCount = 0;
	sortItems.forEach((it) => {
		if (sortSelected[it.id] !== "0") return;
		poolCount++;
		sortItemsList.appendChild(sortBuildSortable(it));
	});

	if (sortItemsMenuWrap) {
		sortItemsMenuWrap.classList.toggle("is-hidden", poolCount !== 0);
	}

	sortItemsDropzone.classList.toggle(
		"ready-to-drop",
		Boolean(sortActiveItemId),
	);
	sortItemsDropzone.classList.toggle("is-empty", poolCount === 0);
}

function sortBuildSortable(it) {
	const li = document.createElement("li");
	li.className = "sortable";
	li.draggable = !sortHasChecked;
	li.tabIndex = 0;
	li.dataset.id = it.id;
	li.setAttribute("draggable", sortHasChecked ? "false" : "true");

	if (sortActiveItemId === it.id) {
		li.classList.add("is-selected");
		li.setAttribute("aria-selected", "true");
	} else {
		li.setAttribute("aria-selected", "false");
	}

	const feedbackClass = sortIsCorrect(it.id) ? "correct" : "incorrect";
	const feedbackText = sortIsCorrect(it.id) ? "Correct!" : "Incorrect";
	const feedbackDetail = sortIsCorrect(it.id)
		? it.feedbackCorrect
		: it.feedbackIncorrect;
	const feedbackIcon = sortIsCorrect(it.id)
		? `<svg viewBox="0 0 18 18" aria-hidden="true">
				<path d="M6.47 11.35l7.94-8.382c.57-.6 1.52-.627 2.122-.057.6.57.627 1.52.057 2.123l-9 9.5-.016.014-.014.015c-.58.582-1.52.586-2.106.015l-.02-.02-3.995-3.994c-.587-.585-.587-1.535 0-2.12.584-.586 1.534-.586 2.12 0l2.91 2.91z" fill="currentColor"></path>
			</svg>`
		: `<svg viewBox="0 0 18 18" aria-hidden="true">
				<path d="M10.03 9l4.95-4.95a1 1 0 0 0-1.415-1.415L8.615 7.585 3.665 2.635A1 1 0 0 0 2.25 4.05L7.2 9l-4.95 4.95a1 1 0 1 0 1.415 1.415l4.95-4.95 4.95 4.95a1 1 0 0 0 1.415-1.415L10.03 9z" fill="currentColor"></path>
			</svg>`;

	li.innerHTML = `
		<div class="drag-handle" aria-hidden="true">
			<d2l-icon icon="tier1:dragger"></d2l-icon>
		</div>
		<p class="sortable-text">${it.text}</p>
		<div class="sortable-feedback ${feedbackClass}">
			${feedbackIcon}
			<span>${feedbackText}</span>
		</div>
		<div class="sortable-feedback-text">${feedbackDetail}</div>
	`;

	li.addEventListener("click", (e) => {
		e.stopPropagation();
		sortSelectItem(it.id);
	});

	li.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			sortSelectItem(it.id);
		}
	});

	li.addEventListener("dragstart", (e) => {
		if (sortHasChecked) return;
		li.setAttribute("aria-grabbed", "true");
		e.dataTransfer.setData("text/plain", it.id);
		e.dataTransfer.effectAllowed = "move";
	});

	return li;
}

function sortInitItemsMenu() {
	if (!sortItemsDropdownMenu || !sortItemsDropdownSubmit || !sortItemsDropdown)
		return;

	sortItemsDropdownMenu.innerHTML = sortItems
		.map(
			(it) => `
			<d2l-menu-item-checkbox
				id="pool-${it.id}"
				text="${it.text.replaceAll('"', "&quot;")}"
			></d2l-menu-item-checkbox>
		`,
		)
		.join("");

	sortItemsDropdownMenu.addEventListener("d2l-dropdown-open", () => {
		const checkboxes = sortItemsDropdownMenu.querySelectorAll(
			"d2l-menu-item-checkbox",
		);
		checkboxes.forEach((cb) => {
			const itemId = cb.id.replace("pool-", "");
			if (sortSelected[itemId] === "0") cb.setAttribute("selected", "");
			else cb.removeAttribute("selected");
		});
	});

	sortItemsDropdownSubmit.addEventListener("click", () => {
		const chosen = Array.from(
			sortItemsDropdownMenu.querySelectorAll(
				"d2l-menu-item-checkbox[selected]",
			),
		).map((el) => el.id.replace("pool-", ""));

		sortApplyPoolMenuSelection(chosen);

		if (typeof sortItemsDropdownMenu.close === "function")
			sortItemsDropdownMenu.close();
		if ("opened" in sortItemsDropdown) sortItemsDropdown.opened = false;
	});
}

sortItemsDropzone.addEventListener("click", () => {
	if (sortActiveItemId) return;
	if (!sortItemsMenuWrap?.classList.contains("is-hidden")) {
		if ("opened" in sortItemsDropdown) sortItemsDropdown.opened = true;
	}
});

sortItemsDropzone.addEventListener("keydown", (e) => {
	if (sortActiveItemId) return;
	if (e.key === "Enter" || e.key === " ") {
		if (!sortItemsMenuWrap?.classList.contains("is-hidden")) {
			e.preventDefault();
			if ("opened" in sortItemsDropdown) sortItemsDropdown.opened = true;
		}
	}
});

function sortCheckAnswers() {
	if (sortIsChecking || sortHasChecked) return;
	sortSetCheckingUI(true);
	setTimeout(() => {
		sortHasChecked = true;
		const correct = sortCountCorrect();
		sortAnnounce(`Checked answers. ${correct} of ${sortItems.length} correct.`);
		sortRender();
		sortUpdateButtons();
		sortUpdateFeedback();
		sortSetCheckingUI(false);
	}, 700);
}

function sortSetCheckingUI(checking) {
	sortIsChecking = checking;
	if (!sortActions) return;
	sortActions.classList.toggle("loading", checking);
}

function sortTryAgain() {
	if (sortIsChecking) return;
	sortHasChecked = false;
	sortActiveItemId = null;
	sortRender();
	sortUpdateButtons();
	sortUpdateFeedback(true);
}

function sortUpdateButtons() {
	if (!sortCheckBtn || !sortTryAgainBtn) return;
	sortCheckBtn.classList.toggle("is-hidden", sortHasChecked);
	sortTryAgainBtn.classList.toggle("is-hidden", !sortHasChecked);
}

function sortUpdateFeedback(clear = false) {
	const rows = document.querySelectorAll(".sorting-activity .category-content");
	rows.forEach((row) => {
		row.classList.remove("correct", "incorrect");
	});
	if (clear || !sortHasChecked) return;

	sortItems.forEach((it) => {
		const target = document.querySelector(
			`.sorting-activity [data-dropzone="${sortSelected[it.id]}"]`,
		);
		if (!target) return;
		target.classList.toggle("correct", sortIsCorrect(it.id));
		target.classList.toggle("incorrect", !sortIsCorrect(it.id));
	});
}

sortInitItemsMenu();
sortUpdateButtons();
sortRender();
sortUpdateFeedback(true);

if (sortCheckBtn) sortCheckBtn.addEventListener("click", sortCheckAnswers);
if (sortTryAgainBtn) sortTryAgainBtn.addEventListener("click", sortTryAgain);
