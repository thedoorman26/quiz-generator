import { createInterface } from "readline/promises";   // async console input
import { stdin as input, stdout as output } from "node:process"; // IO streams
import { Quiz } from "./quiz";  // Quiz class

// readline interface for asking questions
const rl = createInterface({ input, output });

// structure holding quiz name + quiz object
interface NamedQuiz {
  name: string;
  quiz: Quiz;
}

// in-memory list of quizzes
const quizzes: NamedQuiz[] = [];

// wrapper to ask a question + trim result
async function ask(question: string): Promise<string> {
  return (await rl.question(question)).trim();
}

// create a new quiz interactively
async function createQuiz(): Promise<void> {
  try {
    const name = await ask("Enter a name for your quiz: ");

    // check for duplicate quiz names
    if (quizzes.some(q => q.name === name)) {
      console.log("A quiz with that name already exists.\n");
      return;
    }

    const numQuestions = parseInt(await ask("How many questions? "), 10);
    if (isNaN(numQuestions) || numQuestions <= 0) {
      console.log("Invalid number.\n");
      return;
    }

    const quiz = new Quiz(); // create blank quiz

    // ask user to enter each question
    for (let i = 0; i < numQuestions; i++) {
      console.log(`\nQuestion ${i + 1}:`);
      const questionText = await ask("Enter the question: ");

      // collect the 4 answer options
      const options: string[] = [];
      for (let j = 0; j < 4; j++) {
        options.push(await ask(`Option ${j + 1}: `)); // push options into array
      }

      // get correct answer index
      const correct = parseInt(await ask("Correct option (1-4): "), 10) - 1;

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
  } catch (err) {
    console.error("Error creating quiz:", err);
  }
}

// allow user to choose which quiz to play
async function chooseQuiz(): Promise<Quiz | null> {
  if (quizzes.length === 0) {
    console.log("No quizzes available.\n");
    return null;
  }

  // list quiz names
  quizzes.forEach((q, i) => {
    console.log(`${i + 1}. ${q.name}`);
  });

  const choice = parseInt(await ask("Choose a quiz by number: "), 10) - 1;

  // validate index
  if (choice < 0 || choice >= quizzes.length || isNaN(choice)) {
    console.log("Invalid choice.\n");
    return null;
  }

  // return selected quiz object
  return quizzes[choice].quiz;
}

// run through a quiz and score answers
async function playQuiz(quiz: Quiz) {
  try {
    const questions = quiz.getQuestions(); // retrieve stored Qs
    let score = 0; // track correct answers

    for (const [index, q] of questions.entries()) {
      console.log(`\n${index + 1}. ${q.question}`);

      // print options
      q.options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt}`));

      const answer = parseInt(await ask("Your answer: "), 10) - 1;

      // check correctness
      if (answer === q.correctIndex) {
        console.log("Correct.\n");
        score++;
      } else {
        console.log(
          `Incorrect. Correct: ${q.options[q.correctIndex]}\n`
        );
      }
    }

    // final score summary
    console.log(`Final score: ${score} / ${questions.length}\n`);
  } catch (err) {
    console.error("Error playing quiz:", err);
  }
}

// main recursive menu loop
async function mainMenu(): Promise<void> {
  try {
    const input = (await ask("Type 'create', 'play', 'list', or 'exit': ")).toLowerCase();

    if (input === "create") {
      await createQuiz();           // build a quiz
    } else if (input === "play") {
      const quiz = await chooseQuiz(); // select one
      if (quiz) await playQuiz(quiz);  // play selected quiz
    } else if (input === "list") {
      // print all quiz names
      if (quizzes.length === 0) {
        console.log("No quizzes yet.\n");
      } else {
        console.log("Available quizzes:");
        quizzes.forEach(q => console.log(`- ${q.name}`));
        console.log();
      }
    } else if (input === "exit") {
      console.log("Goodbye.");
      rl.close(); // close readline interface
      return;      // stop recursion
    } else {
      console.log("Unknown command.\n");
    }

    // recursive call returns to main menu again
    await mainMenu();

  } catch (err) {
    console.error("Unexpected error:", err);
    await mainMenu(); // recover by restarting menu
  }
}

// program entry point
async function main() {
  console.log("Welcome to the Quiz App.\n");
  await mainMenu();
}

main(); // start program
