// standings.js - Gestión de tabla de posiciones y estadísticas

// Actualizar tabla de posiciones
function updateStandings() {
    const standingsBody = document.getElementById('standings-body');
    if (!standingsBody) return;
    
    if (appData.teams.length === 0) {
        standingsBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">No hay equipos registrados</td>
            </tr>
        `;
        return;
    }
    
    // Ordenar equipos por puntos
    const sortedTeams = [...appData.teams].sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.wins - a.wins;
    });
    
    let html = '';
    sortedTeams.forEach((team, index) => {
        const players = getPlayersByTeam(team.id);
        
        html += `
            <tr>
                <td class="position">${index + 1}</td>
                <td>
                    <div class="team-cell">
                        <div class="team-logo-small">${team.tag}</div>
                        <span>${team.name}</span>
                    </div>
                </td>
                <td>${team.wins + team.losses}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td><strong>${team.points}</strong></td>
            </tr>
        `;
    });
    
    standingsBody.innerHTML = html;
}

// Actualizar estadísticas de jugadores
function updatePlayerStats() {
    const playerStatsElement = document.getElementById('player-stats');
    if (!playerStatsElement) return;
    
    if (appData.players.length === 0) {
        playerStatsElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <p>No hay estadísticas disponibles</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    appData.players.forEach(player => {
        const team = getTeamById(player.teamId);
        const teamName = team ? team.name : 'Sin equipo';
        const kda = player.deaths > 0 ? ((player.kills + player.assists) / player.deaths).toFixed(2) : 'Perfecto';
        const kpg = player.games > 0 ? (player.kills / player.games).toFixed(1) : '0.0';
        const dpg = player.games > 0 ? (player.deaths / player.games).toFixed(1) : '0.0';
        const apg = player.games > 0 ? (player.assists / player.games).toFixed(1) : '0.0';
        
        html += `
            <div class="player-stat-card">
                <div class="player-stat-header">
                    <div class="player-stat-avatar">
                        ${player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="player-stat-info">
                        <div class="player-stat-name">${player.name}</div>
                        <div class="player-stat-team">${teamName} • ${player.role}</div>
                        <div class="player-stat-ign">${player.ign}</div>
                    </div>
                </div>
                <div class="stat-grid">
                    <div class="stat-item-large">
                        <div class="stat-value-large">${player.games}</div>
                        <div class="stat-label-large">Partidos</div>
                    </div>
                    <div class="stat-item-large">
                        <div class="stat-value-large">${kda}</div>
                        <div class="stat-label-large">KDA</div>
                    </div>
                </div>
                <div class="kda-stats">
                    <div class="kda-row">
                        <span class="kda-label">Asesinatos por partido:</span>
                        <span class="kda-value">${kpg}</span>
                    </div>
                    <div class="kda-row">
                        <span class="kda-label">Muertes por partido:</span>
                        <span class="kda-value">${dpg}</span>
                    </div>
                    <div class="kda-row">
                        <span class="kda-label">Asistencias por partido:</span>
                        <span class="kda-value">${apg}</span>
                    </div>
                    <div class="kda-row">
                        <span class="kda-label">Total asesinatos:</span>
                        <span class="kda-value">${player.kills}</span>
                    </div>
                    <div class="kda-row">
                        <span class="kda-label">Total muertes:</span>
                        <span class="kda-value">${player.deaths}</span>
                    </div>
                    <div class="kda-row">
                        <span class="kda-label">Total asistencias:</span>
                        <span class="kda-value">${player.assists}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    playerStatsElement.innerHTML = html;
}

