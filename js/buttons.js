function selectNumber(number) {
    selectedNumber = number;
    if (!selectedCell) return;

    if (cornerNoteMode) {
        // toggle corner note for selected cell
        const added = toggleCornerNote(selectedRow, selectedCol, number);
        renderCornerNotes(selectedRow, selectedCol);
        return;
    }

    const valueSpan = selectedCell.querySelector('.value');
    if (valueSpan) {
        valueSpan.textContent = number;
    } else {
        selectedCell.textContent = number;
    }
}

function clearCell() {
    if (!selectedCell) return;

    const valueSpan = selectedCell.querySelector('.value');
    const hasValue = valueSpan && valueSpan.textContent.trim() !== '';
    const notes = getCornerNotes(selectedRow, selectedCol);

    if (hasValue) {
        // Clear main value first, reveal notes underneath
        valueSpan.textContent = '';
        selectedNumber = null;
        // Do not clear notes here; they remain and will be visible
        return;
    }

    // If there's no main value but there are corner notes, clear them
    if (notes.size > 0) {
        notes.forEach(n => removeCornerNote(selectedRow, selectedCol, n));
        renderCornerNotes(selectedRow, selectedCol);
        return;
    }
}

function checkSolution() {
    alert("Solution check coming soon!");
}

function generateButtons() {
    const numberContainer = document.getElementById("number-buttons");
    const actionContainer = document.getElementById("action-buttons");

    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement("button");
        btn.className = "number-btn";
        btn.textContent = i;
        btn.onclick = () => selectNumber(i);
        numberContainer.appendChild(btn);
    }

    const clearBtn = document.createElement("button");
    clearBtn.className = "action-btn";
    clearBtn.textContent = "Clear";
    clearBtn.onclick = () => {
        if (cornerNoteMode && selectedCell) {
            // clear corner notes for selected cell
            const notes = getCornerNotes(selectedRow, selectedCol);
            notes.forEach(n => removeCornerNote(selectedRow, selectedCol, n));
            renderCornerNotes(selectedRow, selectedCol);
            return;
        }
        clearCell();
    };
    actionContainer.appendChild(clearBtn);

    const checkBtn = document.createElement("button");
    checkBtn.className = "action-btn";
    checkBtn.textContent = "Check";
    checkBtn.onclick = checkSolution;
    actionContainer.appendChild(checkBtn);

    // Corner note mode toggle
    const cornerToggle = document.createElement('button');
    cornerToggle.className = 'action-btn';
    cornerToggle.textContent = 'Corner Notes: Off';
    cornerToggle.onclick = () => {
        cornerNoteMode = !cornerNoteMode;
        cornerToggle.textContent = `Corner Notes: ${cornerNoteMode ? 'On' : 'Off'}`;
    };
    actionContainer.appendChild(cornerToggle);
}
