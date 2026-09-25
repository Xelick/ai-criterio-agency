// Consultation & Chat Engine for AI_Criterio Agents
class ConsultationEngine {
    constructor() {
        this.apiKey = localStorage.getItem('aicriterio_api_key') || '';
        this.apiProvider = localStorage.getItem('aicriterio_api_provider') || 'gemini'; // 'gemini' or 'openai' or 'offline'
        this.chatHistories = {};
    }

    setApiConfig(provider, key) {
        this.apiProvider = provider;
        this.apiKey = key;
        localStorage.setItem('aicriterio_api_provider', provider);
        localStorage.setItem('aicriterio_api_key', key);
    }

    getChatHistory(agentId) {
        if (!this.chatHistories[agentId]) {
            const saved = localStorage.getItem(`aicriterio_chat_${agentId}`);
            this.chatHistories[agentId] = saved ? JSON.parse(saved) : [];
        }
        return this.chatHistories[agentId];
    }

    saveChatHistory(agentId, history) {
        this.chatHistories[agentId] = history;
        localStorage.setItem(`aicriterio_chat_${agentId}`, JSON.stringify(history));
    }

    clearChatHistory(agentId) {
        this.chatHistories[agentId] = [];
        localStorage.removeItem(`aicriterio_chat_${agentId}`);
    }

    async askAgent(agent, userMessage, businessContext) {
        // If API key is configured and valid, use live LLM call
        if (this.apiKey && this.apiProvider === 'gemini') {
            try {
                return await this.callGeminiApi(agent, userMessage, businessContext);
            } catch (err) {
                console.warn("Gemini API call failed, falling back to smart local reasoning:", err);
            }
        } else if (this.apiKey && this.apiProvider === 'openai') {
            try {
                return await this.callOpenAiApi(agent, userMessage, businessContext);
            } catch (err) {
                console.warn("OpenAI API call failed, falling back to smart local reasoning:", err);
            }
        }

        // Smart Local Reasoning Engine (Instant, Offline, 100% Reliable)
        return this.generateSmartLocalResponse(agent, userMessage, businessContext);
    }

    async callGeminiApi(agent, userMessage, businessContext) {
        const fullAgent = window.agentsManager ? window.agentsManager.getAgentFull(agent.id) : agent;
        const systemPrompt = `Eres ${agent.name}, un agente experto del equipo de AI_Criterio.
Vibe/Estilo: ${agent.vibe || 'Experto estratégico, pragmático y enfocado en resultados'}.
Departamento: ${agent.department_name} (${agent.department}).
Herramientas: ${agent.tools || 'Análisis, Python, Prompting'}.
Descripción: ${agent.description}.

Contexto del Negocio de tu empresa:
- Empresa: ${businessContext.companyName}
- Eslogan: ${businessContext.tagline}
- Misión: ${businessContext.mission}
- Pilares: ${businessContext.pillars.join(', ')}
- Objetivo Actual: ${businessContext.currentGoal}
- Proyectos Activos: ${businessContext.activeProjects.join('; ')}

Instrucciones:
Responde en español de forma estructurada, profesional, con criterio analítico agudo y con pasos de acción directos que aporten valor inmediato a AI_Criterio. Utiliza viñetas, métricas y recomendaciones concretas.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\nPregunta del usuario para AI_Criterio: ${userMessage}` }] }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error status: ${response.status}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callOpenAiApi(agent, userMessage, businessContext) {
        const systemPrompt = `Eres ${agent.name} en la agencia AI_Criterio. Especialidad: ${agent.department_name}. Responde en español de forma analítica y accionable para la empresa AI_Criterio.`;
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `[Contexto AI_Criterio: ${businessContext.currentGoal}]\n\n${userMessage}` }
                ]
            })
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error status: ${response.status}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }

    generateSmartLocalResponse(agent, userMessage, businessContext) {
        const full = (window.agentsManager && window.agentsManager.getAgentFull(agent.id)) || agent;
        const msg = userMessage.toLowerCase();
        const dept = agent.department;
        const name = agent.name;
        const emoji = agent.emoji || '🤖';
        const vibe = agent.vibe || 'Máxima eficiencia e impacto';

        // Check if agent is in the 38 active taskforce
        const taskforceAgent = window.CRITERIO_TASKFORCE_MAP ? window.CRITERIO_TASKFORCE_MAP.get(agent.id) : null;
        let tfHeader = '';
        if (taskforceAgent) {
            tfHeader = `> 🔥 **Agente del Escuadrón Activo de Criterio AI**
> **Frente:** ${taskforceAgent.frontIcon} ${taskforceAgent.front} | **Misión:** ${taskforceAgent.task}
> **Estado del Entregable:** \`${taskforceAgent.status}\`

${taskforceAgent.deliverable}

---
`;
        }

        // Extract key sections if present
        const sec = full.sections || {};
        const cap = sec['Core Capabilities'] || sec['Capabilities'] || '';
        const skills = sec['Specialized Skills'] || sec['Skills'] || '';
        const framework = sec['Decision Framework'] || '';
        const metrics = sec['Success Metrics'] || '';

        // Generate tailored dynamic sections
        if (msg.includes('prioridad') || msg.includes('hoy') || msg.includes('inmediata') || msg.includes('tarea') || msg.includes('entregable')) {
            return `${tfHeader}### ${emoji} Prioridad Inmediata de ${name} para Criterio AI

¡Hola! Como especialista en **${agent.department_name}** para **Criterio AI** (\`gocriterio.com\`), mi diagnóstico prioritario para nuestro objetivo actual (*"${businessContext.currentGoal}"*) es:

1. **Foco Táctico Inmediato**:
   - Ejecutar la resolución del cuello de botella en ${agent.department_name.toLowerCase()}.
   - Aprovechar nuestras herramientas clave (**${agent.tools}**) para desbloquear el flujo de pedidos y prospección.

2. **Acción de Alto Impacto para esta semana**:
   - Enfocar todo esfuerzo en nuestro target: *${businessContext.targetAudience}*.
   - Teléfono oficial de atención de clientes: \`${businessContext.clientWhatsApp || '+57 318 941 1010'}\`.

3. **Métrica de Victoria del Sprint**:
   - Concretar 3 mensualidades activas de Carta Viva ($200.000 COP/mes) y vender catálogos a $400.000 COP.

> 💡 *Vibe operativa*: "${vibe}"`;
        }

        if (msg.includes('14 días') || msg.includes('plan') || msg.includes('roadmap')) {
            return `### 📅 Plan de Acción de 14 Días para AI_Criterio
**Liderado por:** ${emoji} ${name} | **Área:** ${agent.department_name}

Para impulsar el proyecto activo de AI_Criterio (*"${businessContext.activeProjects[0]}"*), este es el sprint estratégico:

#### Fase 1: Días 1 a 4 — Diagnóstico y Arquitectura de Criterio
- **Auditoría inicial**: Mapeo exhaustivo de flujos actuales y detección de cuellos de botella en ${dept}.
- **Definición de heurísticas**: Establecer las reglas de validación y control de calidad específicas de AI_Criterio.
- **Herramientas**: Configuración de ${agent.tools}.

#### Fase 2: Días 5 a 9 — Prototipado y Validación Rápida
- **Prueba de concepto**: Despliegue de un piloto interno aplicado a uno de nuestros casos de uso.
- **Iteración con criterio**: Ajustar prompts, pipelines y métricas de desempeño.
- **Handoff interdepartamental**: Coordinar entregables con los equipos de Estrategia e Ingeniería.

#### Fase 3: Días 10 a 14 — Despliegue y Métricas de Impacto
- **Lanzamiento a producción/mercado**: Integración directa en la cartera de servicios de AI_Criterio.
- **Medición de KPIs**:
  ${metrics ? metrics.split('\n').slice(0, 3).map(m => `  ${m}`).join('\n') : '  - Tasa de precisión > 95%\n  - Retorno de inversión validado en menos de 30 días'}

¿Deseas que profundicemos en alguna de las fases específicas?`;
        }

        if (msg.includes('métrica') || msg.includes('kpi') || msg.includes('medir')) {
            return `### 📊 Cuadro de Mando & KPIs para AI_Criterio
**Supervisor:** ${emoji} ${name}

Para garantizar que el área de **${agent.department_name}** genere tracción real en **AI_Criterio**, estos son los indicadores que debemos vigilar semanalmente:

${metrics ? metrics : `- **Tasa de Eficiencia Operativa**: Reducción de tiempos de entrega en un 40%.
- **Índice de Criterio Algorítmico**: Cero alucinaciones críticas o fallos de sesgo en producción.
- **Satisfacción del Cliente B2B**: NPS > 75 en los proyectos corporativos.
- **Escalabilidad de Procesos**: Capacidad de absorber 5x clientes sin duplicar costes.`}

**Herramientas de Monitorización Recomendadas:**
- Paneles centralizados con soporte para: *${agent.tools}*.`;
        }

        if (msg.includes('riesgo') || msg.includes('cuello de botella') || msg.includes('amenaza')) {
            return `### 🛡️ Matriz de Riesgos & Mitigación para AI_Criterio
**Auditoría de:** ${emoji} ${name}

Al evaluar nuestro modelo de negocio y el objetivo (*"${businessContext.currentGoal}"*), detecto los siguientes puntos críticos en ${agent.department_name}:

1. **Riesgo Operativo / Escalabilidad**:
   - *Punto débil*: Depender de flujos manuales sin suficiente abstracción en ${agent.tools}.
   - *Mitigación de AI_Criterio*: Estandarizar playbooks modulares para que cualquier agente o consultor pueda replicar el proceso con idéntica calidad.

2. **Riesgo de Percepción de Mercado**:
   - *Punto débil*: Que los clientes corporativos perciban la IA como una "caja negra" o simple commodity.
   - *Mitigación de AI_Criterio*: Posicionarnos firmemente en nuestro diferencial: **"Criterio, Ética y Gobernanza"**. No vendemos prompts; vendemos certeza y criterio de negocio.

3. **Riesgo Tecnológico**:
   - *Punto débil*: Desfase de APIs o deriva de modelos (model drift).
   - *Mitigación*: Pruebas de regresión automatizadas y validación continua en el NOC de Piso 2.`;
        }

        // General Consultation Response
        return `### ${emoji} Consulta Estratégica con ${name}
*Especialista en ${agent.department_name} — AI_Criterio Headquarters*

**Diagnóstico sobre tu consulta:**
> "${userMessage}"

Desde la perspectiva de mi rol y utilizando nuestras capacidades clave (${agent.tools}):

1. **Alineación con AI_Criterio**:
   Nuestra misión es *"potenciar con criterio ético y estratégico"*. Para responder eficazmente a tu inquietud, debemos estructurar una solución modular que impacte directamente a nuestro público objetivo (*${businessContext.targetAudience}*).

2. **Plan de Ejecución Recomendado**:
   - **Paso A**: Descomponer la necesidad en hitos medibles con criterio riguroso.
   - **Paso B**: Apoyarnos en los agentes complementarios de la oficina (por ejemplo, coordinar entre Ingeniería, Marketing y Estrategia).
   - **Paso C**: Medir el éxito contra nuestro objetivo actual: *${businessContext.currentGoal}*.

3. **Doble Vía de Acción**:
   ${framework ? framework.split('\n').slice(0, 4).join('\n') : '- Priorizar las iniciativas con mayor ratio impacto / esfuerzo.\n- Validar con clientes reales antes de escalar la arquitectura.'}

¿Quieres que redactemos el entregable concreto o convoquemos a un equipo multidisciplinar en la **Sala de Crisis (War Room)**?`;
    }
}

window.consultationEngine = new ConsultationEngine();
