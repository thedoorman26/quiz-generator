"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const quiz_1 = require("./quiz");
// Simple in-memory quiz reference
let savedQuiz = null;
function createQuiz() {
    const quiz = new quiz_1.Quiz();
    console.log("\nLet's create your quiz!");
    const numQuestions = parseInt(readline_sync_1.default.question("How many questions? "), 10);
    for (let i = 0; i < numQuestions; i++) {
        console.log(`\nQuestion ${i + 1}:`);
        const questionText = readline_sync_1.default.question("Enter the question: ");
        const options = [];
        for (let j = 0; j < 4; j++) {
            options.push(readline_sync_1.default.question(`Option ${j + 1}: `));
        }
        const correctIndex = parseInt(readline_sync_1.default.question("Enter the number of the correct option (1-4): "), 10) - 1;
        quiz.addQuestion({ question: questionText, options, correctIndex });
    }
    console.log("\n✅ Quiz created successfully!\n");
    return quiz;
}
function playQuiz(quiz) {
    console.log("\n🎮 Let's play the quiz!\n");
    const questions = quiz.getQuestions();
    let score = 0;
    questions.forEach((q, index) => {
        console.log(`${index + 1}. ${q.question}`);
        q.options.forEach((opt, i) => {
            console.log(`  ${i + 1}) ${opt}`);
        });
        const answer = parseInt(readline_sync_1.default.question("Your answer: "), 10) - 1;
        if (answer === q.correctIndex) {
            console.log("Correct!\n");
            score++;
        }
        else {
            console.log(`Incorrect. Correct answer: ${q.options[q.correctIndex]}\n`);
        }
    });
    console.log(`You got ${score} out of ${questions.length} correct.\n`);
}
function main() {
    console.log("Welcome to the Quiz App!\n");
    while (true) {
        const mode = readline_sync_1.default
            .question("Type 'create' to make a quiz, 'play' to play one, or 'exit' to quit: ")
            .toLowerCase();
        if (mode === "create") {
            savedQuiz = createQuiz();
        }
        else if (mode === "play") {
            if (savedQuiz) {
                playQuiz(savedQuiz);
            }
            else {
                console.log("\nNo quiz found! Please create one first.\n");
            }
        }
        else if (mode === "exit") {
            console.log("\nGoodbye!");
            break;
        }
        else {
            console.log("\nUnknown command. Please type 'create', 'play', or 'exit'.\n");
        }
    }
}
main();
