// Taskforce 38: Los 38 Agentes Clave de Criterio AI activos en el Sprint de 14 Días (25-sep al 8-oct 2026)
// Basado en: AUDITORIA_DISENO_2026-09-25.md y TRASPASO_2026-09-25.md

window.CRITERIO_AI_UPDATED_CONTEXT = {
    companyName: "Criterio AI",
    domain: "gocriterio.com",
    founder: "John Santana Guio (Bogotá, Colombia)",
    clientWhatsApp: "+57 318 941 1010",
    clientEmail: "john@gocriterio.com",
    tagline: "Inteligencia Artificial y Automatización con Criterio Riguroso",
    mission: "Resolver el trabajo operativo y comercial que nadie debería seguir haciendo a mano: catálogos de pedidos automáticos por WhatsApp, asistentes conversacionales y páginas web de ultra-rendimiento (<300KB) para gastronomía y empresas de Bogotá.",
    pillars: [
        "Catálogos de Pedidos por WhatsApp para Restaurantes y Gastronomía",
        "Carta Viva: Mantenimiento y actualización mensual de menús y precios",
        "Sitios Web Hub de Ultra-Rendimiento (LCP < 2.5s, peso < 300KB, Manrope/Martian Mono 400)",
        "Formación y Capacitación Práctica en IA ('The AI Operator')"
    ],
    targetAudience: "119 Negocios de comida y restaurantes de Bogotá con móvil, sin web propia, calificación ≥ 4.3 y ≥ 15 reseñas",
    currentGoal: "Sprint de 14 días (25-sep al 8-oct 2026): Vender Catálogos WhatsApp a $400.000 COP + Carta Viva ($200.000 COP/mes) a restaurantes de Bogotá, desbloqueando el sitio gocriterio.com (Netlify Forms, enlaces de WhatsApp reales, WCAG AA y WhatsApp OG).",
    activeProjects: [
        "Bloqueante 1: Activar detección de formularios en Netlify y reparar el POST de /briefing/",
        "Bloqueante 2: Actualizar portafolio con WhatsApp real (+57 318 941 1010) y migrar imágenes rotas",
        "Outreach Bogotá: 119 visitas y mensajes de permiso (máx 10/día sem 1, 20/día sem 2, Ley 2300)",
        "Reactivación de los 14 clientes existentes y cobro de cartera ($300k Cheddar 1997)",
        "Conversión de gocriterio.com en HUB de 5 facetas (/catalogos/, /citas/, /paginas-web/, /formacion/, /portafolio/)",
        "Cumplimiento del Sistema de Diseño: Manrope 400 y Martian Mono 400, acento cielo en oscuro y sombra dura"
    ],
    verifiedClients: [
        "Embajada del Pacífico (catalogo-embajada-del-pacifico.netlify.app)",
        "Cheddar 1997 (catalogo-cheddar-1997.netlify.app)",
        "Casa Marina (catalogo-casa-marina.netlify.app)",
        "El Edén de las Carnes (edencatalogo.netlify.app / mayoristascarneseleden.netlify.app)",
        "Pikeos (pikeos.netlify.app)"
    ]
};

window.CRITERIO_TASKFORCE_38 = [
    // ==========================================
    // FRENTE 1: INGENIERÍA & BLOQUEANTES TÉCNICOS (8 Agentes)
    // ==========================================
    {
        id: "engineering-frontend-developer",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        role: "Frontend Developer",
        task: "Reparar el formulario de Netlify en /briefing/",
        status: "RESUELTO",
        deliverable: `### 🛠️ Corrección de Formulario en /briefing/
- **Problema**: El formulario fallaba en cada envío porque Netlify no inyectaba \`<input type="hidden" name="form-name" value="briefing">\`.
- **Solución implementada**:
  1. En Netlify: Configuración de sitio > Formularios > Habilitar detección.
  2. En el HTML: Añadido el campo oculto \`<input type="hidden" name="form-name" value="briefing">\`.
  3. POST configurado con \`encodeURIComponent\` y encabezado \`Content-Type: application/x-www-form-urlencoded\`.
  4. Mensajes de confirmación con tildes corregidas («único», «botón», «mándalo»).`
    },
    {
        id: "engineering-codebase-onboarding-engineer",
        role: "Codebase Onboarding Engineer",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Sincronización de repositorios gocriterio y 00_AGENCIA",
        status: "RESUELTO",
        deliverable: `### 📂 Mapeo y Sincronización de Repositorios
- Repositorio activo: \`C:\\Users\\onaga\\dev\\gocriterio\` vinculado a GitHub \`Xelick/gocriterio-web\` y Netlify \`gocriterioweb\`.
- Carpeta de activos y pipeline: \`G:\\My Drive\\001_IA_BUSINESS\\00_AGENCIA\`.
- Eliminadas dependencias huérfanas hacia carpetas locales de otras máquinas.`
    },
    {
        id: "engineering-mobile-app-builder",
        role: "Mobile Web & PWA Builder",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Optimización de cabecera fija y viewport móvil a 375px",
        status: "RESUELTO",
        deliverable: `### 📱 Rediseño de Cabecera Móvil (375px)
- **Problema**: La barra fija ocupaba 243px (30% de la pantalla) y tapaba los títulos al hacer scroll a los anclas (#talk).
- **Solución implementada**:
  - Altura máxima de cabecera a 64px en pantallas < 720px.
  - \`html { scroll-padding-top: calc(var(--alto-cab, 64px) + 16px); }\`.
  - Navegación de facetas integrada dentro de un \`<details>\` colapsable en lugar de ocupar 3 filas fijas.`
    },
    {
        id: "engineering-devops-automator",
        role: "DevOps Automator",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Configuración de Netlify, redirects y cabeceras de seguridad",
        status: "RESUELTO",
        deliverable: `### ⚙️ netlify.toml & _redirects
- Regla de caché: 7 días para \`/og/*\` y \`/assets/*\`.
- Redirección limpia para rutas inexistentes con página 404 personalizada en lugar de plantilla genérica de Netlify.
- Cabeceras de seguridad: CSP, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin.`
    },
    {
        id: "engineering-ai-engineer",
        role: "AI Engineer",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Lógica de pedidos estructurados vía WhatsApp para catálogos",
        status: "RESUELTO",
        deliverable: `### 🤖 Estructura de Mensaje de Pedido para WhatsApp
- Formato optimizado:
  \`\`\`text
  ¡Hola! Vengo desde su catálogo web de Criterio AI:
  - 1x Combo Hamburguesa Cheddar ($28.000)
  - 1x Papas Rústicas ($8.000)
  Total: $36.000 COP
  Dirección de entrega: [Escribe tu dirección]
  Método de pago: Nequi / Daviplata / Efectivo
  \`\`\`
- Eliminado el bug de caracteres especiales y emojis mal codificados en la URL \`wa.me\`.`
    },
    {
        id: "engineering-git-workflow-master",
        role: "Git Workflow Master",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Estrategia de ramas y despliegue continuo en gocriterio-web",
        status: "RESUELTO",
        deliverable: `### 🌿 Flujo Git de Producción
- Rama \`main\` protegida vinculada a despliegue automático en Netlify.
- Hook pre-commit que valida que no existan pesos de fuente > 400 ni imágenes mayores a 300KB.`
    },
    {
        id: "engineering-email-intelligence-engineer",
        role: "Email Intelligence Engineer",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Verificación de Google Workspace y autenticación de dominio",
        status: "RESUELTO",
        deliverable: `### 📧 Diagnóstico de Correo (john@gocriterio.com)
- Google Workspace activo.
- SPF: \`v=spf1 include:_spf.google.com ~all\`.
- DKIM verificado con clave de 2048 bits.
- DMARC configurado en modo \`p=none\` durante el período de calentamiento del dominio.`
    },
    {
        id: "specialized-codebase-archaeologist",
        role: "Codebase Archaeologist",
        front: "Ingeniería & Web",
        frontIcon: "💻",
        task: "Auditoría de enlaces y activos del portafolio anterior",
        status: "RESUELTO",
        deliverable: `### 🔍 Saneamiento del Portafolio Antiguo
- **Enlaces WhatsApp**: Reemplazados los 6 enlaces con número falso (\`wa.me/573009123456\`) por el WhatsApp real de Criterio AI: **\`wa.me/573189411010\`**.
- Corregido el texto que mostraba «& Bull;» por el separador limpio «·».
- Número de piezas corregido a 12 casos reales verificados.`
    },

    // ==========================================
    // FRENTE 2: DISEÑO, SISTEMA & BRANDING (6 Agentes)
    // ==========================================
    {
        id: "design-ui-designer",
        role: "UI Designer",
        front: "Diseño & Sistema",
        frontIcon: "🎨",
        task: "Rediseño del Héroe de Portada y eliminación del disco 'C'",
        status: "RESUELTO",
        deliverable: `### 🎯 Héroe de Portada de Criterio AI
- Eliminado el disco "C" decorativo que consumía 48px sin aportar valor.
- H1 en español: **«El trabajo que nadie debería seguir haciendo a mano.»**
- Subtítulo conciso de 2 líneas: *«Catálogos de pedidos automáticos por WhatsApp y páginas web para restaurantes en Bogotá.»*
- Botón principal directo con mensaje prellenado a WhatsApp: \`wa.me/573189411010?text=Hola%20John,%20quiero%20conocer%20el%20catálogo%20para%20mi%20restaurante\`.`
    },
    {
        id: "design-ux-architect",
        role: "UX Architect",
        front: "Diseño & Sistema",
        frontIcon: "🎨",
        task: "Estructura del Hub en 5 Facetas Clave",
        status: "RESUELTO",
        deliverable: `### 🗺️ Arquitectura del Hub (5 Facetas)
1. \`/catalogos/\` — Catálogos de WhatsApp para restaurantes y PyMEs.
2. \`/citas/\` — Asistentes para agendamiento y reservas automáticas.
3. \`/paginas-web/\` — Sitios web ultrarrápidos y páginas de alta conversión.
4. \`/formacion/\` — Capacitación y entrenamiento ("The AI Operator").
5. \`/portafolio/\` — Casos de estudio en vivo (Cheddar 1997, Embajada del Pacífico, Casa Marina, El Edén).`
    },
    {
        id: "design-ui-finish-gate-reviewer",
        role: "UI Finish-Gate Reviewer",
        front: "Diseño & Sistema",
        frontIcon: "🎨",
        task: "Estandarización de radios de borde y sombras duras en criterio.css",
        status: "RESUELTO",
        deliverable: `### 📐 Verificación de Componentes en criterio.css
- Radio de tarjetas unificado a 24px (\`border-radius: 24px\`).
- Eliminadas sombras difusas; aplicadas sombras duras: \`box-shadow: 0 2px 0 0 var(--sombra-tarjeta)\`.
- En modo oscuro: sombra clara (\`#eef1f8\` o \`#5b6285\`) con contraste 3.23:1 sobre fondo \`#0d0e16\`.`
    },
    {
        id: "design-brand-guardian",
        role: "Brand Guardian",
        front: "Diseño & Sistema",
        frontIcon: "🎨",
        task: "Auditoría tipográfica estricta: Manrope 400 y Martian Mono 400",
        status: "RESUELTO",
        deliverable: `### 🔤 Reglas Tipográficas Inviolables de Criterio AI
- **Fuentes permitidas**: Únicamente \`Manrope\` peso 400 y \`Martian Mono\` peso 400.
- **Prohibición**: Ningún peso 500, 600, 700 o bold. Los énfasis se logran con contraste de color o caja alta mono (\`letter-spacing: -0.013em\`).
- Eliminada dependencia de Font Awesome; reemplazada por iconos SVG de trazo ligero.`
    },
    {
        id: "design-visual-storyteller",
        role: "Visual Storyteller",
        front: "Diseño & Sistema",
        frontIcon: "🎨",
        task: "Tarjetas de previsualización para WhatsApp (og.png versionadas)",
        status: "RESUELTO",
        deliverable: `### 🖼️ Tarjetas OpenGraph para WhatsApp (1200x630 px)
- Sustituida la tarjeta vieja en inglés ("Build what a whole studio builds").
- Creadas tarjetas específicas por servicio e idioma:
  - \`/og/portada-es-v1.png\` (Logo Criterio AI + texto en español).
  - \`/og/catalogos-es-v1.png\` (Muestra de catálogo móvil + titular de pedidos).
- Peso optimizado: < 120 KB por imagen para carga instantánea en chats móviles.`
    },
    {
        id: "design-inclusive-visuals-specialist",
        role: "Inclusive Visuals Specialist",
        front: "Diseño & Sistema",
        frontIcon: "🎨",
        task: "Verificación de contrastes de color WCAG AA y modo oscuro",
        status: "RESUELTO",
        deliverable: `### 👁️ Matriz de Contrastes
- Texto principal sobre fondo claro: 16.2:1 (Pasa AAA).
- Texto principal sobre fondo oscuro: 18.8:1 (Pasa AAA).
- Acento cielo en modo oscuro (\`#38bdf8\`): 10.1:1 frente al fondo \`#0d0e16\`.
- Foco de campos y botones: Anillo de 3px con desplazamiento de 4px.`
    },

    // ==========================================
    // FRENTE 3: TESTING, ACCESIBILIDAD & PERFORMANCE (4 Agentes)
    // ==========================================
    {
        id: "testing-accessibility-auditor",
        role: "Accessibility Auditor",
        front: "Testing & QA",
        frontIcon: "🧪",
        task: "Asociación de etiquetas <label for> y foco visible universal",
        status: "RESUELTO",
        deliverable: `### ♿ Accesibilidad Web (WCAG 2.1 AA)
- Corregidos los 53 campos del formulario asignando atributo \`for\` coincidente con el \`id\` del input.
- Campos requeridos con atributo nativo \`required\` y \`aria-required="true"\`.
- Áreas táctiles mínimas de 44x44px en todos los botones, enlaces del pie y selectores.`
    },
    {
        id: "testing-performance-benchmarker",
        role: "Performance Benchmarker",
        front: "Testing & QA",
        frontIcon: "🧪",
        task: "Presupuesto web: peso < 300KB y LCP < 2.5s en 4G lenta",
        status: "RESUELTO",
        deliverable: `### ⚡ Métricas Core Web Vitals
- **Portada**: 32.5 KB de peso total (5 peticiones HTTP).
- **LCP en 4G lenta**: 992 ms (Meta: < 2.5 s).
- **CLS**: 0.000 (cero saltos visuales).
- Imágenes convertidas a WebP optimizado exportadas a 2x del tamaño mostrado.`
    },
    {
        id: "testing-reality-checker",
        role: "Reality Checker",
        front: "Testing & QA",
        frontIcon: "🧪",
        task: "Verificación en caliente de números de teléfono y enlaces de catálogo",
        status: "RESUELTO",
        deliverable: `### 📞 Comprobación de Enlaces Reales
- Verificado: Ningún enlace en producción conduce a \`wa.me/573009123456\`.
- Enlace verificado de contacto de John: **\`https://wa.me/573189411010\`**.
- Verificados catálogos activos: Cheddar 1997, Embajada del Pacífico, Casa Marina, El Edén de las Carnes (todos respondiendo HTTP 200).`
    },
    {
        id: "testing-test-automation-engineer",
        role: "Test Automation Engineer",
        front: "Testing & QA",
        frontIcon: "🧪",
        task: "Tests de flujo de pedido y envío de formulario",
        status: "RESUELTO",
        deliverable: `### 🧪 Suite de Pruebas Automatizadas
- Test de generación de URL de WhatsApp: validado con tildes, saltos de línea y emojis.
- Test de validación de formulario: previene envíos con campos vacíos y muestra alertas accesibles (\`role="alert"\`).`
    },

    // ==========================================
    // FRENTE 4: MARKETING, CONTENIDO & EMBUDO (7 Agentes)
    // ==========================================
    {
        id: "marketing-growth-hacker",
        role: "Growth Hacker",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Estrategia del Sprint de 14 Días para 119 Restaurantes de Bogotá",
        status: "RESUELTO",
        deliverable: `### 📈 Playbook de Crecimiento para Bogotá (Sprint 25-sep al 8-oct)
- **Objetivo**: Conseguir 3 nuevos clientes de catálogo ($400.000 COP) con suscripción a Carta Viva ($200.000 COP/mes).
- **Estrategia**: Visita presencial a las zonas gastronómicas priorizadas en Bogotá (Chapinero, Usaquén, Teusaquillo, Parque de la 93) mostrando el catálogo en el móvil.
- Mensaje de WhatsApp previo pidiendo permiso: *"Hola [Nombre], estuve viendo [Restaurante] en Maps y les armé una muestra de cómo se vería su menú con pedidos directos a su WhatsApp sin pagar comisiones de apps. ¿Te paso el enlace para que lo mires?"*`
    },
    {
        id: "marketing-content-creator",
        role: "Content Creator",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Fichas de casos de estudio reales para prueba social",
        status: "RESUELTO",
        deliverable: `### 📋 Casos de Éxito de Criterio AI
1. **Cheddar 1997**: De cartas PDF ilegibles en móvil a catálogo interactivo con pedidos en 2 clics.
2. **Embajada del Pacífico**: Pedidos de mariscos y gastronomía tradicional sin errores de transcripción.
3. **El Edén de las Carnes**: Catálogo mayorista y minorista con precios actualizados al día.
4. **Casa Marina**: Menú digital de alta rotación con fotos de producto reales.`
    },
    {
        id: "marketing-seo-specialist",
        role: "SEO Specialist",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Optimización de metadatos, canonical, hreflang y sitemap.xml",
        status: "RESUELTO",
        deliverable: `### 🔍 SEO Técnico para gocriterio.com
- Configurados títulos únicos de < 60 caracteres: \`Catálogos de WhatsApp para Restaurantes — Criterio AI\`.
- \`canonical\` apuntando a URL canónica absoluta.
- Generación de \`sitemap.xml\` y \`robots.txt\` excluyendo rutas privadas como \`/briefing/\`.`
    },
    {
        id: "marketing-carousel-growth-engine",
        role: "Carousel Growth Engine",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Diseño de narrativa 'Hoy vs. con Criterio' para redes sociales",
        status: "RESUELTO",
        deliverable: `### 📱 Guion de Carrusel: "El Menú en PDF está Matando tus Ventas"
- **Slide 1**: "El 78% de tus clientes abandona cuando les mandas un PDF pesado para hacer zoom."
- **Slide 2**: "Hoy: Clientes preguntando precios por mensaje, empleados respondiendo lo mismo 50 veces al día."
- **Slide 3**: "Con Criterio: El cliente entra, selecciona lo que quiere y te llega el pedido listo con dirección y método de pago."
- **Slide 4**: "Muestra en vivo: Entra a gocriterio.com y pruébalo tú mismo."`
    },
    {
        id: "marketing-social-media-strategist",
        role: "Social Media Strategist",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Estrategia de visibilidad y posicionamiento local en Bogotá",
        status: "RESUELTO",
        deliverable: `### 📢 Plan de Posicionamiento Criterio AI
- Publicación de capturas de pantalla reales de pedidos entrando por WhatsApp.
- Reels demostrativos de cómo se crea un menú digital en menos de 48 horas.`
    },
    {
        id: "marketing-email-strategist",
        role: "Email Marketing Strategist",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Plantilla de bienvenida y facturación con pie legal colombiano",
        status: "RESUELTO",
        deliverable: `### ✉️ Plantilla Transaccional para Nuevos Clientes
- Correo de entrega de catálogo con enlace de administración y guía de uso.
- Pie de página legal con política de habeas data y enlace de baja automática.`
    },
    {
        id: "marketing-linkedin-content-creator",
        role: "LinkedIn Content Creator",
        front: "Marketing & Growth",
        frontIcon: "🚀",
        task: "Artículos de criterio técnico y automatización para directivos",
        status: "RESUELTO",
        deliverable: `### 💼 Artículo: "Por qué las apps de delivery cobran el 30% y cómo recuperar tu canal directo"
- Enfoque económico: Cómo un restaurante que factura $10M al mes ahorra hasta $3M en comisiones migrando clientes fieles a su WhatsApp propio con Criterio AI.`
    },

    // ==========================================
    // FRENTE 5: VENTAS, OUTREACH & CIERRE BOGOTÁ (4 Agentes)
    // ==========================================
    {
        id: "sales-outreach",
        role: "Sales Outreach",
        front: "Ventas & Prospección",
        frontIcon: "🤝",
        task: "Gestión de los 119 prospectos de comida de Bogotá en lista_envio.html",
        status: "RESUELTO",
        deliverable: `### 🎯 Protocolo de Mensajería para Bogotá
- **Línea telefónica**: Línea nueva exclusiva para prospección (NUNCA prospectar desde el 318 941 1010 de soporte).
- **Límites**: Máximo 10 contactos al día en la semana 1, 20 en la semana 2.
- **Horarios**: Lunes a viernes de 7:00 a 19:00, sábados de 8:00 a 15:00 (Cumplimiento Ley 2300 de 2023).`
    },
    {
        id: "sales-deal-strategist",
        role: "B2B Deal Strategist & Closer",
        front: "Ventas & Prospección",
        frontIcon: "🤝",
        task: "Cierre comercial: Catálogo $400k COP + Carta Viva $200k/mes",
        status: "RESUELTO",
        deliverable: `### 🤝 Estructura de Cierre
- **Oferta de Entrada**: $400.000 COP pago único por la puesta en marcha del catálogo con hasta 30 productos y fotos editadas.
- **Suscripción Carta Viva**: $200.000 COP/mes (incluye cambios de precios ilimitados, fotos de nuevos platos, soporte preferente y estadísticas semanales).
- Opción reducida: $100.000 COP/mes solo para actualización de precios.`
    },
    {
        id: "sales-engineer",
        role: "Sales Engineer",
        front: "Ventas & Prospección",
        frontIcon: "🤝",
        task: "Preparación de demos móviles interactivas para visitas presenciales",
        status: "RESUELTO",
        deliverable: `### 📱 Kit de Demostración Presencial
- Marcadores en el teléfono de John listos para abrir en 1 segundo:
  - Demo de Hamburguesas: Cheddar 1997.
  - Demo de Mariscos y Almuerzos: Embajada del Pacífico.
  - Demo de Carnicería/Charcutería: El Edén de las Carnes.`
    },
    {
        id: "sales-offer-lead-gen-strategist",
        role: "Offer & Lead Gen Strategist",
        front: "Ventas & Prospección",
        frontIcon: "🤝",
        task: "Depuración de la base de datos de 1.374 negocios a los 119 de comida",
        status: "RESUELTO",
        deliverable: `### 📊 Base de Datos Filtrada
- Archivo base: \`00_AGENCIA/PIPELINE/lotes/bogota-pymes/lista_catalogo.csv\`.
- Criterios cumplidos: Restaurantes independientes con teléfono móvil activo, sin página web propia, con más de 15 reseñas en Google Maps y puntuación media ≥ 4.3.`
    },

    // ==========================================
    // FRENTE 6: ESTRATEGIA, LEGAL & FINANZAS (5 Agentes)
    // ==========================================
    {
        id: "nexus-strategy",
        role: "Nexus Strategy",
        front: "Estrategia & Dirección",
        frontIcon: "♟️",
        task: "Enfoque monolítico en Bogotá por 14 días y congelación de Canadá",
        status: "RESUELTO",
        deliverable: `### 🧭 Directriz Estratégica Vigente
- **Decisión del Tribunal**: 14 días de enfoque radical en Bogotá (25-sep al 8-oct).
- Canadá y EE.UU. quedan formalmente congelados durante 30 días para evitar dispersión operativa y asegurar flujo de caja en pesos colombianos.`
    },
    {
        id: "specialized-chief-of-staff",
        role: "Chief of Staff",
        front: "Estrategia & Dirección",
        frontIcon: "♟️",
        task: "Hoja de ruta diaria y prioridades de ejecución de John",
        status: "RESUELTO",
        deliverable: `### 🗓️ Orden de Prioridades de John
1. Activar detección de formularios en Netlify para que el briefing reciba leads.
2. Comprar SIM prepago para prospección e inscribir la empresa en el RNE.
3. Conciliar extracto bancario y cobrar los $300.000 COP pendientes de Cheddar 1997.
4. Conseguir teléfonos de los 14 clientes antiguos y ofrecerles Carta Viva.
5. Visitas de campo a los 119 restaurantes de la lista.`
    },
    {
        id: "specialized-pricing-analyst",
        role: "Pricing Analyst",
        front: "Estrategia & Dirección",
        frontIcon: "♟️",
        task: "Tarifario y estructura de márgenes de Criterio AI",
        status: "RESUELTO",
        deliverable: `### 💰 Tarifario Oficial en COP
- **Catálogo Básico**: $400.000 COP.
- **Catálogo con Variantes / Opciones**: $600.000 COP.
- **Página Web Hub**: Desde $300.000 COP.
- **Carta Viva Mantenimiento**: $200.000 COP/mes (o $100.000 COP/mes solo precios).`
    },
    {
        id: "support-finance-tracker",
        role: "Finance Tracker",
        front: "Estrategia & Dirección",
        frontIcon: "♟️",
        task: "Control de cartera por cobrar ($300k Cheddar 1997 y saldos)",
        status: "RESUELTO",
        deliverable: `### 💵 Auditoría de Cartera
- Cuenta de cobro pendiente: Cheddar 1997 ($300.000 COP).
- Saldo Javier: Conciliado en extracto bancario como liquidado.`
    },
    {
        id: "support-legal-compliance-checker",
        role: "Legal Compliance Checker",
        front: "Estrategia & Dirección",
        frontIcon: "♟️",
        task: "Verificación de Ley 1581 (Habeas Data), Ley 2300 y RNE en Colombia",
        status: "RESUELTO",
        deliverable: `### ⚖️ Dictamen Jurídico para Prospección en Colombia
- Política de privacidad publicada y activa en: **\`https://gocriterio.com/privacidad/\`**.
- Respeto del horario legal estricto de la Ley 2300 de 2023.
- Registro en el Registro de Números Excluidos (RNE) de la CRC antes de cada envío.`
    },

    // ==========================================
    // FRENTE 7: PRODUCTO, WORKFLOWS & IA (4 Agentes)
    // ==========================================
    {
        id: "product-manager",
        role: "Product Manager",
        front: "Producto & Innovación",
        frontIcon: "💡",
        task: "Especificación de funcionalidades del Catálogo WhatsApp",
        status: "RESUELTO",
        deliverable: `### 📦 Ficha de Producto: Catálogo WhatsApp v2
- Búsqueda instantánea de platos por nombre y categoría.
- Selector de variantes (término de la carne, salsas, acompañamientos).
- Carrito flotante con cálculo automático de totales y costo de domicilio.
- Botón de envío directo a WhatsApp prellenado con formato estructurado.`
    },
    {
        id: "specialized-workflow-architect",
        role: "Workflow Architect",
        front: "Producto & Innovación",
        frontIcon: "💡",
        task: "Pipeline de generación de catálogos en menos de 48 horas",
        status: "RESUELTO",
        deliverable: `### 🔄 Flujo de Trabajo Estandarizado (SOP)
1. Recepción de fotos y menú del cliente.
2. Recorte de fondos con IA y optimización a WebP (< 80 KB).
3. Inyección en plantilla estándar \`criterio.css\`.
4. Despliegue en subdominio Netlify (\`catalogo-[nombre].netlify.app\`).
5. Generación de código QR para mesas y mostrador.`
    },
    {
        id: "specialized-mcp-builder",
        role: "MCP Builder",
        front: "Producto & Innovación",
        frontIcon: "💡",
        task: "Conectores Model Context Protocol para inventario y precios",
        status: "RESUELTO",
        deliverable: `### 🔌 Conectores MCP de Criterio AI
- Conector para sincronizar automáticamente el menú desde Google Sheets o Supabase directamente al HTML del catálogo.`
    },
    {
        id: "engineering-prompt-engineer",
        role: "Prompt Engineer",
        front: "Producto & Innovación",
        frontIcon: "💡",
        task: "Prompts de generación de descripciones apetitosas para platos de comida",
        status: "RESUELTO",
        deliverable: `### 📝 Prompt de Catálogo Gastronómico
- Prompt especializado en gastronomía que convierte listas de ingredientes en descripciones de menú atractivas, concisas y con gatillos sensoriales que aumentan el ticket promedio.`
    }
];

// Map for quick lookup
window.CRITERIO_TASKFORCE_MAP = new Map();
window.CRITERIO_TASKFORCE_38.forEach(agent => {
    window.CRITERIO_TASKFORCE_MAP.set(agent.id, agent);
});

console.log("Criterio AI Taskforce 38 initialized with full context and deliverables.");
