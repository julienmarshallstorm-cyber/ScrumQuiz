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
        this.currentSelectedIndices = []; // Für Multiple-Choice
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
        // NEU (verwende bindAnswerChange):
        this.quizUI.bindAnswerChange(this.handleAnswerClick.bind(this));

        this.quizUI.bindNextButtonClick(this.handleNextButtonClick.bind(this));
        this.quizUI.bindRestartButtonClick(this.handleRestartButtonClick.bind(this));
        this.quizUI.bindStartQuizClick(this.handleStartQuizClick.bind(this));
    }

    showSetup() {
        this.quizUI.showSetup();
    }

    handleStartQuizClick(questionCount) {
        this.selectedQuestionCount = Math.min(questionCount, this.quizData.getTotalQuestions());
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
        this.totalQuizTime = this.selectedQuestionCount * 45; // 45s pro Frage
        this.remainingTime = this.totalQuizTime;
        this.startTimer();

        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.quizData.getQuestion(this.currentQuestionIndex);
        this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);
    }

    handleAnswerClick(selectedIndices) {
        console.log('🎯 Controller handleAnswerClick aufgerufen', selectedIndices);

        try {
            const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;

            // NUR normale Antwortverarbeitung (keine Skip-Logik mehr)
            const isCorrect = this.quizData.isCorrectAnswer(this.currentQuestionIndex, selectedIndices);

            if (isCorrect) {
                this.score++;
            } else {
                const quote = this.quizData.getQuote(this.currentQuestionIndex);
                this.wrongAnswers.push({
                    question: this.quizData.getQuestion(this.currentQuestionIndex).question,
                    selectedAnswer: selectedIndices.map(idx =>
                        this.quizData.getQuestion(this.currentQuestionIndex).answers[idx]
                    ).join(', '),
                    correctAnswer: Array.isArray(correctIndex)
                        ? correctIndex.map(idx =>
                            this.quizData.getQuestion(this.currentQuestionIndex).answers[idx]
                          ).join(', ')
                        : this.quizData.getQuestion(this.currentQuestionIndex).answers[correctIndex],
                    quote: quote
                });
            }

            // Aktuelle Auswahl speichern für mögliche Änderungen
            this.currentSelectedIndices = selectedIndices;

            // Feedback anzeigen
            this.quizUI.showFeedback(selectedIndices);

        } catch (error) {
            console.error('Fehler bei der Antwortverarbeitung:', error);
        }
    }

    startTimer() {
        // Sicherstellen dass vorheriger Timer gestoppt ist
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Timer-UI anzeigen
        this.quizUI.showTimer();

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
    }

    handleTimeUp() {
        // Timer stoppen
        clearInterval(this.timerInterval);

        // Alle restlichen Fragen als falsch markieren
        for (let i = this.currentQuestionIndex; i < this.totalQuestions; i++) {
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

    handleNextButtonClick() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.totalQuestions) {
            this.showCurrentQuestion();
        } else {
            // TIMER STOPPEN bei normalem Quiz-Ende
            clearInterval(this.timerInterval);
            this.quizUI.showScore(this.score, this.totalQuestions, this.wrongAnswers);
        }
    }

    handleRestartButtonClick() {
        // TIMER STOPPEN bei Neustart
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.showSetup();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ist bereit, starte Quiz...');
    new QuizController();
});