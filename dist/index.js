"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("readline/promises");
const node_process_1 = require("node:process");
const quiz_1 = require("./quiz");
const rl = (0, promises_1.createInterface)({ input: node_process_1.stdin, output: node_process_1.stdout });
const quizzes = [];
function ask(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield rl.question(question);
        return answer.trim();
    });
}
function createQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\nLet's create a new quiz.");
        const name = yield ask("Enter a name for your quiz: ");
        if (quizzes.find((q) => q.name.toLowerCase() === name.toLowerCase())) {
            console.log("A quiz with that name already exists. Please choose another name.\n");
            return;
        }
        const quiz = new quiz_1.Quiz();
        const numQuestions = parseInt(yield ask("How many questions? "), 10);
        for (let i = 0; i < numQuestions; i++) {
            console.log(`\nQuestion ${i + 1}:`);
            const questionText = yield ask("Enter the question: ");
            const options = [];
            for (let j = 0; j < 4; j++) {
                options.push(yield ask(`Option ${j + 1}: `));
            }
            const correctIndex = parseInt(yield ask("Enter the number of the correct option (1-4): "), 10) - 1;
            quiz.addQuestion({ question: questionText, options, correctIndex });
        }
        quizzes.push({ name, quiz });
        console.log(`\nQuiz '${name}' created successfully.\n`);
    });
}
function chooseQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        if (quizzes.length === 0) {
            console.log("\nNo quizzes available. Please create one first.\n");
            return null;
        }
        console.log("\nAvailable quizzes:");
        quizzes.forEach((q, i) => console.log(`  ${i + 1}) ${q.name}`));
        const choice = parseInt(yield ask("\nEnter the number of the quiz you want to play: "), 10);
        if (isNaN(choice) || choice < 1 || choice > quizzes.length) {
            console.log("Invalid choice.\n");
            return null;
        }
        return quizzes[choice - 1].quiz;
    });
}
function playQuiz(quiz) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\nStarting the quiz.\n");
        const questions = quiz.getQuestions();
        let score = 0;
        for (const [index, q] of questions.entries()) {
            console.log(`${index + 1}. ${q.question}`);
            q.options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt}`));
            const answer = parseInt(yield ask("Your answer: "), 10) - 1;
            if (answer === q.correctIndex) {
                console.log("Correct.\n");
                score++;
            }
            else {
                console.log(`Incorrect. The correct answer is: ${q.options[q.correctIndex]}\n`);
            }
        }
        console.log(`You got ${score} out of ${questions.length} correct.\n`);
    });
}
// Recursive main menu
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const mode = (yield ask("Type 'create' to make a quiz, 'play' to play one, 'list' to see all quizzes, or 'exit' to quit: ")).toLowerCase();
        if (mode === "create") {
            yield createQuiz();
        }
        else if (mode === "play") {
            const quiz = yield chooseQuiz();
            if (quiz)
                yield playQuiz(quiz);
        }
        else if (mode === "list") {
            if (quizzes.length === 0) {
                console.log("\nNo quizzes available.\n");
            }
            else {
                console.log("\nAvailable quizzes:");
                quizzes.forEach((q, i) => console.log(`  ${i + 1}) ${q.name}`));
                console.log("");
            }
        }
        else if (mode === "exit") {
            console.log("\nGoodbye.");
            yield rl.close();
            return; // base case
        }
        else {
            console.log("\nUnknown command. Please type 'create', 'play', 'list', or 'exit'.\n");
        }
        // recursion step — return to the main menu
        yield mainMenu();
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Welcome to the Quiz App.\n");
        yield mainMenu();
    });
}
main();
