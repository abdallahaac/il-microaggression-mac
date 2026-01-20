import { scormApi } from "./scorm-api.js";

const parseScormName = (raw, fallback) => {
	let firstName = "";
	let lastName = "";
	const trimmed = String(raw || "").trim();
	if (!trimmed) {
		return { firstName, lastName, display: fallback || "learner" };
	}

	if (trimmed.includes(",")) {
		const [last, first] = trimmed.split(",").map((part) => part.trim());
		lastName = last || "";
		firstName = first || "";
	} else {
		const parts = trimmed.split(/\s+/);
		if (parts.length === 1) {
			firstName = parts[0];
		} else {
			firstName = parts.slice(0, -1).join(" ");
			lastName = parts.slice(-1)[0];
		}
	}

	const display =
		[firstName, lastName].filter(Boolean).join(" ") || fallback || "learner";
	return { firstName, lastName, display };
};

export const initScormCourse = ({ learnerNameSelector = "#learner-name" } = {}) => {
	const connected = scormApi.init();
	let shouldRestoreResults = false;

	if (connected) {
		const learnerSpan = document.querySelector(learnerNameSelector);
		const fallbackName = "learner";
		const rawName = scormApi.get("cmi.core.student_name") || "";

		if (rawName) {
			const { display } = parseScormName(rawName, fallbackName);
			if (learnerSpan) learnerSpan.textContent = display;
		} else if (learnerSpan) {
			learnerSpan.textContent = fallbackName;
		}

		const lessonStatus = scormApi.get("cmi.core.lesson_status");
		if (lessonStatus === "completed" || lessonStatus === "passed") {
			shouldRestoreResults = true;
		} else {
			scormApi.set("cmi.core.lesson_status", "incomplete");
			scormApi.save();
		}
	}

	return { connected, shouldRestoreResults };
};

export const recordScore = (rawScore, passingScore = 75) => {
	if (!scormApi.handle) return;
	const roundedScore = Number.isFinite(rawScore)
		? Math.round(rawScore)
		: 0;

	scormApi.set("cmi.core.score.min", "0");
	scormApi.set("cmi.core.score.max", "100");
	scormApi.set("cmi.core.score.raw", String(roundedScore));
	scormApi.set(
		"cmi.core.lesson_status",
		roundedScore >= passingScore ? "passed" : "failed",
	);
	scormApi.save();
};

export const finishScorm = () => {
	if (!scormApi.handle) return;
	scormApi.quit();
};
