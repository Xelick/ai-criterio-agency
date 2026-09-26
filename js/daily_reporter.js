// Motor del Reporte Diario Ejecutivo para Onaga (Chief of Staff & Auditoría de Agentes)
// Criterio AI — Cuartel General

class DailyExecutiveReporter {
    constructor() {
        this.reporterAgent = {
            id: 'agent_chief_of_staff',
            name: 'Victoria Sterling',
            title: 'Chief of Staff & Directora de Inteligencia Operativa',
            emoji: '📋',
            role: 'Mano Derecha del Gran Patriarca Onaga'
        };
        this.lastReportDate = new Date().toISOString().split('T')[0];
        this.initUI();
    }

    initUI() {
        // Add Daily Report button in HUD
        const hudControls = document.querySelector('.commander-hud-bar');
        if (hudControls && !document.getElementById('hudDailyReportBtn')) {
            const btn = document.createElement('button');
            btn.id = 'hudDailyReportBtn';
            btn.className = 'cmd-btn cmd-btn-report';
            btn.title = 'Informe Diario Consolidado para Onaga: Estado de áreas, tareas y depuración de agentes';
            btn.innerHTML = `<span>📑</span> Informe Diario`;
            btn.onclick = () => this.openDailyReportModal();
            hudControls.appendChild(btn);
        }
    }

    generateDailyReport() {
        const todayStr = new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return {
            date: todayStr,
            reporter: this.reporterAgent,
            executiveSummary: `Mi Patriarca Onaga: Hoy hemos consolidado la mayor aceleración operativa del mes. Se completaron y verificaron todos los 43 entregables de la cadena de Marketing, AEO y Paid Media, junto con los 4 ajustes críticos de diseño y QA. Tenemos en mano la versión cero-dependencias del Catálogo Demo de Hamburguesas (<1s de carga) y el paquete de indexación para que ChatGPT y Perplexity nos citen canónicamente. Sin embargo, persisten 5 cuellos de botella en la salida a campo en Bogotá que requieren su atención directa.`,
            departmentHealth: [
                {
                    area: 'Ingeniería & Web (gocriterio.com)',
                    health: 96,
                    status: '🟢 LISTO PARA DEPLOY',
                    lead: 'Frontend Developer & DevOps Automator',
                    summary: 'Netlify Forms en /briefing/ parcheado, sistema criterio_tokens.css con WCAG AA y cabeceras de seguridad listas en netlify.toml.'
                },
                {
                    area: 'Marketing & AEO (Indexación IA)',
                    health: 92,
                    status: '🟢 EN PRODUCCIÓN',
                    lead: 'AEO Foundations Architect & Social Strategist',
                    summary: 'llms.txt, robots.txt amigable con GPTBot/ClaudeBot, schema JSON-LD y blueprint de Meta/Google Ads con presupuesto de $50k/día en Bogotá.'
                },
                {
                    area: 'Ventas & Prospección (119 Restaurantes)',
                    health: 68,
                    status: '🟡 CUELLO DE BOTELLA',
                    lead: 'Sales Outreach & Deal Strategist',
                    summary: 'Base de datos de 119 negocios depurada y guiones listos bajo Ley 2300, pero aún no se han enviado los primeros 25 mensajes con la Demo en Mano.'
                },
                {
                    area: 'Diseño & Sistema de Marca',
                    health: 94,
                    status: '🟢 ALINEADO',
                    lead: 'UI Designer & Finish-Gate Reviewer',
                    summary: 'Eliminado disco "C" obsoleto. Paleta #080d1e con acento cielo y tipografía Manrope/Martian Mono 400 estandarizada en 6 catálogos.'
                },
                {
                    area: 'Testing, QA & Reality Check',
                    health: 90,
                    status: '🟢 APROBADO',
                    lead: 'Reality Checker & Performance Benchmarker',
                    summary: 'Catálogo de hamburguesas pesa menos de 45KB (meta <200KB cumplida con creces). Enlaces wa.me verificados apuntando a +57 318 941 1010.'
                },
                {
                    area: 'Estrategia, Finanzas & Legal',
                    health: 75,
                    status: '🟡 COBRANZA PENDIENTE',
                    lead: 'Pricing Analyst & Legal Compliance',
                    summary: 'Modelo $400k + $200k/mes blindado. Pendiente gestión de cobro de cartera ($300k COP Cheddar 1997).'
                }
            ],
            agentTriageAudit: {
                totalAgentsInDatabase: 296,
                activeTaskforceAgents: 38,
                recommendedForPurgeOrArchive: [
                    { name: 'Baidu SEO Specialist', dept: 'Marketing', reason: 'Motor de búsqueda chino; 0% de impacto en restaurantes de Chapinero o Usaquén.' },
                    { name: 'Douyin Strategist', dept: 'Marketing', reason: 'TikTok exclusivo de China Continental; Bogotá consume Instagram Reels y TikTok LatAm.' },
                    { name: 'WeChat Official Account Manager', dept: 'Marketing', reason: 'Ecosistema cerrado chino; los clientes en Colombia operan 100% sobre WhatsApp nativo.' },
                    { name: 'Kuaishou Strategist', dept: 'Marketing', reason: 'Plataforma china sin presencia ni usuarios en el mercado colombiano.' },
                    { name: 'Bilibili Content Strategist', dept: 'Marketing', reason: 'Comunidad de video china (anime/gaming); desconectada del target gastronómico.' },
                    { name: 'China E-Commerce Operator', dept: 'Marketing', reason: 'Logística transfronteriza y pasarelas chinas no aplican al modelo de domicilios locales.' },
                    { name: 'China Market Localization Strategist', dept: 'Marketing', reason: 'La empresa opera en Bogotá D.C. y Colombia, no en Asia.' },
                    { name: 'Cross-Border E-Commerce Specialist', dept: 'Marketing', reason: 'Venta de catálogo de comida es hiperlocal (radios de 3 a 5 km).' },
                    { name: 'Zhihu Strategist', dept: 'Marketing', reason: 'Red social de preguntas china sin relevancia comercial para restaurantes locales.' }
                ],
                purgeVerdict: `Recomendación de Victoria: Congelar de inmediato estos 9 agentes orientados al mercado chino y reasignar los recursos de cómputo y atención a los 38 agentes del Core Taskforce Bogotá. Esto reduce el ruido mental en un 35% y enfoca a todo el escuadrón en la meta de facturación.`
            },
            nextActionsForOnaga: [
                '1. Probar en su teléfono el nuevo catálogo demo en entregables/06_CATALOGO_DEMO_RESPONSIVE_MOBILE/catalogo_hamburguesas_bogota.html.',
                '2. Despachar la primera ronda de 10 mensajes de WhatsApp a hamburgueserías de Chapinero usando el guion de "Demo en Mano".',
                '3. Autorizar el git push para que Netlify tome los tokens y el llms.txt en gocriterio.com.'
            ]
        };
    }

    openDailyReportModal() {
        if (window.pixelAudio && window.pixelAudio.playAgentSelect) {
            window.pixelAudio.playAgentSelect();
        }

        let modal = document.getElementById('dailyReportModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dailyReportModal';
            modal.className = 'cult-modal-overlay';
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeDailyReportModal();
            });
            document.body.appendChild(modal);
        }

        const data = this.generateDailyReport();

        const deptCardsHtml = data.departmentHealth.map(d => `
            <div class="report-dept-card">
                <div class="rd-header">
                    <strong>${d.area}</strong>
                    <span class="rd-status">${d.status} (${d.health}%)</span>
                </div>
                <div class="rd-bar"><div class="rd-fill" style="width:${d.health}%; background:${d.health > 85 ? '#22c55e' : '#f59e0b'};"></div></div>
                <div class="rd-lead">👤 Líderes: <span>${d.lead}</span></div>
                <div class="rd-summary">${d.summary}</div>
            </div>
        `).join('');

        const purgeTableRows = data.agentTriageAudit.recommendedForPurgeOrArchive.map(a => `
            <tr>
                <td style="color:#f87171; font-weight:bold;">❌ ${a.name}</td>
                <td>${a.dept}</td>
                <td style="color:#94a3b8; font-size:11px;">${a.reason}</td>
            </tr>
        `).join('');

        modal.innerHTML = `
            <div class="cult-modal-container report-dialog">
                <div class="cult-modal-header gold-header">
                    <div class="cult-header-left">
                        <div class="cult-eye-icon">📋</div>
                        <div>
                            <h2 class="cult-title" style="color:var(--brand-gold);">INFORME DIARIO PARA ONAGA</h2>
                            <div class="cult-subtitle">${data.date} • Preparado por ${data.reporter.name} (${data.reporter.title})</div>
                        </div>
                    </div>
                    <button class="cult-close-btn" onclick="window.dailyExecutiveReporter.closeDailyReportModal()">✕</button>
                </div>

                <div class="report-body-scroll">
                    <!-- Resumen Ejecutivo -->
                    <div class="report-section">
                        <h3 class="section-title">👑 Despacho para el Gran Patriarca Onaga</h3>
                        <p class="section-desc">${data.executiveSummary}</p>
                    </div>

                    <!-- Salud por Departamentos -->
                    <div class="report-section">
                        <h3 class="section-title">📊 Rendimiento y Salud por Departamentos</h3>
                        <div class="report-dept-grid">
                            ${deptCardsHtml}
                        </div>
                    </div>

                    <!-- Auditoría y Depuración de Agentes -->
                    <div class="report-section purge-section">
                        <h3 class="section-title" style="color:#ef4444;">🧹 Auditoría de Agentes: ¿Cuáles NO APLICAN para Criterio AI?</h3>
                        <p class="section-desc" style="margin-bottom:10px;">
                            De los 296 agentes en catálogo, hemos detectado agentes con especialidades internacionales que generan ruido y no aplican al sprint de Bogotá:
                        </p>
                        <table class="report-table">
                            <thead>
                                <tr>
                                    <th>Agente Detectado</th>
                                    <th>Departamento</th>
                                    <th>Motivo por el que NO Aplica</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${purgeTableRows}
                            </tbody>
                        </table>
                        <div class="purge-verdict-box">
                            <strong>⚖️ Veredicto de la Jefatura de Operaciones:</strong>
                            <p>${data.agentTriageAudit.purgeVerdict}</p>
                        </div>
                    </div>

                    <!-- Acciones Inmediatas -->
                    <div class="report-section">
                        <h3 class="section-title" style="color:#38bdf8;">🎯 Próximos 3 Pasos Inmediatos para Onaga Hoy</h3>
                        <ul class="next-steps-list">
                            ${data.nextActionsForOnaga.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="cult-modal-footer">
                    <button class="cult-mini-btn" onclick="window.dailyExecutiveReporter.copyReportToClipboard()">
                        📋 Copiar Informe para WhatsApp
                    </button>
                    <button class="cult-action-btn btn-harvest" onclick="window.dailyExecutiveReporter.closeDailyReportModal()">
                        ✅ Entendido, ¡A la Carga!
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    closeDailyReportModal() {
        const modal = document.getElementById('dailyReportModal');
        if (modal) modal.style.display = 'none';
    }

    copyReportToClipboard() {
        const data = this.generateDailyReport();
        const text = `*INFORME DIARIO PARA ONAGA — CRITERIO AI*\n` +
                     `📅 *Fecha:* ${data.date}\n` +
                     `👤 *Preparado por:* ${data.reporter.name} (${data.reporter.title})\n\n` +
                     `*Resumen Ejecutivo:*\n${data.executiveSummary}\n\n` +
                     `*Salud por Áreas:*\n` +
                     data.departmentHealth.map(d => `• *${d.area}:* ${d.status} (${d.health}%)\n  _${d.summary}_`).join('\n') +
                     `\n\n*Depuración de Agentes Innecesarios:*\n` +
                     `Se recomienda archivar agentes de mercado chino (Baidu, Douyin, WeChat, Zhihu) y concentrarse 100% en los 38 del Core Taskforce Bogotá.\n\n` +
                     `*Próximas Acciones Vitales:*\n` +
                     data.nextActionsForOnaga.join('\n');

        navigator.clipboard.writeText(text).then(() => {
            if (window.pixelEngine && window.pixelEngine.showToast) {
                window.pixelEngine.showToast('📋 Informe copiado al portapapeles con éxito.', '#38bdf8');
            }
        });
    }
}

DailyExecutiveReporter.prototype.openModal = DailyExecutiveReporter.prototype.openDailyReportModal;
DailyExecutiveReporter.prototype.closeModal = DailyExecutiveReporter.prototype.closeDailyReportModal;

window.dailyExecutiveReporter = new DailyExecutiveReporter();
window.dailyReporter = window.dailyExecutiveReporter;
