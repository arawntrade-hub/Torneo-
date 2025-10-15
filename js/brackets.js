// brackets.js - Gestión de brackets

// Inicializar formulario de brackets
function initBracketForm() {
    const form = document.getElementById('bracket-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateBracket();
    });
}

// Generar bracket
function generateBracket() {
    const bracketType = document.getElementById('bracket-type').value;
    const teamCount = parseInt(document.getElementById('team-count').value);
    
    if (appData.teams.length < teamCount) {
        showNotification(`Necesitas al menos ${teamCount} equipos para generar este bracket`, 'error');
        return;
    }
    
    // Generar partidos según el tipo de bracket
    if (bracketType === 'single-elimination') {
        generateSingleEliminationBracket(teamCount);
    } else if (bracketType === 'double-elimination') {
        generateDoubleEliminationBracket(teamCount);
    }
    
    updateBracketView();
    showNotification(`Bracket de ${teamCount} equipos generado correctamente`, 'success');
}

// Generar bracket de eliminación simple
function generateSingleEliminationBracket(teamCount) {
    appData.matches = [];
    
    // Seleccionar equipos aleatorios para el bracket
    const selectedTeams = [...appData.teams]
        .sort(() => Math.random() - 0.5)
        .slice(0, teamCount);
    
    let round = 1;
    let currentRoundTeams = [...selectedTeams];
    
    while (currentRoundTeams.length > 1) {
        const nextRoundTeams = [];
        
        for (let i = 0; i < currentRoundTeams.length; i += 2) {
            if (i + 1 < currentRoundTeams.length) {
                const match = {
                    id: appData.matches.length + 1,
                    round: round,
                    team1: currentRoundTeams[i],
                    team2: currentRoundTeams[i + 1],
                    winner: null,
                    score1: 0,
                    score2: 0
                };
                appData.matches.push(match);
                
                // Para la demostración, asignar un ganador aleatorio
                if (round === 1) {
                    const winnerIndex = Math.random() > 0.5 ? i : i + 1;
                    match.winner = currentRoundTeams[winnerIndex].id;
                    match.score1 = winnerIndex === i ? 2 : 1;
                    match.score2 = winnerIndex === i ? 1 : 2;
                    nextRoundTeams.push(currentRoundTeams[winnerIndex]);
                }
            } else {
                // Equipo que pasa directamente a la siguiente ronda
                nextRoundTeams.push(currentRoundTeams[i]);
            }
        }
        
        currentRoundTeams = nextRoundTeams;
        round++;
    }
    
    // Crear partido final si es necesario
    if (currentRoundTeams.length === 2) {
        const match = {
            id: appData.matches.length + 1,
            round: round,
            team1: currentRoundTeams[0],
            team2: currentRoundTeams[1],
            winner: null,
            score1: 0,
            score2: 0
        };
        appData.matches.push(match);
    }
}

// Generar bracket de eliminación doble (simplificado)
function generateDoubleEliminationBracket(teamCount) {
    // Implementación simplificada para la demostración
    generateSingleEliminationBracket(teamCount);
}

// Actualizar vista del bracket
function updateBracketView() {
    const bracketElement = document.getElementById('tournament-bracket');
    if (!bracketElement) return;
    
    if (appData.matches.length === 0) {
        bracketElement.innerHTML = `
            <div class="bracket-placeholder">
                <i class="fas fa-sitemap"></i>
                <p>Genera el bracket para visualizarlo aquí</p>
            </div>
        `;
        return;
    }
    
    // Encontrar el número máximo de rondas
    const maxRound = Math.max(...appData.matches.map(match => match.round));
    
    let html = '';
    
    // Crear una columna para cada ronda
    for (let round = 1; round <= maxRound; round++) {
        const roundMatches = appData.matches.filter(match => match.round === round);
        const isFinal = round === maxRound;
        
        html += `
            <div class="round">
                <div class="round-title">${isFinal ? 'Final' : `Ronda ${round}`}</div>
                ${roundMatches.map(match => {
                    const isWinner1 = match.winner === match.team1.id;
                    const isWinner2 = match.winner === match.team2.id;
                    
                    return `
                        <div class="match ${isFinal ? 'final-match' : ''}">
                            <div class="team-vs ${isWinner1 ? 'winner' : ''}">
                                <span class="team-name">${match.team1.name}</span>
                                <span class="team-score">${match.score1}</span>
                            </div>
                            <div class="team-vs ${isWinner2 ? 'winner' : ''}">
                                <span class="team-name">${match.team2.name}</span>
                                <span class="team-score">${match.score2}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    bracketElement.innerHTML = html;
}

