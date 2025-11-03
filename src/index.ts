import readlineSync from "readline-sync";
import { Quiz, Question } from "./quiz";

function createQuiz(): Quiz {
  const quiz = new Quiz();

  console.log("Let's create your quiz!");
  const numQuestions = parseInt(
    readlineSync.question("How many questions? "),
    10
  );

  for (let i = 0; i < numQuestions; i++) {
    console.log(`\nQuestion ${i + 1}:`);
    const questionText = readlineSync.question("Enter the question: ");

    const options: string[] = [];
    for (let j = 0; j < 4; j++) {
      options.push(readlineSync.question(`Option ${j + 1}: `));
    }

    const correctIndex = parseInt(
      readlineSync.question("Enter the number of the correct option (1-4): "),
      10
    ) - 1;

    quiz.addQuestion({ question: questionText, options, correctIndex });
  }

  console.log("\n✅ Quiz created successfully!\n");
  return quiz;
}

function playQuiz(quiz: Quiz) {
  console.log("Let's play the quiz!\n");
  const questions = quiz.getQuestions();
  let score = 0;

  questions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.question}`);
    q.options.forEach((opt, i) => {
      console.log(`  ${i + 1}) ${opt}`);
    });

    const answer = parseInt(readlineSync.question("Your answer: "), 10) - 1;
    if (answer === q.correctIndex) {
      console.log("✅ Correct!\n");
      score++;
    } else {
      console.log(`❌ Incorrect. Correct answer: ${q.options[q.correctIndex]}\n`);
    }
  });

  console.log(`🎯 You got ${score} out of ${questions.length} correct.`);
}

function main() {
  console.log("Welcome to the Quiz App!\n");
  const mode = readlineSync.question("Type 'create' to make a quiz or 'play' to play one: ").toLowerCase();

  const quiz = createQuiz();
  playQuiz(quiz);
}

main();
