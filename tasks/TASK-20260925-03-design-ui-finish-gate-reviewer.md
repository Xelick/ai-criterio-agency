---
task_id: "TASK-20260925-03-design-ui-finish-gate-reviewer"
title: "[Diseño & Sistema] Estandarización de radios de borde y sombras duras en criterio.css"
agent_id: "design-ui-finish-gate-reviewer"
agent_name: "UI Finish-Gate Reviewer"
department: "Diseño & Creatividad"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T15:49:36.688662"
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

# 🤖 [UI Finish-Gate Reviewer] [Diseño & Sistema] Estandarización de radios de borde y sombras duras en criterio.css

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** Diseño & Creatividad | **Paso en Cadena:** 3
> **Objetivo Global:** Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "UI Finish-Gate Reviewer" para Criterio AI en este archivo (TASK-20260925-03-design-ui-finish-gate-reviewer.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### 📐 Verificación de Componentes en criterio.css
- Radio de tarjetas unificado a 24px (`border-radius: 24px`).
- Eliminadas sombras difusas; aplicadas sombras duras: `box-shadow: 0 2px 0 0 var(--sombra-tarjeta)`.
- En modo oscuro: sombra clara (`#eef1f8` o `#5b6285`) con contraste 3.23:1 sobre fondo `#0d0e16`.

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

*Fin del Entregable de UI Finish-Gate Reviewer — Archivo de trabajo para agentes autónomos.*
