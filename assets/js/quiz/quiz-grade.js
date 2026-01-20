export const gradeQuiz = ({
	formEl,
	resultsEl,
	messages,
	passingScore,
}) => {
	if (!formEl || !resultsEl) {
		return { finalScore: 0, roundedScore: 0, passed: false, total: 0 };
	}

	let score = 0;
	const questionElements = formEl.querySelectorAll(".quiz-question");

	questionElements.forEach((questionEl) => {
		const selected = questionEl.querySelector('input[type="radio"]:checked');
		const feedbackEl = questionEl.querySelector(".feedback");
		const correctOption = questionEl.querySelector('input[data-correct="true"]');
		const correctText = correctOption
			? correctOption
					.closest("label")
					?.querySelector("span:last-child")
					?.textContent || ""
			: "";

		questionEl
			.querySelectorAll('input[type="radio"]')
			.forEach((radio) => {
				radio.disabled = true;
			});

		if (selected) {
			if (selected.dataset.correct) {
				score += 1;
				feedbackEl.textContent = messages.correct;
				feedbackEl.className = "feedback correct";
			} else {
				feedbackEl.innerHTML = `${messages.incorrectPrefix} <strong>"${correctText}"</strong>`;
				feedbackEl.className = "feedback incorrect";
			}
		} else {
			feedbackEl.innerHTML = `${messages.noAnswerPrefix} <strong>"${correctText}"</strong>`;
			feedbackEl.className = "feedback incorrect";
		}

		feedbackEl.style.display = "block";
	});

	const total = questionElements.length || 1;
	const finalScore = (score / total) * 100;
	const roundedScore = Math.round(finalScore);
	const passed = finalScore >= passingScore;

	resultsEl.classList.remove("is-hidden");
	resultsEl.classList.remove("passed", "failed");
	resultsEl.classList.add(passed ? "passed" : "failed");
	resultsEl.textContent = passed ? messages.passed : messages.failed;

	return { finalScore, roundedScore, passed, total, correctCount: score };
};
