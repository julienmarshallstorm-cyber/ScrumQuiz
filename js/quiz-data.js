class QuizData {
    constructor() {
        this.questions = [];
    }

    // JSON-Datei laden
    async loadQuestions() {
        try {
            console.log('📥 Lade Fragen...');
            const response = await fetch('./quiz-data/scrum-quiz.json');
            const data = await response.json();
            //console.log('✅ JSON geladen:', data);
           // console.log('📊 Datentyp:', typeof data);
            console.log('📄 Rohdaten:', data);
            console.log('🔢 Ist Array?', Array.isArray(data));

            this.questions = Array.isArray(data) ? data : data.questions;
            console.log('Fragen geladen:', this.questions.length);
            this.shuffleQuestions();
        } catch (error) {
            console.error("❌ Fehler:", error);
        }
    }

    // Fragen randomisieren
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    // Frage nach Index zurückgeben
    getQuestion(index) {
        return this.questions[index];
    }

    // Anzahl der Fragen
    getTotalQuestions() {
        return this.questions.length;
    }
     isCorrectAnswer(questionIndex, selectedIndex) {
            return this.questions[questionIndex].correctIndex === selectedIndex;
        }

        getQuote(questionIndex) {
            return this.questions[questionIndex].quote;
        }
}
