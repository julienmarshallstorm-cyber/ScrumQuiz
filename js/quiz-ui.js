class QuizUI {
    constructor() {
        this.questionTextElement = document.getElementById('question-text');
        this.answerButtonsElement = document.getElementById('answer-buttons');
        this.nextButton = document.getElementById('next-btn');
        this.feedbackContainer = document.getElementById('feedback-container');
        this.scrumGuideQuoteElement = document.getElementById('scrum-guide-quote');
        this.scoreContainer = document.getElementById('score-container');
        this.scoreElement = document.getElementById('score');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.restartButton = document.getElementById('restart-btn');
    }

    showQuestion(question, currentIndex, totalQuestions) {
        this.resetState();

        this.questionTextElement.innerHTML = `
            <div style="font-weight: bold; color: #666; margin-bottom: 10px;">
                Frage ${currentIndex + 1} von ${totalQuestions}
            </div>
            ${question.question}
        `;

        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('btn', 'answer-btn');
            button.dataset.index = index;
            this.answerButtonsElement.appendChild(button);
        });
    }

    resetState() {
        this.nextButton.classList.add('hidden');
        this.feedbackContainer.classList.add('hidden');
        while (this.answerButtonsElement.firstChild) {
            this.answerButtonsElement.removeChild(this.answerButtonsElement.firstChild);
        }
    }

   showFeedback(correctIndex, selectedIndex) {
       this.feedbackContainer.classList.add('hidden'); // Feedback ausblenden

       const allButtons = this.answerButtonsElement.querySelectorAll('button');
       allButtons.forEach(button => {
           button.disabled = true;
           const buttonIndex = parseInt(button.dataset.index);

           // Nur visuelles Feedback (ohne Text)
           if (buttonIndex === correctIndex) {
               button.classList.add('correct');
           } else if (buttonIndex === selectedIndex) {
               button.classList.add('incorrect');
           } else {
               button.style.backgroundColor = '#e9ecef';
               button.style.color = '#6c757d';
           }
       });

       this.nextButton.classList.remove('hidden');
   }

    showScore(score, totalQuestions, wrongAnswers) {
         this.resetState();

            const percentage = Math.round((score / totalQuestions) * 100);
            const wrongCount = totalQuestions - score;

            let message = '';
            if (percentage >= 80) {
                message = 'Herzlichen Glückwunsch! Exzellentes Scrum-Wissen! 🎉';
            } else if (percentage >= 60) {
                message = 'Gut gemacht! Solide Scrum-Kenntnisse! 👍';
            } else {
                message = 'Weiter üben! Du schaffst das beim nächsten Mal! 💪';
            }

            this.questionTextElement.innerHTML = `
                <h2>Quiz abgeschlossen!</h2>
                <p>${message}</p>
            `;

            this.scoreElement.innerText = score;
            this.totalQuestionsElement.innerText = totalQuestions;

            document.getElementById('correct-count').textContent = score;
            document.getElementById('wrong-count').textContent = wrongCount;

            const wrongQuestionsList = document.getElementById('wrong-questions-list');
            const wrongQuestionsContainer = document.getElementById('wrong-questions');

            if (wrongAnswers.length > 0) {
                wrongQuestionsList.style.display = 'block';
                wrongQuestionsContainer.innerHTML = '';

                wrongAnswers.forEach((wrong, index) => {
                    const listItem = document.createElement('li');
                    listItem.style.marginBottom = '15px';
                    listItem.style.padding = '10px';
                    listItem.style.backgroundColor = '#f8f9fa';
                    listItem.style.borderRadius = '5px';
                    listItem.innerHTML = `
                        <strong>Frage ${index + 1}:</strong> ${wrong.question}<br>
                        <span style="color: red;">✗ Deine Antwort: ${wrong.selectedAnswer}</span><br>
                        <span style="color: green;">✓ Richtige Antwort: ${wrong.correctAnswer}</span><br>
                        <em style="color: #666;">Scrum Guide: "${wrong.quote}"</em>
                    `;
                    wrongQuestionsContainer.appendChild(listItem);
                });
            } else {
                wrongQuestionsList.style.display = 'none';
            }

            this.scoreContainer.classList.remove('hidden');
    }

    bindAnswerClick(callback) {
        this.answerButtonsElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('answer-btn')) {
                const selectedIndex = parseInt(event.target.dataset.index);
                callback(selectedIndex);
            }
        });
    }

    bindNextButtonClick(callback) {
        this.nextButton.addEventListener('click', callback);
    }

    bindRestartButtonClick(callback) {
        this.restartButton.addEventListener('click', callback);
    }
}