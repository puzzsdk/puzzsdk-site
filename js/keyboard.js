function handleKey(event) {
    // don't intercept when typing into form fields
    const tag = (event.target && event.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || event.ctrlKey || event.metaKey || event.altKey) return;

    // allow mode toggle even if no cell selected
    const key = event.key;

    // Toggle input mode cycle when pressing Spacebar
    if (event.code === 'Space') {
        const modes = ['value', 'corner', 'center'];
        const idx = modes.indexOf(typeof inputMode !== 'undefined' ? inputMode : 'value');
        const next = modes[(idx + 1) % modes.length];
        if (typeof setInputMode === 'function') setInputMode(next);
        event.preventDefault();
        return;
    }
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
