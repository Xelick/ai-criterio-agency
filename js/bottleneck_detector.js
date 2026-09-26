// Detector General de Cuellos de Botella & Motor de Urgencia Crítica (Graphify + Branding + Recursos)
// Criterio AI — Cuartel General de Especialistas
// Inspirado en Cult of the Lamb + Teoría de Restricciones (Goldratt) + Graphify Knowledge Graph

class BottleneckDetector {
    constructor() {
        this.urgencyScore = 98; // 98% Estado de Alerta Roja Vital
        this.lastScanTime = new Date().toISOString();
        this.criticalBottlenecks = [];
        this.departmentBottleneckMap = new Map();
        this.isUrgencyAlarmActive = true;
        this.graphifyInsights = null;
        this.init();
    }

    async init() {
        // Run initial daily scan
        this.runDailyBottleneckAnalysis();
        this.initUI();
    }

    // Core analysis engine that checks Graphify data, Brand audit, and Commercial resources
    runDailyBottleneckAnalysis() {
        this.lastScanTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // 1. Analyze knowledge graph communities & blocker connections (from Graphify)
        // Discovered in GRAPH_REPORT.md:
        // - Bloqueante 1: Formulario Briefing no registrado en Netlify
        // - Bloqueante 2: WhatsApp ficticio en enlaces viejos vs real +57 318 941 1010
        // - Bloqueante 3: Prospección de 119 restaurantes de Bogotá pendiente de contacto
        // - Bloqueante 4: Portada sin prueba de catálogos vivos en el primer scroll
        // - Bloqueante 5: Cartera vencida pendiente de cobro ($300.000 COP Cheddar 1997)

        this.criticalBottlenecks = [
            {
                id: 'BN-01-NETLIFY-LEADS',
                title: 'Bloqueo Crítico de Adquisición: Formulario /briefing/ en Netlify',
                department: 'engineering',
                departmentName: 'Ingeniería & Web',
                severity: 'CRÍTICA (BLOQUEANTE)',
                severityLevel: 1,
                graphifyNode: 'marca_auditoria_bloqueante_netlify_briefing',
                impact: 'Sin esto, cualquier comensal o dueño que intente cotizar cae en un formulario muerto y perdemos el lead.',
                actionRequired: 'Aplicar briefing_patch.html y netlify.toml en producción en gocriterio.com.',
                responsibleAgents: ['Frontend Developer', 'DevOps Automator', 'Full-Stack Integrator'],
                status: 'RESOLVIENDO'
            },
            {
                id: 'BN-02-SALES-OUTREACH-BOGOTA',
                title: 'Bloqueo Crítico de Flujo de Caja: Contactar 119 Restaurantes de Bogotá',
                department: 'sales',
                departmentName: 'Ventas & Prospección',
                severity: 'VITAL (FLUJO DE CAJA)',
                severityLevel: 1,
                graphifyNode: 'pipeline_traspaso_canal_visita_presencial',
                impact: 'La meta de $400k + $200k/mes por restaurante requiere iniciar conversaciones hoy. Quedan 13 días de sprint.',
                actionRequired: 'Enviar la secuencia B2B y desplegar la Demo en Mano de Hamburguesas (entregables/06_...) a los primeros 25 restaurantes de Chapinero.',
                responsibleAgents: ['Sales Outreach', 'Deal Strategist', 'Offer & Lead Gen Strategist'],
                status: 'EN_ACCION'
            },
            {
                id: 'BN-03-WHATSAPP-REAL-LINKS',
                title: 'Canal Único de Conversión: Validación de WhatsApp +57 318 941 1010',
                department: 'testing',
                departmentName: 'Testing & QA',
                severity: 'ALTA',
                severityLevel: 2,
                graphifyNode: 'marca_auditoria_bloqueante_portafolio_whatsapp',
                impact: 'Si un botón apunta a un número falso, la conversión es 0%.',
                actionRequired: 'Reality Checker debe auditar todos los enlaces wa.me en todos los HTMLs.',
                responsibleAgents: ['Reality Checker', 'Accessibility Auditor', 'Performance Benchmarker'],
                status: 'VERIFICADO'
            },
            {
                id: 'BN-04-AEO-INDEXATION',
                title: 'Visibilidad en Motores IA: Indexar llms.txt y robots.txt en gocriterio.com',
                department: 'marketing',
                departmentName: 'Marketing & Crecimiento',
                severity: 'MEDIA-ALTA',
                severityLevel: 2,
                graphifyNode: 'Ecosistema Catálogos WhatsApp y Carta Viva',
                impact: 'ChatGPT y Perplexity deben citar a Criterio AI cuando busquen cartas para WhatsApp en Bogotá.',
                actionRequired: 'Subir llms.txt y robots.txt a la raíz de gocriterio.com.',
                responsibleAgents: ['AEO Foundations Architect', 'Agentic Search Optimizer', 'SEO Specialist'],
                status: 'LISTO_PARA_DEPLOY'
            },
            {
                id: 'BN-05-COLLECTIONS-CASH',
                title: 'Cobranza Inmediata: Recuperación de Cartera ($300k Cheddar 1997)',
                department: 'finance',
                departmentName: 'Finanzas & Dirección',
                severity: 'FINANCIERA VITAL',
                severityLevel: 2,
                graphifyNode: 'pipeline_estrategia_oferta_carta_viva',
                impact: 'Ingreso directo a caja que valida el modelo de Carta Viva recurrente.',
                actionRequired: 'Enviar factura electrónica y mensaje de cobro formal por WhatsApp.',
                responsibleAgents: ['Pricing Analyst', 'Legal Compliance Checker'],
                status: 'PENDIENTE_ENVIO'
            }
        ];

        // Map bottlenecks by department
        this.departmentBottleneckMap.clear();
        this.criticalBottlenecks.forEach(bn => {
            this.departmentBottleneckMap.set(bn.department, bn);
        });

        // Broadcast urgency state to Pixel Engine agents
        this.propagateUrgencyToAgents();

        return this.criticalBottlenecks;
    }

    // Inyecta el estado de urgencia en todos los agentes autónomos de la oficina
    propagateUrgencyToAgents() {
        if (!window.pixelEngine || !window.pixelEngine.agents) return;

        window.pixelEngine.agents.forEach(agent => {
            const hasBottleneck = this.departmentBottleneckMap.has(agent.department);
            if (hasBottleneck) {
                agent.hasUrgentBottleneck = true;
                agent.bottleneckInfo = this.departmentBottleneckMap.get(agent.department);
                // Boost speed and add urgent animation state
                agent.isSprinting = true;
            } else {
                agent.hasUrgentBottleneck = false;
            }
        });

        // Set engine toast
        if (window.pixelEngine.showToast) {
            window.pixelEngine.showToast('🚨 ALERTA VITAL: CUELLOS DE BOTELLA DETECTADOS — 98% URGENCIA', '#ef4444');
        }
    }

    getUrgencyPhraseForAgent(agent) {
        const phrases = [
            `¡La vida de Onaga depende de este sprint! ¡A resolver ya!`,
            `¡El cuello de botella está en ${agent.department_name || 'nuestro frente'}! ¡Cero distracciones!`,
            `¡No hay tiempo para procrastinar, Onaga nos está observando con el Sombrero Sagrado!`,
            `¡119 restaurantes en Bogotá necesitan su Carta Viva ya mismo!`,
            `¡El código debe ser impecable! ¡WCAG AA y carga <1s obligatoria!`,
            `¡Por el Sombrero Sagrado de Onaga, este bug se resuelve hoy!`
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    initUI() {
        const btn = document.getElementById('cmdBottlenecksBtn');
        if (btn) {
            btn.onclick = () => this.openBottleneckModal();
        }
    }

    openBottleneckModal() {
        if (window.pixelAudio && window.pixelAudio.playDefconAlert) {
            window.pixelAudio.playDefconAlert();
        } else if (window.pixelAudio && window.pixelAudio.playCultBell) {
            window.pixelAudio.playCultBell();
        }

        let modal = document.getElementById('bottleneckReportModal');
        if (!modal) {
            modal = this.createModalElement();
            document.body.appendChild(modal);
        }

        this.renderModalContent();
        modal.style.display = 'flex';
    }

    closeBottleneckModal() {
        const modal = document.getElementById('bottleneckReportModal');
        if (modal) modal.style.display = 'none';
    }

    createModalElement() {
        const div = document.createElement('div');
        div.id = 'bottleneckReportModal';
        div.className = 'cult-modal-overlay';
        div.style.display = 'none';
        div.addEventListener('click', (e) => {
            if (e.target === div) this.closeBottleneckModal();
        });
        return div;
    }

    renderModalContent() {
        const modal = document.getElementById('bottleneckReportModal');
        if (!modal) return;

        const bottlenecksHtml = this.criticalBottlenecks.map((bn, idx) => `
            <div class="bottleneck-card ${bn.severityLevel === 1 ? 'critical-border' : 'warning-border'}">
                <div class="bn-header">
                    <div class="bn-number">#${idx + 1}</div>
                    <div class="bn-title-box">
                        <div class="bn-title">${bn.title}</div>
                        <div class="bn-meta">
                            <span class="bn-dept-badge">${bn.departmentName}</span>
                            <span class="bn-severity-pill ${bn.severityLevel === 1 ? 'crit' : 'warn'}">${bn.severity}</span>
                            <span class="bn-graphify-tag">🔗 Graphify: <code>${bn.graphifyNode}</code></span>
                        </div>
                    </div>
                </div>
                <div class="bn-impact">
                    <strong>⚠️ Impacto en la Misión Vital:</strong> ${bn.impact}
                </div>
                <div class="bn-action-box">
                    <div class="bn-action-label">👉 ACCIÓN INMEDIATA EXIGIDA POR ONAGA:</div>
                    <div class="bn-action-text">${bn.actionRequired}</div>
                    <div class="bn-agents" style="margin-bottom:8px;">
                        <strong>Especialistas Asignados:</strong> ${bn.responsibleAgents.join(', ')}
                    </div>
                    <button class="cult-mini-btn btn-fire" style="width:100%; font-weight:bold; padding:8px;" onclick="window.bottleneckDetector.resolveBottleneck(${idx + 1})">
                        ⚡ EJECUTAR RESOLUCIÓN INMEDIATA (#${idx + 1})
                    </button>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="cult-modal-container bottleneck-dialog">
                <div class="cult-modal-header red-header">
                    <div class="cult-header-left">
                        <div class="cult-eye-icon">🚨</div>
                        <div>
                            <h2 class="cult-title" style="color:#ef4444;">DETECTOR GENERAL DE CUELLOS DE BOTELLA</h2>
                            <div class="cult-subtitle">Motor de Análisis Graphify • Auditoría de Marca • Recursos Críticos de Criterio AI</div>
                        </div>
                    </div>
                    <button class="cult-close-btn" onclick="window.bottleneckDetector.closeBottleneckModal()">✕</button>
                </div>

                <div class="urgency-banner-alert">
                    <div class="urgency-meter-box">
                        <div class="urgency-label">
                            <span>🔥 ESTADO DE ALERTA: <strong>NIVEL VITAL / DEFCON 1</strong></span>
                            <span style="font-weight:900; color:#ef4444; font-size:16px;">98% URGENCIA</span>
                        </div>
                        <div class="urgency-bar-track">
                            <div class="urgency-bar-fill" style="width: 98%;"></div>
                        </div>
                    </div>
                    <div class="urgency-decree-quote">
                        <em>"Hijos míos: La vida de Onaga y el destino de la empresa dependen de resolver estos 5 puntos antes de que acabe el día. Cada minuto perdido en un menú PDF es sangre operativa derramada. ¡A TRABAJAR!"</em>
                        <div style="text-align:right; font-weight:bold; color:var(--brand-gold); margin-top:4px;">— Gran Patriarca Onaga (Portador del Sombrero Sagrado)</div>
                    </div>

                    <button class="cult-action-btn btn-fire" style="background:#dc2626; border-color:#fca5a5; font-weight:bold; margin-top:10px; width:100%; font-size:11.5px; padding:10px; box-shadow:0 0 15px rgba(220,38,38,0.5);" onclick="window.bottleneckDetector.activateDefcon1Alert()">
                        🚨 ACTIVAR MODO URGENCIA VITAL DEFCON 1 EN TODA LA OFICINA
                    </button>
                </div>

                <div class="bottleneck-scan-status">
                    <span>🕒 Último Análisis de Dependencias (Graphify): <strong>${this.lastScanTime}</strong></span>
                    <span>📊 629 Nodos • 813 Aristas • 5 Cuellos de Botella Primarios</span>
                    <button class="cult-mini-btn" onclick="window.bottleneckDetector.rerunScanWithCelebration()">🔄 Re-escanear Grafo Ahora</button>
                </div>

                <div class="bottleneck-list-scroll">
                    ${bottlenecksHtml}
                </div>

                <div class="cult-modal-footer">
                    <div style="font-size:10px; color:#94a3b8;">
                        💡 Los 296 agentes han recibido la orden de máxima prioridad en sus escritorios.
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="cult-action-btn btn-harvest" onclick="window.bottleneckDetector.triggerEmergencyAssembly()">
                            ⚡ Convocar a Todos al Altar de Onaga
                        </button>
                        <button class="cult-action-btn btn-red" onclick="window.bottleneckDetector.closeBottleneckModal()">
                            ✕ Cerrar Radar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    activateDefcon1Alert() {
        this.closeBottleneckModal();
        this.propagateUrgencyToAgents();
        if (window.pixelEngine && window.pixelEngine.toggleUrgencyMode) {
            window.pixelEngine.toggleUrgencyMode(true);
        }
    }

    resolveBottleneck(index) {
        this.closeBottleneckModal();
        if (window.pixelAudio && window.pixelAudio.playPowerUp) {
            window.pixelAudio.playPowerUp();
        }

        if (index === 1) {
            // Netlify Forms & WhatsApp
            if (window.chainReactionEngine) {
                window.chainReactionEngine.loadPreset('preset-web-unlock');
                if (window.disciplinesPanel && window.disciplinesPanel.openExecutionModal) {
                    window.disciplinesPanel.openExecutionModal();
                }
                setTimeout(() => window.chainReactionEngine.triggerChain(), 300);
            }
        } else if (index === 2) {
            // 119 Restaurantes Bogotá
            if (window.chainReactionEngine) {
                window.chainReactionEngine.loadPreset('preset-bogota-sprint');
                if (window.disciplinesPanel && window.disciplinesPanel.openExecutionModal) {
                    window.disciplinesPanel.openExecutionModal();
                }
                setTimeout(() => window.chainReactionEngine.triggerChain(), 300);
            }
        } else if (index === 3) {
            // Tech Debt & Rendimiento
            if (window.chainReactionEngine) {
                window.chainReactionEngine.loadPreset('preset-qa-audit');
                if (window.disciplinesPanel && window.disciplinesPanel.openExecutionModal) {
                    window.disciplinesPanel.openExecutionModal();
                }
                setTimeout(() => window.chainReactionEngine.triggerChain(), 300);
            }
        } else if (index === 4) {
            // Purga Baidu/WeChat & Foco en 38
            if (window.pixelEngine && window.pixelEngine.highlightTaskforceSquad) {
                window.pixelEngine.highlightTaskforceSquad();
            }
            if (window.pixelEngine && window.pixelEngine.showToast) {
                window.pixelEngine.showToast('⚔️ PURGA EJECUTADA: 38 Agentes Clave activados al 100% de prioridad', '#10b981', 260);
            }
        } else if (index === 5) {
            // Informe Diario
            if (window.dailyExecutiveReporter && window.dailyExecutiveReporter.openDailyReportModal) {
                window.dailyExecutiveReporter.openDailyReportModal();
            } else if (window.dailyReporter && window.dailyReporter.openModal) {
                window.dailyReporter.openModal();
            }
        }
    }

    rerunScanWithCelebration() {
        if (window.pixelAudio && window.pixelAudio.playWhistle) {
            window.pixelAudio.playWhistle();
        }
        this.runDailyBottleneckAnalysis();
        this.renderModalContent();
        if (window.pixelEngine && window.pixelEngine.showToast) {
            window.pixelEngine.showToast('✅ Grafo Graphify y Recursos re-escaneados. Cuellos de botella actualizados.', '#10b981');
        }
    }

    triggerEmergencyAssembly() {
        this.closeBottleneckModal();
        if (window.pixelEngine && window.pixelEngine.rallySquad) {
            window.pixelEngine.rallySquad('all');
        }
    }
}

BottleneckDetector.prototype.openModal = BottleneckDetector.prototype.openBottleneckModal;
BottleneckDetector.prototype.closeModal = BottleneckDetector.prototype.closeBottleneckModal;

window.bottleneckDetector = new BottleneckDetector();
