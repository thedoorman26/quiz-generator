export interface Question {
  question: string;     // question text
  options: string[];    // answer choices
  correctIndex: number; // correct option index
}

export class Quiz {
  private questions: Question[] = []; // stored questions list

  // add one question to quiz
  addQuestion(q: Question) {
    this.questions.push(q);
  }

  // retrieve all questions
  getQuestions(): Question[] {
    return this.questions;
  }
}
