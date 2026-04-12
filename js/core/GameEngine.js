/**
 * Game Engine
 * Core game logic orchestrator
 */

import { OppositeMode } from '../game-modes/OppositeMode.js';
import { SynonymMode } from '../game-modes/SynonymMode.js';
import { MeaningMode } from '../game-modes/MeaningMode.js';
import { GameData } from '../data/index.js';
import { Database } from './Database.js';
import { GAME_MODES } from '../utils/constants.js';

export class GameEngine {
  constructor() {
    this.modes = {
      [GAME_MODES.OPPOSITES]: new OppositeMode(GAME_MODES.OPPOSITES),
      [GAME_MODES.SYNONYMS]: new SynonymMode(GAME_MODES.SYNONYMS),
      [GAME_MODES.MEANINGS]: new MeaningMode(GAME_MODES.MEANINGS)
    };
  }

  /**
   * Start a new game with specified mode
   * @param {string} mode - Game mode key
   * @returns {Array} Initialized questions
   */
  startGame(mode) {
    if (!this.modes[mode]) {
      throw new Error(`Invalid game mode: ${mode}`);
    }

    const gameMode = this.modes[mode];
    const rawQuestions = GameData[mode];
    
    if (!rawQuestions) {
      throw new Error(`No data for mode: ${mode}`);
    }

    return gameMode.initialize(rawQuestions);
  }

  /**
   * Get game mode handler
   * @param {string} mode - Mode key
   * @returns {GameMode} Mode instance
   */
  getMode(mode) {
    return this.modes[mode];
  }

  /**
   * Check if answer is correct
   * @param {string|Object} userAnswer - User input
   * @param {Object} question - Question object
   * @param {string} mode - Game mode
   * @param {Object} additionalData - Extra data (e.g., selectedSentence)
   * @returns {Object} { isCorrect, correctAnswer }
   */
  checkAnswer(userAnswer, question, mode, additionalData = {}) {
    const gameMode = this.modes[mode];
    if (!gameMode) {
      throw new Error(`Invalid game mode: ${mode}`);
    }

    let isCorrect = false;

    if (mode === GAME_MODES.MEANINGS) {
      isCorrect = gameMode.validateAnswer(
        userAnswer,
        question,
        additionalData.selectedSentence
      );
    } else {
      isCorrect = gameMode.validateAnswer(userAnswer, question);
    }

    const correctAnswer = gameMode.getCorrectAnswer(question);

    return {
      isCorrect,
      correctAnswer,
      userAnswer: userAnswer || '(empty)'
    };
  }

  /**
   * Get rendered question data
   * @param {Object} question - Question object
   * @param {string} mode - Game mode
   * @returns {Object} Rendered question data
   */
  renderQuestion(question, mode) {
    const gameMode = this.modes[mode];
    if (!gameMode) {
      throw new Error(`Invalid game mode: ${mode}`);
    }

    return gameMode.renderQuestion(question);
  }

  /**
   * Record game result
   * @param {string} mode - Game mode
   * @param {number} correct - Correct answers
   * @param {number} total - Total questions
   * @param {Array} mistakes - Mistakes array
   */
  recordGameResult(mode, correct, total, mistakes = []) {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    Database.recordGame(mode, percentage, mistakes);
  }

  /**
   * Get player stats for mode
   * @param {string} mode - Game mode
   * @returns {Object} { best: number, plays: number }
   */
  getStats(mode) {
    return Database.getModeStats(mode);
  }

  /**
   * Get all stats
   * @returns {Object} Stats for all modes
   */
  getAllStats() {
    return Database.getScores();
  }
}

// Create singleton
export const gameEngine = new GameEngine();
