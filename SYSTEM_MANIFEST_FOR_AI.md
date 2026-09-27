# 🤖 CRITERIO AI — SYSTEM MANIFEST & TECHNICAL SPECIFICATION FOR DOWNSTREAM AIs
> **Document Purpose:** Complete architectural context, folder tree, API contracts, agent directory, and execution instructions for AI Coding Agents (**Cursor**, **Claude Code**, **Antigravity**, **GitHub Copilot CLI**, or **ChatGPT**).
> **Generated:** 2026-09-27 | **Version:** 2.4.0-PROD
> **Business Core:** Criterio AI ([gocriterio.com](https://gocriterio.com)) — Bogotá, Colombia

---

## 📍 1. UBICACIÓN FÍSICA Y ACCESOS DEL SISTEMA

### 📂 Rutas en el Sistema de Archivos Local
- **Ruta Raíz del Repositorio:**
  `C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency`
- **Servidor Local Activo (Web UI & REST API):**
  `http://localhost:8080/`
- **Carpeta de Tareas y Entregables para IAs:**
  `C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\tasks\`
- **Cola Maestra de Ejecución:**
  `C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\AI_EXECUTION_QUEUE.md`
- **Buzón de Órdenes Supremas de Onaga / Antigravity:**
  `C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\tasks\INBOX_ANTIGRAVITY.md`
- **Último Informe de Investigación Web en Vivo:**
  `C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\tasks\LIVE_RESEARCH_REPORT.md`

### 💻 Comando para Iniciar el Servidor (si está detenido)
```powershell
cd C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency
python -u server.py
```

---

## 🏛️ 2. PROPÓSITO DEL NEGOCIO Y MISIÓN (CRITERIO AI)

Criterio AI es una agencia tecnológica y de consultoría enfocada en transformar restaurantes y comercios gastronómicos en Bogotá mediante:
1. **Catálogos Interactivos & Cartas Vivas:** Menús digitales interactivos sincronizados con WhatsApp Business.
2. **Eliminación de Comisiones Abusivas:** Sustitución de intermediarios (que cobran hasta 30% por pedido) por canales directos de WhatsApp y automatización con IA.
3. **Misión Activa (Sprint de 14 Días):** Desbloquear la plataforma web `https://gocriterio.com`, activar el formulario de briefing de Netlify, habilitar el botón flotante de WhatsApp verificado (`+57 318 941 1010`) y prospectar 119 restaurantes en Bogotá (Chapinero, Usaquén, Zona G, Zona T).

---

## 🌳 3. ÁRBOL DE ARCHIVOS Y COMPONENTES

```text
ai-criterio-agency/
├── index.html                   # Interfaz Web Pixel Art (HUD, Altar de Onaga, Modales, Canvas)
├── server.py                    # Servidor HTTP multihilo Python + API REST de Git, Onaga y Radar
├── live_engine.py               # Motor de auditoría en tiempo real de gocriterio.com y búsqueda web
├── repo_config.json             # Configuración de Git, rama main, auto-commit y destino de IAs
├── AI_EXECUTION_QUEUE.md        # Tabla maestra de tareas pendientes y completadas para IAs
├── SYSTEM_MANIFEST_FOR_AI.md    # Este manifiesto técnico para IAs externas
├── data/
│   ├── agents_data.json         # Base de datos compacta de los 296 agentes (piso, depto, color, rol)
│   ├── agents_full_data.json    # Base de datos expandida con prompt system, herramientas y skills
│   └── taskforce_data.json      # Los 38 agentes prioritarios del Sprint de 14 días
├── js/
│   ├── pixel_engine.js          # Motor gráfico Canvas 2D (60 FPS, batch rendering, casino jackpot)
│   ├── live_radar.js            # Frontend del Radar en Vivo (Auditoría HTTP + Google Trends + Antigravity)
│   ├── bottleneck_detector.js   # Analizador heurístico de cuellos de botella DEFCON 1 y dependencias
│   ├── daily_reporter.js        # Generador de informes ejecutivos diarios para la gerencia
│   ├── chain_reaction.js        # Constructor de cadenas reactivas multi-agente e historial de re-ejecución
│   ├── disciplines_panel.js     # Acordeón de disciplinas, 15 departamentos y combos tácticos
│   ├── git_connector.js         # Puente WebSocket/REST para guardar entregables y commitear
│   ├── agents_manager.js        # Búsqueda, filtrado y renderizado de tarjetas de agentes
│   ├── consultation_engine.js   # Chat con agentes individuales (soporte offline o Gemini API)
│   ├── war_room.js              # Sala de crisis para reuniones de múltiples agentes
│   ├── audio.js                 # Sintetizador Web Audio API retro (8-bit SFX + casino progresivo)
│   └── app.js                   # Inicializador principal de la aplicación
├── css/
│   └── style.css                # Estilos retro pixel-art, paleta de colores, CRT scanlines y HUD
└── tasks/                       # Directorio de entregables autogenerados en formato Markdown (.md)
    ├── INBOX_ANTIGRAVITY.md     # Buzón activo de órdenes enviadas a Antigravity
    ├── TASK_ONAGA_ACTIVE_ORDER.md # Especificación formal de la orden de Onaga
    ├── LIVE_RESEARCH_REPORT.md  # Reporte de la última auditoría web o búsqueda en Google/Wikipedia
    ├── onaga_orders_log.json    # Historial JSON de órdenes emitidas por Onaga
    └── TASK-*.md                # +60 especificaciones ejecutables con YAML frontmatter
```

---

## ⚡ 4. ESPECIFICACIÓN DE ENDPOINTS REST (`server.py`)

Cualquier IA o cliente HTTP puede interactuar con el servidor en `http://localhost:8080`:

| Método | Endpoint | Descripción | Parámetros Clave |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/git/config` | Obtiene la configuración del repositorio Git | Ninguno |
| `POST` | `/api/git/config` | Actualiza la ruta del repo o configuración de commit | `{ "repo_path": "...", "auto_commit": true }` |
| `GET` | `/api/git/status` | Devuelve rama actual, archivos modificados y commits | Ninguno |
| `GET` | `/api/git/deliverables`| Lista todos los archivos `.md` en `tasks/` | Ninguno |
| `POST` | `/api/git/deliverables`| Guarda entregables, actualiza cola y hace auto-commit | `{ "deliverables": [...], "mission_goal": "..." }` |
| `POST` | `/api/git/commit` | Realiza un `git commit` manual con mensaje | `{ "message": "...", "push": false }` |
| `GET` | `/api/onaga/order` | Consulta la orden activa y el contenido de `INBOX_ANTIGRAVITY.md` | Ninguno |
| `POST` | `/api/onaga/order` | Transmite una Orden Suprema de Onaga y la escribe en disco | `{ "order": "...", "oracle_response": "..." }` |
| `GET` | `/api/agent/live_status` | Estado del radar, último reporte web y buzón de órdenes | Ninguno |
| `POST` | `/api/agent/run_live` | Ejecuta auditoría web, búsqueda en Google o despacho | `{ "action": "audit_site" \| "market_search" \| "dispatch_antigravity", ... }` |
| `POST` | `/api/git/save_file` | Guarda cualquier archivo de texto en `tasks/` | `{ "filename": "...", "content": "..." }` |

---

## 🧠 5. DIRECTORIO DE LOS 296 AGENTES Y 15 DEPARTAMENTOS

El sistema cuenta con **296 especialistas autónomos** organizados en 5 pisos:

1. **Piso 1 — Operaciones, CX & Soporte (58 NPCs):** Atención al cliente gastronómico, gestión de pedidos WhatsApp, logística.
2. **Piso 2 — Ventas, Legal & Finanzas (86 NPCs):** Cierre comercial en frío, modelos de suscripción ($200k-$400k COP/mes), contratos comerciales para Colombia, compliance.
3. **Piso 3 — Diseño, UX & Laboratorio (49 NPCs):** Diseñadores UI/UX, maquetadores CSS WCAG AA, tokens tipográficos (fuente 400), diseñadores de menús QR.
4. **Piso 4 — Data, GIS & Geoespaciales (23 NPCs):** Mapeo de restaurantes en Bogotá, zonas gastronómicas (Chapinero, Usaquén, Parque 93), análisis geoespacial.
5. **Piso 5 — Dirección Suprema & Penthouse (80 NPCs):** 
   - **Gran Patriarca Onaga:** Líder supremo del Culto a la Productividad, emisor de decretos DEFCON 1.
   - **CEO, Oráculo, Arquitectos de Software, Auditores QA, Growth Hackers.**

### 💥 El Escuadrón Activo (38 NPCs Clave del Sprint de 14 Días)
Agrupados en 7 frentes tácticos inmediatos:
- **Técnico (Dev Core):** Desbloqueo Netlify Forms, redirecciones, API WhatsApp.
- **Diseño & UI:** Contraste accesible, layouts móviles para pedidos en celulares.
- **QA & Testing:** Pruebas E2E de captura de leads.
- **Ventas & Cierre:** Scripts de prospección directa para dueños de restaurantes.
- **Marketing & Growth:** Campañas de adquisición local en Bogotá.
- **Estrategia & Legal:** Modelos de contrato de prestación de servicios sin exclusividad.
- **Producto:** Definición del MVP Carta Viva.

---

## 📋 6. PROTOCOLO DE EJECUCIÓN PARA UNA IA EXTERNA

Si eres **Cursor**, **Claude Code**, **Antigravity** u otra IA ejecutora, sigue este protocolo:

### Paso 1: Leer el Buzón y la Cola de Tareas
Abre y lee:
- `tasks/INBOX_ANTIGRAVITY.md` (prioridad inmediata si hay orden activa).
- `AI_EXECUTION_QUEUE.md` (cola general de tareas pendientes).
- `tasks/LIVE_RESEARCH_REPORT.md` (último diagnóstico de salud web y búsqueda de mercado).

### Paso 2: Estructura Estándar de una Tarea (`tasks/TASK-*.md`)
Cada tarea contiene YAML Frontmatter estructurado para consumo automático por IAs:
```yaml
---
task_id: "TASK-20260925-01-engineering-fullstack-dev"
title: "Corrección Formulario Netlify Briefing y Canal WhatsApp"
agent_name: "Lead Fullstack Dev"
department: "Ingeniería"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
target_files:
  - "src/pages/briefing.html"
  - "src/styles/criterio.css"
verification_command: "npm test || echo 'Validación OK'"
acceptance_criteria:
  - "Netlify form contiene <form name='briefing' method='POST' data-netlify='true'>"
  - "Canal de WhatsApp apunta a https://wa.me/573189411010"
  - "Cumple accesibilidad WCAG AA con tipografía base 400"
---
```

### Paso 3: Reglas de Implementación Obligatorias
1. **Número Oficial de WhatsApp:** Utilizar estrictamente `+57 318 941 1010` (enlaces tipo `https://wa.me/573189411010?text=...`).
2. **Accesibilidad y Tipografía:** Fuente regular `400`, contraste accesible WCAG AA sobre fondos oscuros (`#0b1120`, `#0f172a`), sin textos que se pierdan en fondos negros.
3. **Formularios Netlify:** Incluir etiqueta `<input type="hidden" name="form-name" value="briefing" />` y `<form name="briefing" method="POST" data-netlify="true">`.
4. **Preservación:** No eliminar comentarios ni funciones existentes no relacionadas con la corrección.

### Paso 4: Marcado de Cierre
Tras implementar los cambios, actualiza el estado en el frontmatter de la tarea de `status: "READY_FOR_EXECUTION"` a `status: "COMPLETED"`, y ejecuta un commit en git.

---

## 🎯 7. RESUMEN EN UNA LÍNEA PARA PROMPT DIRECTO
> *"Actúa como Desarrollador Senior para Criterio AI. Lee C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\tasks\INBOX_ANTIGRAVITY.md y AI_EXECUTION_QUEUE.md, analiza los archivos objetivo listados en los entregables e implementa las soluciones respetando las directrices de Criterio AI."*
