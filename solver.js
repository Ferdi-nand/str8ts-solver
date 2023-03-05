/**
 * Helper functions to initialize the board
 */

// The board is stored here
let board = [];
// Global variables to store rows and columns
let rows = [];
let columns = [];
let compartments = [];

function init(startboard) {

    board = startboard;

    console.log('board ' + board);
    getCompartments();
    getRows();
    getColumns();
}

function getCompartments() {
    compartments = [];

    // Get compartments for rows
    for (let row = 0; row < 9; row++) {
        let compartment = [];
        for (let col = 0; col < 9; col++) {
            if (board[row][col].clue) {
                if (compartment.length > 0) {
                    compartments.push([...compartment]);
                    compartment = []; // Clear compartment
                }
            } else {
                compartment.push(board[row][col]);
            }
        }
        if (compartment.length > 0) {
            compartments.push([...compartment]);
        }
    }

    // Get compartments for columns
    for (let col = 0; col < 9; col++) {
        let compartment = [];
        for (let row = 0; row < 9; row++) {
            if (board[row][col].clue) {
                if (compartment.length > 0) {
                    compartments.push([...compartment]);
                    compartment = []; // Clear compartment
                }
            } else {
                compartment.push(board[row][col]);
            }
        }
        if (compartment.length > 0) {
            compartments.push([...compartment]);
        }
    }
}

function getRows() {
    rows = [];
    for (let row = 0; row < 9; row++) {
        let rowValues = [];
        for (let col = 0; col < 9; col++) {
            rowValues.push(board[row][col]);
        }
        rows.push(rowValues);
    }
}

function getColumns() {
    columns = [];
    for (let col = 0; col < 9; col++) {
        let colValues = [];
        for (let row = 0; row < 9; row++) {
            colValues.push(board[row][col]);
        }
        columns.push(colValues);
    }
}

/**
 * Helper functions to check wether a board state is valid
 */
function isValidBoard() {
    return checkCompartments() && checkRows() && checkColumns();
}


function checkRows() {
    for (let row = 0; row < 9; row++) {
        let values = new Set();
        for (let col = 0; col < 9; col++) {
            let value = board[row][col].value;
            if (value !== 0 && values.has(value)) {
                return false;
            }
            values.add(value);
        }
    }
    return true;
}

function checkColumns() {
    for (let col = 0; col < 9; col++) {
        let values = new Set();
        for (let row = 0; row < 9; row++) {
            let value = board[row][col].value;
            if (value !== 0 && values.has(value)) {
                return false;
            }
            values.add(value);
        }
    }
    return true;
}

function checkCompartments() {
    for (let compartment of compartments) {
        const values = compartment.map(cell => cell.value);
        var zeros = values.filter(val => val === 0).length;

        const sortedValues = values.filter(val => val !== 0).sort((a, b) => a - b);

        let prevValue = sortedValues[0];
        for (let i = 1; i < sortedValues.length; i++) {
            const curValue = sortedValues[i];
            const diff = curValue - prevValue;
            if (diff > 1) {
                zeros -= diff - 1;
                if (zeros < 0) {
                    return false;
                }
            }
            prevValue = curValue;
        }
    }
    return true;
}



/**
 * Solver functions 
 */
function solveStr8ts() {
    // Find the next empty cell to fill
    const [row, col] = findEmptyCell();

    // If there are no empty cells left, the board is solved
    if (row === -1 && col === -1) {
        return true;
    }

    // Try all possible numbers in the empty cell
    for (let num = 1; num <= board.length; num++) {
        if (isValidMove(row, col, num)) {
            board[row][col].value = num;

            // Recursively fill the rest of the board
            if (solveStr8ts()) {
                return true;
            }

            console.log("Number " + num + " did not work at " + row + ", " + col);
            // Backtrack if the board cannot be solved with the current number
            board[row][col].value = 0;
        }
    }

    // If no number works, backtrack to the previous cell
    return false;
}

/**
 * Finds the next empty cell in the board.
 * @returns {Array} The row and column indices of the next empty cell. If there are no empty cells left, returns [-1, -1].
 */
function findEmptyCell() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].value === 0 && !board[i][j].clue) {
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

/**
 * Checks if placing a number in a cell at a given row and column is a valid move in the current board state.
 * @param {number} row - The row of the cell to check.
 * @param {number} col - The column of the cell to check.
 * @param {number} num - The number to place in the cell.
 * @returns {boolean} - True if placing the number in the cell is valid, false otherwise.
 */
function isValidMove(row, col, num) {
    let old = board[row][col].value;
    board[row][col].value = num;
    if (isValidBoard()) {
        board[row][col].value = old;
        console.log("Try number " + num + " at " + row + ", " + col);
        return true;
    }
    board[row][col].value = old;
    return false;
}