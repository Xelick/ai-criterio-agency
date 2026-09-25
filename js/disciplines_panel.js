// Disciplines & Chain Reaction Side Panel Controller for AI_Criterio
class DisciplinesPanel {
    constructor() {
        this.isOpen = true;
        this.activeTab = 'disciplines'; // 'disciplines' | 'chain' | 'presets'
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.expandedDepts = new Set(['engineering', 'design', 'sales']);

        // Department group definitions with friendly titles and icons
        this.deptCategories = [
            { id: 'engineering', name: 'Ingeniería & Código', icon: '💻', depts: ['engineering'] },
            { id: 'design', name: 'Diseño & UI/UX', icon: '🎨', depts: ['design'] },
            { id: 'sales', name: 'Ventas & Prospección', icon: '💼', depts: ['sales'] },
            { id: 'marketing', name: 'Marketing & Growth', icon: '🚀', depts: ['marketing'] },
            { id: 'testing', name: 'Testing & QA', icon: '🧪', depts: ['testing'] },
            { id: 'strategy', name: 'Estrategia & Nexus', icon: '🧠', depts: ['nexus', 'specialized'] },
            { id: 'product', name: 'Producto & Workflows', icon: '📦', depts: ['product'] },
            { id: 'support', name: 'Legal, Finanzas & Soporte', icon: '⚖️', depts: ['support'] },
            { id: 'spatial', name: 'GIS, Research & Datos', icon: '🌐', depts: ['spatial', 'academic'] },
        ];

        // 8 Synergistic Combos based on complementary disciplines & skill sets
        this.combos = [
            {
                id: 'combo-web-killer',
                name: '🛠️ Desbloqueo Web & Frontend Killer',
                badge: 'Web Killer',
                tagline: 'Forense de código + Netlify Forms + WhatsApp + WCAG AA',
                disciplines: 'Frontend ✕ QA ✕ DevOps ✕ Forensic',
                goal: 'Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com.',
                synergy: 'Arqueólogo extrae deuda técnica → Frontend reescribe inputs y enlaces → UI Finish pule tokens y gaps → Accesibilidad valida WCAG AA → DevOps automatiza build y deploy.',
                agents: [
                    'specialized-codebase-archaeologist',
                    'engineering-frontend-developer',
                    'design-ui-finish-gate-reviewer',
                    'testing-accessibility-auditor',
                    'engineering-devops-automator'
                ],
                themeColor: '#38bdf8'
            },
            {
                id: 'combo-bogota-closers',
                name: '🥩 Bogotá Deal Closers (Food & Retail)',
                badge: 'Bogotá Closers',
                tagline: 'Filtro PYMEs + Blindaje Legal + Demo en Mano + Cierre',
                disciplines: 'Ventas ✕ Legal ✕ Pricing ✕ Prospección',
                goal: 'Prospectar 119 restaurantes de Bogotá sin web, presentar catálogo demo con anticipo 50% ($200k) y cerrar ventas directas.',
                synergy: 'Lead Gen detecta negocios con menú PDF → Legal blinda prospección Ley 1581 → Outreach envía screen recording Demo en Mano → Pricing estructura paquete $400k+$200k → Deal Strategist vence objeción comisión Rappi 30%.',
                agents: [
                    'specialized-pricing-analyst',
                    'support-legal-compliance-checker',
                    'sales-offer-lead-gen-strategist',
                    'sales-outreach',
                    'sales-deal-strategist'
                ],
                themeColor: '#f59e0b'
            },
            {
                id: 'combo-viral-growth',
                name: '🚀 Flywheel de Crecimiento & Contenido Viral',
                badge: 'Viral Growth',
                tagline: 'Dolor PYME + Copywriting The Futur + 6 Slides + Email',
                disciplines: 'Marketing ✕ Copy ✕ Redes ✕ Outbound',
                goal: 'Convertir casos de estudio de WhatsApp en carruseles virales de Instagram/LinkedIn y reactivar lista de correos.',
                synergy: 'Social Media detecta quejas de restaurantes con PDFs pesados → Content Creator redacta narrativa de 6 diapositivas → Carousel Engine genera visuales estilo The Futur → Growth Hacker diseña tests de gancho → Email Strategist reactiva base de datos.',
                agents: [
                    'marketing-social-media-strategist',
                    'marketing-content-creator',
                    'marketing-carousel-growth-engine',
                    'marketing-growth-hacker',
                    'marketing-email-strategist'
                ],
                themeColor: '#ec4899'
            },
            {
                id: 'combo-mobile-speed',
                name: '📱 Mobile First & Rendimiento Extremo',
                badge: 'Mobile Speed',
                tagline: 'Viewport Móvil + Touch Targets 48px + LCP < 1.2s',
                disciplines: 'Mobile ✕ UX ✕ Performance ✕ Reality QA',
                goal: 'Asegurar que los catálogos de WhatsApp abran en menos de 1.2s en redes móviles 4G y que la barra fija no tape los productos.',
                synergy: 'Mobile App Builder optimiza CSS y touch targets → UX Architect rediseña barra de navegación flotante → Performance Benchmarker comprime imágenes y reduce LCP → Reality Checker elimina dependencias innecesarias.',
                agents: [
                    'engineering-mobile-app-builder',
                    'design-ux-architect',
                    'testing-performance-benchmarker',
                    'testing-reality-checker'
                ],
                themeColor: '#10b981'
            },
            {
                id: 'combo-mrr-retention',
                name: '🔄 Retención Carta Viva & Finanzas MRR',
                badge: 'MRR Retention',
                tagline: 'Onboarding WhatsApp + Menú al Día + Cobro $200k/mes',
                disciplines: 'Producto ✕ Customer Success ✕ QA ✕ Finanzas',
                goal: 'Consolidar el servicio recurrente Carta Viva ($200.000 COP/mes) para retener a clientes con menú vivo y recaudar cartera.',
                synergy: 'Product Manager define SLA de actualización en 24h → Customer Success crea canal VIP de soporte por WhatsApp → Workflow Optimizer automatiza carga de nuevos platos → Finance Tracker factura suscripción mensual y recauda saldos.',
                agents: [
                    'product-manager',
                    'customer-success-manager',
                    'testing-workflow-optimizer',
                    'support-finance-tracker'
                ],
                themeColor: '#8b5cf6'
            },
            {
                id: 'combo-brand-fortress',
                name: '🎨 Fortaleza de Marca & Design System',
                badge: 'Brand Fortress',
                tagline: 'Tokens criterio.css + Tipografía 400 + Visual Sobrio',
                disciplines: 'Diseño ✕ Marca ✕ Storytelling ✕ Creatividad',
                goal: 'Blindar la identidad visual sobria y elegante de Criterio AI: Negro espacial, Oro ámbar, Cian neón, sin artificios.',
                synergy: 'Creative Strategist define la propuesta de valor sin ruido → UI Designer traduce reglas a tokens CSS criterio.css → Brand Guardian supervisa contraste y coherencia tipográfica → Visual Storyteller unifica la voz en presentaciones y web.',
                agents: [
                    'paid-media-creative-strategist',
                    'design-ui-designer',
                    'design-brand-guardian',
                    'design-visual-storyteller'
                ],
                themeColor: '#fde047'
            },
            {
                id: 'combo-smart-automation',
                name: '🧠 Automatización Inteligente & APIs',
                badge: 'Smart Automation',
                tagline: 'Orquestación de Agentes + Prompt Engineering + APIs',
                disciplines: 'Nexus ✕ AI Engineering ✕ APIs ✕ Prompts',
                goal: 'Conectar el scraping de Google Maps con la generación automática de catálogos Netlify y respuestas IA en WhatsApp.',
                synergy: 'Agents Orchestrator coordina el pipeline de datos → Prompt Engineer afina las instrucciones de cotización y ventas → API Platform conecta webhooks de Maps y Netlify → AI Engineer despliega el bot conversacional de pedidos.',
                agents: [
                    'agents-orchestrator',
                    'engineering-prompt-engineer',
                    'engineering-api-platform-engineer',
                    'engineering-ai-engineer'
                ],
                themeColor: '#06b6d4'
            },
            {
                id: 'combo-governance-strategy',
                name: '⚖️ Gobernanza Estratégica & Gestión de Riesgos',
                badge: 'Governance & Risk',
                tagline: 'Estrategia 14 Días + Habeas Data + Mitigación de Riesgo',
                disciplines: 'Estrategia ✕ Legal ✕ Gobernanza ✕ Privacidad',
                goal: 'Mantener a toda la agencia enfocada en la meta de facturación a 14 días, blindando operaciones bajo leyes colombianas.',
                synergy: 'Nexus Strategy congela frentes no prioritarios para proteger el sprint → Automation Governance audita límites de ejecución → Data Privacy Officer certifica cumplimiento de Ley 1581 → Legal Compliance blinda contratos y acuerdos comerciales.',
                agents: [
                    'nexus-strategy',
                    'automation-governance-architect',
                    'data-privacy-officer',
                    'support-legal-compliance-checker'
                ],
                themeColor: '#ef4444'
            }
        ];
    }

    getAgentCombos(agentId) {
        if (!agentId || !this.combos) return [];
        return this.combos.filter(c => c.agents.includes(agentId));
    }

    init() {
        this.bindEvents();
        this.renderDisciplinesList();
        this.renderCombosList();
        this.renderChainPipeline();
        this.renderPresetsList();
        this.updateChainBadge();

        // Listen to chain reaction events
        window.chainReactionEngine.onStepStart = (stepIdx, item, total) => {
            this.updateExecutionModalProgress(stepIdx, item, total);
        };

        window.chainReactionEngine.onStepFinished = (stepIdx, result) => {
            this.appendExecutionModalDeliverable(stepIdx, result);
        };

        window.chainReactionEngine.onPipelineFinished = (deliverables) => {
            this.showExecutionModalCompleted(deliverables);
        };

        window.chainReactionEngine.onLog = (entry) => {
            this.appendExecutionModalLog(entry);
        };

        this.initExecutionModalTabs();
    }

    bindEvents() {
        // Toggle panel button
        const toggleBtn = document.getElementById('toggleDisciplinesBtn');
        const panel = document.getElementById('disciplinesPanel');
        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                this.isOpen = !this.isOpen;
                panel.classList.toggle('collapsed', !this.isOpen);
                toggleBtn.innerHTML = this.isOpen ? '◀' : '▶';
                if (window.pixelAudio) window.pixelAudio.playClick();
                if (window.pixelEngine) {
                    window.pixelEngine.resize();
                    setTimeout(() => window.pixelEngine.resize(), 320);
                }
            });
        }

        // Sub-tabs
        const tabBtns = document.querySelectorAll('.disciplines-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Search input
        const searchInput = document.getElementById('discSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderDisciplinesList();
            });
        }

        // Filter pills
        const pillBtns = document.querySelectorAll('.disc-filter-pill');
        pillBtns.forEach(pill => {
            pill.addEventListener('click', () => {
                pillBtns.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.currentFilter = pill.dataset.filter;
                this.renderDisciplinesList();
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        });

        // Trigger Chain Reaction button
        const triggerChainBtn = document.getElementById('triggerChainBtn');
        if (triggerChainBtn) {
            triggerChainBtn.addEventListener('click', () => {
                this.openExecutionModal();
                window.chainReactionEngine.triggerChain();
            });
        }

        // Clear Chain button
        const clearChainBtn = document.getElementById('clearChainBtn');
        if (clearChainBtn) {
            clearChainBtn.addEventListener('click', () => {
                window.chainReactionEngine.clearPipeline();
                this.renderChainPipeline();
                this.updateChainBadge();
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        }

        // Goal input listener
        const chainGoalInput = document.getElementById('chainMissionGoalInput');
        if (chainGoalInput) {
            chainGoalInput.addEventListener('change', (e) => {
                window.chainReactionEngine.missionGoal = e.target.value;
            });
        }

        // Execution modal close / cancel
        const closeExecBtn = document.getElementById('closeExecModalBtn');
        const cancelExecBtn = document.getElementById('cancelExecBtn');
        const execModal = document.getElementById('chainExecModal');

        if (closeExecBtn && execModal) {
            closeExecBtn.addEventListener('click', () => {
                execModal.classList.add('hidden');
            });
        }

        if (cancelExecBtn) {
            cancelExecBtn.addEventListener('click', () => {
                window.chainReactionEngine.cancelChain();
            });
        }

        // Copy / Download report
        const copyReportBtn = document.getElementById('copyExecReportBtn');
        if (copyReportBtn) {
            copyReportBtn.addEventListener('click', () => {
                this.copyExecutionReport();
            });
        }
    }

    switchTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('.disciplines-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tab);
        });

        const tabDisc = document.getElementById('tabDisciplinesContent');
        const tabCombos = document.getElementById('tabCombosContent');
        const tabChain = document.getElementById('tabChainContent');
        const tabPresets = document.getElementById('tabPresetsContent');

        if (tabDisc) tabDisc.style.display = tab === 'disciplines' ? 'block' : 'none';
        if (tabCombos) tabCombos.style.display = tab === 'combos' ? 'block' : 'none';
        if (tabChain) tabChain.style.display = tab === 'chain' ? 'block' : 'none';
        if (tabPresets) tabPresets.style.display = tab === 'presets' ? 'block' : 'none';

        if (tab === 'combos') this.renderCombosList();
        if (tab === 'chain') this.renderChainPipeline();
        if (tab === 'presets') this.renderPresetsList();
        if (window.pixelAudio) window.pixelAudio.playClick();
    }

    renderDisciplinesList() {
        const container = document.getElementById('disciplinesAccordionContainer');
        if (!container) return;

        container.innerHTML = '';
        const allAgents = window.agentsManager.agentsSummary || [];

        this.deptCategories.forEach(cat => {
            // Filter agents matching category depts
            let catAgents = allAgents.filter(a => cat.depts.includes(a.department));

            // Apply filter pills
            if (this.currentFilter === 'taskforce') {
                catAgents = catAgents.filter(a => a.isTaskforce);
            } else if (this.currentFilter !== 'all') {
                catAgents = catAgents.filter(a => a.department === this.currentFilter);
            }

            // Apply search query
            if (this.searchQuery) {
                catAgents = catAgents.filter(a => 
                    a.name.toLowerCase().includes(this.searchQuery) ||
                    a.description.toLowerCase().includes(this.searchQuery) ||
                    a.tools.toLowerCase().includes(this.searchQuery)
                );
            }

            if (catAgents.length === 0) return; // Hide empty category

            const taskforceInCat = catAgents.filter(a => a.isTaskforce).length;
            const isExpanded = this.expandedDepts.has(cat.id) || this.searchQuery.length > 0;

            const groupEl = document.createElement('div');
            groupEl.className = 'dept-accordion-group';

            groupEl.innerHTML = `
                <div class="dept-accordion-header" data-cat="${cat.id}">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:16px;">${cat.icon}</span>
                        <div>
                            <span style="font-weight:bold; font-size:11px; color:#ffffff;">${cat.name}</span>
                            <span style="font-size:9px; color:#94a3b8; margin-left:4px;">(${catAgents.length})</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        ${taskforceInCat > 0 ? `<span class="badge-fire">🔥 ${taskforceInCat}</span>` : ''}
                        <span class="accordion-arrow">${isExpanded ? '▼' : '▶'}</span>
                    </div>
                </div>
                <div class="dept-accordion-body" style="display:${isExpanded ? 'flex' : 'none'};"></div>
            `;

            // Accordion toggle
            const header = groupEl.querySelector('.dept-accordion-header');
            const body = groupEl.querySelector('.dept-accordion-body');
            header.addEventListener('click', () => {
                if (this.expandedDepts.has(cat.id)) {
                    this.expandedDepts.delete(cat.id);
                    body.style.display = 'none';
                    header.querySelector('.accordion-arrow').textContent = '▶';
                } else {
                    this.expandedDepts.add(cat.id);
                    body.style.display = 'flex';
                    header.querySelector('.accordion-arrow').textContent = '▼';
                }
                if (window.pixelAudio) window.pixelAudio.playClick();
            });

            // Populate NPC cards in category
            catAgents.forEach(agent => {
                const card = this.createNpcCard(agent);
                body.appendChild(card);
            });

            container.appendChild(groupEl);
        });
    }

    createNpcCard(agent) {
        const card = document.createElement('div');
        card.className = `npc-card ${agent.isTaskforce ? 'is-taskforce' : ''}`;
        
        // Draw mini pixel avatar preview canvas
        const isAlreadyInChain = window.chainReactionEngine.pipeline.some(p => p.agentId === agent.id);
        const agentCombos = this.getAgentCombos(agent.id);

        card.innerHTML = `
            <div class="npc-card-main">
                <div class="npc-avatar-box" style="border-color:${agent.color || '#38bdf8'};">
                    <span style="font-size:18px;">${agent.emoji || '🤖'}</span>
                </div>
                <div class="npc-card-info">
                    <div style="display:flex; align-items:center; gap:4px;">
                        <span class="npc-card-name" title="${agent.name}">${agent.name}</span>
                        ${agent.isTaskforce ? '<span title="Activo en el Sprint de Criterio AI">🔥</span>' : ''}
                    </div>
                    <div class="npc-card-role">Piso ${agent.floor} • ${agent.department_name}</div>
                    <div class="npc-card-vibe">"${agent.vibe}"</div>
                    ${agentCombos.length > 0 ? `
                        <div class="npc-combos-row">
                            ${agentCombos.map(c => `
                                <span class="npc-combo-badge" style="border-color:${c.themeColor}; color:${c.themeColor};" title="Combo Sinergia: ${c.name}">
                                    💥 ${c.badge}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="npc-card-actions">
                <button class="npc-action-btn btn-add-chain ${isAlreadyInChain ? 'added' : ''}" title="Añadir a la Reacción en Cadena">
                    ${isAlreadyInChain ? '✔ En Cadena' : '➕ A Cadena'}
                </button>
                <button class="npc-action-btn btn-go-desk" title="Ir a su escritorio en la oficina">
                    🎯 Ir
                </button>
                <button class="npc-action-btn btn-chat-npc" title="Consultar con este agente">
                    💬 Chat
                </button>
            </div>
        `;

        // Action: Add to chain
        const addBtn = card.querySelector('.btn-add-chain');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.chainReactionEngine.addAgent(agent.id);
            this.renderChainPipeline();
            this.updateChainBadge();
            addBtn.classList.add('added');
            addBtn.textContent = '✔ En Cadena';
            if (window.pixelAudio) window.pixelAudio.playLaser();
        });

        // Action: Go to desk
        card.querySelector('.btn-go-desk').addEventListener('click', (e) => {
            e.stopPropagation();
            if (agent.floor && window.pixelEngine.currentFloor !== agent.floor) {
                const fBtn = document.querySelector(`.floor-btn[data-floor="${agent.floor}"]`);
                if (fBtn) fBtn.click();
            }
            window.pixelEngine.focusOnAgent(agent, true, 1.5);
            if (window.pixelAudio) window.pixelAudio.playClick();
        });

        // Action: Chat
        card.querySelector('.btn-chat-npc').addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.agentsManager) {
                const fullAgent = window.agentsManager.getAgentFull(agent.id) || agent;
                if (window.pixelEngine && window.pixelEngine.onAgentSelected) {
                    window.pixelEngine.onAgentSelected(fullAgent);
                }
            }
        });

        return card;
    }

    renderChainPipeline() {
        const container = document.getElementById('chainPipelineContainer');
        const emptyState = document.getElementById('chainEmptyState');
        const triggerBtn = document.getElementById('triggerChainBtn');
        const countBadge = document.getElementById('chainStepCount');

        if (!container) return;
        const pipeline = window.chainReactionEngine.pipeline;

        if (countBadge) countBadge.textContent = `${pipeline.length} Pasos`;

        if (pipeline.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (triggerBtn) triggerBtn.disabled = true;
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (triggerBtn) triggerBtn.disabled = false;
        container.innerHTML = '';

        pipeline.forEach((item, index) => {
            const agent = item.agent;
            const stepEl = document.createElement('div');
            stepEl.className = 'pipeline-step-card';

            stepEl.innerHTML = `
                <div class="pipeline-step-header">
                    <div class="step-num-badge">Paso ${index + 1}</div>
                    <div style="display:flex; gap:4px;">
                        <button class="step-mini-btn move-up" ${index === 0 ? 'disabled' : ''} title="Subir">▲</button>
                        <button class="step-mini-btn move-down" ${index === pipeline.length - 1 ? 'disabled' : ''} title="Bajar">▼</button>
                        <button class="step-mini-btn remove-step" title="Quitar">✕</button>
                    </div>
                </div>
                <div class="pipeline-step-body">
                    <div style="font-size:22px;">${agent.emoji || '🤖'}</div>
                    <div style="flex:1; overflow:hidden;">
                        <div style="font-weight:bold; font-size:11px; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${agent.name}
                        </div>
                        <div style="font-size:9px; color:#38bdf8;">
                            Piso ${agent.floor} • ${agent.department_name} ${agent.isTaskforce ? '🔥' : ''}
                        </div>
                    </div>
                </div>
                ${index < pipeline.length - 1 ? '<div class="pipeline-connector-arrow">↓</div>' : ''}
            `;

            // Step controls
            stepEl.querySelector('.move-up').addEventListener('click', () => {
                window.chainReactionEngine.moveAgent(index, -1);
                this.renderChainPipeline();
                this.updateChainBadge();
            });

            stepEl.querySelector('.move-down').addEventListener('click', () => {
                window.chainReactionEngine.moveAgent(index, 1);
                this.renderChainPipeline();
                this.updateChainBadge();
            });

            stepEl.querySelector('.remove-step').addEventListener('click', () => {
                window.chainReactionEngine.removeAgent(index);
                this.renderChainPipeline();
                this.updateChainBadge();
                this.renderDisciplinesList();
            });

            container.appendChild(stepEl);
        });
    }

    renderPresetsList() {
        const container = document.getElementById('presetsListContainer');
        if (!container) return;

        container.innerHTML = '';
        const presets = window.chainReactionEngine.presets;

        presets.forEach(p => {
            const card = document.createElement('div');
            card.className = 'preset-card';

            card.innerHTML = `
                <div style="font-weight:bold; font-size:12px; color:var(--brand-gold); margin-bottom:4px;">
                    ${p.name}
                </div>
                <div style="font-size:10px; color:#cbd5e1; margin-bottom:8px; line-height:1.4;">
                    ${p.desc}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9px; color:#38bdf8; background:#0f172a; padding:2px 6px; border:1px solid #334155;">
                        👥 ${p.agents.length} Agentes en Cadena
                    </span>
                    <button class="action-btn btn-gold load-preset-btn" style="font-size:10px; padding:3px 8px;">
                        ⚡ Cargar & Disparar
                    </button>
                </div>
            `;

            card.querySelector('.load-preset-btn').addEventListener('click', () => {
                window.chainReactionEngine.loadPreset(p.id);
                this.switchTab('chain');
                if (window.pixelAudio) window.pixelAudio.playPowerUp();
            });

            container.appendChild(card);
        });
    }

    renderCombosList() {
        const container = document.getElementById('combosListContainer');
        if (!container) return;
        container.innerHTML = '';

        this.combos.forEach(combo => {
            const card = document.createElement('div');
            card.className = 'combo-card';
            card.style.borderLeftColor = combo.themeColor;

            // Collect agent summary objects
            const agentsList = combo.agents.map(aid => {
                const found = window.agentsManager.agentsSummary.find(a => a.id === aid);
                return found || { id: aid, name: aid, emoji: '🤖', floor: 1, department_name: 'Especialista' };
            });

            card.innerHTML = `
                <div class="combo-card-header">
                    <div>
                        <div class="combo-card-title" style="color:${combo.themeColor};">${combo.name}</div>
                        <div class="combo-card-disciplines">${combo.disciplines}</div>
                    </div>
                    <span class="combo-badge-tag" style="background:${combo.themeColor}22; border-color:${combo.themeColor}; color:${combo.themeColor};">
                        👥 ${combo.agents.length} Especialistas
                    </span>
                </div>
                <div class="combo-card-tagline">${combo.tagline}</div>
                <div class="combo-synergy-box">
                    <span style="color:#fde047; font-weight:bold; font-size:9.5px; display:block; margin-bottom:2px;">⚡ Sinergia de Habilidades:</span>
                    <div style="font-size:9px; line-height:1.45; color:#cbd5e1;">${combo.synergy}</div>
                </div>
                <div class="combo-agents-grid">
                    ${agentsList.map(a => `
                        <div class="combo-agent-chip" title="${a.name} (Piso ${a.floor || 1})">
                            <span style="font-size:12px;">${a.emoji || '🤖'}</span>
                            <span class="combo-agent-chip-name">${a.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="combo-card-actions">
                    <button class="action-btn combo-load-btn" style="flex:1; font-size:10px; padding:4px 6px;">
                        🔗 Cargar a Cadena
                    </button>
                    <button class="action-btn btn-gold combo-fire-btn" style="flex:1; font-size:10px; padding:4px 6px;">
                        ⚡ Disparar Inmediato
                    </button>
                </div>
            `;

            // Load to chain
            card.querySelector('.combo-load-btn').addEventListener('click', () => {
                this.loadComboToPipeline(combo);
                this.switchTab('chain');
                if (window.pixelAudio) window.pixelAudio.playLaser();
            });

            // Fire immediate
            card.querySelector('.combo-fire-btn').addEventListener('click', () => {
                this.loadComboToPipeline(combo);
                this.openExecutionModal();
                window.chainReactionEngine.triggerChain();
                if (window.pixelAudio) window.pixelAudio.playPowerUp();
            });

            container.appendChild(card);
        });
    }

    loadComboToPipeline(combo) {
        window.chainReactionEngine.clearPipeline();
        window.chainReactionEngine.missionGoal = combo.goal;
        const goalInput = document.getElementById('chainMissionGoalInput');
        if (goalInput) goalInput.value = combo.goal;

        combo.agents.forEach(agentId => {
            window.chainReactionEngine.addAgent(agentId);
        });

        this.renderChainPipeline();
        this.updateChainBadge();
        this.renderDisciplinesList();
    }

    updateChainBadge() {
        const badge = document.getElementById('headerChainBadge');
        const count = window.chainReactionEngine.pipeline.length;
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    // Execution Modal Helpers
    openExecutionModal() {
        const modal = document.getElementById('chainExecModal');
        const title = document.getElementById('execModalMissionTitle');
        const logsContainer = document.getElementById('execLogsConsole');
        const fullLogsContainer = document.getElementById('execFullLogsConsole');
        const deliverableContainer = document.getElementById('execDeliverablesList');
        const summaryContent = document.getElementById('execSummaryContent');
        const progressBar = document.getElementById('execProgressBar');
        const progressPct = document.getElementById('execProgressPct');
        const statusText = document.getElementById('execStatusText');

        if (modal) modal.classList.remove('hidden');
        if (title) title.textContent = window.chainReactionEngine.missionGoal;
        if (logsContainer) logsContainer.innerHTML = '';
        if (fullLogsContainer) fullLogsContainer.innerHTML = '';
        if (deliverableContainer) deliverableContainer.innerHTML = '<div style="color:#64748b; font-size:11px; padding:10px;">Los entregables generados por cada agente aparecerán aquí...</div>';
        if (summaryContent) {
            summaryContent.innerHTML = `
                <div style="text-align:center; padding:55px 20px; color:#64748b;">
                    <div style="font-size:28px; margin-bottom:8px;">⏳</div>
                    <div style="font-size:11px; color:#cbd5e1; font-weight:bold;">Ejecutando secuencia multi-agente en tiempo real...</div>
                    <div style="font-size:10px; margin-top:4px;">El resumen comprimido de toda la operación y los archivos para Cursor / Claude aparecerán aquí al finalizar.</div>
                </div>
            `;
        }
        if (progressBar) progressBar.style.width = '0%';
        if (progressPct) progressPct.textContent = '0%';
        if (statusText) statusText.textContent = 'Iniciando secuencia...';

        // During execution, show the steps pane so user sees live action
        this.switchExecView('steps');
    }

    initExecutionModalTabs() {
        const tabBtns = document.querySelectorAll('.exec-view-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchExecView(view);
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        });
    }

    switchExecView(view) {
        document.querySelectorAll('.exec-view-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.view === view);
        });

        const paneSummary = document.getElementById('execViewSummary');
        const paneSteps = document.getElementById('execViewSteps');
        const paneLogs = document.getElementById('execViewLogs');

        if (paneSummary) paneSummary.style.display = (view === 'summary') ? 'block' : 'none';
        if (paneSteps) paneSteps.style.display = (view === 'steps') ? 'block' : 'none';
        if (paneLogs) paneLogs.style.display = (view === 'logs') ? 'block' : 'none';
    }

    updateExecutionModalProgress(stepIdx, item, total) {
        const progressBar = document.getElementById('execProgressBar');
        const progressPct = document.getElementById('execProgressPct');
        const statusText = document.getElementById('execStatusText');

        const pct = Math.round(((stepIdx) / total) * 100);
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;
        if (statusText) statusText.textContent = `Paso ${stepIdx + 1}/${total}: ${item.agent.emoji} ${item.agent.name} ejecutando...`;
    }

    appendExecutionModalLog(entry) {
        const logsContainer = document.getElementById('execLogsConsole');
        const fullLogsContainer = document.getElementById('execFullLogsConsole');
        
        const line = document.createElement('div');
        line.className = `exec-log-line ${entry.type}`;
        line.innerHTML = `<span class="log-time">[${entry.time}]</span> ${entry.text}`;
        
        if (logsContainer) {
            logsContainer.appendChild(line.cloneNode(true));
            logsContainer.scrollTop = logsContainer.scrollHeight;
        }

        if (fullLogsContainer) {
            fullLogsContainer.appendChild(line);
            fullLogsContainer.scrollTop = fullLogsContainer.scrollHeight;
        }
    }

    appendExecutionModalDeliverable(stepIdx, result) {
        const deliverableContainer = document.getElementById('execDeliverablesList');
        if (!deliverableContainer) return;

        if (stepIdx === 0) deliverableContainer.innerHTML = '';

        const itemEl = document.createElement('div');
        itemEl.className = 'exec-deliverable-item';
        itemEl.innerHTML = `
            <div class="deliverable-header">
                <span class="deliverable-step">Paso ${result.step}</span>
                <span style="color:#ffffff; font-weight:bold; font-size:11px;">${result.agentEmoji} ${result.agentName}</span>
                <span style="font-size:9px; color:#38bdf8;">(${result.department})</span>
            </div>
            <div style="font-size:11px; color:#fde047; font-weight:bold; margin-bottom:4px;">
                🎯 ${result.title}
            </div>
            <div class="deliverable-content">
                ${this.formatMarkdown(result.content)}
            </div>
        `;
        deliverableContainer.appendChild(itemEl);
        deliverableContainer.scrollTop = deliverableContainer.scrollHeight;
    }

    renderCompressedExecutiveSummary(deliverables) {
        const container = document.getElementById('execSummaryContent');
        if (!container) return;

        const goal = window.chainReactionEngine.missionGoal;
        const total = deliverables.length;

        let html = `
            <div style="background: linear-gradient(135deg, #1e1b4b, #0f172a); border: 2px solid #8b5cf6; padding: 12px 14px; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.25);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="background:#059669; color:#fff; font-size:9px; font-weight:bold; padding:2px 8px; border-radius:2px; letter-spacing:0.5px;">
                        ✔ MISIÓN COMPLETADA • SÍNTESIS EJECUTIVA
                    </span>
                    <span style="font-size:10px; color:#fde047; font-weight:bold;">
                        👥 ${total} Especialistas Sincronizados
                    </span>
                </div>
                <div style="font-size:13px; font-weight:900; color:#ffffff; margin-bottom:8px; line-height:1.4;">
                    🎯 ${goal}
                </div>
                <!-- Visual Pipeline Sequence -->
                <div style="display:flex; gap:6px; overflow-x:auto; padding:6px 0; border-top:1px solid rgba(255,255,255,0.1); margin-top:4px;">
                    ${deliverables.map((d, i) => `
                        <div style="display:flex; align-items:center; gap:4px; background:#1e293b; padding:4px 8px; border:1px solid #334155; white-space:nowrap; font-size:10px;">
                            <span>${d.agentEmoji}</span>
                            <span style="font-weight:bold; color:#e2e8f0;">${d.agentName}</span>
                            ${i < total - 1 ? '<span style="color:#8b5cf6; margin-left:4px; font-weight:bold;">➔</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Master Prompt for Cursor / Claude Code Button -->
            <div style="background:#050811; border:1px solid #334155; padding:10px 14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-size:11px; font-weight:bold; color:#38bdf8;">🤖 ¿Quieres que una IA aplique todo esto en tu código?</div>
                    <div style="font-size:9.5px; color:#94a3b8;">Copia este prompt maestro y pégalo en Cursor (Ctrl+L) o en Claude Code CLI.</div>
                </div>
                <button id="copyMasterPromptBtn" class="action-btn btn-gold" style="font-size:10px; padding:6px 12px; white-space:nowrap;">
                    📋 Copiar Prompt Maestro para Cursor / Claude
                </button>
            </div>

            <!-- Compressed Results Table -->
            <div style="font-size:10px; font-weight:bold; color:var(--brand-gold); margin-bottom:6px; text-transform:uppercase;">
                📦 Entregables Comprimidos de la Operación:
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${deliverables.map(d => {
                    const cleanSummary = d.content.replace(/[*#`_]/g, '').split('\n').filter(l => l.trim().length > 10)[0] || d.title;
                    const shortSummary = cleanSummary.length > 115 ? cleanSummary.substring(0, 112) + '...' : cleanSummary;

                    return `
                        <div style="background:#1e293b; border:1px solid #334155; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                            <div style="flex:1;">
                                <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                                    <span style="background:#e11d48; color:#fff; font-size:8px; font-weight:bold; padding:1px 5px;">Paso ${d.step}</span>
                                    <span style="font-weight:bold; color:#ffffff; font-size:10.5px;">${d.agentEmoji} ${d.agentName}</span>
                                    <span style="font-size:9px; color:#94a3b8;">(${d.department})</span>
                                </div>
                                <div style="font-size:10px; color:#fde047; font-weight:bold; margin-bottom:2px;">
                                    🎯 ${d.title}
                                </div>
                                <div style="font-size:9.5px; color:#cbd5e1; line-height:1.4;">
                                    ${shortSummary}
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
                                <button class="step-mini-btn copy-single-prompt-btn" data-step="${d.step}" data-name="${d.agentName}" data-title="${d.title}" style="color:#38bdf8; border-color:#38bdf8;" title="Copiar prompt de este paso">
                                    📋 Copiar Prompt
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;

        // Bind master prompt copy button
        const masterBtn = document.getElementById('copyMasterPromptBtn');
        if (masterBtn) {
            masterBtn.addEventListener('click', () => {
                let masterPrompt = `Actúa como Desarrollador Senior para Criterio AI.\n`;
                masterPrompt += `Se acaba de completar la misión "${goal}" con ${total} especialistas.\n`;
                masterPrompt += `Abre el archivo AI_EXECUTION_QUEUE.md y la carpeta tasks/. Aplica e implementa de forma secuencial cada una de las directrices técnicas respetando la tipografía de peso 400, accesibilidad WCAG AA y canal verificado de WhatsApp +57 318 941 1010. Ejecuta las validaciones al concluir.`;

                navigator.clipboard.writeText(masterPrompt);
                if (window.gitConnector) {
                    window.gitConnector.showToast("📋 ¡Prompt Maestro copiado! Pégalo en Cursor (Ctrl+L) o Claude Code", "#f59e0b");
                }
                if (window.pixelAudio) window.pixelAudio.playSuccess();
            });
        }

        // Bind individual prompt copy buttons
        container.querySelectorAll('.copy-single-prompt-btn').forEach(b => {
            b.addEventListener('click', () => {
                const name = b.dataset.name;
                const title = b.dataset.title;
                const prompt = `Actúa como Desarrollador Senior para Criterio AI. Lee la tarea asignada por "${name}" (${title}). Aplica las modificaciones de código o copy descritas y ejecuta la verificación correspondiente.`;
                navigator.clipboard.writeText(prompt);
                if (window.gitConnector) {
                    window.gitConnector.showToast(`📋 Prompt para ${name} copiado!`, "#38bdf8");
                }
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        });
    }

    showExecutionModalCompleted(deliverables) {
        const progressBar = document.getElementById('execProgressBar');
        const progressPct = document.getElementById('execProgressPct');
        const statusText = document.getElementById('execStatusText');
        const copyBtn = document.getElementById('copyExecReportBtn');
        const syncGitBtn = document.getElementById('syncGitExecBtn');

        if (progressBar) progressBar.style.width = '100%';
        if (progressPct) progressPct.textContent = '100%';
        if (statusText) statusText.textContent = '✅ Reacción en Cadena Completada!';
        if (copyBtn) copyBtn.style.display = 'inline-flex';
        if (syncGitBtn) syncGitBtn.style.display = 'inline-flex';

        // Render compressed executive summary and automatically switch to it!
        this.renderCompressedExecutiveSummary(deliverables);
        this.switchExecView('summary');

        // If Git connector is active and auto_commit is enabled, auto-sync deliverables!
        if (window.gitConnector && window.gitConnector.config.auto_commit) {
            window.gitConnector.syncDeliverables(deliverables, window.chainReactionEngine.missionGoal);
        }
    }

    copyExecutionReport() {
        const deliverables = window.chainReactionEngine.generatedDeliverables;
        let text = `# Informe de Reacción en Cadena — Criterio AI\n\n`;
        text += `**Misión:** ${window.chainReactionEngine.missionGoal}\n`;
        text += `**Fecha:** ${new Date().toLocaleString()}\n`;
        text += `**Especialistas Convocados:** ${deliverables.length}\n\n---\n\n`;

        deliverables.forEach(d => {
            text += `## Paso ${d.step}: ${d.agentName} (${d.department})\n`;
            text += `### ${d.title}\n\n`;
            text += `${d.content}\n\n---\n\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            alert("¡Informe consolidado copiado al portapapeles en formato Markdown!");
        });
    }

    formatMarkdown(md) {
        if (!md) return '';
        return md
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:#0f172a; padding:1px 4px; border:1px solid #334155; color:#38bdf8;">$1</code>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }
}

window.disciplinesPanel = new DisciplinesPanel();
