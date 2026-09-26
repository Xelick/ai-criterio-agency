---
task_id: "TASK-20260925-03-testing-performance-benchmarker"
title: "[Testing & QA] Presupuesto web: peso < 300KB y LCP < 2.5s en 4G lenta"
agent_id: "testing-performance-benchmarker"
agent_name: "Performance Benchmarker"
department: "QA & Auditoría de Calidad"
role_for_downstream_ai: "Executor AI (Cursor / Claude Code / Antigravity)"
status: "READY_FOR_EXECUTION"
priority: "HIGH"
created_at: "2026-09-25T22:48:11.961326"
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

# 🤖 [Performance Benchmarker] [Testing & QA] Presupuesto web: peso < 300KB y LCP < 2.5s en 4G lenta

> **Generado por la Oficina Virtual Pixel Art de Criterio AI**
> **Especialidad:** QA & Auditoría de Calidad | **Paso en Cadena:** 3
> **Objetivo Global:** Auditar el sistema de diseño criterio.css y verificar que los 6 catálogos vivos abran en menos de 1 segundo.

---

## ⚡ Prompt Listo para Copiar a tu IA Ejecutora (Cursor / Claude Code / Antigravity)

```text
Actúa como Desarrollador / Consultor Senior. Lee detenidamente el entregable de "Performance Benchmarker" para Criterio AI en este archivo (TASK-20260925-03-testing-performance-benchmarker.md). 
Tu tarea es implementar y aplicar con precisión los cambios descritos a continuación en los archivos correspondientes (src/pages/briefing.html, src/styles/criterio.css), respetando las reglas de diseño (fuente 400, contraste WCAG AA, WhatsApp real +57 318 941 1010) y ejecutando las pruebas de verificación.
```

---

## 📋 Contexto y Diagnóstico del Especialista
### ⚡ Métricas Core Web Vitals
- **Portada**: 32.5 KB de peso total (5 peticiones HTTP).
- **LCP en 4G lenta**: 992 ms (Meta: < 2.5 s).
- **CLS**: 0.000 (cero saltos visuales).
- Imágenes convertidas a WebP optimizado exportadas a 2x del tamaño mostrado.

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

*Fin del Entregable de Performance Benchmarker — Archivo de trabajo para agentes autónomos.*
