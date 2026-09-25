import os
import re
import json

repo_dir = r"C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\agency-agents"
output_file = r"C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\agents_database.json"
summary_file = r"C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency\agents_summary.json"

DEPT_THEMES = {
    "academic": {"name": "Investigación Académica", "floor": 4, "zone": "Laboratorio & Biblioteca", "color": "#8b5cf6", "icon": "🎓"},
    "design": {"name": "Diseño & Creatividad", "floor": 3, "zone": "Design Studio & UX Lab", "color": "#ec4899", "icon": "🎨"},
    "engineering": {"name": "Ingeniería & Software", "floor": 2, "zone": "Tech Core & Dev Hub", "color": "#0ea5e9", "icon": "💻"},
    "finance": {"name": "Finanzas & Legal", "floor": 5, "zone": "Auditoría & Tesorería", "color": "#10b981", "icon": "💰"},
    "game-development": {"name": "Desarrollo de Videojuegos", "floor": 3, "zone": "Game Engines & Sim", "color": "#f97316", "icon": "🎮"},
    "gis": {"name": "Sistemas Geoespaciales (GIS)", "floor": 4, "zone": "Map Room & Cartografía", "color": "#14b8a6", "icon": "🗺️"},
    "healthcare": {"name": "Salud & Bioinformática", "floor": 4, "zone": "Clínica & Análisis Médico", "color": "#06b6d4", "icon": "🏥"},
    "integrations": {"name": "Integraciones & APIs", "floor": 2, "zone": "API Bridge & Middleware", "color": "#6366f1", "icon": "🔌"},
    "marketing": {"name": "Marketing & Crecimiento", "floor": 1, "zone": "Growth & Virality Lab", "color": "#e11d48", "icon": "🚀"},
    "paid-media": {"name": "Paid Media & Ads", "floor": 1, "zone": "Ad Ops & Campaign Room", "color": "#f59e0b", "icon": "📊"},
    "product": {"name": "Producto & Innovación", "floor": 3, "zone": "Product War Room", "color": "#a855f7", "icon": "💡"},
    "project-management": {"name": "Gestión de Proyectos", "floor": 3, "zone": "Scrum & Roadmap Station", "color": "#3b82f6", "icon": "📋"},
    "research": {"name": "I+D e Inteligencia", "floor": 4, "zone": "Data Science & Think Tank", "color": "#9333ea", "icon": "🔬"},
    "sales": {"name": "Ventas & Negocios", "floor": 1, "zone": "Sales Floor & Closers", "color": "#22c55e", "icon": "🤝"},
    "security": {"name": "Ciberseguridad & Ops", "floor": 2, "zone": "Cyber Defense & NOC", "color": "#ef4444", "icon": "🛡️"},
    "spatial-computing": {"name": "Computación Espacial & XR", "floor": 3, "zone": "VR/AR Holographic Lab", "color": "#d946ef", "icon": "🥽"},
    "specialized": {"name": "Especialistas de Alto Nivel", "floor": 5, "zone": "Executive Advisory", "color": "#eab308", "icon": "⭐"},
    "strategy": {"name": "Estrategia & Dirección", "floor": 5, "zone": "Boardroom & CEO Suite", "color": "#f43f5e", "icon": "♟️"},
    "support": {"name": "Soporte & Éxito del Cliente", "floor": 1, "zone": "Customer Ops & Care", "color": "#059669", "icon": "🎧"},
    "testing": {"name": "QA & Auditoría de Calidad", "floor": 2, "zone": "Stress Testing & Test Rig", "color": "#64748b", "icon": "🧪"},
}

agents = []
summary_list = []
dept_counts = {}

# Sprite variations pool to give each agent unique hair, skin, clothes
HAIR_COLORS = ["#2d1b00", "#111827", "#78350f", "#b45309", "#d97706", "#64748b", "#cbd5e1", "#dc2626", "#4f46e5", "#0284c7"]
SKIN_COLORS = ["#ffd7ba", "#fcd5ce", "#f8edeb", "#f1a7a0", "#c58f68", "#9c6644", "#7f4f24", "#d4a373"]
SHIRT_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1", "#475569", "#06b6d4"]
HAIR_STYLES = ["short", "curly", "long", "ponytail", "parted", "spiky", "bald", "beanie", "afro", "bob"]
ACCESSORIES = ["none", "glasses", "headset", "beard", "laptop", "coffee", "badge", "tablet"]

agent_counter = 0

for root, dirs, files in os.walk(repo_dir):
    rel_root = os.path.relpath(root, repo_dir)
    if any(p in rel_root for p in ['.git', 'examples', 'scripts', '.github']):
        continue
    dept = rel_root.split(os.sep)[0] if rel_root != '.' else 'strategy'
    
    for f in sorted(files):
        if not f.endswith('.md'):
            continue
        if f in ['README.md', 'CONTRIBUTING.md', 'LICENSE.md', 'EXECUTIVE-BRIEF.md', 'QUICKSTART.md']:
            continue
        filepath = os.path.join(root, f)
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
            
        frontmatter_match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        meta = {}
        body = content
        if frontmatter_match:
            fm_text = frontmatter_match.group(1)
            body = content[frontmatter_match.end():].strip()
            for line in fm_text.split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    meta[k.strip().lower()] = v.strip().strip('"\'')
        
        name = meta.get('name', '').strip()
        if not name:
            h1_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
            if h1_match:
                name = h1_match.group(1).strip()
            else:
                raw_base = f.replace('.md', '')
                # Clean prefix like 'marketing-' or 'specialized-'
                if raw_base.startswith(dept + '-'):
                    raw_base = raw_base[len(dept)+1:]
                name = raw_base.replace('-', ' ').title()
                
        # Clean up agent title
        name = re.sub(r'\s+Agent$', '', name, flags=re.IGNORECASE).strip()
        if not name:
            name = f.replace('.md', '').replace('-', ' ').title()
            
        # Parse sections
        sections = {}
        curr_sec = "Overview"
        curr_text = []
        for line in body.split('\n'):
            if line.startswith('## '):
                if curr_text:
                    sections[curr_sec] = '\n'.join(curr_text).strip()
                curr_sec = line[3:].strip()
                curr_text = []
            elif line.startswith('# ') and curr_sec == "Overview":
                pass # Title line
            else:
                curr_text.append(line)
        if curr_text:
            sections[curr_sec] = '\n'.join(curr_text).strip()
            
        dept_info = DEPT_THEMES.get(dept, {"name": dept.title(), "floor": 1, "zone": "Oficinas Generales", "color": "#6366f1", "icon": "💼"})
        
        agent_id = f.replace('.md', '')
        
        # Description
        desc = meta.get('description', '').strip()
        if not desc:
            for candidate_sec in ['Identity & Role Definition', 'Overview', 'Role & Purpose', 'Mission']:
                if candidate_sec in sections and sections[candidate_sec]:
                    first_p = sections[candidate_sec].split('\n\n')[0].replace('\n', ' ')
                    if len(first_p) > 20:
                        desc = first_p
                        break
        if not desc:
            desc = f"Especialista en {dept_info['name']} dedicado a impulsar el crecimiento y excelencia de AI_Criterio."
            
        # Vibe
        vibe = meta.get('vibe', '').strip()
        if not vibe:
            vibe = f"Enfocado en resultados de alto impacto en {dept_info['name']}"
            
        # Tools
        tools = meta.get('tools', 'Análisis, Python, WebSearch, Prompts, Estrategia').strip()
        
        # Sprite generation seed attributes
        agent_counter += 1
        h_color = HAIR_COLORS[agent_counter % len(HAIR_COLORS)]
        s_color = SKIN_COLORS[(agent_counter * 3) % len(SKIN_COLORS)]
        c_color = meta.get('color', SHIRT_COLORS[(agent_counter * 7) % len(SHIRT_COLORS)])
        if not c_color.startswith('#'):
            # Convert named color to hex if needed
            named_map = {
                'green': '#10b981', 'blue': '#0284c7', 'red': '#ef4444', 'purple': '#8b5cf6',
                'pink': '#ec4899', 'yellow': '#eab308', 'orange': '#f97316', 'teal': '#14b8a6',
                'cyan': '#06b6d4', 'slate': '#64748b', 'gray': '#6b7280', 'indigo': '#6366f1'
            }
            c_color = named_map.get(c_color.lower(), dept_info['color'])
            
        h_style = HAIR_STYLES[(agent_counter * 5) % len(HAIR_STYLES)]
        acc = ACCESSORIES[(agent_counter * 2) % len(ACCESSORIES)]
        
        # Live status thoughts for AI_Criterio
        sample_thoughts = [
            f"Analizando métricas clave para AI_Criterio en el departamento de {dept_info['name']}.",
            f"Optimizando flujos de trabajo inteligentes para clientes de AI_Criterio.",
            f"Auditando calidad y criterios de decisión en proyectos de IA.",
            f"Preparando informe estratégico con metodología de vanguardia.",
            f"Diseñando solución escalable para la cartera de AI_Criterio."
        ]
        thought = sample_thoughts[agent_counter % len(sample_thoughts)]
        
        agent_obj = {
            'id': agent_id,
            'name': name,
            'department': dept,
            'department_name': dept_info['name'],
            'floor': dept_info['floor'],
            'zone': dept_info['zone'],
            'file': os.path.relpath(filepath, repo_dir).replace('\\', '/'),
            'emoji': meta.get('emoji', dept_info.get('icon', '🤖')),
            'color': c_color,
            'vibe': vibe,
            'description': desc,
            'tools': tools,
            'sections': sections,
            'thought': thought,
            'sprite': {
                'hair_color': h_color,
                'skin_color': s_color,
                'shirt_color': c_color,
                'hair_style': h_style,
                'accessory': acc
            }
        }
        agents.append(agent_obj)
        
        # Lightweight summary
        summary_list.append({
            'id': agent_id,
            'name': name,
            'department': dept,
            'department_name': dept_info['name'],
            'floor': dept_info['floor'],
            'zone': dept_info['zone'],
            'emoji': agent_obj['emoji'],
            'color': c_color,
            'vibe': vibe,
            'description': desc[:140] + ('...' if len(desc) > 140 else ''),
            'tools': tools,
            'thought': thought,
            'sprite': agent_obj['sprite']
        })
        dept_counts[dept] = dept_counts.get(dept, 0) + 1

full_db = {
    "total_agents": len(agents),
    "departments": DEPT_THEMES,
    "department_counts": dept_counts,
    "agents": agents
}

summary_db = {
    "total_agents": len(summary_list),
    "departments": DEPT_THEMES,
    "department_counts": dept_counts,
    "agents": summary_list
}

with open(output_file, 'w', encoding='utf-8') as out:
    json.dump(full_db, out, ensure_ascii=False, indent=2)

with open(summary_file, 'w', encoding='utf-8') as out:
    json.dump(summary_db, out, ensure_ascii=False)

print(f"Generated DB with {len(agents)} agents.")
print(f"Full DB size: {os.path.getsize(output_file):,} bytes")
print(f"Summary size: {os.path.getsize(summary_file):,} bytes")
