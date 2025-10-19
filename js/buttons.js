function selectNumber(number) {
    selectedNumber = number;
    if (!selectedCell) return;

    // Decide behavior based on inputMode: 'value' | 'corner' | 'center'
    // NOTE: 'corner' mode toggles the 3x3 corner-style pencilmarks
    if (inputMode === 'corner') {
        toggleCornerNote(selectedRow, selectedCol, number);
        renderCornerNotes(selectedRow, selectedCol);
        return;
    }
    // 'center' mode toggles the small centered inline notes
    if (inputMode === 'center') {
        toggleCenterNote(selectedRow, selectedCol, number);
        renderCenterNotes(selectedRow, selectedCol);
        return;
    }

    const valueSpan = selectedCell.querySelector('.value');
    if (valueSpan) {
        valueSpan.textContent = number;
        // update model
        setGridValue(selectedRow, selectedCol, number);
    } else {
        selectedCell.textContent = number;
        setGridValue(selectedRow, selectedCol, number);
    }
}

function clearCell() {
    if (!selectedCell) return;
    const valueSpan = selectedCell.querySelector('.value');
    const hasValue = valueSpan && valueSpan.textContent.trim() !== '';

    // Helper to clear all center notes
    function clearAllCenterNotes() {
        const centerNotes = getCenterNotes(selectedRow, selectedCol);
        if (centerNotes.size > 0) {
            centerNotes.forEach(n => removeCenterNote(selectedRow, selectedCol, n));
            renderCenterNotes(selectedRow, selectedCol);
            return true;
        }
        return false;
    }

    // Helper to clear all corner notes
    function clearAllCornerNotes() {
        const cornerNotes = getCornerNotes(selectedRow, selectedCol);
        if (cornerNotes.size > 0) {
            cornerNotes.forEach(n => removeCornerNote(selectedRow, selectedCol, n));
            renderCornerNotes(selectedRow, selectedCol);
            return true;
        }
        return false;
    }

    // Step 1: if there is a main value, clear it and stop (first step always clears value)
    if (hasValue) {
        valueSpan.textContent = '';
        selectedNumber = null;
        // update model
        setGridValue(selectedRow, selectedCol, null);
        return;
    }

    // No main value: follow mode-specific sequence
    if (inputMode === 'corner') {
        // 2: corner notes -> 3: center notes
        if (clearAllCornerNotes()) return;
        if (clearAllCenterNotes()) return;
        return;
    }

    if (inputMode === 'center') {
        // 2: center notes -> 3: corner notes
        if (clearAllCenterNotes()) return;
        if (clearAllCornerNotes()) return;
        return;
    }

    // value mode (or unknown): clear all notes after value is gone
    if (inputMode === 'value' || !inputMode) {
        // try clear value already handled; now clear both note types (corner then center)
        let did = false;
        if (clearAllCornerNotes()) did = true;
        if (clearAllCenterNotes()) did = true;
        // nothing to do if did is false
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
    // Always use the centralized clear logic which cycles: value -> reveal notes -> clear notes
    clearBtn.onclick = () => {
        clearCell();
    };
    actionContainer.appendChild(clearBtn);

    const checkBtn = document.createElement("button");
    checkBtn.className = "action-btn";
    checkBtn.textContent = "Check";
    checkBtn.onclick = checkSolution;
    actionContainer.appendChild(checkBtn);

    // Input mode selector (value / corner / center) - visually like mini-cells
    const modeGroup = document.createElement('div');
    modeGroup.id = 'note-mode-group';
    modeGroup.style.display = 'flex';
    modeGroup.style.gap = '8px';

    const modes = [
        { key: 'value', label: '5', cls: 'mode-value' },
            { key: 'corner', label: '3x3', cls: 'mode-corner' }, // Original label retained for context
        { key: 'center', label: '123', cls: 'mode-center' }
    ];

    modes.forEach(m => {
        const b = document.createElement('button');
        b.className = `mode-btn ${m.cls}`;
        b.dataset.mode = m.key;
        b.setAttribute('aria-pressed', inputMode === m.key);
        b.title = `Input mode: ${m.key}`;
            // For corner (3x3) mode render a miniature 3x3 grid so it looks like a cell
            if (m.key === 'corner') {
                // create 3x3 small cells showing numbers 1..9
                let mini = '<div class="mini-grid">';
                for (let n = 1; n <= 9; n++) {
                    mini += `<div class="mini-cell">${n}</div>`;
                }
                mini += '</div>';
                b.innerHTML = mini;
            } else {
                b.innerHTML = `<span class="mode-label">${m.label}</span>`;
            }
        b.onclick = () => setInputMode(m.key);
        modeGroup.appendChild(b);
    });

    actionContainer.appendChild(modeGroup);
    // ensure initial mode button reflects current inputMode
    setInputMode(inputMode);

    const lockBtn = document.createElement("button");
    lockBtn.className = "action-btn";
    lockBtn.textContent = lockMode ? "🔒 Locked" : "🔓 Unlocked";
    lockBtn.onclick = () => {
        lockMode = !lockMode;
        lockBtn.textContent = lockMode ? "🔒 Locked" : "🔓 Unlocked";
        handleLockModeChange();
    };
    actionContainer.appendChild(lockBtn);
}

function setInputMode(mode) {
    inputMode = mode;
    // update aria-pressed and active class
    const buttons = document.querySelectorAll('#note-mode-group .mode-btn');
    buttons.forEach(btn => {
        const isActive = btn.dataset.mode === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });
}
