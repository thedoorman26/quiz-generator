"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
class Quiz {
    constructor() {
        this.questions = []; // stored questions list
    }
    // add one question to quiz
    addQuestion(q) {
        this.questions.push(q);
    }
    // retrieve all questions
    getQuestions() {
        return this.questions;
    }
}
exports.Quiz = Quiz;
