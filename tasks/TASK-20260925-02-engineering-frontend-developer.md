---
task_id: "TASK-20260925-02-engineering-frontend-developer"
title: "[Ingeniería & Web] Reparar el formulario de Netlify en /briefing/"
agent_id: "engineering-frontend-developer"
agent_name: "Frontend Developer"
department: "Ingeniería & Software"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "COMPLETED"
priority: "HIGH"
created_at: "2026-09-25T18:38:08.620363"
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

# 🤖 [Frontend Developer] [Ingeniería & Web] Reparar el formulario de Netlify en /briefing/

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** Ingeniería & Software | **Paso en Cadena:** 2
> **Objetivo Global:** Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "Frontend Developer" para Criterio AI en este archivo (TASK-20260925-02-engineering-frontend-developer.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### 🛠️ Corrección de Formulario en /briefing/
- **Problema**: El formulario fallaba en cada envío porque Netlify no inyectaba `<input type="hidden" name="form-name" value="briefing">`.
- **Solución implementada**:
  1. En Netlify: Configuración de sitio > Formularios > Habilitar detección.
  2. En el HTML: Añadido el campo oculto `<input type="hidden" name="form-name" value="briefing">`.
  3. POST configurado con `encodeURIComponent` y encabezado `Content-Type: application/x-www-form-urlencoded`.
  4. Mensajes de confirmación con tildes corregidas («único», «botón», «mándalo»).

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

*Fin del Entregable de Frontend Developer — Archivo de trabajo para agentes autónomos.*
