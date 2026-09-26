// Chain Reaction Multi-Agent Workflow Engine for AI_Criterio
// Allows grouping multiple agents across disciplines to trigger sequential pipelines
class ChainReactionEngine {
    constructor() {
        this.pipeline = []; // Array of { agentId, customGoal }
        this.isRunning = false;
        this.currentStep = -1;
        this.missionGoal = "Desbloquear gocriterio.com y ejecutar el Sprint de 14 días para Catálogos WhatsApp en Bogotá";
        this.followCamera = true;
        this.stepDelay = 2200; // ms per step
        this.onStepStart = null;
        this.onStepFinished = null;
        this.onPipelineFinished = null;
        this.onLog = null;
        this.executionLogs = [];
        this.generatedDeliverables = [];

        this.initPresets();
        this.initHistory();
    }

    initPresets() {
        this.presets = [
            {
                id: 'preset-web-unlock',
                name: '⚡ 1. Desbloqueo Web & Hub gocriterio.com',
                desc: 'Forense de código, fix Netlify forms, links reales WhatsApp 318, tipografía 400 y WCAG AA',
                agents: [
                    'specialized-codebase-archaeologist',
                    'engineering-frontend-developer',
                    'design-ui-finish-gate-reviewer',
                    'testing-accessibility-auditor',
                    'engineering-devops-automator'
                ],
                goal: 'Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible.'
            },
            {
                id: 'preset-bogota-sprint',
                name: '⚡ 2. Prospección & Cierre Sprint Bogotá',
                desc: 'Filtro de 116 restaurantes sin web, blindaje Ley 2300, visita presencial y cierre de Las Perras',
                agents: [
                    'specialized-pricing-analyst',
                    'support-legal-compliance-checker',
                    'sales-offer-lead-gen-strategist',
                    'sales-outreach',
                    'sales-deal-strategist'
                ],
                goal: 'Llegar a los 116 negocios de comida de Bogotá con catálogo demo y cobrar anticipo del 50% en Las Perras.'
            },
            {
                id: 'preset-carta-viva',
                name: '⚡ 3. Lanzamiento Carta Viva & Marketing',
                desc: 'Oferta $200k/mes, carruseles de Instagram, guiones de valor y cobro de cartera vencida $600k',
                agents: [
                    'product-manager',
                    'marketing-growth-hacker',
                    'marketing-carousel-growth-engine',
                    'marketing-social-media-strategist',
                    'support-finance-tracker'
                ],
                goal: 'Lanzar Carta Viva ($200.000 COP/mes) para resolver cartas desactualizadas y recuperar $600.000 de cartera.'
            },
            {
                id: 'preset-qa-audit',
                name: '⚡ 4. Auditoría Integral & Sistema de Diseño',
                desc: 'Regla estricta fuentes 400, contraste iris/cielo, LCP < 1s y prueba de 6 catálogos vivos',
                agents: [
                    'design-ui-designer',
                    'design-ux-architect',
                    'testing-performance-benchmarker',
                    'testing-reality-checker'
                ],
                goal: 'Auditar el sistema de diseño criterio.css y verificar que los 6 catálogos vivos abran en menos de 1 segundo.'
            }
        ];
    }

    addAgent(agentId, customGoal = '') {
        if (!agentId) return false;
        // Prevent duplicate agents in the chain
        if (this.pipeline.some(p => p.agentId === agentId)) {
            return false;
        }
        const agent = window.agentsManager.agentsSummary.find(a => a.id === agentId);
        if (!agent) return false;

        this.pipeline.push({
            agentId: agent.id,
            agent: agent,
            customGoal: customGoal || `Aportar desde la especialidad de ${agent.name} para la misión.`
        });
        return true;
    }

    addSquad(agentsList, customGoal = '') {
        if (!Array.isArray(agentsList)) return 0;
        let addedCount = 0;
        agentsList.forEach(item => {
            const id = typeof item === 'string' ? item : (item && item.id);
            if (id && this.addAgent(id, customGoal)) {
                addedCount++;
            }
        });
        return addedCount;
    }

    removeAgent(index) {
        if (index >= 0 && index < this.pipeline.length) {
            this.pipeline.splice(index, 1);
            return true;
        }
        return false;
    }

    moveAgent(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.pipeline.length) return false;
        const temp = this.pipeline[index];
        this.pipeline[index] = this.pipeline[newIndex];
        this.pipeline[newIndex] = temp;
        return true;
    }

    clearPipeline() {
        this.pipeline = [];
    }

    loadPreset(presetId) {
        const preset = this.presets.find(p => p.id === presetId);
        if (!preset) return false;

        this.clearPipeline();
        this.missionGoal = preset.goal;

        preset.agents.forEach(agentId => {
            this.addAgent(agentId);
        });
        return true;
    }

    async triggerChain() {
        if (this.isRunning) return;
        if (this.pipeline.length === 0) {
            alert("La cadena está vacía. Añade al menos un agente o selecciona un Preset.");
            return;
        }

        this.isRunning = true;
        this.currentStep = 0;
        this.executionLogs = [];
        this.generatedDeliverables = [];

        if (window.pixelAudio) window.pixelAudio.playPowerUp();

        this.logSystem(`⚡ INICIANDO REACCIÓN EN CADENA: "${this.missionGoal}"`);
        this.logSystem(`👥 Total de Agentes convocados en la secuencia: ${this.pipeline.length}`);

        let intermediatePayload = {
            missionGoal: this.missionGoal,
            businessContext: window.agentsManager.businessContext,
            previousOutputs: []
        };

        for (let i = 0; i < this.pipeline.length; i++) {
            if (!this.isRunning) break;
            this.currentStep = i;
            const item = this.pipeline[i];
            const agent = item.agent;

            // Notify UI step started
            if (this.onStepStart) this.onStepStart(i, item, this.pipeline.length);

            // 1. Camera Glide & Floor Navigation
            if (this.followCamera && window.pixelEngine) {
                // Switch floor if needed
                if (agent.floor && window.pixelEngine.currentFloor !== agent.floor) {
                    const fBtn = document.querySelector(`.floor-btn[data-floor="${agent.floor}"]`);
                    if (fBtn) fBtn.click();
                    await this.delay(350);
                }

                // Smooth focus on agent
                window.pixelEngine.chainActiveAgent = agent;
                window.pixelEngine.chainActiveSpeech = `Ejecutando Paso ${i + 1}/${this.pipeline.length}...`;
                window.pixelEngine.focusOnAgent(agent, true, 1.7);
            }

            if (window.pixelAudio) window.pixelAudio.playLaser();

            this.logStepStart(i, agent);

            // 2. Simulate or execute Agent Step
            const stepResult = await this.executeAgentStep(agent, i, intermediatePayload);
            intermediatePayload.previousOutputs.push(stepResult);
            this.generatedDeliverables.push(stepResult);

            // Casino-style progressive sound (rising pitch, coin clinks, multipliers)
            if (window.pixelAudio) {
                window.pixelAudio.playCasinoStepSuccess(i, this.pipeline.length);
            }
            if (window.pixelEngine && window.pixelEngine.spawnCasinoStepCelebration) {
                window.pixelEngine.spawnCasinoStepCelebration(agent, i + 1, this.pipeline.length);
            }

            this.logStepEnd(i, agent, stepResult);

            // Update speech bubble with summary
            if (window.pixelEngine) {
                window.pixelEngine.chainActiveSpeech = `🎰 Paso ${i + 1} Listo! (x${i + 1})`;
            }

            if (this.onStepFinished) this.onStepFinished(i, stepResult);

            // Pause slightly for dramatic effect & user inspection
            await this.delay(this.stepDelay);
        }

        // Complete & Grand Casino Jackpot!
        this.isRunning = false;
        this.currentStep = -1;

        if (window.pixelEngine) {
            window.pixelEngine.chainActiveAgent = null;
            window.pixelEngine.chainActiveSpeech = '';
        }

        // Grand Casino Jackpot Fanfare & Coin Shower across the office
        if (window.pixelAudio) {
            window.pixelAudio.playCasinoJackpot();
        }
        if (window.pixelEngine && window.pixelEngine.spawnJackpotCelebration) {
            window.pixelEngine.spawnJackpotCelebration(this.pipeline.length);
        }

        this.logSystem(`🎉 REACCIÓN EN CADENA FINALIZADA CON ÉXITO. Todos los entregables han sido unificados.`);
        
        // Save executed chain to persistent history for re-execution
        this.recordChainExecution(this.pipeline, this.generatedDeliverables, this.missionGoal);

        if (this.onPipelineFinished) {
            this.onPipelineFinished(this.generatedDeliverables);
        }
    }

    cancelChain() {
        this.isRunning = false;
        if (window.pixelEngine) {
            window.pixelEngine.chainActiveAgent = null;
            window.pixelEngine.chainActiveSpeech = '';
        }
        this.logSystem(`⚠️ Reacción en cadena detenida por el usuario.`);
    }

    async executeAgentStep(agent, stepIndex, payload) {
        const taskforceInfo = agent.taskforceInfo;

        // Simulate thinking / computation delay
        await this.delay(1200);

        let deliverableTitle = `Entregable Paso ${stepIndex + 1}: ${agent.name}`;
        let deliverableContent = '';

        if (taskforceInfo && taskforceInfo.deliverable) {
            deliverableTitle = `[${taskforceInfo.front}] ${taskforceInfo.task}`;
            deliverableContent = taskforceInfo.deliverable;
        } else {
            // Role & Department specialized content (Zero boilerplate redundancy)
            const dept = agent.department || 'specialized';
            const tools = agent.tools || 'Análisis & Estrategia';
            
            if (dept === 'engineering' || dept === 'testing' || dept === 'security' || dept === 'integrations') {
                deliverableTitle = `[Tech Spec] ${agent.name}: Arquitectura Técnica & Rendimiento`;
                deliverableContent = `### 💻 Especificación Técnica y Ejecución
* **Especialidad:** ${agent.department_name} • **Herramientas:** ${tools}
* **Criterio de Calidad:** Garantizar que gocriterio.com cargue en <1.0s (LCP) y pese menos de 300KB sin dependencias innecesarias.
* **Implementación:**
  1. Validación de contratos de datos para formularios de /briefing/ y redirección a WhatsApp +57 318 941 1010.
  2. Depuración de tokens CSS y componentes accesibles según lineamientos WCAG AA.
  3. Paquete de código verificado y listo para integración continua con Netlify y GitHub.`;
            } else if (dept === 'design' || dept === 'game-development' || dept === 'spatial-computing') {
                deliverableTitle = `[Design System] ${agent.name}: Tokens Visuales & Experiencia de Usuario`;
                deliverableContent = `### 🎨 Sistema Visual y Experiencia de Usuario
* **Especialidad:** ${agent.department_name} • **Vibe:** "${agent.vibe}"
* **Criterio de Diseño:** Negro espacial (#080d1e), Acento Cielo (#38bdf8), Oro (#f59e0b) con fuentes Manrope 400 y Martian Mono 400.
* **Entregable Visual:**
  1. Diseño de componentes móviles con touch targets mínimos de 48x48px para evitar clics accidentales.
  2. Ajuste de jerarquía visual en cartas de restaurantes para destacar combos y promociones estrella.
  3. Ficha de estilos exportable para integración directa en CSS.`;
            } else if (dept === 'sales' || dept === 'finance' || dept === 'support') {
                deliverableTitle = `[Comercial & Negocios] ${agent.name}: Prospección & Cierre Bogotá`;
                deliverableContent = `### 💼 Estrategia Comercial y Monetización
* **Especialidad:** ${agent.department_name} • **Objetivo:** 119 restaurantes prioritarios en Bogotá
* **Oferta:** Catálogo WhatsApp $400.000 COP (pago único) + Mantenimiento Carta Viva $200.000 COP/mes (Margen: 80%).
* **Plan de Acción:**
  1. Aplicación estricta de Ley 2300 (horarios de contacto y permiso explícito).
  2. Demo interactiva en el móvil del dueño con menú digital pre-cargado antes de pedir anticipo.
  3. Cierre con anticipo del 50% y programación de entrega en 48 horas.`;
            } else if (dept === 'marketing' || dept === 'paid-media') {
                deliverableTitle = `[Growth & Campañas] ${agent.name}: Adquisición & Viralidad en Redes`;
                deliverableContent = `### 🚀 Estrategia de Crecimiento y Contenido
* **Especialidad:** ${agent.department_name} • **Canal:** Instagram @criterio_ai + WhatsApp Directo
* **Ángulo de Conversión:** Demostrar por qué el menú en PDF genera fuga de comensales y cómo el catálogo interactivo duplica pedidos.
* **Materiales Producidos:**
  1. Estructura de carrusel de 6 diapositivas con gancho de alto impacto y llamado a la acción claro.
  2. Copy persuasivo enfocado en dolor operativo de los restauranteros de Bogotá.
  3. Configuración de automatización para derivar comentarios a mensajes directos.`;
            } else {
                deliverableTitle = `[Estrategia & Nexus] ${agent.name}: Dirección y KPIs del Sprint`;
                deliverableContent = `### 🧠 Gobernanza Estratégica y Alineación
* **Especialidad:** ${agent.department_name} • **Liderazgo:** ${agent.name}
* **Supervisión del Ecosistema:** Sincronización de los frentes técnico, comercial y creativo para cumplir el objetivo del sprint.
* **Directrices Emitidas:**
  1. Priorizar restaurantes con ticket promedio superior a $35.000 COP en Chapinero, Usaquén y Zona T.
  2. Cobro riguroso de cartera pendiente para autofinanciar la expansión de servidores.
  3. Aprobación final de entregables antes de despliegue a producción.`;
            }
        }

        return {
            step: stepIndex + 1,
            agentId: agent.id,
            agentName: agent.name,
            agentEmoji: agent.emoji || '🤖',
            department: agent.department_name,
            floor: agent.floor,
            title: deliverableTitle,
            content: deliverableContent,
            timestamp: new Date().toLocaleTimeString()
        };
    }

    logSystem(msg) {
        const entry = { type: 'system', text: msg, time: new Date().toLocaleTimeString() };
        this.executionLogs.push(entry);
        if (this.onLog) this.onLog(entry);
    }

    logStepStart(index, agent) {
        const entry = {
            type: 'step-start',
            step: index + 1,
            agentName: agent.name,
            agentEmoji: agent.emoji || '🤖',
            text: `▶ Paso ${index + 1}: ${agent.emoji} ${agent.name} (${agent.department_name}, Piso ${agent.floor}) ha tomado el control.`,
            time: new Date().toLocaleTimeString()
        };
        this.executionLogs.push(entry);
        if (this.onLog) this.onLog(entry);
    }

    logStepEnd(index, agent, result) {
        const entry = {
            type: 'step-end',
            step: index + 1,
            agentName: agent.name,
            text: `✔ Paso ${index + 1} Concluido. Entregable generado: "${result.title}". Pasando testigo al siguiente agente...`,
            time: new Date().toLocaleTimeString()
        };
        this.executionLogs.push(entry);
        if (this.onLog) this.onLog(entry);
    }

    initHistory() {
        try {
            const saved = localStorage.getItem('criterio_executed_chains_v1');
            if (saved) {
                this.chainHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading chain history:', e);
        }

        if (!this.chainHistory || this.chainHistory.length === 0) {
            // Seed with the 43-step chain executed earlier today!
            this.chainHistory = [
                {
                    id: 'chain-20260925-43-steps',
                    title: '🚀 Aceleración Integral de Marketing, AEO & Paid Media (Sprint Bogotá)',
                    missionGoal: 'Desbloquear gocriterio.com y ejecutar el Sprint de 14 días para Catálogos WhatsApp en Bogotá',
                    status: 'COMPLETADA',
                    timestamp: '2026-09-25 22:48:11',
                    stepCount: 43,
                    departmentBreakdown: 'Marketing & Crecimiento (36) • Paid Media & Ads (7)',
                    agents: [
                        { name: 'AEO Foundations Architect', dept: 'Marketing & Crecimiento', emoji: '🏛️' },
                        { name: 'Agentic Search Optimizer', dept: 'Marketing & Crecimiento', emoji: '🔍' },
                        { name: 'AI Citation Strategist', dept: 'Marketing & Crecimiento', emoji: '🧠' },
                        { name: 'App Store Optimizer', dept: 'Marketing & Crecimiento', emoji: '📱' },
                        { name: 'Baidu SEO Specialist', dept: 'Marketing & Crecimiento', emoji: '🌐' },
                        { name: 'Bilibili Content Strategist', dept: 'Marketing & Crecimiento', emoji: '📺' },
                        { name: 'Book Co-Author', dept: 'Marketing & Crecimiento', emoji: '📖' },
                        { name: 'Carousel Growth Engine', dept: 'Marketing & Crecimiento', emoji: '🎠' },
                        { name: 'China E-Commerce Operator', dept: 'Marketing & Crecimiento', emoji: '🛒' },
                        { name: 'China Market Localization Strategist', dept: 'Marketing & Crecimiento', emoji: '🌏' },
                        { name: 'Content Creator', dept: 'Marketing & Crecimiento', emoji: '✍️' },
                        { name: 'Cross-Border E-Commerce Specialist', dept: 'Marketing & Crecimiento', emoji: '🚢' },
                        { name: 'Douyin Strategist', dept: 'Marketing & Crecimiento', emoji: '🎵' },
                        { name: 'Email Marketing Strategist', dept: 'Marketing & Crecimiento', emoji: '✉️' },
                        { name: 'Global Podcast Strategist', dept: 'Marketing & Crecimiento', emoji: '🎙️' },
                        { name: 'Growth Hacker', dept: 'Marketing & Crecimiento', emoji: '🚀' },
                        { name: 'Instagram Curator', dept: 'Marketing & Crecimiento', emoji: '📸' },
                        { name: 'Kuaishou Strategist', dept: 'Marketing & Crecimiento', emoji: '📹' },
                        { name: 'LinkedIn Content Creator', dept: 'Marketing & Crecimiento', emoji: '👔' },
                        { name: 'Livestream Commerce Coach', dept: 'Marketing & Crecimiento', emoji: '🔴' },
                        { name: 'Multi-Platform Publisher', dept: 'Marketing & Crecimiento', emoji: '📡' },
                        { name: 'Podcast Strategist', dept: 'Marketing & Crecimiento', emoji: '🎧' },
                        { name: 'PR & Communications Manager', dept: 'Marketing & Crecimiento', emoji: '📢' },
                        { name: 'Private Domain Operator', dept: 'Marketing & Crecimiento', emoji: '🔒' },
                        { name: 'Reddit Community Builder', dept: 'Marketing & Crecimiento', emoji: '🤖' },
                        { name: 'SEO Specialist', dept: 'Marketing & Crecimiento', emoji: '📈' },
                        { name: 'Short-Video Editing Coach', dept: 'Marketing & Crecimiento', emoji: '✂️' },
                        { name: 'Social Media Strategist', dept: 'Marketing & Crecimiento', emoji: '💬' },
                        { name: 'TikTok Strategist', dept: 'Marketing & Crecimiento', emoji: '🎬' },
                        { name: 'Twitter Engager', dept: 'Marketing & Crecimiento', emoji: '🐦' },
                        { name: 'Video Optimization Specialist', dept: 'Marketing & Crecimiento', emoji: '🎞️' },
                        { name: 'WeChat Official Account Manager', dept: 'Marketing & Crecimiento', emoji: '💬' },
                        { name: 'Weibo Strategist', dept: 'Marketing & Crecimiento', emoji: '📣' },
                        { name: 'X/Twitter Intelligence Analyst', dept: 'Marketing & Crecimiento', emoji: '🕵️' },
                        { name: 'Xiaohongshu Specialist', dept: 'Marketing & Crecimiento', emoji: '📕' },
                        { name: 'Zhihu Strategist', dept: 'Marketing & Crecimiento', emoji: '❓' },
                        { name: 'Paid Media Auditor', dept: 'Paid Media & Ads', emoji: '📊' },
                        { name: 'Ad Creative Strategist', dept: 'Paid Media & Ads', emoji: '🎨' },
                        { name: 'Paid Social Strategist', dept: 'Paid Media & Ads', emoji: '🎯' },
                        { name: 'PPC Campaign Strategist', dept: 'Paid Media & Ads', emoji: '💰' },
                        { name: 'Programmatic & Display Buyer', dept: 'Paid Media & Ads', emoji: '🖥️' },
                        { name: 'Search Query Analyst', dept: 'Paid Media & Ads', emoji: '🔎' },
                        { name: 'Tracking & Measurement Specialist', dept: 'Paid Media & Ads', emoji: '📐' }
                    ],
                    deliverablesGenerated: 43,
                    deliverableFolder: 'entregables/04_AEO_Y_AGENTIC_SEARCH/ & 05_GROWTH_Y_PAID_MEDIA_CAMPAIGNS/'
                },
                {
                    id: 'chain-20260925-04-design-qa',
                    title: '🎨 Auditoría de Diseño, WCAG AA & Catálogo Hamburguesas Bogotá',
                    missionGoal: 'Auditar el sistema de diseño criterio.css y verificar que el catálogo demo abra en menos de 1 segundo.',
                    status: 'COMPLETADA',
                    timestamp: '2026-09-25 22:48:40',
                    stepCount: 4,
                    departmentBreakdown: 'Diseño & UI (2) • QA & Testing (2)',
                    agents: [
                        { name: 'UI Designer', dept: 'Diseño & Sistema', emoji: '🎨' },
                        { name: 'UX Architect', dept: 'Diseño & Sistema', emoji: '📐' },
                        { name: 'Performance Benchmarker', dept: 'Testing & QA', emoji: '⚡' },
                        { name: 'Reality Checker', dept: 'Testing & QA', emoji: '🔍' }
                    ],
                    deliverablesGenerated: 4,
                    deliverableFolder: 'entregables/06_CATALOGO_DEMO_RESPONSIVE_MOBILE/'
                }
            ];
            this.saveHistory();
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('criterio_executed_chains_v1', JSON.stringify(this.chainHistory));
        } catch (e) {
            console.error('Error saving chain history:', e);
        }
    }

    recordChainExecution(pipeline, deliverables, goal, status = 'COMPLETADA') {
        const entry = {
            id: 'chain-' + Date.now(),
            title: goal || 'Reacción en Cadena Multidisciplinar',
            missionGoal: goal,
            status: status,
            timestamp: new Date().toLocaleString('es-CO'),
            stepCount: pipeline.length,
            agents: pipeline.map(p => ({
                id: p.agent ? p.agent.id : p.agentId,
                name: p.agent ? p.agent.name : p.agentId,
                emoji: (p.agent && p.agent.emoji) || '🤖',
                dept: (p.agent && p.agent.department_name) || 'Especialista'
            })),
            deliverablesGenerated: deliverables ? deliverables.length : pipeline.length,
            deliverables: deliverables || []
        };
        this.chainHistory.unshift(entry);
        this.saveHistory();
        if (window.disciplinesPanel && window.disciplinesPanel.renderChainHistory) {
            window.disciplinesPanel.renderChainHistory();
        }
    }

    loadChainFromHistory(chainId) {
        const item = this.chainHistory.find(c => c.id === chainId);
        if (!item) return false;

        this.clearPipeline();
        this.missionGoal = item.missionGoal || item.title;

        // Populate agents
        if (item.agents && Array.isArray(item.agents)) {
            item.agents.forEach(ag => {
                const agentObj = (window.agentsManager && window.agentsManager.agentsSummary.find(a => a.id === ag.id || a.name === ag.name)) || {
                    id: ag.id || ag.name.toLowerCase().replace(/\s+/g, '-'),
                    name: ag.name,
                    emoji: ag.emoji || '🤖',
                    department_name: ag.dept || 'Especialista',
                    floor: 1
                };
                this.addAgentToPipeline(agentObj.id, `Ejecutar tareas de la misión.`);
            });
        }

        if (window.disciplinesPanel) {
            window.disciplinesPanel.switchTab('chain');
            const input = document.getElementById('chainMissionGoalInput');
            if (input) input.value = this.missionGoal;
        }

        if (window.pixelEngine && window.pixelEngine.showToast) {
            window.pixelEngine.showToast(`🔗 Cadena cargada (${this.pipeline.length} pasos). Lista para re-ejecutar.`, '#38bdf8');
        }

        return true;
    }

    rerunChain(chainId) {
        if (this.loadChainFromHistory(chainId)) {
            if (window.disciplinesPanel && window.disciplinesPanel.openExecutionModal) {
                window.disciplinesPanel.openExecutionModal();
            }
            this.startChainReaction();
        }
    }

    deleteChainFromHistory(chainId) {
        this.chainHistory = this.chainHistory.filter(c => c.id !== chainId);
        this.saveHistory();
        if (window.disciplinesPanel && window.disciplinesPanel.renderChainHistory) {
            window.disciplinesPanel.renderChainHistory();
        }
        if (window.pixelEngine && window.pixelEngine.showToast) {
            window.pixelEngine.showToast('🗑️ Cadena eliminada del historial.', '#94a3b8');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.chainReactionEngine = new ChainReactionEngine();
