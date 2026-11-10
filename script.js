// ===========================
// Particle Background
// ===========================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===========================
// Cursor Glow
// ===========================
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ===========================
// Navigation
// ===========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===========================
// Typing Effect
// ===========================
const roles = [
    'Engineering Technology Student',
    'Robotics Enthusiast',
    'Embedded Systems Enthusiast',
    'IoT & Hardware Prototyper',
    'Arduino & ESP32 Maker'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedRole = document.getElementById('typedRole');

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typedRole.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
    } else {
        typedRole.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    const speed = isDeleting ? 40 : 80;
    setTimeout(typeEffect, speed);
}

typeEffect();

// ===========================
// Counter Animation
// ===========================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target + '+';
            }
        }

        requestAnimationFrame(update);
    });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===========================
// Scroll Reveal Animation
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the animation
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('[data-aos]').forEach(el => {
    revealObserver.observe(el);
});

// ===========================
// Footer Year
// ===========================
document.getElementById('year').textContent = new Date().getFullYear();

// ===========================
// Smooth scroll for all anchor links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===========================
// Hardware & Project Inspection Modal
// ===========================
const projectKeys = ['weather_station', 'soil_rover', 'agri_robot', 'robotic_arm', 'obstacle_car', 'greenhouse'];
let currentProjectIndex = 0;
let currentModalTab = 'arch';

const projectData = {
    greenhouse: {
        badge: 'Vertex 2025 – 2nd Place | Team InnoX',
        title: 'Eco Smart Greenhouse Automation System',
        subtitle: 'Embedded Control, Multi-Relay Environmental Management & Firebase IoT',
        architecture: `+-------------------------------------------------------------+
|                     ESP32 Expansion Board                   |
|  [GPIO Matrix]      [Relay Driver Bus]      [ADC / I2C Bus] |
+---------+-------------------+----------------------+--------+
          |                   |                      |
          v                   v                      v
   +--------------+    +---------------+      +--------------+
   | Relays (x8)  |    | Sensors Array |      | Edge AI Cam  |
   | - Misting    |    | - DHT11 (Air) |      | - ESP32-CAM  |
   | - Grow Light |    | - Soil Probe  |      | - Edge       |
   | - Exhaust    |    | - Light (LDR) |      |   Impulse    |
   | - Water Pump |    +---------------+      +-------+------+
   +--------------+                                   |
          ^                                           |
          +---------- Cloud Telemetry (WiFi) ---------+
                              |
                              v
                 [ Google Firebase Realtime DB ]`,
        specs: [
            ['Core Controller', 'ESP32 NodeMCU on custom screw-terminal expansion shield'],
            ['Sensing Elements', 'DHT11 (Temp/Humidity), Resistive Soil Moisture, LDR light level'],
            ['Power Actuation', '8-Channel optocoupled 5V Relay Board switching 12V/230V pumps & fans'],
            ['Edge Intelligence', 'ESP32-CAM running Edge Impulse TinyML plant disease classification'],
            ['Cloud / Monitoring', 'Google Firebase Realtime Database with live responsive dashboard'],
            ['Key Challenge Solved', 'Mitigated inductive flyback electrical noise from relay coils crashing the MCU using optical isolation and star grounding.']
        ],
        firmwareDesc: 'Multi-sensor hysteresis control loop managing 8 optocoupled relay channels and streaming telemetry to Google Firebase Realtime Database.',
        firmwareSnippet: `// Relay Hysteresis & Automated Actuation Loop
void handleEnvironmentalControl(float tempC, int soilMoistureRaw) {
    // Soil moisture thresholding with 5% deadband
    if (soilMoistureRaw < SOIL_DRY_THRESHOLD) {
        setRelayState(RELAY_PUMP_PIN, RELAY_ON);
    } else if (soilMoistureRaw > SOIL_WET_THRESHOLD) {
        setRelayState(RELAY_PUMP_PIN, RELAY_OFF);
    }
    // High heat emergency cooling trigger
    if (tempC >= COOLING_TEMP_TRIGGER) {
        setRelayState(RELAY_FAN_PIN, RELAY_ON);
        setRelayState(RELAY_MIST_PIN, RELAY_ON);
    }
    // Sync JSON packet to Google Firebase
    Firebase.setFloat(fbData, "/greenhouse/sensors/temp", tempC);
}`,
        repo: 'https://github.com/hirusha-niluminda',
        demoNote: 'Live presentation video and system testing clips recorded at Vertex 2025.'
    },
    agri_robot: {
        badge: 'INCO Competition 2026 | Team Project',
        title: 'Autonomous Agricultural Robot',
        subtitle: 'Precision Seed Dispensing, Liquid Fertilizer & Dead-Reckoning Navigation',
        architecture: `+-------------------------------------------------------------+
|                       ESP32 Master MCU                      |
| [Encoder Counters]      [PWM Motor Driver]      [ESP-NOW RF]|
+---------+-------------------+------------------------+------+
          |                   |                        |
          v                   v                        v
   +--------------+    +----------------+       +--------------+
   | Wheel Encoders|   | Motor Drivers  |       | Custom Remote|
   | - Hall Effect|    | - L298N / BTS  |       | - Dual Stick |
   | - Dead       |    | - Geared DC    |       | - 2.4GHz RF  |
   |   Reckoning  |    |   Drive Motors |       | - OLED HUD   |
   +--------------+    +----------------+       +--------------+
          ^
          +--- Ultrasonic Echo (Obstacle Detection < 30cm)`,
        specs: [
            ['Core MCU', 'ESP32 (Dual Core 240MHz) handling kinematics and telemetry concurrently'],
            ['Navigation Method', 'Hall-Effect wheel ticks + ultrasonic rangefinders for dead-reckoning trajectory'],
            ['Dispensing System', 'Servo-actuated precision seed valve & 12V peristaltic fertilizer pump'],
            ['Remote Control', 'Handbuilt custom handheld transmitter using ESP-NOW low latency protocol'],
            ['Power System', '3S Li-ion 11.1V battery bank with independent LM2596 buck converters'],
            ['Key Challenge Solved', 'Solved wheel slippage cumulative errors in outdoor soil conditions by implementing odometric correction algorithms.']
        ],
        firmwareDesc: 'Dual-core ESP32 firmware running odometric dead-reckoning kinematics and ultrasonic obstacle distance vectoring.',
        firmwareSnippet: `// Dead-Reckoning Kinematics via Hall-Effect Wheel Ticks
void calculateOdometry(long leftTicks, long rightTicks) {
    float dLeft  = (leftTicks  - prevLeftTicks)  * MM_PER_TICK;
    float dRight = (rightTicks - prevRightTicks) * MM_PER_TICK;
    float dDist  = (dLeft + dRight) / 2.0;
    float dTheta = (dRight - dLeft) / WHEEL_BASE_MM;

    robotPose.x     += dDist * cos(robotPose.heading + dTheta / 2.0);
    robotPose.y     += dDist * sin(robotPose.heading + dTheta / 2.0);
    robotPose.heading += dTheta;

    prevLeftTicks  = leftTicks;
    prevRightTicks = rightTicks;
}`,
        repo: 'https://github.com/hirusha-niluminda',
        demoNote: 'Field testing video demonstrating autonomous seed dispensing and remote override.'
    },
    robotic_arm: {
        badge: 'Personal Robotics Project',
        title: '4-DOF Robotic Arm with Dual Control System',
        subtitle: 'ESP32 Asynchronous Web Dashboard & Dual-Analog Joystick Controller',
        architecture: `+-------------------------------------------------------------+
|                         ESP32 MCU                           |
|  [ESP-AsyncWebServer]      [6x PWM Channels]    [Dual Joyst] |
+---------+-------------------+------------------------+------+
          |                   |                        |
          v                   v                        v
   +---------------+   +----------------+       +--------------+
   | Web Dashboard |   | Servo Motors   |       | Joystick Unit|
   | - Slider UI   |   | - Base (180°)  |       | - Dual X/Y   |
   | - Preset Pose |   | - Shoulder     |       | - Deadband   |
   | - Websocket   |   | - Elbow        |       |   Filtering  |
   |   Control     |   | - End-Effector |       | - Calibration|
   +---------------+   +----------------+       +--------------+`,
        specs: [
            ['Actuators', '4x High-Torque Metal Gear Servos (MG996R / SG90)'],
            ['Control Modes', 'Mode A: ESP32 Access Point Web Interface / Mode B: Physical Dual Joysticks'],
            ['Kinematics', 'Forward kinematics mapped to joint angle constraints in custom C++ firmware'],
            ['Power Circuit', 'Dedicated 5V 5A step-down regulator to prevent servo brownouts'],
            ['Firmware Toolchain', 'PlatformIO / C++ with PCA9685/PWM servo library optimizations'],
            ['Key Challenge Solved', 'Eliminated servo jitter caused by noisy ADC potentiometer readings through software deadband filtering and moving-average smoothing.']
        ],
        firmwareDesc: 'ESP-AsyncWebServer Websocket handler with dual-axis joystick deadband filtering and exponential servo smoothing.',
        firmwareSnippet: `// Joystick Deadband Filter & Servo Interpolation
int filterJoystickAxis(int rawAdc, int centerAdc, int deadband) {
    int deviation = rawAdc - centerAdc;
    if (abs(deviation) < deadband) return 0;
    return map(deviation, -2048, 2047, -SERVO_STEP_LIMIT, SERVO_STEP_LIMIT);
}

void updateJointAngle(int jointIndex, int delta) {
    targetAngles[jointIndex] = constrain(targetAngles[jointIndex] + delta, 0, 180);
    // Smooth exponential step interpolation
    smoothedAngles[jointIndex] = (smoothedAngles[jointIndex] * 7 + targetAngles[jointIndex] * 3) / 10;
    pwmDriver.setPWM(jointIndex, 0, angleToPulse(smoothedAngles[jointIndex]));
}`,
        repo: 'https://github.com/hirusha-niluminda',
        demoNote: 'Video clip demonstrating pick-and-place precision and web slider response.'
    },
    weather_station: {
        badge: 'Personal Project | In Development | ESP32 IoT',
        title: 'Multi-Sensor IoT Weather Station',
        subtitle: 'Environmental Telemetry, MicroSD Blackbox Logging & Google Firebase Web Dashboard',
        liveUrl: 'https://hirusha-weatherstation.web.app/',
        architecture: `[ Sensirion / DHT / BMP Sensors ]
               |
               v (I2C / 1-Wire)
       +---------------+
       |   ESP32 MCU   | ===> [ HD44780 16x2 LCD (I2C) ]
       +-------+-------+
               |
      +--------+--------+
      |                 |
      v (SPI Bus)       v (WiFi 802.11 b/g/n)
[ MicroSD Card Log ]  [ Google Firebase Web App (hirusha-weatherstation.web.app) ]`,
        specs: [
            ['Microcontroller', 'ESP32 with Deep Sleep power-saving routines'],
            ['Sensor Payload', 'DHT11 / Barometric pressure / LDR Ambient Light sensor'],
            ['Local Display', '16×2 Character LCD with PCF8574 I2C backpack'],
            ['Storage', 'SPI MicroSD card module logging CSV format with timestamps'],
            ['Cloud & Web Hosting', 'Google Firebase Realtime Database & Firebase Web Dashboard (https://hirusha-weatherstation.web.app/)'],
            ['Hardware Form', 'Breadboard prototype completed; migrating to custom dot-board PCB layout'],
            ['Key Challenge Solved', 'Ensured reliable SPI card communication without bus contention with other high-speed peripherals.']
        ],
        firmwareDesc: 'Low-power periodic wake-and-log routines with SPI SD-card buffer flushing and Google Firebase Realtime Database live sync.',
        firmwareSnippet: `// Non-Blocking MicroSD Data Blackbox Logger & Firebase Telemetry Sync
void writeTelemetryLog(float temp, float humidity, float pres) {
    File logFile = SD.open("/WEATHER.CSV", FILE_APPEND);
    if (logFile) {
        logFile.printf("%lu,%.2f,%.2f,%.2f\\n", rtc.getEpoch(), temp, humidity, pres);
        logFile.close();
        digitalWrite(PIN_LED_SD_WRITE, HIGH);
        delay(10);
        digitalWrite(PIN_LED_SD_WRITE, LOW);
    }
    // Stream live environmental packet to Google Firebase
    Firebase.setFloat(fbData, "/weather/temperature", temp);
    Firebase.setFloat(fbData, "/weather/humidity", humidity);
    Firebase.setFloat(fbData, "/weather/pressure", pres);
}`,
        repo: 'https://github.com/hirusha-niluminda',
        demoNote: 'Live web dashboard deployed and accessible at <a href="https://hirusha-weatherstation.web.app/" target="_blank" style="color:var(--accent); text-decoration:underline; font-weight:600;">hirusha-weatherstation.web.app <i class="fas fa-arrow-up-right-from-square"></i></a>. Real-time telemetry stream synchronized with ESP32 sensor readings.'
    },
    obstacle_car: {
        badge: 'Personal Project | Arduino Sonar Robot',
        title: 'Obstacle Avoiding Robot (4-Wheel Car)',
        subtitle: 'Autonomous Sonar Trajectory & Wireless Remote Override',
        architecture: `+-------------------------------------------------------------+
|                      ATmega328P / Arduino                   |
|   [Timer Interrupts]     [Dual H-Bridge]      [Echo Timing]  |
+---------+-------------------+------------------------+------+
          |                   |                        |
          v                   v                        v
   +---------------+   +----------------+       +--------------+
   | Ultrasonic    |   | L298N Driver   |       | Wireless RX  |
   | - HC-SR04     |   | - 4x TT Motors |       | - NRF24L01 / |
   | - Front Radar |   | - Bi-Direction |       |   Custom TX  |
   | - Pan Servo   |   | - PWM Speed    |       | - Emergency  |
   +---------------+   +----------------+       |   Stop Mode  |
                                                +--------------+`,
        specs: [
            ['Processing Unit', 'Arduino Uno / Nano (ATmega328P)'],
            ['Distance Ranging', 'HC-SR04 ultrasonic transducer with distance threshold avoidance logic (<25cm)'],
            ['Drive Train', '4-Wheel Drive TT geared motors with dual H-bridge motor driver'],
            ['Controller', 'Custom ergonomic wireless remote control for manual override'],
            ['Key Challenge Solved', 'Prevented robot corner-trapping by implementing a look-left/look-right servo scanning routine before turning.']
        ],
        firmwareDesc: 'State-machine navigation with pan servo obstacle scanning and dynamic PWM turning control.',
        firmwareSnippet: `// Servo Look-Ahead Sonar Avoidance Routine
void executeAvoidanceManeuver() {
    haltDCMotors();
    int leftDist  = pingSonarAtAngle(30);   // Scan left
    int rightDist = pingSonarAtAngle(150);  // Scan right

    if (leftDist > rightDist && leftDist > CLEAR_THRESHOLD_CM) {
        pivotTurnLeft(PWM_TURN_DUTY);
    } else if (rightDist > CLEAR_THRESHOLD_CM) {
        pivotTurnRight(PWM_TURN_DUTY);
    } else {
        reverseMotors(PWM_REVERSE_DUTY);    // Dead-end reverse
    }
}`,
        repo: 'https://github.com/hirusha-niluminda',
        demoNote: 'Demonstration video of autonomous obstacle steering and manual override.'
    },
    soil_rover: {
        badge: 'Team Project | In Development | University Final Year Project',
        title: 'Autonomous Soil Mapping Rover',
        subtitle: 'Dual Microcontroller Architecture & Automated Soil Sensor Insertion',
        architecture: `+-----------------------+           +-----------------------+
|  MCU 1: ESP32         |   UART    |  MCU 2: STM32 / Nano  |
|  - Rover Path Nav     |<=========>|  - Probe Stepper / Lin|
|  - GPS / Dead Reckon  | Inter-Bus |  - NPK / pH Sensors   |
|  - Wireless Telemetry |           |  - Depth Measurement  |
+-----------+-----------+           +-----------+-----------+
            |                                   |
            v                                   v
   [ 4WD Drive Motors ]              [ Motorized Probe Mechanism ]`,
        specs: [
            ['Multi-MCU Link', 'ESP32 coordinates navigation while dedicated secondary MCU manages probe deployment'],
            ['Probe Insertion', 'High-torque lead-screw / rack-and-pinion linear mechanism to penetrate soil depths'],
            ['Nutrient Sensing', 'Soil NPK / Moisture / pH multi-parameter soil probe array'],
            ['Firmware State', 'State-machine architecture handling automated stop, probe, read, and retract routines'],
            ['Key Challenge Solved', 'Coordinating dual MCU timing without missed serial packets and monitoring motor stall current during hard soil insertion.']
        ],
        firmwareDesc: 'Custom UART framing protocol syncing autonomous GPS mobility on ESP32 with stepper linear actuator insertion on secondary MCU.',
        firmwareSnippet: `// Dual-MCU Packet Protocol: Master Navigation <-> Sensor Actuator
struct RoverCommandPacket {
    uint8_t header;     // 0x55
    uint8_t cmdType;    // 0x01: PROBE_INSERT, 0x02: MEASURE_NPK
    uint16_t depthMm;   // Probe insertion depth parameter
    uint8_t crc;
};

void deploySoilProbe(uint16_t targetDepth) {
    RoverCommandPacket pkt = {0x55, 0x01, targetDepth, 0x00};
    pkt.crc = calculateCRC((uint8_t*)&pkt, sizeof(pkt) - 1);
    SerialProbeBus.write((uint8_t*)&pkt, sizeof(pkt));
    waitForProbeAcknowledgment();
}`,
        repo: 'https://github.com/hirusha-niluminda',
        demoNote: 'Mechanism simulation and automated sensor insertion test bench recording.'
    }
};

function renderModal() {
    const key = projectKeys[currentProjectIndex];
    const data = projectData[key];
    if (!data) return;

    document.getElementById('modalBadge').textContent = data.badge;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalSubtitle').textContent = data.subtitle;

    let specsHtml = data.specs.map(row => `
        <tr>
            <td>${row[0]}</td>
            <td>${row[1]}</td>
        </tr>
    `).join('');

    let bodyHtml = `
        <div class="tab-pane ${currentModalTab === 'arch' ? 'active' : ''}" id="tab-arch">
            <div class="modal-section">
                <h4><i class="fas fa-network-wired"></i> System Architecture & Signal Flow</h4>
                <pre class="arch-flow">${data.architecture}</pre>
            </div>
        </div>
        <div class="tab-pane ${currentModalTab === 'bom' ? 'active' : ''}" id="tab-bom">
            <div class="modal-section">
                <h4><i class="fas fa-microchip"></i> Hardware BOM & Component Specifications</h4>
                <table class="spec-table">
                    <tbody>${specsHtml}</tbody>
                </table>
            </div>
        </div>
        <div class="tab-pane ${currentModalTab === 'firmware' ? 'active' : ''}" id="tab-firmware">
            <div class="modal-section">
                <h4><i class="fas fa-code"></i> Core Firmware Logic & Algorithm</h4>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">${data.firmwareDesc}</p>
                <pre class="firmware-code-box"><code>${escapeHtml(data.firmwareSnippet)}</code></pre>
            </div>
        </div>
        <div class="tab-pane ${currentModalTab === 'demo' ? 'active' : ''}" id="tab-demo">
            <div class="modal-section">
                <h4><i class="fas fa-video"></i> Visual Proof & Field Testing</h4>
                
                <!-- Dynamic Image & Video Showcase -->
                <div class="modal-media-showcase" style="margin-bottom: 16px;">
                    <div style="margin-bottom: 12px; display: none;" id="modalImgContainer">
                        <img id="modalProjectImg" src="assets/projects/${key.replace('_', '-')}.jpg" 
                             alt="${data.title}" 
                             style="width: 100%; max-height: 280px; object-fit: contain; border-radius: 10px; border: 1px solid var(--border-accent); background: #070b12;" 
                             onload="document.getElementById('modalImgContainer').style.display='block'"
                             onerror="this.onerror=null; this.src='assets/projects/${key.replace('_', '-')}.png'; this.onload=function(){document.getElementById('modalImgContainer').style.display='block';}">
                    </div>
                    <div style="display: none;" id="modalVideoContainer">
                        <video id="modalProjectVideo" controls playsinline 
                               style="width: 100%; max-height: 280px; border-radius: 10px; border: 1px solid var(--border-accent); background: #000;" 
                               oncanplay="document.getElementById('modalVideoContainer').style.display='block'">
                            <source src="assets/projects/${key.replace('_', '-')}.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>

                <div style="background: rgba(0, 212, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                    <p style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 12px;">
                        <i class="fas fa-check-circle text-green" style="margin-right: 8px;"></i>
                        <strong>Recorded Artifact:</strong> ${data.demoNote}
                    </p>
                    ${data.liveUrl ? `
                    <div style="margin: 16px 0 14px; padding: 14px 18px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
                        <div>
                            <span style="font-weight: 700; color: #34d399; font-size: 0.9rem;"><i class="fas fa-bolt"></i> Live Firebase Web App Active</span>
                            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${data.liveUrl}</div>
                        </div>
                        <a href="${data.liveUrl}" target="_blank" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
                            Launch Dashboard <i class="fas fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                    ` : ''}
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                        High-definition bench test recordings, oscilloscope waveform captures, and KiCad PCB layout gerber packages are available upon request for technical review.
                    </p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalBody').innerHTML = bodyHtml;

    // Update Tab Buttons Active State
    document.querySelectorAll('.modal-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === currentModalTab);
    });

    const liveBtn = data.liveUrl ? `
        <a href="${data.liveUrl}" target="_blank" class="btn btn-primary" style="padding: 10px 18px; font-size: 0.85rem;">
            <i class="fas fa-arrow-up-right-from-square"></i> Open Live Dashboard
        </a>
    ` : '';

    document.getElementById('modalFooter').innerHTML = `
        ${liveBtn}
        <a href="${data.repo}" target="_blank" class="btn btn-outline" style="padding: 10px 18px; font-size: 0.85rem;">
            <i class="fab fa-github"></i> View GitHub Repo
        </a>
        <a href="mailto:hirushanilumindapc@gmail.com?subject=Technical Inquiry: ${encodeURIComponent(data.title)}" class="btn btn-outline" style="padding: 10px 18px; font-size: 0.85rem;">
            <i class="fas fa-envelope"></i> Request Full Technical Dossier
        </a>
    `;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function switchModalTab(tabKey) {
    currentModalTab = tabKey;
    document.querySelectorAll('.modal-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    const activePane = document.getElementById(`tab-${tabKey}`);
    if (activePane) activePane.classList.add('active');
}

function openProjectModal(key, initialTab) {
    const idx = projectKeys.indexOf(key);
    if (idx !== -1) currentProjectIndex = idx;
    currentModalTab = initialTab === 'demo' ? 'demo' : (initialTab === 'schematic' ? 'arch' : 'arch');
    renderModal();

    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function navigateProjectModal(direction) {
    currentProjectIndex = (currentProjectIndex + direction + projectKeys.length) % projectKeys.length;
    renderModal();
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// ===========================
// Project Category Filter Tabs
// ===========================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category') || '';
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
            }
        });
    });
});

// ===========================
// Interactive Terminal Engine
// ===========================
const terminalInput = document.getElementById('terminalInput');
const terminalHistory = document.getElementById('terminalHistory');
const terminalBody = document.getElementById('terminalBody');
const interactiveTerminal = document.getElementById('interactiveTerminal');

let cmdHistory = [];
let cmdHistoryIndex = -1;

const terminalCommands = {
    help: () => `
        <div class="terminal-output text-cyan">
            <strong>System Commands:</strong><br>
            • <span class="cmd-pill" onclick="runTerminalCmd('whoami')">whoami</span> : Profile identity and target focus<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('projects')">projects</span> : List all 6 engineering projects<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('skills')">skills</span> : Hardware, firmware, CAD & robotics stack<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('awards')">awards</span> : Hackathons and competition achievements<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('education')">education</span> : Academic background & diplomas<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('interests')">interests</span> : Technical domains & engineering interests<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('cv')">cv</span> : Download 2-page PDF resume<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('contact')">contact</span> : Email, phone, location & LinkedIn<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('clear')">clear</span> : Clear terminal screen<br>
            • <span class="cmd-pill" onclick="runTerminalCmd('matrix')">matrix</span> : Easter egg mode
        </div>
    `,
    whoami: () => `
        <div class="terminal-output">
            <strong>HIRUSHA NILUMINDA</strong><br>
            NDT Student — Electronics & Telecommunication Engineering<br>
            Institute of Technology, University of Moratuwa (ITUM)<br>
            <span class="text-green">Objective:</span> 6-month in-plant industrial training from January 2027.
        </div>
    `,
    projects: () => `
        <div class="terminal-output">
            <strong>ENGINEERING REPOSITORY:</strong><br>
            1. [PERSONAL / IN DEV] <a href="javascript:openProjectModal('weather_station')" style="color:var(--accent);">Multi-Sensor IoT Weather Station</a> — ESP32, MicroSD, 16x2 LCD, Firebase Web App (<a href="https://hirusha-weatherstation.web.app/" target="_blank" style="color:var(--accent); text-decoration:underline;">Live</a>)<br>
            2. [TEAM / IN DEV] <a href="javascript:openProjectModal('soil_rover')" style="color:var(--accent);">Autonomous Soil Mapping Rover</a> — Dual MCU + Automated Linear Probe<br>
            3. [TEAM / INCO 2026] <a href="javascript:openProjectModal('agri_robot')" style="color:var(--accent);">Autonomous Agricultural Robot</a> — Dead-reckoning, Seed/Fertilizer<br>
            4. [PERSONAL] <a href="javascript:openProjectModal('robotic_arm')" style="color:var(--accent);">4-DOF Robotic Arm</a> — Web UI + Dual Joysticks<br>
            5. [PERSONAL] <a href="javascript:openProjectModal('obstacle_car')" style="color:var(--accent);">Obstacle Avoiding Robot</a> — Sonar radar avoidance<br>
            6. [TEAM / AWARD] <a href="javascript:openProjectModal('greenhouse')" style="color:var(--accent);">Eco Smart Greenhouse</a> — ESP32, Firebase, Relays, Edge Impulse
        </div>
    `,
    skills: () => `
        <div class="terminal-output">
            <strong>TECHNICAL ARSENAL:</strong><br>
            • <b>Microcontrollers:</b> ESP32, Arduino, STM32, Raspberry Pi Pico W, ESP8266<br>
            • <b>Robotics & Control:</b> ROS 2 (Learning), Webots Simulation, Dead-Reckoning, Kinematics<br>
            • <b>Firmware:</b> C/C++, Arduino Core, Python (basic), Dart (basic)<br>
            • <b>Electronics:</b> Soldering, Sensor Interfacing, Motor Drivers, Relay Isolation, PCB Prototyping<br>
            • <b>IoT:</b> Blynk IoT, Google Firebase Realtime Database, ESP-NOW<br>
            • <b>Tools & CAD:</b> KiCad, SolidWorks, Fritzing, VS Code, PlatformIO
        </div>
    `,
    awards: () => `
        <div class="terminal-output">
            <strong>AWARDS & COMPETITIONS:</strong><br>
            🏆 <b>2nd Place:</b> Vertex 2025 Inter University Innovation Competition (Eco Smart Greenhouse - Team InnoX)<br>
            🤖 <b>Participant:</b> INCO Competition 2026 (Autonomous Agricultural Robot)<br>
            📜 <b>Certifications:</b> PLC Certificate (Sri Lanka Institute of Robotics), From Schematic to PCB (Coursera)
        </div>
    `,
    education: () => `
        <div class="terminal-output">
            <strong>EDUCATION:</strong><br>
            • <b>National Diploma in Technology (NDT):</b> Electronics & Telecommunication Engineering<br>
              Institute of Technology, University of Moratuwa (Present)<br>
            • <b>G.C.E. Advanced Level (2022):</b> Physical Science Stream<br>
              Henegama Central College (3 C passes)<br>
            • <b>G.C.E. Ordinary Level (2019):</b> Henegama Central College (8A 1C passes)
        </div>
    `,
    interests: () => `
        <div class="terminal-output">
            <strong>ENGINEERING INTERESTS:</strong><br>
            Embedded Systems Development | Robotics R&D | Firmware Architecture | PCB Design | Motion & Motor Control Systems | Industrial Automation & PLC
        </div>
    `,
    cv: () => {
        window.open('assets/Hirusha_Niluminda_CV.pdf', '_blank', 'noopener,noreferrer');
        return `
            <div class="terminal-output text-green">
                <i class="fas fa-arrow-up-right-from-square"></i> Opening Hirusha_Niluminda_CV.pdf in a new tab...
            </div>
        `;
    },
    contact: () => `
        <div class="terminal-output">
            <strong>CONTACT PROTOCOLS:</strong><br>
            • <b>Email:</b> <a href="mailto:hirushanilumindapc@gmail.com" style="color:var(--accent);">hirushanilumindapc@gmail.com</a><br>
            • <b>Phone:</b> <a href="tel:+94740824902" style="color:var(--accent);">+94 740824902</a><br>
            • <b>Location:</b> Kirindiwela, Sri Lanka<br>
            • <b>LinkedIn:</b> <a href="https://linkedin.com/in/hirusha-niluminda-41a738265" target="_blank" style="color:var(--accent);">hirusha-niluminda</a>
        </div>
    `,
    sudo: () => `
        <div class="terminal-output text-cyan">
            Nice try! Permission denied: Hirusha is the only root administrator here 😉
        </div>
    `,
    matrix: () => `
        <div class="terminal-output text-green" style="font-family: monospace;">
            01001000 01001110 00100000 01010010 01001111 01000010 01001111 01010100<br>
            &gt; WAKE UP, RECRUITER...<br>
            &gt; THE MATRIX HAS YOU.<br>
            &gt; HIRUSHA NILUMINDA IS READY FOR INTERNSHIP 2027.
        </div>
    `
};

function runTerminalCmd(rawCmd) {
    if (!rawCmd) return;
    const cmd = rawCmd.trim().toLowerCase();

    // Log the command entered
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="prompt">$</span> <span class="command">${escapeHtml(cmd)}</span>`;
    terminalHistory.appendChild(cmdLine);

    if (cmd === 'clear') {
        terminalHistory.innerHTML = '';
        if (terminalInput) terminalInput.value = '';
        return;
    }

    const handler = terminalCommands[cmd];
    const outDiv = document.createElement('div');

    if (handler) {
        outDiv.innerHTML = handler();
    } else {
        outDiv.className = 'terminal-output';
        outDiv.innerHTML = `Command not recognized: '<span style="color:#ff5f56;">${escapeHtml(cmd)}</span>'. Type <span class="cmd-pill" onclick="runTerminalCmd('help')">help</span> for all commands.`;
    }

    terminalHistory.appendChild(outDiv);
    if (terminalInput) terminalInput.value = '';

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = terminalInput.value.trim();
            if (val) {
                cmdHistory.push(val);
                cmdHistoryIndex = cmdHistory.length;
                runTerminalCmd(val);
            }
        } else if (e.key === 'ArrowUp') {
            if (cmdHistoryIndex > 0) {
                cmdHistoryIndex--;
                terminalInput.value = cmdHistory[cmdHistoryIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (cmdHistoryIndex < cmdHistory.length - 1) {
                cmdHistoryIndex++;
                terminalInput.value = cmdHistory[cmdHistoryIndex];
            } else {
                cmdHistoryIndex = cmdHistory.length;
                terminalInput.value = '';
            }
        }
    });

    if (interactiveTerminal) {
        interactiveTerminal.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
}

// Live Telemetry Jitter for Realism
setInterval(() => {
    const tempVal = document.querySelector('.hud-greenhouse .hud-metric:nth-child(1) .hud-val');
    if (tempVal) {
        const t = (27.2 + Math.random() * 0.5).toFixed(1);
        tempVal.textContent = t + '°C';
    }
    const sonarVal = document.querySelector('.sonar-distance b');
    if (sonarVal) {
        const dist = Math.floor(35 + Math.random() * 8);
        sonarVal.textContent = dist + ' cm';
    }
}, 3000);

// ===========================
// 3D Parallax Tilt Effect
// ===========================
function init3DTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

init3DTilt();

// ===========================
// Theme Accent Color Switcher
// ===========================
const themeDots = document.querySelectorAll('.theme-dot');

function applyTheme(themeName) {
    if (themeName === 'cyan') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', themeName);
    }

    themeDots.forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-theme') === themeName);
    });

    localStorage.setItem('hn-theme', themeName);
}

themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const theme = dot.getAttribute('data-theme');
        applyTheme(theme);
    });
});

// Load saved theme preference
const savedTheme = localStorage.getItem('hn-theme') || 'cyan';
applyTheme(savedTheme);

// ===========================
// Back-to-Top Rocket Button
// ===========================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}




