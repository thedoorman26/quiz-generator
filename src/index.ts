import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Quiz } from "./quiz";

const rl = createInterface({ input, output });

interface NamedQuiz {
  name: string;
  quiz: Quiz;
}

const quizzes: NamedQuiz[] = [];

async function ask(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

async function createQuiz(): Promise<void> {
  try {
    console.log("\nLet's create a new quiz.");

    const name = await ask("Enter a name for your quiz: ");
    if (!name) {
      console.log("Quiz name cannot be empty.\n");
      return;
    }

    if (quizzes.find((q) => q.name.toLowerCase() === name.toLowerCase())) {
      console.log("A quiz with that name already exists. Please choose another name.\n");
      return;
    }

    const numStr = await ask("How many questions? ");
    const numQuestions = parseInt(numStr, 10);
    if (isNaN(numQuestions) || numQuestions <= 0) {
      console.log("Please enter a valid number of questions.\n");
      return;
    }

    const quiz = new Quiz();

    for (let i = 0; i < numQuestions; i++) {
      console.log(`\nQuestion ${i + 1}:`);
      const questionText = await ask("Enter the question: ");
      if (!questionText) {
        console.log("Question text cannot be empty.");
        return;
      }

      const options: string[] = [];
      for (let j = 0; j < 4; j++) {
        const opt = await ask(`Option ${j + 1}: `);
        options.push(opt || `(blank option ${j + 1})`);
      }

      const correctStr = await ask("Enter the number of the correct option (1-4): ");
      const correctIndex = parseInt(correctStr, 10) - 1;

      if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
        console.log("Invalid answer number. Question skipped.\n");
        continue;
      }

      quiz.addQuestion({ question: questionText, options, correctIndex });
    }

    quizzes.push({ name, quiz });
    console.log(`\nQuiz '${name}' created successfully.\n`);
  } catch (err) {
    console.error("An error occurred while creating the quiz:", err);
  }
}

async function chooseQuiz(): Promise<Quiz | null> {
  try {
    if (quizzes.length === 0) {
      console.log("\nNo quizzes available. Please create one first.\n");
      return null;
    }

    console.log("\nAvailable quizzes:");
    quizzes.forEach((q, i) => console.log(`  ${i + 1}) ${q.name}`));

    const choiceStr = await ask("\nEnter the number of the quiz you want to play: ");
    const choice = parseInt(choiceStr, 10);

    if (isNaN(choice) || choice < 1 || choice > quizzes.length) {
      console.log("Invalid choice.\n");
      return null;
    }

    return quizzes[choice - 1].quiz;
  } catch (err) {
    console.error("Error choosing quiz:", err);
    return null;
  }
}

async function playQuiz(quiz: Quiz) {
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

      const answerStr = await ask("Your answer: ");
      const answer = parseInt(answerStr, 10) - 1;

      if (isNaN(answer) || answer < 0 || answer >= q.options.length) {
        console.log("Invalid input. Skipping question.\n");
        continue;
      }

      if (answer === q.correctIndex) {
        console.log("Correct.\n");
        score++;
      } else {
        console.log(`Incorrect. The correct answer is: ${q.options[q.correctIndex]}\n`);
      }
    }

    console.log(`You got ${score} out of ${questions.length} correct.\n`);
  } catch (err) {
    console.error("Error while playing quiz:", err);
  }
}

async function mainMenu(): Promise<void> {
  try {
    const mode = (await ask("Type 'create' to make a quiz, 'play' to play one, 'list' to see all quizzes, or 'exit' to quit: ")).toLowerCase();

    if (mode === "create") {
      await createQuiz();
    } else if (mode === "play") {
      const quiz = await chooseQuiz();
      if (quiz) await playQuiz(quiz);
    } else if (mode === "list") {
      if (quizzes.length === 0) {
        console.log("\nNo quizzes available.\n");
      } else {
        console.log("\nAvailable quizzes:");
        quizzes.forEach((q, i) => console.log(`  ${i + 1}) ${q.name}`));
        console.log("");
      }
    } else if (mode === "exit") {
      console.log("\nGoodbye.");
      await rl.close();
      return;
    } else {
      console.log("\nUnknown command. Please type 'create', 'play', 'list', or 'exit'.\n");
    }

    await mainMenu(); // recursive re-entry
  } catch (err) {
    console.error("Unexpected error:", err);
    await mainMenu(); // attempt to recover gracefully
  }
}

async function main() {
  console.log("Welcome to the Quiz App.\n");
  await mainMenu();
}

main();
