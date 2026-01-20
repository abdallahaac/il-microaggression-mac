export const PASSING_SCORE = 75;

const quizData = {
	en: {
		questions: [
			{
				id: "q1",
				text:
					"1. According to the definition provided, microaggressions can be which of the following?",
				options: [
					{ text: "Only verbal insults.", value: "a" },
					{
						text: "Verbal, nonverbal, and environmental slights.",
						value: "b",
						correct: true,
					},
					{ text: "Only intentional actions.", value: "c" },
				],
			},
			{
				id: "q2",
				text:
					"2. Which statement is an example of a microaggression that dismisses historical trauma?",
				options: [
					{ text: "\"You don't look Indigenous.\"", value: "a" },
					{
						text: "\"Why don't you just get over it?\"",
						value: "b",
						correct: true,
					},
					{ text: "\"Can you tell me more about that?\"", value: "c" },
				],
			},
			{
				id: "q3",
				text:
					"3. What is a recommended approach for addressing bias in a group discussion?",
				options: [
					{
						text: "Model curiosity by asking open-ended questions.",
						value: "a",
						correct: true,
					},
					{ text: "Ignore the comment to avoid conflict.", value: "b" },
					{
						text: "Publicly shame the person who made the comment.",
						value: "c",
					},
				],
			},
		],
		messages: {
			correct: "Correct!",
			incorrectPrefix: "Incorrect. The correct answer is:",
			noAnswerPrefix: "No answer selected. The correct answer is:",
			passed: "You passed!",
			failed: "Please review the material.",
		},
	},
	fr: {
		questions: [
			{
				id: "q1",
				text:
					"1. Selon la définition fournie, les microagressions peuvent prendre laquelle des formes suivantes?",
				options: [
					{ text: "Seulement des insultes verbales.", value: "a" },
					{
						text: "Des affronts verbaux, non verbaux et environnementaux.",
						value: "b",
						correct: true,
					},
					{ text: "Seulement des actions intentionnelles.", value: "c" },
				],
			},
			{
				id: "q2",
				text:
					"2. Quel énoncé est un exemple de microagression qui ne tient pas compte du traumatisme historique?",
				options: [
					{
						text: "« Tu n’as pas l’air autochtone ».",
						value: "a",
					},
					{
						text: "« Pourquoi ne pas vous en remettre? »",
						value: "b",
						correct: true,
					},
					{
						text: "« Pouvez-vous m’en dire plus à ce sujet? »",
						value: "c",
					},
				],
			},
			{
				id: "q3",
				text:
					"3. Quelle est l’approche recommandée pour enrayer les préjugés dans une discussion de groupe?",
				options: [
					{
						text: "Faire preuve de curiosité en posant des questions ouvertes.",
						value: "a",
						correct: true,
					},
					{
						text: "Ignorer le commentaire pour éviter les conflits.",
						value: "b",
					},
					{
						text:
							"Faire honte publiquement à la personne qui a fait le commentaire.",
						value: "c",
					},
				],
			},
		],
		messages: {
			correct: "Correct!",
			incorrectPrefix: "Incorrect. La bonne réponse est :",
			noAnswerPrefix:
				"Aucune réponse sélectionnée. La bonne réponse est :",
			passed: "Vous avez réussi!",
			failed: "Veuillez réviser le contenu.",
		},
	},
};

export const getQuizData = (lang = "en") => quizData[lang] || quizData.en;
