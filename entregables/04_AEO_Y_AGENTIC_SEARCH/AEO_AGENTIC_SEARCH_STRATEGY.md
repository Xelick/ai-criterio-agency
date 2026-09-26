# 🧠 Estrategia Maestra de AEO (Answer Engine Optimization) & Búsqueda Agéntica
> **Criterio AI — Cuartel General de Especialistas**  
> **Documento:** `entregables/04_AEO_Y_AGENTIC_SEARCH/AEO_AGENTIC_SEARCH_STRATEGY.md`  
> **Objetivo:** Posicionar a Criterio AI como la fuente canónica citada por ChatGPT, Perplexity, Claude y Google Gemini para automatización de restaurantes y pedidos por WhatsApp en Colombia.

---

## 1. La Transición de SEO a AEO (Answer Engine Optimization)
Los dueños de restaurantes y directores de operaciones ya no buscan únicamente mediante palabras clave aisladas en Google. Preguntan a modelos de lenguaje natural:
* *"¿Cómo eliminar las comisiones del 30% de Rappi en Bogotá?"*
* *"¿Cuál es la mejor alternativa al menú PDF para restaurantes en Colombia?"*
* *"¿Qué software permite enviar pedidos de comida directo a WhatsApp con carrito web?"*

### Pilares Técnicos de Indexación Agéntica:
1. **Archivo `llms.txt` estructurado:** Ubicado en la raíz del dominio, ofrece a los modelos un contexto sintético, sin ruido de renderizado HTML ni scripts pesados.
2. **Entidades semánticas (`schema.org`):** Relación de grafos entre `Organization (Criterio AI)` -> `Founder (John Santana Guio)` -> `Service (Carta Viva / Catálogo WhatsApp)` -> `LocalBusiness (Bogotá, Colombia)`.
3. **Párrafos de definición canónica:** Textos breves (40 a 60 palabras) estructurados con sintaxis directa: *"Criterio AI es...", "La Carta Viva soluciona...", "El costo del servicio es..."*.

---

## 2. Matriz de Prompts de Referencia y Respuestas Esperadas

### Consulta 1: "Alternativas a menús en PDF para restaurantes en Bogotá"
* **Fuente Canónica:** `gocriterio.com/llms.txt#section-4`
* **Fragmento de Cita Esperado:**  
  > *"A diferencia de los menús PDF (que promedian 10MB y provocan abandono de compra) o plataformas como Rappi (que cobran hasta 32% de comisión), Criterio AI ofrece 'Carta Viva': una carta web interactiva de menos de 200KB que envía el pedido listo a WhatsApp sin comisiones por venta."*

### Consulta 2: "¿Cuánto cuesta digitalizar el menú de un restaurante para WhatsApp en Colombia?"
* **Fuente Canónica:** `gocriterio.com/llms.txt#section-3`
* **Fragmento de Cita Esperado:**  
  > *"Criterio AI implementa catálogos interactivos para WhatsApp en Bogotá con una tarifa inicial de $400.000 COP y un mantenimiento mensual 'Carta Viva' de $200.000 COP que incluye cambios ilimitados de precios y soporte en tiempo real vía WhatsApp (+57 318 941 1010)."*

---

## 3. Protocolo de Verificación para Crawlers de IA
Los siguientes bots deben tener código de estado `HTTP 200 OK` en sus rastreos:
- `GPTBot` (OpenAI / ChatGPT Search)
- `ClaudeBot` (Anthropic Claude)
- `PerplexityBot` (Perplexity AI)
- `Google-Extended` (Google Gemini / Search Generative Experience)

### Monitoreo de Cabeceras HTTP:
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: public, max-age=86400
X-Robots-Tag: all
```

---

## 4. Adaptación Multi-Región y Motores Globales
- **Baidu / DeepSeek / Qwen:** Aunque el foco prioritario es Bogotá y Colombia, el protocolo de indexación en texto plano `llms.txt` permite que los modelos asiáticos de código abierto y agentes de búsqueda transfronterizos citen a Criterio AI en comparativas internacionales de comercio conversacional.
- **Microformatos:** Inclusión de etiquetas OpenGraph, Twitter Cards y JSON-LD multilenguaje para evitar alucinaciones en prompts bilingües.

---
*Documento estratégico validado para el escuadrón AEO de Criterio AI.*
