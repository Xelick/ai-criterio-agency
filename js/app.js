// Main Application Controller for AI_Criterio Pixel Agency
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Agents Database & Manager
    const success = await window.agentsManager.init();
    if (!success) {
        alert("Error cargando la base de datos de agentes.");
        return;
    }

    // 2. Initialize Pixel Canvas Engine
    const engine = new PixelOfficeEngine('officeCanvas');
    window.pixelEngine = engine;

    // Load initial floor (Floor 1)
    const initialAgents = window.agentsManager.getAgentsOnFloor(1);
    engine.setAgents(initialAgents, 1);

    // 3. UI Element References
    const floorButtons = document.querySelectorAll('.floor-btn');
    const directoryDrawer = document.getElementById('directoryDrawer');
    const toggleDirectoryBtn = document.getElementById('toggleDirectoryBtn');
    const directoryGrid = document.getElementById('directoryGrid');
    const searchInput = document.getElementById('agentSearchInput');
    const deptFilter = document.getElementById('deptFilter');

    const agentDrawer = document.getElementById('agentDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerAvatar = document.getElementById('drawerAvatar');
    const drawerAgentName = document.getElementById('drawerAgentName');
    const drawerDeptTag = document.getElementById('drawerDeptTag');
    const drawerVibe = document.getElementById('drawerVibe');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const teleportBtn = document.getElementById('teleportBtn');

    // Chat elements
    const chatTabBtn = document.getElementById('chatTabBtn');
    const dossierTabBtn = document.getElementById('dossierTabBtn');
    const chatTabContent = document.getElementById('chatTabContent');
    const dossierTabContent = document.getElementById('dossierTabContent');
    const chatHistory = document.getElementById('chatHistory');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const quickPromptsContainer = document.getElementById('quickPromptsContainer');

    // Modals
    const businessModal = document.getElementById('businessModal');
    const openBusinessBtn = document.getElementById('openBusinessBtn');
    const closeBusinessBtn = document.getElementById('closeBusinessBtn');
    const saveBusinessBtn = document.getElementById('saveBusinessBtn');

    const warRoomModal = document.getElementById('warRoomModal');
    const openWarRoomBtn = document.getElementById('openWarRoomBtn');
    const closeWarRoomBtn = document.getElementById('closeWarRoomBtn');
    const runWarRoomBtn = document.getElementById('runWarRoomBtn');

    const settingsModal = document.getElementById('settingsModal');
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    // HUD & Controls
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetViewBtn = document.getElementById('resetViewBtn');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const crtToggleBtn = document.getElementById('crtToggleBtn');

    // Stats
    const totalAgentsStat = document.getElementById('statTotalAgents');
    const floorAgentsStat = document.getElementById('statFloorAgents');
    const officeMoodStat = document.getElementById('statOfficeMood');

    totalAgentsStat.textContent = window.agentsManager.agentsSummary.length;
    floorAgentsStat.textContent = initialAgents.length;

    // Populate Department Filter Dropdown
    populateDepartmentFilter();

    // Initialize Disciplines & Chain Reaction Panel
    if (window.disciplinesPanel) {
        window.disciplinesPanel.init();
    }

    if (window.gitConnector) {
        window.gitConnector.init();
    }

    // Initialize Commander & Rally Controls
    initCommanderControls();

    const openDisciplinesTopBtn = document.getElementById('openDisciplinesTopBtn');
    if (openDisciplinesTopBtn) {
        openDisciplinesTopBtn.addEventListener('click', () => {
            const panel = document.getElementById('disciplinesPanel');
            if (panel) {
                if (panel.classList.contains('collapsed')) {
                    panel.classList.remove('collapsed');
                    window.disciplinesPanel.isOpen = true;
                    const toggleBtn = document.getElementById('toggleDisciplinesBtn');
                    if (toggleBtn) toggleBtn.innerHTML = '◀';
                }
                window.disciplinesPanel.switchTab('chain');
                if (window.pixelAudio) window.pixelAudio.playClick();
            }
        });
    }

    // 4. Floor Switching Logic
    floorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const floor = parseInt(btn.dataset.floor, 10);
            if (window.pixelAudio) window.pixelAudio.playElevator();

            floorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            window.agentsManager.currentFloor = floor;
            const agentsOnFloor = window.agentsManager.getAgentsOnFloor(floor);
            engine.setAgents(agentsOnFloor, floor);

            floorAgentsStat.textContent = agentsOnFloor.length;
            renderDirectory();
        });
    });

    // 5. Canvas Agent Selection Callback
    engine.onAgentSelected = (agent) => {
        openAgentDossier(agent);
    };

    function openAgentDossier(agent) {
        window.agentsManager.selectedAgent = agent;
        agentDrawer.classList.remove('hidden');

        drawerAvatar.textContent = agent.emoji || '🤖';
        drawerAvatar.style.borderColor = agent.color || '#f59e0b';
        drawerAgentName.textContent = agent.name;
        drawerDeptTag.textContent = `${agent.department_name} • Piso ${agent.floor}`;
        drawerVibe.textContent = `"${agent.vibe}"`;

        updateFavoriteButton(agent.id);

        // Render Dossier Tab
        renderDossierContent(agent);

        // Render Chat History
        loadAgentChat(agent);

        // Switch to chat tab by default
        switchTab('chat');
    }

    function renderDossierContent(agent) {
        const full = window.agentsManager.getAgentFull(agent.id) || agent;
        const sec = full.sections || {};

        let html = `
            <div class="dossier-box">
                <h3>Identidad & Misión para AI_Criterio</h3>
                <p>${agent.description}</p>
            </div>
            <div class="dossier-box">
                <h3>Herramientas & Entorno de Ejecución</h3>
                <p><strong>Stack:</strong> ${agent.tools || 'WebSearch, Prompting, Python'}</p>
                <p><strong>Zona Asignada:</strong> ${agent.zone || 'Oficina Central'} (Piso ${agent.floor})</p>
            </div>
        `;

        if (sec['Core Capabilities']) {
            html += `
                <div class="dossier-box">
                    <h3>Capacidades Principales</h3>
                    <div>${formatMarkdownBasic(sec['Core Capabilities'])}</div>
                </div>
            `;
        }

        if (sec['Specialized Skills']) {
            html += `
                <div class="dossier-box">
                    <h3>Habilidades Especializadas</h3>
                    <div>${formatMarkdownBasic(sec['Specialized Skills'])}</div>
                </div>
            `;
        }

        if (sec['Decision Framework']) {
            html += `
                <div class="dossier-box">
                    <h3>Marco de Decisión (Cuándo usar este agente)</h3>
                    <div>${formatMarkdownBasic(sec['Decision Framework'])}</div>
                </div>
            `;
        }

        if (sec['Success Metrics']) {
            html += `
                <div class="dossier-box">
                    <h3>Métricas de Éxito & KPIs</h3>
                    <div>${formatMarkdownBasic(sec['Success Metrics'])}</div>
                </div>
            `;
        }

        dossierTabContent.innerHTML = html;
    }

    function loadAgentChat(agent) {
        const history = window.consultationEngine.getChatHistory(agent.id);
        chatHistory.innerHTML = '';

        if (history.length === 0) {
            // Initial Welcome Message
            const welcomeText = `¡Hola! Soy **${agent.name}**, especialista en **${agent.department_name}** para **AI_Criterio**.\n\nEstoy listo para ayudarte a auditar, optimizar y escalar nuestro negocio. Puedes hacerme cualquier pregunta o seleccionar una acción rápida.`;
            appendChatMessage('agent', welcomeText, agent);
        } else {
            history.forEach(item => {
                appendChatMessage(item.sender, item.text, agent, false);
            });
        }

        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendChatMessage(sender, text, agent, save = true) {
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`;
        div.innerHTML = formatMarkdownBasic(text);
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        if (save) {
            const hist = window.consultationEngine.getChatHistory(agent.id);
            hist.push({ sender, text });
            window.consultationEngine.saveChatHistory(agent.id, hist);
        }
    }

    async function handleSendMessage() {
        const text = chatInput.value.trim();
        const agent = window.agentsManager.selectedAgent;
        if (!text || !agent) return;

        if (window.pixelAudio) window.pixelAudio.playClick();
        chatInput.value = '';

        appendChatMessage('user', text, agent);

        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg agent';
        typingDiv.innerHTML = `<em>${agent.emoji} ${agent.name} está analizando con criterio...</em>`;
        chatHistory.appendChild(typingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const biz = window.agentsManager.businessContext;
            const reply = await window.consultationEngine.askAgent(agent, text, biz);
            chatHistory.removeChild(typingDiv);
            if (window.pixelAudio) window.pixelAudio.playType();
            appendChatMessage('agent', reply, agent);
        } catch (err) {
            chatHistory.removeChild(typingDiv);
            appendChatMessage('agent', `⚠️ Ocurrió un error al procesar la respuesta: ${err.message}`, agent);
        }
    }

    sendChatBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Quick Prompts
    quickPromptsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-prompt-btn')) {
            const promptText = e.target.textContent;
            chatInput.value = promptText;
            handleSendMessage();
        }
    });

    // Close Drawer
    closeDrawerBtn.addEventListener('click', () => {
        agentDrawer.classList.add('hidden');
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    // Tab Switching
    chatTabBtn.addEventListener('click', () => switchTab('chat'));
    dossierTabBtn.addEventListener('click', () => switchTab('dossier'));

    function switchTab(tab) {
        if (tab === 'chat') {
            chatTabBtn.classList.add('active');
            dossierTabBtn.classList.remove('active');
            chatTabContent.style.display = 'flex';
            dossierTabContent.style.display = 'none';
        } else {
            dossierTabBtn.classList.add('active');
            chatTabBtn.classList.remove('active');
            chatTabContent.style.display = 'none';
            dossierTabContent.style.display = 'flex';
        }
    }

    // Teleport Button
    teleportBtn.addEventListener('click', () => {
        const agent = window.agentsManager.selectedAgent;
        if (!agent) return;

        // If agent is on another floor, switch floor first
        if (engine.currentFloor !== agent.floor) {
            const btn = document.querySelector(`.floor-btn[data-floor="${agent.floor}"]`);
            if (btn) btn.click();
        }
        engine.focusOnAgent(agent);
        if (window.pixelAudio) window.pixelAudio.playAgentSelect();
    });

    // Favorite Button
    favoriteBtn.addEventListener('click', () => {
        const agent = window.agentsManager.selectedAgent;
        if (!agent) return;
        window.agentsManager.toggleFavorite(agent.id);
        updateFavoriteButton(agent.id);
        if (window.pixelAudio) window.pixelAudio.playSuccess();
    });

    function updateFavoriteButton(agentId) {
        const isFav = window.agentsManager.isFavorite(agentId);
        favoriteBtn.textContent = isFav ? '⭐ Favorito' : '☆ Marcar Favorito';
        favoriteBtn.style.color = isFav ? '#f59e0b' : '#ffffff';
    }

    // Export single agent task to Git
    const exportAgentToGitBtn = document.getElementById('exportAgentToGitBtn');
    if (exportAgentToGitBtn) {
        exportAgentToGitBtn.addEventListener('click', () => {
            const agent = window.agentsManager.selectedAgent;
            if (!agent) return;
            if (window.gitConnector) {
                window.gitConnector.createSingleAgentTask(agent);
            }
        });
    }

    // 6. Directory / Roster Grid
    function renderDirectory() {
        const list = window.agentsManager.getFilteredAgents();
        directoryGrid.innerHTML = '';

        list.forEach(agent => {
            const card = document.createElement('div');
            card.className = `agent-card ${window.agentsManager.selectedAgent && window.agentsManager.selectedAgent.id === agent.id ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="agent-card-icon" style="border-color:${agent.color}">${agent.emoji || '🤖'}</div>
                <div class="agent-card-details">
                    <div class="agent-card-name">${agent.name}</div>
                    <div class="agent-card-dept">${agent.department_name} • P${agent.floor}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                if (window.pixelAudio) window.pixelAudio.playClick();
                // If on different floor, switch
                if (engine.currentFloor !== agent.floor) {
                    const btn = document.querySelector(`.floor-btn[data-floor="${agent.floor}"]`);
                    if (btn) btn.click();
                }
                engine.focusOnAgent(agent);
                openAgentDossier(agent);
            });
            directoryGrid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', (e) => {
        window.agentsManager.searchQuery = e.target.value;
        renderDirectory();
    });

    deptFilter.addEventListener('change', (e) => {
        window.agentsManager.selectedDepartment = e.target.value;
        renderDirectory();
    });

    toggleDirectoryBtn.addEventListener('click', () => {
        directoryDrawer.classList.toggle('collapsed');
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    function populateDepartmentFilter() {
        const depts = window.agentsManager.departments;
        deptFilter.innerHTML = '<option value="all">Todos los Departamentos (20)</option>';
        Object.keys(depts).forEach(k => {
            const d = depts[k];
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = `${d.icon} ${d.name}`;
            deptFilter.appendChild(opt);
        });
    }

    renderDirectory();

    // 7. Canvas Zoom & HUD Controls
    zoomInBtn.addEventListener('click', () => {
        engine.camera.zoom = Math.min(2.5, engine.camera.zoom + 0.25);
        engine.clampCamera();
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    zoomOutBtn.addEventListener('click', () => {
        engine.camera.zoom = Math.max(0.6, engine.camera.zoom - 0.25);
        engine.clampCamera();
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    resetViewBtn.addEventListener('click', () => {
        engine.camera.zoom = 1.0;
        engine.camera.x = Math.max(0, (engine.worldWidth - engine.canvas.width) / 2);
        engine.camera.y = 80;
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    soundToggleBtn.addEventListener('click', () => {
        const active = window.pixelAudio.toggleSound();
        soundToggleBtn.textContent = active ? '🔊 Audio: ON' : '🔇 Audio: OFF';
    });

    crtToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('crt-effect');
        crtToggleBtn.classList.toggle('btn-primary');
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    // 8. AI_Criterio Business Hub Modal
    openBusinessBtn.addEventListener('click', () => {
        const ctx = window.agentsManager.businessContext;
        document.getElementById('bizCompanyName').value = ctx.companyName;
        document.getElementById('bizTagline').value = ctx.tagline;
        document.getElementById('bizMission').value = ctx.mission;
        document.getElementById('bizTarget').value = ctx.targetAudience;
        document.getElementById('bizGoal').value = ctx.currentGoal;
        document.getElementById('bizProjects').value = ctx.activeProjects.join('\n');

        businessModal.classList.remove('hidden');
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    closeBusinessBtn.addEventListener('click', () => {
        businessModal.classList.add('hidden');
    });

    saveBusinessBtn.addEventListener('click', () => {
        const ctx = {
            companyName: document.getElementById('bizCompanyName').value.trim() || 'AI_Criterio',
            tagline: document.getElementById('bizTagline').value.trim(),
            mission: document.getElementById('bizMission').value.trim(),
            targetAudience: document.getElementById('bizTarget').value.trim(),
            currentGoal: document.getElementById('bizGoal').value.trim(),
            pillars: window.agentsManager.businessContext.pillars,
            activeProjects: document.getElementById('bizProjects').value.split('\n').map(p => p.trim()).filter(Boolean)
        };
        window.agentsManager.saveBusinessContext(ctx);
        businessModal.classList.add('hidden');
        if (window.pixelAudio) window.pixelAudio.playSuccess();
        alert("¡Contexto de negocio de AI_Criterio guardado con éxito! Todos los agentes han actualizado sus prioridades.");
    });

    // 9. War Room / Boardroom Meeting Modal
    const warRoomMissionSelect = document.getElementById('warRoomMissionSelect');
    const warRoomMissionInput = document.getElementById('warRoomMissionInput');
    const warRoomTeamContainer = document.getElementById('warRoomTeamContainer');
    const warRoomMeetingLogs = document.getElementById('warRoomMeetingLogs');

    openWarRoomBtn.addEventListener('click', () => {
        populateWarRoomMissions();
        warRoomModal.classList.remove('hidden');
        if (window.pixelAudio) window.pixelAudio.playMeetingStart();
    });

    closeWarRoomBtn.addEventListener('click', () => {
        warRoomModal.classList.add('hidden');
    });

    function populateWarRoomMissions() {
        const presets = window.warRoomManager.getPresetMissions();
        warRoomMissionSelect.innerHTML = '<option value="">-- Elige una Misión Predefinida o escribe una abajo --</option>';
        presets.forEach((p, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = `${p.title}`;
            warRoomMissionSelect.appendChild(opt);
        });

        // Set default auto team
        selectPresetMission(0);
    }

    warRoomMissionSelect.addEventListener('change', (e) => {
        if (e.target.value !== '') {
            selectPresetMission(parseInt(e.target.value, 10));
        }
    });

    function selectPresetMission(idx) {
        const presets = window.warRoomManager.getPresetMissions();
        const p = presets[idx];
        if (!p) return;
        warRoomMissionInput.value = p.desc;
        const team = window.warRoomManager.autoSelectTeam(p.deptFocus);
        renderWarRoomTeam(team);
    }

    function renderWarRoomTeam(team) {
        warRoomTeamContainer.innerHTML = '';
        team.forEach(agent => {
            const tag = document.createElement('div');
            tag.className = 'agent-card';
            tag.style.padding = '4px 8px';
            tag.innerHTML = `
                <span style="font-size: 16px;">${agent.emoji}</span>
                <div>
                    <div style="font-size: 10px; font-weight: bold;">${agent.name}</div>
                    <div style="font-size: 8px; color: #06b6d4;">${agent.department_name}</div>
                </div>
            `;
            warRoomTeamContainer.appendChild(tag);
        });
    }

    runWarRoomBtn.addEventListener('click', async () => {
        const mission = warRoomMissionInput.value.trim();
        if (!mission) {
            alert("Por favor introduce una misión estratégica para la reunión.");
            return;
        }

        runWarRoomBtn.disabled = true;
        runWarRoomBtn.textContent = 'En Sesión Plenaria...';
        warRoomMeetingLogs.innerHTML = '';

        await window.warRoomManager.runMeeting(
            mission,
            window.warRoomManager.selectedAgents,
            (log) => {
                const item = document.createElement('div');
                item.className = 'chat-msg agent';
                item.style.marginBottom = '8px';
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <strong style="color:${log.color}">${log.emoji} ${log.speaker}</strong>
                        <span style="font-size:9px; color:#9ca3af;">${log.dept} • ${log.timestamp}</span>
                    </div>
                    <div>${formatMarkdownBasic(log.text)}</div>
                `;
                warRoomMeetingLogs.appendChild(item);
                warRoomMeetingLogs.scrollTop = warRoomMeetingLogs.scrollHeight;
            },
            (finalPlan) => {
                runWarRoomBtn.disabled = false;
                runWarRoomBtn.textContent = 'Convocar Otra Sesión';
            }
        );
    });

    // 10. Settings Modal
    openSettingsBtn.addEventListener('click', () => {
        document.getElementById('apiProviderSelect').value = window.consultationEngine.apiProvider;
        document.getElementById('apiKeyInput').value = window.consultationEngine.apiKey;
        document.getElementById('bgmToggleCheckbox').checked = window.pixelAudio.bgmPlaying;
        settingsModal.classList.remove('hidden');
        if (window.pixelAudio) window.pixelAudio.playClick();
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    saveSettingsBtn.addEventListener('click', () => {
        const prov = document.getElementById('apiProviderSelect').value;
        const key = document.getElementById('apiKeyInput').value.trim();
        window.consultationEngine.setApiConfig(prov, key);

        const wantBgm = document.getElementById('bgmToggleCheckbox').checked;
        if (wantBgm && !window.pixelAudio.bgmPlaying) {
            window.pixelAudio.startBgm();
        } else if (!wantBgm && window.pixelAudio.bgmPlaying) {
            window.pixelAudio.stopBgm();
        }

        settingsModal.classList.add('hidden');
        if (window.pixelAudio) window.pixelAudio.playSuccess();
        alert("Configuraciones guardadas.");
    });

    // 11. Taskforce 38 Modal & Fronts Navigation
    const taskforceModal = document.getElementById('taskforceModal');
    const openTaskforceBtn = document.getElementById('openTaskforceBtn');
    const closeTaskforceBtn = document.getElementById('closeTaskforceBtn');
    const taskforceFrontsTabs = document.getElementById('taskforceFrontsTabs');
    const taskforceListContainer = document.getElementById('taskforceListContainer');
    const highlightTaskforceOnCanvasBtn = document.getElementById('highlightTaskforceOnCanvasBtn');

    let currentFrontFilter = 'all';

    if (openTaskforceBtn) {
        openTaskforceBtn.addEventListener('click', () => {
            renderTaskforceTabs();
            renderTaskforceList();
            taskforceModal.classList.remove('hidden');
            if (window.pixelAudio) window.pixelAudio.playAgentSelect();
        });
    }

    if (closeTaskforceBtn) {
        closeTaskforceBtn.addEventListener('click', () => {
            taskforceModal.classList.add('hidden');
        });
    }

    function renderTaskforceTabs() {
        if (!taskforceFrontsTabs || !window.CRITERIO_TASKFORCE_38) return;
        const fronts = [
            { id: 'all', name: 'Todos los Frentes (38)', icon: '🔥' },
            { id: 'Ingeniería & Web', name: 'Ingeniería & Web (8)', icon: '💻' },
            { id: 'Diseño & Sistema', name: 'Diseño & Sistema (6)', icon: '🎨' },
            { id: 'Testing & QA', name: 'Testing & QA (4)', icon: '🧪' },
            { id: 'Marketing & Growth', name: 'Marketing & Growth (7)', icon: '🚀' },
            { id: 'Ventas & Prospección', name: 'Ventas & Prospección (4)', icon: '🤝' },
            { id: 'Estrategia & Dirección', name: 'Estrategia & Legal (5)', icon: '♟️' },
            { id: 'Producto & Innovación', name: 'Producto & IA (4)', icon: '💡' },
        ];

        taskforceFrontsTabs.innerHTML = '';
        fronts.forEach(f => {
            const btn = document.createElement('button');
            btn.className = `quick-prompt-btn ${currentFrontFilter === f.id ? 'btn-primary' : ''}`;
            btn.style.fontSize = '10px';
            btn.style.padding = '4px 8px';
            if (currentFrontFilter === f.id) {
                btn.style.backgroundColor = '#e11d48';
                btn.style.color = '#fff';
            }
            btn.innerHTML = `${f.icon} ${f.name}`;
            btn.addEventListener('click', () => {
                currentFrontFilter = f.id;
                renderTaskforceTabs();
                renderTaskforceList();
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
            taskforceFrontsTabs.appendChild(btn);
        });
    }

    function renderTaskforceList() {
        if (!taskforceListContainer || !window.CRITERIO_TASKFORCE_38) return;
        let list = window.CRITERIO_TASKFORCE_38;
        if (currentFrontFilter !== 'all') {
            list = list.filter(item => item.front === currentFrontFilter);
        }

        taskforceListContainer.innerHTML = '';
        list.forEach(tf => {
            const baseAgent = window.agentsManager.agentsSummary.find(a => a.id === tf.id) || {};
            const card = document.createElement('div');
            card.className = 'dossier-box';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '6px';
            card.style.borderLeft = '3px solid #e11d48';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:20px;">${baseAgent.emoji || '🤖'}</span>
                        <div>
                            <strong style="color:#ffffff; font-size:12px;">${baseAgent.name || tf.role}</strong>
                            <div style="font-size:9px; color:#38bdf8;">${tf.frontIcon} ${tf.front} • Piso ${baseAgent.floor || 1}</div>
                        </div>
                    </div>
                    <span style="background:#065f46; color:#34d399; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:3px;">
                        ${tf.status}
                    </span>
                </div>
                <div style="font-size:11px; color:#fde047; font-weight:bold;">
                    🎯 Tarea: ${tf.task}
                </div>
                <div style="font-size:10px; color:#cbd5e1; max-height:85px; overflow-y:auto; background:#0b0f19; padding:6px; border:1px solid #1e293b;">
                    ${formatMarkdownBasic(tf.deliverable)}
                </div>
                <div style="display:flex; gap:8px; margin-top:4px;">
                    <button class="action-btn go-desk-btn" style="flex:1; font-size:10px; padding:3px 6px;">
                        🎯 Ir a su Escritorio
                    </button>
                    <button class="action-btn btn-gold consult-tf-btn" style="flex:1; font-size:10px; padding:3px 6px;">
                        💬 Consultar
                    </button>
                </div>
            `;

            card.querySelector('.go-desk-btn').addEventListener('click', () => {
                taskforceModal.classList.add('hidden');
                if (baseAgent.floor && engine.currentFloor !== baseAgent.floor) {
                    const fBtn = document.querySelector(`.floor-btn[data-floor="${baseAgent.floor}"]`);
                    if (fBtn) fBtn.click();
                }
                engine.focusOnAgent(baseAgent);
                openAgentDossier(baseAgent);
            });

            card.querySelector('.consult-tf-btn').addEventListener('click', () => {
                taskforceModal.classList.add('hidden');
                openAgentDossier(baseAgent);
            });

            taskforceListContainer.appendChild(card);
        });
    }

    if (highlightTaskforceOnCanvasBtn) {
        highlightTaskforceOnCanvasBtn.addEventListener('click', () => {
            window.agentsManager.onlyTaskforce = !window.agentsManager.onlyTaskforce;
            highlightTaskforceOnCanvasBtn.textContent = window.agentsManager.onlyTaskforce ? '★ Mostrando Solo los 38 Agentes' : '🎯 Resaltar en la Oficina Virtual';
            renderDirectory();
            taskforceModal.classList.add('hidden');
            if (window.pixelAudio) window.pixelAudio.playSuccess();
        });
    }

    // Agent Operations Guide Modal
    const opsGuideModal = document.getElementById('agentOpsGuideModal');
    const openOpsGuideBtn = document.getElementById('openOpsGuideBtn');
    const closeOpsGuideModalBtn = document.getElementById('closeOpsGuideModalBtn');
    const closeOpsGuideFooterBtn = document.getElementById('closeOpsGuideFooterBtn');

    if (openOpsGuideBtn && opsGuideModal) {
        openOpsGuideBtn.addEventListener('click', () => {
            opsGuideModal.classList.remove('hidden');
            if (window.pixelAudio) window.pixelAudio.playClick();
        });
    }

    if (closeOpsGuideModalBtn && opsGuideModal) {
        closeOpsGuideModalBtn.addEventListener('click', () => {
            opsGuideModal.classList.add('hidden');
            if (window.pixelAudio) window.pixelAudio.playClick();
        });
    }

    if (closeOpsGuideFooterBtn && opsGuideModal) {
        closeOpsGuideFooterBtn.addEventListener('click', () => {
            opsGuideModal.classList.add('hidden');
            if (window.pixelAudio) window.pixelAudio.playSuccess();
        });
    }

    // -------------------------------------------------------------
    // COMMANDER & RALLY CONTROLS (Department & Coalition Management)
    // -------------------------------------------------------------
    function initCommanderControls() {
        const deptSelect = document.getElementById('commanderDeptSelect');
        const rallyBtn = document.getElementById('cmdRallyBtn');
        const sprintBtn = document.getElementById('cmdSprintBtn');
        const meetingBtn = document.getElementById('cmdMeetingBtn');
        const coffeeBtn = document.getElementById('cmdCoffeeBtn');
        const returnBtn = document.getElementById('cmdReturnBtn');
        const executeChainBtn = document.getElementById('cmdExecuteChainBtn');

        if (!deptSelect) return;

        // Auto-switch to floor if selecting a single department that lives elsewhere
        const deptFloorMap = {
            'dept_engineering': 2,
            'dept_design': 3,
            'dept_sales': 1,
            'dept_marketing': 1,
            'dept_testing': 2,
            'dept_security': 2,
            'dept_product': 3,
            'dept_finance': 5,
            'dept_strategy': 5,
            'dept_gis': 4,
            'dept_game-development': 3,
            'dept_academic': 4,
            'dept_support': 1,
            'dept_paid-media': 1,
            'dept_specialized': 5
        };

        function ensureFloorForSelection(key) {
            const targetFloor = deptFloorMap[key];
            if (targetFloor && targetFloor !== window.agentsManager.currentFloor) {
                const targetFloorBtn = document.querySelector(`.floor-btn[data-floor="${targetFloor}"]`);
                if (targetFloorBtn) {
                    targetFloorBtn.click();
                }
            }
        }

        if (rallyBtn) {
            rallyBtn.addEventListener('click', () => {
                const key = deptSelect.value;
                ensureFloorForSelection(key);
                setTimeout(() => {
                    engine.rallySquad(key);
                }, 120);
            });
        }

        if (sprintBtn) {
            sprintBtn.addEventListener('click', () => {
                const key = deptSelect.value;
                ensureFloorForSelection(key);
                setTimeout(() => {
                    engine.commandSprint(key);
                }, 120);
            });
        }

        if (meetingBtn) {
            meetingBtn.addEventListener('click', () => {
                const key = deptSelect.value;
                ensureFloorForSelection(key);
                setTimeout(() => {
                    engine.commandWarRoom(key);
                }, 120);
            });
        }

        if (coffeeBtn) {
            coffeeBtn.addEventListener('click', () => {
                const key = deptSelect.value;
                ensureFloorForSelection(key);
                setTimeout(() => {
                    engine.commandCoffeeBreak(key);
                }, 120);
            });
        }

        if (returnBtn) {
            returnBtn.addEventListener('click', () => {
                const key = deptSelect.value;
                engine.commandReturnToDesks(key);
            });
        }

        if (executeChainBtn) {
            executeChainBtn.addEventListener('click', () => {
                const key = deptSelect.value;
                const squad = engine.getAgentsForSelection(key);
                if (!squad || squad.length === 0) return;

                // Open disciplines panel & switch to chain tab
                const panel = document.getElementById('disciplinesPanel');
                if (panel && panel.classList.contains('collapsed')) {
                    panel.classList.remove('collapsed');
                    window.disciplinesPanel.isOpen = true;
                    const toggleBtn = document.getElementById('toggleDisciplinesBtn');
                    if (toggleBtn) toggleBtn.innerHTML = '◀';
                }

                if (window.disciplinesPanel) {
                    window.disciplinesPanel.switchTab('chain');
                    // Add squad agents to chain pipeline
                    squad.slice(0, 5).forEach((agent, idx) => {
                        window.disciplinesPanel.addAgentToChain(agent.id, `Fase ${idx + 1}: ${agent.name} liderando entregable en ${agent.department_name}`);
                    });
                    const goalInput = document.getElementById('chainMissionGoalInput');
                    if (goalInput) {
                        const optText = deptSelect.options[deptSelect.selectedIndex].text;
                        goalInput.value = `Misión Conjunta: [${optText}] ejecutando entregables de alta prioridad para Criterio AI`;
                    }
                }
                engine.showToast(`⚡ Escuadrón cargado en la Cadena de Ejecución`, '#059669');
                if (window.pixelAudio) window.pixelAudio.playSuccess();
            });
        }
    }

    // Markdown Parser Helper for Chat Messages
    function formatMarkdownBasic(md) {
        if (!md) return '';
        let html = md
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Headers
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

        // Bold & Italic
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

        // Blockquotes
        html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Unordered lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Line breaks
        html = html.replace(/\n\n/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');

        return html;
    }
});
