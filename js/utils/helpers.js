/**
 * Helper Utilities
 */

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} arr - Array to shuffle
 * @returns {Array} - New shuffled array
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Get DOM element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement} - The element
 */
export function el(id) {
  return document.getElementById(id);
}

/**
 * Set multiple attributes on element
 * @param {HTMLElement} element - Target element
 * @param {Object} attributes - Key-value pairs
 */
export function setAttrs(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'text') {
      element.textContent = value;
    } else if (key === 'html') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Create element with attributes
 * @param {string} tag - Tag name (e.g., 'div')
 * @param {Object} attributes - Element attributes
 * @param {string} content - Inner text
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  setAttrs(element, attributes);
  if (content) element.textContent = content;
  return element;
}

/**
 * Remove all children from element
 * @param {HTMLElement} element - Target element
 */
export function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Add class with fallback removal
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class to add
 * @param {string} removeClass - Class to remove first
 */
export function setClass(element, className, removeClass = null) {
  if (removeClass) element.classList.remove(removeClass);
  element.classList.add(className);
}

/**
 * Trigger animation with callback
 * @param {HTMLElement} element - Target element
 * @param {string} animationClass - Class to add
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export function animate(element, animationClass, duration = 250) {
  return new Promise((resolve) => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Normalize Hebrew text by removing diacritical marks (nikudot)
 * @param {string} text - Hebrew text to normalize
 * @returns {string} - Normalized text without nikudot
 */
export function normalizeHebrewText(text) {
  // Remove Hebrew diacritical marks (U+0591 to U+05C7)
  return text.replace(/[\u0591-\u05C7]/g, '');
}

/**
 * Format percentage
 * @param {number} correct - Correct answers
 * @param {number} total - Total questions
 * @returns {number} - Percentage rounded
 */
export function calculatePercentage(correct, total) {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

/**
 * Get result emoji and title based on score
 * @param {number} percentage - Score percentage
 * @returns {Object} - { icon, title }
 */
export function getResultFeedback(percentage) {
  if (percentage >= 90) return { icon: '🏆', title: 'מדהים! שיא!' };
  if (percentage >= 70) return { icon: '🌟', title: 'עבודה טובה!' };
  if (percentage >= 50) return { icon: '👍', title: 'לא רע!' };
  return { icon: '💪', title: 'המשך לתרגל!' };
}
