/**
 * Meanings Mode Implementation
 * Player selects correct sentence and fills in the word based on definition
 */

import { GameMode } from './GameMode.js';
import { meanings } from '../data/meanings.js';
import { normalizeHebrewText } from '../utils/helpers.js';

export class MeaningMode extends GameMode {
  initialize(questions) {
    return this.shuffle(questions);
  }

  getQuestionText(question) {
    // question is { word, meaning, sentence }
    return question.meaning;
  }

  validateAnswer(userAnswer, question, selectedSentence) {
    if (!selectedSentence) return false;

    const userTrim = normalizeHebrewText(userAnswer.trim());
    const correctSentence = question.sentence.replace(question.word, '_____');
    
    // Normalize both sentence and word for comparison
    const sentenceCorrect = normalizeHebrewText(selectedSentence) === normalizeHebrewText(correctSentence);
    const wordCorrect = userTrim === normalizeHebrewText(question.word);

    return sentenceCorrect && wordCorrect;
  }

  getCorrectAnswer(question) {
    return question.word;
  }

  /**
   * Generate 4 sentence choices with blanks
   * @param {Object} question - Current question
   * @returns {Array} Array of sentences with blanks
   */
  generateChoices(question) {
    const correctSentence = question.sentence.replace(question.word, '_____');

    // Get 3 random other sentences
    let pool = meanings
      .filter(m => m.word !== question.word)
      .map(m => m.sentence.replace(m.word, '_____'));

    pool = this.shuffle(pool).slice(0, 3);

    // Combine and shuffle all 4
    const options = this.shuffle([correctSentence, ...pool]);

    return options;
  }

  renderQuestion(question) {
    const choices = this.generateChoices(question);

    return {
      questionText: this.getQuestionText(question),
      inputLabel: 'בחר את המשפט הנכון והשלם את המילה:',
      choices,
      hasInput: true,
      hasChoices: true
    };
  }
}
