function handleKey(event) {
    if (!selectedCell) return;

    const key = event.key;
    if (key >= '1' && key <= '9') {
        const num = parseInt(key);
        // Delegate to the shared selectNumber handler so keyboard and buttons behave identically
        selectNumber(num);
        return;
    }
    if (key === 'Backspace' || key === 'Delete') {
        // Use the centralized clear logic so it clears value first, then notes
        clearCell();
        return;
    }

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

document.addEventListener('keydown', handleKey);
