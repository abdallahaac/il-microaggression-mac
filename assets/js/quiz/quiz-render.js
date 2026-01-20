import { shuffle } from "../utils/shuffle.js";

export const renderQuiz = (formEl, questions) => {
	if (!formEl) return;
	formEl.innerHTML = "";

	questions.forEach((question) => {
		const questionEl = document.createElement("fieldset");
		questionEl.className = "quiz-question";
		questionEl.id = question.id;

		const shuffledOptions = shuffle([...question.options]);
		const optionsHTML = shuffledOptions
			.map((option, index) => {
				const optionId = `${question.id}-opt-${index}`;
				return `
					<label for="${optionId}">
						<input type="radio" id="${optionId}" name="${
							question.id
						}" value="${option.value}" ${
							option.correct ? 'data-correct="true"' : ""
						}>
						<span class="custom-radio"></span>
						<span>${option.text}</span>
					</label>
				`;
			})
			.join("");

		questionEl.innerHTML = `
			<legend class="question-text">${question.text}</legend>
			<div class="options">${optionsHTML}</div>
			<div class="feedback"></div>
		`;

		formEl.appendChild(questionEl);
	});
};
