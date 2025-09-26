class QuizController {
    constructor() {
        this.quizData = new QuizData();
        this.quizUI = new QuizUI();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.totalQuestions = 0;
        this.selectedQuestionCount = 0;

        this.init();
    }

    async init() {
        await this.quizData.loadQuestions();
        this.initializeEventListeners();
        this.showSetup();
    }

    initializeEventListeners() {
        this.quizUI.bindAnswerClick(this.handleAnswerClick.bind(this));
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
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.quizData.getQuestion(this.currentQuestionIndex);
        this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);
    }

    handleAnswerClick(selectedIndex, isSkip) {
        try {
            // ✅ CORRECTINDEX IMMER HOLEN (auch für Skip)
            const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;
            let isCorrect = false;

            if (isSkip) {
                // Frage überspringen - als falsch zählen
                const quote = this.quizData.getQuote(this.currentQuestionIndex);

                this.wrongAnswers.push({
                    question: this.quizData.getQuestion(this.currentQuestionIndex).question,
                    selectedAnswer: 'Übersprungen',
                    correctAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[correctIndex],
                    quote: quote
                });
                isCorrect = false; // Skip ist immer falsch
            } else {
                // Normale Antwortverarbeitung
                isCorrect = this.quizData.isCorrectAnswer(this.currentQuestionIndex, selectedIndex);

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

            // ✅ MIT CORRECTINDEX UND ISCORRECT
            this.quizUI.showFeedback(selectedIndex, correctIndex, isCorrect);

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
        this.showSetup();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ist bereit, starte Quiz...');
    new QuizController();
});