// Git Repository Connector & AI Deliverable Dispatcher for Criterio AI
// Connects Pixel Office agents to local / remote Git repos and generates 
// machine-readable Markdown task specs for downstream AIs (Cursor, Claude Code, Antigravity, Copilot)

class GitConnector {
    constructor() {
        this.status = {
            is_git_repo: false,
            branch: 'main',
            remote_url: '',
            dirty_files: [],
            recent_commits: [],
            deliverables: [],
            total_deliverables: 0
        };
        this.config = {
            repo_path: '',
            remote_url: '',
            branch: 'main',
            auto_commit: true,
            downstream_ai: 'Cursor / Claude Code / Antigravity'
        };
        this.activeTab = 'queue'; // 'queue' | 'config' | 'files' | 'terminal'
        this.currentSelectedFile = null;
    }

    init() {
        this.bindUiEvents();
        this.fetchStatus();
        this.fetchDeliverables();

        // Check status periodically every 15s
        setInterval(() => this.fetchStatus(true), 15000);
    }

    bindUiEvents() {
        // Top header button to open Git modal
        const openBtn = document.getElementById('openGitRepoBtn');
        const modal = document.getElementById('gitRepoModal');
        const closeBtn = document.getElementById('closeGitRepoModal');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                this.fetchStatus();
                this.fetchDeliverables();
                modal.classList.remove('hidden');
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        }

        // Modal navigation tabs
        const tabBtns = document.querySelectorAll('.git-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
                if (window.pixelAudio) window.pixelAudio.playClick();
            });
        });

        // Config form buttons
        const saveCfgBtn = document.getElementById('saveGitConfigBtn');
        if (saveCfgBtn) {
            saveCfgBtn.addEventListener('click', () => this.saveConfigFromForm());
        }

        const initGitBtn = document.getElementById('initGitRepoBtn');
        if (initGitBtn) {
            initGitBtn.addEventListener('click', () => this.initGitRepo());
        }

        // Direct commit and push buttons
        const directCommitBtn = document.getElementById('directGitCommitBtn');
        if (directCommitBtn) {
            directCommitBtn.addEventListener('click', () => this.doDirectCommit());
        }

        const pushRemoteBtn = document.getElementById('pushGitRemoteBtn');
        if (pushRemoteBtn) {
            pushRemoteBtn.addEventListener('click', () => this.doPushRemote());
        }

        // Refresh status button in modal
        const refreshBtn = document.getElementById('refreshGitStatusBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.fetchStatus();
                this.fetchDeliverables();
                if (window.pixelAudio) window.pixelAudio.playLaser();
            });
        }

        // Hook into Chain Reaction Engine button
        const syncExecBtn = document.getElementById('syncGitExecBtn');
        if (syncExecBtn) {
            syncExecBtn.addEventListener('click', () => {
                const deliverables = window.chainReactionEngine.generatedDeliverables;
                const goal = window.chainReactionEngine.missionGoal;
                this.syncDeliverables(deliverables, goal);
            });
        }
    }

    switchTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('.git-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tab);
        });

        document.querySelectorAll('.git-tab-content').forEach(c => {
            c.style.display = 'none';
        });

        const activeContent = document.getElementById(`gitTab_${tab}`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }

        if (tab === 'queue') this.renderQueueTab();
        if (tab === 'files') this.renderFilesTab();
        if (tab === 'terminal') this.renderTerminalTab();
        if (tab === 'config') this.renderConfigTab();
    }

    async fetchStatus(silent = false) {
        try {
            const [statusRes, configRes] = await Promise.all([
                fetch('/api/git/status').then(r => r.json()),
                fetch('/api/git/config').then(r => r.json())
            ]);

            this.status = statusRes;
            this.config = configRes;
            this.updateHeaderBadges();

            if (!silent) {
                if (this.activeTab === 'queue') this.renderQueueTab();
                if (this.activeTab === 'config') this.renderConfigTab();
                if (this.activeTab === 'terminal') this.renderTerminalTab();
            }
        } catch (err) {
            console.warn("[GitConnector] Could not connect to /api/git endpoint:", err);
            this.updateHeaderBadges(false);
        }
    }

    async fetchDeliverables() {
        try {
            const res = await fetch('/api/git/deliverables').then(r => r.json());
            if (res && res.deliverables) {
                this.status.deliverables = res.deliverables;
                this.status.total_deliverables = res.total;
                if (this.activeTab === 'files') this.renderFilesTab();
                if (this.activeTab === 'queue') this.renderQueueTab();
            }
        } catch (err) {
            console.warn("[GitConnector] Error fetching deliverables:", err);
        }
    }

    updateHeaderBadges(connected = true) {
        const branchBadge = document.getElementById('gitBranchBadge');
        const dot = document.querySelector('.git-status-dot');

        if (branchBadge) {
            branchBadge.textContent = this.status.branch || 'main';
        }

        if (dot) {
            if (!connected) {
                dot.textContent = '⚪';
                dot.title = 'Servidor local sin conexión Git';
            } else if (this.status.is_git_repo) {
                dot.textContent = '🟢';
                dot.title = `Conectado: ${this.status.repo_path} (${this.status.branch})`;
            } else {
                dot.textContent = '🟡';
                dot.title = 'Repositorio no inicializado (Click para configurar)';
            }
        }
    }

    renderConfigTab() {
        const repoPathInput = document.getElementById('gitRepoPathInput');
        const remoteUrlInput = document.getElementById('gitRemoteUrlInput');
        const branchInput = document.getElementById('gitBranchInput');
        const autoCommitCheck = document.getElementById('gitAutoCommitCheck');
        const downstreamSelect = document.getElementById('gitDownstreamAiSelect');

        if (repoPathInput) repoPathInput.value = this.config.repo_path || this.status.repo_path || '';
        if (remoteUrlInput) remoteUrlInput.value = this.config.remote_url || this.status.remote_url || '';
        if (branchInput) branchInput.value = this.config.branch || this.status.branch || 'main';
        if (autoCommitCheck) autoCommitCheck.checked = (this.config.auto_commit !== false);
        if (downstreamSelect && this.config.downstream_ai) downstreamSelect.value = this.config.downstream_ai;

        const infoBox = document.getElementById('gitRepoStatusBanner');
        if (infoBox) {
            if (this.status.is_git_repo) {
                infoBox.className = 'git-banner git-banner-success';
                infoBox.innerHTML = `
                    <div style="font-weight:bold; color:#34d399; font-size:11px;">✔ Repositorio Git Conectado y Operativo</div>
                    <div style="color:#94a3b8; font-size:10px; margin-top:3px;">
                        <strong>Ruta:</strong> <code>${this.status.repo_path}</code> | <strong>Rama Activa:</strong> <code>${this.status.branch}</code>
                    </div>
                `;
            } else {
                infoBox.className = 'git-banner git-banner-warning';
                infoBox.innerHTML = `
                    <div style="font-weight:bold; color:#fbbf24; font-size:11px;">⚠️ Carpeta sin Repositorio Git Inicializado</div>
                    <div style="color:#94a3b8; font-size:10px; margin-top:3px;">
                        Presiona <strong>"Inicializar Git"</strong> para habilitar control de versiones y commits automáticos.
                    </div>
                `;
            }
        }
    }

    async saveConfigFromForm() {
        const repoPath = document.getElementById('gitRepoPathInput')?.value.trim();
        const remoteUrl = document.getElementById('gitRemoteUrlInput')?.value.trim();
        const branch = document.getElementById('gitBranchInput')?.value.trim() || 'main';
        const autoCommit = document.getElementById('gitAutoCommitCheck')?.checked;
        const downstreamAi = document.getElementById('gitDownstreamAiSelect')?.value;

        const payload = {
            repo_path: repoPath,
            remote_url: remoteUrl,
            branch: branch,
            auto_commit: autoCommit,
            downstream_ai: downstreamAi
        };

        try {
            const res = await fetch('/api/git/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json());

            if (res.success) {
                this.config = res.config;
                this.showToast('💾 Configuración de repositorio Git guardada!', '#34d399');
                if (window.pixelAudio) window.pixelAudio.playSuccess();
                this.fetchStatus();
            }
        } catch (err) {
            alert('Error al guardar configuración Git: ' + err.message);
        }
    }

    async initGitRepo() {
        try {
            const res = await fetch('/api/git/init', { method: 'POST' }).then(r => r.json());
            if (res.success) {
                this.showToast('⚡ ¡Repositorio Git inicializado exitosamente en rama main!', '#00f0ff');
                if (window.pixelAudio) window.pixelAudio.playPowerUp();
                this.fetchStatus();
            } else {
                alert('No se pudo inicializar git: ' + (res.error || 'error desconocido'));
            }
        } catch (err) {
            alert('Error invocando /api/git/init: ' + err.message);
        }
    }

    async syncDeliverables(deliverables, missionGoal = "Criterio AI Sprint") {
        if (!deliverables || deliverables.length === 0) {
            alert("No hay entregables en la cola para sincronizar.");
            return;
        }

        const btn = document.getElementById('syncGitExecBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '⏳ Sincronizando y Commiteando...';
        }

        try {
            const payload = {
                mission_goal: missionGoal,
                auto_commit: this.config.auto_commit !== false,
                deliverables: deliverables
            };

            const res = await fetch('/api/git/deliverables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json());

            if (res.success) {
                const commitHash = res.commit && res.commit.hash ? res.commit.hash : 'listo';
                this.showToast(`🐙 ¡${res.saved_count} entregables .md guardados en tasks/ y commiteados! [${commitHash}]`, '#00f0ff');
                if (window.pixelAudio) window.pixelAudio.playSuccess();
                
                // Refresh list
                this.fetchDeliverables();
                this.fetchStatus();

                if (btn) {
                    btn.textContent = `✔ Sincronizado (${commitHash})`;
                    btn.style.backgroundColor = '#059669';
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = '🐙 Guardar y Commitear en Git';
                        btn.style.backgroundColor = '';
                    }, 4000);
                }
            } else {
                alert('Error al guardar entregables: ' + JSON.stringify(res));
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = '🐙 Guardar y Commitear en Git';
                }
            }
        } catch (err) {
            console.error("Error in syncDeliverables:", err);
            alert("Error de comunicación con el conector Git: " + err.message);
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🐙 Guardar y Commitear en Git';
            }
        }
    }

    async createSingleAgentTask(agent) {
        if (!agent) return;

        const goal = `Resolver requerimiento con especialista ${agent.name} (${agent.department_name})`;
        const taskforceInfo = agent.taskforceInfo || {};

        const deliverable = {
            step: 1,
            agentId: agent.id,
            agentName: agent.name,
            department: agent.department_name,
            title: taskforceInfo.task || `Plan de Acción de ${agent.name}`,
            content: taskforceInfo.deliverable || `Requerimiento analizado por ${agent.name}.\n\n* Enfoque: ${agent.vibe}\n* Solución técnica generada para implementación inmediata.`,
            target_files: ["src/pages/briefing.html", "src/styles/criterio.css"]
        };

        await this.syncDeliverables([deliverable], goal);
    }

    renderQueueTab() {
        const container = document.getElementById('gitQueueListContainer');
        if (!container) return;

        const deliverables = this.status.deliverables || [];

        if (deliverables.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:35px 20px; color:#64748b;">
                    <div style="font-size:32px; margin-bottom:8px;">📋</div>
                    <div style="font-weight:bold; color:#cbd5e1; font-size:12px;">No hay tareas en la cola todavía</div>
                    <div style="font-size:10px; margin-top:4px; max-width:400px; margin-left:auto; margin-right:auto;">
                        Dispara una <strong>Reacción en Cadena</strong> o genera una tarea desde la ficha de cualquier NPC para que los especialistas creen archivos <code>.md</code> de acción para Cursor y Claude Code.
                    </div>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:8px 12px; border:1px solid #334155;">
                <div style="font-size:11px; color:#38bdf8;">
                    <strong>${deliverables.length}</strong> tareas generadas listas para Cursor / Claude Code
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="step-mini-btn" id="openQueueMdBtn" style="color:#fde047; border-color:#fde047;" title="Ver archivo maestro AI_EXECUTION_QUEUE.md">
                        📄 Ver AI_EXECUTION_QUEUE.md
                    </button>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
        `;

        deliverables.forEach(d => {
            const cleanName = d.filename.replace('.md', '');
            html += `
                <div class="git-task-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <span class="git-task-pill pill-ready">READY FOR AI</span>
                            <span style="font-weight:bold; color:#ffffff; font-size:11px; margin-left:6px;">
                                ${d.filename}
                            </span>
                        </div>
                        <span style="font-size:9px; color:#94a3b8;">${d.modified || ''}</span>
                    </div>
                    <div style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:10px; color:#64748b;">Ruta: <code>tasks/${d.filename}</code></span>
                        <div style="display:flex; gap:6px;">
                            <button class="copy-prompt-btn" data-file="${d.filename}" title="Copiar prompt listo para Cursor / Claude">
                                📋 Copiar Prompt
                            </button>
                            <button class="view-task-md-btn" data-file="${d.filename}" title="Ver contenido Markdown">
                                👁️ Ver MD
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

        // Bind copy buttons
        container.querySelectorAll('.copy-prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const fname = btn.dataset.file;
                this.copyPromptForFile(fname);
            });
        });

        // Bind view md buttons
        container.querySelectorAll('.view-task-md-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const fname = btn.dataset.file;
                this.viewFileContent(fname);
            });
        });

        const openQueueBtn = document.getElementById('openQueueMdBtn');
        if (openQueueBtn) {
            openQueueBtn.addEventListener('click', () => {
                this.switchTab('files');
            });
        }
    }

    copyPromptForFile(filename) {
        const prompt = `Actúa como Desarrollador Senior para Criterio AI. Abre e inspecciona el archivo tasks/${filename}. Lee el contexto del especialista y las directrices arquitectónicas, aplica de forma exacta los cambios requeridos en el código fuente (respetando la tipografía de peso 400 y WCAG AA) y ejecuta los comandos de verificación descritos.`;
        navigator.clipboard.writeText(prompt);
        this.showToast(`📋 ¡Prompt para ${filename} copiado! Pégalo en Cursor (Ctrl+L) o Claude Code.`, '#f59e0b');
        if (window.pixelAudio) window.pixelAudio.playClick();
    }

    renderFilesTab() {
        const fileListContainer = document.getElementById('gitFilesList');
        const fileViewerContainer = document.getElementById('gitFileViewerContent');
        const fileTitleHeader = document.getElementById('gitFileViewerTitle');

        if (!fileListContainer) return;

        const deliverables = this.status.deliverables || [];

        let listHtml = `
            <div class="git-file-tree-item ${this.currentSelectedFile === 'AI_EXECUTION_QUEUE.md' ? 'active' : ''}" data-file="AI_EXECUTION_QUEUE.md">
                <span>🤖</span> <strong>AI_EXECUTION_QUEUE.md</strong>
            </div>
            <div style="font-size:9px; font-weight:bold; color:#64748b; padding:6px 8px 2px 8px; text-transform:uppercase;">
                📁 tasks/ (${deliverables.length} archivos)
            </div>
        `;

        deliverables.forEach(d => {
            const isSel = (this.currentSelectedFile === d.filename);
            listHtml += `
                <div class="git-file-tree-item ${isSel ? 'active' : ''}" data-file="${d.filename}">
                    <span>📄</span> ${d.filename}
                </div>
            `;
        });

        fileListContainer.innerHTML = listHtml;

        fileListContainer.querySelectorAll('.git-file-tree-item').forEach(item => {
            item.addEventListener('click', () => {
                const file = item.dataset.file;
                this.viewFileContent(file);
            });
        });

        // Load currently selected or first file
        if (!this.currentSelectedFile && deliverables.length > 0) {
            this.currentSelectedFile = deliverables[0].filename;
        }

        if (this.currentSelectedFile) {
            this.viewFileContent(this.currentSelectedFile);
        }
    }

    async viewFileContent(filename) {
        this.currentSelectedFile = filename;
        const fileTitleHeader = document.getElementById('gitFileViewerTitle');
        const fileViewerContainer = document.getElementById('gitFileViewerContent');

        if (fileTitleHeader) fileTitleHeader.textContent = filename;
        if (fileViewerContainer) fileViewerContainer.textContent = "Cargando archivo...";

        try {
            let content = '';
            if (filename === 'AI_EXECUTION_QUEUE.md') {
                const res = await fetch('/AI_EXECUTION_QUEUE.md');
                content = await res.text();
            } else {
                const res = await fetch(`/tasks/${filename}`);
                content = await res.text();
            }

            if (fileViewerContainer) {
                fileViewerContainer.textContent = content;
            }
        } catch (err) {
            if (fileViewerContainer) {
                fileViewerContainer.textContent = `Error al leer archivo: ${err.message}`;
            }
        }

        // Highlight in list
        document.querySelectorAll('.git-file-tree-item').forEach(el => {
            el.classList.toggle('active', el.dataset.file === filename);
        });
    }

    renderTerminalTab() {
        const branchLabel = document.getElementById('gitTermBranch');
        const dirtyBox = document.getElementById('gitTermDirty');
        const logBox = document.getElementById('gitTermLog');

        if (branchLabel) branchLabel.textContent = this.status.branch || 'main';

        if (dirtyBox) {
            const dirty = this.status.dirty_files || [];
            if (dirty.length === 0) {
                dirtyBox.innerHTML = '<span style="color:#34d399;">✔ Rama de trabajo limpia (Working tree clean). No hay cambios pendientes.</span>';
            } else {
                dirtyBox.innerHTML = dirty.map(f => `<div style="color:#fbbf24;">• ${f}</div>`).join('');
            }
        }

        if (logBox) {
            const commits = this.status.recent_commits || [];
            if (commits.length === 0) {
                logBox.innerHTML = '<div style="color:#64748b;">No hay commits registrados en el historial reciente.</div>';
            } else {
                logBox.innerHTML = commits.map(c => `
                    <div style="margin-bottom:4px;">
                        <span style="color:#fde047; font-weight:bold;">${c.hash}</span>
                        <span style="color:#ffffff;"> - ${c.message}</span>
                        <span style="color:#64748b; font-size:9px;"> (${c.time})</span>
                    </div>
                `).join('');
            }
        }
    }

    async doDirectCommit() {
        const msg = prompt("Mensaje para el commit en Git:", "feat: actualización de entregables y tareas Criterio AI");
        if (!msg) return;

        try {
            const res = await fetch('/api/git/commit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, push: false })
            }).then(r => r.json());

            if (res.success) {
                this.showToast(`✔ Commit exitoso en Git! Hash: ${res.hash}`, '#34d399');
                if (window.pixelAudio) window.pixelAudio.playSuccess();
                this.fetchStatus();
            } else {
                alert('Fallo al commitear: ' + (res.output || 'revisa la consola'));
            }
        } catch (err) {
            alert('Error en commit: ' + err.message);
        }
    }

    async doPushRemote() {
        if (!this.config.remote_url && !this.status.remote_url) {
            alert("No hay URL de repositorio remoto configurada. Configura el Remote URL en la pestaña Ajustes.");
            this.switchTab('config');
            return;
        }

        const confirmPush = confirm(`¿Hacer push a ${this.config.remote_url || this.status.remote_url} en la rama ${this.status.branch}?`);
        if (!confirmPush) return;

        this.showToast('🚀 Ejecutando git push origin...', '#38bdf8');

        try {
            const res = await fetch('/api/git/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branch: this.status.branch })
            }).then(r => r.json());

            if (res.success) {
                this.showToast('🎉 ¡Push completado con éxito hacia el repositorio remoto!', '#34d399');
                if (window.pixelAudio) window.pixelAudio.playPowerUp();
                this.fetchStatus();
            } else {
                alert('Error al hacer push: ' + (res.error || res.output || 'Verifica credenciales de GitHub/GitLab'));
            }
        } catch (err) {
            alert('Error en push: ' + err.message);
        }
    }

    showToast(message, color = '#38bdf8') {
        if (window.pixelEngine && window.pixelEngine.showToast) {
            window.pixelEngine.showToast(message, color);
        } else {
            console.log(`[Toast] ${message}`);
        }
    }
}

window.gitConnector = new GitConnector();
