/**
 * Renderer
 * Handles all view updates and DOM manipulation
 */

import { el, clearChildren, createElement, calculatePercentage, getResultFeedback } from '../utils/helpers.js';
import { MODE_META, GAME_MODES, TIMING } from '../utils/constants.js';

export class Renderer {
  /**
   * Switch to screen by ID
   * @param {string} screenId - Screen ID (home, game, end)
   */
  static showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    el('screen-' + screenId).classList.add('active');
  }

  /**
   * Render home screen with stats
   * @param {Object} stats - Player statistics
   */
  static renderHomeScreen(stats) {
    this.showScreen('home');
    const scoresContainer = el('home-scores');
    clearChildren(scoresContainer);

    const modes = [
      { key: GAME_MODES.OPPOSITES, ...MODE_META.opposites, emoji: '🔄' },
      { key: GAME_MODES.SYNONYMS, ...MODE_META.synonyms, emoji: '💬' },
      { key: GAME_MODES.MEANINGS, ...MODE_META.meanings, emoji: '🔍' }
    ];

    modes.forEach(mode => {
      const s = stats[mode.key];
      const row = createElement('div', { class: 'score-row' });

      const label = createElement('div', { class: 'label' });
      label.innerHTML = `<span class="icon-sm">${mode.emoji}</span>${mode.label}`;

      const data = createElement('div');
      data.innerHTML = `
        <span class="best">${s.best}%</span>
        <span class="plays"> · ${s.plays} משחקים</span>
      `;

      row.appendChild(label);
      row.appendChild(data);
      scoresContainer.appendChild(row);
    });
  }

  /**
   * Render game question
   * @param {Object} questionData - Rendered question from GameMode
   * @param {number} currentIndex - Current question index
   * @param {number} totalQuestions - Total questions
   * @param {number} score - Current score
   * @param {string} mode - Game mode
   */
  static renderGameQuestion(questionData, currentIndex, totalQuestions, score, mode) {
    this.showScreen('game');

    // Update header
    const meta = MODE_META[mode];
    el('g-mode-label').textContent = meta.icon + ' ' + meta.label;
    el('g-score-live').textContent = `ניקוד: ${score}`;

    // Update progress
    const progress = (currentIndex / totalQuestions) * 100;
    el('g-progress').style.width = progress + '%';

    // Update question
    el('g-label').textContent = questionData.inputLabel;
    el('g-counter').textContent = `שאלה ${currentIndex + 1} מתוך ${totalQuestions}`;
    el('g-question').textContent = questionData.questionText;

    // Clear and setup input
    el('g-input').value = '';
    el('g-input-wrap').style.display = questionData.hasInput ? 'flex' : 'none';

    // Clear and setup choices
    const choicesContainer = el('g-choices');
    clearChildren(choicesContainer);

    if (questionData.hasChoices && questionData.choices.length > 0) {
      questionData.choices.forEach(choice => {
        const btn = createElement('button', {
          class: 'choice-btn',
          text: choice
        });

        btn.onclick = (e) => {
          if (el('g-check-btn').disabled) return;
          document.querySelectorAll('.choice-btn').forEach(b => {
            b.classList.remove('selected');
          });
          btn.classList.add('selected');
          window.AppController?.setSelectedChoice(choice);
        };

        choicesContainer.appendChild(btn);
      });
    }

    // Reset feedback and button
    el('g-feedback').className = 'feedback';
    el('g-feedback').textContent = '';
    el('g-check-btn').disabled = false;

    // Reset mistakes panel
    this.renderMistakes([]);
  }

  /**
   * Show feedback message
   * @param {string} message - Feedback message
   * @param {boolean} isCorrect - Is answer correct?
   * @param {boolean} isNeutral - Is it neutral feedback?
   */
  static showFeedback(message, isCorrect, isNeutral = false) {
    const fb = el('g-feedback');
    fb.textContent = message;
    fb.className = 'feedback ' + (isNeutral ? '' : isCorrect ? 'correct' : 'wrong');
  }

  /**
   * Highlight correct/wrong choice
   * @param {string} correctSentence - Correct sentence
   * @param {string} selectedSentence - Selected sentence (or null)
   */
  static highlightChoices(correctSentence, selectedSentence) {
    document.querySelectorAll('.choice-btn').forEach(btn => {
      const text = btn.textContent;
      if (text === correctSentence) {
        btn.classList.add('correct');
      } else if (text === selectedSentence && text !== correctSentence) {
        btn.classList.add('wrong');
      }
    });
  }

  /**
   * Disable input and buttons after answer
   */
  static disableInput() {
    el('g-check-btn').disabled = true;
    el('g-input').disabled = true;
  }

  /**
   * Render mistakes during game
   * @param {Array} mistakes - Array of mistake objects
   */
  static renderMistakes(mistakes) {
    const list = el('g-mistakes-list');
    clearChildren(list);

    if (mistakes.length === 0) {
      list.innerHTML = '<div class="empty">אין טעויות עדיין 🎉</div>';
      return;
    }

    mistakes.forEach(mistake => {
      const item = createElement('div', { class: 'mistake-item' });
      item.innerHTML = `
        <div class="m-q">שאלה: ${mistake.question}</div>
        <div class="m-yours">✗ תשובתך: ${mistake.yourAnswer}</div>
        <div class="m-correct">✓ נכון: ${mistake.correctAnswer}</div>
      `;
      list.appendChild(item);
    });
  }

  /**
   * Render end screen with results
   * @param {Object} gameResult - Game result object
   * @param {Array} mistakes - All mistakes from game
   */
  static renderEndScreen(gameResult, mistakes) {
    this.showScreen('end');

    const {
      correct,
      wrong,
      skipped,
      total,
      mode
    } = gameResult;

    const percentage = calculatePercentage(correct, total);
    const feedback = getResultFeedback(percentage);

    el('e-icon').textContent = feedback.icon;
    el('e-title').textContent = feedback.title;
    el('e-score').textContent = percentage + '%';
    el('e-sub').textContent = `${correct} נכון מתוך ${total} שאלות`;
    el('e-correct').textContent = correct;
    el('e-wrong').textContent = wrong;
    el('e-skipped').textContent = skipped;

    // Render mistakes
    const eList = el('e-mistakes-list');
    clearChildren(eList);

    if (mistakes.length === 0) {
      eList.innerHTML = '<div class="empty">ללא טעויות! מושלם 🎉</div>';
    } else {
      mistakes.forEach(mistake => {
        const item = createElement('div', { class: 'mistake-item' });
        item.innerHTML = `
          <div class="m-q">שאלה: ${mistake.question}</div>
          <div class="m-yours">✗ תשובתך: ${mistake.yourAnswer}</div>
          <div class="m-correct">✓ נכון: ${mistake.correctAnswer}</div>
        `;
        eList.appendChild(item);
      });
    }
  }

  /**
   * Disable button and delay auto-advance
   * @param {number} delayMs - Delay in milliseconds
   * @returns {Promise}
   */
  static async autoAdvanceDelay(delayMs = TIMING.AUTO_ADVANCE_MS) {
    el('g-check-btn').disabled = true;
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}
