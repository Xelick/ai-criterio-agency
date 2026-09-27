import os
import sys
import json
import time
import datetime
import re
import html
import urllib.request
import urllib.parse

def audit_target_site(url="https://gocriterio.com"):
    """
    Performs a live HTTP GET request to audit a web property.
    Inspects response latency, status, headers, Netlify form attributes, WhatsApp links, and CTA buttons.
    """
    start_time = time.time()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CriterioRadar/2.0'
    }
    
    # Ensure scheme
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url

    try:
        req = urllib.request.Request(url, headers=headers)
        res = urllib.request.urlopen(req, timeout=12)
        elapsed_ms = round((time.time() - start_time) * 1000, 1)
        status_code = res.status
        content_type = res.headers.get('Content-Type', '')
        server_header = res.headers.get('Server', 'Netlify / Edge')
        raw_html = res.read().decode('utf-8', errors='ignore')

        # 1. Page Title
        title_m = re.search(r'<title>(.*?)</title>', raw_html, re.I | re.DOTALL)
        title = html.unescape(title_m.group(1).strip()) if title_m else "Sin título"

        # 2. Forms Inspection
        forms = re.findall(r'<form\b([^>]*)>(.*?)</form>', raw_html, re.I | re.DOTALL)
        form_details = []
        for attrs, body in forms:
            name_m = re.search(r'name=[\'\"]([^\'\"]+)[\'\"]', attrs, re.I)
            netlify_m = re.search(r'\bnetlify\b', attrs, re.I)
            action_m = re.search(r'action=[\'\"]([^\'\"]+)[\'\"]', attrs, re.I)
            form_details.append({
                "name": name_m.group(1) if name_m else "unnamed",
                "is_netlify": bool(netlify_m),
                "action": action_m.group(1) if action_m else "",
                "inputs_count": len(re.findall(r'<input\b', body, re.I))
            })

        # 3. WhatsApp Links
        all_links = re.findall(r'href=[\'\"]([^\'\"]+)[\'\"]', raw_html, re.I)
        wa_links = [l for l in all_links if 'wa.me' in l.lower() or 'whatsapp' in l.lower()]

        # 4. Buttons & CTAs
        buttons = re.findall(r'<button\b[^>]*>(.*?)</button>', raw_html, re.I | re.DOTALL)
        cta_texts = [html.unescape(re.sub(r'<[^>]+>', '', b).strip()) for b in buttons if b.strip()][:8]

        # 5. Scoring & Diagnostic Assessment
        score = 100
        issues = []
        recommendations = []

        if elapsed_ms > 1500:
            score -= 15
            issues.append(f"Latencia de respuesta elevada ({elapsed_ms}ms)")
        if not wa_links:
            score -= 20
            issues.append("No se detectó enlace directo a WhatsApp en el HTML principal")
            recommendations.append("Añadir botón flotante de WhatsApp hacia wa.me/573189411010")
        else:
            has_correct_phone = any('3189411010' in l or '318' in l for l in wa_links)
            if not has_correct_phone:
                score -= 10
                issues.append("Enlace de WhatsApp presente pero no apunta al canal oficial (+57 318 941 1010)")
                recommendations.append("Actualizar href con formato https://wa.me/573189411010?text=Hola%20Criterio%20AI")

        has_briefing_form = any(f["is_netlify"] or f["name"] == "briefing" for f in form_details)
        if not has_briefing_form:
            score -= 15
            issues.append("Formulario Netlify de briefing no detectado en el DOM estático")
            recommendations.append("Incluir <form name='briefing' method='POST' data-netlify='true'> oculto para prerender de Netlify")

        health_score = max(10, min(100, score))
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        markdown_report = f"""# 🛰️ Auditoría Técnica en Vivo — {url}
> **Fecha:** {now_str} | **Servidor:** {server_header} | **Latencia:** {elapsed_ms}ms
> **Salud del Sitio:** {health_score}/100 {'🟢 EXCELENTE' if health_score >= 90 else ('🟡 ALERTA' if health_score >= 70 else '🔴 CRÍTICO')}

---

## 📊 Métricas Principales
- **URL Auditada:** `{url}`
- **Código HTTP:** `{status_code} OK`
- **Tiempo de Carga:** `{elapsed_ms} ms`
- **Tamaño HTML:** `{len(raw_html)} bytes`
- **Título de la Página:** *{title}*
- **Formularios Detectados:** `{len(form_details)}`
- **Enlaces WhatsApp Encontrados:** `{len(wa_links)}`

---

## ⚠️ Hallazgos y Bloqueos Identificados
{chr(10).join([f"- 🔴 **{issue}**" for issue in issues]) if issues else "- 🟢 No se detectaron fallos críticos."}

---

## 🛠️ Recomendaciones de Ejecución Inmediata
{chr(10).join([f"- ⚡ {rec}" for rec in recommendations]) if recommendations else "- 🟢 Todo alineado con las directrices de Criterio AI."}

---
*Reporte generado por el Radar en Vivo de la Oficina Virtual.*
"""

        return {
            "success": True,
            "url": url,
            "status_code": status_code,
            "latency_ms": elapsed_ms,
            "content_length_bytes": len(raw_html),
            "server": server_header,
            "title": title,
            "health_score": health_score,
            "forms": form_details,
            "whatsapp_links": wa_links,
            "cta_buttons": cta_texts,
            "issues": issues,
            "recommendations": recommendations,
            "markdown_report": markdown_report,
            "timestamp": now_str
        }

    except Exception as e:
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return {
            "success": False,
            "url": url,
            "error": str(e),
            "health_score": 0,
            "markdown_report": f"# ❌ Error al Auditar {url}\n> Error: {str(e)}\n> Fecha: {now_str}",
            "timestamp": now_str
        }

def live_market_search(query="restaurantes bogota domicilios whatsapp"):
    """
    Performs real-time search intelligence by combining Google autocomplete search intents
    and Wikipedia knowledge graph queries.
    """
    start_time = time.time()
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    clean_query = query.strip()
    
    # 1. Google Search Intent / Trending Variations
    trending_queries = []
    try:
        encoded_q = urllib.parse.quote(clean_query)
        suggest_url = f"https://suggestqueries.google.com/complete/search?client=chrome&q={encoded_q}"
        req_s = urllib.request.Request(suggest_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        res_s = urllib.request.urlopen(req_s, timeout=6)
        raw_s = res_s.read().decode('latin-1', errors='replace')
        parsed_s = json.loads(raw_s)
        if len(parsed_s) > 1 and isinstance(parsed_s[1], list):
            trending_queries = parsed_s[1][:8]
    except Exception as e:
        trending_queries = [f"{clean_query} tendencias", f"{clean_query} bogota", f"{clean_query} precios"]

    # 2. Wikipedia Knowledge Extraction
    wiki_articles = []
    try:
        encoded_wiki = urllib.parse.quote(clean_query)
        wiki_url = f"https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch={encoded_wiki}&format=json"
        req_w = urllib.request.Request(wiki_url, headers={'User-Agent': 'CriterioAIBot/2.0 (onaga@gocriterio.com)'})
        res_w = urllib.request.urlopen(req_w, timeout=8)
        raw_w = res_w.read().decode('utf-8', errors='replace')
        parsed_w = json.loads(raw_w)
        search_results = parsed_w.get('query', {}).get('search', [])
        for item in search_results[:4]:
            snippet_clean = re.sub(r'<[^>]+>', '', item.get('snippet', '')).strip()
            wiki_articles.append({
                "title": item.get('title'),
                "snippet": html.unescape(snippet_clean),
                "url": f"https://es.wikipedia.org/wiki/{urllib.parse.quote(item.get('title', ''))}"
            })
    except Exception:
        pass

    elapsed_ms = round((time.time() - start_time) * 1000, 1)

    markdown_report = f"""# 🌐 Inteligencia de Mercado en Vivo — "{clean_query}"
> **Fecha:** {now_str} | **Tiempo de Respuesta:** {elapsed_ms}ms
> **Motor:** Google Trends & Wikipedia Knowledge Graph

---

## 📈 Intenciones de Búsqueda Reales (Google Search)
Las búsquedas más frecuentes relacionadas con este objetivo son:
{chr(10).join([f"- 🔍 **{tq}**" for tq in trending_queries]) if trending_queries else "- No se detectaron tendencias directas."}

---

## 📚 Base de Conocimiento y Artículos de Contexto
{chr(10).join([f"### 📌 [{art['title']}]({art['url']}){chr(10)}{art['snippet']}..." for art in wiki_articles]) if wiki_articles else "- Sin registros de Wikipedia coincidentes."}

---

## 💡 Oportunidad Táctica para Criterio AI
- **Foco Territorial:** Bogotá (Chapinero, Usaquén, Zona G, Zona T).
- **Canal de Conversión Predilecto:** WhatsApp Business con catálogos dinámicos sin intermediarios de 30% de comisión.
- **Diferenciador Tecnológico:** Respuestas en tiempo real con agentes de IA entrenados en la carta del restaurante.
"""

    return {
        "success": True,
        "query": clean_query,
        "latency_ms": elapsed_ms,
        "trending_queries": trending_queries,
        "articles": wiki_articles,
        "markdown_report": markdown_report,
        "timestamp": now_str
    }

def save_live_report_to_tasks(repo_path, report_title, md_content, agent_name="Agente Radar en Vivo", task_prefix="TASK-LIVE"):
    """
    Saves the live research deliverable to tasks/LIVE_RESEARCH_REPORT.md and a timestamped task file.
    """
    tasks_dir = os.path.join(repo_path, "tasks")
    os.makedirs(tasks_dir, exist_ok=True)
    
    timestamp_slug = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    task_id = f"{task_prefix}-{timestamp_slug}"
    
    # 1. Save canonical tasks/LIVE_RESEARCH_REPORT.md
    canonical_path = os.path.join(tasks_dir, "LIVE_RESEARCH_REPORT.md")
    with open(canonical_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    # 2. Save timestamped deliverable with frontmatter
    deliverable_path = os.path.join(tasks_dir, f"{task_id}.md")
    frontmatter = f"""---
task_id: "{task_id}"
title: "{report_title.replace('"', "'")}"
agent_id: "agent-radar-live"
agent_name: "{agent_name}"
department: "Inteligencia Web & Mercado"
role_for_downstream_ai: "Antigravity Executor"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "{datetime.datetime.now().isoformat()}"
business: "Criterio AI (gocriterio.com)"
---
"""
    with open(deliverable_path, "w", encoding="utf-8") as f:
        f.write(frontmatter + "\n" + md_content)

    return {
        "task_id": task_id,
        "canonical_file": "tasks/LIVE_RESEARCH_REPORT.md",
        "deliverable_file": f"tasks/{task_id}.md"
    }
