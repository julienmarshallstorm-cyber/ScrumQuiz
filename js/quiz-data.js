class QuizData {
    constructor() {
        this.questions = [
            {
                question: "What is Scrum?",
                answers: [
                    "A framework for project management",
                    "A methodology for software development",
                    "A framework for developing, delivering, and sustaining complex products",
                    "A set of engineering practices"
                ],
                correctIndex: 2,
                quote: "Scrum is a framework for developing, delivering, and sustaining complex products."
            },
            {
                question: "Who is responsible for maximizing the value of the product?",
                answers: [
                    "The Development Team",
                    "The Scrum Master",
                    "The Product Owner",
                    "The stakeholders"
                ],
                correctIndex: 2,
                quote: "The Product Owner is responsible for maximizing the value of the product resulting from work of the Development Team."
            },
            {
                question: "How many members should the Development Team have?",
                answers: [
                    "3-5 members",
                    "3-9 members",
                    "5-10 members",
                    "As many as needed"
                ],
                correctIndex: 1,
                quote: "The Development Team consists of professionals who do the work of delivering a potentially releasable Increment of 'Done' product at the end of each Sprint. The Development Team has 3-9 members."
            },
            {
                question: "What is the time-box for the Daily Scrum?",
                answers: [
                    "10 minutes",
                    "15 minutes",
                    "30 minutes",
                    "60 minutes"
                ],
                correctIndex: 1,
                quote: "The Daily Scrum is a 15-minute time-boxed event for the Development Team."
            },
            {
                question: "Who can cancel a Sprint?",
                answers: [
                    "The Development Team",
                    "The Scrum Master",
                    "The Product Owner",
                    "The CEO"
                ],
                correctIndex: 2,
                quote: "The Product Owner has the authority to cancel the Sprint."
            }
        ];
    }

    getQuestion(index) {
        return this.questions[index];
    }

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