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
  console.log("\nLet's create a new quiz.");

  const name = await ask("Enter a name for your quiz: ");
  if (quizzes.find((q) => q.name.toLowerCase() === name.toLowerCase())) {
    console.log("A quiz with that name already exists. Please choose another name.\n");
    return;
  }

  const quiz = new Quiz();
  const numQuestions = parseInt(await ask("How many questions? "), 10);

  for (let i = 0; i < numQuestions; i++) {
    console.log(`\nQuestion ${i + 1}:`);
    const questionText = await ask("Enter the question: ");

    const options: string[] = [];
    for (let j = 0; j < 4; j++) {
      options.push(await ask(`Option ${j + 1}: `));
    }

    const correctIndex = parseInt(
      await ask("Enter the number of the correct option (1-4): "),
      10
    ) - 1;

    quiz.addQuestion({ question: questionText, options, correctIndex });
  }

  quizzes.push({ name, quiz });
  console.log(`\nQuiz '${name}' created successfully.\n`);
}

async function chooseQuiz(): Promise<Quiz | null> {
  if (quizzes.length === 0) {
    console.log("\nNo quizzes available. Please create one first.\n");
    return null;
  }

  console.log("\nAvailable quizzes:");
  quizzes.forEach((q, i) => console.log(`  ${i + 1}) ${q.name}`));

  const choice = parseInt(await ask("\nEnter the number of the quiz you want to play: "), 10);
  if (isNaN(choice) || choice < 1 || choice > quizzes.length) {
    console.log("Invalid choice.\n");
    return null;
  }

  return quizzes[choice - 1].quiz;
}

async function playQuiz(quiz: Quiz) {
  console.log("\nStarting the quiz.\n");
  const questions = quiz.getQuestions();
  let score = 0;

  for (const [index, q] of questions.entries()) {
    console.log(`${index + 1}. ${q.question}`);
    q.options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt}`));

    const answer = parseInt(await ask("Your answer: "), 10) - 1;
    if (answer === q.correctIndex) {
      console.log("Correct.\n");
      score++;
    } else {
      console.log(`Incorrect. The correct answer is: ${q.options[q.correctIndex]}\n`);
    }
  }

  console.log(`You got ${score} out of ${questions.length} correct.\n`);
}

// Recursive main menu
async function mainMenu(): Promise<void> {
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
    return; // base case
  } else {
    console.log("\nUnknown command. Please type 'create', 'play', 'list', or 'exit'.\n");
  }

  // recursion step — return to the main menu
  await mainMenu();
}

async function main() {
  console.log("Welcome to the Quiz App.\n");
  await mainMenu();
}

main();
