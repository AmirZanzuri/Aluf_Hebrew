/**
 * Game Constants & Configuration
 */

export const GAME_MODES = {
  OPPOSITES: 'opposites',
  SYNONYMS: 'synonyms',
  MEANINGS: 'meanings',
};

export const MODE_META = {
  opposites: {
    label: 'הפכים',
    icon: '🔄',
    inputLabel: 'כתוב את ההפך:',
    description: 'מצא את ההפך'
  },
  synonyms: {
    label: 'מילים נרדפות',
    icon: '💬',
    inputLabel: 'כתוב מילה נרדפת:',
    description: 'מילה בעלת משמעות דומה'
  },
  meanings: {
    label: 'פירושים',
    icon: '🔍',
    inputLabel: 'בחר את המשפט הנכון והשלם את המילה:',
    description: 'התאם פירוש למשפט'
  }
};

export const UI_STATES = {
  HOME: 'home',
  GAME: 'game',
  END: 'end'
};

export const TIMING = {
  AUTO_ADVANCE_MS: 1500,
  FADE_IN_MS: 350,
  TRANSITION_MS: 250
};

export const SCORING = {
  PERFECT: 90,
  GOOD: 70,
  FAIR: 50
};

export const DB_KEY = 'word_game_v2';

export const MAX_HISTORY = 50;
