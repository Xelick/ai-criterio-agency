import os
import sys
import webbrowser
import socket
import json
import subprocess
import datetime
import re
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import live_engine

# Fix Windows console encoding for UTF-8
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'repo_config.json')

def load_repo_config():
    default_cfg = {
        "repo_path": BASE_DIR,
        "remote_url": "",
        "branch": "main",
        "auto_commit": True,
        "downstream_ai": "Cursor / Claude Code / Antigravity"
    }
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                default_cfg.update(data)
        except Exception as e:
            print(f"[!] Warning reading repo_config.json: {e}")
    return default_cfg

def save_repo_config(cfg):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[!] Error saving repo_config.json: {e}")
        return False

def run_git(args, cwd=None):
    if cwd is None:
        cfg = load_repo_config()
        cwd = cfg.get("repo_path", BASE_DIR)
    
    if not os.path.exists(cwd):
        return {"success": False, "error": f"Directory does not exist: {cwd}", "output": ""}
        
    try:
        res = subprocess.run(
            ["git"] + args,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        return {
            "success": res.returncode == 0,
            "returncode": res.returncode,
            "output": res.stdout.strip(),
            "error": res.stderr.strip()
        }
    except Exception as e:
        return {"success": False, "error": str(e), "output": ""}

def get_git_status_info(repo_path):
    if not os.path.exists(repo_path):
        return {"is_git_repo": False, "error": "Directorio no encontrado", "repo_path": repo_path}
    
    # Check if git repo
    check = run_git(["rev-parse", "--is-inside-work-tree"], cwd=repo_path)
    if not check["success"]:
        return {
            "is_git_repo": False,
            "repo_path": repo_path,
            "branch": "N/A",
            "dirty_files": [],
            "recent_commits": [],
            "deliverables": []
        }
    
    # Get current branch
    branch_res = run_git(["branch", "--show-current"], cwd=repo_path)
    branch = branch_res["output"] if branch_res["success"] and branch_res["output"] else "main"

    # Status porcelain
    status_res = run_git(["status", "--porcelain"], cwd=repo_path)
    dirty_files = [line.strip() for line in status_res["output"].splitlines() if line.strip()]

    # Recent commits
    log_res = run_git(["log", "-n", "6", "--pretty=format:%h|%s|%cr"], cwd=repo_path)
    recent_commits = []
    if log_res["success"] and log_res["output"]:
        for line in log_res["output"].splitlines():
            parts = line.split("|")
            if len(parts) >= 3:
                recent_commits.append({"hash": parts[0], "message": parts[1], "time": parts[2]})

    # Remote URL
    remote_res = run_git(["remote", "get-url", "origin"], cwd=repo_path)
    remote_url = remote_res["output"] if remote_res["success"] else ""

    # Deliverables in tasks/
    tasks_dir = os.path.join(repo_path, "tasks")
    deliverables = []
    if os.path.exists(tasks_dir):
        for f in os.listdir(tasks_dir):
            if f.endswith(".md"):
                fpath = os.path.join(tasks_dir, f)
                mtime = os.path.getmtime(fpath)
                deliverables.append({
                    "filename": f,
                    "path": f"tasks/{f}",
                    "modified": datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
                })
    deliverables.sort(key=lambda x: x["modified"], reverse=True)

    return {
        "is_git_repo": True,
        "repo_path": repo_path,
        "branch": branch,
        "remote_url": remote_url,
        "dirty_files": dirty_files,
        "recent_commits": recent_commits,
        "deliverables": deliverables,
        "total_deliverables": len(deliverables)
    }

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\-]+', '-', text)
    return text.strip('-')[:40]

def build_ai_executable_md(deliverable, mission_goal="Criterio AI Sprint"):
    """
    Builds a structured Markdown task document tailored for downstream
    AI Coding Agents (Cursor, Claude Code, Antigravity, Copilot CLI).
    Includes YAML Frontmatter, execution prompt, context, diff/code, and test instructions.
    """
    step = deliverable.get("step", 1)
    agent_id = deliverable.get("agentId", "agent")
    agent_name = deliverable.get("agentName", "Especialista Criterio AI")
    department = deliverable.get("department", "Operaciones")
    title = deliverable.get("title", f"Entregable Paso {step}")
    content = deliverable.get("content", "")
    target_files = deliverable.get("target_files", ["src/pages/briefing.html", "src/styles/criterio.css"])
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.datetime.now().isoformat()
    task_id = f"TASK-{date_str.replace('-', '')}-{step:02d}-{slugify(agent_id)}"

    frontmatter = f"""---
task_id: "{task_id}"
title: "{title.replace('"', "'")}"
agent_id: "{agent_id}"
agent_name: "{agent_name}"
department: "{department}"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "{timestamp}"
business: "Criterio AI (gocriterio.com)"
mission: "{mission_goal.replace('"', "'")}"
target_files:
{chr(10).join([f'  - "{tf}"' for tf in target_files])}
verification_command: "npm test || echo 'Validación completada'"
acceptance_criteria:
  - "El código o directriz resuelve el bloqueo específico sin alterar contratos previos"
  - "Estilo y tipografía respetan la directriz de fuente 400 y contraste accesible WCAG AA"
  - "Números de WhatsApp configurados con el canal verificado +57 318 941 1010"
---
"""

    md_body = f"""{frontmatter}
# 🤖 [{agent_name}] {title}

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** {department} | **Paso en Cadena:** {step}
> **Objetivo Global:** {mission_goal}

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "{agent_name}" para Criterio AI en este archivo ({task_id}.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes ({", ".join(target_files)}), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
{content}

---

## 🎯 Instrucciones de Ejecución Paso a Paso
1. **Inspección:** Revisa los archivos de destino listados en el encabezado.
2. **Implementación:** Aplica las correcciones o directrices técnicas sintetizadas arriba.
3. **Validación:** Verifica que no se rompan endpoints existentes y que la accesibilidad sea AA.
4. **Cierre:** Marca la tarea como completada en `AI_EXECUTION_QUEUE.md`.

---

## 🧪 Comando de Verificación
```bash
npm run test || echo "Verificación manual de enlaces y Netlify Forms requerida"
```

*Fin del Entregable de {agent_name} — Archivo de trabajo para agentes autónomos.*
"""
    return task_id, md_body

def update_execution_queue(repo_path, mission_goal="Criterio AI Sprint"):
    """
    Scans repo_path/tasks/ and regenerates AI_EXECUTION_QUEUE.md
    """
    tasks_dir = os.path.join(repo_path, "tasks")
    if not os.path.exists(tasks_dir):
        return
    
    files = [f for f in os.listdir(tasks_dir) if f.endswith(".md")]
    files.sort()

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    queue_md = f"""# 🤖 Criterio AI — Cola Maestra de Ejecución de Tareas para IAs
> **Fuente:** Cuartel General Pixel Art (296 Agentes Autónomos)
> **Última Actualización:** {now_str}
> **Misión Activa:** {mission_goal}

Este repositorio contiene las tareas y especificaciones generadas por el equipo de especialistas para ser ejecutadas por IAs de codificación (**Cursor**, **Claude Code**, **Antigravity**, **GitHub Copilot CLI**).

---

## 📋 Tareas en Cola para Ejecución

| Estado | ID Tarea | Especialista | Entregable / Objetivo | Archivo .MD |
| :---: | :--- | :--- | :--- | :--- |
"""

    for f in files:
        fpath = os.path.join(tasks_dir, f)
        title = f
        agent = "Agente"
        task_id = f.replace(".md", "")
        status = "PENDING"
        try:
            with open(fpath, "r", encoding="utf-8") as tf:
                content = tf.read()
                # Extract frontmatter
                m_title = re.search(r'title:\s*"([^"]+)"', content)
                m_agent = re.search(r'agent_name:\s*"([^"]+)"', content)
                m_id = re.search(r'task_id:\s*"([^"]+)"', content)
                m_status = re.search(r'status:\s*"([^"]+)"', content)
                if m_title: title = m_title.group(1)
                if m_agent: agent = m_agent.group(1)
                if m_id: task_id = m_id.group(1)
                if m_status: status = m_status.group(1)
        except Exception:
            pass
        
        status_icon = "🟡 PENDIENTE" if "READY" in status or "PENDING" in status else "🟢 COMPLETADA"
        queue_md += f"| {status_icon} | `{task_id}` | **{agent}** | {title} | [Ver Tarea](tasks/{f}) |\n"

    queue_md += """
---

## 🚀 Guía de Uso para IAs Ejecutoras

### 1. En Cursor (IDE)
1. Abre este repositorio en Cursor.
2. Abre cualquier archivo de `tasks/` que desees implementar.
3. Presiona `Ctrl+L` (o `Cmd+L`) en Cursor Composer / Chat.
4. Pega: *"Ejecuta e implementa todo lo indicado en este archivo tasks/TASK-...md de forma autónoma"*.

### 2. En Claude Code (CLI)
Ejecuta en tu terminal:
```bash
claude "Lee AI_EXECUTION_QUEUE.md, toma la siguiente tarea pendiente en tasks/ e impleméntala en el código fuente."
```

### 3. En Antigravity
Invoca el subagente de codificación y pásale la ruta del archivo `.md` como instrucción directa.

---
*Criterio AI Virtual Agency — 296 Agentes Especializados.*
"""

    queue_path = os.path.join(repo_path, "AI_EXECUTION_QUEUE.md")
    with open(queue_path, "w", encoding="utf-8") as qf:
        qf.write(queue_md)


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

class PixelAgencyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def guess_type(self, path):
        if path.endswith('.json'):
            return 'application/json; charset=utf-8'
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        if path.endswith('.md'):
            return 'text/markdown; charset=utf-8'
        return super().guess_type(path)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8'))

    def do_GET(self):
        url_path = self.path.split('?')[0]

        if url_path == '/api/git/config':
            cfg = load_repo_config()
            self.send_json_response(cfg)
            return

        elif url_path == '/api/git/status':
            cfg = load_repo_config()
            status = get_git_status_info(cfg.get("repo_path", BASE_DIR))
            self.send_json_response(status)
            return

        elif url_path == '/api/git/deliverables':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            tasks_dir = os.path.join(repo_path, "tasks")
            deliverables = []
            if os.path.exists(tasks_dir):
                for f in sorted(os.listdir(tasks_dir), reverse=True):
                    if f.endswith(".md"):
                        fpath = os.path.join(tasks_dir, f)
                        try:
                            with open(fpath, "r", encoding="utf-8") as r:
                                content = r.read()
                            mtime = os.path.getmtime(fpath)
                            deliverables.append({
                                "filename": f,
                                "path": f"tasks/{f}",
                                "content": content,
                                "modified": datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
                            })
                        except Exception as e:
                            pass
            self.send_json_response({"deliverables": deliverables, "total": len(deliverables)})
            return

        elif url_path == '/api/onaga/order':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            inbox_path = os.path.join(repo_path, "tasks", "INBOX_ANTIGRAVITY.md")
            log_path = os.path.join(repo_path, "tasks", "onaga_orders_log.json")
            
            latest_order = None
            if os.path.exists(log_path):
                try:
                    with open(log_path, "r", encoding="utf-8") as lf:
                        history = json.load(lf)
                        if history:
                            latest_order = history[-1]
                except Exception:
                    pass
            
            inbox_content = ""
            if os.path.exists(inbox_path):
                try:
                    with open(inbox_path, "r", encoding="utf-8") as ibf:
                        inbox_content = ibf.read()
                except Exception:
                    pass
            
            self.send_json_response({
                "has_active_order": bool(latest_order),
                "latest_order": latest_order,
                "inbox_content": inbox_content,
                "inbox_file": "tasks/INBOX_ANTIGRAVITY.md"
            })
            return

        elif url_path == '/api/agent/live_status':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            report_path = os.path.join(repo_path, "tasks", "LIVE_RESEARCH_REPORT.md")
            inbox_path = os.path.join(repo_path, "tasks", "INBOX_ANTIGRAVITY.md")
            
            report_content = ""
            if os.path.exists(report_path):
                try:
                    with open(report_path, "r", encoding="utf-8") as rf:
                        report_content = rf.read()
                except Exception:
                    pass

            inbox_content = ""
            if os.path.exists(inbox_path):
                try:
                    with open(inbox_path, "r", encoding="utf-8") as ibf:
                        inbox_content = ibf.read()
                except Exception:
                    pass

            self.send_json_response({
                "has_live_report": bool(report_content),
                "live_report": report_content,
                "has_active_inbox": bool(inbox_content),
                "inbox_content": inbox_content,
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            return

        super().do_GET()

    def do_POST(self):
        url_path = self.path.split('?')[0]
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            req_data = json.loads(body) if body else {}
        except Exception:
            req_data = {}

        if url_path == '/api/git/config':
            cfg = load_repo_config()
            if "repo_path" in req_data and req_data["repo_path"].strip():
                cfg["repo_path"] = os.path.abspath(req_data["repo_path"].strip())
            if "remote_url" in req_data:
                cfg["remote_url"] = req_data["remote_url"].strip()
            if "branch" in req_data:
                cfg["branch"] = req_data["branch"].strip()
            if "auto_commit" in req_data:
                cfg["auto_commit"] = bool(req_data["auto_commit"])
            if "downstream_ai" in req_data:
                cfg["downstream_ai"] = req_data["downstream_ai"].strip()

            save_repo_config(cfg)
            self.send_json_response({"success": True, "config": cfg})
            return

        elif url_path == '/api/git/init':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            os.makedirs(repo_path, exist_ok=True)
            res = run_git(["init"], cwd=repo_path)
            # Set default branch to main if fresh
            run_git(["checkout", "-b", "main"], cwd=repo_path)
            self.send_json_response(res)
            return

        elif url_path == '/api/git/deliverables':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            auto_commit = req_data.get("auto_commit", cfg.get("auto_commit", True))
            mission_goal = req_data.get("mission_goal", "Criterio AI Sprint")
            deliverables_in = req_data.get("deliverables", [])

            if not isinstance(deliverables_in, list):
                deliverables_in = [deliverables_in]

            tasks_dir = os.path.join(repo_path, "tasks")
            os.makedirs(tasks_dir, exist_ok=True)

            saved_files = []
            for item in deliverables_in:
                task_id, md_content = build_ai_executable_md(item, mission_goal)
                fname = f"{task_id}.md"
                fpath = os.path.join(tasks_dir, fname)
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(md_content)
                saved_files.append({"task_id": task_id, "filename": fname, "path": f"tasks/{fname}"})

            # Update queue
            update_execution_queue(repo_path, mission_goal)

            commit_info = None
            if auto_commit and saved_files:
                # git add tasks/ AI_EXECUTION_QUEUE.md
                run_git(["add", "tasks/", "AI_EXECUTION_QUEUE.md"], cwd=repo_path)
                first_agent = deliverables_in[0].get("agentName", "Agentes") if deliverables_in else "Agentes"
                commit_msg = f"feat(agents): {len(saved_files)} entregables generados para IAs por [{first_agent}]"
                c_res = run_git(["commit", "-m", commit_msg], cwd=repo_path)
                
                # Get commit hash
                h_res = run_git(["rev-parse", "--short", "HEAD"], cwd=repo_path)
                commit_hash = h_res["output"] if h_res["success"] else "unknown"
                commit_info = {
                    "committed": c_res["success"],
                    "hash": commit_hash,
                    "message": commit_msg,
                    "raw": c_res["output"]
                }

                # Push if remote is configured
                if cfg.get("remote_url"):
                    branch = cfg.get("branch", "main")
                    p_res = run_git(["push", "origin", branch], cwd=repo_path)
                    commit_info["push"] = p_res

            self.send_json_response({
                "success": True,
                "saved_count": len(saved_files),
                "saved_files": saved_files,
                "queue_file": "AI_EXECUTION_QUEUE.md",
                "commit": commit_info
            })
            return

        elif url_path == '/api/git/commit':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            message = req_data.get("message", "feat: actualización de entregables de agentes Criterio AI")
            
            run_git(["add", "."], cwd=repo_path)
            c_res = run_git(["commit", "-m", message], cwd=repo_path)
            h_res = run_git(["rev-parse", "--short", "HEAD"], cwd=repo_path)
            
            push_res = None
            if req_data.get("push", False) and cfg.get("remote_url"):
                branch = cfg.get("branch", "main")
                push_res = run_git(["push", "origin", branch], cwd=repo_path)

            self.send_json_response({
                "success": c_res["success"],
                "hash": h_res["output"] if h_res["success"] else "",
                "output": c_res["output"],
                "push": push_res
            })
            return

        elif url_path == '/api/git/push':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            branch = req_data.get("branch", cfg.get("branch", "main"))
            remote = req_data.get("remote", "origin")
            
            p_res = run_git(["push", remote, branch], cwd=repo_path)
            self.send_json_response(p_res)
            return

        elif url_path == '/api/onaga/order':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            tasks_dir = os.path.join(repo_path, "tasks")
            os.makedirs(tasks_dir, exist_ok=True)
            
            order_text = req_data.get("order", "").strip() or "Cumplir Sprint de 14 días y desbloquear gocriterio.com"
            target_ai = req_data.get("target_ai", "antigravity")
            oracle_response = req_data.get("oracle_response", "")
            timestamp_iso = datetime.datetime.now().isoformat()
            date_human = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            task_id = f"TASK-ONAGA-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}"

            # 1. Write tasks/INBOX_ANTIGRAVITY.md
            inbox_path = os.path.join(tasks_dir, "INBOX_ANTIGRAVITY.md")
            inbox_md = f"""# 👑 BUZÓN DE ÓRDENES SUPREMAS DE ONAGA PARA ANTIGRAVITY
> **Emisor:** Gran Patriarca Onaga (Líder del Culto de la Productividad)
> **Receptor:** Antigravity (AI Senior Pair Programmer & Orchestrator)
> **Fecha y Hora:** {date_human}
> **Estado:** 🟡 PENDIENTE DE EJECUCIÓN INMEDIATA POR ANTIGRAVITY
> **Prioridad:** 🔥 VITAL / DEFCON 1

---

## 📜 Orden Suprema Emitida:
> ### "{order_text}"

---

## 🎯 Directrices para Antigravity:
1. Lee detenidamente esta orden emitida desde el Altar de Onaga.
2. Identifica los archivos de código o recursos que deben modificarse en el repositorio de Criterio AI.
3. Ejecuta los cambios necesarios, asegurando calidad de código, accesibilidad WCAG AA, y contratos comerciales para Bogotá.
4. Informa al usuario en el chat de Antigravity una vez implementada la directriz.

---

## 🔮 Contexto / Revelación del Oráculo:
{oracle_response if oracle_response else "Orden directa sin canalización intermedia. Proceder con el rigor y máxima devoción de Onaga."}

---
*Fin de la Orden Suprema — Generada en tiempo real desde la Oficina Virtual de Criterio AI.*
"""
            with open(inbox_path, "w", encoding="utf-8") as ibf:
                ibf.write(inbox_md)

            # 2. Write tasks/TASK_ONAGA_ACTIVE_ORDER.md
            active_task_path = os.path.join(tasks_dir, "TASK_ONAGA_ACTIVE_ORDER.md")
            active_md = f"""---
task_id: "{task_id}"
title: "Orden Suprema de Onaga: {order_text.replace('"', "'")}"
agent_id: "master-onaga"
agent_name: "Gran Patriarca Onaga"
department: "Dirección Suprema"
role_for_downstream_ai: "Antigravity Senior Agent"
status: "READY_FOR_EXECUTION"
priority: "DEFCON_1_VITAL"
created_at: "{timestamp_iso}"
business: "Criterio AI (gocriterio.com)"
---
# 👑 [Gran Patriarca Onaga] {order_text}

## ⚡ Prompt para Antigravity:
```text
Antigravity: El Gran Patriarca Onaga te ha transmitido la siguiente orden directa desde el Altar de la Productividad:
"{order_text}"
Por favor, analiza la base de código, ejecuta las acciones pertinentes y reporta el progreso de inmediato.
```

## 📋 Detalle de la Orden:
{order_text}

{oracle_response}
"""
            with open(active_task_path, "w", encoding="utf-8") as atf:
                atf.write(active_md)

            # 3. Append to onaga_orders_log.json
            log_path = os.path.join(tasks_dir, "onaga_orders_log.json")
            order_record = {
                "task_id": task_id,
                "order": order_text,
                "target_ai": target_ai,
                "created_at": timestamp_iso,
                "status": "DISPATCHED_TO_ANTIGRAVITY"
            }
            history = []
            if os.path.exists(log_path):
                try:
                    with open(log_path, "r", encoding="utf-8") as rlf:
                        history = json.load(rlf)
                except Exception:
                    history = []
            history.append(order_record)
            with open(log_path, "w", encoding="utf-8") as wlf:
                json.dump(history, wlf, indent=2, ensure_ascii=False)

            # 4. Update execution queue
            update_execution_queue(repo_path, mission_goal=order_text)

            # 5. Git auto-commit if enabled
            commit_res = None
            if cfg.get("auto_commit", True):
                run_git(["add", "tasks/INBOX_ANTIGRAVITY.md", "tasks/TASK_ONAGA_ACTIVE_ORDER.md", "tasks/onaga_orders_log.json", "AI_EXECUTION_QUEUE.md"], cwd=repo_path)
                c_res = run_git(["commit", "-m", f"feat(onaga): orden de Onaga transmitida a Antigravity: {order_text[:50]}"], cwd=repo_path)
                commit_res = c_res

            self.send_json_response({
                "success": True,
                "task_id": task_id,
                "order": order_text,
                "target_ai": target_ai,
                "inbox_file": "tasks/INBOX_ANTIGRAVITY.md",
                "active_task_file": "tasks/TASK_ONAGA_ACTIVE_ORDER.md",
                "prompt_for_antigravity": f"Antigravity, ejecuta la orden de Onaga: \"{order_text}\"",
                "commit": commit_res
            })
            return

        elif url_path == '/api/git/save_file':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            filename = req_data.get("filename", "output.md")
            content = req_data.get("content", "")
            
            filename = os.path.basename(filename)
            tasks_dir = os.path.join(repo_path, "tasks")
            os.makedirs(tasks_dir, exist_ok=True)
            target_file = os.path.join(tasks_dir, filename)
            
            with open(target_file, "w", encoding="utf-8") as f:
                f.write(content)
                
            update_execution_queue(repo_path)
            
            if cfg.get("auto_commit", True):
                run_git(["add", f"tasks/{filename}", "AI_EXECUTION_QUEUE.md"], cwd=repo_path)
                run_git(["commit", "-m", f"feat(tasks): archivo {filename} guardado"], cwd=repo_path)
                
            self.send_json_response({
                "success": True,
                "filename": filename,
                "path": f"tasks/{filename}"
            })
            return

        elif url_path == '/api/agent/run_live':
            cfg = load_repo_config()
            repo_path = cfg.get("repo_path", BASE_DIR)
            action = req_data.get("action", "audit_site")
            agent_id = req_data.get("agent_id", "agent-radar-live")
            agent_name = req_data.get("agent_name", "Especialista Radar en Vivo")
            
            result_payload = {}
            md_to_save = ""
            report_title = "Reporte de Inteligencia en Vivo"
            
            if action == 'audit_site':
                target_url = req_data.get("url", "https://gocriterio.com")
                audit_res = live_engine.audit_target_site(target_url)
                result_payload = audit_res
                md_to_save = audit_res.get("markdown_report", "")
                report_title = f"Auditoría Técnica en Vivo — {target_url}"
                
            elif action == 'market_search':
                query = req_data.get("query", "restaurantes bogota domicilios whatsapp")
                search_res = live_engine.live_market_search(query)
                result_payload = search_res
                md_to_save = search_res.get("markdown_report", "")
                report_title = f"Inteligencia de Mercado en Vivo — {query}"
                
            elif action == 'dispatch_antigravity':
                task_content = req_data.get("content", "").strip() or "Ejecutar auditoría e implementar mejoras en gocriterio.com"
                order_res = req_data.get("order", task_content)
                now_human = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                task_id = f"TASK-ANTIGRAVITY-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}"
                
                inbox_md = f"""# 🚀 TAREA EN VIVO DESPACHADA A ANTIGRAVITY
> **Emisor:** {agent_name} ({agent_id})
> **Receptor:** Antigravity (AI Senior Pair Programmer)
> **Fecha:** {now_human}
> **Estado:** 🟡 PENDIENTE DE RESOLUCIÓN POR ANTIGRAVITY

---

## 🎯 Instrucción / Misión:
> ### "{order_res}"

---

## 📋 Contexto y Hallazgos Previos:
{task_content}

---
*Transmitido en tiempo real desde la Oficina Virtual de Criterio AI.*
"""
                tasks_dir = os.path.join(repo_path, "tasks")
                os.makedirs(tasks_dir, exist_ok=True)
                with open(os.path.join(tasks_dir, "INBOX_ANTIGRAVITY.md"), "w", encoding="utf-8") as ibf:
                    ibf.write(inbox_md)
                
                result_payload = {
                    "success": True,
                    "task_id": task_id,
                    "dispatched": True,
                    "inbox_file": "tasks/INBOX_ANTIGRAVITY.md",
                    "instruction": order_res
                }
                md_to_save = inbox_md
                report_title = f"Despacho Antigravity — {order_res[:40]}"
            
            # Save deliverable if we have markdown
            files_saved = None
            if md_to_save:
                files_saved = live_engine.save_live_report_to_tasks(
                    repo_path=repo_path,
                    report_title=report_title,
                    md_content=md_to_save,
                    agent_name=agent_name
                )
                update_execution_queue(repo_path)
                
                if cfg.get("auto_commit", True):
                    run_git(["add", "tasks/", "AI_EXECUTION_QUEUE.md"], cwd=repo_path)
                    run_git(["commit", "-m", f"feat(live-radar): {report_title[:50]}"], cwd=repo_path)

            self.send_json_response({
                "success": True,
                "action": action,
                "data": result_payload,
                "saved_files": files_saved,
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            return

        self.send_response(404)
        self.end_headers()

def find_free_port(start_port=8080):
    for port in range(start_port, start_port + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    return start_port

def run_server():
    os.chdir(BASE_DIR)
    port = 8080
    server_address = ('127.0.0.1', port)
    
    try:
        httpd = ThreadingHTTPServer(server_address, PixelAgencyHandler)
    except OSError:
        port = find_free_port(8081)
        server_address = ('127.0.0.1', port)
        httpd = ThreadingHTTPServer(server_address, PixelAgencyHandler)

    url = f"http://localhost:{port}"

    print("=" * 65)
    print("   [+] AI_CRITERIO - VIRTUAL PIXEL ART AGENCY HEADQUARTERS")
    print("=" * 65)
    print(f"  -> Servidor local activo en: {url}")
    print(f"  -> Conector Git & Entregables para IAs: /api/git/*")
    print(f"  -> Total de agentes cargados: 296 especialistas")
    print("=" * 65)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Servidor detenido con éxito.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
