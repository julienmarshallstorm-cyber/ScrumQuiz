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
        this.timerContainer = document.getElementById('timer-container');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeElement = document.getElementById('current-time');
        this.totalTimeElement = document.getElementById('total-time');

        if (!this.quizSetupElement) console.error('quiz-setup nicht gefunden');
        if (!this.questionCountSelect) console.error('question-count nicht gefunden');
        if (!this.startQuizButton) console.error('start-quiz-btn nicht gefunden');
    }

    showTimer() {
        if (this.timerContainer) {
            this.timerContainer.classList.remove('hidden');
        }
    }

    hideTimer() {
        if (this.timerContainer) {
            this.timerContainer.classList.add('hidden');
        }
        // Progress-Bar zurücksetzen
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
            this.progressBar.classList.remove('warning', 'danger');
        }
    }

    updateTimer(currentTime, totalTime) {
        if (!this.progressBar || !this.currentTimeElement) return;

        // Progress-Bar berechnen (0% - 100%)
        const progress = (currentTime / totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;

        // Farbwechsel bei wenig Zeit
        if (progress <= 25) {
            this.progressBar.classList.add('danger');
            this.progressBar.classList.remove('warning');
        } else if (progress <= 50) {
            this.progressBar.classList.add('warning');
            this.progressBar.classList.remove('danger');
        } else {
            this.progressBar.classList.remove('warning', 'danger');
        }

        // Zeit-Text formatieren (MM:SS)
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        this.currentTimeElement.textContent = formatTime(currentTime);
        this.totalTimeElement.textContent = formatTime(totalTime);
    }

    showSetup() {
        if (this.quizSetupElement) {
            this.quizSetupElement.classList.remove('hidden');
            this.quizContainer.classList.add('hidden');
            this.scoreContainer.classList.add('hidden');
            // Timer ausblenden
            this.hideTimer();
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

    // Antwort-Änderungs-Callback binden
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

            // Einheitliche Click-Handler
            button.addEventListener('click', () => {
                this.handleAnswerClick(index, isMultipleChoice);
            });

            this.answerButtonsElement.appendChild(button);
        });

        //  KEIN BESTÄTIGUNGS-BUTTON MEHR - WURDE ENTFERNT
    }

    // Handle Antwort-Klicks (für Änderungen vor "Weiter")
    handleAnswerClick(clickedIndex, isMultipleChoice) {
        console.log('✅ Antwort geklickt:', clickedIndex, 'MultipleChoice:', isMultipleChoice);

        if (isMultipleChoice) {
            // Multiple-Choice: Toggle Logik
            if (this.currentSelectedIndices.includes(clickedIndex)) {
                this.currentSelectedIndices = this.currentSelectedIndices.filter(idx => idx !== clickedIndex);
            } else {
                this.currentSelectedIndices.push(clickedIndex);
            }
        } else {
            // Single-Choice: Nur eine Antwort möglich - aber KORRIGIERBAR
            if (this.currentSelectedIndices.includes(clickedIndex)) {
                this.currentSelectedIndices = []; // Antwort abwählen
            } else {
                this.currentSelectedIndices = [clickedIndex]; // Neue Antwort auswählen
            }
        }

        this.updateAnswerDisplay();

        //  FÜR BEIDE FRAGENTYPEN: "Weiter"-Button sofort anzeigen
        // User kann Antworten weiter anpassen, hat aber Option zu wechseln
        if (this.currentSelectedIndices.length > 0) {
            this.nextButton.classList.remove('hidden');
        } else {
            this.nextButton.classList.add('hidden');
        }

        // FÜR SINGLE-CHOICE: Sofort Callback (für sofortige Auswertung)
        if (!isMultipleChoice && this.answerChangeCallback) {
            this.answerChangeCallback(this.currentSelectedIndices);
        }
    }

    // Visuelle Darstellung aktualisieren
    updateAnswerDisplay() {
        const allButtons = this.answerButtonsElement.querySelectorAll('.answer-btn');
        allButtons.forEach(button => {
            const buttonIndex = parseInt(button.dataset.index);

            if (this.currentSelectedIndices.includes(buttonIndex)) {
                // AUSGEWÄHLTE ANTWORT
                button.style.backgroundColor = '#d1ecf1';
                button.style.border = '2px solid #17a2b8';
                button.style.color = '#0c5460';
                button.classList.add('selected');
            } else {
                // NICHT AUSGEWÄHLTE ANTWORT
                button.style.backgroundColor = '';
                button.style.border = '';
                button.style.color = '';
                button.classList.remove('selected');
            }
        });

        //  KEINE BESTÄTIGUNGS-BUTTON LOGIK MEHR - WURDE ENTFERNT
    }

    showFeedback(selectedIndices) {
        this.feedbackContainer.classList.add('hidden');

        // KEINE BESTÄTIGUNGS-BUTTON BEARBEITUNG MEHR - WURDE ENTFERNT

        // Aktuelle Auswahl speichern
        this.currentSelectedIndices = selectedIndices;
        this.updateAnswerDisplay();

        // Alle Antwort-Buttons deaktivieren
        const answerButtons = this.answerButtonsElement.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.disabled = true;
            button.style.cursor = 'not-allowed';
        });

        // Weiter-Button anzeigen (falls noch nicht sichtbar)
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