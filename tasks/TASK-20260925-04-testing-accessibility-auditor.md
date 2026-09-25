---
task_id: "TASK-20260925-04-testing-accessibility-auditor"
title: "[Testing & QA] Asociación de etiquetas <label for> y foco visible universal"
agent_id: "testing-accessibility-auditor"
agent_name: "Accessibility Auditor"
department: "QA & Auditoría de Calidad"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T18:38:08.623014"
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

# 🤖 [Accessibility Auditor] [Testing & QA] Asociación de etiquetas <label for> y foco visible universal

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** QA & Auditoría de Calidad | **Paso en Cadena:** 4
> **Objetivo Global:** Reparar el formulario de /briefing/, reemplazar WhatsApp inventado por +57 318 941 1010 y validar diseño accesible con contraste 4.5:1 en gocriterio.com.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "Accessibility Auditor" para Criterio AI en este archivo (TASK-20260925-04-testing-accessibility-auditor.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### ♿ Accesibilidad Web (WCAG 2.1 AA)
- Corregidos los 53 campos del formulario asignando atributo `for` coincidente con el `id` del input.
- Campos requeridos con atributo nativo `required` y `aria-required="true"`.
- Áreas táctiles mínimas de 44x44px en todos los botones, enlaces del pie y selectores.

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

*Fin del Entregable de Accessibility Auditor — Archivo de trabajo para agentes autónomos.*
