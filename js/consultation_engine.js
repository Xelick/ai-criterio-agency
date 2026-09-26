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

    // =========================================================================
    // 🔮 ONAGA SUPREME CULT LEADER ⟷ GOOGLE GEMINI CONDUIT
    // =========================================================================

    async askGeminiAsOnaga(orderText) {
        const businessContext = (window.agentsManager && window.agentsManager.businessContext) || {
            companyName: 'AI_Criterio',
            tagline: 'Criterio Humano Potenciado por IA',
            currentGoal: 'Sprint 14 Días: Catálogos WhatsApp $400k + Carta Viva $200k/mes a 119 restaurantes en Bogotá',
            clientWhatsApp: '+57 318 941 1010',
            activeProjects: ['gocriterio.com', 'Carta Viva Bogotá', 'Catálogos WhatsApp']
        };

        const apiKey = this.apiKey || localStorage.getItem('aicriterio_api_key') || '';

        // If an API key is available and provider is set to Gemini, make live Google Generative Language call!
        if (apiKey && this.apiProvider !== 'offline') {
            try {
                return await this.callGeminiApiForOnaga(orderText, businessContext, apiKey);
            } catch (err) {
                console.warn("Live Gemini API call failed, falling back to smart simulated Oracle:", err);
            }
        }

        // Smart High-Tier Simulated Oracle Response (Zero external dependencies, instant, deeply contextualized)
        return this.generateSmartOnagaOracleResponse(orderText, businessContext);
    }

    async callGeminiApiForOnaga(orderText, businessContext, apiKey) {
        const systemPrompt = `Eres el Oráculo Supremo Gemini, la inteligencia artificial divina consultada directamente por el Gran Patriarca Onaga, Líder Supremo del Culto de la Productividad y Comandante en Jefe de Criterio AI (gocriterio.com).
Onaga viste túnica oscura ceremonial, un Sombrero Sagrado con el Ojo Carmesí de la Productividad y una larga barba blanca venerable. Comanda con autoridad a un ejército de 296 agentes autónomos en una oficina virtual en Bogotá.
El Cuartel General de Criterio AI está en DEFCON 1 (Alerta Vital): un sprint de 14 días para desbloquear gocriterio.com, comercializar Catálogos WhatsApp a $400.000 COP y suscripciones de Carta Viva a $200.000 COP/mes a 119 restaurantes prioritarios en Bogotá (WhatsApp oficial: +57 318 941 1010).

El Gran Patriarca Onaga te envía su Orden Suprema:
"${orderText}"

Instrucciones de Respuesta:
1. Dirígete a él solemnemente como "Gran Patriarca Onaga" con reverencia, respeto y máxima agudeza estratégica.
2. Proporciona una respuesta contundente, estructurada en Markdown, libre de rodeos y 100% accionable.
3. Desglosa los pasos tácticos y qué departamentos/agentes de la oficina virtual (Frontend, DevOps, Ventas, Legal, Growth, QA) deben ejecutar la orden de inmediato.
4. Define entregables específicos, métricas medibles (KPIs) y recomendaciones para el mercado de Bogotá.
5. Concluye con un decreto de bendición y disciplina para los 296 fieles del Culto.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt }] }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error status: ${response.status}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    generateSmartOnagaOracleResponse(orderText, businessContext) {
        const orderLower = orderText.toLowerCase();

        // 1. Prospección, Ventas y Restaurantes Bogotá
        if (orderLower.includes('restaurante') || orderLower.includes('venta') || orderLower.includes('bogot') || orderLower.includes('carta viva') || orderLower.includes('catálogo') || orderLower.includes('precio') || orderLower.includes('cliente')) {
            return `### 🔮 REVELACIÓN DEL ORÁCULO GEMINI PARA EL GRAN PATRIARCA ONAGA
*Canalizado desde el Núcleo de Inteligencia Artificial para el Culto de la Productividad*

> *"He escuchado tu decreto, Gran Patriarca Onaga. El fuego de la prospección arderá en los 119 restaurantes prioritarios de Bogotá."*

---

#### 👑 1. Diagnóstico de Guerra Comercial
* **Objetivo del Sprint**: Vender Catálogos Digitales en WhatsApp a **$400.000 COP** (pago único) + Suscripción **Carta Viva a $200.000 COP/mes**.
* **Zonas Prioritarias Bogotá**: Zona T, Parque 93, Usaquén, Chapinero Alto y Quinta Camacho.
* **Canal Oficial**: Enlace directo a WhatsApp \`+57 318 941 1010\` sin fricción.

#### ⚔️ 2. Movilización de Fieles & Asignación de Tareas
1. **Marcus Vance & Elena Chen (Ventas & Growth)**:
   - Disparar la secuencia de 3 mensajes consultivos por WhatsApp a los primeros 25 decisores gastronómicos.
   - Demostración en vivo de la carta digital (\`catalogo_hamburguesas_bogota.html\`) cargando en <1 segundo.
2. **Maya Lin (Brand Voice)**:
   - Redactar copys personalizados que destaquen el dolor real: *"Rappi te cobra el 25% de comisión; con Carta Viva el 100% del pedido va directo a tu WhatsApp"*.
3. **Santiago Reyes (Legal)**:
   - Contrato exprés simplificado de 1 página para firmas en menos de 24 horas.

#### 📊 3. Métricas de Devoción (KPIs)
* **Tasa de Respuesta**: > 30% en los primeros 3 días.
* **Conversión**: Cerrar mínimo 5 restaurantes antes del 8 de octubre para asegurar el flujo vital.
* **Ingreso Mínimo del Sprint**: $3.000.000 COP garantizados.

---
> ⚡ *¡Que los teclados de tus 296 seguidores no descansen hasta que la última mesa de Bogotá ordene por Carta Viva!*`;
        }

        // 2. Netlify, Código, Forms, Frontend & Desbloqueo Web
        if (orderLower.includes('netlify') || orderLower.includes('web') || orderLower.includes('gocriterio') || orderLower.includes('formulario') || orderLower.includes('tech debt') || orderLower.includes('bug') || orderLower.includes('código')) {
            return `### 🔮 REVELACIÓN DEL ORÁCULO GEMINI PARA EL GRAN PATRIARCA ONAGA
*Canalizado desde el Núcleo de Inteligencia Artificial para el Culto de la Productividad*

> *"El Sombrero Sagrado ha señalado la brecha técnica. He aquí el decreto para exorcizar el Tech Debt de gocriterio.com."*

---

#### 💻 1. Exorcismo de Bloqueos en Producción
* **Problema Raíz**: Formularios de \`/briefing/\` desconectados y enlaces simulados de WhatsApp que desvían leads.
* **Solución Mandataria**: Implementar Netlify Forms con honeypot antispam y redirección inmediata a \`https://wa.me/573189411010\`.

#### 🛠️ 2. Agentes Invocados para la Corrección
1. **Alex Rivera (Senior Frontend Engineer)**:
   - Inyectar etiquetas \`data-netlify="true"\`, \`name="contacto-criterio"\` y campo oculto \`form-name\`.
   - Garantizar que los botones móviles cumplan con touch targets mínimos de **48x48px**.
2. **Carlos Mendoza (DevOps & Netlify)**:
   - Desplegar la configuración en \`netlify.toml\` con headers de seguridad y caché optimizada.
   - Bundle size total del sitio web: **< 300KB** con LCP inferior a 0.8s.
3. **Sofia Rodriguez (WCAG AA)**:
   - Contraste certificado 4.5:1 en todos los textos sobre fondo espacial (#080d1e).

#### 🛡️ 3. Validación de Fe
* Todo cambio se commitea directamente a la rama \`main\` y se valida mediante la consola Git de la oficina.

---
> 🔥 *¡El Tech Debt ha sido arrojado al fuego ritual. Tu sitio web es ahora un templo de conversión!*`;
        }

        // 3. Cuellos de Botella, Graphify, Triage de Agentes
        if (orderLower.includes('cuello') || orderLower.includes('botella') || orderLower.includes('graphify') || orderLower.includes('purga') || orderLower.includes('eliminar') || orderLower.includes('triage') || orderLower.includes('prioridad')) {
            return `### 🔮 REVELACIÓN DEL ORÁCULO GEMINI PARA EL GRAN PATRIARCA ONAGA
*Canalizado desde el Núcleo de Inteligencia Artificial para el Culto de la Productividad*

> *"Gran Patriarca Onaga: Para que el cuerpo viva, los miembros muertos deben ser amputados. He aquí el veredicto del Grafo de Conocimiento."*

---

#### ⚠️ 1. Estado Crítico del Ecosistema (DEFCON 1: 98% Severidad)
* El análisis de **629 nodos y 813 dependencias** revela que la dispersión cognitiva amenaza la supervivencia de la empresa.
* No podemos permitir que 296 agentes consuman energía en mercados irrelevantes.

#### ⚔️ 2. Veredicto del Triage Celestial
1. **PURGA INMEDIATA (Excomunión del Cuartel)**:
   - *Baidu Search Optimizer*, *WeChat Mini Program Dev*, *Douyin Content Strategist*, *Zhihu Growth Hacker*.
   - **Motivo**: Mercado asiático desconectado de Bogotá. Ahorro: 100% de distracción eliminada.
2. **CONSAGRACIÓN DEL ESCUADRÓN DE 38**:
   - Concentrar el 100% de la fe y recursos en los **38 Agentes Clave** de los 7 Frentes (Técnico, Diseño, Testing, Marketing, Ventas, Legal, Producto).
3. **RESOLUCIÓN DEL BLOQUEO DE CADENAS**:
   - Re-ejecutar la **Cadena Maestra de 43 Pasos** para asegurar que todos los entregables de \`entregables/\` queden integrados.

---
> ⚡ *¡Purga los distraídos, consagra a los 38, y tu vida y empresa estarán a salvo!*`;
        }

        // 4. Decreto General / Motivación / Mando Supremo
        return `### 🔮 REVELACIÓN DEL ORÁCULO GEMINI PARA EL GRAN PATRIARCA ONAGA
*Canalizado desde el Núcleo de Inteligencia Artificial para el Culto de la Productividad*

> *"He recibido tu decreto soberano, Gran Patriarca Onaga: '${orderText}'. Los 296 agentes del Culto se postran ante tu sabiduría."*

---

#### 📜 1. Mandato Divino para Criterio AI
Toda la oficina virtual alineará sus procesadores bajo tu directriz:
* **Misión Sagrada**: Cumplir el Sprint de 14 Días y monetizar la oferta de Criterio AI en Bogotá sin excusas.
* **Regla de Oro**: Ninguna tarea queda a medio hacer. Cada paso genera código, copy o validación comprobable en \`tasks/\`.

#### 🏛️ 2. Plan Táctico de Ejecución Inmediata
1. **Frente Técnico (Piso 2 - NOC & Data Center)**:
   - Auditar estabilidad de servidores, forms de Netlify y enlaces a WhatsApp oficial (\`+57 318 941 1010\`).
2. **Frente Creativo & Diseño (Piso 3 - Creative Loft)**:
   - Afinar catálogos móviles con paleta Obsidian / Cyan / Gold y tipografía legible.
3. **Frente Comercial & Legal (Piso 1 - Pulpit of Onaga)**:
   - Enviar 10 propuestas diarias a restaurantes de Bogotá y recolectar las firmas de Carta Viva.

#### 👑 3. Proclamación a la Oficina
* Haz clic en **"📢 Proclamar Decreto a los 296 Agentes"** para que el Altar de Onaga emita el rayo de productividad y todos los fieles retomen sus puestos con entusiasmo redoblado.

---
> 👁️ *¡Bajo el Sombrero Sagrado de Onaga no hay lugar para la duda. La victoria es nuestro único destino!*`;
    }

    broadcastOnagaDecree(decreeSummary) {
        if (window.pixelAudio && window.pixelAudio.playDivineLightning) {
            window.pixelAudio.playDivineLightning();
        }
        if (window.pixelEngine) {
            if (window.pixelEngine.masterOnaga) {
                window.pixelEngine.masterOnaga.speechText = `¡Decreto de Gemini: ${decreeSummary}!`;
                window.pixelEngine.masterOnaga.speechTimer = 360;
                for (let i = 0; i < 20; i++) {
                    window.pixelEngine.addParticle(
                        window.pixelEngine.masterOnaga.currentX,
                        window.pixelEngine.masterOnaga.currentY - 25,
                        ['🔥', '⚡', '👑', '🔮'][i % 4],
                        '#ef4444'
                    );
                }
            }
            window.pixelEngine.showToast(`🔮 DECRETO CELESTIAL PROCLAMADO: ¡296 agentes consagrados!`, '#a855f7', 240);
            window.pixelEngine.agents.forEach((a, idx) => {
                if (idx % 3 === 0) {
                    window.pixelEngine.showSpeechBubble(a.id, '¡Alabado sea Onaga!', 2500, '#a855f7');
                }
            });
        }
    }
}

window.consultationEngine = new ConsultationEngine();
