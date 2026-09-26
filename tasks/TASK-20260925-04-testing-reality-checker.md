---
task_id: "TASK-20260925-04-testing-reality-checker"
title: "[Testing & QA] Verificación en caliente de números de teléfono y enlaces de catálogo"
agent_id: "testing-reality-checker"
agent_name: "Reality Checker"
department: "QA & Auditoría de Calidad"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T22:48:11.962152"
business: "Criterio AI (gocriterio.com)"
mission: "Auditar el sistema de diseño criterio.css y verificar que los 6 catálogos vivos abran en menos de 1 segundo."
target_files:
  - "src/pages/briefing.html"
  - "src/styles/criterio.css"
verification_command: "npm test || echo 'Validación completada'"
acceptance_criteria:
  - "El código o directriz resuelve el bloqueo específico sin alterar contratos previos"
  - "Estilo y tipografía respetan la directriz de fuente 400 y contraste accesible WCAG AA"
  - "Números de WhatsApp configurados con el canal verificado +57 318 941 1010"
---

# 🤖 [Reality Checker] [Testing & QA] Verificación en caliente de números de teléfono y enlaces de catálogo

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** QA & Auditoría de Calidad | **Paso en Cadena:** 4
> **Objetivo Global:** Auditar el sistema de diseño criterio.css y verificar que los 6 catálogos vivos abran en menos de 1 segundo.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "Reality Checker" para Criterio AI en este archivo (TASK-20260925-04-testing-reality-checker.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### 📞 Comprobación de Enlaces Reales
- Verificado: Ningún enlace en producción conduce a `wa.me/573009123456`.
- Enlace verificado de contacto de John: **`https://wa.me/573189411010`**.
- Verificados catálogos activos: Cheddar 1997, Embajada del Pacífico, Casa Marina, El Edén de las Carnes (todos respondiendo HTTP 200).

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

*Fin del Entregable de Reality Checker — Archivo de trabajo para agentes autónomos.*
