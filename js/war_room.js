// War Room & Boardroom Meeting Simulator for AI_Criterio
class WarRoomManager {
    constructor() {
        this.selectedAgents = [];
        this.currentMission = '';
        this.isRunning = false;
        this.meetingLogs = [];
    }

    getPresetMissions() {
        return [
            {
                title: "🔥 Sprint 14 Días Bogotá: Catálogos WhatsApp $400k + Desbloquear gocriterio.com",
                deptFocus: ["engineering", "design", "marketing", "sales", "strategy"],
                desc: "Vender Catálogos WhatsApp a $400.000 COP + Carta Viva ($200.000 COP/mes) a los 119 restaurantes de Bogotá, desbloqueando el formulario Netlify de /briefing/, los enlaces reales a wa.me/573189411010 y el hub de 5 facetas."
            },
            {
                title: "Lanzar Servicio de Auditoría de IA para Clientes B2B",
                deptFocus: ["strategy", "security", "engineering", "sales"],
                desc: "Definir oferta, arquitectura de auditoría, pricing corporativo y pipeline de prospección para Criterio AI."
            },
            {
                title: "Optimización de Embudo de Crecimiento & Viralidad",
                deptFocus: ["marketing", "paid-media", "design", "product"],
                desc: "Multiplicar por 4x los leads cualificados y el posicionamiento de marca de AI_Criterio en LinkedIn, YouTube y X."
            },
            {
                title: "Desarrollo de Asistente Autónomo con Memoria Contextual",
                deptFocus: ["engineering", "research", "testing", "product"],
                desc: "Arquitectura técnica RAG + Agentes autónomos con evaluación de alucinaciones y latencia ultra-baja."
            },
            {
                title: "Auditoría de Gobernanza, Ética y Regulación de IA (EU AI Act)",
                deptFocus: ["strategy", "finance", "specialized", "security"],
                desc: "Estructurar la práctica legal-técnica de AI_Criterio para certificar compliance corporativo."
            }
        ];
    }

    autoSelectTeam(deptFocusList) {
        if (!window.agentsManager) return [];
        const allAgents = window.agentsManager.agentsSummary;
        const team = [];

        deptFocusList.forEach(dept => {
            const matches = allAgents.filter(a => a.department === dept);
            if (matches.length > 0) {
                // Pick one representative
                const pick = matches[Math.floor(Math.random() * matches.length)];
                if (!team.some(t => t.id === pick.id)) {
                    team.push(pick);
                }
            }
        });

        // Ensure at least 3 members
        while (team.length < 4 && allAgents.length > team.length) {
            const extra = allAgents[Math.floor(Math.random() * allAgents.length)];
            if (!team.some(t => t.id === extra.id)) {
                team.push(extra);
            }
        }

        this.selectedAgents = team;
        return team;
    }

    async runMeeting(missionText, team, onStepCallback, onCompleteCallback) {
        this.isRunning = true;
        this.meetingLogs = [];
        this.currentMission = missionText;

        if (window.pixelAudio) window.pixelAudio.playMeetingStart();

        const bizContext = window.agentsManager ? window.agentsManager.businessContext : {};

        // Step 1: Convocation
        this.addLog("Director General (AI_Criterio)", "👔", "Reunión convocada. Objetivo estratégico: " + missionText);
        if (onStepCallback) onStepCallback(this.meetingLogs[this.meetingLogs.length - 1]);
        await this.delay(800);

        // Step 2: Each agent provides input sequentially
        for (let i = 0; i < team.length; i++) {
            const agent = team[i];
            const contribution = this.generateAgentContribution(agent, missionText, bizContext, i);
            
            if (window.pixelAudio) window.pixelAudio.playType();
            this.addLog(agent.name, agent.emoji, contribution, agent.department_name, agent.color);
            if (onStepCallback) onStepCallback(this.meetingLogs[this.meetingLogs.length - 1]);
            
            await this.delay(1200);
        }

        // Step 3: Synthesis & Action Plan
        const synthesis = this.generateSynthesis(missionText, team, bizContext);
        if (window.pixelAudio) window.pixelAudio.playSuccess();
        this.addLog("AI_Criterio Master Plan", "⭐", synthesis, "Entregable Final", "#f59e0b");
        if (onStepCallback) onStepCallback(this.meetingLogs[this.meetingLogs.length - 1]);

        this.isRunning = false;
        if (onCompleteCallback) onCompleteCallback(synthesis);
    }

    generateAgentContribution(agent, mission, biz, index) {
        const d = agent.department;
        const name = agent.name;
        const vibe = agent.vibe || 'Solución estructurada';

        if (d === 'strategy' || d === 'specialized') {
            return `Propongo encuadrar este reto bajo el pilar de **Gobernanza y Criterio**. Debemos asegurar que el margen de contribución sea superior al 65% y fijar un SLA de validación de 5 días para nuestros clientes. Mi foco: alinear la propuesta de valor con nuestro objetivo anual.`;
        } else if (d === 'engineering' || d === 'integrations') {
            return `Desde el stack técnico, implementaremos una arquitectura modular basada en micro-agentes desacoplados. Conectaremos con las herramientas clave (${agent.tools}) y mantendremos observabilidad en tiempo real para evitar deriva de inferencia.`;
        } else if (d === 'marketing' || d === 'paid-media') {
            return `Para la tracción y go-to-market: activaremos un embudo educativo con casos de estudio reales de AI_Criterio. Demostraremos el contraste entre "IA genérica sin criterio" vs. "IA con Criterio Riguroso". Proyección: 30 leads B2B calificados en las primeras 3 semanas.`;
        } else if (d === 'security' || d === 'testing') {
            return `Mi condición no negociable: auditoría de seguridad zero-trust y testing riguroso de prompts y endpoints. Evaluaremos cobertura de fallbacks y compliance antes de dar luz verde a cualquier despliegue público.`;
        } else if (d === 'sales' || d === 'finance') {
            return `Estructuraremos dos esquemas de contratación para AI_Criterio: retainer mensual corporativo con soporte preferente y piloto de implementación inicial con retorno de inversión garantizado en 60 días.`;
        } else if (d === 'design' || d === 'product' || d === 'spatial-computing') {
            return `Diseñaremos una experiencia de usuario impecable, tableros ejecutivos limpios y reportes visuales con estética premium que transmitan confianza instantánea a los directivos.`;
        } else {
            return `Aporto análisis metodológico exhaustivo y sistematización de buenas prácticas para garantizar que cada entrega de AI_Criterio supere el estándar de la industria.`;
        }
    }

    generateSynthesis(mission, team, biz) {
        const teamNames = team.map(t => `${t.emoji} **${t.name}** (${t.department_name})`).join(', ');
        return `## 📑 PLAN ESTRATÉGICO ACORDADO — AI_CRITERIO
**Misión:** ${mission}  
**Equipo Interdisciplinario Convocado:** ${teamNames}  

### 1. Resumen Ejecutivo
El equipo de especialistas de **AI_Criterio** ha concluido por unanimidad que este objetivo debe ejecutarse combinando rigor técnico, diferenciación de marca y un modelo comercial escalable.

### 2. Decisiones Clave Aprobadas
- **Diferencial de Criterio**: Cada entregable llevará el sello de auditoría y criterio de AI_Criterio, garantizando precisión y ausencia de alucinaciones críticas.
- **Arquitectura**: Despliegue sobre agentes autónomos orquestados con observabilidad continua.
- **Estrategia Comercial**: Enfoque consultivo de alto valor dirigido a *${biz.targetAudience || 'empresas corporativas y startups'}*.

### 3. Plan de Acción Inmediato (Próximos 14 Días)
1. **Día 1-3**: Cierre de especificación funcional y KPIs de éxito con el equipo de Estrategia.
2. **Día 4-8**: Prototipado y pruebas de estrés en el entorno de desarrollo del Piso 2.
3. **Día 9-12**: Campaña de prospección y demos privadas dirigidas por Marketing y Ventas.
4. **Día 13-14**: Lanzamiento oficial y revisión semanal de métricas.

*Documento archivado en el Command Center de AI_Criterio.*`;
    }

    addLog(speaker, emoji, text, dept = '', color = '#38bdf8') {
        this.meetingLogs.push({ speaker, emoji, text, dept, color, timestamp: new Date().toLocaleTimeString() });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.warRoomManager = new WarRoomManager();
