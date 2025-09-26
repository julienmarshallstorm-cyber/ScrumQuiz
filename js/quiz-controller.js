class QuizController {
    constructor() {
        this.quizData = new QuizData();
        this.quizUI = new QuizUI();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.totalQuestions = 0;
        this.selectedQuestionCount = 0; // Neu

        this.init();
    }

    async init() {
        await this.quizData.loadQuestions();
        this.initializeEventListeners();
        this.showSetup(); // Setup anzeigen statt Quiz starten
    }

    initializeEventListeners() {
        this.quizUI.bindAnswerClick(this.handleAnswerClick.bind(this));
        this.quizUI.bindNextButtonClick(this.handleNextButtonClick.bind(this));
        this.quizUI.bindRestartButtonClick(this.handleRestartButtonClick.bind(this));
        this.quizUI.bindStartQuizClick(this.handleStartQuizClick.bind(this)); // Neu
    }

    // NEU: Setup anzeigen
    showSetup() {
        this.quizUI.showSetup();
    }

    // NEU: Quiz starten mit ausgewählter Fragen-Anzahl
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
        this.totalQuestions = this.selectedQuestionCount; // Ausgewählte Anzahl verwenden
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.quizData.getQuestion(this.currentQuestionIndex);
        this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);
    }

    handleAnswerClick(selectedIndex, isSkip) {
        try {
            if (isSkip) {
                const quote = this.quizData.getQuote(this.currentQuestionIndex);
                const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;

                this.wrongAnswers.push({
                    question: this.quizData.getQuestion(this.currentQuestionIndex).question,
                    selectedAnswer: 'Übersprungen',
                    correctAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[correctIndex],
                    quote: quote
                });
            } else {
                const isCorrect = this.quizData.isCorrectAnswer(this.currentQuestionIndex, selectedIndex);
                const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;

                if (isCorrect) {
                    this.score++;
                } else {
                    const quote = this.quizData.getQuote(this.currentQuestionIndex);
                    this.wrongAnswers.push({
                        question: this.quizData.getQuestion(this.currentQuestionIndex).question,
                        selectedAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[selectedIndex],
                        correctAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[correctIndex],
                        quote: quote
                    });
                }
            }

            this.quizUI.showFeedback(selectedIndex);
        } catch (error) {
            console.error('Fehler bei der Antwortverarbeitung:', error);
        }
    }

    handleNextButtonClick() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.totalQuestions) {
            this.showCurrentQuestion();
        } else {
            this.quizUI.showScore(this.score, this.totalQuestions, this.wrongAnswers);
        }
    }

    handleRestartButtonClick() {
        this.showSetup(); // Zurück zur Setup-Auswahl
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ist bereit, starte Quiz...');
    new QuizController();
});```

