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

function checkSolution() {
    alert("Solution check coming soon!");
}

function generateButtons() {
    const numberContainer = document.getElementById("number-buttons");
    const actionContainer = document.getElementById("action-buttons");

    // Number buttons 1–9
    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement("button");
        btn.className = "number-btn";
        btn.textContent = i;
        btn.onclick = () => selectNumber(i);
        numberContainer.appendChild(btn);
    }

    // Action buttons
    const clearBtn = document.createElement("button");
    clearBtn.className = "action-btn";
    clearBtn.textContent = "Clear";
    clearBtn.onclick = clearCell;
    actionContainer.appendChild(clearBtn);

    const checkBtn = document.createElement("button");
    checkBtn.className = "action-btn"; 
    checkBtn.textContent = "Check";
    checkBtn.onclick = checkSolution;
    actionContainer.appendChild(checkBtn);
}
    
