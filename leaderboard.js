document.addEventListener("DOMContentLoaded", () => {
    const leaderboardTable = document.getElementById("leaderboard-table");
    const backButton = document.getElementById("back-button");

    if (!leaderboardTable || !backButton) {
        console.error("Could not find required elements.");
        return;
    }

    fetch("/api/leaderboard")
        .then(response => response.json())
        .then(data => {
            let rank = 1;
            data.forEach(row => {
                const newRow = leaderboardTable.insertRow();
                newRow.insertCell(0).textContent = rank++;
                newRow.insertCell(1).textContent = row.username;
                newRow.insertCell(2).textContent = row.score;
            });
        })
        .catch(error => {
            console.error("Error fetching leaderboard data:", error);
        });

    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
