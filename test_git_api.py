import urllib.request
import json

payload = {
    "mission_goal": "Prueba Desbloqueo Web Criterio AI",
    "auto_commit": True,
    "deliverables": [
        {
            "step": 1,
            "agentId": "specialized-codebase-archaeologist",
            "agentName": "Codebase Archaeologist",
            "department": "Especialistas & Forensic",
            "title": "Auditoría Forense de Netlify Forms y Rutas",
            "content": "Se detectó que el formulario en /briefing/ carece de data-netlify='true'. Se generó el parche correspondiente.",
            "target_files": ["src/pages/briefing.html"]
        },
        {
            "step": 2,
            "agentId": "engineering-frontend-developer",
            "agentName": "Frontend Developer",
            "department": "Ingeniería & Código",
            "title": "Parche Netlify Forms y WhatsApp +57 318 941 1010",
            "content": "Sustitución de atributo form por data-netlify='true' y enlaces wa.me al número corporativo verificado.",
            "target_files": ["src/pages/briefing.html", "public/contact.html"]
        }
    ]
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:8080/api/git/deliverables', data=data, headers={'Content-Type': 'application/json; charset=utf-8'})
try:
    with urllib.request.urlopen(req) as res:
        print(res.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
