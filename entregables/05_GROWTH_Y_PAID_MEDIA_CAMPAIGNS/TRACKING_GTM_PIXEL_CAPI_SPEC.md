# 📊 Especificación de Medición, GTM y Meta Conversions API (CAPI)
> **Criterio AI — Especialista en Tracking & Atribución de Paid Media**  
> **Documento:** `entregables/05_GROWTH_Y_PAID_MEDIA_CAMPAIGNS/TRACKING_GTM_PIXEL_CAPI_SPEC.md`  
> **Objetivo:** Atribución precisa del 100% de los puntos de contacto entre la web `gocriterio.com`, los catálogos y las conversiones de WhatsApp.

---

## 1. Arquitectura de Atribución Híbrida (Client-Side + Server-Side)

```
[ Navegador del Usuario ]
       │
       ├───> [ Google Tag Manager (Web Container GTM-XXXXXX) ]
       │            ├───> Google Analytics 4 (GA4 Eventos)
       │            └───> Meta Pixel (Client-Side fbq('track'))
       │
       └───> [ Netlify Edge Functions / Cloudflare Worker ]
                    └───> Meta Conversions API (CAPI Server-Side)
```

### Regla Crítica de Deduplicación:
Para evitar contar eventos duplicados cuando el navegador dispara el Meta Pixel y el servidor envía el evento vía CAPI, **ambos deben compartir el mismo `event_id` único**:
```javascript
const eventId = 'ev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
```

---

## 2. Definición del Esquema DataLayer en los Catálogos y Web

### Evento 1: Visualización del Menú / Catálogo (`view_item_list` / `ViewContent`)
Disparado al cargar la página del catálogo:
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'criterio_view_catalog',
  event_id: 'vc_' + Date.now(),
  catalog_data: {
    restaurant_name: 'Burger & Co Bogotá',
    category: 'Hamburguesas',
    currency: 'COP',
    total_items: 6
  }
});
```

### Evento 2: Agregar Producto a la Canastilla (`add_to_cart` / `AddToCart`)
Disparado al hacer clic en el botón de agregar ítem:
```javascript
window.dataLayer.push({
  event: 'criterio_add_to_cart',
  event_id: 'atc_' + Date.now(),
  ecommerce: {
    currency: 'COP',
    value: 28900,
    items: [{
      item_id: 'hbg-doble-queso',
      item_name: 'Hamburguesa Doble Queso Smash',
      price: 28900,
      quantity: 1,
      item_category: 'Hamburguesas'
    }]
  }
});
```

### Evento 3: Clic en Enviar Pedido a WhatsApp (`initiate_checkout` / `InitiateCheckout`)
Disparado en el botón flotante inferior al confirmar la canastilla:
```javascript
window.dataLayer.push({
  event: 'criterio_send_whatsapp_order',
  event_id: 'wo_' + Date.now(),
  ecommerce: {
    currency: 'COP',
    value: 46800,
    items_count: 2,
    order_destination: '+573189411010'
  }
});
```

### Evento 4: Envío de Formulario de Briefing (`lead` / `SubmitLead`)
Disparado en `/briefing/` al completarse con éxito:
```javascript
window.dataLayer.push({
  event: 'criterio_briefing_submitted',
  event_id: 'lead_' + Date.now(),
  lead_data: {
    business_name: 'Trattoria di Roma',
    neighborhood: 'Chapinero',
    estimated_monthly_orders: '400+'
  }
});
```

---

## 3. Payload para Meta Conversions API (CAPI Server-Side)

Ejemplo de llamada cURL / HTTP POST enviada desde Netlify Functions a la Graph API de Meta (`v19.0`):

```bash
curl -X POST \
  "https://graph.facebook.com/v19.0/{PIXEL_ID}/events?access_token={META_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "event_name": "Contact",
        "event_time": 1727301600,
        "event_id": "wo_1727301600000",
        "event_source_url": "https://gocriterio.com/demo/hamburguesas/",
        "action_source": "website",
        "user_data": {
          "client_ip_address": "181.61.192.44",
          "client_user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...",
          "fbc": "fb.1.1727301500.IwAR1abc...",
          "fbp": "fb.1.1727301500.987654321"
        },
        "custom_data": {
          "currency": "COP",
          "value": 46800,
          "content_name": "Pedido WhatsApp Hamburguesas",
          "lead_type": "Catalogo Demo"
        }
      }
    ]
  }'
```

---

## 4. Parámetros de Enlace de WhatsApp con Seguimiento de Fuente

Para rastrear qué canal generó el chat en WhatsApp Business, todos los botones generan URLs con parámetros de mensaje predefinidos:

* **Desde Anuncio de Instagram (CBO):**  
  `https://wa.me/573189411010?text=Hola%20Criterio%20AI%2C%20vi%20su%20anuncio%20en%20Instagram%20y%20quiero%20la%20Demo%20en%20Mano%20en%2024h%20para%20mi%20restaurante.`
* **Desde Google Ads (Search):**  
  `https://wa.me/573189411010?text=Hola%2C%20encontr%C3%A9%20a%20Criterio%20AI%20en%20Google%20y%20quiero%20conocer%20el%20plan%20Carta%20Viva.`
* **Desde el Catálogo Demo:**  
  `https://wa.me/573189411010?text=%F0%9F%9B%92%20*NUEVO%20PEDIDO%20DE%20PRUEBA%20-%20DEMO%20CRITERIO%20AI*...`

---

## 5. Auditoría de Calidad de Datos (Event Match Quality)
Para mantener un puntaje de coincidencia de eventos superior a **8.5/10** en Meta Ads Manager:
1. Siempre registrar las cookies `_fbp` y `_fbc` del navegador y pasarlas a la llamada de servidor.
2. Pasar `client_ip_address` y `client_user_agent` limpios desde el servidor.
3. Si el usuario ingresa su correo en `/briefing/`, aplicar hash `SHA-256` en minúsculas y sin espacios antes de enviarlo a Meta.

---
*Especificación de medición validada para el equipo de análisis y paid media.*
