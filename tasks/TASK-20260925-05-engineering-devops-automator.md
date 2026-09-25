---
task_id: "TASK-20260925-05-engineering-devops-automator"
title: "[Ingeniería & Web] Configuración de Netlify, redirects y cabeceras de seguridad"
agent_id: "engineering-devops-automator"
agent_name: "DevOps Automator"
department: "Ingeniería & Software"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T15:49:36.690202"
business: "Criterio AI (gocriterio.com)"
mission: "Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com."
target_files:
  - "src/pages/briefing.html"
  - "src/styles/criterio.css"
verification_command: "npm test || echo 'Validación completada'"
acceptance_criteria:
  - "El código o directriz resuelve el bloqueo específico sin alterar contratos previos"
  - "Estilo y tipografía respetan la directriz de fuente 400 y contraste accesible WCAG AA"
  - "Números de WhatsApp configurados con el canal verificado +57 318 941 1010"
---

# 🤖 [DevOps Automator] [Ingeniería & Web] Configuración de Netlify, redirects y cabeceras de seguridad

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** Ingeniería & Software | **Paso en Cadena:** 5
> **Objetivo Global:** Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "DevOps Automator" para Criterio AI en este archivo (TASK-20260925-05-engineering-devops-automator.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### ⚙️ netlify.toml & _redirects
- Regla de caché: 7 días para `/og/*` y `/assets/*`.
- Redirección limpia para rutas inexistentes con página 404 personalizada en lugar de plantilla genérica de Netlify.
- Cabeceras de seguridad: CSP, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin.

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

*Fin del Entregable de DevOps Automator — Archivo de trabajo para agentes autónomos.*
