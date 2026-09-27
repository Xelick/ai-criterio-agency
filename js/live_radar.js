/**
 * LiveRadarManager — Motor de Búsqueda Web en Vivo y Auditoría en Tiempo Real
 * Conecta la Oficina Virtual Pixel Art con la Web y con Antigravity
 */
class LiveRadarManager {
    constructor() {
        this.activeTab = 'audit';
        this.isAuditing = false;
        this.isSearching = false;
        this.lastAuditResult = null;
        this.lastSearchResult = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Top Header button
        const openBtn = document.getElementById('openLiveRadarBtn');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openModal());
        }

        // Close modal buttons
        const closeBtn = document.getElementById('closeLiveRadarBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        const modal = document.getElementById('liveRadarModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Tabs
        const tabBtns = document.querySelectorAll('.radar-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Audit Action
        const runAuditBtn = document.getElementById('radarRunAuditBtn');
        if (runAuditBtn) {
            runAuditBtn.addEventListener('click', () => {
                const url = document.getElementById('radarAuditUrlInput').value.trim() || 'https://gocriterio.com';
                this.runAudit(url);
            });
        }

        // Search Action
        const runSearchBtn = document.getElementById('radarRunSearchBtn');
        if (runSearchBtn) {
            runSearchBtn.addEventListener('click', () => {
                const q = document.getElementById('radarSearchInput').value.trim();
                if (q) this.runSearch(q);
            });
        }

        const searchInput = document.getElementById('radarSearchInput');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const q = searchInput.value.trim();
                    if (q) this.runSearch(q);
                }
            });
        }

        // Query Suggestions Pills
        const pills = document.querySelectorAll('.radar-query-pill');
        pills.forEach(p => {
            p.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-query');
                if (searchInput) {
                    searchInput.value = text;
                    this.runSearch(text);
                }
            });
        });

        // Dispatch to Antigravity Button
        const dispatchBtn = document.getElementById('radarDispatchAntigravityBtn');
        if (dispatchBtn) {
            dispatchBtn.addEventListener('click', () => this.dispatchToAntigravity());
        }
    }

    openModal() {
        const modal = document.getElementById('liveRadarModal');
        if (modal) {
            modal.style.display = 'flex';
            if (window.audioEngine) window.audioEngine.playSfx('ui_open');
            this.refreshInboxStatus();
        }
    }

    closeModal() {
        const modal = document.getElementById('liveRadarModal');
        if (modal) {
            modal.style.display = 'none';
            if (window.audioEngine) window.audioEngine.playSfx('ui_close');
        }
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        const tabBtns = document.querySelectorAll('.radar-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        const contents = document.querySelectorAll('.radar-tab-view');
        contents.forEach(view => {
            view.style.display = view.id === `radarTab_${tabId}` ? 'block' : 'none';
        });

        if (window.audioEngine) window.audioEngine.playSfx('click');
    }

    async refreshInboxStatus() {
        const statusBox = document.getElementById('radarInboxStatusBox');
        if (!statusBox) return;

        try {
            const res = await fetch('/api/agent/live_status');
            if (res.ok) {
                const data = await res.json();
                if (data.has_active_inbox) {
                    statusBox.innerHTML = `
                        <div style="color:#fde047; font-weight:bold; font-size:11px; margin-bottom:4px;">
                            📬 Orden Activa en Buzón (tasks/INBOX_ANTIGRAVITY.md):
                        </div>
                        <pre style="background:#090d16; padding:8px; border-radius:4px; font-size:10px; color:#cbd5e1; max-height:120px; overflow-y:auto; white-space:pre-wrap;">${this.escapeHtml(data.inbox_content)}</pre>
                    `;
                } else {
                    statusBox.innerHTML = `<div style="color:#64748b; font-size:11px;">Buzón vacío. No hay órdenes pendientes para Antigravity.</div>`;
                }
            }
        } catch (e) {
            statusBox.innerHTML = `<div style="color:#64748b; font-size:11px;">Servidor local listo para recibir órdenes.</div>`;
        }
    }

    async runAudit(url) {
        if (this.isAuditing) return;
        this.isAuditing = true;

        const resultsContainer = document.getElementById('radarAuditResults');
        const runBtn = document.getElementById('radarRunAuditBtn');
        
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.innerHTML = `<span>⏳</span> Auditando en vivo...`;
        }

        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:24px; color:#38bdf8;">
                    <div style="font-size:32px; animation:spin 1s linear infinite; display:inline-block; margin-bottom:8px;">🛰️</div>
                    <div style="font-weight:bold; font-size:12px;">Conectando en tiempo real con ${url}...</div>
                    <div style="font-size:10px; color:#94a3b8; margin-top:4px;">Inspeccionando SSL, encabezados, formularios Netlify y botones WhatsApp...</div>
                </div>
            `;
        }

        try {
            const res = await fetch('/api/agent/run_live', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'audit_site',
                    url: url,
                    agent_id: 'agent-radar-live',
                    agent_name: 'Radar Técnico en Vivo'
                })
            });

            if (res.ok) {
                const payload = await res.json();
                this.lastAuditResult = payload.data;
                this.renderAuditResults(payload.data, payload.saved_files);
                if (window.audioEngine) window.audioEngine.playSfx('task_done');
            } else {
                throw new Error(`HTTP Error ${res.status}`);
            }
        } catch (err) {
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div style="padding:14px; background:#450a0a; border:1px solid #ef4444; border-radius:6px; color:#fca5a5; font-size:11px;">
                        <strong>❌ Error al conectar con el servidor:</strong> ${err.message}
                    </div>
                `;
            }
        } finally {
            this.isAuditing = false;
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.innerHTML = `<span>🔍</span> AUDITAR AHORA EN VIVO`;
            }
        }
    }

    renderAuditResults(data, savedFiles) {
        const container = document.getElementById('radarAuditResults');
        if (!container) return;

        const scoreColor = data.health_score >= 85 ? '#10b981' : (data.health_score >= 60 ? '#f59e0b' : '#ef4444');
        const scoreLabel = data.health_score >= 85 ? 'EXCELENTE' : (data.health_score >= 60 ? 'ALERTA / MEJORAS REQUERIDAS' : 'DEFCON 1 / CRÍTICO');

        const issuesHtml = (data.issues && data.issues.length > 0)
            ? data.issues.map(iss => `<li style="margin-bottom:4px; color:#fca5a5;">🔴 <strong>${this.escapeHtml(iss)}</strong></li>`).join('')
            : `<li style="color:#34d399;">🟢 No se detectaron fallos críticos.</li>`;

        const recsHtml = (data.recommendations && data.recommendations.length > 0)
            ? data.recommendations.map(r => `<li style="margin-bottom:4px; color:#fde047;">⚡ ${this.escapeHtml(r)}</li>`).join('')
            : `<li style="color:#94a3b8;">Sistema alineado con las directrices.</li>`;

        container.innerHTML = `
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:14px; margin-top:10px;">
                <!-- Header Metrics -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:10px; margin-bottom:10px;">
                    <div>
                        <div style="font-size:13px; font-weight:bold; color:#f8fafc;">
                            🌐 ${this.escapeHtml(data.url)}
                        </div>
                        <div style="font-size:10px; color:#94a3b8;">
                            Servidor: <strong>${data.server || 'Netlify'}</strong> | Latencia: <strong>${data.latency_ms} ms</strong> | Tamaño: <strong>${data.content_length_bytes} bytes</strong>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:20px; font-weight:bold; color:${scoreColor};">${data.health_score}/100</div>
                        <div style="font-size:9px; font-weight:bold; color:${scoreColor};">${scoreLabel}</div>
                    </div>
                </div>

                <!-- Diagnostics Grid -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                    <div style="background:#0d1527; padding:10px; border-radius:4px; border-left:3px solid #ef4444;">
                        <div style="font-size:10.5px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">⚠️ Bloqueos Detectados:</div>
                        <ul style="margin:0; padding-left:14px; font-size:10px;">
                            ${issuesHtml}
                        </ul>
                    </div>
                    <div style="background:#0d1527; padding:10px; border-radius:4px; border-left:3px solid #38bdf8;">
                        <div style="font-size:10.5px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">🛠️ Acciones Inmediatas:</div>
                        <ul style="margin:0; padding-left:14px; font-size:10px;">
                            ${recsHtml}
                        </ul>
                    </div>
                </div>

                <!-- Footer Deliverable Notification -->
                <div style="display:flex; justify-content:space-between; align-items:center; background:#131c31; padding:8px 12px; border-radius:4px; border:1px solid #233554;">
                    <div style="font-size:10px; color:#93c5fd;">
                        💾 Guardado automáticamente en: <code>tasks/LIVE_RESEARCH_REPORT.md</code>
                    </div>
                    <button class="action-btn" style="background:#7c3aed; border-color:#a78bfa; font-size:10px; padding:4px 8px;" onclick="window.liveRadar.dispatchAuditToAntigravity()">
                        🚀 Transmitir Solución a Antigravity
                    </button>
                </div>
            </div>
        `;
    }

    async runSearch(query) {
        if (this.isSearching) return;
        this.isSearching = true;

        const resultsContainer = document.getElementById('radarSearchResults');
        const runBtn = document.getElementById('radarRunSearchBtn');

        if (runBtn) {
            runBtn.disabled = true;
            runBtn.innerHTML = `<span>⏳</span> Rastreando Web...`;
        }

        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:24px; color:#34d399;">
                    <div style="font-size:32px; animation:pulse 1s infinite; display:inline-block; margin-bottom:8px;">🌐</div>
                    <div style="font-weight:bold; font-size:12px;">Explorando la web para: "${this.escapeHtml(query)}"...</div>
                    <div style="font-size:10px; color:#94a3b8; margin-top:4px;">Consultando Google Trends y grafo de conocimiento de Wikipedia en español...</div>
                </div>
            `;
        }

        try {
            const res = await fetch('/api/agent/run_live', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'market_search',
                    query: query,
                    agent_id: 'agent-radar-live',
                    agent_name: 'Radar de Mercado en Vivo'
                })
            });

            if (res.ok) {
                const payload = await res.json();
                this.lastSearchResult = payload.data;
                this.renderSearchResults(payload.data, payload.saved_files);
                if (window.audioEngine) window.audioEngine.playSfx('task_done');
            } else {
                throw new Error(`HTTP Error ${res.status}`);
            }
        } catch (err) {
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div style="padding:14px; background:#450a0a; border:1px solid #ef4444; border-radius:6px; color:#fca5a5; font-size:11px;">
                        <strong>❌ Error en búsqueda web:</strong> ${err.message}
                    </div>
                `;
            }
        } finally {
            this.isSearching = false;
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.innerHTML = `<span>🔎</span> BUSCAR EN LA WEB`;
            }
        }
    }

    renderSearchResults(data, savedFiles) {
        const container = document.getElementById('radarSearchResults');
        if (!container) return;

        const trendsHtml = (data.trending_queries && data.trending_queries.length > 0)
            ? data.trending_queries.map(tq => `
                <span class="radar-query-pill" style="cursor:pointer;" onclick="document.getElementById('radarSearchInput').value='${this.escapeHtml(tq)}'; window.liveRadar.runSearch('${this.escapeHtml(tq)}');">
                    🔍 ${this.escapeHtml(tq)}
                </span>
            `).join('')
            : `<span style="color:#64748b; font-size:10px;">Sin variaciones directas.</span>`;

        const articlesHtml = (data.articles && data.articles.length > 0)
            ? data.articles.map(art => `
                <div style="background:#090d16; border:1px solid #1e293b; border-radius:4px; padding:10px; margin-bottom:8px;">
                    <a href="${art.url}" target="_blank" style="color:#38bdf8; font-weight:bold; font-size:11.5px; text-decoration:none;">
                        📌 ${this.escapeHtml(art.title)} ↗
                    </a>
                    <div style="font-size:10px; color:#cbd5e1; margin-top:4px; line-height:1.4;">
                        ${art.snippet}...
                    </div>
                </div>
            `).join('')
            : `<div style="color:#64748b; font-size:10px;">No se encontraron artículos directos en Wikipedia.</div>`;

        container.innerHTML = `
            <div style="margin-top:10px;">
                <!-- Trending Queries Box -->
                <div style="background:#0d1527; border:1px solid #1e293b; border-radius:6px; padding:10px; margin-bottom:10px;">
                    <div style="font-size:11px; font-weight:bold; color:#fde047; margin-bottom:6px;">
                        📈 Tendencias de Búsqueda Reales en Google:
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                        ${trendsHtml}
                    </div>
                </div>

                <!-- Knowledge Graph Articles -->
                <div style="background:#0d1527; border:1px solid #1e293b; border-radius:6px; padding:10px; margin-bottom:10px;">
                    <div style="font-size:11px; font-weight:bold; color:#38bdf8; margin-bottom:6px;">
                        📚 Información Extraída de la Red:
                    </div>
                    ${articlesHtml}
                </div>

                <!-- Footer Deliverable Notification -->
                <div style="display:flex; justify-content:space-between; align-items:center; background:#131c31; padding:8px 12px; border-radius:4px; border:1px solid #233554;">
                    <div style="font-size:10px; color:#93c5fd;">
                        💾 Guardado en: <code>tasks/LIVE_RESEARCH_REPORT.md</code>
                    </div>
                    <button class="action-btn" style="background:#7c3aed; border-color:#a78bfa; font-size:10px; padding:4px 8px;" onclick="window.liveRadar.dispatchSearchToAntigravity()">
                        🚀 Enviar Hallazgos a Antigravity
                    </button>
                </div>
            </div>
        `;
    }

    dispatchAuditToAntigravity() {
        if (!this.lastAuditResult) return;
        const note = `Auditoría técnica en vivo de ${this.lastAuditResult.url}: Salud ${this.lastAuditResult.health_score}/100. Bloqueos: ${this.lastAuditResult.issues.join(', ')}.`;
        this.switchTab('antigravity');
        const input = document.getElementById('radarAntigravityOrderInput');
        if (input) input.value = `Resolver los bloqueos detectados en la auditoría en vivo de ${this.lastAuditResult.url}: corregir formulario Netlify de briefing y agregar botón flotante wa.me/573189411010.`;
    }

    dispatchSearchToAntigravity() {
        if (!this.lastSearchResult) return;
        this.switchTab('antigravity');
        const input = document.getElementById('radarAntigravityOrderInput');
        if (input) input.value = `Ejecutar estrategia comercial basada en la búsqueda en vivo de "${this.lastSearchResult.query}": prospección en Bogotá y generación de cartas digitales para WhatsApp.`;
    }

    async dispatchToAntigravity() {
        const input = document.getElementById('radarAntigravityOrderInput');
        const orderText = input ? input.value.trim() : '';
        if (!orderText) {
            alert('Por favor escribe la instrucción para Antigravity.');
            return;
        }

        const dispatchBtn = document.getElementById('radarDispatchAntigravityBtn');
        if (dispatchBtn) {
            dispatchBtn.disabled = true;
            dispatchBtn.innerHTML = `<span>⏳</span> Despachando a Antigravity...`;
        }

        try {
            const res = await fetch('/api/agent/run_live', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'dispatch_antigravity',
                    order: orderText,
                    content: orderText,
                    agent_id: 'radar-operator',
                    agent_name: 'Operador de Radar en Vivo'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (window.audioEngine) window.audioEngine.playSfx('task_done');
                this.refreshInboxStatus();
                alert(`🚀 ¡ORDEN TRANSMITIDA CON ÉXITO A ANTIGRAVITY!\n\nSe ha depositado en: tasks/INBOX_ANTIGRAVITY.md\n\nAhora ve al chat de Antigravity y escribe: "Antigravity, revisa el buzón de órdenes" o pídele que ejecute la tarea.`);
            } else {
                throw new Error(`HTTP Error ${res.status}`);
            }
        } catch (e) {
            alert(`Error al despachar orden: ${e.message}`);
        } finally {
            if (dispatchBtn) {
                dispatchBtn.disabled = false;
                dispatchBtn.innerHTML = `<span>🚀</span> TRANSMITIR ORDEN AL BUZÓN DE ANTIGRAVITY`;
            }
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
    window.liveRadar = new LiveRadarManager();
});
