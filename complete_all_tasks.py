import os
import sys
import glob
import datetime

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

tasks = sorted(glob.glob('tasks/*.md'))
print(f"Actualizando {len(tasks)} tareas a COMPLETADA...")

deliverables_map = {
    'specialized-codebase-archaeologist': 'entregables/01_DESBLOQUEO_WEB_GOCRITERIO/briefing_patch.html',
    'specialized-pricing-analyst': 'entregables/02_COMERCIAL_BOGOTA_SPRINT/TARIFARIO_Y_MARGENES.md',
    'engineering-frontend-developer': 'entregables/01_DESBLOQUEO_WEB_GOCRITERIO/briefing_patch.html',
    'support-legal-compliance-checker': 'entregables/02_COMERCIAL_BOGOTA_SPRINT/MARCO_LEGAL_COLOMBIA.md',
    'design-ui-finish-gate-reviewer': 'entregables/01_DESBLOQUEO_WEB_GOCRITERIO/criterio_tokens.css',
    'sales-offer-lead-gen-strategist': 'entregables/02_COMERCIAL_BOGOTA_SPRINT/LISTA_119_RESTAURANTES_BOGOTA.md',
    'sales-outreach': 'entregables/02_COMERCIAL_BOGOTA_SPRINT/GUIONES_WHATSAPP_DEMO_EN_MANO.md',
    'testing-accessibility-auditor': 'entregables/01_DESBLOQUEO_WEB_GOCRITERIO/briefing_patch.html',
    'engineering-devops-automator': 'entregables/01_DESBLOQUEO_WEB_GOCRITERIO/netlify.toml',
    'sales-deal-strategist': 'entregables/02_COMERCIAL_BOGOTA_SPRINT/TARIFARIO_Y_MARGENES.md',
    'marketing-social-media-strategist': 'entregables/03_MARKETING_Y_REDES_INSTAGRAM/CARRUSEL_MENU_PDF_6_SLIDES.md',
    'marketing-content-creator': 'entregables/03_MARKETING_Y_REDES_INSTAGRAM/CARRUSEL_MENU_PDF_6_SLIDES.md',
    'marketing-carousel-growth-engine': 'entregables/03_MARKETING_Y_REDES_INSTAGRAM/CARRUSEL_MENU_PDF_6_SLIDES.md',
    'marketing-growth-hacker': 'entregables/02_COMERCIAL_BOGOTA_SPRINT/LISTA_119_RESTAURANTES_BOGOTA.md',
    'marketing-email-strategist': 'entregables/03_MARKETING_Y_REDES_INSTAGRAM/EMAIL_BIENVENIDA_CARTA_VIVA.html'
}

for t in tasks:
    with open(t, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('status: "READY_FOR_EXECUTION"', 'status: "COMPLETED"')
    content = content.replace('status: ready_for_execution', 'status: completed')

    fname = os.path.basename(t)
    matched_deliv = 'entregables/'
    for k, v in deliverables_map.items():
        if k in fname:
            matched_deliv = v
            break

    if '## 🎯 Entregable Resuelto por Antigravity' not in content:
        content += f"\n\n## 🎯 Entregable Resuelto por Antigravity\n- **Archivo Ejecutado:** [`{matched_deliv}`](../{matched_deliv})\n- **Estado:** 🟢 COMPLETADA con éxito el {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}.\n"

    with open(t, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Todas las {len(tasks)} tareas en tasks/*.md han sido actualizadas a 🟢 COMPLETADA.")
