# Hebrew Word Game - Architecture Guide

## Current State
The game is currently a **monolithic single-file application** (~1000 lines) mixing concerns:
- HTML structure embedded in JSX
- CSS styles (good organization actually!)
- Game logic mixed with DOM manipulation
- Data and state management not separated

## Problems with Current Architecture
1. **Tight Coupling**: DOM manipulation directly in game logic
2. **Hard to Test**: Cannot test game logic independently
3. **Difficult to Extend**: Adding new game modes requires modifying core logic
4. **Maintenance Issues**: Hard to track bugs across layers
5. **Code Reuse**: Views and helpers not reusable
6. **Scalability**: Difficult to add features like analytics, multiplayer, etc.

---

## Proposed Architecture: Modular Structure

```
hebrew-game/
├── index.html              # Single entry point
├── css/
│   ├── base.css           # Colors, typography, resets
│   ├── components.css     # Buttons, cards, inputs
│   ├── layouts.css        # Screens, grid layouts
│   └── animations.css     # Transitions, keyframes
├── js/
│   ├── main.js            # Application bootstrap
│   ├── core/
│   │   ├── GameEngine.js  # Core game logic (mode-agnostic)
│   │   ├── StateManager.js # Centralized state management
│   │   └── Database.js     # LocalStorage persistence
│   ├── game-modes/
│   │   ├── GameMode.js     # Base class for game modes
│   │   ├── OppositeMode.js # Opposites implementation
│   │   ├── SynonymMode.js  # Synonyms implementation
│   │   └── MeaningMode.js  # Meanings implementation
│   ├── data/
│   │   ├── GameData.js     # Import all datasets
│   │   ├── opposites.js    # Opposites dataset
│   │   ├── synonyms.js     # Synonyms dataset
│   │   └── meanings.js     # Meanings dataset
│   ├── ui/
│   │   ├── Renderer.js     # View rendering logic
│   │   ├── screens/
│   │   │   ├── HomeScreen.js
│   │   │   ├── GameScreen.js
│   │   │   └── EndScreen.js
│   │   └── components/
│   │       ├── Question.js
│   │       ├── ScoreBoard.js
│   │       └── MistakesPanel.js
│   └── utils/
│       ├── helpers.js      # shuffle, el(), etc.
│       └── constants.js    # Magic strings, config
└── README.md               # Documentation
```

---

## Core Design Patterns

### 1. **State Management**
```javascript
State = {
  global: { currentMode, user },
  game: { questions, index, score, mistakes },
  ui: { currentScreen, selectedChoice, answered }
}
```
- Single source of truth
- State changes trigger view updates
- Immutable updates (never mutate state directly)

### 2. **Game Mode Strategy Pattern**
```javascript
class GameMode {
  initialize(questions) { }
  renderQuestion(q) { }
  validateAnswer(answer) { return true/false; }
  getCorrectAnswer(q) { }
}

class OppositeMode extends GameMode { }
class SynonymMode extends GameMode { }
class MeaningMode extends GameMode { }
```

### 3. **Observer Pattern for Rendering**
```javascript
StateManager.on('state-changed', (newState) => {
  Renderer.render(newState);
});
```

---

## Key Improvements

### 1. **Separation of Concerns**
```
┌─────────────────────────────────────┐
│ UI Layer (Renderer)                 │
│ - Screen management                 │
│ - DOM manipulation                  │
└──────────────┬──────────────────────┘
               │ observes
┌──────────────▼──────────────────────┐
│ State Layer (StateManager)          │
│ - Game state                        │
│ - User data                         │
│ - UI state                          │
└──────────────┬──────────────────────┘
               │ uses
┌──────────────▼──────────────────────┐
│ Game Logic Layer (GameEngine)       │
│ - Question generation               │
│ - Answer validation                 │
│ - Scoring                           │
│ - Mode strategies                   │
└─────────────────────────────────────┘
```

### 2. **Easy to Add New Game Modes**
Just create a new class:
```javascript
class TranslationMode extends GameMode {
  initialize(questions) { /* override */ }
  renderQuestion(q) { /* override */ }
  validateAnswer(answer) { /* override */ }
}
```

### 3. **Testable**
```javascript
// Can test game logic without DOM
const engine = new GameEngine();
const result = engine.checkAnswer('answer', 'expected');
expect(result).toBe(true);
```

### 4. **Reusable Components**
- QuestionCard, ScoreBoard, MistakesPanel can be used in multiple screens
- Easy to create new UI pages

---

## Implementation Steps

### Phase 1: Foundation (Extract & Organize)
1. Extract CSS into separate files
2. Split data (opposites, synonyms, meanings)
3. Create basic folder structure
4. Create utility functions

### Phase 2: Core Architecture
1. Build StateManager class
2. Build GameEngine class
3. Create GameMode abstract class
4. Implement three mode strategies

### Phase 3: UI Refactoring
1. Create Renderer class
2. Extract screen components
3. Create UI components
4. Wire up state → view updates

### Phase 4: Integration & Polish
1. Hook everything together
2. Migrate all event handlers
3. Test functionality
4. Performance optimization

---

## Benefits

✅ **Scalability**: Easy to add 5 more game modes with minimal code changes  
✅ **Maintainability**: Bug fixes isolated to specific modules  
✅ **Testability**: Each piece can be unit tested  
✅ **Readability**: Clear file structure, obvious where things belong  
✅ **Reusability**: Components/utilities used across features  
✅ **Performance**: Lazy loading, code splitting becomes possible  
✅ **Collaboration**: Team members know where to make changes  

---

## Migration Path

You can migrate incrementally:
1. Keep current file, start adding new modules to `/js`
2. New features use modular approach
3. Gradually refactor old code
4. Eventually delete monolithic file

This approach is lower-risk than full refactoring at once!

---

## Configuration & Constants

Create `js/utils/constants.js`:
```javascript
export const GAME_MODES = {
  OPPOSITES: 'opposites',
  SYNONYMS: 'synonyms',
  MEANINGS: 'meanings'
};

export const UI_STATES = {
  HOME: 'home',
  GAME: 'game',
  END: 'end'
};

export const ANIMATIONS = {
  FADE_IN: 300,
  AUTO_ADVANCE: 1500
};
```

---

## Next Steps

Ready to start refactoring? Pick a starting point:
- **Option A**: Start with data extraction (lowest risk)
- **Option B**: Build StateManager first (foundational)
- **Option C**: Create GameMode classes (enables new modes quickly)
