// main.js - Archivo principal que inicializa la aplicación

// Datos globales de la aplicación
const appData = {
    tournament: {
        name: "",
        date: "",
        description: "",
        format: "single-elimination"
    },
    teams: [],
    players: [],
    matches: [],
    standings: [],
    currentTab: "tournament"
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log("ML Tournament Pro - Inicializando aplicación");
    
    // Mostrar loading indicator
    showLoadingIndicator();
    
    // Configurar navegación
    setupNavigation();
    
    // Cargar datos de ejemplo para demostración
    loadSampleData();
    
    // Actualizar todas las vistas
    updateAllViews();
    
    // Configurar event listeners globales
    setupGlobalEvents();
    
    // Ocultar loading indicator después de un tiempo
    setTimeout(hideLoadingIndicator, 2000);
});

// Mostrar indicador de carga
function showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
        
        // Simular progreso de carga
        simulateLoadingProgress();
    }
}

// Simular progreso de carga
function simulateLoadingProgress() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingLogs = document.getElementById('loading-logs');
    
    if (!loadingBar || !loadingLogs) return;
    
    const steps = [
        { progress: 10, message: "Cargando estilos CSS..." },
        { progress: 25, message: "Inicializando componentes..." },
        { progress: 40, message: "Cargando datos de ejemplo..." },
        { progress: 60, message: "Configurando navegación..." },
        { progress: 80, message: "Preparando interfaz..." },
        { progress: 95, message: "Aplicación casi lista..." },
        { progress: 100, message: "¡Aplicación cargada!" }
    ];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            loadingBar.style.width = `${step.progress}%`;
            
            // Añadir log
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.textContent = step.message;
            loadingLogs.appendChild(logItem);
            
            // Scroll al final
            loadingLogs.scrollTop = loadingLogs.scrollHeight;
            
        }, index * 300);
    });
}

// Ocultar indicador de carga
function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 500);
    }
}

// Configuración de la navegación entre pestañas - CORREGIDA
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Añadir clase active al enlace clickeado
            this.classList.add('active');
            
            // Ocultar todos los contenidos de tabs
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Actualizar la pestaña actual
            appData.currentTab = tabId;
            
            console.log(`Cambiando a pestaña: ${tabId}`);
            
            // Actualizar la vista específica si es necesario
            if (tabId === 'brackets') {
                updateBracketView();
            } else if (tabId === 'standings') {
                updateStandings();
                updatePlayerStats();
            }
        });
    });
}

// Configuración de eventos globales
function setupGlobalEvents() {
    // Botón de guardar
    const saveBtn = document.querySelector('.btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveAllData();
        });
    }
    
    // Botón de exportar
    const exportBtn = document.querySelector('.btn-secondary');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exportData();
        });
    }
    
    // Botones de "añadir" en estados vacíos
    document.querySelectorAll('.empty-state .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.closest('.tab-content').id.replace('-tab', '');
            const navLink = document.querySelector(`[data-tab="${targetTab}"]`);
            if (navLink) {
                navLink.click();
            }
        });
    });
}

// Cargar datos de ejemplo para demostración
function loadSampleData() {
    console.log("Cargando datos de ejemplo...");
    
    // Datos de torneo de ejemplo
    appData.tournament = {
        name: "Copa Mobile Legends 2023",
        date: "2023-11-15",
        description: "Torneo nacional de Mobile Legends con los mejores equipos del país. Premio total: $5,000",
        format: "single-elimination"
    };
    
    // Equipos de ejemplo
    appData.teams = [
        { id: 1, name: "Legends Pro", tag: "LGP", logo: "", wins: 3, losses: 1, points: 9 },
        { id: 2, name: "ML Masters", tag: "MLM", logo: "", wins: 2, losses: 2, points: 6 },
        { id: 3, name: "Epic Gamers", tag: "EPG", logo: "", wins: 4, losses: 0, points: 12 },
        { id: 4, name: "Victory Team", tag: "VCT", logo: "", wins: 1, losses: 3, points: 3 }
    ];
    
    // Jugadores de ejemplo
    appData.players = [
        { id: 1, name: "Carlos Rodríguez", ign: "MLProCarlos", teamId: 1, role: "Marksman", kills: 45, deaths: 12, assists: 30, games: 8 },
        { id: 2, name: "Ana García", ign: "AnaGamer", teamId: 1, role: "Mage", kills: 32, deaths: 18, assists: 42, games: 8 },
        { id: 3, name: "Luis Fernández", ign: "LuisFight", teamId: 2, role: "Fighter", kills: 38, deaths: 22, assists: 25, games: 8 },
        { id: 4, name: "María López", ign: "MariSupport", teamId: 3, role: "Support", kills: 15, deaths: 10, assists: 55, games: 8 }
    ];
    
    // Generar partidos de ejemplo para el bracket
    generateSampleMatches();
}

// Generar partidos de ejemplo para el bracket
function generateSampleMatches() {
    appData.matches = [];
    
    // Ronda 1 (Semifinales)
    for (let i = 0; i < appData.teams.length; i += 2) {
        if (i + 1 < appData.teams.length) {
            const match = {
                id: appData.matches.length + 1,
                round: 1,
                team1: appData.teams[i],
                team2: appData.teams[i + 1],
                winner: i % 4 === 0 ? appData.teams[i].id : appData.teams[i + 1].id,
                score1: i % 4 === 0 ? 2 : 1,
                score2: i % 4 === 0 ? 1 : 2
            };
            appData.matches.push(match);
        }
    }
    
    // Ronda 2 (Final)
    const round1Winners = appData.matches.filter(m => m.round === 1).map(m => m.winner);
    if (round1Winners.length >= 2) {
        const team1 = appData.teams.find(t => t.id === round1Winners[0]);
        const team2 = appData.teams.find(t => t.id === round1Winners[1]);
        
        const match = {
            id: appData.matches.length + 1,
            round: 2,
            team1: team1,
            team2: team2,
            winner: team1.id,
            score1: 3,
            score2: 2
        };
        appData.matches.push(match);
    }
}

// Actualizar todas las vistas
function updateAllViews() {
    updateTournamentForm();
    updateTournamentSummary();
    updateTeamList();
    updatePlayerTeamSelect();
    updatePlayerList();
    updateBracketView();
    updateStandings();
    updatePlayerStats();
    updateCounters();
}

// Actualizar contadores
function updateCounters() {
    const teamsCount = document.querySelector('.teams-count');
    const playersCount = document.querySelector('.players-count');
    
    if (teamsCount) {
        teamsCount.textContent = `${appData.teams.length} equipos`;
    }
    
    if (playersCount) {
        playersCount.textContent = `${appData.players.length} jugadores`;
    }
}

// Guardar todos los datos (simulación)
function saveAllData() {
    console.log("Guardando todos los datos...");
    // En una aplicación real, aquí se enviarían los datos al servidor
    showNotification('Datos guardados correctamente', 'success');
}

// Exportar datos
function exportData() {
    console.log("Exportando datos...");
    // En una aplicación real, aquí se generarían archivos para descargar
    showNotification('Datos exportados correctamente', 'success');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Añadir estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 15px 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                border-left: 4px solid #6a11cb;
            }
            .notification-success {
                border-left-color: #4ecdc4;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification-success i {
                color: #4ecdc4;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Añadir al DOM y mostrar
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funciones placeholder para las demás vistas
function updateTournamentForm() {
    console.log("Actualizando formulario de torneo");
}

function updateTournamentSummary() {
    console.log("Actualizando resumen del torneo");
}

function updateTeamList() {
    console.log("Actualizando lista de equipos");
}

function updatePlayerTeamSelect() {
    console.log("Actualizando selector de equipos");
}

function updatePlayerList() {
    console.log("Actualizando lista de jugadores");
}

function updateBracketView() {
    console.log("Actualizando vista de brackets");
}

function updateStandings() {
    console.log("Actualizando tabla de posiciones");
}

function updatePlayerStats() {
    console.log("Actualizando estadísticas de jugadores");
}