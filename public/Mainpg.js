async function searchPlayer(playerNumber) {
    const input = document.getElementById(`player${playerNumber}Search`);
    const playerName = input.value.trim();

    if (playerName === "") {
        alert("Please enter a player name.");
        return;
    }

    document.getElementById(`player${playerNumber}Name`).textContent = playerName;
    
    let playerId = "";
    let first = playerName.substring(0, 2).toLowerCase();
    let last = playerName.substring(playerName.indexOf(" ") + 1, playerName.length).toLowerCase();
    if (last.length > 5) {
        last = last.substring(0, 5);
    }

    playerId = last+first+"01";

    console.log("Generated ID:", playerId);

    try {
        
        const response = await fetch(`/api/player/${playerId}`);
        const {advData, boxData } = await response.json();

        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }

        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }

        const playerStats = organizeStats(boxData, advData);
        updatePlayerColumn(playerNumber, playerName, playerStats);
        if (playerNumber === 1) {
            player1Stats = playerStats;
            player1Label = playerName;
        } else {
            player2Stats = playerStats;
            player2Label = playerName;
        }

        updateChart();

    } catch (error) {
        console.error(error);
        alert("Error fetching player stats");
    }
}

function updatePlayerColumn(playerNumber, playerName, stats) {
    
    document.getElementById(`player${playerNumber}`).textContent = playerName;
    document.getElementById(`pts${playerNumber}`).textContent = stats.pts ?? "-";
    document.getElementById(`reb${playerNumber}`).textContent = stats.reb ?? "-";
    document.getElementById(`ast${playerNumber}`).textContent = stats.ast ?? "-";
    document.getElementById(`blk${playerNumber}`).textContent = stats.blk ?? "-";
    document.getElementById(`stl${playerNumber}`).textContent = stats.stl ?? "-";
    document.getElementById(`fg${playerNumber}`).textContent = stats.fg_pct + '%' ?? "-";
    document.getElementById(`3p${playerNumber}`).textContent = stats.fg3_pct + '%' ?? "-";
    document.getElementById(`ft${playerNumber}`).textContent = stats.ft_pct + '%' ?? "-";
    document.getElementById(`per${playerNumber}`).textContent = stats.per ?? "-";
    document.getElementById(`vorp${playerNumber}`).textContent = stats.vorp ?? "-";
    document.getElementById(`bpm${playerNumber}`).textContent = stats.box ?? "-";
    document.getElementById(`ts${playerNumber}`).textContent = stats.ts + '%' ?? "-";
    document.getElementById(`ws${playerNumber}`).textContent = stats.ws ?? "-";

}

function organizeStats(boxStats, advStats) {
    const overallStats = {
        pts: 0,
        reb: 0,
        ast: 0, 
        blk: 0,
        stl: 0,
        fg_pct: 0,
        fg3_pct: 0,
        ft_pct: 0,
        per: 0,
        vorp: 0,
        box: 0,
        ts: 0,
        ws: 0
    };

    let boxCount = 0;
    let advCount = 0;

    //sum across seasons

    for(const year in boxStats.data) {
        boxCount = boxCount + boxStats.data[year].games || 0;
        overallStats.pts = (overallStats.pts + (boxStats.data[year].points || 0));
        overallStats.reb = (overallStats.reb + (boxStats.data[year].totalRb || 0));
        overallStats.ast = (overallStats.ast + (boxStats.data[year].assists || 0));
        overallStats.blk = (overallStats.blk + (boxStats.data[year].blocks || 0));
        overallStats.stl = (overallStats.stl + (boxStats.data[year].steals || 0));
        overallStats.fg_pct = (overallStats.fg_pct + (boxStats.data[year].fieldPercent || 0));
        overallStats.fg3_pct = (overallStats.fg3_pct + (boxStats.data[year].threePercent || 0));
        overallStats.ft_pct = (overallStats.ft_pct + (boxStats.data[year].ftPercent || 0));
    }

    for(const year in advStats.data) {
        advCount += 1;
        overallStats.per = (overallStats.per + (advStats.data[year].per || 0));
        overallStats.vorp = (overallStats.vorp + (advStats.data[year].vorp || 0));
        overallStats.box = (overallStats.box + (advStats.data[year].box || 0));
        overallStats.ts = (overallStats.ts + (advStats.data[year].tsPercent || 0));
        overallStats.ws = (overallStats.ws + (advStats.data[year].winShares || 0));
    }

    console.log(overallStats.threePercent);


    //avg across seasons

    if (boxCount > 0) {
        overallStats.pts = (overallStats.pts / boxCount).toFixed(2);
        overallStats.reb = (overallStats.reb / boxCount).toFixed(1);
        overallStats.ast = (overallStats.ast / boxCount).toFixed(1);
        overallStats.blk = (overallStats.blk / boxCount).toFixed(1);
        overallStats.stl = (overallStats.stl / boxCount).toFixed(1);
        overallStats.fg_pct = ((overallStats.fg_pct / advCount) * 100).toFixed(1);
        overallStats.fg3_pct = ((overallStats.fg3_pct / advCount) * 100).toFixed(1);
        overallStats.ft_pct = ((overallStats.ft_pct / advCount) * 100).toFixed(1);
    }

    if (advCount > 0) {
        overallStats.per = (overallStats.per / advCount).toFixed(2);
        overallStats.vorp = (overallStats.vorp / advCount).toFixed(2);
        overallStats.box = (overallStats.box / advCount).toFixed(2);
        overallStats.ts = ((overallStats.ts / advCount) * 100).toFixed(1);
        overallStats.ws = (overallStats.ws / advCount).toFixed(2);
    }

    return overallStats;

}

let chart;

let player1Stats = null;
let player2Stats = null;
let player1Label = "Player 1";
let player2Label = "Player 2";

function updateChart() {
    if (!player1Stats || !player2Stats) {
        return;
    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(document.getElementById("statsChart"), {
        type: "bar",
        data: {
            labels: ["PER", "VORP", "BPM"],
            datasets: [
                {
                    label: player1Label,
                    data: [
                        player1Stats.per,
                        player1Stats.vorp,
                        player1Stats.box
                    ]
                },
                {
                    label: player2Label,
                    data: [
                        player2Stats.per,
                        player2Stats.vorp,
                        player2Stats.box
                    ]
                }
            ]
        }
    });
}


const statSwiper = new Swiper(".statSwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});