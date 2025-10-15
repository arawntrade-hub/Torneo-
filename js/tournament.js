// tournament.js - Gestión de la información del torneo

// Inicializar formulario de torneo
function updateTournamentForm() {
    const form = document.getElementById('tournament-form');
    if (!form) return;
    
    // Rellenar formulario con datos existentes
    document.getElementById('tournament-name').value = appData.tournament.name;
    document.getElementById('tournament-date').value = appData.tournament.date;
    document.getElementById('tournament-description').value = appData.tournament.description;
    document.getElementById('tournament-format').value = appData.tournament.format;
    
    // Configurar event listener para el formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTournamentData();
    });
}

// Guardar datos del torneo
function saveTournamentData() {
    appData.tournament.name = document.getElementById('tournament-name').value;
    appData.tournament.date = document.getElementById('tournament-date').value;
    appData.tournament.description = document.getElementById('tournament-description').value;
    appData.tournament.format = document.getElementById('tournament-format').value;
    
    updateTournamentSummary();
    showNotification('Información del torneo guardada correctamente', 'success');
}

// Actualizar resumen del torneo
function updateTournamentSummary() {
    const summaryElement = document.getElementById('tournament-summary');
    if (!summaryElement) return;
    
    if (appData.tournament.name) {
        const formatNames = {
            'single-elimination': 'Eliminación Simple',
            'double-elimination': 'Eliminación Doble',
            'round-robin': 'Todos contra Todos'
        };
        
        const formatName = formatNames[appData.tournament.format] || appData.tournament.format;
        
        const html = `
            <div class="tournament-summary">
                <div class="summary-header">
                    <h3>${appData.tournament.name}</h3>
                    <span class="tournament-badge">${formatName}</span>
                </div>
                <div class="summary-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>Fecha:</strong>
                            <span>${appData.tournament.date}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Descripción:</strong>
                            <span>${appData.tournament.description}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <strong>Equipos registrados:</strong>
                            <span>${appData.teams.length}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <div>
                            <strong>Jugadores registrados:</strong>
                            <span>${appData.players.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        summaryElement.innerHTML = html;
    }
}

