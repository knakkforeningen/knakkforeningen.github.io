document.addEventListener('DOMContentLoaded', function() {

// lager tabell
const tbody = document.getElementById('scoreTableBody');
const numPlayers = 4;
const numRounds = 5;

for (let round = 1; round <= numRounds; round++) {
    const row = document.createElement('tr');
    // runder
    const roundCell = document.createElement('td');
    roundCell.textContent = round;
    roundCell.className = "font-bold bg-base-300 w-16";
    row.appendChild(roundCell);
    // spillere
    for (let player = 1; player <= numPlayers; player++) {
        const cell = document.createElement('td');
        cell.contentEditable = "true";
        cell.inputMode = "numeric";
        cell.pattern = "[0-9]*";
        cell.className = `row${round}`;
        row.appendChild(cell);
    }
    tbody.appendChild(row);
}

const sumRow = document.createElement('tr');
const sumLabel = document.createElement('td');
sumLabel.textContent = 'Sum';
sumRow.appendChild(sumLabel);

for (let player = 1; player <= numPlayers; player++) {
    const sumCell = document.createElement('td');
    sumCell.contentEditable = "true";
    sumCell.className = "sum bg-base-200";
    sumRow.appendChild(sumCell);
}
tbody.appendChild(sumRow);
 
//validering : regn ut relsultat
tbody.addEventListener('input', function(e) {
    const sums = new Array(numPlayers).fill(0);
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    rows.forEach(row => {
        const cells = row.querySelectorAll('[contenteditable]');
        cells.forEach((cell, index) => {
            sums[index] += parseInt(cell.textContent) || 0;
        });
    });
    
    // Update sum cells (no colors)
    const sumCells = tbody.querySelectorAll('.sum');
    sumCells.forEach((cell, index) => {
        cell.textContent = sums[index];
    });
});

//legge til eller fjene spillere
let currentPlayers = numPlayers;
const maxPlayers = 6;
const minPlayers = 2;

document.getElementById('addPlayerBtn').addEventListener('click', function() {
    if (currentPlayers >= maxPlayers) {
        alert('Maks 6 spelarar!');
        return;
    }
    
    currentPlayers++;
    
    // header
    const headerRow = document.querySelector('#scoreTable thead tr');
    const newHeader = document.createElement('th');
    newHeader.contentEditable = "true";
    newHeader.textContent = `Spelar ${currentPlayers}`;
    headerRow.appendChild(newHeader);
    
    //
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    rows.forEach(row => {
        const cell = document.createElement('td');
        cell.contentEditable = "true";
        cell.inputMode = "numeric";
        cell.pattern = "[0-9]*";
        row.appendChild(cell);
    });
    
    //summere 
    const sumRow = tbody.querySelector('tr:last-child');
    const sumCell = document.createElement('td');
    sumCell.contentEditable = "true";
    sumCell.className = "sum bg-base-200";
    sumCell.textContent = "0";
    sumRow.appendChild(sumCell);
    
    document.getElementById('playerCount').textContent = `Spelarar: ${currentPlayers}`;
});

document.getElementById('removePlayerBtn').addEventListener('click', function() {
    if (currentPlayers <= minPlayers) {
        alert('Treng minst 2 spelarar!');
        return;
    }
    
    // Remove header
    const headerRow = document.querySelector('#scoreTable thead tr');
    headerRow.removeChild(headerRow.lastElementChild);
    
    const allRows = tbody.querySelectorAll('tr');
    allRows.forEach(row => {
        row.removeChild(row.lastElementChild);
    });
    
    currentPlayers--;
    document.getElementById('playerCount').textContent = `Spelarar: ${currentPlayers}`;
    });
});



//render regler på hovedside markdown 
fetch('regler/regler.md')
  .then(response => response.text())
  .then(text => {
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true
    });
    document.getElementById('rules-content').innerHTML = marked.parse(text);
  });

// logo roterer med scroll
let rotation = 0;
let scrollLoc = window.pageYOffset;
const maxRotation = 20;

window.addEventListener("scroll", function() {
  let newPos = window.pageYOffset;
  let diff = newPos - scrollLoc;
  rotation += diff * 0.2;
  rotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));
  scrollLoc = newPos;

  document.getElementById("logo").style.transform = `rotate(${rotation}deg)`;
});

// reset logo rotasjon
window.addEventListener("load", function() {
  rotation = 0;
  document.getElementById("logo").style.transform = `rotate(0deg)`;
});