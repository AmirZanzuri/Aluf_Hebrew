/**
 * Synonyms Mode Implementation
 * Player finds a synonym (word with similar meaning) of a given word
 */

import { GameMode } from './GameMode.js';
import { normalizeHebrewText } from '../utils/helpers.js';

export class SynonymMode extends GameMode {
  initialize(questions) {
    return this.shuffle(questions);
  }

  getQuestionText(question) {
    // question is { word, accepted: [...] }
    return question.word;
  }

  validateAnswer(userAnswer, question) {
    const userTrim = normalizeHebrewText(userAnswer.trim());
    // Normalize all accepted answers for comparison
    return question.accepted.some(answer => 
      normalizeHebrewText(answer) === userTrim
    );
  }

  getCorrectAnswer(question) {
    return question.accepted.join(' / ');
  }

  generateChoices(question) {
    // Synonyms mode doesn't use multiple choice
    return [];
  }

  renderQuestion(question) {
    return {
      questionText: this.getQuestionText(question),
      inputLabel: 'כתוב מילה נרדפת:',
      choices: [],
      hasInput: true,
      hasChoices: false
    };
  }
}
