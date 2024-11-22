async function getScore() {
    const response = await fetch('http://localhost:5000/api/scores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json();

    const scoreTable = document.getElementById('scoreboardTable').getElementsByTagName('tbody')[0];
    scoreTable.innerHTML = '';

    data.forEach((data) => {
        const newRow = scoreTable.insertRow();

        newRow.insertCell(0).textContent = `${data.player1} vs ${data.player2}`;
        newRow.insertCell(1).textContent = data.winner;
        newRow.insertCell(2).textContent = data.gameId;
    });
}

// Redirect to Main Menu when Back button is clicked
document.getElementById("backToMenu").addEventListener("click", function() {
    window.location.href = "mainmenu.html"; // Redirect to the Main Menu
});
