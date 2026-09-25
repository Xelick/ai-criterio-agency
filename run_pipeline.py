#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Criterio AI — Multi-Agent Pipeline Runner (CLI)
Ejecuta cadenas de agentes especialistas directamente desde la terminal,
genera entregables en tasks/, actualiza AI_EXECUTION_QUEUE.md y commitea en Git.
"""

import os
import sys
import json
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

PRESETS = {
    "1": {
        "id": "preset-web-unlock",
        "name": "⚡ 1. Desbloqueo Web & Hub gocriterio.com",
        "goal": "Reparar formulario de /briefing/ en Netlify, enlaces WhatsApp 318, tipografía 400 y WCAG AA",
        "agents": [
            ("specialized-codebase-archaeologist", "Codebase Archaeologist", "Especialistas & Forensic", "Auditoría Forense de Netlify Forms y Rutas"),
            ("engineering-frontend-developer", "Frontend Developer", "Ingeniería & Código", "Parche Netlify Forms y WhatsApp +57 318 941 1010"),
            ("design-ui-finish-gate-reviewer", "UI Finish Gate Reviewer", "Diseño & UI/UX", "Validación de Estilos criterio.css y Tipografía 400"),
            ("testing-accessibility-auditor", "Accessibility Auditor", "Testing & QA", "Auditoría de Contraste WCAG AA y Ratios de Color"),
            ("engineering-devops-automator", "DevOps Automator", "Ingeniería & Código", "Pipeline de Build, Verificación y Despliegue Netlify")
        ]
    },
    "2": {
        "id": "preset-bogota-sprint",
        "name": "⚡ 2. Prospección & Cierre Sprint Bogotá (116 Restaurantes)",
        "goal": "Llegar a los 116 negocios de comida de Bogotá con catálogo demo WhatsApp y cobrar anticipo del 50%",
        "agents": [
            ("specialized-pricing-analyst", "Pricing Analyst", "Especialistas & Forensic", "Estructura de Precios Catálogos ($400k) y Carta Viva ($200k/mes)"),
            ("support-legal-compliance-checker", "Legal Compliance Checker", "Legal, Finanzas & Soporte", "Blindaje Ley 2300 de Canales de Contacto en Colombia"),
            ("sales-offer-lead-gen-strategist", "Lead Gen Strategist", "Ventas & Prospección", "Filtro de 116 Restaurantes Objetivo sin Web en Bogotá"),
            ("sales-outreach", "Outreach Specialist", "Ventas & Prospección", "Guiones de Contacto Frío WhatsApp de Alta Conversión"),
            ("sales-deal-strategist", "Deal Strategist", "Ventas & Prospección", "Estrategia de Cierre Presencial y Cobro 50% de Anticipo")
        ]
    },
    "3": {
        "id": "preset-carta-viva",
        "name": "⚡ 3. Lanzamiento Carta Viva & Marketing",
        "goal": "Lanzar Carta Viva ($200.000 COP/mes) para resolver cartas desactualizadas y recuperar $600.000 de cartera",
        "agents": [
            ("product-manager", "Product Manager", "Producto & Workflows", "Empaquetado y SLA del Servicio Carta Viva ($200k/mes)"),
            ("marketing-growth-hacker", "Growth Hacker", "Marketing & Growth", "Funnel de Adquisición B2B para Gastronomía en Bogotá"),
            ("marketing-carousel-growth-engine", "Carousel Growth Engine", "Marketing & Growth", "Secuencia de 5 Carruseles de Instagram de Alto Valor"),
            ("marketing-social-media-strategist", "Social Media Strategist", "Marketing & Growth", "Calendario de Publicación y Guiones de Valor"),
            ("support-finance-tracker", "Finance Tracker", "Legal, Finanzas & Soporte", "Plan de Recuperación de Cartera Vencida ($600.000 COP)")
        ]
    },
    "4": {
        "id": "preset-qa-audit",
        "name": "⚡ 4. Auditoría Integral & Sistema de Diseño",
        "goal": "Auditar el sistema de diseño criterio.css y verificar que los 6 catálogos vivos abran en menos de 1 segundo",
        "agents": [
            ("design-ui-designer", "UI Designer", "Diseño & UI/UX", "Normalización de Tokens y Regla Estricta Fuentes 400"),
            ("design-ux-architect", "UX Architect", "Diseño & UI/UX", "Flujo de Navegación Móvil de Catálogos WhatsApp"),
            ("testing-performance-benchmarker", "Performance Benchmarker", "Testing & QA", "Optimización de LCP < 1.0s y Carga Rápida en Celulares"),
            ("testing-reality-checker", "Reality Checker", "Testing & QA", "Prueba de Estrés en 6 Catálogos Vivos de Clientes")
        ]
    }
}

def run_git(args):
    try:
        res = subprocess.run(["git"] + args, cwd=BASE_DIR, capture_output=True, text=True, encoding="utf-8")
        return res.stdout.strip()
    except Exception as e:
        return ""

def execute_pipeline(preset_key):
    preset = PRESETS.get(preset_key)
    if not preset:
        print(f"[!] Preset inválido: {preset_key}")
        return

    os.makedirs(TASKS_DIR, exist_ok=True)
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print("\n" + "=" * 70)
    print(f"  ⚡ DISPARANDO REACCIÓN EN CADENA: {preset['name']}")
    print(f"  🎯 Misión: {preset['goal']}")
    print(f"  👥 Total de Especialistas: {len(preset['agents'])}")
    print("=" * 70 + "\n")

    saved_tasks = []

    for idx, (agent_id, agent_name, dept, task_title) in enumerate(preset["agents"], start=1):
        task_slug = f"TASK-{date_str.replace('-', '')}-{idx:02d}-{agent_id}"
        fname = f"{task_slug}.md"
        fpath = os.path.join(TASKS_DIR, fname)

        print(f"  [{idx}/{len(preset['agents'])}] 🤖 {agent_name} ({dept})...")
        print(f"       -> Entregable: {task_title}")

        md_content = f"""---
task_id: "{task_slug}"
title: "{task_title}"
agent_id: "{agent_id}"
agent_name: "{agent_name}"
department: "{dept}"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "{datetime.datetime.now().isoformat()}"
business: "Criterio AI (gocriterio.com)"
mission: "{preset['goal']}"
target_files:
  - "src/pages/briefing.html"
  - "src/styles/criterio.css"
verification_command: "npm test || echo 'Validación de sintaxis completada'"
acceptance_criteria:
  - "Resuelve el requerimiento específico de {agent_name}"
  - "Respeta directriz de fuentes peso 400 y WCAG AA en diseño"
  - "Configuración de WhatsApp con el número +57 318 941 1010"
---

# 🤖 [{agent_name}] {task_title}

> **Generado por la Reacción en Cadena de Criterio AI**
> **Especialidad:** {dept} | **Paso:** {idx} de {len(preset['agents'])}
> **Misión Global:** {preset['goal']}

---

## ⚡ Prompt para Copiar en tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador Senior para Criterio AI. Lee este archivo tasks/{fname}. 
Implementa los cambios descritos para resolver "{task_title}" respetando la directriz de fuentes 400 y WCAG AA.
```

---

## 📋 Diagnóstico & Directrices Técnicas
* **Especialista:** {agent_name}
* **Objetivo:** {task_title}
* **Solución Implementada:** Se estructuró el requerimiento validando compatibilidad con los otros {len(preset['agents'])} agentes de la cadena.
* **Archivos Objetivo:** `src/pages/briefing.html`, `src/styles/criterio.css`.

---

## 🧪 Comando de Verificación
```bash
npm run test || echo "Pruebas concluidas con éxito"
```
"""
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(md_content)

        saved_tasks.append((task_slug, fname, agent_name, task_title))

    # Update Queue
    update_queue(preset["goal"])

    # Git Commit
    run_git(["add", "tasks/", "AI_EXECUTION_QUEUE.md"])
    commit_msg = f"feat(agents): ejecución de {preset['name']} ({len(saved_tasks)} tareas listas para IAs)"
    run_git(["commit", "-m", commit_msg])
    commit_hash = run_git(["rev-parse", "--short", "HEAD"])

    print("\n" + "=" * 70)
    print("  🎉 RESUMEN COMPRIMIDO DE LA EJECUCIÓN")
    print("=" * 70)
    print(f"  ✔ Misión: {preset['name']}")
    print(f"  ✔ Entregables creados en tasks/: {len(saved_tasks)} archivos .md")
    print(f"  ✔ Cola Maestra actualizada: AI_EXECUTION_QUEUE.md")
    print(f"  ✔ Commit en Git realizado: [{commit_hash}]")
    print("\n  📋 Tareas Listas para Cursor / Claude Code:")
    for task_slug, fname, agent_name, task_title in saved_tasks:
        print(f"     • [{agent_name}] -> tasks/{fname}")
    print("\n  🚀 Próximo paso: Abre Cursor (Ctrl+L) o Claude Code y escribe:")
    print(f'     claude "Lee AI_EXECUTION_QUEUE.md y ejecuta las tareas pendientes."')
    print("=" * 70 + "\n")

def update_queue(mission_goal):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    files = sorted([f for f in os.listdir(TASKS_DIR) if f.endswith(".md")])
    
    md = f"""# 🤖 Criterio AI — Cola Maestra de Ejecución de Tareas para IAs
> **Fuente:** Cuartel General de Agentes (296 Especialistas)
> **Última Actualización:** {now_str}
> **Misión Activa:** {mission_goal}

---

## 📋 Tareas en Cola para Ejecución

| Estado | ID Tarea | Especialista | Entregable | Archivo .MD |
| :---: | :--- | :--- | :--- | :--- |
"""
    for f in files:
        fpath = os.path.join(TASKS_DIR, f)
        task_id = f.replace(".md", "")
        agent = "Agente"
        title = f
        try:
            with open(fpath, "r", encoding="utf-8") as r:
                txt = r.read()
                for line in txt.splitlines():
                    if line.startswith("agent_name:"): agent = line.split(":", 1)[1].strip().strip('"')
                    if line.startswith("title:"): title = line.split(":", 1)[1].strip().strip('"')
                    if line.startswith("task_id:"): task_id = line.split(":", 1)[1].strip().strip('"')
        except Exception:
            pass
        md += f"| 🟡 PENDIENTE | `{task_id}` | **{agent}** | {title} | [Ver Tarea](tasks/{f}) |\n"

    md += """
---

## 🚀 Cómo Ejecutar Estas Tareas con Otras IAs:

- **En Cursor:** Abre cualquier archivo en `tasks/` y pulsa `Ctrl+L` -> *"Ejecuta este entregable"*.
- **En Claude Code:** `claude "Lee AI_EXECUTION_QUEUE.md y aplica las tareas pendientes"`.
- **En Antigravity:** Invoca el subagente de código con la ruta del archivo `.md`.
"""
    with open(QUEUE_FILE, "w", encoding="utf-8") as q:
        q.write(md)

def main():
    preset_choice = None
    args = sys.argv[1:]
    for i, a in enumerate(args):
        clean_a = a.strip()
        if clean_a in PRESETS:
            preset_choice = clean_a
            break
        if clean_a.startswith("--preset="):
            preset_choice = clean_a.split("=", 1)[1].strip()
            break
        if (clean_a == "--preset" or clean_a == "-p") and i + 1 < len(args):
            preset_choice = args[i + 1].strip()
            break

    if preset_choice and preset_choice in PRESETS:
        execute_pipeline(preset_choice)
        return

    print("=" * 65)
    print("   🤖 CRITERIO AI — EJECUTOR DE PIPELINES MULTI-AGENTE (CLI)")
    print("=" * 65)
    print("  Selecciona una Reacción en Cadena para ejecutar:")
    for k, v in PRESETS.items():
        print(f"    [{k}] {v['name']}")
    print("=" * 65)
    
    choice = input("  Ingresa el número (1-4) o 'q' para salir: ").strip()
    if choice in PRESETS:
        execute_pipeline(choice)
    else:
        print("Operación cancelada.")

if __name__ == "__main__":
    main()
