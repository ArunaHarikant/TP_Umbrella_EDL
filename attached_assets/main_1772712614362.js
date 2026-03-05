// --- CONFIGURATION ---
const MISSION_PHASES = [
    { name: "CRUISE SEP", altitude: 125.0, velocity: 19800, temp: -150, status: "CRUISE STAGE SEPARATION" },
    { name: "ATMOS ENTRY", altitude: 125.0, velocity: 20520, temp: 100, status: "ATMOSPHERIC INTERFACE" },
    { name: "HYPERSONIC", altitude: 45.0, velocity: 10800, temp: 1500, status: "AERODYNAMIC DECELERATION" },
    { name: "PARACHUTE", altitude: 8.5, velocity: 1530, temp: 500, status: "SUPERSONIC DEPLOYMENT" },
    { name: "SHIELD SEP", altitude: 7.0, velocity: 1260, temp: 300, status: "HEAT SHIELD SEPARATION" },
    { name: "RADAR LOCK", altitude: 4.0, velocity: 900, temp: 100, status: "RADAR ALTIMETER ACTIVE" },
    { name: "BACKSHELL SEP", altitude: 1.25, velocity: 306, temp: 50, status: "LANDER BACKSHELL SEPARATION" },
    { name: "POWERED DESC", altitude: 0.5, velocity: 100, temp: 20, status: "POWERED DESCENT" },
    { name: "SKY CRANE", altitude: 0.02, velocity: 2.7, temp: 0, status: "SKY CRANE MANEUVER" },
    { name: "ROVER SEP", altitude: 0.01, velocity: 1.7, temp: -10, status: "ROVER SEPARATION" },
    { name: "MOBILITY", altitude: 0.005, velocity: 1.7, temp: -20, status: "MOBILITY DEPLOYMENT" },
    { name: "TOUCHDOWN", altitude: 0, velocity: 0, temp: -40, status: "TOUCHDOWN SUCCESSFUL" }
];

let currentPhaseIndex = 0;
let isSimulationRunning = false;
let missionTime = 0;
let currentVehicle = "rover";

// --- UI ELEMENTS ---
const elements = {
    altVal: document.getElementById('alt-val'),
    velVal: document.getElementById('vel-val'),
    tempVal: document.getElementById('temp-val'),
    fuelVal: document.getElementById('fuel-val'),
    phaseIndicator: document.getElementById('current-phase'),
    vehicleImg: document.getElementById('vehicle-img'),
    missionClock: document.getElementById('mission-clock'),
    startBtn: document.getElementById('start-sim'),
    abortBtn: document.getElementById('abort-sim'),
    logList: document.getElementById('log-list'),
    globalStatus: document.getElementById('global-status'),
    navBtns: document.querySelectorAll('.nav-btn'),
    trackerPoints: document.querySelectorAll('.tracker-point')
};

// --- CORE FUNCTIONS ---

function updateTelemetry(phase) {
    if (!phase) return;
    elements.altVal.textContent = phase.altitude >= 1 ? `${phase.altitude.toFixed(1)} km` : `${(phase.altitude * 1000).toFixed(0)} m`;
    elements.velVal.textContent = `${phase.velocity.toLocaleString()} km/h`;
    elements.tempVal.textContent = `${phase.temp} °C`;
    elements.phaseIndicator.textContent = `${phase.name} PHASE`;
    elements.globalStatus.textContent = `STATUS: ${phase.status}`;

    // Update progress bar
    const fuelElement = document.querySelector('.progress-bar .fill');
    const fuelRemaining = 100 - (currentPhaseIndex * (100 / (MISSION_PHASES.length - 1)));
    fuelElement.style.width = `${fuelRemaining}%`;
    elements.fuelVal.textContent = `${fuelRemaining.toFixed(1)}%`;

    // Highlight tracker
    elements.trackerPoints.forEach((point, index) => {
        if (index <= currentPhaseIndex) point.classList.add('active');
        else point.classList.remove('active');
    });

    // Update trajectory marker position
    const path = document.querySelector('.trajectory-path');
    const marker = document.querySelector('.trajectory-marker');
    if (path && marker) {
        const totalLength = path.getTotalLength();
        const fraction = currentPhaseIndex / (MISSION_PHASES.length - 1);
        const point = path.getPointAtLength(totalLength * fraction);
        marker.setAttribute('cx', point.x);
        marker.setAttribute('cy', point.y);
    }
}

function addLogEntry(message, type = "system") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = elements.missionClock.textContent;
    entry.textContent = `[${timestamp}] ${message}`;
    elements.logList.prepend(entry);

    // Keep internal log clean
    if (elements.logList.children.length > 20) {
        elements.logList.lastElementChild.remove();
    }
}

function startSimulation() {
    if (isSimulationRunning) return;
    isSimulationRunning = true;
    currentPhaseIndex = 0;
    missionTime = 0;

    elements.startBtn.disabled = true;
    elements.startBtn.textContent = "IN PROGRESS...";
    addLogEntry("EDL SEQUENCE INITIATED", "system");

    const simInterval = setInterval(() => {
        if (!isSimulationRunning) {
            clearInterval(simInterval);
            return;
        }

        missionTime += 1;
        updateClock();

        // Advance phases every 5 seconds for simulation demonstration
        if (missionTime % 5 === 0 && currentPhaseIndex < MISSION_PHASES.length - 1) {
            currentPhaseIndex++;
            const phase = MISSION_PHASES[currentPhaseIndex];
            updateTelemetry(phase);
            addLogEntry(`TRANSITION TO ${phase.name} PHASE`, "system");

            if (phase.name === "TOUCHDOWN") {
                isSimulationRunning = false;
                elements.startBtn.disabled = false;
                elements.startBtn.textContent = "RESET MISSION";
                addLogEntry("TOUCHDOWN CONFIRMED. MISSION SUCCESS.", "system");
                elements.globalStatus.classList.remove('pulse');
                elements.globalStatus.style.color = "var(--success)";
            }
        }
    }, 1000);
}

function updateClock() {
    const min = Math.floor(missionTime / 60);
    const sec = missionTime % 60;
    elements.missionClock.textContent = `T+00:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function toggleVehicle(vehicle) {
    if (isSimulationRunning) return;
    currentVehicle = vehicle;
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.vehicle === vehicle);
    });

    elements.vehicleImg.src = `assets/images/${vehicle}.png`;
    elements.vehicleImg.style.width = vehicle === "drone" ? "180px" : "250px";
    addLogEntry(`SWITCHED MODULE TO: ${vehicle.toUpperCase()}`, "system");
}

function abortSimulation() {
    isSimulationRunning = false;
    currentPhaseIndex = 0;
    missionTime = 0;
    elements.startBtn.disabled = false;
    elements.startBtn.textContent = "INITIATE EDL";
    updateClock();
    addLogEntry("!! MISSION ABORTED BY OPERATOR !!", "warning");
    elements.globalStatus.textContent = "STATUS: ABORTED";
    elements.globalStatus.style.color = "var(--danger)";

    // Reset tracker
    elements.trackerPoints.forEach((point, index) => {
        if (index > 0) point.classList.remove('active');
    });

    // Reset Telemetry and Trajectory
    updateTelemetry(MISSION_PHASES[0]);
}

// --- EVENT LISTENERS ---

elements.startBtn.addEventListener('click', () => {
    if (elements.startBtn.textContent === "RESET MISSION") {
        location.reload();
    } else {
        startSimulation();
    }
});

elements.abortBtn.addEventListener('click', abortSimulation);

elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => toggleVehicle(btn.dataset.vehicle));
});

// --- INITIALIZATION ---
window.onload = () => {
    updateTelemetry(MISSION_PHASES[0]);
    addLogEntry("MISSION READINESS CHECK: COMPLETE", "system");
    addLogEntry("AWAITING OPERATOR INPUT...", "system");

    // Generate static markers on the trajectory path
    const path = document.querySelector('.trajectory-path');
    const svg = document.querySelector('.trajectory-svg');
    if (path && svg) {
        const totalLength = path.getTotalLength();
        MISSION_PHASES.forEach((phase, index) => {
            const fraction = index / (MISSION_PHASES.length - 1);
            const point = path.getPointAtLength(totalLength * fraction);

            const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            marker.setAttribute("cx", point.x);
            marker.setAttribute("cy", point.y);
            marker.setAttribute("r", "2");
            marker.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
            svg.insertBefore(marker, document.querySelector('.trajectory-marker'));
        });
    }
};
