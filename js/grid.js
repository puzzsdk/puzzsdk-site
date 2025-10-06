function generateGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = ''; // clear any existing cells
    gridCells = [];

    for (let row = 0; row < 9; row++) {
        let rowCells = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Thick box borders
            if (col % 3 === 0) cell.classList.add('thick-left');
            if (col === 8) cell.classList.add('thick-right');
            if (row % 3 === 0) cell.classList.add('thick-top');
            if (row === 8) cell.classList.add('thick-bottom');

            // Data attributes
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Event listener
            cell.addEventListener('click', () => selectCell(cell, row, col));

            // Value span for the main number (so we don't overwrite child nodes)
            const valueSpan = document.createElement('span');
            valueSpan.className = 'value';
            cell.appendChild(valueSpan);

            // Corner notes container (small top-right overlay)
            const cornerNotesEl = document.createElement('div');
            cornerNotesEl.className = 'corner-notes';
            cell.appendChild(cornerNotesEl);

            // Full 3x3 pencilmarks container
            const fullNotes = document.createElement('div');
            fullNotes.className = 'full-notes';
            // create 9 slots for digits 1..9
            for (let n = 1; n <= 9; n++) {
                const span = document.createElement('span');
                span.className = 'full-note';
                span.dataset.num = n;
                span.textContent = n;
                fullNotes.appendChild(span);
            }
            cell.appendChild(fullNotes);

            // Append to grid
            grid.appendChild(cell);
            rowCells.push(cell);
        }
        gridCells.push(rowCells);
    }

        // After creating the grid DOM, render any existing notes
        renderAllNotes();
}

function selectCell(cell, row, col) {
    if (selectedCell && selectedCell !== cell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = cell;
    selectedRow = row;
    selectedCol = col;
    cell.classList.add('selected');
}

function getBoardFromURL() {
    const params = new URLSearchParams(window.location.search);
    const boardStr = params.get("board");
    if (!boardStr || boardStr.length !== 81) return null;
    return boardStr.split("");
}

function prefillGrid(board) {
    if (!board) return;
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const cell = gridCells[row][col];
        const val = board[i];
        if (val !== "0" && val !== ".") {
            const valueSpan = cell.querySelector('.value');
            if (valueSpan) valueSpan.textContent = val;
            cell.classList.add("prefilled");
            cell.style.pointerEvents = "none";
        }
    }
}

// Render corner notes for a single cell (row, col)
function renderCornerNotes(row, col) {
    const cell = gridCells[row][col];
    const notesEl = cell.querySelector('.corner-notes');
    if (!notesEl) return;
    const notes = [...getCornerNotes(row, col)].sort((a, b) => a - b);
    notesEl.textContent = notes.join('');
}

function renderAllCornerNotes() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            renderCornerNotes(r, c);
        }
    }
}

// Render full 3x3 pencilmarks for a single cell
function renderFullNotes(row, col) {
    const cell = gridCells[row][col];
    const fullEl = cell.querySelector('.full-notes');
    if (!fullEl) return;
    const notes = new Set(getFullNotes(row, col));
    const spans = fullEl.querySelectorAll('.full-note');
    spans.forEach(span => {
        const n = parseInt(span.dataset.num, 10);
        span.style.visibility = notes.has(n) ? 'visible' : 'hidden';
    });
}

function renderAllNotes() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            renderCornerNotes(r, c);
            renderFullNotes(r, c);
        }
    }
}
