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
        this.currentSelectedIndices = []; // Array für Multiple-Choice
        this.answerChangeCallback = null; // Callback für Antwort-Änderungen

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
        this.currentSelectedIndices = []; // Auswahl zurücksetzen
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

    // NEU: Antwort-Änderungs-Callback binden
    bindAnswerChange(callback) {
        this.answerChangeCallback = callback;
    }

    showQuestion(question, currentIndex, totalQuestions) {
        this.resetState();

        this.questionTextElement.innerHTML = `
            <div style="font-weight: bold; color: #666; margin-bottom: 10px;">
                Frage ${currentIndex + 1} von ${totalQuestions}
            </div>
            ${question.question}
        `;

        const isMultipleChoice = Array.isArray(question.correctIndex);

        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('btn', 'answer-btn');
            button.dataset.index = index;

            //  VERBESSERT: Einheitliche Click-Handler
            button.addEventListener('click', () => {
                this.handleAnswerClick(index, isMultipleChoice);
            });

            this.answerButtonsElement.appendChild(button);
        });

        // BESTÄTIGUNGS-BUTTON FÜR ALLE FRAGENTYPEN (Single & Multiple Choice)
        const confirmButton = document.createElement('button');
        confirmButton.innerText = '✅ Antwort bestätigen';
        confirmButton.classList.add('btn', 'confirm-btn');
        confirmButton.style.marginTop = '10px';
        confirmButton.style.backgroundColor = '#28a745';
        confirmButton.addEventListener('click', () => {
            console.log('🔄 Confirm-Button geklickt', this.currentSelectedIndices);
            if (this.answerChangeCallback) {
                this.answerChangeCallback(this.currentSelectedIndices);
            }
        });
        this.answerButtonsElement.appendChild(confirmButton);
    }
    // NEU: Handle Antwort-Klicks (für Änderungen vor "Weiter")
    handleAnswerClick(clickedIndex, isMultipleChoice) {
        console.log('✅ Antwort geklickt:', clickedIndex, 'MultipleChoice:', isMultipleChoice);

        if (isMultipleChoice) {
            // Multiple-Choice: Toggle Logik
            if (this.currentSelectedIndices.includes(clickedIndex)) {
                this.currentSelectedIndices = this.currentSelectedIndices.filter(idx => idx !== clickedIndex);
            } else {
                this.currentSelectedIndices.push(clickedIndex);
            }
        } else{

                if (this.currentSelectedIndices.includes(clickedIndex)) {
                    this.currentSelectedIndices = []; // Antwort abwählen
                } else {
                    this.currentSelectedIndices = [clickedIndex]; // Neue Antwort auswählen
                }
            }

            this.updateAnswerDisplay();
        }

    // NEU: Visuelle Darstellung aktualisieren
    /*updateAnswerDisplay() {
        const allButtons = this.answerButtonsElement.querySelectorAll('.answer-btn');

        allButtons.forEach(button => {
            const buttonIndex = parseInt(button.dataset.index);

            if (this.currentSelectedIndices.includes(buttonIndex)) {
                button.style.backgroundColor = '#d1ecf1';
                button.style.border = '2px solid #17a2b8';
                button.style.color = '#0c5460';
                button.classList.add('selected');
            } else {
                button.style.backgroundColor = '';
                button.style.border = '';
                button.style.color = '';
                button.classList.remove('selected');
            }
        });
    }*/
    // NEU: Visuelle Darstellung aktualisieren
    updateAnswerDisplay() {
        const allButtons = this.answerButtonsElement.querySelectorAll('.answer-btn');
        allButtons.forEach(button => {
            const buttonIndex = parseInt(button.dataset.index);

            if (this.currentSelectedIndices.includes(buttonIndex)) {
                // ✅ AUSGEWÄHLTE ANTWORT
                button.style.backgroundColor = '#d1ecf1';
                button.style.border = '2px solid #17a2b8';
                button.style.color = '#0c5460';
                button.classList.add('selected');
            } else {
                // ✅ NICHT AUSGEWÄHLTE ANTWORT
                button.style.backgroundColor = '';
                button.style.border = '';
                button.style.color = '';
                button.classList.remove('selected');
            }
        });

        // VISUELLE RÜCKMELDUNG FÜR BESTÄTIGUNGS-BUTTON
        const confirmButton = this.answerButtonsElement.querySelector('.confirm-btn');
        if (confirmButton) {
            if (this.currentSelectedIndices.length > 0) {
                // ✅ ANTWORT AUSGEWÄHLT - Button aktiv
                confirmButton.style.backgroundColor = '#28a745';
                confirmButton.style.opacity = '1';
                confirmButton.disabled = false;
            } else {
                // ✅ KEINE ANTWORT AUSGEWÄHLT - Button inaktiv
                confirmButton.style.backgroundColor = '#6c757d';
                confirmButton.style.opacity = '0.6';
                confirmButton.disabled = true;
            }
        }
    }
showFeedback(selectedIndices) {
    this.feedbackContainer.classList.add('hidden');

    // BESTÄTIGUNGS-BUTTON DEAKTIVIEREN UND GRAU MACHEN
    const confirmButton = this.answerButtonsElement.querySelector('.confirm-btn');
    if (confirmButton) {
        confirmButton.style.backgroundColor = '#6c757d'; // Grau
        confirmButton.style.opacity = '0.6';
        confirmButton.disabled = true;
        confirmButton.innerText = '✅ Bestätigt';
        confirmButton.style.cursor = 'not-allowed';
    }

    // Aktuelle Auswahl speichern
    this.currentSelectedIndices = selectedIndices;
    this.updateAnswerDisplay();

    // Alle Antwort-Buttons deaktivieren
    const answerButtons = this.answerButtonsElement.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.disabled = true;
        button.style.cursor = 'not-allowed';
    });

    // Weiter-Button anzeigen
    this.nextButton.classList.remove('hidden');
}

    showScore(score, totalQuestions, wrongAnswers) {
         console.log('🏆 showScore aufgerufen', wrongAnswers.length, 'falsche Antworten');

        this.resetState();
        const percentage = Math.round((score / totalQuestions) * 100);
        const wrongCount = totalQuestions - score;

         let message = '';
            if (percentage >= 84) {
                message = 'Herzlichen Glückwunsch! Test bestanden! 🎉';
            } else {
                message = 'Test nicht bestanden. Weiter üben! 💪';
            }

            this.questionTextElement.innerHTML = `
                <h2>Quiz abgeschlossen!</h2>
                <p><strong>Erreicht: ${percentage}%</strong> (${score} von ${totalQuestions} Fragen richtig)</p>
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
                    <em style="color: #666;">${wrong.quote}</em>
                `;
                wrongQuestionsContainer.appendChild(listItem);
            });
        } else {
            wrongQuestionsList.style.display = 'none';
        }

        this.scoreContainer.classList.remove('hidden');
    }

    bindRestartButtonClick(callback) {
        this.restartButton.addEventListener('click', callback);
    }
}