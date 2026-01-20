import { initTabs } from "./ui/tabs.js";
import { initFlipCards } from "./ui/flip-cards.js";
import { initTranscriptToggles } from "./ui/transcript.js";
import { initHeaderScroll } from "./ui/header-scroll.js";
import { initBackToTop } from "./ui/back-to-top.js";
import { getQuizData, PASSING_SCORE } from "./quiz/quiz-data.js";
import { renderQuiz } from "./quiz/quiz-render.js";
import { gradeQuiz } from "./quiz/quiz-grade.js";
import { initScormCourse, recordScore, finishScorm } from "./scorm/scorm-course.js";
import { qs } from "./utils/dom.js";

document.addEventListener("DOMContentLoaded", () => {
	initTabs();
	initFlipCards();
	initTranscriptToggles();
	initHeaderScroll();
	initBackToTop();

	const quizForm = qs("#quiz-form");
	const resultsDiv = qs("#quiz-results");
	const submitBtn = qs("#submit-btn");
	const tryAgainBtn = qs("#try-again-btn");

	const lang = document.documentElement.lang || "en";
	const { questions, messages } = getQuizData(lang);

	const scormState = initScormCourse({ learnerNameSelector: "#learner-name" });

	const render = () => renderQuiz(quizForm, questions);
	const resetQuiz = () => {
		if (resultsDiv) {
			resultsDiv.classList.add("is-hidden");
			resultsDiv.classList.remove("passed", "failed");
		}
		if (tryAgainBtn) tryAgainBtn.classList.add("is-hidden");
		if (submitBtn) submitBtn.classList.remove("is-hidden");
		render();
	};

	const showResults = (submitToLms) => {
		const result = gradeQuiz({
			formEl: quizForm,
			resultsEl: resultsDiv,
			messages,
			passingScore: PASSING_SCORE,
		});

		if (scormState.connected && submitToLms) {
			recordScore(result.roundedScore, PASSING_SCORE);
		}

		if (submitBtn) submitBtn.classList.add("is-hidden");
		if (tryAgainBtn) tryAgainBtn.classList.remove("is-hidden");
	};

	render();

	if (scormState.shouldRestoreResults) {
		showResults(false);
	}

	if (submitBtn) submitBtn.addEventListener("click", () => showResults(true));
	if (tryAgainBtn) tryAgainBtn.addEventListener("click", resetQuiz);

	window.addEventListener("beforeunload", () => {
		if (scormState.connected) finishScorm();
	});
});
