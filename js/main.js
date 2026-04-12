/**
 * Main Application Bootstrap
 * Initializes all modules and starts the app
 */

import { appController } from './ui/AppController.js';
import { appState } from './core/StateManager.js';
import { gameEngine } from './core/GameEngine.js';

// Expose app interfaces globally for onclick handlers
window.App = {
  startGame: (mode) => appController.startGame(mode),
  checkAnswer: () => appController.checkAnswer(),
  next: () => appController.skipQuestion(),
  goHome: () => appController.goHome(),
  state: () => appState.getState()
};

console.log('Hebrew Word Game initialized');
console.log('Available commands: App.startGame(), App.checkAnswer(), App.next(), App.goHome()');
