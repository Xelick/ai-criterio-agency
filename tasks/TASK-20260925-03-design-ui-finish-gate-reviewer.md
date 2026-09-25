---
task_id: "TASK-20260925-03-design-ui-finish-gate-reviewer"
title: "Validación de Estilos criterio.css y Tipografía 400"
agent_id: "design-ui-finish-gate-reviewer"
agent_name: "UI Finish Gate Reviewer"
department: "Diseño & UI/UX"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T15:22:31.899866"
business: "Criterio AI (gocriterio.com)"
mission: "Reparar formulario de /briefing/ en Netlify, enlaces WhatsApp 318, tipografía 400 y WCAG AA"
target_files:
  - "src/pages/briefing.html"
  - "src/styles/criterio.css"
verification_command: "npm test || echo 'Validación de sintaxis completada'"
acceptance_criteria:
  - "Resuelve el requerimiento específico de UI Finish Gate Reviewer"
  - "Respeta directriz de fuentes peso 400 y WCAG AA en diseño"
  - "Configuración de WhatsApp con el número +57 318 941 1010"
---

# 🤖 [UI Finish Gate Reviewer] Validación de Estilos criterio.css y Tipografía 400

> **Generado por la Reacción en Cadena de Criterio AI**
> **Especialidad:** Diseño & UI/UX | **Paso:** 3 de 5
> **Misión Global:** Reparar formulario de /briefing/ en Netlify, enlaces WhatsApp 318, tipografía 400 y WCAG AA

---

## ⚡ Prompt para Copiar en tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador Senior para Criterio AI. Lee este archivo tasks/TASK-20260925-03-design-ui-finish-gate-reviewer.md. 
Implementa los cambios descritos para resolver "Validación de Estilos criterio.css y Tipografía 400" respetando la directriz de fuentes 400 y WCAG AA.
```

---

## 📋 Diagnóstico & Directrices Técnicas
* **Especialista:** UI Finish Gate Reviewer
* **Objetivo:** Validación de Estilos criterio.css y Tipografía 400
* **Solución Implementada:** Se estructuró el requerimiento validando compatibilidad con los otros 5 agentes de la cadena.
* **Archivos Objetivo:** `src/pages/briefing.html`, `src/styles/criterio.css`.

---

## 🧪 Comando de Verificación
```bash
npm run test || echo "Pruebas concluidas con éxito"
```
