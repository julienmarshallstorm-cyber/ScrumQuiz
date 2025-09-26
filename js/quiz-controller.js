class QuizController {
    constructor() {
        this.quizData = new QuizData();
        this.quizUI = new QuizUI();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.totalQuestions = 0;
        this.init();
    }

    async init() {
        await this.quizData.loadQuestions();
        this.totalQuestions = this.quizData.getTotalQuestions();
        console.log('Fragen geladen:', this.totalQuestions);
        this.initializeEventListeners();
        this.startQuiz();
    }

    initializeEventListeners() {
        this.quizUI.bindAnswerClick(this.handleAnswerClick.bind(this));
        this.quizUI.bindNextButtonClick(this.handleNextButtonClick.bind(this));
        this.quizUI.bindRestartButtonClick(this.handleRestartButtonClick.bind(this));
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.quizData.getQuestion(this.currentQuestionIndex);
        this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);
    }

    handleAnswerClick(selectedIndex) {
        try {
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
    
            // Nur visuelles Feedback, keine Text-Rückmeldung
            this.quizUI.showFeedback(correctIndex, selectedIndex);
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
        this.startQuiz();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ist bereit, starte Quiz...');
    new QuizController();
});