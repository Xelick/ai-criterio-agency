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
    }

    init() {
        this.bindEvents();
        this.renderDisciplinesList();
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

        document.getElementById('tabDisciplinesContent').style.display = tab === 'disciplines' ? 'block' : 'none';
        document.getElementById('tabChainContent').style.display = tab === 'chain' ? 'block' : 'none';
        document.getElementById('tabPresetsContent').style.display = tab === 'presets' ? 'block' : 'none';

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
        const deliverableContainer = document.getElementById('execDeliverablesList');
        const progressBar = document.getElementById('execProgressBar');
        const progressPct = document.getElementById('execProgressPct');
        const statusText = document.getElementById('execStatusText');

        if (modal) modal.classList.remove('hidden');
        if (title) title.textContent = window.chainReactionEngine.missionGoal;
        if (logsContainer) logsContainer.innerHTML = '';
        if (deliverableContainer) deliverableContainer.innerHTML = '<div style="color:#64748b; font-size:11px; padding:10px;">Los entregables generados por cada agente aparecerán aquí...</div>';
        if (progressBar) progressBar.style.width = '0%';
        if (progressPct) progressPct.textContent = '0%';
        if (statusText) statusText.textContent = 'Iniciando secuencia...';
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
        if (!logsContainer) return;

        const line = document.createElement('div');
        line.className = `exec-log-line ${entry.type}`;
        line.innerHTML = `<span class="log-time">[${entry.time}]</span> ${entry.text}`;
        logsContainer.appendChild(line);
        logsContainer.scrollTop = logsContainer.scrollHeight;
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

    showExecutionModalCompleted(deliverables) {
        const progressBar = document.getElementById('execProgressBar');
        const progressPct = document.getElementById('execProgressPct');
        const statusText = document.getElementById('execStatusText');
        const copyBtn = document.getElementById('copyExecReportBtn');

        if (progressBar) progressBar.style.width = '100%';
        if (progressPct) progressPct.textContent = '100%';
        if (statusText) statusText.textContent = '✅ Reacción en Cadena Completada!';
        if (copyBtn) copyBtn.style.display = 'inline-flex';
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
