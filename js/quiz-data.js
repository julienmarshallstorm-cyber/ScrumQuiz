class QuizData {
    constructor() {
        this.questions = [];
        this.shuffledQuestions = [];
        this.selectedQuestionCount = 0;
    }

    async loadQuestions() {
        try {
            console.log('📥 Lade Fragen...');
            const response = await fetch('./quiz-data/pcep-quiz.json');
            const data = await response.json();
            console.log('📄 Rohdaten:', data);
            console.log('🔢 Ist Array?', Array.isArray(data));

            this.questions = Array.isArray(data) ? data : data.questions;
            console.log('✅ Fragen geladen:', this.questions.length);
        } catch (error) {
            console.error("❌ Fehler:", error);
        }
    }

    shuffleQuestions() {
        console.log('🔀 MISCHE ALLE FRAGEN KOMPLETT...');
        console.log('   - Gesamtfragen:', this.questions.length);
        console.log('   - Davon ausgewählt:', this.selectedQuestionCount);

        // 1. Kopie ALLER originalen Fragen erstellen
        const questionsCopy = [...this.questions];

        // 2. ALLE Fragen komplett mischen (Fisher-Yates Shuffle)
        for (let i = questionsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
        }

        // 3. Nur die gewünschte Anzahl an Fragen AUS DER KOMPLETT GEMISCHTEN LISTE nehmen
        this.shuffledQuestions = questionsCopy.slice(0, this.selectedQuestionCount);

        console.log(`✅ ALLE ${this.questions.length} Fragen gemischt, ${this.shuffledQuestions.length} verwendet`);

        // Debug: Zeige erste 5 Fragen der KOMPLETT gemischten Liste
        console.log('🔍 Erste 5 Fragen der KOMPLETT gemischten Liste:');
        questionsCopy.slice(0, 5).forEach((q, i) => {
            console.log(`   ${i + 1}: ${q.question.substring(0, 50)}...`);
        });

        console.log('🔍 Tatsächlich verwendete Fragen im Quiz:');
        this.shuffledQuestions.slice(0, 3).forEach((q, i) => {
            console.log(`   ${i + 1}: ${q.question.substring(0, 50)}...`);
        });
    }

    getQuestion(index) {
        // Zuerst aus shuffledQuestions, falls verfügbar
        if (this.shuffledQuestions && this.shuffledQuestions.length > 0 && index < this.shuffledQuestions.length) {
            return this.shuffledQuestions[index];
        }
        // Fallback auf originale Fragen
        return this.questions[index];
    }

    isCorrectAnswer(questionIndex, selectedIndices) {
        const question = this.getQuestion(questionIndex);

        console.log('🔍 Überprüfe Antwort:');
        console.log('   - Frage Index:', questionIndex);
        console.log('   - Ausgewählt:', selectedIndices);
        console.log('   - Korrekt:', question.correctIndex);
        console.log('   - Frage:', question.question.substring(0, 30) + '...');

        // ✅ FÜR MEHRFACHAUSWAHL (correctIndex ist Array)
        if (Array.isArray(question.correctIndex)) {
            // Prüfe ob ausgewählte Indices genau den correctIndex entsprechen
            if (selectedIndices.length !== question.correctIndex.length) {
                console.log('   - Ergebnis: ❌ FALSCH (unterschiedliche Anzahl)');
                return false; // Unterschiedliche Anzahl = falsch
            }

            // Vergleiche ob beide Arrays die gleichen Werte haben (sortiert)
            const sortedSelected = selectedIndices.slice().sort().join(',');
            const sortedCorrect = question.correctIndex.slice().sort().join(',');
            const isCorrect = sortedSelected === sortedCorrect;
            console.log('   - Ergebnis:', isCorrect ? '✅ RICHTIG' : '❌ FALSCH');
            return isCorrect;
        }
        // ✅ FÜR EINFACHE ANTWORTEN (correctIndex ist Number)
        else {
            const isCorrect = question.correctIndex === selectedIndices[0];
            console.log('   - Ergebnis:', isCorrect ? '✅ RICHTIG' : '❌ FALSCH');
            return isCorrect;
        }
    }

    getTotalQuestions() {
        return this.questions.length;
    }

    getQuote(questionIndex) {
        const question = this.getQuestion(questionIndex);
        return question.quote || '';
    }

    setUserAnswer(questionIndex, userAnswer) {
        const question = this.getQuestion(questionIndex);
        if (question) {
            question.userAnswer = [...userAnswer]; // Kopie speichern
            console.log(`💾 Antwort für Frage ${questionIndex + 1} gespeichert:`, userAnswer);
        }
    }

    getAnsweredQuestions() {
        if (this.shuffledQuestions.length > 0) {
            return this.shuffledQuestions.filter(q => q.userAnswer !== undefined);
        }
        return this.questions.filter(q => q.userAnswer !== undefined);
    }

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