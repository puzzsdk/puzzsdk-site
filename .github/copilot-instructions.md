# Copilot Instructions for puzzsdk-site

## Project Overview
This is a client-side Sudoku puzzle implementation with a modular JavaScript architecture. The project uses vanilla JavaScript, HTML, and CSS without any external dependencies.

## Architecture

### Core Components
- **Grid System** (`js/grid.js`): Handles the 9x9 Sudoku grid creation and cell selection
- **Controls** (`js/buttons.js`): Manages number input and action buttons
- **Keyboard Input** (`js/keyboard.js`): Handles keyboard number entry
- **Global State** (`js/globals.js`): Maintains game state using global variables
- **Main Game Logic** (`js/main.js`): Orchestrates game initialization and core gameplay functions

### CSS Structure
- `reset.css`: CSS reset for consistent styling
- `base.css`: Core styling
- `sudoku-grid.css`: Grid-specific styles including borders and cell states
- `controls.css`: Styling for number/action buttons
- `responsive.css`: Mobile-first responsive design
- `desktop.css`: Desktop-specific overrides

## Key Patterns

### Grid Cell Selection
- Cells are referenced using row/col data attributes
- Selection state is managed through the global variables in `globals.js`:
  ```javascript
  let selectedCell = null;    // currently highlighted cell
  let selectedRow = null;
  let selectedCol = null;
  let selectedNumber = null;  // number selected via button/keyboard
  ```

### URL-based Board State
- The game supports loading board states via URL parameters
- Use `?board=...` with 81 characters representing the initial board state

## Development Workflow

### Local Development
- No build process required - serve the files directly
- Use any static file server, e.g.:
  ```bash
  python -m http.server
  # or
  npx serve
  ```

### Making Changes
1. Grid layout changes should be made in both `sudoku-grid.css` and `grid.js`
2. New game features should be initialized in `main.js`
3. Add any new global state variables to `globals.js`

## Common Operations
- Creating a new game: Call `newGame()` function
- Board validation: Use `checkBoard()` function
- Solving the puzzle: Call `solveBoard()` function

## Integration Points
- The project is designed to be embedded in any web page
- Board state can be controlled via URL parameters
- Custom themes can be applied by overriding CSS variables in `base.css`