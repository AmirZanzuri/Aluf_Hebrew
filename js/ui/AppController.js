/**
 * Application Controller
 * Main orchestrator that connects State, Engine, and Renderer
 */

import { appState } from '../core/StateManager.js';
import { gameEngine } from '../core/GameEngine.js';
import { Renderer } from './Renderer.js';
import { Database } from '../core/Database.js';
import { el } from '../utils/helpers.js';
import { GAME_MODES, TIMING } from '../utils/constants.js';

export class AppController {
  constructor() {
    this.selectedChoice = null;
    this.setupEventListeners();
    this.renderHome();
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Check answer on button click
    el('g-check-btn').addEventListener('click', () => this.checkAnswer());

    // Check answer on Enter key
    el('g-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !el('g-check-btn').disabled) {
        this.checkAnswer();
      }
    });

    // Skip button
    const skipBtn = document.querySelector('[onclick*="skip"]') || 
                   Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('דלג'));
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skipQuestion());
    }

    // Back button
    const backBtn = el('g-back-btn') || 
                   Array.from(document.querySelectorAll('.back-btn')).pop();
    if (backBtn) {
      backBtn.addEventListener('click', () => this.goHome());
    }
  }

  /**
   * Render home screen
   */
  renderHome() {
    const stats = gameEngine.getAllStats();
    Renderer.renderHomeScreen(stats);
  }

  /**
   * Start a new game
   * @param {string} mode - Game mode
   */
  startGame(mode) {
    if (!Object.values(GAME_MODES).includes(mode)) {
      console.error('Invalid game mode:', mode);
      return;
    }

    try {
      const questions = gameEngine.startGame(mode);
      appState.startNewGame(mode, questions);
      this.renderQuestion();
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  }

  /**
   * Render current question
   */
  renderQuestion() {
    const state = appState.getState();
    const question = appState.getCurrentQuestion();

    if (!question) {
      console.error('No current question');
      return;
    }

    const questionData = gameEngine.renderQuestion(question, state.gameMode);

    Renderer.renderGameQuestion(
      questionData,
      state.currentQuestionIndex,
      state.questions.length,
      state.correctCount,
      state.gameMode
    );

    this.selectedChoice = null;
  }

  /**
   * Check the current answer
   */
  async checkAnswer() {
    const state = appState.getState();
    const question = appState.getCurrentQuestion();
    const userAnswer = el('g-input').value;

    if (!userAnswer && state.gameMode !== GAME_MODES.MEANINGS) {
      Renderer.showFeedback('אנא הקלד תשובה!', false, true);
      return;
    }

    if (state.gameMode === GAME_MODES.MEANINGS && !this.selectedChoice) {
      Renderer.showFeedback('בחר משפט!', false, true);
      return;
    }

    if (state.gameMode === GAME_MODES.MEANINGS && !userAnswer) {
      Renderer.showFeedback('הקלד מילה!', false, true);
      return;
    }

    // Check answer
    const result = gameEngine.checkAnswer(
      userAnswer,
      question,
      state.gameMode,
      { selectedSentence: this.selectedChoice }
    );

    Renderer.disableInput();

    if (state.gameMode === GAME_MODES.MEANINGS && this.selectedChoice) {
      Renderer.highlightChoices(
        question.sentence.replace(question.word, '_____'),
        this.selectedChoice
      );
    }

    if (result.isCorrect) {
      appState.recordCorrect();
      Renderer.showFeedback('✓ כל הכבוד! תשובה נכונה', true);
    } else {
      const mistake = {
        question: this.getQuestionText(question, state.gameMode),
        yourAnswer: result.userAnswer,
        correctAnswer: result.correctAnswer
      };
      appState.recordWrong(mistake);
      Renderer.showFeedback(
        `✗ לא נכון. התשובה הנכונה: ${result.correctAnswer}`,
        false
      );
      Renderer.renderMistakes(appState.getState().mistakes);
    }

    // Auto-advance
    await Renderer.autoAdvanceDelay(TIMING.AUTO_ADVANCE_MS);

    appState.nextQuestion();

    if (appState.isGameOver()) {
      this.endGame();
    } else {
      this.renderQuestion();
    }
  }

  /**
   * Skip current question
   */
  skipQuestion() {
    const state = appState.getState();
    const question = appState.getCurrentQuestion();

    const correctAnswer = this.getCorrectAnswer(question, state.gameMode);
    const mistake = {
      question: this.getQuestionText(question, state.gameMode),
      yourAnswer: '(דילוג)',
      correctAnswer
    };

    appState.recordSkipped(mistake);
    Renderer.renderMistakes(appState.getState().mistakes);

    appState.nextQuestion();

    if (appState.isGameOver()) {
      this.endGame();
    } else {
      this.renderQuestion();
    }
  }

  /**
   * End game and show results
   */
  endGame() {
    const state = appState.getState();

    const gameResult = {
      correct: state.correctCount,
      wrong: state.wrongCount,
      skipped: state.skippedCount,
      total: state.questions.length,
      mode: state.gameMode
    };

    // Record to database
    gameEngine.recordGameResult(
      state.gameMode,
      state.correctCount,
      state.questions.length,
      state.mistakes
    );

    Renderer.renderEndScreen(gameResult, state.mistakes);
  }

  /**
   * Go back to home screen
   */
  goHome() {
    appState.goHome();
    this.renderHome();
  }

  /**
   * Set selected choice
   * @param {string} choice - Selected choice text
   */
  setSelectedChoice(choice) {
    this.selectedChoice = choice;
  }

  /**
   * Get question text for display
   * @private
   */
  getQuestionText(question, mode) {
    if (mode === GAME_MODES.OPPOSITES) {
      return question[0];
    } else if (mode === GAME_MODES.SYNONYMS) {
      return question.word;
    } else if (mode === GAME_MODES.MEANINGS) {
      return question.meaning;
    }
    return '';
  }

  /**
   * Get correct answer for question
   * @private
   */
  getCorrectAnswer(question, mode) {
    if (mode === GAME_MODES.OPPOSITES) {
      return question[1];
    } else if (mode === GAME_MODES.SYNONYMS) {
      return question.accepted.join(' / ');
    } else if (mode === GAME_MODES.MEANINGS) {
      return question.word;
    }
    return '';
  }
}

// Create and export singleton
export const appController = new AppController();
window.AppController = appController;
