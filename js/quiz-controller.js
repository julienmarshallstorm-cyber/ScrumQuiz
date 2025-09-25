class QuizController {
    constructor() {
        if (typeof QuizData === 'undefined' || typeof QuizUI === 'undefined') {
            console.error('QuizData oder QuizUI nicht gefunden!');
            return;
        }

        this.quizData = new QuizData();
        this.quizUI = new QuizUI();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = this.quizData.getTotalQuestions();

        // NEU: Track falsch beantwortete Fragen
        this.wrongAnswers = [];

        setTimeout(() => {
            this.initializeEventListeners();
            this.startQuiz();
        }, 100);
    }

    initializeEventListeners() {
        try {
            this.quizUI.bindAnswerClick(this.handleAnswerClick.bind(this));
            this.quizUI.bindNextButtonClick(this.handleNextButtonClick.bind(this));
            this.quizUI.bindRestartButtonClick(this.handleRestartButtonClick.bind(this));
        } catch (error) {
            console.error('Fehler beim Initialisieren der Event-Listener:', error);
        }
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        try {
            const question = this.quizData.getQuestion(this.currentQuestionIndex);
            this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);
        } catch (error) {
            console.error('Fehler beim Anzeigen der Frage:', error);
        }
    }

    handleAnswerClick(selectedIndex) {
        try {
            const isCorrect = this.quizData.isCorrectAnswer(this.currentQuestionIndex, selectedIndex);
            const quote = this.quizData.getQuote(this.currentQuestionIndex);
            const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;

            if (isCorrect) {
                this.score++;
            } else {
                // NEU: Falsche Antwort speichern
                this.wrongAnswers.push({
                    question: this.quizData.getQuestion(this.currentQuestionIndex).question,
                    selectedAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[selectedIndex],
                    correctAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[correctIndex],
                    quote: quote
                });
            }

            this.quizUI.showFeedback(quote, correctIndex, selectedIndex, isCorrect);
        } catch (error) {
            console.error('Fehler bei der Antwortverarbeitung:', error);
        }
    }

    handleNextButtonClick() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.totalQuestions) {
            this.showCurrentQuestion();
        } else {
            // NEU: Wrong answers mit übergeben
            this.quizUI.showScore(this.score, this.totalQuestions, this.wrongAnswers);
        }
    }

    handleRestartButtonClick() {
        this.startQuiz();
    }
}

function initializeQuiz() {
    try {
        if (typeof QuizData !== 'undefined' && typeof QuizUI !== 'undefined') {
            new QuizController();
        } else {
            setTimeout(initializeQuiz, 100);
        }
    } catch (error) {
        console.error('Fehler beim Initialisieren des Quiz:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ist bereit, starte Quiz...');
    setTimeout(initializeQuiz, 500);
});