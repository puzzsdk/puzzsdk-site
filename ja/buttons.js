// Number button click
function selectNumber(number) {
    selectedNumber = number;
    if (selectedCell) {
        selectedCell.textContent = number;
    }
}

// Clear button
function clearCell() {
    if (selectedCell) {
        selectedCell.textContent = '';
        selectedNumber = null;
    }
}
