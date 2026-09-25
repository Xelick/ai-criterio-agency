// Pixel Art Canvas Engine: Office Architecture, Animated Characters & Interactive Camera
class PixelOfficeEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Virtual world dimensions (Expanded to fit all 86 agents with spacious aisles)
        this.worldWidth = 2000;
        this.worldHeight = 1200;
        
        // Camera state
        this.camera = {
            x: 0,
            y: 0,
            zoom: 0.95,
            targetZoom: 0.95,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0
        };

        this.agents = [];
        this.hoveredAgent = null;
        this.selectedAgent = null;
        this.currentFloor = 1;
        this.timeTick = 0;
        this.lastTime = performance.now();

        // Environment landmarks & interactive game props
        this.skyTime = 0.4;
        this.coffeeStation = { x: 95, y: 350 };
        this.waterCooler = { x: 95, y: 550 };
        this.arcadeMachine = { x: 95, y: 760 };
        this.serverBank = { x: 1880, y: 340 };
        this.sprintWhiteboard = { x: 1000, y: 960, w: 320, h: 80 };
        this.meetingTable = { x: 1000, y: 1050, w: 360, h: 100 };
        
        // Interactive Prop Toast / Floating HUD
        this.activeToast = null;
        this.toastTimer = 0;

        // Camera animation & Chain reaction state
        this.camAnim = null;
        this.chainActiveAgent = null;
        this.chainActiveSpeech = '';
        this.chainBeamSource = null;
        this.chainBeamTarget = null;

        this.initEventListeners();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        if (window.ResizeObserver && this.canvas.parentElement) {
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(this.canvas.parentElement);
        }
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        const container = this.canvas.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const w = Math.max(300, Math.floor(rect.width));
        const h = Math.max(300, Math.floor(rect.height));
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
            this.ctx.imageSmoothingEnabled = false; // Keep pixel crispness!
        }
    }

    getCanvasPoint(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = rect.width > 0 ? (this.canvas.width / rect.width) : 1;
        const scaleY = rect.height > 0 ? (this.canvas.height / rect.height) : 1;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    setAgents(agentsList, floor) {
        this.currentFloor = floor;
        this.agents = agentsList;
        // Center camera smoothly
        this.camera.x = Math.max(0, (this.worldWidth - this.canvas.width / this.camera.zoom) / 2);
        this.camera.y = 80;
    }

    initEventListeners() {
        // Pan with mouse drag
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.camera.isDragging = true;
                this.camera.dragStartX = e.clientX;
                this.camera.dragStartY = e.clientY;
            }
        });

        window.addEventListener('mousemove', (e) => {
            const canvasPoint = this.getCanvasPoint(e.clientX, e.clientY);

            if (this.camera.isDragging) {
                const dx = (e.clientX - this.camera.dragStartX) / this.camera.zoom;
                const dy = (e.clientY - this.camera.dragStartY) / this.camera.zoom;
                this.camera.x -= dx;
                this.camera.y -= dy;
                this.camera.dragStartX = e.clientX;
                this.camera.dragStartY = e.clientY;
                this.clampCamera();
            } else {
                // Raycast mouse to world coordinates to find hovered agent
                const worldPos = this.screenToWorld(canvasPoint.x, canvasPoint.y);
                this.checkHover(worldPos.x, worldPos.y);
            }
        });

        window.addEventListener('mouseup', () => {
            this.camera.isDragging = false;
        });

        // Zoom with wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const canvasPoint = this.getCanvasPoint(e.clientX, e.clientY);
            const preZoomWorld = this.screenToWorld(canvasPoint.x, canvasPoint.y);

            const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
            const newZoom = Math.min(2.5, Math.max(0.6, this.camera.zoom + zoomDelta));
            this.camera.zoom = newZoom;

            // Zoom toward mouse pointer with pixel-perfect anchor
            this.camera.x = preZoomWorld.x - canvasPoint.x / newZoom;
            this.camera.y = preZoomWorld.y - canvasPoint.y / newZoom;
            this.clampCamera();
        }, { passive: false });

        // Click on agent to select or interact with props
        this.canvas.addEventListener('click', (e) => {
            const canvasPoint = this.getCanvasPoint(e.clientX, e.clientY);
            const worldPos = this.screenToWorld(canvasPoint.x, canvasPoint.y);
            const clicked = this.getAgentAt(worldPos.x, worldPos.y);
            if (clicked) {
                this.selectedAgent = clicked;
                if (window.pixelAudio) window.pixelAudio.playAgentSelect();
                if (this.onAgentSelected) {
                    this.onAgentSelected(clicked);
                }
            } else {
                this.checkPropClick(worldPos.x, worldPos.y);
            }
        });

        // Keyboard navigation (WASD or Arrows)
        window.addEventListener('keydown', (e) => {
            const step = 40 / this.camera.zoom;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.camera.y -= step;
                this.clampCamera();
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.camera.y += step;
                this.clampCamera();
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.camera.x -= step;
                this.clampCamera();
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.camera.x += step;
                this.clampCamera();
            }
        });
    }

    screenToWorld(sx, sy) {
        return {
            x: sx / this.camera.zoom + this.camera.x,
            y: sy / this.camera.zoom + this.camera.y
        };
    }

    worldToScreen(wx, wy) {
        return {
            x: (wx - this.camera.x) * this.camera.zoom,
            y: (wy - this.camera.y) * this.camera.zoom
        };
    }

    clampCamera() {
        const viewW = this.canvas.width / this.camera.zoom;
        const viewH = this.canvas.height / this.camera.zoom;
        this.camera.x = Math.max(-100, Math.min(this.worldWidth - viewW + 100, this.camera.x));
        this.camera.y = Math.max(-60, Math.min(this.worldHeight - viewH + 60, this.camera.y));
    }

    checkHover(wx, wy) {
        const found = this.getAgentAt(wx, wy);
        if (found !== this.hoveredAgent) {
            this.hoveredAgent = found;
            this.canvas.style.cursor = found ? 'pointer' : (this.camera.isDragging ? 'grabbing' : 'default');
            if (found && window.pixelAudio) {
                window.pixelAudio.playClick();
            }
        }
    }

    getAgentAt(wx, wy) {
        for (let i = this.agents.length - 1; i >= 0; i--) {
            const a = this.agents[i];
            const ax = a.currentX;
            const ay = a.currentY;
            // Symmetrical hitbox around agent sprite and desk:
            // Desk width is 50px [-25, +25], character width is 18px [-9, +9]
            // Character height is [-26, +14], desk height is [-10, +16]
            if (wx >= ax - 26 && wx <= ax + 26 && wy >= ay - 28 && wy <= ay + 22) {
                return a;
            }
        }
        return null;
    }

    smoothPanTo(targetX, targetY, targetZoom = null, durationMs = 700, callback = null) {
        this.camAnim = {
            startX: this.camera.x,
            startY: this.camera.y,
            startZoom: this.camera.zoom,
            targetX: targetX,
            targetY: targetY,
            targetZoom: targetZoom || this.camera.zoom,
            startTime: performance.now(),
            duration: durationMs,
            callback: callback
        };
    }

    focusOnAgent(agent, smooth = true, zoom = 1.5, callback = null) {
        if (!agent) return;
        this.selectedAgent = agent;
        const targetZoom = zoom || this.camera.zoom;
        const targetX = agent.currentX - (this.canvas.width / targetZoom) / 2;
        const targetY = agent.currentY - (this.canvas.height / targetZoom) / 2;
        
        if (smooth) {
            this.smoothPanTo(targetX, targetY, targetZoom, 750, callback);
        } else {
            this.camera.zoom = targetZoom;
            this.camera.x = targetX;
            this.camera.y = targetY;
            this.clampCamera();
            if (callback) callback();
        }
    }

    // Main animation loop
    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        this.timeTick += 0.05;

        // Process smooth camera animation
        if (this.camAnim) {
            const elapsed = timestamp - this.camAnim.startTime;
            const progress = Math.min(1, Math.max(0, elapsed / this.camAnim.duration));
            // easeInOutCubic curve
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            this.camera.x = this.camAnim.startX + (this.camAnim.targetX - this.camAnim.startX) * ease;
            this.camera.y = this.camAnim.startY + (this.camAnim.targetY - this.camAnim.startY) * ease;
            this.camera.zoom = this.camAnim.startZoom + (this.camAnim.targetZoom - this.camAnim.startZoom) * ease;
            this.clampCamera();

            if (progress >= 1) {
                const cb = this.camAnim.callback;
                this.camAnim = null;
                if (cb) cb();
            }
        }

        this.updateAgents(dt);
        this.render();

        requestAnimationFrame(this.loop);
    }

    updateAgents(dt) {
        const t = this.timeTick;
        this.agents.forEach((a, idx) => {
            // Autonomous behaviors: working, coffee break, stretching
            if (!a.wanderWait) a.wanderWait = 100 + (idx * 27) % 300;
            a.wanderWait -= 0.2;

            if (a.wanderWait <= 0) {
                if (a.state === 'working') {
                    // Decide next action: 70% keep working, 20% go to coffee/water, 10% chat
                    const dice = Math.random();
                    if (dice < 0.25) {
                        a.state = 'walking';
                        // Walk to coffee machine or water cooler or meeting table
                        const dest = Math.random() < 0.5 ? this.coffeeStation : this.waterCooler;
                        a.wanderTarget = {
                            x: dest.x + 30 + (Math.random() * 40 - 20),
                            y: dest.y + (Math.random() * 30 - 15)
                        };
                    } else if (dice < 0.45) {
                        // Short stretch
                        a.state = 'walking';
                        a.wanderTarget = {
                            x: a.deskX + (Math.random() * 60 - 30),
                            y: a.deskY + (Math.random() * 40 - 20)
                        };
                    }
                    a.wanderWait = 200 + Math.random() * 400;
                } else {
                    // Walk back to desk
                    a.state = 'walking';
                    a.wanderTarget = { x: a.deskX, y: a.deskY };
                    a.wanderWait = 250 + Math.random() * 500;
                }
            }

            // Move towards target if walking
            if (a.state === 'walking' && a.wanderTarget) {
                const dx = a.wanderTarget.x - a.currentX;
                const dy = a.wanderTarget.y - a.currentY;
                const dist = Math.hypot(dx, dy);

                if (dist > 3) {
                    const speed = 40 * dt;
                    a.currentX += (dx / dist) * Math.min(speed, dist);
                    a.currentY += (dy / dist) * Math.min(speed, dist);
                    a.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
                    a.isWalking = true;
                } else {
                    a.currentX = a.wanderTarget.x;
                    a.currentY = a.wanderTarget.y;
                    a.isWalking = false;
                    if (Math.hypot(a.currentX - a.deskX, a.currentY - a.deskY) < 5) {
                        a.state = 'working';
                    }
                }
            } else {
                a.isWalking = false;
            }
        });
    }

    render() {
        const ctx = this.ctx;
        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply Camera Transform
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        // 1. Draw Office Floor Environment
        this.renderOfficeEnvironment();

        // 2. Draw Furniture & Equipment (Desks, Server Racks, Water Coolers, Plants)
        this.renderFurniture();

        // 3. Draw All Agents
        this.renderAgents();

        // 4. Draw Floating UI on Canvas (Thought bubbles, Highlights, Selection Rings)
        this.renderCanvasOverlays();

        ctx.restore();

        // 5. Draw Screen-Space HUD (Minimap, Floor Watermark)
        this.renderMinimap();
    }

    renderOfficeEnvironment() {
        const ctx = this.ctx;
        const fl = this.currentFloor;

        // Background color & floor palettes per floor theme (Game Dev Aesthetic)
        const floorPalettes = {
            1: { floor: '#1e2430', tile: '#252d3d', wall: '#151922', trim: '#f59e0b', banner: 'AI_CRITERIO LOBBY & GROWTH NEXUS' },
            2: { floor: '#080d1e', tile: '#0f172a', wall: '#040711', trim: '#00f0ff', banner: 'TECH CORE, CYBER DEFENSE & QA RIG' },
            3: { floor: '#2a1725', tile: '#3b2034', wall: '#1a0e17', trim: '#ff007f', banner: 'CREATIVE DESIGN & GAME DEV STUDIO' },
            4: { floor: '#0d2226', tile: '#133036', wall: '#071417', trim: '#10b981', banner: 'DEEP RESEARCH, DATA SCIENCE & GIS LAB' },
            5: { floor: '#24140e', tile: '#382017', wall: '#140b07', trim: '#eab308', banner: 'EXECUTIVE PENTHOUSE & STRATEGY BOARDROOM' }
        };

        const pal = floorPalettes[fl] || floorPalettes[1];

        // 1. Floor base
        ctx.fillStyle = pal.floor;
        ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

        // 2. Decorative Floor Texture
        const tileSize = 40;
        ctx.fillStyle = pal.tile;
        for (let x = 30; x < this.worldWidth - 30; x += tileSize) {
            for (let y = 110; y < this.worldHeight - 30; y += tileSize) {
                if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
                    ctx.fillRect(x, y, tileSize, tileSize);
                }
            }
        }

        // Special Floor Details per Theme
        if (fl === 1) {
            // Central Red & Gold carpet runner along main corridor
            ctx.fillStyle = 'rgba(180, 83, 9, 0.2)';
            ctx.fillRect(940, 115, 120, this.worldHeight - 150);
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1;
            ctx.strokeRect(940, 115, 120, this.worldHeight - 150);
        } else if (fl === 2) {
            // Cyberpunk glowing data bus lines connecting server racks to dev pods
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            // Horizontal bus lines
            [250, 420, 590, 760].forEach(busY => {
                ctx.moveTo(230, busY);
                ctx.lineTo(1860, busY);
            });
            // Vertical trunk lines
            ctx.moveTo(960, 150);
            ctx.lineTo(960, 850);
            ctx.moveTo(1860, 200);
            ctx.lineTo(1860, 700);
            ctx.stroke();
        } else if (fl === 3) {
            // Creative colorful area rugs under collaborative pods
            const rugs = [
                { x: 380, y: 350, r: 85, color: 'rgba(236, 72, 153, 0.15)' },
                { x: 920, y: 350, r: 85, color: 'rgba(56, 189, 248, 0.15)' },
                { x: 650, y: 620, r: 90, color: 'rgba(245, 158, 11, 0.15)' }
            ];
            rugs.forEach(rug => {
                ctx.fillStyle = rug.color;
                ctx.beginPath();
                ctx.arc(rug.x, rug.y, rug.r, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // 3. Top Wall with Skyline Windows
        ctx.fillStyle = pal.wall;
        ctx.fillRect(0, 0, this.worldWidth, 110);

        // Panoramic Windows overlooking Pixel Skyline (11 windows across 2000px)
        const numWindows = 11;
        const winWidth = 125;
        const winGap = 45;
        const winStartX = 55;

        for (let i = 0; i < numWindows; i++) {
            const wx = winStartX + i * (winWidth + winGap);
            this.drawPixelWindow(wx, 15, winWidth, 75, fl);
        }

        // 4. Room partitions & department borders (Retro Bevel Wall)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 110, this.worldWidth - 60, this.worldHeight - 140);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(34, 114, this.worldWidth - 68, this.worldHeight - 148);

        // 5. Floor Banner Signboard (Neon Pixel Art)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(this.worldWidth / 2 - 300, 92, 600, 28);
        ctx.strokeStyle = pal.trim;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.worldWidth / 2 - 300, 92, 600, 28);

        ctx.fillStyle = pal.trim;
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`★ PISO ${fl} — ${pal.banner} ★`, this.worldWidth / 2, 111);
    }

    drawPixelWindow(x, y, w, h, floor) {
        const ctx = this.ctx;
        // Window frame
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y, w, h);

        // Sky gradient based on floor / time
        const skyGrad = ctx.createLinearGradient(x, y, x, y + h);
        if (floor === 5) {
            // Penthouse luxury twilight sky
            skyGrad.addColorStop(0, '#1e1b4b');
            skyGrad.addColorStop(0.5, '#4c1d95');
            skyGrad.addColorStop(1, '#be185d');
        } else if (floor === 2) {
            // Cyber blue digital night
            skyGrad.addColorStop(0, '#020617');
            skyGrad.addColorStop(1, '#0f172a');
        } else {
            // Daytime metropolis
            skyGrad.addColorStop(0, '#0284c7');
            skyGrad.addColorStop(0.7, '#38bdf8');
            skyGrad.addColorStop(1, '#bae6fd');
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

        // Pixel Skyline silhouettes
        ctx.fillStyle = '#090d16';
        const bldCount = 6;
        const bldW = (w - 6) / bldCount;
        for (let b = 0; b < bldCount; b++) {
            const bh = 15 + ((b * 37 + x) % 35);
            const bx = x + 3 + b * bldW;
            const by = y + h - 3 - bh;
            ctx.fillRect(bx, by, bldW, bh);

            // Twinkling yellow/cyan window dots on buildings
            ctx.fillStyle = (Math.sin(this.timeTick + b + x) > 0) ? '#fef08a' : '#38bdf8';
            if (bh > 20) {
                ctx.fillRect(bx + 4, by + 6, 3, 3);
                ctx.fillRect(bx + 11, by + 12, 3, 3);
            }
            ctx.fillStyle = '#090d16';
        }

        // Window pane grid lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + 3);
        ctx.lineTo(x + w / 2, y + h - 3);
        ctx.moveTo(x + 3, y + h / 2);
        ctx.lineTo(x + w - 3, y + h / 2);
        ctx.stroke();
    }

    renderFurniture() {
        const ctx = this.ctx;
        const fl = this.currentFloor;

        // 1. AI_Criterio Coffee Bar / Break Zone (Left side)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 270, 120, 180);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 270, 120, 180);

        // Espresso Coffee Machine
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(60, 305, 36, 24);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(66, 319, 10, 8); // Coffee mug
        // Steam animation
        const steamY = 295 - (this.timeTick * 4 % 15);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(70, steamY, 3, 3);
        ctx.fillRect(72, steamY - 4, 3, 3);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AI CAFÉ ☕', 100, 292);

        // Coffee menu chalkboard
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(50, 345, 100, 90);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 345, 100, 90);
        ctx.fillStyle = '#fde047';
        ctx.font = '8px monospace';
        ctx.fillText('MENU BOGOTÁ', 100, 360);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '7px monospace';
        ctx.fillText('• Tinto Criterio', 100, 375);
        ctx.fillText('• Espresso 100%', 100, 390);
        ctx.fillText('• Carta Viva $200k', 100, 405);
        ctx.fillText('• Catálogo $400k', 100, 420);

        // 2. Water Cooler (Left side)
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(75, 510, 22, 24); // Bottle
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(72, 534, 28, 32); // Base
        // Water bubbles
        if (Math.sin(this.timeTick * 2) > 0.4) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(83, 520, 4, 4);
        }

        // 3. Retro Arcade Machine ("PIXEL FIGHTER 1997" - Game Dev Zone)
        this.drawArcadeMachine(60, 680);

        // 4. Potted Pixel Plants in corners and along walkways
        this.drawPixelPlant(50, 140);
        this.drawPixelPlant(this.worldWidth - 70, 140);
        this.drawPixelPlant(50, this.worldHeight - 80);
        this.drawPixelPlant(this.worldWidth - 70, this.worldHeight - 80);
        this.drawPixelPlant(930, 140);
        this.drawPixelPlant(1070, 140);

        // 5. Floor-specific highlights
        if (fl === 2) {
            // Datacenter Server Racks on right side (5 server racks with pulsing LEDs)
            for (let r = 0; r < 5; r++) {
                this.drawServerRack(this.worldWidth - 110, 190 + r * 105);
            }
            // QA Mobile Testing Bench
            this.drawQATestRig(this.worldWidth - 130, 730);
        } else if (fl === 5) {
            // Penthouse Presidential Meeting Table
            this.drawExecutiveBoardroomTable(this.worldWidth / 2 - 170, 930, 340, 110);
        } else {
            // Sprint Whiteboard & Brainstorm Pod
            this.drawSprintWhiteboard(this.worldWidth / 2 - 160, 890, 320, 80);
            this.drawMeetingPod(this.worldWidth / 2 - 140, 990, 280, 95);
        }
    }

    drawArcadeMachine(x, y) {
        const ctx = this.ctx;
        // Cabinet outer frame
        ctx.fillStyle = '#4c1d95';
        ctx.fillRect(x, y, 60, 90);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 60, 90);

        // Marquee
        ctx.fillStyle = '#db2777';
        ctx.fillRect(x + 4, y + 4, 52, 16);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PIXEL FIGHT', x + 30, y + 15);

        // Screen (Animated fighting pixel sprites!)
        ctx.fillStyle = '#050811';
        ctx.fillRect(x + 6, y + 24, 48, 34);

        // Health bars
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x + 8, y + 27, 18, 3);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 34, y + 27, 18, 3);

        // Fighter 1 (blue) and Fighter 2 (red)
        const punchOffset = Math.sin(this.timeTick * 8) > 0 ? 3 : 0;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 14 + punchOffset, y + 37, 6, 12); // P1
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(x + 38 - punchOffset, y + 37, 6, 12); // P2

        // Control Panel
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(x + 4, y + 62, 52, 14);
        // Joystick
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x + 16, y + 68, 3, 0, Math.PI * 2);
        ctx.fill();
        // Buttons
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 28, y + 66, 3, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 35, y + 66, 3, 3);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x + 42, y + 66, 3, 3);

        // Coin slot
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 26, y + 80, 8, 4);
    }

    drawSprintWhiteboard(x, y, w, h) {
        const ctx = this.ctx;
        // Board surface
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // Columns: TODO | IN PROGRESS | DONE
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w / 3, y);
        ctx.lineTo(x + w / 3, y + h);
        ctx.moveTo(x + (2 * w) / 3, y);
        ctx.lineTo(x + (2 * w) / 3, y + h);
        ctx.stroke();

        // Titles
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('POR HACER', x + w / 6, y + 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('EN CURSO', x + w / 2, y + 12);
        ctx.fillStyle = '#10b981';
        ctx.fillText('LISTO (DONE)', x + (5 * w) / 6, y + 12);

        // Post-it notes
        // TODO post-its
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 12, y + 20, 22, 16);
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(x + 40, y + 24, 22, 16);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(x + 16, y + 44, 24, 16);

        // IN PROGRESS post-its
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + w / 3 + 15, y + 22, 24, 16);
        ctx.fillStyle = '#bbf7d0';
        ctx.fillRect(x + w / 3 + 45, y + 36, 24, 16);

        // DONE post-its
        ctx.fillStyle = '#bbf7d0';
        ctx.fillRect(x + (2 * w) / 3 + 14, y + 20, 26, 16);
        ctx.fillRect(x + (2 * w) / 3 + 46, y + 26, 26, 16);
        ctx.fillRect(x + (2 * w) / 3 + 24, y + 46, 26, 16);

        // Frame Stand legs
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 20, y + h, 6, 18);
        ctx.fillRect(x + w - 26, y + h, 6, 18);
    }

    drawQATestRig(x, y) {
        const ctx = this.ctx;
        // Rig table
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, 80, 50);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, 80, 50);

        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('QA MOBILE RIG', x + 40, y + 12);

        // 3 Phone screens running menus
        for (let i = 0; i < 3; i++) {
            const px = x + 10 + i * 22;
            const py = y + 18;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px, py, 16, 26);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            ctx.strokeRect(px, py, 16, 26);
            // Screen content
            ctx.fillStyle = i === 0 ? '#f59e0b' : (i === 1 ? '#38bdf8' : '#22c55e');
            ctx.fillRect(px + 2, py + 3, 12, 18);
        }
    }

    drawPixelPlant(x, y) {
        const ctx = this.ctx;
        // Pot
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x + 4, y + 16, 16, 16);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 2, y + 14, 20, 4);
        // Foliage
        ctx.fillStyle = '#15803d';
        ctx.fillRect(x, y + 4, 10, 10);
        ctx.fillRect(x + 14, y + 2, 10, 12);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x + 6, y, 12, 12);
    }

    drawServerRack(x, y) {
        const ctx = this.ctx;
        // Rack casing
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y, 55, 85);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 55, 85);

        // Blinking LEDs
        for (let unit = 0; unit < 6; unit++) {
            const uy = y + 7 + unit * 12;
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x + 4, uy, 47, 9);
            // LED indicators
            const led1 = (Math.sin(this.timeTick * 3 + unit) > 0) ? '#22c55e' : '#14532d';
            const led2 = (Math.sin(this.timeTick * 4 + unit * 1.5) > 0) ? '#38bdf8' : (unit === 3 ? '#ef4444' : '#0369a1');
            ctx.fillStyle = led1;
            ctx.fillRect(x + 8, uy + 3, 4, 3);
            ctx.fillStyle = led2;
            ctx.fillRect(x + 16, uy + 3, 4, 3);
        }
    }

    drawExecutiveBoardroomTable(x, y, w, h) {
        const ctx = this.ctx;
        // Polished Mahogany Table
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // Center Holographic Projection
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, 70, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CRITERIO AI MAESTRO', x + w / 2, y + h / 2 + 4);
    }

    drawMeetingPod(x, y, w, h) {
        const ctx = this.ctx;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('REUNIONES & SPRINT COLLAB', x + w / 2, y + h / 2 + 4);
    }

    checkPropClick(wx, wy) {
        // 1. Arcade Machine
        if (wx >= 50 && wx <= 130 && wy >= 670 && wy <= 780) {
            if (window.pixelAudio && window.pixelAudio.playArcadeCoin) window.pixelAudio.playArcadeCoin();
            this.showToast('🕹️ ¡PIXEL FIGHTER 1997! High Score: CRITERIO AI (99,999 pts)', '#ec4899');
            this.attractNearbyAgent(90, 720, 'arcade');
            return true;
        }
        // 2. Coffee Bar
        if (wx >= 40 && wx <= 165 && wy >= 270 && wy <= 450) {
            if (window.pixelAudio && window.pixelAudio.playCoffeeBrew) window.pixelAudio.playCoffeeBrew();
            this.showToast('☕ ¡Espresso Doble preparado para Criterio AI! (+50% Velocidad de Ejecución)', '#f59e0b');
            this.attractNearbyAgent(90, 330, 'coffee');
            return true;
        }
        // 3. Server Racks (Right side)
        if (wx >= 1840 && wx <= 1960 && wy >= 180 && wy <= 710) {
            if (window.pixelAudio && window.pixelAudio.playServerPing) window.pixelAudio.playServerPing();
            this.showToast('🖥️ TELEMETRÍA SERVIDORES: 99.99% Uptime • /briefing/ Detectado • 0 Errores', '#00f0ff');
            return true;
        }
        // 4. Sprint Whiteboard / Meeting Table
        if (wx >= 800 && wx <= 1260 && wy >= 880 && wy <= 1080) {
            if (window.pixelAudio) window.pixelAudio.playClick();
            this.showToast('📋 SPRINT 14 DÍAS BOGOTÁ: 116 Restaurantes • Catálogos $400k • Carta Viva $200k', '#10b981');
            const tfModal = document.getElementById('taskforceModal');
            if (tfModal) tfModal.classList.remove('hidden');
            return true;
        }
        // 5. Water Cooler
        if (wx >= 65 && wx <= 115 && wy >= 500 && wy <= 570) {
            if (window.pixelAudio && window.pixelAudio.playWaterBubble) window.pixelAudio.playWaterBubble();
            this.showToast('💧 Pausa de hidratación: 100% Energía para el equipo', '#38bdf8');
            this.attractNearbyAgent(85, 530, 'water');
            return true;
        }
        return false;
    }

    attractNearbyAgent(destX, destY, reason) {
        // Find nearest working agent to landmark
        let closest = null;
        let minDist = 99999;
        this.agents.forEach(a => {
            if (a.state === 'working') {
                const dist = Math.hypot(a.currentX - destX, a.currentY - destY);
                if (dist < minDist) {
                    minDist = dist;
                    closest = a;
                }
            }
        });
        if (closest) {
            closest.state = 'walking';
            closest.wanderTarget = { x: destX + (Math.random() * 20 - 10), y: destY + (Math.random() * 20 - 10) };
            closest.wanderWait = 220;
        }
    }

    showToast(message, color = '#f59e0b') {
        this.activeToast = { message, color, time: 220 };
    }

    renderAgents() {
        const ctx = this.ctx;
        // First draw all desk surfaces
        this.agents.forEach(a => {
            this.drawDesk(a.deskX, a.deskY, a);
        });

        // Then sort agents by currentY for correct isometric/2D depth layering
        const sorted = [...this.agents].sort((a, b) => a.currentY - b.currentY);
        sorted.forEach(a => {
            this.drawAgentSprite(a);
        });
    }

    drawDesk(x, y, agent) {
        const ctx = this.ctx;
        const isFacingUp = (agent.facing === 'up');

        // Desk surface (wood/metal slate finish)
        ctx.fillStyle = '#334155';
        ctx.fillRect(x - 24, y - 10, 50, 26);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - 24, y - 10, 50, 26);

        if (isFacingUp) {
            // Monitor on top of desk
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x - 13, y - 17, 24, 13);
            ctx.fillStyle = agent.color || '#38bdf8';
            ctx.fillRect(x - 11, y - 15, 20, 9);
            // Keyboard
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(x - 9, y + 2, 16, 5);
            // Chair back below desk
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x - 11, y + 16, 20, 10);
        } else {
            // Monitor at bottom of desk (facing agent who is seated above)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x - 13, y + 5, 24, 13);
            ctx.fillStyle = agent.color || '#38bdf8';
            ctx.fillRect(x - 11, y + 7, 20, 9);
            // Keyboard
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(x - 9, y - 4, 16, 5);
            // Chair back above desk
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x - 11, y - 20, 20, 10);
        }
    }

    drawAgentSprite(a) {
        const ctx = this.ctx;
        const x = Math.round(a.currentX);
        const y = Math.round(a.currentY);
        const sp = a.sprite || {};
        const isChainActive = (this.chainActiveAgent && this.chainActiveAgent.id === a.id);
        const isSelected = (this.selectedAgent && this.selectedAgent.id === a.id);
        const isHovered = (this.hoveredAgent && this.hoveredAgent.id === a.id);

        // Highlight ring if chain active, hovered or selected
        if (isChainActive) {
            // Intense pulsing electric aura
            const pulse = 24 + Math.sin(this.timeTick * 8) * 6;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, pulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, pulse + 4, 0, Math.PI * 2);
            ctx.stroke();

            // Lightning icon above head
            ctx.fillStyle = '#fde047';
            ctx.font = '16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', x, y - 36 + Math.sin(this.timeTick * 10) * 3);
        } else if (isSelected) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.stroke();

            // Crown or Star over selected
            ctx.fillStyle = '#f59e0b';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('▼', x, y - 32);
        } else if (a.isTaskforce) {
            // Taskforce Active badge
            ctx.fillStyle = '#ef4444';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('🔥', x, y - 28);
        } else if (isHovered) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - 18, y - 26, 36, 42);
        }

        // Bobbing animation
        const bob = a.isWalking ? Math.sin(this.timeTick * 12) * 2 : Math.sin(this.timeTick * 2 + (x % 10)) * 1;
        const charY = y + bob;

        // Shadow under character
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(x, y + 12, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs / Pants
        ctx.fillStyle = '#1e293b';
        if (a.isWalking) {
            const stride = Math.sin(this.timeTick * 12) * 4;
            ctx.fillRect(x - 5 + stride, charY + 5, 4, 7);
            ctx.fillRect(x + 1 - stride, charY + 5, 4, 7);
        } else {
            ctx.fillRect(x - 5, charY + 5, 4, 7);
            ctx.fillRect(x + 1, charY + 5, 4, 7);
        }

        // Torso / Shirt
        ctx.fillStyle = sp.shirt_color || a.color || '#3b82f6';
        ctx.fillRect(x - 7, charY - 6, 14, 12);

        // Arms (typing if at desk, swinging if walking)
        ctx.fillStyle = sp.skin_color || '#ffd7ba';
        if (a.state === 'working' && !a.isWalking) {
            // Hands reaching to keyboard
            ctx.fillRect(x - 9, charY - 2, 3, 8);
            ctx.fillRect(x + 6, charY - 2, 3, 8);
        } else if (a.isWalking) {
            const armSwing = Math.sin(this.timeTick * 12) * 3;
            ctx.fillRect(x - 9, charY - 4 - armSwing, 3, 8);
            ctx.fillRect(x + 6, charY - 4 + armSwing, 3, 8);
        } else {
            ctx.fillRect(x - 9, charY - 4, 3, 8);
            ctx.fillRect(x + 6, charY - 4, 3, 8);
        }

        // Head / Skin
        ctx.fillStyle = sp.skin_color || '#ffd7ba';
        ctx.fillRect(x - 6, charY - 18, 12, 12);

        // Face features (Eyes)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - 4, charY - 14, 2, 3);
        ctx.fillRect(x + 2, charY - 14, 2, 3);

        // Hair
        ctx.fillStyle = sp.hair_color || '#2d1b00';
        const hairStyle = sp.hair_style || 'short';
        if (hairStyle === 'curly' || hairStyle === 'afro') {
            ctx.fillRect(x - 8, charY - 22, 16, 8);
        } else if (hairStyle === 'long' || hairStyle === 'ponytail') {
            ctx.fillRect(x - 7, charY - 21, 14, 7);
            ctx.fillRect(x + 5, charY - 14, 3, 10);
        } else if (hairStyle === 'spiky') {
            ctx.fillRect(x - 6, charY - 22, 12, 6);
            ctx.fillRect(x - 3, charY - 24, 6, 3);
        } else if (hairStyle === 'beanie') {
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(x - 7, charY - 22, 14, 8);
        } else {
            // Classic short
            ctx.fillRect(x - 7, charY - 20, 14, 6);
        }

        // Accessory
        if (sp.accessory === 'glasses') {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - 5, charY - 15, 4, 4);
            ctx.strokeRect(x + 1, charY - 15, 4, 4);
        } else if (sp.accessory === 'headset') {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(x - 8, charY - 16, 2, 6);
            ctx.fillRect(x + 6, charY - 16, 2, 6);
            ctx.fillRect(x - 7, charY - 22, 14, 2);
        }
    }

    renderCanvasOverlays() {
        const ctx = this.ctx;

        // 1. Render Hover Card if an agent is hovered
        if (this.hoveredAgent) {
            const a = this.hoveredAgent;
            const hx = a.currentX;
            const hy = a.currentY - 45;

            // Tooltip box
            ctx.font = 'bold 11px monospace';
            const nameWidth = ctx.measureText(a.name).width;
            const boxW = Math.max(160, nameWidth + 30);
            const boxH = 46;
            const bx = hx - boxW / 2;
            const by = hy - boxH;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
            ctx.fillRect(bx, by, boxW, boxH);
            ctx.strokeStyle = a.color || '#38bdf8';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx, by, boxW, boxH);

            // Agent Name
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(`${a.emoji} ${a.name}`, hx, by + 18);

            // Department badge
            ctx.fillStyle = a.color || '#38bdf8';
            ctx.font = '9px monospace';
            ctx.fillText(`[${a.department_name}]`, hx, by + 34);
        }

        // 2. Periodic Thought Bubbles for working agents
        this.agents.forEach((a, i) => {
            // Show thought bubble intermittently
            const showThought = (Math.sin(this.timeTick + i * 2.3) > 0.85);
            if (showThought && a !== this.hoveredAgent) {
                const tx = a.currentX + 14;
                const ty = a.currentY - 32;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(tx, ty, 30, 18);
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1;
                ctx.strokeRect(tx, ty, 30, 18);

                // Small connector circles
                ctx.fillRect(tx - 4, ty + 12, 3, 3);
                ctx.fillRect(tx - 7, ty + 16, 2, 2);

                // Icon or Mini Emoji
                ctx.fillStyle = '#0f172a';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                const icons = [a.emoji, '⚡', '☕', '💡', '📈', '🧠', '💼'];
                ctx.fillText(icons[i % icons.length], tx + 15, ty + 13);
            }
        });

        // 3. Chain Reaction Active Speech Bubble
        if (this.chainActiveAgent && this.chainActiveSpeech) {
            const ca = this.chainActiveAgent;
            if (this.agents.some(ag => ag.id === ca.id)) {
                const cx = ca.currentX;
                const cy = ca.currentY - 48;
                ctx.font = 'bold 11px monospace';
                const textW = ctx.measureText(this.chainActiveSpeech).width;
                const bW = Math.max(130, textW + 26);
                const bH = 28;
                const bX = cx - bW / 2;
                const bY = cy - bH;

                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(bX - 2, bY - 2, bW + 4, bH + 4);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(bX, bY, bW, bH);
                ctx.strokeStyle = '#fde047';
                ctx.lineWidth = 2;
                ctx.strokeRect(bX, bY, bW, bH);

                // Connector arrow
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.moveTo(cx - 6, cy);
                ctx.lineTo(cx + 6, cy);
                ctx.lineTo(cx, cy + 8);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(this.chainActiveSpeech, cx, bY + 18);
            }
        }

        // 4. Floating Interactive Prop Toast Notification (8-bit Game HUD)
        if (this.activeToast && this.activeToast.time > 0) {
            const toast = this.activeToast;
            const alpha = Math.min(1, toast.time / 30);
            ctx.save();
            ctx.globalAlpha = alpha;

            ctx.font = 'bold 12px monospace';
            const tw = ctx.measureText(toast.message).width;
            const tBoxW = Math.max(340, tw + 40);
            const tBoxH = 34;
            const tX = this.worldWidth / 2 - tBoxW / 2;
            const tY = 135;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
            ctx.fillRect(tX, tY, tBoxW, tBoxH);
            ctx.strokeStyle = toast.color || '#f59e0b';
            ctx.lineWidth = 2;
            ctx.strokeRect(tX, tY, tBoxW, tBoxH);

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(toast.message, this.worldWidth / 2, tY + 22);

            ctx.restore();
            toast.time--;
        }
    }

    renderMinimap() {
        const ctx = this.ctx;
        const mmW = 180;
        const mmH = 110;
        const mmX = this.canvas.width - mmW - 20;
        const mmY = this.canvas.height - mmH - 20;

        // Minimap container
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(mmX, mmY, mmW, mmH);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(mmX, mmY, mmW, mmH);

        // Minimap Title
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`MINIMAP - PISO ${this.currentFloor}`, mmX + 6, mmY + 12);

        // Scale factors
        const scaleX = mmW / this.worldWidth;
        const scaleY = mmH / this.worldHeight;

        // Draw agent dots on minimap
        this.agents.forEach(a => {
            ctx.fillStyle = a.color || '#38bdf8';
            ctx.fillRect(mmX + a.currentX * scaleX, mmY + a.currentY * scaleY, 2.5, 2.5);
        });

        // Viewport bounding rectangle
        const vpX = mmX + this.camera.x * scaleX;
        const vpY = mmY + this.camera.y * scaleY;
        const vpW = (this.canvas.width / this.camera.zoom) * scaleX;
        const vpH = (this.canvas.height / this.camera.zoom) * scaleY;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.strokeRect(vpX, vpY, vpW, vpH);
    }
}

window.PixelOfficeEngine = PixelOfficeEngine;
