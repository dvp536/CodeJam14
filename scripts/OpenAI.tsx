import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import * as random from "random";

// Load environment variables
dotenv.config();

// Set OpenAI API Key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to generate trivia question
async function generateTriviaQuestion() {
  try {
    const topics = ["history", "science", "geography", "sports", "pop culture"];
    const selectedTopic = topics[random.int(0, topics.length - 1)];

    const prompt = `
      Generate a multiple-choice trivia question about ${selectedTopic} with four options, 
      clearly marked A, B, C, and D. Then, generate a plausible but incorrect wrong answer that is still 
      relevant to the question topic. The correct answer should be included afterward in the format: 
      'Answer: <correct option>'. The wrong answer should not be part of the four options, but still relevant 
      to the question. The final response should have this format:

      Question: <Question text>
      A) <Answer 1>
      B) <Answer 2>
      C) <Answer 3>
      D) <Answer 4>
      Answer: <correct option>
      Wrong Answer: <wrong but relevant answer>
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const lines = response.data.choices[0].message?.content?.split("\n") || [];
    const question = lines.find((line: string) => line && !line.startsWith("A)") && !line.startsWith("B)") && !line.startsWith("C)") && !line.startsWith("D)") && !line.startsWith("Answer:") && !line.startsWith("Wrong Answer:"));
    const answers = lines
      .filter((line: string) => line.startsWith("A)") || line.startsWith("B)") || line.startsWith("C)") || line.startsWith("D)"))
      .reduce((acc: { [x: string]: any; }, line: { split: (arg0: string, arg1: number) => [any, any]; }) => {
        const [option, answer] = line.split(")", 2);
        acc[option.trim()] = answer.trim();
        return acc;
      }, {} as Record<string, string>);

    const correctAnswerLine = lines.find((line: string) => line.startsWith("Answer:"));
    const correctAnswer = correctAnswerLine?.split(":")[1]?.trim().split(")")[0]?.trim();
    const wrongAnswerLine = lines.find((line: string) => line.startsWith("Wrong Answer:"));
    const wrongAnswer = wrongAnswerLine?.split(":")[1]?.trim();

    return {
      question,
      answers,
      correct_answer: correctAnswer,
      wrong_answer: wrongAnswer,
    };
  } catch (error) {
    console.error(`Error generating trivia question: ${error}`);
    return { error: "Unable to generate trivia question." };
  }
}

// Function to generate narration
async function generateNarration(players: { name: string; money: number; score: number; money_change: number }[]) {
  try {
    const sortedPlayers = players.sort((a, b) => Math.abs(b.money_change) - Math.abs(a.money_change));
    const highlightedPlayers = sortedPlayers.slice(0, 2);

    const narrationInput = highlightedPlayers
      .map(p => `${p.name} now has $${p.money} and ${p.score} points.`)
      .join("\n");

    const prompt = `
      Based on the following player statuses, generate a short narration. 
      Focus on changes and make it exciting:

      ${narrationInput}

      Keep sentences short and dynamic.
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 80,
    });

    return {
      narration: response.data.choices[0].message?.content?.trim(),
    };
  } catch (error) {
    console.error(`Error generating narration: ${error}`);
    return { error: "Unable to generate narration." };
  }
}

// Function to generate betting commentary
async function generateBettingCommentary(players: { name: string; money: number; current_bet: number }[], phase: string) {
  try {
    let prompt = "";

    if (phase === "pre") {
      prompt = `
        The players are about to place their bets. Here are their current balances:
        ${players.map(p => `${p.name}: $${p.money}`).join("\n")}
        Generate a short and exciting commentary about what might happen. Keep it brief.
      `;
    } else if (phase === "post") {
      prompt = `
        The players have placed their bets. Here are their decisions:
        ${players.map(p => `${p.name} bet $${p.current_bet}.`).join("\n")}
        Generate a short summary about their choices. Keep sentences short.
      `;
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 80,
    });

    return {
      phase,
      commentary: response.data.choices[0].message?.content?.trim(),
    };
  } catch (error) {
    console.error(`Error generating betting commentary: ${error}`);
    return { error: "Unable to generate betting commentary." };
  }
}