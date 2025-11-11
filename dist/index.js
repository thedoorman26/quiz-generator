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
        try {
            console.log("\nLet's create a new quiz.");
            const name = yield ask("Enter a name for your quiz: ");
            if (!name) {
                console.log("Quiz name cannot be empty.\n");
                return;
            }
            if (quizzes.find((q) => q.name.toLowerCase() === name.toLowerCase())) {
                console.log("A quiz with that name already exists. Please choose another name.\n");
                return;
            }
            const numStr = yield ask("How many questions? ");
            const numQuestions = parseInt(numStr, 10);
            if (isNaN(numQuestions) || numQuestions <= 0) {
                console.log("Please enter a valid number of questions.\n");
                return;
            }
            const quiz = new quiz_1.Quiz();
            for (let i = 0; i < numQuestions; i++) {
                console.log(`\nQuestion ${i + 1}:`);
                const questionText = yield ask("Enter the question: ");
                if (!questionText) {
                    console.log("Question text cannot be empty.");
                    return;
                }
                const options = [];
                for (let j = 0; j < 4; j++) {
                    const opt = yield ask(`Option ${j + 1}: `);
                    options.push(opt || `(blank option ${j + 1})`);
                }
                const correctStr = yield ask("Enter the number of the correct option (1-4): ");
                const correctIndex = parseInt(correctStr, 10) - 1;
                if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
                    console.log("Invalid answer number. Question skipped.\n");
                    continue;
                }
                quiz.addQuestion({ question: questionText, options, correctIndex });
            }
            quizzes.push({ name, quiz });
            console.log(`\nQuiz '${name}' created successfully.\n`);
        }
        catch (err) {
            console.error("An error occurred while creating the quiz:", err);
        }
    });
}
function chooseQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (quizzes.length === 0) {
                console.log("\nNo quizzes available. Please create one first.\n");
                return null;
            }
            console.log("\nAvailable quizzes:");
            quizzes.forEach((q, i) => console.log(`  ${i + 1}) ${q.name}`));
            const choiceStr = yield ask("\nEnter the number of the quiz you want to play: ");
            const choice = parseInt(choiceStr, 10);
            if (isNaN(choice) || choice < 1 || choice > quizzes.length) {
                console.log("Invalid choice.\n");
                return null;
            }
            return quizzes[choice - 1].quiz;
        }
        catch (err) {
            console.error("Error choosing quiz:", err);
            return null;
        }
    });
}
function playQuiz(quiz) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("\nStarting the quiz.\n");
            const questions = quiz.getQuestions();
            if (questions.length === 0) {
                console.log("This quiz has no questions.\n");
                return;
            }
            let score = 0;
            for (const [index, q] of questions.entries()) {
                console.log(`${index + 1}. ${q.question}`);
                q.options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt}`));
                const answerStr = yield ask("Your answer: ");
                const answer = parseInt(answerStr, 10) - 1;
                if (isNaN(answer) || answer < 0 || answer >= q.options.length) {
                    console.log("Invalid input. Skipping question.\n");
                    continue;
                }
                if (answer === q.correctIndex) {
                    console.log("Correct.\n");
                    score++;
                }
                else {
                    console.log(`Incorrect. The correct answer is: ${q.options[q.correctIndex]}\n`);
                }
            }
            console.log(`You got ${score} out of ${questions.length} correct.\n`);
        }
        catch (err) {
            console.error("Error while playing quiz:", err);
        }
    });
}
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
                return;
            }
            else {
                console.log("\nUnknown command. Please type 'create', 'play', 'list', or 'exit'.\n");
            }
            yield mainMenu(); // recursive re-entry
        }
        catch (err) {
            console.error("Unexpected error:", err);
            yield mainMenu(); // attempt to recover gracefully
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Welcome to the Quiz App.\n");
        yield mainMenu();
    });
}
main();
