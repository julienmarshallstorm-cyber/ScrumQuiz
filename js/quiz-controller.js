class QuizController {
    constructor() {
        this.quizData = new QuizData();
        this.quizUI = new QuizUI();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.totalQuestions = 0;
        this.selectedQuestionCount = 0;
        this.currentSelectedIndices = []; // Für Multiple-Choice
        //this.quizUI.showFeedback(selectedIndices);


        this.init();
    }

    async init() {
        await this.quizData.loadQuestions();
        this.initializeEventListeners();
        this.showSetup();
    }

    initializeEventListeners() {
     // ✅ NEU (verwende bindAnswerChange):
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
        this.currentSelectedIndices = []; // Reset für neue Frage
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.quizData.getQuestion(this.currentQuestionIndex);
        this.quizUI.showQuestion(question, this.currentQuestionIndex, this.totalQuestions);
    }

    handleAnswerClick(selectedIndices, isSkip) {
        try {
            const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;

           /* if (isSkip) {
                // Frage überspringen - als falsch zählen
                const quote = this.quizData.getQuote(this.currentQuestionIndex);

                this.wrongAnswers.push({
                    question: this.quizData.getQuestion(this.currentQuestionIndex).question,
                    selectedAnswer: 'Übersprungen',
                    correctAnswer: this.quizData.getQuestion(this.currentQuestionIndex).answers[correctIndex],
                    quote: quote
                });
            } else {
                // Normale Antwortverarbeitung*/
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

    processAnswer(selectedIndices) {
        const isCorrect = this.quizData.isCorrectAnswer(this.currentQuestionIndex, selectedIndices);
        const correctIndex = this.quizData.getQuestion(this.currentQuestionIndex).correctIndex;

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
               this.currentSelectedIndices = selectedIndices;
                this.quizUI.showFeedback(selectedIndices);

            } catch (error) {
                console.error('Fehler bei der Antwortverarbeitung:', error);
            }
        }
    }

    handleNextButtonClick() {
        // Finale Antwort mit aktueller Auswahl verarbeiten
        this.processAnswer(this.currentSelectedIndices);

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