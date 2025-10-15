// players.js - Gestión de jugadores

// Inicializar formulario de jugadores
function initPlayerForm() {
    const form = document.getElementById('player-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addPlayer();
    });
}

// Actualizar selector de equipos en formulario de jugadores
function updatePlayerTeamSelect() {
    const teamSelect = document.getElementById('player-team');
    if (!teamSelect) return;
    
    // Limpiar opciones existentes (excepto la primera)
    while (teamSelect.children.length > 1) {
        teamSelect.removeChild(teamSelect.lastChild);
    }
    
    // Añadir equipos
    appData.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
}

// Añadir nuevo jugador
function addPlayer() {
    const name = document.getElementById('player-name').value;
    const ign = document.getElementById('player-ign').value;
    const teamId = parseInt(document.getElementById('player-team').value);
    const role = document.getElementById('player-role').value;
    
    if (name && ign && teamId) {
        const player = {
            id: appData.players.length > 0 ? Math.max(...appData.players.map(p => p.id)) + 1 : 1,
            name: name,
            ign: ign,
            teamId: teamId,
            role: role,
            kills: 0,
            deaths: 0,
            assists: 0,
            games: 0
        };
        
        appData.players.push(player);
        updatePlayerList();
        updateCounters();
        document.getElementById('player-form').reset();
        
        showNotification(`Jugador "${name}" añadido correctamente`, 'success');
    }
}

// Actualizar lista de jugadores
function updatePlayerList() {
    const playerListElement = document.getElementById('player-list');
    if (!playerListElement) return;
    
    if (appData.players.length === 0) {
        playerListElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user"></i>
                <p>No hay jugadores registrados aún</p>
                <button class="btn btn-outline">Añadir primer jugador</button>
            </div>
        `;
        return;
    }
    
    let html = '';
    appData.players.forEach(player => {
        const team = getTeamById(player.teamId);
        const teamName = team ? team.name : 'Sin equipo';
        const kda = player.deaths > 0 ? ((player.kills + player.assists) / player.deaths).toFixed(2) : 'Perfecto';
        
        html += `
            <div class="player-card" data-player-id="${player.id}">
                <div class="player-header">
                    <div class="player-avatar">
                        ${player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="player-info">
                        <div class="player-name">${player.name}</div>
                        <div class="player-ign">${player.ign}</div>
                    </div>
                </div>
                <div class="player-details">
                    <div class="detail-item">
                        <span class="detail-label">Equipo:</span>
                        <span class="detail-value">${teamName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Rol:</span>
                        <span class="detail-value">${player.role}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Partidos:</span>
                        <span class="detail-value">${player.games}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">KDA:</span>
                        <span class="detail-value">${kda}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    playerListElement.innerHTML = html;
}

