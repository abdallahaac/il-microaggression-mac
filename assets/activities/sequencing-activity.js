const terms = [
	{ key: "critical", label: "Critical\nThinking" },
	{ key: "strategic", label: "Strategic\nThinking" },
	{ key: "creative", label: "Creative\nThinking" },
	{ key: "problem", label: "Problem\nSolving" },
];

const termIcons = {
	critical: "tier1:search",
	strategic: "tier1:bullseye",
	creative: "tier1:style",
	problem: "tier1:gear",
};

const defs = [
	{
		key: "def_creative",
		text: "The ability to think or conceptualize in a new way and generate original, valuable ideas.",
	},
	{
		key: "def_strategic",
		text: "A mental process of planning a clear path toward a desired future goal.",
	},
	{
		key: "def_critical",
		text: "The process of analyzing available facts, evidence, and arguments to reach a reasoned judgment about what is true or right.",
	},
	{
		key: "def_problem",
		text: "The process of finding and choosing the best solution or option.",
	},
];

const answerKey = {
	critical: "def_critical",
	strategic: "def_strategic",
	creative: "def_creative",
	problem: "def_problem",
};

const hintKeywords = {
	critical: "judging/evaluating",
	strategic: "Plan",
	creative: "New",
	problem: "Solution",
};

const correctMessages = {
	critical:
		"That is correct! Thinking critically ultimate includes judging information.",
	strategic:
		"That is correct! We use our critical thinking skills to vet our options and choose a path that is based on reality not wishful thinking.",
	creative:
		"That's correct! Once we use our creative thinking skills to generate new ideas, we can critical thinking skills to refine them for practicality and feasibility.",
	problem:
		"That is correct! Critical thinking is a cognitive process used to complete the task of solving a problem. We must analyze the problem, generate a variety of options and then judge these options to arrive at a best solution.",
};

const debugKeyboard = true;

let assignments = {
	critical: "def_creative",
	strategic: "def_strategic",
	creative: "def_critical",
	problem: "def_problem",
};

const initialAssignments = { ...assignments };

const container = document.getElementById("seqContainer");
const alertWrap = document.getElementById("seqAlertWrap");
const alertHost = document.getElementById("alertHost");
const checkArea = document.getElementById("checkArea");
const checkBtn = document.getElementById("checkBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const srStatus = document.getElementById("srStatus");

let alertEl = null;
let hasChecked = false;

function buildFreshAlert() {
	alertHost.innerHTML = "";
	alertEl = document.createElement("d2l-alert");
	alertEl.setAttribute("type", "default");

	alertEl.addEventListener("d2l-alert-close", () => {
		alertWrap.classList.remove("show");
		srStatus.textContent = "";
		buildFreshAlert();
	});

	alertHost.appendChild(alertEl);
}

buildFreshAlert();

function getDefText(defKey) {
	return defs.find((d) => d.key === defKey)?.text || "";
}

function showAlert(type, message) {
	if (!alertEl) buildFreshAlert();

	alertEl.setAttribute("type", type);
	alertEl.textContent = message;
	alertWrap.classList.add("show");
	srStatus.textContent = message;
}

function isCorrect(termKey) {
	return assignments[termKey] === answerKey[termKey];
}

function countCorrect() {
	let correct = 0;
	for (const t of terms) {
		if (isCorrect(t.key)) correct++;
	}
	return correct;
}

function render() {
	const existingAlert = alertWrap;
	container.innerHTML = "";

	terms.forEach((t) => {
		const row = document.createElement("div");
		row.className = "seq-row";
		row.setAttribute("role", "listitem");
		row.dataset.term = t.key;

		/* Left */
		const left = document.createElement("div");
		left.className = "seq-left";

		const iconBox = document.createElement("div");
		iconBox.className = "left-icon";
		iconBox.innerHTML = `<d2l-icon icon="${termIcons[t.key]}"></d2l-icon>`;

		const label = document.createElement("div");
		label.className = "left-label";
		label.innerHTML = t.label.replace("\n", "<br/>");

		const dropWrap = document.createElement("div");
		dropWrap.className = "dropdown-wrap";

		let menu = null;
		let dropdown = null;
		if (!hasChecked) {
			dropdown = document.createElement("d2l-dropdown");
			dropdown.setAttribute("boundary", "viewport");
			dropdown.addEventListener("d2l-dropdown-open", () => {
				if (debugKeyboard) console.log("[seq] dropdown open", t.key);
				setTimeout(() => {
					if (menu) menu.focus();
				}, 0);
			});
			dropdown.addEventListener("d2l-dropdown-close", () => {
				if (debugKeyboard) console.log("[seq] dropdown close", t.key);
			});

			const trigger = document.createElement("d2l-button-icon");
			trigger.className = "chev-btn d2l-dropdown-opener";
			trigger.setAttribute("icon", "tier1:chevron-down");
			trigger.setAttribute(
				"text",
				`Select definition for ${t.label.replace("\n", " ")}`,
			);
			trigger.setAttribute("aria-label", `Choose definition for ${t.key}`);

			const dropContent = document.createElement("d2l-dropdown-content");
			dropContent.setAttribute("max-width", "420");
			dropContent.setAttribute("align", "start");
			dropContent.setAttribute("vertical-offset", "4");

			menu = document.createElement("d2l-menu");
			menu.setAttribute("label", t.label.replace("\n", " "));
			menu.setAttribute("aria-label", t.label.replace("\n", " "));
			menu.addEventListener("keydown", (e) => {
				if (debugKeyboard) {
					console.log("[seq] menu keydown", {
						key: e.key,
						target: e.target?.tagName,
					});
				}
				if (e.key !== " " && e.key !== "Enter") return;
				const focusedItem =
					menu.querySelector("d2l-menu-item-radio[tabindex=\"0\"]") ||
					menu.querySelector("d2l-menu-item-radio[selected]") ||
					menu.querySelector("d2l-menu-item-radio");
				if (!focusedItem || focusedItem.hasAttribute("disabled")) return;
				e.preventDefault();
				e.stopPropagation();
				const value = focusedItem.getAttribute("value");
				if (value) {
					assignDefinition(t.key, value);
					dropdown.opened = false;
				}
			});
			menu.addEventListener("d2l-menu-item-select", (e) => {
				if (debugKeyboard) {
					console.log("[seq] menu item select", {
						key: t.key,
						detail: e.detail,
					});
				}
				const path = e.composedPath ? e.composedPath() : [];
				const itemFromPath = path.find(
					(el) => el && el.tagName === "D2L-MENU-ITEM-RADIO",
				);
				const value =
					e.detail?.value ||
					itemFromPath?.getAttribute("value") ||
					e.target?.value ||
					e.target?.getAttribute("value");
				if (value && !itemFromPath?.hasAttribute("disabled")) {
					assignDefinition(t.key, value);
					contextMenu.opened = false;
				}
			});
			menu.addEventListener(
				"keydown",
				(e) => {
					if (debugKeyboard) {
						console.log("[seq] menu keydown capture", {
							key: e.key,
							target: e.target?.tagName,
						});
					}
					if (e.key !== " " && e.key !== "Enter") return;
					const path = e.composedPath ? e.composedPath() : [];
					const item = path.find(
						(el) => el && el.tagName === "D2L-MENU-ITEM-RADIO",
					);
					if (!item || item.hasAttribute("disabled")) return;
					e.preventDefault();
					e.stopPropagation();
					const value = item.getAttribute("value");
					if (value) {
						assignDefinition(t.key, value);
						dropdown.opened = false;
					}
				},
				true,
			);

			const currentDef = assignments[t.key];

			defs.forEach((d) => {
				const radio = document.createElement("d2l-menu-item-radio");
				radio.setAttribute("text", d.text);
				radio.setAttribute("value", d.key);

				if (d.key === currentDef) radio.setAttribute("selected", "");

				const used = new Set(Object.values(assignments));
				const usedElsewhere = used.has(d.key) && d.key !== currentDef;
				// Allow selecting any option; assignDefinition handles swapping.

				radio.addEventListener("click", () => {
					assignDefinition(t.key, d.key);
					dropdown.opened = false;
				});
				radio.addEventListener("keydown", (e) => {
					if (debugKeyboard) {
						console.log("[seq] radio keydown", {
							key: e.key,
							value: d.key,
						});
					}
					if (e.key !== "Enter") return;
					e.preventDefault();
					e.stopPropagation();
					assignDefinition(t.key, d.key);
					dropdown.opened = false;
				});
				radio.addEventListener("keyup", (e) => {
					if (debugKeyboard) {
						console.log("[seq] radio keyup", {
							key: e.key,
							value: d.key,
						});
					}
					if (e.key !== " ") return;
					e.preventDefault();
					e.stopPropagation();
					assignDefinition(t.key, d.key);
					dropdown.opened = false;
				});

				menu.appendChild(radio);
			});

			dropContent.appendChild(menu);
			dropdown.appendChild(trigger);
			dropdown.appendChild(dropContent);
			dropWrap.appendChild(dropdown);
		}

		left.appendChild(iconBox);
		left.appendChild(label);
		left.appendChild(dropWrap);

		/* Right */
		const right = document.createElement("div");
		right.className = "seq-right";

		const rightBox = document.createElement("div");
		rightBox.className = "seq-right-box";

		const answer = document.createElement("div");
		answer.className = "answer-card";
		if (hasChecked) answer.classList.add("no-grip");
		answer.setAttribute("draggable", hasChecked ? "false" : "true");
		answer.setAttribute("tabindex", "-1");
		answer.dataset.def = assignments[t.key];
		answer.dataset.term = t.key;
		answer.innerHTML = `
			${
				hasChecked
					? ""
					: `<div class="grip" aria-hidden="true">
						<d2l-icon icon="tier1:dragger"></d2l-icon>
					</div>`
			}
			<div class="answer-text">${getDefText(assignments[t.key])}</div>
		`;

		answer.addEventListener("dragstart", (e) => {
			if (hasChecked) return;
			answer.classList.add("dragging");
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", t.key);
		});

		answer.addEventListener("dragend", () => {
			answer.classList.remove("dragging");
			document
				.querySelectorAll(".seq-row")
				.forEach((r) => r.classList.remove("drop-target"));
		});

		row.addEventListener("dragover", (e) => {
			if (hasChecked) return;
			e.preventDefault();
			row.classList.add("drop-target");
		});

		row.addEventListener("dragleave", () => {
			if (hasChecked) return;
			row.classList.remove("drop-target");
		});

		row.addEventListener("drop", (e) => {
			if (hasChecked) return;
			e.preventDefault();
			row.classList.remove("drop-target");

			const fromTerm = e.dataTransfer.getData("text/plain");
			const toTerm = t.key;

			if (!fromTerm || fromTerm === toTerm) return;

			swapAssignments(fromTerm, toTerm);
		});

		const feedback = document.createElement("div");
		feedback.className = "seq-feedback";

		const correctNow = isCorrect(t.key);

		if (hasChecked) {
			feedback.classList.add("show");
			right.classList.add("checked", correctNow ? "correct" : "incorrect");

			if (correctNow) {
				feedback.classList.add("correct");
				rightBox.classList.add("correct");
				feedback.innerHTML = `
					<div class="seq-feedback-line correct">
						<span class="icon"><d2l-icon icon="tier1:check" style="color: var(--success);"></d2l-icon></span>
						<span>Correct</span>
					</div>
					<div class="seq-feedback-hint">${correctMessages[t.key]}</div>
				`;
			} else {
				feedback.classList.add("incorrect");
				rightBox.classList.add("wrong");
				feedback.innerHTML = `
					<div class="seq-feedback-line incorrect">
						<span class="icon"><d2l-icon icon="tier1:close-default" style="color: var(--danger);"></d2l-icon></span>
						<span>Incorrect</span>
					</div>
					<div class="seq-feedback-hint">
						Need a hint? Keyword: <strong>${hintKeywords[t.key]}</strong>
					</div>
				`;
			}
		}

		rightBox.appendChild(answer);
		rightBox.appendChild(feedback);
		right.appendChild(rightBox);
		row.appendChild(left);
		row.appendChild(right);
		container.appendChild(row);
	});

	container.appendChild(existingAlert);
}

function assignDefinition(termKey, defKey) {
	const otherTerm = Object.keys(assignments).find(
		(k) => assignments[k] === defKey,
	);

	if (otherTerm && otherTerm !== termKey) {
		const temp = assignments[termKey];
		assignments[termKey] = defKey;
		assignments[otherTerm] = temp;
	} else {
		assignments[termKey] = defKey;
	}

	render();
}

function swapAssignments(termA, termB) {
	const temp = assignments[termA];
	assignments[termA] = assignments[termB];
	assignments[termB] = temp;
	render();
}

function setCheckingUI(isChecking) {
	checkArea.classList.toggle("loading", isChecking);
	srStatus.textContent = isChecking ? "Checking answers..." : "";
}

function checkAnswers() {
	setCheckingUI(true);

	setTimeout(() => {
		hasChecked = true;
		tryAgainBtn.classList.remove("is-hidden");
		checkBtn.classList.add("is-hidden");
		const correct = countCorrect();

		if (correct === terms.length) {
			showAlert(
				"success",
				`Nice work you got ${correct} / ${terms.length} correct!`,
			);
		} else {
			showAlert("warning", `Try again you have ${correct} / ${terms.length} correct.`);
		}

		setCheckingUI(false);
		render();
	}, 900);
}

checkBtn.addEventListener("click", checkAnswers);

function resetActivity() {
	hasChecked = false;
	assignments = { ...initialAssignments };
	alertWrap.classList.remove("show");
	srStatus.textContent = "";
	buildFreshAlert();
	tryAgainBtn.classList.add("is-hidden");
	checkBtn.classList.remove("is-hidden");
	render();
}

tryAgainBtn.addEventListener("click", resetActivity);
render();
