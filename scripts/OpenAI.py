import openai
import os
from dotenv import load_dotenv
import random
import json

# Load environment variables
load_dotenv()

# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_trivia_question():
    """
    Generates a multiple-choice trivia question using OpenAI API and returns it as a JSON object.
    """
    try:
        topics = ["history", "science", "geography", "sports", "pop culture"]
        selected_topic = random.choice(topics)

        prompt = (
            f"Generate a multiple-choice trivia question about {selected_topic} with four options, "
            "clearly marked A, B, C, and D. Then, generate a plausible but incorrect wrong answer that is still "
            "relevant to the question topic. The correct answer should be included afterward in the format: "
            "'Answer: <correct option>'. The wrong answer should not be part of the four options, but still relevant "
            "to the question. The final response should have this format:\n\n"
            "Question: <Question text>\n"
            "A) <Answer 1>\n"
            "B) <Answer 2>\n"
            "C) <Answer 3>\n"
            "D) <Answer 4>\n"
            "Answer: <correct option>\n"
            "Wrong Answer: <wrong but relevant answer>"
        )

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
        )

        # Parse the raw trivia question message into a structured JSON format directly
        lines = response.choices[0].message.content.strip().split("\n")

        question = next(
            line for line in lines if
            line.strip() and not line.startswith(("A)", "B)", "C)", "D)", "Answer:", "Wrong Answer:")))
        answers = {line.split(")")[0].strip(): line.split(")", 1)[1].strip() for line in lines if
                   line.startswith(("A)", "B)", "C)", "D)"))}
        correct_answer_line = next(line for line in lines if line.startswith("Answer:"))
        correct_answer = correct_answer_line.split(":")[1].strip().split(")")[0].strip()
        wrong_answer_line = next(line for line in lines if line.startswith("Wrong Answer:"))
        wrong_answer = wrong_answer_line.split(":")[1].strip()

        trivia_json = {
            "question": question,
            "answers": answers,
            "correct_answer": correct_answer,
            "wrong_answer": wrong_answer
        }

        return trivia_json

    except Exception as e:
        print(f"Error generating trivia question: {e}")
        return {"error": "Unable to generate trivia question."}


def generate_narration(players):
    """
    Generates short narration about one or two most interesting players and returns it as a JSON object.
    """
    try:
        # Sort players by money fluctuation
        sorted_players = sorted(players, key=lambda p: abs(p['money_change']), reverse=True)
        highlighted_players = sorted_players[:2]

        # Prepare the game state for narration
        narration_input = "\n".join(
            [f"{p['name']} now has ${p['money']} and {p['score']} points." for p in highlighted_players]
        )

        prompt = (
            "Based on the following player statuses, generate a short narration. "
            f"Focus on changes and make it exciting:\n\n{narration_input}\n\n"
            "Keep sentences short and dynamic."
        )

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=80,
        )

        narration_json = {
            "narration": response.choices[0].message.content.strip()
        }

        return narration_json

    except Exception as e:
        print(f"Error generating narration: {e}")
        return {"error": "Unable to generate narration."}


def generate_betting_commentary(players, phase):
    """
    Generates commentary for the betting phase (pre-betting or post-betting) and returns it as a JSON object.
    """
    try:
        if phase == "pre":
            prompt = (
                "The players are about to place their bets. Here are their current balances:\n" +
                "\n".join([f"{p['name']}: ${p['money']}" for p in players]) +
                "\nGenerate a short and exciting commentary about what might happen. Keep it brief."
            )
        elif phase == "post":
            prompt = (
                "The players have placed their bets. Here are their decisions:\n" +
                "\n".join([f"{p['name']} bet ${p['current_bet']}." for p in players]) +
                "\nGenerate a short summary about their choices. Keep sentences short."
            )

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=80,
        )

        betting_commentary_json = {
            "phase": phase,
            "commentary": response.choices[0].message.content.strip()
        }

        return betting_commentary_json

    except Exception as e:
        print(f"Error generating betting commentary: {e}")
        return {"error": "Unable to generate betting commentary."}
