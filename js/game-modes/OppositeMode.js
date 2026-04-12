/**
 * Opposites Mode Implementation
 * Player finds the opposite (antonym) of a given word
 */

import { GameMode } from './GameMode.js';

export class OppositeMode extends GameMode {
  initialize(questions) {
    return this.shuffle(questions);
  }

  getQuestionText(question) {
    // question is [word, opposite]
    return question[0];
  }

  validateAnswer(userAnswer, question) {
    const correctAnswer = question[1];
    return userAnswer.trim() === correctAnswer;
  }

  getCorrectAnswer(question) {
    return question[1];
  }

  generateChoices(question) {
    // Opposites mode doesn't use multiple choice
    return [];
  }

  renderQuestion(question) {
    return {
      questionText: this.getQuestionText(question),
      inputLabel: 'כתוב את ההפך:',
      choices: [],
      hasInput: true,
      hasChoices: false
    };
  }
}
