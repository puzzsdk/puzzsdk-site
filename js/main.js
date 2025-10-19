window.onload = function () {
    generateGrid();
    generateButtons();
    const board = getBoardFromURL();
    if (board) {
        prefillGrid(board);
    } else {
        // Generate a new puzzle if no board parameter is provided
        newGame();
    }
};

// Generate a new Sudoku puzzle
function newGame() {
    // Clear the current grid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = gridCells[row][col];
            if (cell) {
                const valueSpan = cell.querySelector('.value');
                if (valueSpan) valueSpan.textContent = '';
                cell.classList.remove('prefilled', 'selected');
                cell.style.pointerEvents = '';
                setGridValue(row, col, null);
                // Clear all notes
                cellCornerNotes[row][col].clear();
                cellCenterNotes[row][col].clear();
            }
        }
    }
    renderAllNotes();
    
    // Generate a new valid Sudoku puzzle
    const puzzle = generateSudokuPuzzle();
    
    // Fill the grid with the puzzle
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const val = puzzle[i];
        if (val !== '0' && val !== '.') {
            const cell = gridCells[row][col];
            const valueSpan = cell.querySelector('.value');
            if (valueSpan) valueSpan.textContent = val;
            setGridValue(row, col, val);
            cell.classList.add('prefilled');
            cell.style.pointerEvents = 'none';
        }
    }
}

// Check the current board state
function checkBoard() {
    let hasErrors = false;
    const errors = [];
    
    // Check each row, column, and 3x3 box for duplicates
    for (let i = 0; i < 9; i++) {
        // Check row
        const rowVals = [];
        for (let col = 0; col < 9; col++) {
            const val = getGridValue(i, col);
            if (val) {
                if (rowVals.includes(val)) {
                    hasErrors = true;
                    errors.push(`Duplicate ${val} in row ${i + 1}`);
                }
                rowVals.push(val);
            }
        }
        
        // Check column
        const colVals = [];
        for (let row = 0; row < 9; row++) {
            const val = getGridValue(row, i);
            if (val) {
                if (colVals.includes(val)) {
                    hasErrors = true;
                    errors.push(`Duplicate ${val} in column ${i + 1}`);
                }
                colVals.push(val);
            }
        }
    }
    
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const boxVals = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const row = boxRow * 3 + r;
                    const col = boxCol * 3 + c;
                    const val = getGridValue(row, col);
                    if (val) {
                        if (boxVals.includes(val)) {
                            hasErrors = true;
                            errors.push(`Duplicate ${val} in box ${boxRow * 3 + boxCol + 1}`);
                        }
                        boxVals.push(val);
                    }
                }
            }
        }
    }
    
    // Check if board is complete
    let isComplete = true;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!getGridValue(row, col)) {
                isComplete = false;
                break;
            }
        }
        if (!isComplete) break;
    }
    
    if (hasErrors) {
        alert('❌ Errors found in the board!\n\n' + [...new Set(errors)].slice(0, 5).join('\n'));
    } else if (isComplete) {
        alert('🎉 Congratulations! Puzzle solved correctly!');
    } else {
        alert('✓ No errors so far! Keep going...');
    }
}

// Solve the current board
function solveBoard() {
    if (!confirm('This will solve the puzzle. Continue?')) {
        return;
    }
    
    // Create a copy of the current grid
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const val = getGridValue(row, col);
            board[row][col] = val ? parseInt(val) : 0;
        }
    }
    
    // Solve the puzzle
    if (solveSudoku(board)) {
        // Fill in the solution
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = gridCells[row][col];
                if (!cell.classList.contains('prefilled')) {
                    const valueSpan = cell.querySelector('.value');
                    if (valueSpan) {
                        valueSpan.textContent = board[row][col];
                        setGridValue(row, col, board[row][col].toString());
                    }
                }
            }
        }
        alert('✓ Puzzle solved!');
    } else {
        alert('❌ This puzzle cannot be solved!');
    }
}

// Handle lock mode changes
function handleLockModeChange() {
    // When locked, prevent editing of cells
    // When unlocked, allow editing
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = gridCells[row][col];
            if (!cell.classList.contains('prefilled')) {
                // Non-prefilled cells can be edited based on lock mode
                // In lock mode, we don't change the pointer-events
                // The lock mode is more conceptual for this game
                // You could extend this to prevent editing programmatically
            }
        }
    }
}

// ============================================
// Sudoku Solving and Generation Algorithms
// ============================================

// Check if placing num at board[row][col] is valid
function isValidPlacement(board, row, col, num) {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (board[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }
    
    return true;
}

// Solve sudoku using backtracking
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Generate a complete valid Sudoku board
function generateCompleteBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes first (they don't affect each other)
    for (let box = 0; box < 9; box += 3) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // Shuffle the numbers
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        
        let idx = 0;
        for (let r = box; r < box + 3; r++) {
            for (let c = box; c < box + 3; c++) {
                board[r][c] = nums[idx++];
            }
        }
    }
    
    // Solve the rest using backtracking with randomization
    solveSudokuRandom(board);
    return board;
}

// Solve sudoku with randomized number selection
function solveSudokuRandom(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                // Shuffle to get random solution
                for (let i = nums.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [nums[i], nums[j]] = [nums[j], nums[i]];
                }
                
                for (let num of nums) {
                    if (isValidPlacement(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudokuRandom(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Generate a Sudoku puzzle by removing numbers from a complete board
function generateSudokuPuzzle(difficulty = 'medium') {
    const board = generateCompleteBoard();
    
    // Determine how many cells to remove based on difficulty
    const cellsToRemove = {
        'easy': 35,
        'medium': 45,
        'hard': 55
    }[difficulty] || 45;
    
    // Create a list of all cell positions
    const positions = [];
    for (let i = 0; i < 81; i++) {
        positions.push(i);
    }
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Remove numbers from cells
    let removed = 0;
    for (let pos of positions) {
        if (removed >= cellsToRemove) break;
        
        const row = Math.floor(pos / 9);
        const col = pos % 9;
        const backup = board[row][col];
        board[row][col] = 0;
        
        // Check if puzzle still has unique solution (simplified check)
        // For performance, we skip the uniqueness check
        removed++;
    }
    
    // Convert to string format
    const puzzle = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            puzzle.push(board[row][col] === 0 ? '0' : board[row][col].toString());
        }
    }
    
    return puzzle;
}

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
