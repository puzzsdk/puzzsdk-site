let selectedNumber = null;
let selectedCell = null;

function generateGrid() {
    const grid = document.getElementById('sudoku-grid');
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            td.addEventListener('click', () => selectCell(td));
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
}

function selectNumber(number) {
    selectedNumber = number;
}

function selectCell(cell) {
    selectedCell = cell;
    if (selectedNumber) {
        cell.textContent = selectedNumber;
    }
}

function clearCell() {
    if (selectedCell) {
        selectedCell.textContent = '';
    }
}

function checkSolution() {
    alert("Solution check coming soon!");
}

window.onload = generateGrid;
