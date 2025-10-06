class QuizData {
    constructor() {
        this.questions = [];
        this.shuffledQuestions = []; //  NEU: Gemischte Fragen separat speichern
        this.selectedQuestionCount = 0;
    }

    // JSON-Datei laden
    async loadQuestions() {
        try {
            console.log('📥 Lade Fragen...');
            const response = await fetch('./quiz-data/pcep-quiz.json');
            const data = await response.json();
            console.log('📄 Rohdaten:', data);
            console.log('🔢 Ist Array?', Array.isArray(data));

            this.questions = Array.isArray(data) ? data : data.questions;
            console.log('Fragen geladen:', this.questions.length);

            // GEÄNDERT: Nicht mehr hier shufflen, sondern erst bei Quiz-Start
            // this.shuffleQuestions(); // AUSKOMMENTIERT!
        } catch (error) {
            console.error("❌ Fehler:", error);
        }
    }

    //  VERBESSERT: Shuffling mit separater Liste
    shuffleQuestions() {
        console.log('🔀 Fragen werden gemischt...');

        // 1. Kopie der originalen Fragen erstellen
        const questionsCopy = [...this.questions];

        // 2. Deinen bewährten Fisher-Yates Algorithmus verwenden
        for (let i = questionsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
        }

        // 3. ✅ NEU: Nur die gewünschte Anzahl an Fragen nehmen
        this.shuffledQuestions = questionsCopy.slice(0, this.selectedQuestionCount);

        console.log(`✅ ${this.shuffledQuestions.length} Fragen gemischt und ausgewählt`);
    }

    // VERBESSERT: Frage aus gemischter Liste holen
    getQuestion(index) {
        // Zuerst aus shuffledQuestions, falls verfügbar
        if (this.shuffledQuestions && index < this.shuffledQuestions.length) {
            return this.shuffledQuestions[index];
        }
        // Fallback auf originale Fragen (für Rückwärtskompatibilität)
        return this.questions[index];
    }

    // Anzahl der Fragen
    getTotalQuestions() {
        return this.questions.length;
    }

    // DEINE BEWÄHRTE METHODE UNVERÄNDERT
    isCorrectAnswer(questionIndex, selectedIndices) {
        const question = this.getQuestion(questionIndex);

        // FÜR MEHRFACHAUSWAHL (correctIndex ist Array)
        if (Array.isArray(question.correctIndex)) {
            // Prüfe ob ausgewählte Indices genau den correctIndex entsprechen
            if (selectedIndices.length !== question.correctIndex.length) {
                return false; // Unterschiedliche Anzahl = falsch
            }

            // Vergleiche ob beide Arrays die gleichen Werte haben (sortiert)
            const sortedSelected = selectedIndices.slice().sort().join(',');
            const sortedCorrect = question.correctIndex.slice().sort().join(',');
            return sortedSelected === sortedCorrect;
        }
        // FÜR EINFACHE ANTWORTEN (correctIndex ist Number)
        else {
            return question.correctIndex === selectedIndices[0];
        }
    }

    getQuote(questionIndex) {
        return this.questions[questionIndex].quote;
    }

    // NEUE METHODE: User-Antwort speichern (für Controller)
    setUserAnswer(questionIndex, userAnswer) {
        const question = this.getQuestion(questionIndex);
        if (question) {
            question.userAnswer = [...userAnswer]; // Kopie speichern
            console.log(`💾 Antwort für Frage ${questionIndex + 1} gespeichert:`, userAnswer);
        }
    }

    // NEUE METHODE: Beantwortete Fragen abrufen
    getAnsweredQuestions() {
        if (this.shuffledQuestions.length > 0) {
            return this.shuffledQuestions.filter(q => q.userAnswer !== undefined);
        }
        return this.questions.filter(q => q.userAnswer !== undefined);
    }

    // NEUE METHODE: Reset für neuen Quiz-Durchlauf
    resetQuiz() {
        this.shuffledQuestions = [];
        this.selectedQuestionCount = 0;

        // User-Antworten aus allen Fragen entfernen
        this.questions.forEach(question => {
            delete question.userAnswer;
        });

        console.log('🔄 Quiz-Daten zurückgesetzt');
    }
}