// teams.js - Gestión de equipos

// Inicializar formulario de equipos
function initTeamForm() {
    const form = document.getElementById('team-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addTeam();
    });
}

// Añadir nuevo equipo
function addTeam() {
    const name = document.getElementById('team-name').value;
    const tag = document.getElementById('team-tag').value;
    const logo = document.getElementById('team-logo').value;
    
    if (name && tag) {
        const team = {
            id: appData.teams.length > 0 ? Math.max(...appData.teams.map(t => t.id)) + 1 : 1,
            name: name,
            tag: tag,
            logo: logo,
            wins: 0,
            losses: 0,
            points: 0
        };
        
        appData.teams.push(team);
        updateTeamList();
        updatePlayerTeamSelect();
        updateCounters();
        document.getElementById('team-form').reset();
        
        showNotification(`Equipo "${name}" añadido correctamente`, 'success');
    }
}

// Actualizar lista de equipos
function updateTeamList() {
    const teamListElement = document.getElementById('team-list');
    if (!teamListElement) return;
    
    if (appData.teams.length === 0) {
        teamListElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No hay equipos registrados aún</p>
                <button class="btn btn-outline">Añadir primer equipo</button>
            </div>
        `;
        return;
    }
    
    let html = '';
    appData.teams.forEach(team => {
        const players = getPlayersByTeam(team.id);
        
        html += `
            <div class="team-card" data-team-id="${team.id}">
                <div class="team-logo">
                    ${team.logo ? `<img src="${team.logo}" alt="${team.name}">` : team.tag}
                </div>
                <div class="team-info">
                    <div class="team-name">${team.name}</div>
                    <div class="team-tag">[${team.tag}]</div>
                    <div class="team-stats">
                        <div class="stat-item">
                            <div class="stat-value">${team.wins}</div>
                            <div class="stat-label">Victorias</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${team.losses}</div>
                            <div class="stat-label">Derrotas</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${team.points}</div>
                            <div class="stat-label">Puntos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${players.length}</div>
                            <div class="stat-label">Jugadores</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    teamListElement.innerHTML = html;
}

