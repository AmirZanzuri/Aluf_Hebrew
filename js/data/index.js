/**
 * Game Data Index
 * Central export point for all game datasets
 */

export { opposites } from './opposites.js';
export { synonyms } from './synonyms.js';
export { meanings } from './meanings.js';

import { opposites } from './opposites.js';
import { synonyms } from './synonyms.js';
import { meanings } from './meanings.js';

export const GameData = {
  opposites,
  synonyms,
  meanings
};
