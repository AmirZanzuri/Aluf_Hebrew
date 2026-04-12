/**
 * State Manager
 * Centralized application state management using Observer pattern
 */

export class StateManager {
  constructor() {
    this.listeners = [];
    this.state = this._initializeState();
  }

  /**
   * Subscribe to state changes
   * @param {Function} callback - Function to call on state change
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   * @private
   */
  _notify() {
    this.listeners.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }

  /**
   * Update state (immutable)
   * @param {Object} updates - Updates to merge
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this._notify();
  }

  /**
   * Get current state
   * @returns {Object} Current application state
   */
  getState() {
    return this.state;
  }

  /**
   * Initialize fresh state object
   * @private
   * @returns {Object}
   */
  _initializeState() {
    return {
      // Game state
      gameMode: null,
      questions: [],
      currentQuestionIndex: 0,

      // Score tracking
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,

      // Question state
      isAnswered: false,
      selectedChoice: null,
      currentAnswer: '',

      // Mistakes tracking
      mistakes: [],

      // UI state
      currentScreen: 'home',
      isLoading: false,

      // User data
      user: {
        name: null
      }
    };
  }

  /**
   * Reset game state for new game
   * @param {string} mode - Game mode
   * @param {Array} questions - Questions for game
   */
  startNewGame(mode, questions) {
    this.setState({
      gameMode: mode,
      questions,
      currentQuestionIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,
      isAnswered: false,
      selectedChoice: null,
      currentAnswer: '',
      mistakes: [],
      currentScreen: 'game'
    });
  }

  /**
   * Record a correct answer
   */
  recordCorrect() {
    this.setState({
      correctCount: this.state.correctCount + 1,
      isAnswered: true
    });
  }

  /**
   * Record an incorrect answer with mistake details
   * @param {Object} mistake - Mistake object
   */
  recordWrong(mistake) {
    this.setState({
      wrongCount: this.state.wrongCount + 1,
      isAnswered: true,
      mistakes: [...this.state.mistakes, mistake]
    });
  }

  /**
   * Record a skipped question
   * @param {Object} mistake - Mistake object  
   */
  recordSkipped(mistake) {
    this.setState({
      skippedCount: this.state.skippedCount + 1,
      mistakes: [...this.state.mistakes, mistake]
    });
  }

  /**
   * Move to next question
   */
  nextQuestion() {
    this.setState({
      currentQuestionIndex: this.state.currentQuestionIndex + 1,
      isAnswered: false,
      selectedChoice: null,
      currentAnswer: ''
    });
  }

  /**
   * Set UI screen
   * @param {string} screen - Screen name
   */
  setScreen(screen) {
    this.setState({ currentScreen: screen });
  }

  /**
   * Update selected choice
   * @param {any} choice - Selected choice
   */
  setSelectedChoice(choice) {
    this.setState({ selectedChoice: choice });
  }

  /**
   * Update current answer text
   * @param {string} answer - Answer text
   */
  setCurrentAnswer(answer) {
    this.setState({ currentAnswer: answer });
  }

  /**
   * Go home and reset game
   */
  goHome() {
    this.setState({
      currentScreen: 'home',
      gameMode: null,
      questions: [],
      currentQuestionIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,
      isAnswered: false,
      selectedChoice: null,
      currentAnswer: '',
      mistakes: []
    });
  }

  /**
   * Get current game progress percentage
   * @returns {number} Percentage 0-100
   */
  getProgressPercentage() {
    if (this.state.questions.length === 0) return 0;
    return Math.round((this.state.currentQuestionIndex / this.state.questions.length) * 100);
  }

  /**
   * Get total score percentage
   * @returns {number} Percentage 0-100
   */
  getScorePercentage() {
    if (this.state.questions.length === 0) return 0;
    return Math.round((this.state.correctCount / this.state.questions.length) * 100);
  }

  /**
   * Check if game is over
   * @returns {boolean}
   */
  isGameOver() {
    return this.state.currentQuestionIndex >= this.state.questions.length;
  }

  /**
   * Get current question
   * @returns {Object} Current question object
   */
  getCurrentQuestion() {
    return this.state.questions[this.state.currentQuestionIndex] || null;
  }
}

// Create singleton instance
export const appState = new StateManager();
