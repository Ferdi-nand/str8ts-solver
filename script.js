const solveButton = document.getElementById('solve');
const cells = document.querySelectorAll('td');
const checkbox = document.querySelector('input[type="checkbox"]');


function exportTable() {
    const entries = [];
    for (const cell of cells) {
        const value = cell.textContent === '' ? 0 : parseInt(cell.textContent, 10);
        const clue = cell.classList.contains('black-on-white');
        entries.push({ value, clue });
    }

    const result = [];
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (!result[row]) {
            result[row] = [];
        }
        result[row][col] = entries[i];
    }

    return result;
}


cells.forEach(cell => {
    cell.addEventListener('input', () => {
        const nextCell = cell.nextElementSibling;
        if (/^[1-9]$/.test(cell.textContent)) {
            if (nextCell !== null) {
                nextCell.focus();
            }
        } else if (cell.textContent !== '') {
            cell.textContent = '';
        }
    });
});

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (checkbox.checked) {
            cell.classList.toggle('black-on-white');
        }
    });
});

solveButton.addEventListener('click', () => {
    init(exportTable());
    console.log('init completed');
    if (solveStr8ts()) {
        // import data
        let i = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (!board[row][col].clue)
                    cells[i].textContent = board[row][col].value;
                i++;
            }
        }
    } else {
        alert("No solution found!");
    }
});