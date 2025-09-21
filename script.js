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
    selectedCell.textContent=selectedNumber;
}

function selectCell(cell) {
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

function checkSolution() {
    alert("Solution check coming soon!");
}

window.onload = generateGrid;
