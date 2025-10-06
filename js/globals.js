// Declare all global variables here
let gridCells = [];         // 2D array of <td>
let selectedCell = null;    // currently highlighted cell
let selectedRow = null;
let selectedCol = null;
let selectedNumber = null;  // number selected via button or keyboard

// When true, number inputs toggle corner notes instead of writing the main value
let cornerNoteMode = false;

// Full pencilmark notes (3x3 style) data structure: 9x9 array of Sets
let cellFullNotes = Array.from({ length: 9 }, () =>
	Array.from({ length: 9 }, () => new Set())
);

// Helper functions for full notes
function toggleFullNote(row, col, num) {
	if (row == null || col == null) return;
	const s = cellFullNotes[row][col];
	if (s.has(num)) {
		s.delete(num);
		return false;
	} else {
		s.add(num);
		return true;
	}
}

function addFullNote(row, col, num) {
	if (row == null || col == null) return;
	cellFullNotes[row][col].add(num);
}

function removeFullNote(row, col, num) {
	if (row == null || col == null) return;
	cellFullNotes[row][col].delete(num);
}

function getFullNotes(row, col) {
	if (row == null || col == null) return new Set();
	return new Set(cellFullNotes[row][col]);
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
