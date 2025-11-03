export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export class Quiz {
  private questions: Question[] = [];

  addQuestion(question: Question) {
    this.questions.push(question);
  }

  getQuestions(): Question[] {
    return this.questions;
  }
}