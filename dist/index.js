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
const promises_1 = require("readline/promises"); // async console input
const node_process_1 = require("node:process"); // IO streams
const quiz_1 = require("./quiz"); // Quiz class
// readline interface for asking questions
const rl = (0, promises_1.createInterface)({ input: node_process_1.stdin, output: node_process_1.stdout });
// in-memory list of quizzes
const quizzes = [];
// wrapper to ask a question + trim result
function ask(question) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield rl.question(question)).trim();
    });
}
// create a new quiz interactively
function createQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const name = yield ask("Enter a name for your quiz: ");
            // check for duplicate quiz names
            if (quizzes.some(q => q.name === name)) {
                console.log("A quiz with that name already exists.\n");
                return;
            }
            const numQuestions = parseInt(yield ask("How many questions? "), 10);
            if (isNaN(numQuestions) || numQuestions <= 0) {
                console.log("Invalid number.\n");
                return;
            }
            const quiz = new quiz_1.Quiz(); // create blank quiz
            // ask user to enter each question
            for (let i = 0; i < numQuestions; i++) {
                console.log(`\nQuestion ${i + 1}:`);
                const questionText = yield ask("Enter the question: ");
                // collect the 4 answer options
                const options = [];
                for (let j = 0; j < 4; j++) {
                    options.push(yield ask(`Option ${j + 1}: `)); // push options into array
                }
                // get correct answer index
                const correct = parseInt(yield ask("Correct option (1–4): "), 10) - 1;
                // basic correct index validation
                if (isNaN(correct) || correct < 0 || correct > 3) {
                    console.log("Invalid correct option.\n");
                    return;
                }
                // store question in quiz
                quiz.addQuestion({
                    question: questionText,
                    options,
                    correctIndex: correct
                });
            }
            // add completed quiz to global list
            quizzes.push({ name, quiz });
            console.log(`\nQuiz '${name}' created.\n`);
        }
        catch (err) {
            console.error("Error creating quiz:", err);
        }
    });
}
// allow user to choose which quiz to play
function chooseQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        if (quizzes.length === 0) {
            console.log("No quizzes available.\n");
            return null;
        }
        // list quiz names
        quizzes.forEach((q, i) => {
            console.log(`${i + 1}. ${q.name}`);
        });
        const choice = parseInt(yield ask("Choose a quiz by number: "), 10) - 1;
        // validate index
        if (choice < 0 || choice >= quizzes.length || isNaN(choice)) {
            console.log("Invalid choice.\n");
            return null;
        }
        // return selected quiz object
        return quizzes[choice].quiz;
    });
}
// run through a quiz and score answers
function playQuiz(quiz) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const questions = quiz.getQuestions(); // retrieve stored Qs
            let score = 0; // track correct answers
            for (const [index, q] of questions.entries()) {
                console.log(`\n${index + 1}. ${q.question}`);
                // print options
                q.options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt}`));
                const answer = parseInt(yield ask("Your answer: "), 10) - 1;
                // check correctness
                if (answer === q.correctIndex) {
                    console.log("Correct.\n");
                    score++;
                }
                else {
                    console.log(`Incorrect. Correct: ${q.options[q.correctIndex]}\n`);
                }
            }
            // final score summary
            console.log(`Final score: ${score} / ${questions.length}\n`);
        }
        catch (err) {
            console.error("Error playing quiz:", err);
        }
    });
}
// main recursive menu loop
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const input = (yield ask("Type 'create', 'play', 'list', or 'exit': ")).toLowerCase();
            if (input === "create") {
                yield createQuiz(); // build a quiz
            }
            else if (input === "play") {
                const quiz = yield chooseQuiz(); // select one
                if (quiz)
                    yield playQuiz(quiz); // play selected quiz
            }
            else if (input === "list") {
                // print all quiz names
                if (quizzes.length === 0) {
                    console.log("No quizzes yet.\n");
                }
                else {
                    console.log("Available quizzes:");
                    quizzes.forEach(q => console.log(`- ${q.name}`));
                    console.log();
                }
            }
            else if (input === "exit") {
                console.log("Goodbye.");
                rl.close(); // close readline interface
                return; // stop recursion
            }
            else {
                console.log("Unknown command.\n");
            }
            // recursive call returns to main menu again
            yield mainMenu();
        }
        catch (err) {
            console.error("Unexpected error:", err);
            yield mainMenu(); // recover by restarting menu
        }
    });
}
// program entry point
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Welcome to the Quiz App.\n");
        yield mainMenu();
    });
}
main(); // start program
