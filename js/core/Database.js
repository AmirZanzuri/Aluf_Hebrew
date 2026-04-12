/**
 * Database Manager
 * Handles all localStorage persistence operations
 */

import { DB_KEY, MAX_HISTORY } from '../utils/constants.js';

export class Database {
  /**
   * Load all data from localStorage
   * @returns {Object} Database object
   */
  static load() {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : this._createFresh();
    } catch (error) {
      console.error('Database load error:', error);
      return this._createFresh();
    }
  }

  /**
   * Save data to localStorage
   * @param {Object} data - Data to save
   */
  static save(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Database save error:', error);
    }
  }

  /**
   * Record a completed game
   * @param {string} mode - Game mode (opposites, synonyms, meanings)
   * @param {number} percentage - Score percentage
   * @param {Array} mistakes - Array of mistake objects
   */
  static recordGame(mode, percentage, mistakes = []) {
    const db = this.load();
    const modeData = db.scores[mode];

    if (modeData) {
      modeData.plays++;
      if (percentage > modeData.best) {
        modeData.best = percentage;
      }
    }

    // Store mistakes with timestamp
    if (mistakes.length > 0) {
      const entry = {
        mode,
        date: new Date().toLocaleDateString('he-IL'),
        percentage,
        mistakes
      };
      db.history.unshift(entry);

      // Keep only last 50 records
      if (db.history.length > MAX_HISTORY) {
        db.history = db.history.slice(0, MAX_HISTORY);
      }
    }

    this.save(db);
  }

  /**
   * Get all player statistics
   * @returns {Object} Scores for all modes
   */
  static getScores() {
    return this.load().scores;
  }

  /**
   * Get game history
   * @returns {Array} Array of previous game records
   */
  static getHistory() {
    return this.load().history;
  }

  /**
   * Get stats for specific mode
   * @param {string} mode - Game mode
   * @returns {Object} Score data
   */
  static getModeStats(mode) {
    return this.load().scores[mode] || { best: 0, plays: 0 };
  }

  /**
   * Clear all data
   */
  static clearAll() {
    localStorage.removeItem(DB_KEY);
  }

  /**
   * Create fresh database structure
   * @private
   * @returns {Object} Fresh database
   */
  static _createFresh() {
    return {
      scores: {
        opposites: { best: 0, plays: 0 },
        synonyms: { best: 0, plays: 0 },
        meanings: { best: 0, plays: 0 }
      },
      history: []
    };
  }
}
