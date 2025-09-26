class QuizUI {
    constructor() {

        this.questionTextElement = document.getElementById('question-text');
        this.answerButtonsElement = document.getElementById('answer-buttons');
        this.nextButton = document.getElementById('next-btn');
        this.feedbackContainer = document.getElementById('feedback-container');
        this.scrumGuideQuoteElement = document.getElementById('scrum-guide-quote');
        this.scoreContainer = document.getElementById('score-container');
        this.scoreElement = document.getElementById('score');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.restartButton = document.getElementById('restart-btn');
        this.quizSetupElement = document.getElementById('quiz-setup');
        this.questionCountSelect = document.getElementById('question-count');
        this.startQuizButton = document.getElementById('start-quiz-btn');
        this.quizContainer = document.getElementById('quiz-container');


        if (!this.quizSetupElement) console.error('quiz-setup nicht gefunden');
        if (!this.questionCountSelect) console.error('question-count nicht gefunden');
        if (!this.startQuizButton) console.error('start-quiz-btn nicht gefunden');
    }

    showSetup() {
        if (this.quizSetupElement) {
            this.quizSetupElement.classList.remove('hidden');
            this.quizContainer.classList.add('hidden');
            this.scoreContainer.classList.add('hidden');
        }
    }

    hideSetup() {
        if (this.quizSetupElement && this.quizContainer) {
            this.quizSetupElement.classList.add('hidden');
            this.quizContainer.classList.remove('hidden');
        }
    }
    resetState() {
        this.nextButton.classList.add('hidden');
        this.feedbackContainer.classList.add('hidden');
        while (this.answerButtonsElement.firstChild) {
            this.answerButtonsElement.removeChild(this.answerButtonsElement.firstChild);
        }
    }

    bindStartQuizClick(callback) {
        if (this.startQuizButton) {
            this.startQuizButton.addEventListener('click', () => {
                const questionCount = parseInt(this.questionCountSelect.value);
                callback(questionCount);
            });
        }
    }

    bindNextButtonClick(callback) {
        this.nextButton.addEventListener('click', callback);
    }

    showQuestion(question, currentIndex, totalQuestions) {
        this.resetState();

        this.questionTextElement.innerHTML = `
            <div style="font-weight: bold; color: #666; margin-bottom: 10px;">
                Frage ${currentIndex + 1} von ${totalQuestions}
            </div>
            ${question.question}
        `;

        // ✅ PRÜFEN OB MEHRFACHAUSWAHL (Array bei correctIndex)
        const isMultipleChoice = Array.isArray(question.correctIndex);

        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('btn', 'answer-btn');
            button.dataset.index = index;

            // ✅ FÜR MEHRFACHAUSWAHL: TOGGLE FUNKTIONALITÄT
            if (isMultipleChoice) {
                button.addEventListener('click', () => {
                    button.classList.toggle('selected');
                    if (button.classList.contains('selected')) {
                        button.style.backgroundColor = '#d1ecf1';
                        button.style.border = '2px solid #17a2b8';
                    } else {
                        button.style.backgroundColor = '';
                        button.style.border = '';
                    }
                });
            }

            this.answerButtonsElement.appendChild(button);
        });

        // ✅ BESTÄTIGUNGS-BUTTON FÜR MEHRFACHAUSWAHL
        if (isMultipleChoice) {
            const confirmButton = document.createElement('button');
            confirmButton.innerText = '✅ Antworten bestätigen';
            confirmButton.classList.add('btn', 'confirm-btn');
            confirmButton.style.marginTop = '10px';
            confirmButton.style.backgroundColor = '#28a745';
            this.answerButtonsElement.appendChild(confirmButton);
        }

        // Skip Button
        const skipButton = document.createElement('button');
        skipButton.innerText = '⏭️ Frage überspringen';
        skipButton.classList.add('btn', 'skip-btn');
        skipButton.style.marginTop = '10px';
        skipButton.style.backgroundColor = '#6c757d';
        this.answerButtonsElement.appendChild(skipButton);
    }

    showFeedback(selectedIndex, correctIndex, isCorrect) {
        // KEIN Text-Feedback, nur Buttons deaktivieren
        this.feedbackContainer.classList.add('hidden');

        const allButtons = this.answerButtonsElement.querySelectorAll('button');
        allButtons.forEach(button => {
            button.disabled = true;
            const buttonIndex = parseInt(button.dataset.index);

            // ✅ FARBLICHE MARKIERUNG:
           if (buttonIndex === selectedIndex) {
                       // Angeklickte Antwort BLAU markieren
                       button.style.backgroundColor = '#d1ecf1';
                       button.style.border = '2px solid #17a2b8';
                       button.style.color = '#0c5460';
                   } else {
                       // Andere Buttons grau
                       button.style.backgroundColor = '#e9ecef';
                       button.style.color = '#6c757d';
                   }
               });

        // Weiter Button anzeigen
        this.nextButton.classList.remove('hidden');
    }

    showScore(score, totalQuestions, wrongAnswers) {
        this.resetState();

        const percentage = Math.round((score / totalQuestions) * 100);
        const wrongCount = totalQuestions - score;

        let message = '';
        if (percentage >= 80) {
            message = 'Herzlichen Glückwunsch! Exzellentes Scrum-Wissen! 🎉';
        } else if (percentage >= 60) {
            message = 'Gut gemacht! Solide Scrum-Kenntnisse! 👍';
        } else {
            message = 'Weiter üben! Du schaffst das beim nächsten Mal! 💪';
        }

        this.questionTextElement.innerHTML = `
            <h2>Quiz abgeschlossen!</h2>
            <p>${message}</p>
        `;

        this.scoreElement.innerText = score;
        this.totalQuestionsElement.innerText = totalQuestions;

        document.getElementById('correct-count').textContent = score;
        document.getElementById('wrong-count').textContent = wrongCount;

        const wrongQuestionsList = document.getElementById('wrong-questions-list');
        const wrongQuestionsContainer = document.getElementById('wrong-questions');

        if (wrongAnswers.length > 0) {
            wrongQuestionsList.style.display = 'block';
            wrongQuestionsContainer.innerHTML = '';

            wrongAnswers.forEach((wrong, index) => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '15px';
                listItem.style.padding = '10px';
                listItem.style.backgroundColor = '#f8f9fa';
                listItem.style.borderRadius = '5px';
                listItem.innerHTML = `
                    <strong>Frage ${index + 1}:</strong> ${wrong.question}<br>
                    <span style="color: red;">✗ Deine Antwort: ${wrong.selectedAnswer}</span><br>
                    <span style="color: green;">✓ Richtige Antwort: ${wrong.correctAnswer}</span><br>
                    <em style="color: #666;">Scrum Guide: "${wrong.quote}"</em>
                `;
                wrongQuestionsContainer.appendChild(listItem);
            });
        } else {
            wrongQuestionsList.style.display = 'none';
        }

        this.scoreContainer.classList.remove('hidden');
    }

    bindAnswerClick(callback) {
        this.answerButtonsElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('answer-btn')) {
                const selectedIndex = parseInt(event.target.dataset.index);

                // ✅ FÜR EINFACHE ANTWORTEN: SOFORT CALLBACK
                if (!event.target.classList.contains('selected')) {
                    callback([selectedIndex], false); // Als Array übergeben
                }
            }
            else if (event.target.classList.contains('confirm-btn')) {
                // ✅ FÜR MEHRFACHAUSWAHL: ALLE AUSGEWÄHLTEN ANTWORTEN SAMMELN
                const selectedButtons = this.answerButtonsElement.querySelectorAll('.answer-btn.selected');
                const selectedIndices = Array.from(selectedButtons).map(btn => parseInt(btn.dataset.index));
                callback(selectedIndices, false);
            }
            else if (event.target.classList.contains('skip-btn')) {
                callback([-1], true); // Als Array für Konsistenz
            }
        });
    }

    bindRestartButtonClick(callback) {
        this.restartButton.addEventListener('click', callback);
    }

}