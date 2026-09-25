// Agents Manager: Database handler, filters, floor assignments, and AI_Criterio context
class AgentsManager {
    constructor() {
        this.agentsSummary = [];
        this.agentsFullDb = new Map();
        this.departments = {};
        this.departmentCounts = {};
        this.currentFloor = 1;
        this.selectedAgent = null;
        this.favorites = new Set(JSON.parse(localStorage.getItem('aicriterio_favorites') || '[]'));
        this.businessContext = this.loadBusinessContext();
        this.searchQuery = '';
        this.selectedDepartment = 'all';
    }

    loadBusinessContext() {
        if (window.CRITERIO_AI_UPDATED_CONTEXT) {
            return window.CRITERIO_AI_UPDATED_CONTEXT;
        }
        const saved = localStorage.getItem('aicriterio_business_context');
        if (saved) {
            try { return JSON.parse(saved); } catch(e) {}
        }
        return {
            companyName: "Criterio AI",
            domain: "gocriterio.com",
            founder: "John Santana Guio (Bogotá, Colombia)",
            clientWhatsApp: "+57 318 941 1010",
            tagline: "Inteligencia Artificial y Automatización con Criterio Riguroso",
            mission: "Resolver el trabajo operativo y comercial que nadie debería seguir haciendo a mano: catálogos de pedidos automáticos por WhatsApp y páginas web de ultra-rendimiento (<300KB) para gastronomía y empresas de Bogotá.",
            pillars: [
                "Catálogos de Pedidos por WhatsApp para Restaurantes y Gastronomía",
                "Carta Viva: Mantenimiento mensual ($200.000 COP/mes)",
                "Sitios Web Hub de Ultra-Rendimiento (LCP < 2.5s, peso < 300KB)",
                "Formación en Inteligencia Artificial ('The AI Operator')"
            ],
            targetAudience: "119 Negocios de comida de Bogotá con móvil y sin web propia",
            currentGoal: "Sprint 14 días (25-sep al 8-oct 2026): Vender Catálogos WhatsApp a $400.000 COP + Carta Viva ($200.000 COP/mes), desbloqueando gocriterio.com (Netlify Forms, enlaces WhatsApp reales y WCAG AA).",
            activeProjects: [
                "Reparar Netlify Forms en /briefing/ y enlaces a +57 318 941 1010",
                "Outreach Bogotá: 119 visitas presenciales y mensajes de permiso (Ley 2300)",
                "Reactivar 14 clientes existentes y cobrar cartera ($300k Cheddar 1997)",
                "Convertir gocriterio.com en HUB de 5 facetas (/catalogos/, /citas/, /paginas-web/, /formacion/, /portafolio/)",
                "Sistema de Diseño: Manrope 400, Martian Mono 400 y modo oscuro con acento cielo"
            ]
        };
    }

    saveBusinessContext(ctx) {
        this.businessContext = ctx;
        localStorage.setItem('aicriterio_business_context', JSON.stringify(ctx));
    }

    async init() {
        try {
            let data = null;

            // 1. Direct memory check (Zero CORS issues, works directly with file:/// or http://)
            if (window.AGENTS_SUMMARY_DATA) {
                data = window.AGENTS_SUMMARY_DATA;
            } else {
                // 2. Fallback to fetch if served over HTTP
                const res = await fetch('agents_summary.json');
                data = await res.json();
            }

            this.agentsSummary = data.agents || [];
            this.departments = data.departments || {};
            this.departmentCounts = data.department_counts || {};

            // Assign spatial desk coordinates for each agent on their floor
            this.assignFloorCoordinates();

            // Load full database
            this.loadFullDatabase();

            return true;
        } catch (error) {
            console.error("Error loading agents summary:", error);
            return false;
        }
    }

    async loadFullDatabase() {
        try {
            if (window.AGENTS_FULL_DATA && window.AGENTS_FULL_DATA.agents) {
                window.AGENTS_FULL_DATA.agents.forEach(agent => {
                    this.agentsFullDb.set(agent.id, agent);
                });
                console.log(`Loaded full database from memory: ${this.agentsFullDb.size} agents.`);
                return;
            }

            const res = await fetch('agents_database.json');
            const data = await res.json();
            if (data && data.agents) {
                data.agents.forEach(agent => {
                    this.agentsFullDb.set(agent.id, agent);
                });
                console.log(`Loaded full database via fetch: ${this.agentsFullDb.size} agents.`);
            }
        } catch (err) {
            console.warn("Could not load full DB in background, using summary fallback:", err);
        }
    }

    getAgentFull(id) {
        if (this.agentsFullDb.has(id)) {
            return this.agentsFullDb.get(id);
        }
        return this.agentsSummary.find(a => a.id === id);
    }

    assignFloorCoordinates() {
        // Virtual world dimension: 2000 x 1200
        const floorGroups = { 1: [], 2: [], 3: [], 4: [], 5: [] };
        this.agentsSummary.forEach(a => {
            const fl = a.floor || 1;
            if (floorGroups[fl]) floorGroups[fl].push(a);
        });

        Object.keys(floorGroups).forEach(flStr => {
            const fl = parseInt(flStr, 10);
            const list = floorGroups[fl];
            
            // Level Design Studio layout (Game Dev Architecture):
            // Floor 2 has 86 agents -> 11 columns, fits comfortably in rows 0-7 (Y: 180 to 745)
            // Floor 5 has 80 agents -> 10 columns, fits in rows 0-7 (Y: 180 to 745)
            // Floor 1 has 58 agents -> 9 columns, fits in rows 0-6 (Y: 180 to 675)
            // Floor 3 has 49 agents -> 8 columns, fits in rows 0-6 (Y: 180 to 675)
            // Floor 4 has 23 agents -> 6 columns, fits in rows 0-3 (Y: 180 to 415)
            let cols = 10;
            if (fl === 2) cols = 11;
            else if (fl === 5) cols = 10;
            else if (fl === 1) cols = 9;
            else if (fl === 3) cols = 8;
            else if (fl === 4) cols = 6;

            const startX = 230;
            const spacingX = 135;
            const startY = 180;
            const pairGap = 70; // intra-pod gap
            const aisleGap = 45; // inter-pod aisle

            list.forEach((agent, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);

                // Group rows into 2-desk pods (face-to-face team clusters)
                const podIndex = Math.floor(row / 2);
                const inPodRow = row % 2; // 0: top desk, 1: bottom desk

                // Central aisle divider in the middle of columns
                const halfCols = Math.floor(cols / 2);
                const aisleX = (col >= halfCols) ? 50 : 0;

                const deskX = startX + col * spacingX + aisleX;
                const deskY = startY + podIndex * (pairGap + aisleGap + 50) + inPodRow * pairGap;

                agent.deskX = deskX;
                agent.deskY = deskY;
                agent.currentX = deskX;
                agent.currentY = deskY;
                agent.isWandering = false;
                agent.wanderTarget = { x: deskX, y: deskY };
                agent.wanderWait = Math.random() * 300 + 100;
                agent.facing = inPodRow === 0 ? 'down' : 'up';
                agent.state = 'working';

                // Check if in 38 taskforce
                if (window.CRITERIO_TASKFORCE_MAP && window.CRITERIO_TASKFORCE_MAP.has(agent.id)) {
                    agent.isTaskforce = true;
                    agent.taskforceInfo = window.CRITERIO_TASKFORCE_MAP.get(agent.id);
                } else {
                    agent.isTaskforce = false;
                }
            });
        });
    }

    getAgentsOnFloor(floor) {
        if (floor === 'all') return this.agentsSummary;
        return this.agentsSummary.filter(a => a.floor === floor);
    }

    getFilteredAgents() {
        let list = this.agentsSummary;
        
        if (this.onlyTaskforce) {
            list = list.filter(a => a.isTaskforce);
        }

        if (this.currentFloor !== 'all') {
            list = list.filter(a => a.floor === this.currentFloor);
        }

        if (this.selectedDepartment !== 'all') {
            list = list.filter(a => a.department === this.selectedDepartment);
        }

        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase().trim();
            list = list.filter(a => 
                a.name.toLowerCase().includes(q) ||
                a.department.toLowerCase().includes(q) ||
                a.department_name.toLowerCase().includes(q) ||
                a.description.toLowerCase().includes(q) ||
                a.tools.toLowerCase().includes(q) ||
                a.vibe.toLowerCase().includes(q)
            );
        }

        return list;
    }

    toggleFavorite(agentId) {
        if (this.favorites.has(agentId)) {
            this.favorites.delete(agentId);
        } else {
            this.favorites.add(agentId);
        }
        localStorage.setItem('aicriterio_favorites', JSON.stringify(Array.from(this.favorites)));
    }

    isFavorite(agentId) {
        return this.favorites.has(agentId);
    }

    getFavoritesList() {
        return this.agentsSummary.filter(a => this.favorites.has(a.id));
    }
}

window.agentsManager = new AgentsManager();
