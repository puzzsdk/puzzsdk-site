let selectedNumber = null;
let selectedCell = null;
let selectedRow = null;
let selectedCol = null;

let gridCells = []; // 2D array: gridCells[row][col] = <td>

function generateGrid() {
    const grid = document.getElementById('sudoku-grid');
    for (let row = 0; row < 9; row++) {
    const tr = document.createElement('tr');
    let rowCells = [];
    for (let col = 0; col < 9; col++) {
        const td = document.createElement('td');
        td.addEventListener('click', () => selectCell(td));
        tr.appendChild(td);
        rowCells.push(td);  // store in array
    }
    grid.appendChild(tr);
    gridCells.push(rowCells);
}

function selectNumber(number) {
    // Only act if a cell is selected
    if (!selectedCell) return;
    
    selectedNumber = number;
    selectedCell.textContent=selectedNumber;
}

function selectCell(cell, row, col) {
    selectedCell = cell;
    selectedRow = row;
    selectedCol = col;
  
    if (selectedCell && selectedCell !== cell) {
        selectedCell.style.backgroundColor = ''; // reset old cell
    }
    selectedCell = cell;
    cell.style.backgroundColor = 'lightblue'; // or any color you like
}

function clearCell() {
    if (selectedCell) {
        selectedCell.textContent = '';
    }
}

function handleKey(event) {
    // Only act if a cell is selected
    if (!selectedCell) return;

    const key = event.key; // get the pressed key

    // If key is 1-9, put it in the selected cell
    if (key >= '1' && key <= '9') {
        selectedCell.textContent = key;
        selectedNumber = parseInt(key); // optional, keep selectedNumber in sync
    }

    // Optional: clear cell with Backspace or Delete
    if (key === 'Backspace' || key === 'Delete') {
        selectedCell.textContent = '';
        selectedNumber = null;
    }
}

function checkSolution() {
    alert("Solution check coming soon!");
}

window.onload = generateGrid;
document.addEventListener('keydown', handleKey);

