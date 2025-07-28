// Score and foul counters
let scoreA = 0;
let scoreB = 0;
let foulsA = 0;
let foulsB = 0;

// Timer
let timer;
let seconds = 0;
let isRunning = false;

// DOM Elements
const teamANameInput = document.getElementById("teamAName");
const teamBNameInput = document.getElementById("teamBName");
const displayTeamA = document.getElementById("displayTeamA");
const displayTeamB = document.getElementById("displayTeamB");
const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const foulsAEl = document.getElementById("foulsA");
const foulsBEl = document.getElementById("foulsB");
const timerDisplay = document.getElementById("timerDisplay");
const scoreboard = document.getElementById("scoreboard");
const matchControls = document.getElementById("matchControls");

// Start match: Show scoreboard, set team names
function startMatch() {
    const nameA = teamANameInput.value.trim() || "Team A";
    const nameB = teamBNameInput.value.trim() || "Team B";

    displayTeamA.textContent = nameA;
    displayTeamB.textContent = nameB;

    scoreboard.classList.remove("hidden");
    matchControls.classList.remove("hidden");
}

function playGoalSound() {
    const audio = document.getElementById("goalSound");
    audio.currentTime = 0; // restart sound if it's already playing
    audio.play();
}

function changeScore(team, delta) {
    if (team === 'A') {
        scoreA = Math.max(0, scoreA + delta);
        scoreAEl.textContent = scoreA;
        if (delta > 0) playGoalSound();
    } else {
        scoreB = Math.max(0, scoreB + delta);
        scoreBEl.textContent = scoreB;
        if (delta > 0) playGoalSound();
    }
}


// Foul control
function addFoul(team) {
    if (team === 'A') {
        foulsA++;
        foulsAEl.textContent = foulsA;
    } else {
        foulsB++;
        foulsBEl.textContent = foulsB;
    }
}

// Timer functions
function toggleTimer() {
    if (!isRunning) {
        timer = setInterval(updateTimer, 1000);
        isRunning = true;
    } else {
        clearInterval(timer);
        isRunning = false;
    }
}

function updateTimer() {
    seconds++;
    let mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

function resetTimer() {
    clearInterval(timer);
    seconds = 0;
    isRunning = false;
    timerDisplay.textContent = "00:00";
}

// Reset entire match
function resetMatch() {
    scoreA = 0;
    scoreB = 0;
    foulsA = 0;
    foulsB = 0;
    seconds = 0;
    isRunning = false;

    scoreAEl.textContent = "0";
    scoreBEl.textContent = "0";
    foulsAEl.textContent = "0";
    foulsBEl.textContent = "0";
    timerDisplay.textContent = "00:00";

    clearInterval(timer);
}
function saveResult() {
    const teamA = displayTeamA.textContent;
    const teamB = displayTeamB.textContent;
    const result = `${teamA} ${scoreA} - ${scoreB} ${teamB} (${formatTime(seconds)})`;

    let saved = JSON.parse(localStorage.getItem("matches")) || [];
    saved.push(result);
    localStorage.setItem("matches", JSON.stringify(saved));
    displaySavedMatches();
}

function displaySavedMatches() {
    const savedContainer = document.getElementById("savedMatches");
    let saved = JSON.parse(localStorage.getItem("matches")) || [];

    if (saved.length === 0) {
        savedContainer.innerHTML = "<p>No saved matches yet.</p>";
        return;
    }

    savedContainer.innerHTML = "<h3>Saved Matches</h3><ul>" +
        saved.map(match => `<li>${match}</li>`).join('') +
        "</ul>";
}

function formatTime(totalSeconds) {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

// Load saved matches on page load
window.onload = displaySavedMatches;
function exportCSV() {
    const saved = JSON.parse(localStorage.getItem("matches")) || [];
    if (saved.length === 0) return alert("No matches to export!");

    let csv = "Match Result\n";
    saved.forEach(result => {
        csv += `"${result}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "match_results.csv";
    a.click();
    URL.revokeObjectURL(url);
}
function clearSaved() {
    if (confirm("Are you sure you want to clear all saved matches?")) {
        localStorage.removeItem("matches");
        displaySavedMatches();
    }
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
