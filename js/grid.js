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
