---
task_id: "TASK-20260925-01-design-ui-designer"
title: "[Diseño & Sistema] Rediseño del Héroe de Portada y eliminación del disco 'C'"
agent_id: "design-ui-designer"
agent_name: "UI Designer"
department: "Diseño & Creatividad"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T22:48:11.958674"
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

# 🤖 [UI Designer] [Diseño & Sistema] Rediseño del Héroe de Portada y eliminación del disco 'C'

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** Diseño & Creatividad | **Paso en Cadena:** 1
> **Objetivo Global:** Auditar el sistema de diseño criterio.css y verificar que los 6 catálogos vivos abran en menos de 1 segundo.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "UI Designer" para Criterio AI en este archivo (TASK-20260925-01-design-ui-designer.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### 🎯 Héroe de Portada de Criterio AI
- Eliminado el disco "C" decorativo que consumía 48px sin aportar valor.
- H1 en español: **«El trabajo que nadie debería seguir haciendo a mano.»**
- Subtítulo conciso de 2 líneas: *«Catálogos de pedidos automáticos por WhatsApp y páginas web para restaurantes en Bogotá.»*
- Botón principal directo con mensaje prellenado a WhatsApp: `wa.me/573189411010?text=Hola%20John,%20quiero%20conocer%20el%20catálogo%20para%20mi%20restaurante`.

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

*Fin del Entregable de UI Designer — Archivo de trabajo para agentes autónomos.*
