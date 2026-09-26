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

            if (window.pixelAudio) window.pixelAudio.playStepSuccess();

            this.logStepEnd(i, agent, stepResult);

            // Update speech bubble with summary
            if (window.pixelEngine) {
                window.pixelEngine.chainActiveSpeech = `✅ Paso ${i + 1} Listo!`;
            }

            if (this.onStepFinished) this.onStepFinished(i, stepResult);

            // Pause slightly for dramatic effect & user inspection
            await this.delay(this.stepDelay);
        }

        // Complete
        this.isRunning = false;
        this.currentStep = -1;

        if (window.pixelEngine) {
            window.pixelEngine.chainActiveAgent = null;
            window.pixelEngine.chainActiveSpeech = '';
        }

        if (window.pixelAudio) window.pixelAudio.playSuccess();

        this.logSystem(`🎉 REACCIÓN EN CADENA FINALIZADA CON ÉXITO. Todos los entregables han sido unificados.`);
        
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.chainReactionEngine = new ChainReactionEngine();
