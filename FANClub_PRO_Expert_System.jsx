import React, { useState, useEffect, useRef, useMemo } from 'react';

// ==================== DATA LAYER ====================
const STRUCTURES_DB = [
  { id: 1, name: "Babel'zin", type: "accueil", region: "bruxelles", commune: "Auderghem", lat: 50.8167, lng: 4.4333, capacity: 30, currentLoad: 0.65, specialties: ["isolement", "créativité", "lien-social"], ageRange: [18, 99], accessibility: ["pmr", "public"], contact: "0492/44.88.70", urgency: false, waitTime: 0 },
  { id: 2, name: "Club Norwest", type: "accueil", region: "bruxelles", commune: "Jette", lat: 50.8833, lng: 4.3333, capacity: 25, currentLoad: 0.72, specialties: ["isolement", "groupes-parole", "activités"], ageRange: [18, 99], accessibility: ["pmr", "public"], contact: "02/777.77.77", urgency: false, waitTime: 0 },
  { id: 3, name: "SSM Le Grès", type: "ssm", region: "bruxelles", commune: "Auderghem", lat: 50.8200, lng: 4.4300, capacity: 150, currentLoad: 0.89, specialties: ["enfants", "adultes", "famille", "logopédie"], ageRange: [0, 99], accessibility: ["pmr"], contact: "02/660.50.73", urgency: false, waitTime: 14 },
  { id: 4, name: "L'Autre Lieu", type: "alternative", region: "bruxelles", commune: "Bruxelles", lat: 50.8503, lng: 4.3517, capacity: 20, currentLoad: 0.55, specialties: ["alternatives", "communautaire", "amikaro"], ageRange: [18, 99], accessibility: ["public"], contact: "02/230.62.60", urgency: false, waitTime: 7 },
  { id: 5, name: "Den Teirling", type: "accueil", region: "bruxelles", commune: "Ixelles", lat: 50.8333, lng: 4.3667, capacity: 35, currentLoad: 0.68, specialties: ["activités-jour", "contacts-sociaux"], ageRange: [18, 99], accessibility: ["pmr", "nl"], contact: "denteirling.be", urgency: false, waitTime: 0 },
  { id: 6, name: "Équipe Mobile 2A Bruxelles", type: "mobile", region: "bruxelles", commune: "Bruxelles", lat: 50.8503, lng: 4.3517, capacity: 50, currentLoad: 0.92, specialties: ["crise", "urgence", "domicile"], ageRange: [18, 65], accessibility: ["mobile"], contact: "02/XXX.XX.XX", urgency: true, waitTime: 0 },
  { id: 7, name: "Équipe Mobile 2B Bruxelles", type: "mobile", region: "bruxelles", commune: "Bruxelles", lat: 50.8503, lng: 4.3517, capacity: 80, currentLoad: 0.78, specialties: ["réhabilitation", "longue-durée", "domicile"], ageRange: [18, 65], accessibility: ["mobile"], contact: "02/XXX.XX.XX", urgency: false, waitTime: 3 },
  { id: 8, name: "Club Théo Van Gogh", type: "club-therapeutique", region: "wallonie", commune: "Gosselies", lat: 50.4667, lng: 4.4333, capacity: 40, currentLoad: 0.60, specialties: ["stabilisation", "activités", "chronique"], ageRange: [18, 99], accessibility: ["pmr"], contact: "071/91.72.13", urgency: false, waitTime: 0 },
  { id: 9, name: "SSM Accolade", type: "ssm", region: "wallonie", commune: "Liège", lat: 50.6333, lng: 5.5667, capacity: 200, currentLoad: 0.85, specialties: ["adultes", "club-thérapeutique"], ageRange: [18, 99], accessibility: ["pmr"], contact: "ssmaccolade@isosl.be", urgency: false, waitTime: 21 },
  { id: 10, name: "CT Arlon", type: "club-therapeutique", region: "wallonie", commune: "Arlon", lat: 49.6833, lng: 5.8167, capacity: 30, currentLoad: 0.45, specialties: ["stabilisation", "rural"], ageRange: [18, 99], accessibility: [], contact: "063/22.68.90", urgency: false, waitTime: 0 },
];

const PATHOLOGIES_DB = [
  { id: "depression", name: "Dépression", severity: [1,2,3], indicators: ["humeur", "sommeil", "énergie", "appétit"], protocols: ["thérapie", "médication", "activités"] },
  { id: "anxiete", name: "Troubles anxieux", severity: [1,2,3], indicators: ["anxiété", "évitement", "panique", "phobies"], protocols: ["tcc", "relaxation", "exposition"] },
  { id: "psychose", name: "Troubles psychotiques", severity: [2,3], indicators: ["hallucinations", "délires", "désorganisation"], protocols: ["médication", "suivi-intensif", "réhabilitation"] },
  { id: "tca", name: "Troubles alimentaires", severity: [1,2,3], indicators: ["poids", "comportement-alimentaire", "image-corporelle"], protocols: ["pluridisciplinaire", "nutrition", "thérapie"] },
  { id: "addiction", name: "Addictions", severity: [1,2,3], indicators: ["consommation", "dépendance", "sevrage"], protocols: ["sevrage", "substitution", "thérapie"] },
  { id: "trauma", name: "Trauma / PTSD", severity: [1,2,3], indicators: ["flashbacks", "évitement", "hypervigilance"], protocols: ["emdr", "thérapie-trauma", "stabilisation"] },
  { id: "isolement", name: "Isolement social", severity: [1,2], indicators: ["contacts-sociaux", "solitude", "repli"], protocols: ["lieux-accueil", "activités-groupe", "accompagnement"] },
  { id: "bipolarite", name: "Troubles bipolaires", severity: [2,3], indicators: ["cycles", "manie", "dépression"], protocols: ["thymorégulateurs", "psychoéducation", "suivi"] },
];

const URGENCY_LEVELS = [
  { level: 0, name: "Prévention", color: "#10b981", action: "Orientation vers ressources communautaires" },
  { level: 1, name: "Léger", color: "#06b6d4", action: "SSM ambulatoire, délai acceptable" },
  { level: 2, name: "Modéré", color: "#f59e0b", action: "Prise en charge rapide recommandée" },
  { level: 3, name: "Sévère", color: "#ef4444", action: "Équipe mobile ou urgences" },
  { level: 4, name: "Critique", color: "#dc2626", action: "Urgences psychiatriques immédiates" },
];

// ==================== UTILITY FUNCTIONS ====================
const calculateMatchScore = (patient, structure) => {
  let score = 0;
  const weights = { specialty: 40, location: 20, availability: 25, accessibility: 15 };
  
  // Specialty match
  const specialtyMatch = patient.needs?.filter(n => structure.specialties.includes(n)).length || 0;
  score += (specialtyMatch / Math.max(patient.needs?.length || 1, 1)) * weights.specialty;
  
  // Age compatibility
  if (patient.age >= structure.ageRange[0] && patient.age <= structure.ageRange[1]) {
    score += 10;
  }
  
  // Availability (inverse of load)
  score += (1 - structure.currentLoad) * weights.availability;
  
  // Wait time penalty
  score -= Math.min(structure.waitTime / 7, 10);
  
  return Math.max(0, Math.min(100, score));
};

const getUrgencyLevel = (indicators) => {
  const criticalIndicators = ['suicidaire', 'violence', 'psychose-aigue', 'sevrage-grave'];
  const severeIndicators = ['crise', 'décompensation', 'automutilation'];
  const moderateIndicators = ['aggravation', 'isolement-severe', 'rupture-soins'];
  
  if (indicators.some(i => criticalIndicators.includes(i))) return 4;
  if (indicators.some(i => severeIndicators.includes(i))) return 3;
  if (indicators.some(i => moderateIndicators.includes(i))) return 2;
  if (indicators.length > 3) return 1;
  return 0;
};

// ==================== COMPONENTS ====================

// Animated Background - Command Center Style
const CommandCenterBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let gridOffset = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const drawGrid = () => {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Animated grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = gridOffset % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = gridOffset % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Radar sweep effect
      const centerX = canvas.width * 0.85;
      const centerY = canvas.height * 0.15;
      const radius = 150;
      const angle = (Date.now() / 2000) % (Math.PI * 2);
      
      const gradient = ctx.createConicGradient(angle, centerX, centerY);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
      gradient.addColorStop(0.1, 'rgba(139, 92, 246, 0)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Radar circles
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      for (let r = 30; r <= radius; r += 30) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Data streams
      for (let i = 0; i < 5; i++) {
        const streamY = (Date.now() / 50 + i * 200) % canvas.height;
        ctx.fillStyle = `rgba(6, 182, 212, ${0.1 + Math.random() * 0.1})`;
        ctx.fillRect(0, streamY, canvas.width, 1);
      }
      
      gridOffset += 0.2;
      animationId = requestAnimationFrame(drawGrid);
    };
    
    resize();
    drawGrid();
    window.addEventListener('resize', resize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

// Network Graph Visualization
const NetworkGraph = ({ structures, selectedNode, onNodeSelect }) => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  
  useEffect(() => {
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create nodes with positions
    const typeGroups = {
      'ssm': { angle: 0, radius: 120, color: '#8b5cf6' },
      'accueil': { angle: Math.PI / 3, radius: 140, color: '#06b6d4' },
      'club-therapeutique': { angle: 2 * Math.PI / 3, radius: 130, color: '#10b981' },
      'mobile': { angle: Math.PI, radius: 100, color: '#f59e0b' },
      'alternative': { angle: 4 * Math.PI / 3, radius: 150, color: '#ec4899' },
    };
    
    const newNodes = structures.map((s, i) => {
      const group = typeGroups[s.type] || typeGroups['accueil'];
      const angleOffset = (i % 5) * 0.3;
      const radiusOffset = (i % 3) * 20;
      
      return {
        ...s,
        x: centerX + Math.cos(group.angle + angleOffset) * (group.radius + radiusOffset),
        y: centerY + Math.sin(group.angle + angleOffset) * (group.radius + radiusOffset),
        color: group.color,
        size: 8 + (s.capacity / 30)
      };
    });
    
    setNodes(newNodes);
  }, [structures]);
  
  // Generate connections based on region and type compatibility
  const connections = useMemo(() => {
    const conns = [];
    nodes.forEach((n1, i) => {
      nodes.forEach((n2, j) => {
        if (i < j) {
          const sameRegion = n1.region === n2.region;
          const compatible = n1.type !== n2.type;
          if (sameRegion && compatible && Math.random() > 0.5) {
            conns.push({ from: n1, to: n2, strength: Math.random() });
          }
        }
      });
    });
    return conns;
  }, [nodes]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Connections */}
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke={`rgba(139, 92, 246, ${conn.strength * 0.3})`}
          strokeWidth={conn.strength * 2}
        />
      ))}
      
      {/* Nodes */}
      {nodes.map((node) => (
        <g key={node.id} onClick={() => onNodeSelect(node)} className="cursor-pointer">
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size + 5}
            fill={node.color}
            opacity={0.2}
            filter="url(#glow)"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={node.color}
            stroke={selectedNode?.id === node.id ? '#fff' : 'transparent'}
            strokeWidth={2}
            className="transition-all duration-300 hover:opacity-80"
          />
          <text
            x={node.x}
            y={node.y + node.size + 15}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize="9"
            className="pointer-events-none"
          >
            {node.name.substring(0, 15)}
          </text>
        </g>
      ))}
      
      {/* Legend */}
      <g transform="translate(10, 360)">
        {Object.entries({ 'SSM': '#8b5cf6', 'Accueil': '#06b6d4', 'Club Th.': '#10b981', 'Mobile': '#f59e0b', 'Alt.': '#ec4899' }).map(([label, color], i) => (
          <g key={label} transform={`translate(${i * 80}, 0)`}>
            <circle cx={6} cy={6} r={5} fill={color} />
            <text x={16} y={10} fill="#9ca3af" fontSize="10">{label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// Heat Map Component
const HeatMap = ({ data, title }) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];
  
  // Generate synthetic data if not provided
  const heatData = useMemo(() => {
    return hours.map((_, h) => 
      days.map((_, d) => {
        const base = Math.sin((h + d) / 3) * 0.3 + 0.5;
        const weekend = d >= 5 ? 0.7 : 1;
        const peak = (h >= 2 && h <= 4) ? 1.2 : 1;
        return Math.min(1, base * weekend * peak + Math.random() * 0.2);
      })
    );
  }, []);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-400 mb-3">{title}</h4>
      <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(7, 1fr)` }}>
        <div></div>
        {days.map(d => <div key={d} className="text-xs text-gray-500 text-center">{d}</div>)}
        {hours.map((hour, h) => (
          <React.Fragment key={hour}>
            <div className="text-xs text-gray-500 pr-2">{hour}</div>
            {days.map((_, d) => {
              const value = heatData[h][d];
              const color = value > 0.8 ? 'bg-red-500' : value > 0.6 ? 'bg-amber-500' : value > 0.4 ? 'bg-emerald-500' : 'bg-cyan-500';
              return (
                <div
                  key={d}
                  className={`h-6 rounded ${color} transition-opacity hover:opacity-80`}
                  style={{ opacity: 0.3 + value * 0.7 }}
                  title={`${(value * 100).toFixed(0)}% de charge`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Gauge Component
const Gauge = ({ value, max = 100, label, color = 'violet', size = 120 }) => {
  const percentage = (value / max) * 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 1.5; // 270 degrees
  const offset = circumference - (percentage / 100) * circumference;
  
  const colors = {
    violet: '#8b5cf6',
    cyan: '#06b6d4',
    emerald: '#10b981',
    amber: '#f59e0b',
    pink: '#ec4899',
    red: '#ef4444'
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size * 0.75} className="-rotate-[135deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset + circumference * 0.25}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ filter: `drop-shadow(0 0 6px ${colors[color]})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );
};

// Alert Panel
const AlertPanel = ({ alerts }) => (
  <div className="space-y-2 max-h-64 overflow-y-auto">
    {alerts.map((alert, i) => (
      <div
        key={i}
        className={`p-3 rounded-lg border-l-4 ${
          alert.level === 'critical' ? 'bg-red-500/10 border-red-500' :
          alert.level === 'warning' ? 'bg-amber-500/10 border-amber-500' :
          'bg-cyan-500/10 border-cyan-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{alert.title}</span>
          <span className="text-xs text-gray-400">{alert.time}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
      </div>
    ))}
  </div>
);

// Patient Intake Form with AI Analysis
const PatientIntake = ({ onAnalysis }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    region: 'bruxelles',
    urgency: [],
    symptoms: [],
    history: [],
    preferences: [],
    mobility: true,
    language: 'fr'
  });
  
  const symptomOptions = [
    { id: 'depression', label: '😔 Humeur dépressive' },
    { id: 'anxiete', label: '😰 Anxiété' },
    { id: 'isolement', label: '🏠 Isolement social' },
    { id: 'sommeil', label: '😴 Troubles du sommeil' },
    { id: 'psychose', label: '🌀 Symptômes psychotiques' },
    { id: 'addiction', label: '🍷 Addictions' },
    { id: 'tca', label: '🍽️ Troubles alimentaires' },
    { id: 'trauma', label: '💔 Traumatisme' },
    { id: 'automutilation', label: '⚠️ Automutilation' },
    { id: 'suicidaire', label: '🆘 Idées suicidaires' },
  ];
  
  const urgencyIndicators = [
    { id: 'crise', label: 'En crise actuellement' },
    { id: 'aggravation', label: 'Aggravation récente' },
    { id: 'rupture-soins', label: 'Rupture de soins' },
    { id: 'premier-episode', label: 'Premier épisode' },
  ];

  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const runAnalysis = () => {
    const urgencyLevel = getUrgencyLevel([...formData.urgency, ...formData.symptoms]);
    const needs = formData.symptoms.map(s => {
      if (s === 'isolement') return 'lien-social';
      if (s === 'addiction') return 'addictions';
      return s;
    });
    
    const patient = {
      ...formData,
      age: parseInt(formData.age) || 35,
      needs,
      urgencyLevel
    };
    
    // Calculate matches
    const matches = STRUCTURES_DB
      .filter(s => s.region === formData.region || formData.region === 'all')
      .map(s => ({
        structure: s,
        score: calculateMatchScore(patient, s),
        available: s.currentLoad < 0.9
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    onAnalysis({ patient, urgencyLevel, matches, timestamp: new Date() });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Âge</label>
          <input
            type="number"
            value={formData.age}
            onChange={e => setFormData({...formData, age: e.target.value})}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            placeholder="Âge"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Genre</label>
          <select
            value={formData.gender}
            onChange={e => setFormData({...formData, gender: e.target.value})}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">-</option>
            <option value="f">Femme</option>
            <option value="m">Homme</option>
            <option value="x">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Région</label>
          <select
            value={formData.region}
            onChange={e => setFormData({...formData, region: e.target.value})}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="bruxelles">Bruxelles</option>
            <option value="wallonie">Wallonie</option>
            <option value="all">Toutes régions</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-2">Symptômes / Problématiques</label>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => toggleItem('symptoms', opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                formData.symptoms.includes(opt.id)
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-2">Indicateurs d'urgence</label>
        <div className="flex flex-wrap gap-2">
          {urgencyIndicators.map(ind => (
            <button
              key={ind.id}
              onClick={() => toggleItem('urgency', ind.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                formData.urgency.includes(ind.id)
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={runAnalysis}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <span>🔍</span>
        <span>Analyser & Recommander</span>
      </button>
    </div>
  );
};

// Analysis Results Panel
const AnalysisResults = ({ analysis }) => {
  if (!analysis) return null;
  
  const urgencyInfo = URGENCY_LEVELS[analysis.urgencyLevel];

  return (
    <div className="space-y-6">
      {/* Urgency Banner */}
      <div 
        className="p-4 rounded-xl border-2"
        style={{ 
          borderColor: urgencyInfo.color,
          backgroundColor: `${urgencyInfo.color}20`
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold" style={{ color: urgencyInfo.color }}>
            Niveau {analysis.urgencyLevel}: {urgencyInfo.name}
          </span>
          <span className="text-xs text-gray-400">
            {analysis.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm text-gray-300">{urgencyInfo.action}</p>
      </div>

      {/* Recommended Structures */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">
          🎯 Structures recommandées
        </h4>
        <div className="space-y-3">
          {analysis.matches.map((match, i) => (
            <div
              key={match.structure.id}
              className={`p-4 rounded-lg border ${
                i === 0 ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 bg-gray-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {i === 0 && <span className="text-amber-400">⭐</span>}
                  <span className="font-medium text-white">{match.structure.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                      style={{ width: `${match.score}%` }}
                    />
                  </div>
                  <span className="text-sm text-cyan-400 font-medium">{match.score.toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>📍 {match.structure.commune}</span>
                <span>📞 {match.structure.contact}</span>
                {match.structure.waitTime > 0 && (
                  <span className="text-amber-400">⏱️ ~{match.structure.waitTime}j d'attente</span>
                )}
                {!match.available && (
                  <span className="text-red-400">⚠️ Charge élevée</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {match.structure.specialties.slice(0, 4).map(s => (
                  <span key={s} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="py-2 px-4 bg-violet-500/20 border border-violet-500/50 rounded-lg text-violet-300 text-sm hover:bg-violet-500/30 transition-colors">
          📋 Générer fiche orientation
        </button>
        <button className="py-2 px-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
          📧 Envoyer aux structures
        </button>
      </div>
    </div>
  );
};

// Decision Tree Component
const DecisionTree = () => {
  const [currentNode, setCurrentNode] = useState('start');
  
  const tree = {
    start: {
      question: "La personne présente-t-elle un danger immédiat pour elle-même ou autrui ?",
      options: [
        { label: "Oui", next: "urgence", color: "red" },
        { label: "Non", next: "stabilite", color: "green" }
      ]
    },
    urgence: {
      question: "Type de danger identifié ?",
      options: [
        { label: "Idées suicidaires actives", next: "suicide", color: "red" },
        { label: "Comportement violent", next: "violence", color: "amber" },
        { label: "Décompensation psychotique", next: "psychose", color: "amber" }
      ]
    },
    stabilite: {
      question: "La personne a-t-elle un suivi actuel ?",
      options: [
        { label: "Oui, suivi en cours", next: "renforcer", color: "cyan" },
        { label: "Non, jamais de suivi", next: "nouveau", color: "violet" },
        { label: "Rupture de soins", next: "reprise", color: "amber" }
      ]
    },
    suicide: {
      result: true,
      title: "🆘 Urgence Suicidaire",
      actions: [
        "Appeler le 112 ou accompagner aux urgences",
        "Ne pas laisser la personne seule",
        "Centre Prévention Suicide : 0800 32 123",
        "Équipe mobile de crise si disponible"
      ],
      level: 4
    },
    violence: {
      result: true,
      title: "⚠️ Risque de Violence",
      actions: [
        "Évaluer la sécurité de l'environnement",
        "Contacter l'équipe mobile 2A",
        "Police si nécessaire (101)",
        "Hospitalisation sous contrainte si critères remplis"
      ],
      level: 4
    },
    psychose: {
      result: true,
      title: "🔴 Décompensation Psychotique",
      actions: [
        "Équipe mobile 2A en priorité",
        "Éviter les stimulations excessives",
        "Contacter le psychiatre référent si connu",
        "Hospitalisation à considérer"
      ],
      level: 3
    },
    renforcer: {
      result: true,
      title: "✅ Renforcement du Suivi",
      actions: [
        "Contacter le référent actuel",
        "Évaluer besoin d'intensification",
        "Proposer ressources complémentaires (clubs, activités)",
        "Réévaluer dans 2-4 semaines"
      ],
      level: 1
    },
    nouveau: {
      result: true,
      title: "🆕 Nouvelle Prise en Charge",
      actions: [
        "Orienter vers SSM de proximité",
        "Proposer lieu d'accueil en attendant (Babel'zin, Norwest...)",
        "Évaluer éligibilité psychologue 1ère ligne",
        "Fournir numéros d'écoute"
      ],
      level: 1
    },
    reprise: {
      result: true,
      title: "🔄 Reprise de Soins",
      actions: [
        "Contacter ancienne structure si possible",
        "Équipe mobile 2B pour accompagnement",
        "Évaluer raisons de la rupture",
        "Construire nouveau projet de soins adapté"
      ],
      level: 2
    }
  };
  
  const current = tree[currentNode];
  
  const reset = () => setCurrentNode('start');

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🌳</span> Arbre Décisionnel
        </h3>
        {currentNode !== 'start' && (
          <button onClick={reset} className="text-xs text-gray-400 hover:text-white">
            ↺ Recommencer
          </button>
        )}
      </div>
      
      {current.result ? (
        <div>
          <div 
            className="p-4 rounded-lg mb-4"
            style={{ 
              backgroundColor: `${URGENCY_LEVELS[current.level].color}20`,
              borderLeft: `4px solid ${URGENCY_LEVELS[current.level].color}`
            }}
          >
            <h4 className="text-lg font-bold text-white mb-2">{current.title}</h4>
            <p className="text-sm text-gray-400">
              Niveau: {URGENCY_LEVELS[current.level].name}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Actions recommandées :</p>
            {current.actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-cyan-400">→</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            className="mt-6 w-full py-2 bg-gray-800 rounded-lg text-gray-300 text-sm hover:bg-gray-700"
          >
            Nouvelle évaluation
          </button>
        </div>
      ) : (
        <div>
          <p className="text-white mb-6">{current.question}</p>
          <div className="space-y-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setCurrentNode(opt.next)}
                className={`w-full p-4 rounded-lg text-left transition-all hover:scale-[1.02] ${
                  opt.color === 'red' ? 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30' :
                  opt.color === 'amber' ? 'bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30' :
                  opt.color === 'green' ? 'bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30' :
                  opt.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500/30' :
                  'bg-violet-500/20 border border-violet-500/50 hover:bg-violet-500/30'
                }`}
              >
                <span className="text-white">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Protocol Database
const ProtocolDatabase = () => {
  const [search, setSearch] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  
  const protocols = [
    {
      id: 1,
      title: "Évaluation du risque suicidaire",
      category: "urgence",
      tags: ["suicide", "crise", "urgence"],
      steps: [
        "Établir un contact sécurisant et empathique",
        "Poser la question directement : 'Avez-vous des idées de vous faire du mal ?'",
        "Évaluer : idéation, plan, moyens, antécédents",
        "Utiliser l'échelle RUD (Risque-Urgence-Dangerosité)",
        "Déterminer le niveau de surveillance requis",
        "Documenter et transmettre à l'équipe"
      ]
    },
    {
      id: 2,
      title: "Accueil première demande",
      category: "accueil",
      tags: ["nouveau", "intake", "orientation"],
      steps: [
        "Accueil bienveillant, sans jugement",
        "Recueil de la demande manifeste",
        "Exploration du contexte et des besoins",
        "Présentation des ressources disponibles",
        "Co-construction du premier pas",
        "Planification du suivi ou de l'orientation"
      ]
    },
    {
      id: 3,
      title: "Gestion de crise en équipe mobile",
      category: "mobile",
      tags: ["crise", "domicile", "intervention"],
      steps: [
        "Évaluation téléphonique préalable",
        "Intervention en binôme",
        "Sécurisation de l'environnement",
        "Évaluation clinique sur place",
        "Désescalade et stabilisation",
        "Plan de crise et relais"
      ]
    },
    {
      id: 4,
      title: "Orientation vers lieu d'accueil",
      category: "orientation",
      tags: ["babel'zin", "norwest", "lien-social"],
      steps: [
        "Évaluer les besoins sociaux et relationnels",
        "Présenter les différentes options (Babel'zin, Norwest, etc.)",
        "Accompagner physiquement si possible la première fois",
        "Fournir les informations pratiques (horaires, accès)",
        "Prévoir un suivi de l'intégration",
        "Maintenir le lien avec la structure d'origine"
      ]
    }
  ];
  
  const filtered = protocols.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un protocole..."
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white text-sm"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map(protocol => (
          <div key={protocol.id}>
            <button
              onClick={() => setSelectedProtocol(selectedProtocol?.id === protocol.id ? null : protocol)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedProtocol?.id === protocol.id 
                  ? 'bg-violet-500/20 border border-violet-500/50' 
                  : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white text-sm">{protocol.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  protocol.category === 'urgence' ? 'bg-red-500/20 text-red-300' :
                  protocol.category === 'accueil' ? 'bg-cyan-500/20 text-cyan-300' :
                  protocol.category === 'mobile' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {protocol.category}
                </span>
              </div>
            </button>
            
            {selectedProtocol?.id === protocol.id && (
              <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <div className="flex flex-wrap gap-1 mb-4">
                  {protocol.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <ol className="space-y-2">
                  {protocol.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard
export default function ExpertSystem() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [systemTime, setSystemTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const alerts = [
    { level: 'critical', title: 'Capacité critique', message: 'Équipe Mobile 2A Bruxelles à 92% de charge', time: '14:23' },
    { level: 'warning', title: 'Délai d\'attente', message: 'SSM Accolade: délai moyen passé à 21 jours', time: '13:45' },
    { level: 'info', title: 'Nouveau partenariat', message: 'Convention signée avec CPAS Auderghem', time: '11:30' },
    { level: 'warning', title: 'Fermeture exceptionnelle', message: 'Club Norwest fermé le 15/01 (formation)', time: '09:15' },
  ];
  
  const modules = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'intake', icon: '🎯', label: 'Intake & Matching' },
    { id: 'network', icon: '🔗', label: 'Réseau' },
    { id: 'decision', icon: '🌳', label: 'Arbre Décisionnel' },
    { id: 'protocols', icon: '📋', label: 'Protocoles' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <CommandCenterBackground />
      
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-bold">
                  FC
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">FANClub <span className="text-violet-400">PRO</span></h1>
                <p className="text-xs text-gray-500">Intelligence Center v2.0</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-700 mx-2" />
            
            <nav className="flex items-center gap-1">
              {modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    activeModule === mod.id
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span>{mod.icon}</span>
                  <span className="hidden lg:inline">{mod.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-gray-400">Système actif</span>
              </div>
              <div className="text-gray-500">|</div>
              <div className="font-mono text-cyan-400">
                {systemTime.toLocaleTimeString('fr-BE')}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <span>🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {alerts.filter(a => a.level === 'critical').length}
                </span>
              </button>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-6">
        
        {/* DASHBOARD */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <Gauge value={87} label="Structures" color="violet" size={100} />
              </div>
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <Gauge value={73} label="Charge moy." color="cyan" size={100} />
              </div>
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <Gauge value={12} label="Délai moy. (j)" color="amber" size={100} />
              </div>
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <Gauge value={94} label="Dispo. (%)" color="emerald" size={100} />
              </div>
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <Gauge value={3} label="Alertes" color="red" size={100} />
              </div>
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <Gauge value={156} label="Orient./mois" color="pink" size={100} />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Network Preview */}
              <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>🔗</span> Réseau en temps réel
                  </h3>
                  <button 
                    onClick={() => setActiveModule('network')}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    Voir détails →
                  </button>
                </div>
                <div className="h-80">
                  <NetworkGraph 
                    structures={STRUCTURES_DB} 
                    selectedNode={selectedStructure}
                    onNodeSelect={setSelectedStructure}
                  />
                </div>
              </div>

              {/* Alerts Panel */}
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span>🚨</span> Alertes système
                </h3>
                <AlertPanel alerts={alerts} />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Heat Map */}
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <HeatMap title="📊 Charge hebdomadaire moyenne" />
              </div>

              {/* Quick Stats Table */}
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span>📋</span> Structures critiques
                </h3>
                <div className="space-y-3">
                  {STRUCTURES_DB.filter(s => s.currentLoad > 0.8).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.commune}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-sm font-bold ${s.currentLoad > 0.9 ? 'text-red-400' : 'text-amber-400'}`}>
                            {(s.currentLoad * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-gray-500">charge</p>
                        </div>
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${s.currentLoad > 0.9 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${s.currentLoad * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTAKE & MATCHING */}
        {activeModule === 'intake' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <span>🎯</span> Nouvelle demande - Matching IA
              </h3>
              <PatientIntake onAnalysis={setAnalysis} />
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <span>📊</span> Résultats d'analyse
              </h3>
              {analysis ? (
                <AnalysisResults analysis={analysis} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <span className="text-4xl mb-4 block">🔍</span>
                    <p>Remplissez le formulaire pour obtenir une analyse</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NETWORK */}
        {activeModule === 'network' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span>🔗</span> Cartographie du réseau
                </h3>
                <div className="h-96">
                  <NetworkGraph 
                    structures={STRUCTURES_DB} 
                    selectedNode={selectedStructure}
                    onNodeSelect={setSelectedStructure}
                  />
                </div>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {selectedStructure ? selectedStructure.name : 'Sélectionnez une structure'}
                </h3>
                {selectedStructure ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Type</p>
                        <p className="text-sm text-white capitalize">{selectedStructure.type}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Région</p>
                        <p className="text-sm text-white capitalize">{selectedStructure.region}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Capacité</p>
                        <p className="text-sm text-white">{selectedStructure.capacity} places</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Charge actuelle</p>
                        <p className={`text-sm font-bold ${selectedStructure.currentLoad > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {(selectedStructure.currentLoad * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Spécialités</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedStructure.specialties.map(s => (
                          <span key={s} className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Contact</p>
                      <p className="text-sm text-cyan-400">{selectedStructure.contact}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 bg-violet-500/20 border border-violet-500/50 rounded-lg text-violet-300 text-sm hover:bg-violet-500/30">
                        📞 Contacter
                      </button>
                      <button className="py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30">
                        📋 Fiche complète
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <p>Cliquez sur un nœud du graphe</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Structure List */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📋 Toutes les structures</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3 font-medium">Structure</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Localisation</th>
                      <th className="pb-3 font-medium">Charge</th>
                      <th className="pb-3 font-medium">Délai</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STRUCTURES_DB.map(s => (
                      <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="py-3 text-white font-medium">{s.name}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            s.type === 'ssm' ? 'bg-violet-500/20 text-violet-300' :
                            s.type === 'accueil' ? 'bg-cyan-500/20 text-cyan-300' :
                            s.type === 'mobile' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {s.type}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400">{s.commune}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  s.currentLoad > 0.9 ? 'bg-red-500' : 
                                  s.currentLoad > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${s.currentLoad * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{(s.currentLoad * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-400">
                          {s.waitTime > 0 ? `${s.waitTime}j` : '-'}
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => setSelectedStructure(s)}
                            className="text-violet-400 hover:text-violet-300 text-xs"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DECISION TREE */}
        {activeModule === 'decision' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            <DecisionTree />
            
            <div className="space-y-6">
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span>📞</span> Numéros d'urgence
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Centre Prévention Suicide', tel: '0800 32 123', color: 'pink' },
                    { name: 'Télé-Accueil', tel: '107', color: 'amber' },
                    { name: 'Urgences', tel: '112', color: 'red' },
                    { name: 'Police', tel: '101', color: 'cyan' },
                  ].map(n => (
                    <div key={n.tel} className={`p-4 rounded-lg bg-${n.color}-500/10 border border-${n.color}-500/30`}>
                      <p className={`text-xl font-bold text-${n.color}-400`}>{n.tel}</p>
                      <p className="text-sm text-gray-400">{n.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span>📊</span> Échelle RUD
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Risque</span>
                      <span className="text-white">Faible → Élevé</span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Urgence</span>
                      <span className="text-white">Différable → Immédiate</span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Dangerosité</span>
                      <span className="text-white">Contrôlée → Critique</span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROTOCOLS */}
        {activeModule === 'protocols' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <span>📋</span> Base de protocoles
              </h3>
              <ProtocolDatabase />
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span>🧠</span> Pathologies référencées
                </h3>
                <div className="space-y-2">
                  {PATHOLOGIES_DB.map(p => (
                    <div key={p.id} className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{p.name}</span>
                        <div className="flex gap-1">
                          {p.severity.map(s => (
                            <span 
                              key={s} 
                              className={`w-2 h-2 rounded-full ${
                                s === 1 ? 'bg-emerald-500' : s === 2 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.protocols.map(pr => (
                          <span key={pr} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">
                            {pr}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeModule === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid lg:grid-cols-4 gap-4">
              {[
                { label: 'Orientations ce mois', value: '156', change: '+12%', color: 'violet' },
                { label: 'Délai moyen', value: '8.3j', change: '-2j', color: 'cyan' },
                { label: 'Taux de satisfaction', value: '87%', change: '+3%', color: 'emerald' },
                { label: 'Urgences traitées', value: '23', change: '+5', color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                  <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <span className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</span>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Répartition par type</h3>
                <div className="space-y-4">
                  {[
                    { type: 'SSM', count: 65, total: 156, color: 'violet' },
                    { type: 'Lieux d\'accueil', count: 45, total: 156, color: 'cyan' },
                    { type: 'Équipes mobiles', count: 28, total: 156, color: 'amber' },
                    { type: 'Clubs thérap.', count: 18, total: 156, color: 'emerald' },
                  ].map(item => (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.type}</span>
                        <span className="text-white">{item.count}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${item.color}-500 rounded-full`}
                          style={{ width: `${(item.count / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                <HeatMap title="📈 Tendance hebdomadaire des demandes" />
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
