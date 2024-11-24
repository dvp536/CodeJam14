// src/utils/questionGenerator.ts

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const getQuestionForSubject = async (subject: string) => {
  const prompt = `As a trivia quiz generator, create a medium to challenging multiple-choice question about "${subject}". Indicate the correct answer. Format:

Question: ...
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Correct Answer: A/B/C/D`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates unique and interesting trivia questions for a quiz game.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8, // Increased for more randomness
      max_tokens: 200, // Adjusted to accommodate longer responses
    });

    const text = completion.choices[0]?.message?.content || '';
    const parsedQuestion = parseQuestion(text);

    if (parsedQuestion) {
      return parsedQuestion;
    } else {
      throw new Error('Failed to parse question');
    }
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question');
  }
};

const parseQuestion = (text: string) => {
  const lines = text.trim().split('\n').filter((line) => line.trim() !== '');
  let question = '';
  const options: string[] = [];
  let correctAnswer = '';

  for (const line of lines) {
    if (line.startsWith('Question:')) {
      question = line.replace('Question:', '').trim();
    } else if (/^[A-D]\)/.test(line)) {
      options.push(line.trim());
    } else if (line.startsWith('Correct Answer:')) {
      correctAnswer = line.replace('Correct Answer:', '').trim().toUpperCase();
    }
  }

  if (question && options.length === 4 && /^[A-D]$/.test(correctAnswer)) {
    return { question, options, correctAnswer };
  } else {
    return null;
  }
};
