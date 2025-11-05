"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
class Quiz {
    constructor() {
        this.questions = [];
    }
    addQuestion(question) {
        this.questions.push(question);
    }
    getQuestions() {
        return this.questions;
    }
}
exports.Quiz = Quiz;
