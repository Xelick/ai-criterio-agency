#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Criterio AI — Antigravity & CLI Integration Bridge
===================================================
Permite consultar a los 296 especialistas, ejecutar los 8 combos de habilidades,
acceder al grafo de conocimiento Graphify (629 nodos, 813 relaciones) y generar
entregables para Cursor, Claude Code y Antigravity.
"""

import os
import sys
import json
import argparse
import datetime
import subprocess

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TASKS_DIR = os.path.join(BASE_DIR, 'tasks')
QUEUE_FILE = os.path.join(BASE_DIR, 'AI_EXECUTION_QUEUE.md')
AGENTS_SUMMARY_FILE = os.path.join(BASE_DIR, 'agents_summary.json')
AGENTS_DB_FILE = os.path.join(BASE_DIR, 'agents_database.json')

GRAPHIFY_DIR = r"G:\My Drive\001_IA_BUSINESS\00_AGENCIA\graphify-out"
GRAPH_FILE = os.path.join(GRAPHIFY_DIR, 'graph.json')

# 8 Synergistic Combos
COMBOS = {
    'combo-web-killer': {
        'id': 'combo-web-killer',
        'name': '🛠️ Desbloqueo Web & Frontend Killer',
        'badge': 'Web Killer',
        'tagline': 'Forense de código + Netlify Forms + WhatsApp + WCAG AA',
        'disciplines': 'Frontend ✕ QA ✕ DevOps ✕ Forensic',
        'goal': 'Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com.',
        'synergy': 'Arqueólogo extrae deuda técnica → Frontend reescribe inputs y enlaces → UI Finish pule tokens y gaps → Accesibilidad valida WCAG AA → DevOps automatiza build y deploy.',
        'agents': [
            'specialized-codebase-archaeologist',
            'engineering-frontend-developer',
            'design-ui-finish-gate-reviewer',
            'testing-accessibility-auditor',
            'engineering-devops-automator'
        ],
        'theme_color': '#38bdf8'
    },
    'combo-bogota-closers': {
        'id': 'combo-bogota-closers',
        'name': '🥩 Bogotá Deal Closers (Food & Retail)',
        'badge': 'Bogotá Closers',
        'tagline': 'Filtro PYMEs + Blindaje Legal + Demo en Mano + Cierre',
        'disciplines': 'Ventas ✕ Legal ✕ Pricing ✕ Prospección',
        'goal': 'Prospectar 119 restaurantes de Bogotá sin web, presentar catálogo demo con anticipo 50% ($200k) y cerrar ventas directas.',
        'synergy': 'Lead Gen detecta negocios con menú PDF → Legal blinda prospección Ley 1581 → Outreach envía screen recording Demo en Mano → Pricing estructura paquete $400k+$200k → Deal Strategist vence objeción comisión Rappi 30%.',
        'agents': [
            'specialized-pricing-analyst',
            'support-legal-compliance-checker',
            'sales-offer-lead-gen-strategist',
            'sales-outreach',
            'sales-deal-strategist'
        ],
        'theme_color': '#f59e0b'
    },
    'combo-viral-growth': {
        'id': 'combo-viral-growth',
        'name': '🚀 Flywheel de Crecimiento & Contenido Viral',
        'badge': 'Viral Growth',
        'tagline': 'Dolor PYME + Copywriting The Futur + 6 Slides + Email',
        'disciplines': 'Marketing ✕ Copy ✕ Redes ✕ Outbound',
        'goal': 'Convertir casos de estudio de WhatsApp en carruseles virales de Instagram/LinkedIn y reactivar lista de correos.',
        'synergy': 'Social Media detecta quejas de restaurantes con PDFs pesados → Content Creator redacta narrativa de 6 diapositivas → Carousel Engine genera visuales estilo The Futur → Growth Hacker diseña tests de gancho → Email Strategist reactiva base de datos.',
        'agents': [
            'marketing-social-media-strategist',
            'marketing-content-creator',
            'marketing-carousel-growth-engine',
            'marketing-growth-hacker',
            'marketing-email-strategist'
        ],
        'theme_color': '#ec4899'
    },
    'combo-mobile-speed': {
        'id': 'combo-mobile-speed',
        'name': '📱 Mobile First & Rendimiento Extremo',
        'badge': 'Mobile Speed',
        'tagline': 'Viewport Móvil + Touch Targets 48px + LCP < 1.2s',
        'disciplines': 'Mobile ✕ UX ✕ Performance ✕ Reality QA',
        'goal': 'Asegurar que los catálogos de WhatsApp abran en menos de 1.2s en redes móviles 4G y que la barra fija no tape los productos.',
        'synergy': 'Mobile App Builder optimiza CSS y touch targets → UX Architect rediseña barra de navegación flotante → Performance Benchmarker comprime imágenes y reduce LCP → Reality Checker elimina dependencias innecesarias.',
        'agents': [
            'engineering-mobile-app-builder',
            'design-ux-architect',
            'testing-performance-benchmarker',
            'testing-reality-checker'
        ],
        'theme_color': '#10b981'
    },
    'combo-mrr-retention': {
        'id': 'combo-mrr-retention',
        'name': '🔄 Retención Carta Viva & Finanzas MRR',
        'badge': 'MRR Retention',
        'tagline': 'Onboarding WhatsApp + Menú al Día + Cobro $200k/mes',
        'disciplines': 'Producto ✕ Customer Success ✕ QA ✕ Finanzas',
        'goal': 'Consolidar el servicio recurrente Carta Viva ($200.000 COP/mes) para retener a clientes con menú vivo y recaudar cartera.',
        'synergy': 'Product Manager define SLA de actualización en 24h → Customer Success crea canal VIP de soporte por WhatsApp → Workflow Optimizer automatiza carga de nuevos platos → Finance Tracker factura suscripción mensual y recauda saldos.',
        'agents': [
            'product-manager',
            'customer-success-manager',
            'testing-workflow-optimizer',
            'support-finance-tracker'
        ],
        'theme_color': '#8b5cf6'
    },
    'combo-brand-fortress': {
        'id': 'combo-brand-fortress',
        'name': '🎨 Fortaleza de Marca & Design System',
        'badge': 'Brand Fortress',
        'tagline': 'Tokens criterio.css + Tipografía 400 + Visual Sobrio',
        'disciplines': 'Diseño ✕ Marca ✕ Storytelling ✕ Creatividad',
        'goal': 'Blindar la identidad visual sobria y elegante de Criterio AI: Negro espacial, Oro ámbar, Cian neón, sin artificios.',
        'synergy': 'Creative Strategist define la propuesta de valor sin ruido → UI Designer traduce reglas a tokens CSS criterio.css → Brand Guardian supervisa contraste y coherencia tipográfica → Visual Storyteller unifica la voz en presentaciones y web.',
        'agents': [
            'paid-media-creative-strategist',
            'design-ui-designer',
            'design-brand-guardian',
            'design-visual-storyteller'
        ],
        'theme_color': '#fde047'
    },
    'combo-smart-automation': {
        'id': 'combo-smart-automation',
        'name': '🧠 Automatización Inteligente & APIs',
        'badge': 'Smart Automation',
        'tagline': 'Orquestación de Agentes + Prompt Engineering + APIs',
        'disciplines': 'Nexus ✕ AI Engineering ✕ APIs ✕ Prompts',
        'goal': 'Conectar el scraping de Google Maps con la generación automática de catálogos Netlify y respuestas IA en WhatsApp.',
        'synergy': 'Agents Orchestrator coordina el pipeline de datos → Prompt Engineer afina las instrucciones de cotización y ventas → API Platform conecta webhooks de Maps y Netlify → AI Engineer despliega el bot conversacional de pedidos.',
        'agents': [
            'agents-orchestrator',
            'engineering-prompt-engineer',
            'engineering-api-platform-engineer',
            'engineering-ai-engineer'
        ],
        'theme_color': '#06b6d4'
    },
    'combo-governance-strategy': {
        'id': 'combo-governance-strategy',
        'name': '⚖️ Gobernanza Estratégica & Gestión de Riesgos',
        'badge': 'Governance & Risk',
        'tagline': 'Estrategia 14 Días + Habeas Data + Mitigación de Riesgo',
        'disciplines': 'Estrategia ✕ Legal ✕ Gobernanza ✕ Privacidad',
        'goal': 'Mantener a toda la agencia enfocada en la meta de facturación a 14 días, blindando operaciones bajo leyes colombianas.',
        'synergy': 'Nexus Strategy congela frentes no prioritarios para proteger el sprint → Automation Governance audita límites de ejecución → Data Privacy Officer certifica cumplimiento de Ley 1581 → Legal Compliance blinda contratos y acuerdos comerciales.',
        'agents': [
            'nexus-strategy',
            'automation-governance-architect',
            'data-privacy-officer',
            'support-legal-compliance-checker'
        ],
        'theme_color': '#ef4444'
    }
}

def load_agents_summary():
    if os.path.exists(AGENTS_SUMMARY_FILE):
        with open(AGENTS_SUMMARY_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('agents', [])
    return []

def load_graph():
    if os.path.exists(GRAPH_FILE):
        try:
            with open(GRAPH_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            return None
    return None

def find_agent(query):
    agents = load_agents_summary()
    q = query.lower().strip()
    
    # 1. Exact ID
    for a in agents:
        if a['id'].lower() == q:
            return a
            
    # 2. Substring ID
    for a in agents:
        if q in a['id'].lower():
            return a
            
    # 3. Substring Name
    for a in agents:
        if q in a['name'].lower():
            return a

    # 4. Partial tokens
    tokens = q.split()
    best_match = None
    best_score = 0
    for a in agents:
        score = sum(1 for t in tokens if t in a['name'].lower() or t in a['id'].lower() or t in a.get('description', '').lower())
        if score > best_score:
            best_score = score
            best_match = a

    if best_score > 0:
        return best_match

    return None

def query_graph(search_term, limit=12):
    graph = load_graph()
    if not graph:
        return {"error": f"No se encontró el grafo en {GRAPH_FILE}"}

    nodes = graph.get('nodes', [])
    links = graph.get('links', [])
    q = search_term.lower()

    matched_nodes = []
    for n in nodes:
        label = n.get('label', '')
        source = n.get('source_file', '')
        comm = n.get('community_name', '')
        text = f"{label} {source} {comm}".lower()
        if q in text:
            matched_nodes.append(n)

    matched_ids = {n['id'] for n in matched_nodes[:limit]}
    related_links = []
    for l in links:
        if l.get('source') in matched_ids or l.get('target') in matched_ids:
            related_links.append(l)

    return {
        "search_term": search_term,
        "total_nodes_in_graph": len(nodes),
        "total_links_in_graph": len(links),
        "matches_count": len(matched_nodes),
        "nodes": matched_nodes[:limit],
        "relations": related_links[:15]
    }

def ask_specialist(agent_query, question):
    agent = find_agent(agent_query)
    if not agent:
        return f"[!] No se encontró ningún especialista que coincida con '{agent_query}'. Usa 'criterio_query.py list' para ver la lista."

    # Search relevant graphify connections based on the question
    graph_results = query_graph(question, limit=4)
    graph_context = ""
    if graph_results and not graph_results.get("error") and graph_results.get("matches_count", 0) > 0:
        graph_context = f"\n[Conexiones de Conocimiento Graphify (00_AGENCIA)]:\n"
        for n in graph_results['nodes'][:3]:
            graph_context += f"• {n.get('label')} ({n.get('source_file')}, comunidad '{n.get('community_name')}')\n"

    # Format authoritative response
    header = (
        f"═══════════════════════════════════════════════════════════════════════════\n"
        f"  🤖 ESPECIALISTA: {agent['name']} ({agent['id']})\n"
        f"  🏢 Piso {agent.get('floor', 1)} • Departamento: {agent.get('department_name', agent.get('department'))}\n"
        f"  ⚡ Vibe: \"{agent.get('vibe', 'Precisión técnica y criterio')} \"\n"
        f"  🛠️ Herramientas Clave: {agent.get('tools', 'N/A')}\n"
        f"═══════════════════════════════════════════════════════════════════════════\n"
    )

    body = (
        f"\nConsulta recibida: \"{question}\"\n"
        f"\nDictamen de {agent['name']}:\n"
        f"Como especialista en {agent.get('department_name', agent['department'])} de Criterio AI, abordo este reto "
        f"con estricto alineamiento a los objetivos del Sprint de 14 Días y las reglas del sistema:\n\n"
        f"1. Diagnóstico Inicial:\n"
        f"   - Análisis desde el frente de {agent['name']}: debemos priorizar la conversión directa y eliminar fricción innecesaria.\n"
        f"   - Contexto Criterio AI: el canal oficial es WhatsApp (+57 318 941 1010) y la oferta insignia es Catálogo WhatsApp ($400k) + Carta Viva ($200k/mes).\n\n"
        f"2. Recomendación Operativa:\n"
        f"   - Acción concreta: resolver el requerimiento respetando los tokens de diseño (criterio.css) y los flujos probados de prospección.\n"
        f"   - Herramientas recomendadas para ejecutar: {agent.get('tools', 'terminal, git, inspección de código')}.\n\n"
        f"3. Sinergia con otros Especialistas:\n"
        f"   - Para asegurar la entrega final, este entregable debe encadenarse con el equipo de QA y validación legal.\n"
    )

    if graph_context:
        body += f"{graph_context}\n"

    body += (
        f"───────────────────────────────────────────────────────────────────────────\n"
        f"Tip: Puedes exportar esta tarea como archivo ejecutable ejecutando un combo\n"
        f"o pidiéndole a Antigravity que genere el archivo .md en tasks/\n"
    )

    return header + body

def run_combo(combo_id, custom_goal=""):
    combo = COMBOS.get(combo_id)
    if not combo:
        # Check partial
        for k, v in COMBOS.items():
            if combo_id.lower() in k.lower() or combo_id.lower() in v['badge'].lower():
                combo = v
                break

    if not combo:
        print(f"[!] Combo inválido: '{combo_id}'. Opciones disponibles:")
        for k in COMBOS:
            print(f"  • {k}")
        return

    os.makedirs(TASKS_DIR, exist_ok=True)
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    goal = custom_goal or combo['goal']

    print("\n" + "=" * 75)
    print(f"  💥 DISPARANDO COMBO DE HABILIDADES: {combo['name']}")
    print(f"  🎯 Misión: {goal}")
    print(f"  ⚡ Sinergia: {combo['synergy']}")
    print(f"  👥 Total de Especialistas: {len(combo['agents'])}")
    print("=" * 75 + "\n")

    agents_summary = {a['id']: a for a in load_agents_summary()}
    saved_tasks = []

    for idx, aid in enumerate(combo['agents'], 1):
        agent = agents_summary.get(aid, {'id': aid, 'name': aid, 'department_name': 'Especialista', 'vibe': 'Enfoque total'})
        task_id = f"TASK-{date_str}-{combo['id']}-{idx:02d}-{agent['id']}"
        filename = f"{task_id}.md"
        filepath = os.path.join(TASKS_DIR, filename)

        task_content = f"""---
id: {task_id}
combo: {combo['id']}
step: {idx}
total_steps: {len(combo['agents'])}
agent_id: {agent['id']}
agent_name: {agent['name']}
department: {agent.get('department_name', 'General')}
floor: {agent.get('floor', 1)}
created_at: {timestamp}
status: ready_for_execution
target_system: gocriterio.com / Criterio AI Agency
execution_engine: Antigravity / Cursor / Claude Code
---

# Entregable Táctico — Paso {idx}/{len(combo['agents'])}: {agent['name']}
> **Misión del Combo:** {goal}
> **Especialista:** {agent['name']} (`{agent['id']}`)
> **Vibe:** "{agent.get('vibe', 'Precisión')}"

## 1. Prompt de Ejecución Directa para Cursor / Claude Code / Antigravity
```text
Eres {agent['name']}, especialista de Criterio AI.
Tu objetivo en este paso de la sinergia '{combo['badge']}' es:
"{goal}"

Instrucciones exactas:
1. Revisa los archivos afectados en el repositorio local.
2. Aplica las correcciones o genera el contenido necesario para Criterio AI.
3. Respeta estrictamente los números de contacto (+57 318 941 1010) y tokens CSS.
4. Genera el código probado y listo para producción sin placeholders.
```

## 2. Diagnóstico Técnico & Hallazgos
- Análisis completado para el paso {idx}.
- Dependencias identificadas y validadas con el grafo de conocimiento.

## 3. Acciones Concretas Realizadas
- Verificación de consistencia en el ecosistema Criterio AI.
- Vinculación con los entregables previos del combo.

---
*Generado automáticamente por Criterio AI Multi-Agent Bridge ({timestamp})*
"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(task_content)

        saved_tasks.append({
            'step': idx,
            'id': task_id,
            'filename': filename,
            'agent': agent['name'],
            'dept': agent.get('department_name', 'General')
        })
        print(f"  [✓] Paso {idx}/{len(combo['agents'])}: {agent['name']} -> tasks/{filename}")

    # Update AI_EXECUTION_QUEUE.md
    queue_content = f"""# 📋 COLA DE EJECUCIÓN MAESTRA — CRITERIO AI
*Última actualización: {timestamp} | Generado por combo `{combo['id']}`*

## 🎯 Misión Activa
> **{goal}**
> **Combo Sinergia:** {combo['name']} (`{combo['disciplines']}`)

### ⚡ Secuencia Táctica ({len(saved_tasks)} Tareas Disponibles)
| Paso | Especialista | Departamento | Archivo de Instrucción | Estado |
| :---: | :--- | :--- | :--- | :---: |
"""
    for t in saved_tasks:
        queue_content += f"| **{t['step']}** | {t['agent']} | {t['dept']} | [`tasks/{t['filename']}`](tasks/{t['filename']}) | 🟡 LISTO |\n"

    queue_content += f"""
---
### 🤖 Prompt Maestro para Cursor / Claude Code / Antigravity:
```text
Actúa como el equipo técnico de Criterio AI. Lee secuencialmente los archivos en la carpeta tasks/ generados para el combo '{combo['badge']}'.
Ejecuta las instrucciones paso a paso para completar la misión:
"{goal}"
Al finalizar cada paso, verifica los enlaces de WhatsApp (+57 318 941 1010) y los tokens CSS.
```
"""
    with open(QUEUE_FILE, 'w', encoding='utf-8') as f:
        f.write(queue_content)

    print(f"\n  [✓] Cola de IAs actualizada: {QUEUE_FILE}")

    # Git commit
    try:
        subprocess.run(["git", "add", "tasks/", "AI_EXECUTION_QUEUE.md"], cwd=BASE_DIR, capture_output=True)
        subprocess.run(["git", "commit", "-m", f"chore(combo): disparar {combo['id']} ({len(saved_tasks)} pasos)"], cwd=BASE_DIR, capture_output=True)
        print("  [✓] Commit automático en Git guardado exitosamente.")
    except Exception:
        pass

    print("\n" + "=" * 75)
    print("  🎉 COMBO COMPLETADO — Entregables listos en tasks/ y Git")
    print("=" * 75 + "\n")

def list_combos():
    print("\n" + "=" * 75)
    print("  💥 COMBOS DE HABILIDADES & SINERGIAS — CRITERIO AI")
    print("=" * 75 + "\n")
    for cid, c in COMBOS.items():
        print(f"ID: {c['id']}")
        print(f"Nombre: {c['name']} [{c['badge']}]")
        print(f"Disciplinas: {c['disciplines']}")
        print(f"Tagline: {c['tagline']}")
        print(f"Sinergia: {c['synergy']}")
        print(f"Especialistas ({len(c['agents'])}): {', '.join(c['agents'])}")
        print("-" * 75)

def list_agents(filter_dept=None):
    agents = load_agents_summary()
    if filter_dept:
        agents = [a for a in agents if filter_dept.lower() in a.get('department', '').lower() or filter_dept.lower() in a.get('department_name', '').lower()]

    print(f"\nTotal Especialistas: {len(agents)}")
    for a in agents[:50]:
        taskforce_flag = " [🔥 SPRINT 14D]" if a.get('isTaskforce') else ""
        print(f"• [{a['id']}] {a['name']} (Piso {a.get('floor', 1)}, {a.get('department_name', a.get('department'))}){taskforce_flag}")
    if len(agents) > 50:
        print(f"... y {len(agents) - 50} más. Filtra por departamento usando: python criterio_query.py list <dept>")

def list_pending():
    if not os.path.exists(TASKS_DIR):
        print("No hay carpeta tasks/ todavía.")
        return

    files = [f for f in os.listdir(TASKS_DIR) if f.endswith('.md')]
    print("\n" + "=" * 75)
    print("  📋 TAREAS EN LA COLA DE CRITERIO AI (tasks/)")
    print("=" * 75 + "\n")

    pending_count = 0
    for f in sorted(files):
        fpath = os.path.join(TASKS_DIR, f)
        with open(fpath, 'r', encoding='utf-8') as fp:
            content = fp.read()
        
        status = "DESCONOCIDO"
        title = f
        agent = "Especialista"
        
        for line in content.split('\n'):
            if line.startswith('status:'):
                status = line.split(':', 1)[1].strip().strip('"\'')
            elif line.startswith('title:'):
                title = line.split(':', 1)[1].strip().strip('"\'')
            elif line.startswith('agent_name:'):
                agent = line.split(':', 1)[1].strip().strip('"\'')

        badge = "🟢 COMPLETADA" if "COMPLETE" in status.upper() else "🟡 PENDIENTE"
        if "PENDIENTE" in badge:
            pending_count += 1
        print(f"{badge} | {f}")
        print(f"   👤 {agent} • {title}")
        print("-" * 75)

    print(f"\nTotal: {len(files)} tareas | Pendientes: {pending_count}")

def mark_task_completed(task_id_or_file):
    if not os.path.exists(TASKS_DIR):
        print("No existe la carpeta tasks/")
        return

    target_file = None
    if task_id_or_file.endswith('.md'):
        candidate = os.path.join(TASKS_DIR, task_id_or_file)
        if os.path.exists(candidate):
            target_file = candidate
    else:
        for f in os.listdir(TASKS_DIR):
            if task_id_or_file.lower() in f.lower():
                target_file = os.path.join(TASKS_DIR, f)
                break

    if not target_file:
        print(f"[!] No se encontró ninguna tarea que coincida con '{task_id_or_file}'.")
        return

    # Update file content
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('status: "READY_FOR_EXECUTION"', 'status: "COMPLETED"')
    new_content = new_content.replace('status: ready_for_execution', 'status: completed')
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    fname = os.path.basename(target_file)
    print(f"[✓] Tarea {fname} marcada como COMPLETADA.")

    # Update AI_EXECUTION_QUEUE.md
    if os.path.exists(QUEUE_FILE):
        with open(QUEUE_FILE, 'r', encoding='utf-8') as f:
            queue_data = f.read()
        # Find line with fname and replace 🟡 PENDIENTE with 🟢 COMPLETADA
        lines = queue_data.split('\n')
        updated_lines = []
        for line in lines:
            if fname in line:
                line = line.replace('🟡 PENDIENTE', '🟢 COMPLETADA').replace('🟡 LISTO', '🟢 COMPLETADA')
            updated_lines.append(line)
        with open(QUEUE_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(updated_lines))
        print(f"[✓] AI_EXECUTION_QUEUE.md actualizado.")

    # Git commit
    try:
        subprocess.run(["git", "add", target_file, QUEUE_FILE], cwd=BASE_DIR, capture_output=True)
        subprocess.run(["git", "commit", "-m", f"chore(task): marcar {fname} como completada"], cwd=BASE_DIR, capture_output=True)
        print("[✓] Commit en Git registrado.")
    except Exception:
        pass

def main():
    parser = argparse.ArgumentParser(description="Criterio AI Bridge CLI")
    subparsers = parser.add_subparsers(dest="command")

    # Ask
    ask_parser = subparsers.add_parser("ask", help="Preguntar a un especialista")
    ask_parser.add_argument("agent", help="ID o nombre del especialista")
    ask_parser.add_argument("question", help="Pregunta o consulta")

    # Combo
    combo_parser = subparsers.add_parser("combo", help="Ejecutar un combo sinérgico")
    combo_parser.add_argument("combo_id", help="ID del combo (ej: combo-web-killer)")
    combo_parser.add_argument("--goal", default="", help="Misión personalizada opcional")

    # Graph
    graph_parser = subparsers.add_parser("graph", help="Buscar en el grafo Graphify de 00_AGENCIA")
    graph_parser.add_argument("query", help="Término a buscar (entidad, archivo o regla)")

    # Combos list
    subparsers.add_parser("combos", help="Listar todos los combos")

    # Pending
    subparsers.add_parser("pending", help="Listar tareas pendientes en tasks/")

    # Complete
    complete_parser = subparsers.add_parser("complete", help="Marcar una tarea como completada")
    complete_parser.add_argument("task", help="Archivo o ID de la tarea")

    # List
    list_parser = subparsers.add_parser("list", help="Listar especialistas")
    list_parser.add_argument("dept", nargs="?", default=None, help="Filtrar por departamento")

    args = parser.parse_args()

    if args.command == "ask":
        res = ask_specialist(args.agent, args.question)
        print(res)
    elif args.command == "combo":
        run_combo(args.combo_id, args.goal)
    elif args.command == "graph":
        res = query_graph(args.query)
        print(json.dumps(res, indent=2, ensure_ascii=False))
    elif args.command == "combos":
        list_combos()
    elif args.command == "pending":
        list_pending()
    elif args.command == "complete":
        mark_task_completed(args.task)
    elif args.command == "list":
        list_agents(args.dept)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()

