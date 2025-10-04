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
        this.currentSelectedIndices = [];
        this.answerChangeCallback = null;

        // ✅ TIMER ELEMENTE MIT FALLBACK
        this.timerContainer = document.getElementById('timer-container');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeElement = document.getElementById('current-time');
        this.totalTimeElement = document.getElementById('total-time');

        console.log('🔧 QuizUI Constructor - Timer Status:');
        console.log('📱 Timer Container gefunden:', !!this.timerContainer);
        console.log('📱 Progress Bar gefunden:', !!this.progressBar);

        // ✅ NOTFALL: Timer Container manuell erstellen falls nicht vorhanden
        if (!this.timerContainer) {
            console.log('⚠️ Timer Container nicht gefunden - erstelle manuell...');
            this.createTimerContainer();
        }
    }

    // ✅ NOTFALL-METHODE: Timer Container manuell erstellen
    createTimerContainer() {
        console.log('🔧 Erstelle Timer Container manuell...');

        // Timer Container erstellen
        this.timerContainer = document.createElement('div');
        this.timerContainer.id = 'timer-container';
        this.timerContainer.innerHTML = `
            <div id="timer-display">
                <div id="progress-bar-container">
                    <div id="progress-bar" style="width: 100%; height: 20px; background: red;"></div>
                </div>
                <div id="time-text">
                    <span id="current-time">00:00</span> /
                    <span id="total-time">00:00</span>
                </div>
            </div>
        `;

        // Timer in den Quiz Container einfügen (nach dem h1)
        const quizContainer = document.getElementById('quiz-container');
        const h1Element = quizContainer.querySelector('h1');
        if (h1Element && h1Element.nextSibling) {
            quizContainer.insertBefore(this.timerContainer, h1Element.nextSibling);
        } else {
            quizContainer.appendChild(this.timerContainer);
        }

        // Sub-Elemente neu zuweisen
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeElement = document.getElementById('current-time');
        this.totalTimeElement = document.getElementById('total-time');

        console.log('✅ Timer Container manuell erstellt:', this.timerContainer);
        console.log('✅ Progress Bar manuell erstellt:', this.progressBar);
    }

    showTimer() {
        console.log('🔧 showTimer() AUFGERUFEN - TIMER AUTOMATISCH STARTEN');

        if (this.timerContainer) {
            // ✅ ABSOLUTE SICHTBARKEIT ERZwingen - GENAU WIE BEIM DEBUG-BUTTON
            this.timerContainer.style.display = 'block';
            this.timerContainer.style.visibility = 'visible';
            this.timerContainer.style.opacity = '1';
            this.timerContainer.style.height = 'auto';
            this.timerContainer.style.minHeight = '60px';
            this.timerContainer.style.background = '#ffffff';
            this.timerContainer.style.border = '3px solid #4CAF50';
            this.timerContainer.style.borderRadius = '10px';
            this.timerContainer.style.padding = '10px';
            this.timerContainer.style.margin = '10px 0';
            this.timerContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

            // Hidden Klasse entfernen
            this.timerContainer.classList.remove('hidden');

            console.log('✅ Timer Container AUTOMATISCH sichtbar gemacht');
        }

        if (this.progressBar) {
            // ✅ PROGRESS BAR ABSOLUT SICHTBAR MACHEN - GENAU WIE BEIM DEBUG-BUTTON
            this.progressBar.style.display = 'block';
            this.progressBar.style.visibility = 'visible';
            this.progressBar.style.opacity = '1';
            this.progressBar.style.height = '20px';
            this.progressBar.style.minHeight = '20px';
            this.progressBar.style.width = '100%';
            this.progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
            this.progressBar.style.borderRadius = '10px';
            this.progressBar.style.transition = 'width 1s linear';

            console.log('✅ Progress Bar AUTOMATISCH sichtbar gemacht');
        }

        // ✅ SOFORTIGE VISUALISIERUNG ERZwingen
        setTimeout(() => {
            if (this.progressBar) {
                this.progressBar.style.width = '100%';
                this.progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
                console.log('🎯 Timer automatisch initialisiert und sichtbar!');
            }
        }, 100);
    }

    hideTimer() {
        console.log('🔧 hideTimer() aufgerufen');

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
        console.log('🔧 updateTimer() aufgerufen:', currentTime, 'von', totalTime);

        // ✅ SOFORTIGE VISUALISIERUNG ERZwingen
        if (!this.progressBar) {
            console.error('❌ Progress Bar immer noch nicht gefunden!');
            return;
        }

        // Progress berechnen
        const progress = Math.max(1, (currentTime / totalTime) * 100); // Mindestens 1% für Sichtbarkeit
        console.log('📊 Progress:', progress + '%');

        // ✅ ABSOLUTE BREITEN-SICHERHEIT
        this.progressBar.style.width = `${progress}%`;
        this.progressBar.style.minWidth = '1%'; // Immer mindestens 1% sichtbar
        this.progressBar.style.display = 'block';
        this.progressBar.style.visibility = 'visible';

        // Farbwechsel
        if (progress <= 25) {
            this.progressBar.style.background = 'linear-gradient(90deg, #f44336, #d32f2f)';
        } else if (progress <= 50) {
            this.progressBar.style.background = 'linear-gradient(90deg, #ff9800, #f57c00)';
        } else {
            this.progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        }

        // Zeit formatieren
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        if (this.currentTimeElement) {
            this.currentTimeElement.textContent = formatTime(currentTime);
            this.currentTimeElement.style.fontSize = '18px';
            this.currentTimeElement.style.fontWeight = 'bold';
        }
        if (this.totalTimeElement) {
            this.totalTimeElement.textContent = formatTime(totalTime);
            this.totalTimeElement.style.fontSize = '18px';
            this.totalTimeElement.style.fontWeight = 'bold';
        }
    }

    showSetup() {
        if (this.quizSetupElement) {
            this.quizSetupElement.classList.remove('hidden');
            this.quizContainer.classList.add('hidden');
            this.scoreContainer.classList.add('hidden');
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
        this.currentSelectedIndices = [];
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

            button.addEventListener('click', () => {
                this.handleAnswerClick(index, isMultipleChoice);
            });

            this.answerButtonsElement.appendChild(button);
        });

        // ✅ ULTIMATIVER DEBUG-BUTTON
        const debugButton = document.createElement('button');
        debugButton.innerText = '🔧 TIMER VISIBILITY TEST';
        debugButton.classList.add('btn');
        debugButton.style.backgroundColor = '#ff0000';
        debugButton.style.color = 'white';
        debugButton.style.marginTop = '10px';
        debugButton.style.fontWeight = 'bold';
        debugButton.addEventListener('click', () => {
            console.log('🔧 ULTIMATIVE TIMER DIAGNOSE:');

            // ✅ SOFORTIGER VISIBILITY-TEST
            if (this.progressBar) {
                // TEST 1: ROTER BALKEN (100%)
                this.progressBar.style.width = '100%';
                this.progressBar.style.height = '25px';
                this.progressBar.style.background = 'red';
                this.progressBar.style.border = '3px solid black';
                console.log('🔴 TEST 1: DICKER ROTER BALKEN (100%)');

                // TEST 2: Nach 2 Sekunden - BLAUER BALKEN (50%)
                setTimeout(() => {
                    this.progressBar.style.width = '50%';
                    this.progressBar.style.background = 'blue';
                    console.log('🔵 TEST 2: BLAUER BALKEN (50%)');

                    // TEST 3: Nach weiteren 2 Sekunden - GRÜNER BALKEN (25%)
                    setTimeout(() => {
                        this.progressBar.style.width = '25%';
                        this.progressBar.style.background = 'green';
                        console.log('🟢 TEST 3: GRÜNER BALKEN (25%)');

                        // TEST 4: Nach weiteren 2 Sekunden - GELBER BALKEN (10%)
                        setTimeout(() => {
                            this.progressBar.style.width = '10%';
                            this.progressBar.style.background = 'yellow';
                            this.progressBar.style.color = 'black';
                            this.progressBar.style.textAlign = 'center';
                            this.progressBar.style.lineHeight = '25px';
                            this.progressBar.innerHTML = 'TIMER!';
                            console.log('🟡 TEST 4: GELBER BALKEN MIT TEXT (10%)');
                        }, 2000);
                    }, 2000);
                }, 2000);
            } else {
                console.error('❌ KRITISCH: Progress Bar existiert nicht!');
            }
        });
        this.answerButtonsElement.appendChild(debugButton);
    }

    handleAnswerClick(clickedIndex, isMultipleChoice) {
        console.log('✅ Antwort geklickt:', clickedIndex, 'MultipleChoice:', isMultipleChoice);

        if (isMultipleChoice) {
            if (this.currentSelectedIndices.includes(clickedIndex)) {
                this.currentSelectedIndices = this.currentSelectedIndices.filter(idx => idx !== clickedIndex);
            } else {
                this.currentSelectedIndices.push(clickedIndex);
            }
        } else {
            if (this.currentSelectedIndices.includes(clickedIndex)) {
                this.currentSelectedIndices = [];
            } else {
                this.currentSelectedIndices = [clickedIndex];
            }
        }

        this.updateAnswerDisplay();

        if (this.currentSelectedIndices.length > 0) {
            this.nextButton.classList.remove('hidden');
        } else {
            this.nextButton.classList.add('hidden');
        }

        if (!isMultipleChoice && this.answerChangeCallback) {
            this.answerChangeCallback(this.currentSelectedIndices);
        }
    }

    updateAnswerDisplay() {
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
    }

    showFeedback(selectedIndices) {
        this.feedbackContainer.classList.add('hidden');
        this.currentSelectedIndices = selectedIndices;
        this.updateAnswerDisplay();

        const answerButtons = this.answerButtonsElement.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.disabled = true;
            button.style.cursor = 'not-allowed';
        });

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