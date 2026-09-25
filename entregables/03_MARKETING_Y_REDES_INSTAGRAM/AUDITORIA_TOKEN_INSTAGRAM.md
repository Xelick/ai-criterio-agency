# 📸 Criterio AI — Auditoría de Conexión & Token Meta Graph API (Instagram)
> **Fecha de Verificación en Vivo:** 25 de septiembre de 2026 (16:25 COT)
> **Script de Control:** `00_AGENCIA/MARCA/INSTAGRAM/ig.py`

---

## 🟢 Estado Oficial: 100% VÁLIDO & OPERACIONAL

| Parámetro | Valor Verificado en Vivo |
| :--- | :--- |
| **Cuenta de Instagram** | **`@criterio_ai`** (Nombre: *Criterio_AI_Educacion*) |
| **Instagram User ID** | `17841422360364668` |
| **Facebook Page ID** | `1072730942592645` |
| **Meta App ID** | `1612196947168350` |
| **Tipo de Token** | **`SYSTEM_USER` (Usuario del Sistema)** |
| **Caducidad** | **NUNCA (Token Permanente sin expiración a 60 días)** |
| **Cupo de Publicación (24h)** | **2 / 100 publicaciones utilizadas** (98% disponible) |

---

## 🔑 Permisos Clave Confirmados
- ✔ `instagram_content_publish`: Capacidad para publicar posts, carruseles y reels automáticamente.
- ✔ `instagram_manage_comments`: Lectura y respuesta de comentarios.
- ✔ `instagram_manage_messages`: Mensajes directos (DMs) de atención y prospección.
- ✔ `whatsapp_business_messaging`: Integración con WhatsApp Business API.
- ✔ `read_insights`: Acceso a métricas de alcance, impresiones y clics.

---

## 🚀 Cómo Publicar un Contenido desde Terminal
```powershell
cd "G:\My Drive\001_IA_BUSINESS\00_AGENCIA\MARCA\INSTAGRAM"

# 1. Simulación / Previsualización sin publicar:
python ig.py publish --image "ruta_imagen.jpg" --caption "Texto del copy"

# 2. Publicación real en la cuenta @criterio_ai:
python ig.py publish --image "ruta_imagen.jpg" --caption "Texto del copy" --yes
```
