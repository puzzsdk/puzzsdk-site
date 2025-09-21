// Generate 9x9 Sudoku grid
function generateGrid() {
    const grid = document.getElementById('sudoku-grid');
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        let rowCells = [];
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            td.addEventListener('click', () => selectCell(td, row, col));
            tr.appendChild(td);
            rowCells.push(td);
        }
        grid.appendChild(tr);
        gridCells.push(rowCells);
    }
}

// Highlight a cell
function selectCell(cell, row, col) {
    if (selectedCell && selectedCell !== cell) {
        selectedCell.style.backgroundColor = '';
    }
    selectedCell = cell;
    selectedRow = row;
    selectedCol = col;
    cell.style.backgroundColor = 'lightblue';
}

function getBoardFromURL() {
    const params = new URLSearchParams(window.location.search);
    const boardStr = params.get("puzzle");  // still keep `puzzle=` in URL
    if (!boardStr || boardStr.length !== 81) return null; // invalid or missing

    return boardStr.split("");  // array of 81 characters
}

function prefillGrid(board) {
    if (!board) return;

    for (let i = 0; i < 81; i++) {
        const cell = gridCells[i];  // gridCells is your array of <td> elements
        const val = board[i];
        if (val !== "0" && val !== ".") {
            cell.textContent = val;
            cell.classList.add("prefilled");  // style as uneditable
        }
    }
}
