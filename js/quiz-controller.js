class QuizController {
    constructor() {
        console.log('🔄 QuizController Constructor aufgerufen');
        this.quizData = new QuizData();
        this.quizUI = new QuizUI();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.totalQuestions = 0;
        this.selectedQuestionCount = 0;
        this.currentSelectedIndices = [];
        this.totalQuizTime = 0;
        this.remainingTime = 0;
        this.timerInterval = null;

        this.init();
    }

    async init() {
        await this.quizData.loadQuestions();
        this.initializeEventListeners();
        this.showSetup();
    }

    initializeEventListeners() {
        this.quizUI.bindAnswerChange(this.handleAnswerClick.bind(this));
        this.quizUI.bindNextButtonClick(this.handleNextButtonClick.bind(this));
        this.quizUI.bindRestartButtonClick(this.handleRestartButtonClick.bind(this));
        this.quizUI.bindStartQuizClick(this.handleStartQuizClick.bind(this));
        this.quizUI.bindEndQuizClick(this.handleEndQuizClick.bind(this));
    }

    showSetup() {
        this.quizUI.showSetup();
    }

    handleStartQuizClick(questionCount) {
        this.selectedQuestionCount = Math.min(questionCount, this.quizData.getTotalQuestions());
        this.quizData.selectedQuestionCount = this.selectedQuestionCount;

        this.quizData.shuffleQuestions();
        this.startQuiz();
        this.quizUI.hideSetup();
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.totalQuestions = this.selectedQuestionCount;
        this.currentSelectedIndices = [];

        // TIMER INITIALISIEREN
        this.totalQuizTime = this.selectedQuestionCount * 90;
        this.remainingTime = this.totalQuizTime;

        // ✅ ZUERST: Quiz-Container sichtbar machen (ÜBERGEORDNETER CONTAINER)
        this.quizUI.hideSetup();

        // ✅ FORCE BROWSER RE-LAYOUT - KRITISCH FÜR PWA
        setTimeout(() => {
            console.log('🚀 TIMER VISIBILITY FORCE IN PWA');

            // ✅ ABSOLUTE SICHTBARKEIT FÜR PWA
            if (this.quizUI.timerContainer) {
                // NUCLEAR OPTION FÜR PWA
                this.quizUI.timerContainer.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    height: auto !important;
                    min-height: 80px !important;
                    background: #ffffff !important;
                    border: 3px solid #4CAF50 !important;
                    border-radius: 10px !important;
                    padding: 12px !important;
                    margin: 15px 0 !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    position: relative !important;
                    z-index: 1000 !important;
                `;

                // KLASSE ENTFERNEN FÜR PWA
                this.quizUI.timerContainer.classList.remove('hidden');
                this.quizUI.timerContainer.className = 'timer-visible-force';
            }

            if (this.quizUI.progressBar) {
                this.quizUI.progressBar.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    height: 20px !important;
                    min-height: 20px !important;
                    width: 100% !important;
                    background: linear-gradient(90deg, #4CAF50, #45a049) !important;
                    border-radius: 10px !important;
                    transition: width 1s linear !important;
                `;
            }

            // ✅ JETZT ERST: Timer starten
            this.startTimer();
            this.showCurrentQuestion();

            console.log('✅ PWA TIMER ABSOLUT SICHTBAR GEMACHT');
        }, 100); // Längerer Delay für PWA
    }

    showCurrentQuestion() {
        const question = this.quizData.getQuestion(this.currentQuestionIndex);

        // Vorherige Auswahl zurücksetzen
        this.currentSelectedIndices = [];

        // Frage anzeigen
        this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);

        // "Weiter" Button zunächst verstecken
        this.quizUI.nextButton.classList.add('hidden');
    }

    handleAnswerClick(selectedIndices) {
        console.log('🎯 Antwort ausgewählt (noch nicht ausgewertet):', selectedIndices);

        // NUR die Auswahl speichern, aber noch nicht auswerten
        this.currentSelectedIndices = selectedIndices;

        // "Weiter" Button aktivieren
        this.quizUI.nextButton.classList.remove('hidden');
    }

    handleNextButtonClick() {
        console.log('➡️ Weiter geklickt - jetzt Antwort auswerten');

        // JETZT erst die Antwort auswerten
        if (this.currentSelectedIndices.length > 0) {
            this.evaluateCurrentAnswer();
        }

        // Zur nächsten Frage gehen
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.totalQuestions) {
            this.showCurrentQuestion();
        } else {
            // Quiz beenden
            console.log('⏰ Quiz beendet - Timer stoppen');
            clearInterval(this.timerInterval);
            this.quizUI.showScore(this.score, this.totalQuestions, this.wrongAnswers);
        }
    }

    // ✅ NEUE METHODE: Antwort beim "Weiter" Klick auswerten
    evaluateCurrentAnswer() {
        try {
            const question = this.quizData.getQuestion(this.currentQuestionIndex);
            const correctIndex = question.correctIndex;

            // Antwort überprüfen
            const isCorrect = this.quizData.isCorrectAnswer(this.currentQuestionIndex, this.currentSelectedIndices);

            if (isCorrect) {
                this.score++;
                console.log('✅ Richtige Antwort! Score:', this.score);
            } else {
                const quote = this.quizData.getQuote(this.currentQuestionIndex);
                this.wrongAnswers.push({
                    question: question.question,
                    selectedAnswer: this.currentSelectedIndices.map(idx =>
                        question.answers[idx]
                    ).join(', '),
                    correctAnswer: Array.isArray(correctIndex)
                        ? correctIndex.map(idx => question.answers[idx]).join(', ')
                        : question.answers[correctIndex],
                    quote: quote
                });
                console.log('❌ Falsche Antwort gespeichert');
            }

            // Antwort in quizData speichern (falls benötigt)
            if (this.quizData.setUserAnswer) {
                this.quizData.setUserAnswer(this.currentQuestionIndex, this.currentSelectedIndices);
            }

        } catch (error) {
            console.error('Fehler bei der Antwortauswertung:', error);
        }
    }

    startTimer() {
        console.log('🎯 CONTROLLER: startTimer() WIRD AUFGERUFEN');
        console.log('⏰ Timer starten...');

        // ✅ ERWEITERTES DEBUGGING FÜR PWA-APP
        console.log('📱 Timer Container Element:', this.quizUI.timerContainer);
        console.log('📱 Timer Container sichtbar?:', this.quizUI.timerContainer?.offsetParent !== null);
        console.log('📱 Timer Container classes:', this.quizUI.timerContainer?.className);
        console.log('📱 Progress Bar Element:', this.quizUI.progressBar);
        console.log('📱 Current Time Element:', this.quizUI.currentTimeElement);
        console.log('📱 Total Time Element:', this.quizUI.totalTimeElement);

        // ✅ FORCE VISIBILITY FÜR PWA-APP
        if (this.quizUI.timerContainer) {
            this.quizUI.timerContainer.style.display = 'block';
            this.quizUI.timerContainer.style.visibility = 'visible';
            this.quizUI.timerContainer.style.opacity = '1';
            this.quizUI.timerContainer.classList.remove('hidden');
        }

        if (this.quizUI.progressBar) {
            this.quizUI.progressBar.style.display = 'block';
        }

        // Sicherstellen dass vorheriger Timer gestoppt ist
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Timer-UI anzeigen
        this.quizUI.showTimer();

        // ✅ SOFORTIGE VISUALISIERUNG TESTEN
        this.quizUI.updateTimer(this.remainingTime, this.totalQuizTime);

        // Timer starten
        this.timerInterval = setInterval(() => {
            try {
                this.remainingTime--;
                this.quizUI.updateTimer(this.remainingTime, this.totalQuizTime);

                // Zeit abgelaufen
                if (this.remainingTime <= 0) {
                    this.handleTimeUp();
                }
            } catch (error) {
                console.error('Timer-Fehler:', error);
                clearInterval(this.timerInterval);
            }
        }, 1000);

        // ✅ ZUSÄTZLICHER TEST: MANUELLE AKTUALISIERUNG NACH 1 SEKUNDE
        setTimeout(() => {
            console.log('⏱️ Timer-Test nach 1s - Funktioniert der Timer?');
            if (this.quizUI.progressBar) {
                console.log('📱 Progress Bar Width:', this.quizUI.progressBar.style.width);
            }
        }, 1000);
    }

    handleTimeUp() {
        console.log('⏰ Zeit abgelaufen!');

        // Timer stoppen
        clearInterval(this.timerInterval);

        // AKTUELLE FRAGE auswerten falls beantwortet
        if (this.currentSelectedIndices.length > 0) {
            this.evaluateCurrentAnswer();
        }

        // Restliche Fragen als falsch markieren (ab der NÄCHSTEN Frage)
        for (let i = this.currentQuestionIndex + 1; i < this.totalQuestions; i++) {
            const question = this.quizData.getQuestion(i);
            const correctIndex = question.correctIndex;

            this.wrongAnswers.push({
                question: question.question,
                selectedAnswer: 'Nicht beantwortet (Zeit abgelaufen)',
                correctAnswer: Array.isArray(correctIndex)
                    ? correctIndex.map(idx => question.answers[idx]).join(', ')
                    : question.answers[correctIndex],
                quote: question.quote
            });
        }

        // Zur Auswertung springen
        this.quizUI.showScore(this.score, this.totalQuestions, this.wrongAnswers);
    }

    handleEndQuizClick() {
        console.log('⏹️ Quiz manuell beendet');

        // Timer stoppen
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // AKTUELLE FRAGE auswerten falls beantwortet
        if (this.currentSelectedIndices.length > 0) {
            this.evaluateCurrentAnswer();
        }

        // Restliche Fragen als falsch markieren (ab der NÄCHSTEN Frage)
        for (let i = this.currentQuestionIndex + 1; i < this.totalQuestions; i++) {
            const question = this.quizData.getQuestion(i);
            const correctIndex = question.correctIndex;

            this.wrongAnswers.push({
                question: question.question,
                selectedAnswer: 'Nicht beantwortet (Quiz beendet)',
                correctAnswer: Array.isArray(correctIndex)
                    ? correctIndex.map(idx => question.answers[idx]).join(', ')
                    : question.answers[correctIndex],
                quote: question.quote
            });
        }

        // Zur Auswertung springen
        this.quizUI.showScore(this.score, this.totalQuestions, this.wrongAnswers);
    }

    handleRestartButtonClick() {
        // TIMER STOPPEN bei Neustart
        console.log('⏰ Quiz neustarten - Timer stoppen');
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.showSetup();
    }
}

new QuizController();