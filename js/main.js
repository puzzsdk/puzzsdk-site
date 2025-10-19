window.onload = function () {
    generateGrid();
    generateButtons();
    const board = getBoardFromURL();
    if (board) {
        prefillGrid(board);
        // Default to play mode when a board is provided via URL
        lockMode = true;
        if (typeof handleLockModeChange === 'function') handleLockModeChange();
    } else {
        // If no board provided, start a new random game
        if (typeof newGame === 'function') newGame();
    }
};

// Mobile nav toggle: safe DOM queries and click-outside to close
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('active')) return;
        const target = e.target;
        if (!navLinks.contains(target) && !hamburger.contains(target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });
});

// =============================
// Sudoku: Puzzles, Solver, Utils
// =============================

// A small set of built-in puzzles ("0" means empty)
const BUILT_IN_PUZZLES = [
    // Classic easy
    "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    // Moderate
    "003020600900305001001806400008102900700000008006708200002609500800203009005010300",
    // Moderate 2
    "200080300060070084030500209000105408000000000402706000301007040720040060004010003",
    // Hard-ish
    "000000907000420180000705026100904000050000040000507009920108000034059000507000000",
    // Another
    "030050040008010000460000012070502080000603000040109030250000098000020600010030020",
];

function pickRandomPuzzle() {
    const idx = Math.floor(Math.random() * BUILT_IN_PUZZLES.length);
    return BUILT_IN_PUZZLES[idx];
}

function resetGameState() {
    // Reset model values
    gridValues = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));
    // Reset notes
    cellCenterNotes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    cellCornerNotes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    // Clear selection
    selectedCell = null;
    selectedRow = null;
    selectedCol = null;
    selectedNumber = null;
}

function serializeGridValues() {
    // Return an 81-length string with digits and 0 for empty
    let out = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const v = getGridValue(r, c);
            out += v ? String(v) : '0';
        }
    }
    return out;
}

function boardFromValues() {
    // 9x9 numbers (0 for empty)
    return gridValues.map(row => row.map(v => (v ? parseInt(v, 10) : 0)));
}

function setBoardValuesFromBoard(board) {
    // board is 9x9 numbers
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const n = board[r][c];
            const cell = gridCells[r][c];
            const valueSpan = cell.querySelector('.value');
            const isGiven = cell.classList.contains('prefilled');
            if (!isGiven) {
                const text = n ? String(n) : '';
                if (valueSpan) valueSpan.textContent = text;
                setGridValue(r, c, n ? String(n) : null);
                // Clear notes when writing a value
                const center = getCenterNotes(r, c);
                if (center.size) center.forEach(x => removeCenterNote(r, c, x));
                const corner = getCornerNotes(r, c);
                if (corner.size) corner.forEach(x => removeCornerNote(r, c, x));
                renderCornerNotes(r, c);
                renderCenterNotes(r, c);
            }
        }
    }
}

function updateURLWithBoardString(boardStr) {
    const url = new URL(window.location.href);
    url.searchParams.set('board', boardStr);
    history.replaceState({}, '', url.toString());
}

// Backtracking solver
function isSafe(board, row, col, num) {
    // Row
    for (let c = 0; c < 9; c++) if (board[row][c] === num) return false;
    // Col
    for (let r = 0; r < 9; r++) if (board[r][col] === num) return false;
    // Box
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }
    return true;
}

function findEmpty(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) return [r, c];
        }
    }
    return null;
}

function solveSudoku(board) {
    const pos = findEmpty(board);
    if (!pos) return true; // solved
    const [r, c] = pos;
    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
        }
    }
    return false;
}

function getConflicts() {
    // Returns a Set of keys "r,c" for conflicting cells
    const conflicts = new Set();
    const nums = (arr) => arr.filter(x => x !== 0);
    const board = boardFromValues();

    // Rows
    for (let r = 0; r < 9; r++) {
        const seen = new Map();
        for (let c = 0; c < 9; c++) {
            const v = board[r][c];
            if (!v) continue;
            const key = v;
            if (seen.has(key)) {
                conflicts.add(r + ',' + c);
                for (const sc of seen.get(key)) conflicts.add(r + ',' + sc);
                seen.get(key).push(c);
            } else {
                seen.set(key, [c]);
            }
        }
    }
    // Cols
    for (let c = 0; c < 9; c++) {
        const seen = new Map();
        for (let r = 0; r < 9; r++) {
            const v = board[r][c];
            if (!v) continue;
            const key = v;
            if (seen.has(key)) {
                conflicts.add(r + ',' + c);
                for (const sr of seen.get(key)) conflicts.add(sr + ',' + c);
                seen.get(key).push(r);
            } else {
                seen.set(key, [r]);
            }
        }
    }
    // Boxes
    for (let br = 0; br < 9; br += 3) {
        for (let bc = 0; bc < 9; bc += 3) {
            const seen = new Map();
            for (let r = br; r < br + 3; r++) {
                for (let c = bc; c < bc + 3; c++) {
                    const v = board[r][c];
                    if (!v) continue;
                    const key = v;
                    const cellKey = r + ',' + c;
                    if (seen.has(key)) {
                        conflicts.add(cellKey);
                        for (const [rr, cc] of seen.get(key)) conflicts.add(rr + ',' + cc);
                        seen.get(key).push([r, c]);
                    } else {
                        seen.set(key, [[r, c]]);
                    }
                }
            }
        }
    }
    return conflicts;
}

function clearConflictHighlights() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            gridCells[r][c].classList.remove('conflict');
        }
    }
}

function applyConflictHighlights(conflicts) {
    conflicts.forEach(key => {
        const [rStr, cStr] = key.split(',');
        const r = parseInt(rStr, 10);
        const c = parseInt(cStr, 10);
        gridCells[r][c].classList.add('conflict');
    });
}

// UI actions
function newGame() {
    const boardStr = pickRandomPuzzle();
    // Reset state and grid
    resetGameState();
    generateGrid();
    prefillGrid(boardStr.split(''));
    lockMode = true; // start in play mode
    if (typeof handleLockModeChange === 'function') handleLockModeChange();
    updateURLWithBoardString(boardStr);
}

function checkBoard() {
    clearConflictHighlights();
    const conflicts = getConflicts();
    applyConflictHighlights(conflicts);
    const board = boardFromValues();
    const hasEmpty = board.some(row => row.some(v => v === 0));
    if (conflicts.size === 0 && !hasEmpty) {
        alert('Great! The board is complete and valid.');
    } else if (conflicts.size === 0) {
        alert('No conflicts found. Keep going!');
    } else {
        alert('Conflicts detected. Highlighted in red.');
    }
}

function solveBoard() {
    // Do not modify given cells; solve into the rest
    const board = boardFromValues();
    const solved = solveSudoku(board);
    if (!solved) {
        alert('No solution found for the current board.');
        return;
    }
    setBoardValuesFromBoard(board);
    clearConflictHighlights();
}

// Lock mode: when true, prevent editing prefilled cells
function handleLockModeChange() {
    // Update pointer-events on prefilled cells
    const cells = document.querySelectorAll('#sudoku-grid .cell.prefilled');
    cells.forEach(cell => {
        cell.style.pointerEvents = lockMode ? 'none' : 'auto';
    });
    // If a prefilled cell is currently selected while locking, clear selection
    if (lockMode && selectedCell && selectedCell.classList.contains('prefilled')) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
        selectedRow = null;
        selectedCol = null;
    }
    // Update lock button label if available
    const btn = document.getElementById('lock-toggle-btn');
    if (btn) btn.textContent = lockMode ? '🔒 Locked' : '🔓 Unlocked';
}

// Expose functions globally for navbar onclick handlers
window.newGame = newGame;
window.checkBoard = checkBoard;
window.solveBoard = solveBoard;
window.handleLockModeChange = handleLockModeChange;
