// Declare all global variables here
let gridCells = [];         // 2D array of <td>
let selectedCell = null;    // currently highlighted cell
let selectedRow = null;
let selectedCol = null;
let selectedNumber = null;  // number selected via button or keyboard

// When true, number inputs toggle corner notes instead of writing the main value
let cornerNoteMode = false;

// Input mode: 'value' | 'corner' | 'center' - default to value
let inputMode = 'value';

// Center (3x3) pencilmark notes data structure: 9x9 array of Sets
let cellCenterNotes = Array.from({ length: 9 }, () =>
	Array.from({ length: 9 }, () => new Set())
);

// Helper functions for center notes
function toggleCenterNote(row, col, num) {
	if (row == null || col == null) return;
	const s = cellCenterNotes[row][col];
	if (s.has(num)) {
		s.delete(num);
		return false;
	} else {
		s.add(num);
		return true;
	}
}

function addCenterNote(row, col, num) {
	if (row == null || col == null) return;
	cellCenterNotes[row][col].add(num);
}

function removeCenterNote(row, col, num) {
	if (row == null || col == null) return;
	cellCenterNotes[row][col].delete(num);
}

function getCenterNotes(row, col) {
	if (row == null || col == null) return new Set();
	return new Set(cellCenterNotes[row][col]);
}

// Corner notes data structure: 9x9 array where each entry is a Set of numbers (1..9)
// Use Set for O(1) add/remove/check and easy serialization when needed.
let cellCornerNotes = Array.from({ length: 9 }, () =>
	Array.from({ length: 9 }, () => new Set())
);

// Helper functions for corner notes
function toggleCornerNote(row, col, num) {
	if (row == null || col == null) return;
	const s = cellCornerNotes[row][col];
	if (s.has(num)) {
		s.delete(num);
		return false;
	} else {
		s.add(num);
		return true;
	}
}

function addCornerNote(row, col, num) {
	if (row == null || col == null) return;
	cellCornerNotes[row][col].add(num);
}

function removeCornerNote(row, col, num) {
	if (row == null || col == null) return;
	cellCornerNotes[row][col].delete(num);
}

function getCornerNotes(row, col) {
	if (row == null || col == null) return new Set();
	return new Set(cellCornerNotes[row][col]); // return a copy
}
