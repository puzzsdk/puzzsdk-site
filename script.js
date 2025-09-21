// Generate 9x9 grid
const grid = document.getElementById("sudoku-grid");

for (let row = 0; row < 9; row++) {
  for (let col = 0; col < 9; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener("click", () => selectCell(cell));
    grid.appendChild(cell);
  }
}

// Track currently selected cell
let selectedCell = null;

function selectCell(cell) {
  if (selectedCell) selectedCell.style.backgroundColor = "white";
  selectedCell = cell;
  selectedCell.style.backgroundColor = "#ffeaa7"; // highlight
}

// Handle number buttons
const buttons = document.querySelectorAll(".btn");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!selectedCell) return;
    const num = btn.dataset.number;
    selectedCell.textContent = num === "clear" ? "" : num;
  });
});
