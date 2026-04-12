/**
 * Base GameMode Class
 * Abstract base class for all game modes
 */

export class GameMode {
  constructor(mode, data) {
    this.mode = mode;
    this.data = data;
  }

  /**
   * Initialize mode with questions
   * @param {Array} questions - Raw questions data
   * @returns {Array} Shuffled questions
   */
  initialize(questions) {
    throw new Error('initialize() must be implemented');
  }

  /**
   * Render question to HTML
   * @param {Object} question - Question object
   * @returns {Object} { questionHTML, inputLabel }
   */
  renderQuestion(question) {
    throw new Error('renderQuestion() must be implemented');
  }

  /**
   * Validate user answer
   * @param {string|Object} userAnswer - User's answer
   * @param {Object} question - Question object
   * @returns {boolean} Is answer correct?
   */
  validateAnswer(userAnswer, question) {
    throw new Error('validateAnswer() must be implemented');
  }

  /**
   * Get correct answer for display
   * @param {Object} question - Question object
   * @returns {string} Correct answer text
   */
  getCorrectAnswer(question) {
    throw new Error('getCorrectAnswer() must be implemented');
  }

  /**
   * Get question display text
   * @param {Object} question - Question object
   * @returns {string} Question text
   */
  getQuestionText(question) {
    throw new Error('getQuestionText() must be implemented');
  }

  /**
   * Generate answer choices for multiple choice modes
   * @param {Object} question - Question object
   * @returns {Array} Array of choice options
   */
  generateChoices(question) {
    return [];
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @protected
   * @param {Array} arr - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
