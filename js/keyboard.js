// Handle keyboard input
function handleKey(event) {
    if (!selectedCell) return;

    const key = event.key;

    // Number input
    if (key >= '1' && key <= '9') {
        selectedCell.textContent = key;
        selectedNumber = parseInt(key);
        return;
    }

    // Clear
    if (key === 'Backspace' || key === 'Delete') {
        selectedCell.textContent = '';
        selectedNumber = null;
        return;
    }

    // Arrow navigation
    let newRow = selectedRow;
    let newCol = selectedCol;

    switch(key) {
        case 'ArrowUp':    newRow = Math.max(0, selectedRow - 1); break;
        case 'ArrowDown':  newRow = Math.min(8, selectedRow + 1); break;
        case 'ArrowLeft':  newCol = Math.max(0, selectedCol - 1); break;
        case 'ArrowRight': newCol = Math.min(8, selectedCol + 1); break;
        default: return;
    }

    selectCell(gridCells[newRow][newCol], newRow, newCol);
}

// Attach listener
document.addEventListener('keydown', handleKey);
