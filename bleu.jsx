import React, { useState, useEffect, useRef } from 'react';

// Graph Background Component - Obsidian Style
const GraphBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    let mouse = { x: null, y: null };
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createNodes = () => {
      nodes = [];
      const numNodes = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
        });
      }
    };
    
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 15, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node with glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw connections
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        
        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 * (1 - dist / 200)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    resize();
    createNodes();
    animate();
    
    window.addEventListener('resize', () => { resize(); createNodes(); });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

// Glowing Node Button
const NodeButton = ({ children, active, onClick, color = 'violet' }) => {
  const colors = {
    violet: 'from-violet-500 to-purple-600 shadow-violet-500/50',
    cyan: 'from-cyan-500 to-blue-600 shadow-cyan-500/50',
    pink: 'from-pink-500 to-rose-600 shadow-pink-500/50',
    emerald: 'from-emerald-500 to-green-600 shadow-emerald-500/50',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/50'
  };
  
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
        active 
          ? `bg-gradient-to-r ${colors[color]} text-white shadow-lg scale-105` 
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:scale-102 border border-gray-700/50'
      }`}
    >
      {active && (
        <span className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors[color]} blur-md opacity-50 -z-10`} />
      )}
      {children}
    </button>
  );
};

// Card Component with Glow
const GlowCard = ({ children, className = '', color = 'violet', hover = true }) => {
  const glowColors = {
    violet: 'hover:shadow-violet-500/20',
    cyan: 'hover:shadow-cyan-500/20',
    pink: 'hover:shadow-pink-500/20',
    emerald: 'hover:shadow-emerald-500/20',
    amber: 'hover:shadow-amber-500/20'
  };
  
  return (
    <div className={`bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 
      ${hover ? `transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${glowColors[color]}` : ''} 
      ${className}`}>
      {children}
    </div>
  );
};

// Stat Counter with Animation
const StatCounter = ({ value, label, suffix = '', color }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  const textColors = {
    violet: 'text-violet-400',
    cyan: 'text-cyan-400',
    pink: 'text-pink-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400'
  };
  
  return (
    <div className="text-center">
      <div className={`text-4xl md:text-5xl font-bold ${textColors[color]}`}>
        {count}{suffix}
      </div>
      <div className="text-gray-400 mt-2">{label}</div>
    </div>
  );
};

// Resource Link Component
const ResourceLink = ({ title, description, url, type, color }) => {
  const typeColors = {
    pro: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    public: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    both: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    urgence: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
  };
  
  const typeLabels = {
    pro: '👨‍⚕️ Pro',
    public: '👥 Public',
    both: '🌐 Tous',
    urgence: '🆘 Urgence'
  };
  
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" 
       className="block group">
      <GlowCard color={color} className="h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
            {title}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full border ${typeColors[type]}`}>
            {typeLabels[type]}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
        <div className="mt-4 flex items-center text-violet-400 text-sm">
          <span>Visiter</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </GlowCard>
    </a>
  );
};

// Structure Card for the Network
const StructureCard = ({ name, location, description, activities, contact, website, color }) => (
  <GlowCard color={color} className="h-full">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-sm text-gray-400 flex items-center mt-1">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>
      </div>
      <div className={`w-3 h-3 rounded-full bg-${color}-400 shadow-lg shadow-${color}-400/50`} />
    </div>
    <p className="text-gray-300 text-sm mb-4">{description}</p>
    {activities && (
      <div className="flex flex-wrap gap-2 mb-4">
        {activities.map((act, i) => (
          <span key={i} className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full">
            {act}
          </span>
        ))}
      </div>
    )}
    {contact && <p className="text-violet-400 text-sm">{contact}</p>}
  </GlowCard>
);

// Main App
export default function FANClub() {
  const [activeSection, setActiveSection] = useState('accueil');
  const [userType, setUserType] = useState('all');
  
  const sections = [
    { id: 'accueil', label: '🏠 Accueil', color: 'violet' },
    { id: 'comprendre', label: '🧠 Comprendre', color: 'cyan' },
    { id: 'reseau', label: '🔗 Le Réseau', color: 'emerald' },
    { id: 'ressources', label: '📚 Ressources', color: 'pink' },
    { id: 'urgences', label: '🆘 Urgences', color: 'amber' }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f19] text-white overflow-x-hidden">
      <GraphBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f19]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 blur-md opacity-50" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  FANClub
                </h1>
                <p className="text-xs text-gray-400">Santé Mentale Belgique</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-2">
              {sections.map(section => (
                <NodeButton
                  key={section.id}
                  active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  color={section.color}
                >
                  {section.label}
                </NodeButton>
              ))}
            </nav>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <select 
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* ACCUEIL */}
          {activeSection === 'accueil' && (
            <div className="space-y-12 animate-fadeIn">
              {/* Hero */}
              <section className="text-center py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent rounded-3xl" />
                <h2 className="text-5xl md:text-7xl font-black mb-6">
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    FANClub
                  </span>
                </h2>
                <p className="text-2xl md:text-3xl text-gray-300 mb-4">
                  Le Hub de la <span className="text-cyan-400">Santé Mentale</span> en Belgique
                </p>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Un réseau interconnecté de ressources, de structures et d'informations pour les professionnels et le grand public. 
                  Parce que la santé mentale nous concerne tous.
                </p>
                
                {/* User Type Toggle */}
                <div className="flex justify-center gap-4 mb-12">
                  <NodeButton 
                    active={userType === 'all'} 
                    onClick={() => setUserType('all')}
                    color="violet"
                  >
                    🌐 Tout voir
                  </NodeButton>
                  <NodeButton 
                    active={userType === 'public'} 
                    onClick={() => setUserType('public')}
                    color="cyan"
                  >
                    👥 Grand Public
                  </NodeButton>
                  <NodeButton 
                    active={userType === 'pro'} 
                    onClick={() => setUserType('pro')}
                    color="pink"
                  >
                    👨‍⚕️ Professionnels
                  </NodeButton>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <GlowCard color="violet" hover={false}>
                    <StatCounter value="87" label="Services de Santé Mentale" color="violet" />
                  </GlowCard>
                  <GlowCard color="cyan" hover={false}>
                    <StatCounter value="22" label="Réseaux 107" color="cyan" />
                  </GlowCard>
                  <GlowCard color="pink" hover={false}>
                    <StatCounter value="1" suffix="/5" label="Belge concerné" color="pink" />
                  </GlowCard>
                  <GlowCard color="emerald" hover={false}>
                    <StatCounter value="24" suffix="h" label="Écoute disponible" color="emerald" />
                  </GlowCard>
                </div>
              </section>

              {/* Featured: Babel'zin */}
              <section>
                <GlowCard className="relative overflow-hidden" color="violet">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-full blur-3xl" />
                  <div className="relative grid md:grid-cols-2 gap-8">
                    <div>
                      <span className="px-3 py-1 bg-violet-500/20 text-violet-300 text-sm rounded-full border border-violet-500/30">
                        ⭐ Structure à la une
                      </span>
                      <h3 className="text-3xl font-bold mt-4 mb-2">Babel'zin</h3>
                      <p className="text-xl text-cyan-400 mb-4">Un lieu de liens à Auderghem</p>
                      <p className="text-gray-300 mb-6">
                        Néologisme mariant "babeler" (papoter) et "zin" (envie), Babel'zin est un espace d'accueil 
                        informel pour tout "zinneke" en recherche de liens. Un lieu où il est aussi permis de ne rien 
                        dire, car ne rien dire ce n'est pas rien.
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center text-gray-400">
                          <span className="text-violet-400 mr-2">📍</span> 
                          Chaussée de Wavre 1688, 1160 Auderghem
                        </p>
                        <p className="flex items-center text-gray-400">
                          <span className="text-violet-400 mr-2">📞</span> 
                          0492/44.88.70
                        </p>
                        <p className="flex items-center text-gray-400">
                          <span className="text-violet-400 mr-2">🌐</span> 
                          babelzin.be
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Activités proposées</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {['🎨 Ateliers créatifs', '🥁 Percussion', '🎬 Ciné-club', '🎭 Théâtre', 
                          '📸 Studio Babel', '🌳 Sorties', '💻 Aide numérique', '🍳 Cuisine'].map((act, i) => (
                          <div key={i} className="px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                            {act}
                          </div>
                        ))}
                      </div>
                      <div className="pt-4">
                        <p className="text-emerald-400 text-sm font-medium">✓ Accès libre et sans limitation</p>
                        <p className="text-emerald-400 text-sm font-medium">✓ Équipe bienveillante</p>
                        <p className="text-emerald-400 text-sm font-medium">✓ Co-construction avec les participants</p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </section>

              {/* Quick Access Grid */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-violet-500 rounded mr-3" />
                  Accès rapide
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <GlowCard color="pink" className="cursor-pointer" onClick={() => setActiveSection('urgences')}>
                    <div className="text-4xl mb-4">🆘</div>
                    <h4 className="text-xl font-bold mb-2">Besoin d'aide maintenant ?</h4>
                    <p className="text-gray-400 text-sm mb-4">Numéros d'urgence et lignes d'écoute disponibles 24h/24</p>
                    <span className="text-pink-400 font-medium">Voir les contacts →</span>
                  </GlowCard>
                  
                  <GlowCard color="emerald" className="cursor-pointer" onClick={() => setActiveSection('reseau')}>
                    <div className="text-4xl mb-4">🗺️</div>
                    <h4 className="text-xl font-bold mb-2">Trouver un lieu d'accueil</h4>
                    <p className="text-gray-400 text-sm mb-4">SSM, clubs thérapeutiques et espaces de rencontre près de chez vous</p>
                    <span className="text-emerald-400 font-medium">Explorer le réseau →</span>
                  </GlowCard>
                  
                  <GlowCard color="cyan" className="cursor-pointer" onClick={() => setActiveSection('comprendre')}>
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="text-xl font-bold mb-2">Comprendre les enjeux</h4>
                    <p className="text-gray-400 text-sm mb-4">Données, réformes et évolutions du secteur en Belgique</p>
                    <span className="text-cyan-400 font-medium">En savoir plus →</span>
                  </GlowCard>
                </div>
              </section>
            </div>
          )}

          {/* COMPRENDRE */}
          {activeSection === 'comprendre' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="text-center py-8">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-cyan-400">Comprendre</span> la Santé Mentale en Belgique
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Données épidémiologiques, réformes en cours et enjeux du secteur
                </p>
              </section>

              {/* Key Statistics */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-violet-500 rounded mr-3" />
                  Chiffres clés 2024
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GlowCard color="pink">
                    <div className="text-5xl font-bold text-pink-400 mb-2">1/6</div>
                    <p className="text-white font-medium">Troubles anxieux ou dépressifs</p>
                    <p className="text-gray-400 text-sm mt-2">En juin 2024, environ une personne sur six présentait un trouble anxieux et/ou dépressif</p>
                  </GlowCard>
                  
                  <GlowCard color="violet">
                    <div className="text-5xl font-bold text-violet-400 mb-2">60%</div>
                    <p className="text-white font-medium">Ressentent la solitude</p>
                    <p className="text-gray-400 text-sm mt-2">En 2022, la solitude touchait près de six personnes sur dix âgées de 18 ans et plus</p>
                  </GlowCard>
                  
                  <GlowCard color="cyan">
                    <div className="text-5xl font-bold text-cyan-400 mb-2">1/5</div>
                    <p className="text-white font-medium">Troubles de santé mentale</p>
                    <p className="text-gray-400 text-sm mt-2">Près d'un Belge sur cinq souffre de troubles de santé mentale selon Sciensano</p>
                  </GlowCard>
                  
                  <GlowCard color="amber">
                    <div className="text-5xl font-bold text-amber-400 mb-2">6.7%</div>
                    <p className="text-white font-medium">Solitude permanente</p>
                    <p className="text-gray-400 text-sm mt-2">Se sentent seuls "tout le temps" ou "la plupart du temps" (Q3 2024)</p>
                  </GlowCard>
                  
                  <GlowCard color="emerald">
                    <div className="text-5xl font-bold text-emerald-400 mb-2">16%</div>
                    <p className="text-white font-medium">Soutien social faible</p>
                    <p className="text-gray-400 text-sm mt-2">Perçoivent le soutien reçu de leur entourage comme insuffisant</p>
                  </GlowCard>
                  
                  <GlowCard color="pink">
                    <div className="text-5xl font-bold text-pink-400 mb-2">↗️</div>
                    <p className="text-white font-medium">Tendance à la hausse</p>
                    <p className="text-gray-400 text-sm mt-2">Détérioration observée depuis 20 ans, aggravée par la pandémie COVID-19</p>
                  </GlowCard>
                </div>
              </section>

              {/* Populations at Risk */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-pink-500 rounded mr-3" />
                  Populations plus vulnérables
                </h3>
                <GlowCard color="amber" hover={false}>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: '👩', label: 'Femmes', desc: 'Plus touchées par l\'anxiété et la dépression' },
                      { icon: '🧑‍🎓', label: 'Jeunes adultes (18-29 ans)', desc: 'Particulièrement vulnérables aux troubles anxio-dépressifs' },
                      { icon: '🏠', label: 'Personnes vivant seules', desc: 'Isolement social aggravant la santé mentale' },
                      { icon: '👨‍👧', label: 'Parents isolés', desc: 'Charge mentale et manque de soutien' },
                      { icon: '📚', label: 'Moins instruits', desc: 'Corrélation entre niveau d\'éducation et santé mentale' },
                      { icon: '🗺️', label: 'Résidents wallons', desc: 'Disparités régionales observées' }
                    ].map((pop, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <span className="text-2xl">{pop.icon}</span>
                        <div>
                          <p className="font-medium text-white">{pop.label}</p>
                          <p className="text-sm text-gray-400">{pop.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </section>

              {/* Reform 107 */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded mr-3" />
                  La Réforme Psy 107
                </h3>
                <GlowCard color="emerald" hover={false}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-bold text-emerald-400 mb-4">Un tournant majeur depuis 2010</h4>
                      <p className="text-gray-300 mb-4">
                        Avant 2010, la Belgique comptait plus de 150 lits psychiatriques pour 100 000 habitants, 
                        la plaçant dans le top 3 mondial. La réforme vise à transformer ce système hospitalo-centré.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                          <span className="text-gray-300">Maintien dans le milieu de vie</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                          <span className="text-gray-300">22 réseaux couvrant la Belgique</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                          <span className="text-gray-300">Approche intersectorielle</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                          <span className="text-gray-300">Centralité de l'usager</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-cyan-400 mb-4">Les 5 Fonctions</h4>
                      <div className="space-y-3">
                        {[
                          { num: '1', title: 'Prévention & Promotion', desc: 'SSM, maisons médicales, médecins généralistes' },
                          { num: '2A', title: 'Équipes mobiles de crise', desc: 'Intervention rapide en situation de crise' },
                          { num: '2B', title: 'Équipes longue durée', desc: 'Réhabilitation et rétablissement' },
                          { num: '3', title: 'Réhabilitation psycho-sociale', desc: 'Clubs thérapeutiques, habitats protégés' },
                          { num: '4', title: 'Unités hospitalières HIC', desc: 'Soins intensifs quand nécessaire' }
                        ].map((f, i) => (
                          <div key={i} className="flex items-start space-x-3 bg-gray-800/30 rounded-lg p-3">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                              {f.num}
                            </span>
                            <div>
                              <p className="font-medium text-white text-sm">{f.title}</p>
                              <p className="text-xs text-gray-400">{f.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </section>

              {/* Pair-Aidance */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-violet-500 to-pink-500 rounded mr-3" />
                  La Pair-Aidance : une révolution
                </h3>
                <GlowCard color="violet" hover={false}>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-gray-300 mb-4">
                        La <span className="text-violet-400 font-medium">pair-aidance</span> repose sur le partage d'expériences entre pairs 
                        ayant un vécu similaire de grande souffrance. Le pair-aidant est un ex-usager qui, après son propre 
                        rétablissement, accompagne d'autres personnes avec une expertise de vécu unique.
                      </p>
                      <div className="grid sm:grid-cols-3 gap-4 mt-6">
                        <div className="bg-violet-500/10 rounded-lg p-4">
                          <p className="font-medium text-violet-300 mb-2">Pour les usagers</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Reprise du pouvoir d'agir</li>
                            <li>• Réduction de la stigmatisation</li>
                            <li>• Espoir incarné</li>
                          </ul>
                        </div>
                        <div className="bg-cyan-500/10 rounded-lg p-4">
                          <p className="font-medium text-cyan-300 mb-2">Pour les pairs-aidants</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Consolide le rétablissement</li>
                            <li>• Acquisition de compétences</li>
                            <li>• Estime de soi</li>
                          </ul>
                        </div>
                        <div className="bg-pink-500/10 rounded-lg p-4">
                          <p className="font-medium text-pink-300 mb-2">Pour les équipes</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Regard nouveau</li>
                            <li>• Meilleure compréhension</li>
                            <li>• Évolution des pratiques</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/30 rounded-xl p-4">
                      <h5 className="font-medium text-white mb-3">Formation en Belgique</h5>
                      <p className="text-sm text-gray-400 mb-3">
                        L'<span className="text-violet-400">Université de Mons</span> propose la seule formation certifiante 
                        à la pair-aidance en Belgique francophone.
                      </p>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li className="flex items-center">
                          <span className="text-emerald-400 mr-2">✓</span> Gratuite
                        </li>
                        <li className="flex items-center">
                          <span className="text-emerald-400 mr-2">✓</span> Méthodes participatives
                        </li>
                        <li className="flex items-center">
                          <span className="text-emerald-400 mr-2">✓</span> ~10 diplômés/an
                        </li>
                      </ul>
                    </div>
                  </div>
                </GlowCard>
              </section>
            </div>
          )}

          {/* RÉSEAU */}
          {activeSection === 'reseau' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="text-center py-8">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-emerald-400">Le Réseau</span> de Structures
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  SSM, clubs thérapeutiques, espaces d'accueil : un maillage dense sur tout le territoire
                </p>
              </section>

              {/* Network Stats */}
              <section className="grid md:grid-cols-4 gap-4">
                <GlowCard color="violet" hover={false} className="text-center">
                  <div className="text-3xl font-bold text-violet-400">22</div>
                  <p className="text-sm text-gray-400">SSM à Bruxelles</p>
                </GlowCard>
                <GlowCard color="cyan" hover={false} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">65</div>
                  <p className="text-sm text-gray-400">SSM en Wallonie</p>
                </GlowCard>
                <GlowCard color="emerald" hover={false} className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">11€</div>
                  <p className="text-sm text-gray-400">Consultation SSM</p>
                </GlowCard>
                <GlowCard color="pink" hover={false} className="text-center">
                  <div className="text-3xl font-bold text-pink-400">22</div>
                  <p className="text-sm text-gray-400">Réseaux 107</p>
                </GlowCard>
              </section>

              {/* Bruxelles Structures */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-violet-500 to-cyan-500 rounded mr-3" />
                  Bruxelles - Espaces d'Accueil
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StructureCard
                    name="Babel'zin"
                    location="Auderghem"
                    description="Lieu de liens pour tout zinneke en recherche de connexion. Espace d'accueil informel, d'écoute et de créativité."
                    activities={['Ateliers créatifs', 'Percussion', 'Ciné-club', 'Théâtre']}
                    contact="0492/44.88.70"
                    color="violet"
                  />
                  <StructureCard
                    name="Club Norwest"
                    location="Jette"
                    description="Lieu ouvert à tous, né de l'initiative de 16 institutions du Nord-Ouest bruxellois. Accueil de 15 à 20 personnes par jour."
                    activities={['Aquarelle', 'Écriture', 'Cuisine', 'Groupes de parole']}
                    contact="clubnorwest.be"
                    color="cyan"
                  />
                  <StructureCard
                    name="L'Autre Lieu"
                    location="Bruxelles-Centre"
                    description="Recherche-action sur les alternatives à la psychiatrie. Maisons communautaires et projet Amikaro."
                    activities={['Collage', 'Vidéo', 'Phytothérapie', 'Sorties culturelles']}
                    contact="autrelieu.be"
                    color="pink"
                  />
                  <StructureCard
                    name="Den Teirling"
                    location="Ixelles"
                    description="Centre d'activités de jour pour adultes, chaleur humaine et contacts sociaux dans un cadre bienveillant."
                    activities={['Activités de jour', 'Rencontres', 'Ateliers']}
                    contact="denteirling.be"
                    color="emerald"
                  />
                  <StructureCard
                    name="Le Coin des Cerises"
                    location="Bruxelles"
                    description="Accompagnement et activités pour personnes en souffrance psychique dans un environnement soutenant."
                    activities={['Accompagnement', 'Activités collectives']}
                    contact="coindescerises.org"
                    color="amber"
                  />
                  <StructureCard
                    name="Espace 51"
                    location="Bruxelles"
                    description="Espace de création citoyenne et de dialogue ouvert à tous les publics."
                    activities={['Danse', 'Théâtre', 'Yoga', 'Concerts', 'Écriture']}
                    contact="espace51.be"
                    color="violet"
                  />
                  <StructureCard
                    name="Le Pianocktail"
                    location="Bruxelles"
                    description="Bistrot culturel, lieu de rencontres et de convivialité dans une atmosphère décontractée."
                    activities={['Événements culturels', 'Rencontres']}
                    color="cyan"
                  />
                  <StructureCard
                    name="La Trace"
                    location="Bruxelles"
                    description="Accompagnement psychologique et social pour difficultés de consommation et/ou santé mentale."
                    activities={['Accompagnement', 'Addictions', 'Santé mentale']}
                    contact="latrace.be"
                    color="pink"
                  />
                  <StructureCard
                    name="SSM Le Grès"
                    location="Auderghem"
                    description="Service de Santé Mentale pour enfants, adolescents et adultes. Structure parente de Babel'zin."
                    activities={['Consultations', 'Logopédie', 'Thérapie familiale']}
                    contact="02/660.50.73"
                    color="emerald"
                  />
                </div>
              </section>

              {/* Wallonie */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-amber-500 rounded mr-3" />
                  Wallonie - Clubs Thérapeutiques
                </h3>
                <GlowCard color="emerald" hover={false}>
                  <p className="text-gray-300 mb-6">
                    Les clubs thérapeutiques sont des lieux d'accueil et d'activités organisés par les Services de Santé Mentale. 
                    Ils permettent aux personnes souffrant de troubles sévères ou chroniques de se stabiliser et d'accéder aux soins.
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Club Théo Van Gogh', loc: 'Gosselies', tel: '071/91.72.13' },
                      { name: 'Club La Transhumance', loc: 'Jemelle', tel: '-' },
                      { name: 'Club Accolade', loc: 'Liège', tel: 'ssmaccolade@isosl.be' },
                      { name: 'Club L\'Esquisse', loc: 'Namur', tel: '-' },
                      { name: 'Club CT Arlon', loc: 'Arlon', tel: '063/22.68.90' },
                      { name: 'Club CT Marche', loc: 'Marche', tel: '084/22.15.40' },
                      { name: 'Club CT Virton', loc: 'Virton', tel: '063/21.24.46' },
                      { name: 'Club Verviers', loc: 'Verviers', tel: '-' }
                    ].map((club, i) => (
                      <div key={i} className="bg-gray-800/30 rounded-lg p-3">
                        <p className="font-medium text-white text-sm">{club.name}</p>
                        <p className="text-xs text-emerald-400">{club.loc}</p>
                        {club.tel !== '-' && <p className="text-xs text-gray-500">{club.tel}</p>}
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </section>
            </div>
          )}

          {/* RESSOURCES */}
          {activeSection === 'ressources' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="text-center py-8">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-pink-400">Ressources</span> & Documentation
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Organismes de référence, formations et documentation pour professionnels et grand public
                </p>
              </section>

              {/* Filter */}
              <div className="flex justify-center gap-4">
                <NodeButton active={userType === 'all'} onClick={() => setUserType('all')} color="violet">
                  🌐 Toutes
                </NodeButton>
                <NodeButton active={userType === 'public'} onClick={() => setUserType('public')} color="cyan">
                  👥 Grand Public
                </NodeButton>
                <NodeButton active={userType === 'pro'} onClick={() => setUserType('pro')} color="pink">
                  👨‍⚕️ Professionnels
                </NodeButton>
              </div>

              {/* Resource Grid */}
              <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceLink
                  title="Ligue Bruxelloise pour la Santé Mentale"
                  description="Fédération des 22 SSM de Bruxelles. Groupes de travail, formations et coordination du secteur."
                  url="https://lbsm.be"
                  type="both"
                  color="violet"
                />
                <ResourceLink
                  title="CRéSaM"
                  description="Centre de Référence en Santé Mentale pour la Wallonie. Documentation, recherches et appui aux SSM."
                  url="https://cresam.be"
                  type="pro"
                  color="pink"
                />
                <ResourceLink
                  title="Plateforme Bruxelloise"
                  description="Coordination des acteurs bruxellois. Répertoire complet des services et actualités du secteur."
                  url="https://platformbxl.brussels"
                  type="both"
                  color="cyan"
                />
                <ResourceLink
                  title="Psy 107"
                  description="Site officiel de la réforme des soins en santé mentale. Guides, rapports et informations sur les réseaux."
                  url="https://psy107.be"
                  type="pro"
                  color="emerald"
                />
                <ResourceLink
                  title="Psytoyens"
                  description="Concertation des usagers en santé mentale. Donner la parole aux personnes concernées."
                  url="https://psytoyens.be"
                  type="public"
                  color="violet"
                />
                <ResourceLink
                  title="Similes"
                  description="Association des familles et proches de personnes atteintes de troubles psychiques. Soutien et information."
                  url="https://similes.org"
                  type="public"
                  color="pink"
                />
                <ResourceLink
                  title="Sciensano - Santé Mentale"
                  description="Données épidémiologiques officielles. Enquêtes de santé et indicateurs de santé publique."
                  url="https://sciensano.be"
                  type="pro"
                  color="cyan"
                />
                <ResourceLink
                  title="AVIQ"
                  description="Agence wallonne pour une vie de qualité. Liste des clubs thérapeutiques et services agréés."
                  url="https://aviq.be"
                  type="both"
                  color="emerald"
                />
                <ResourceLink
                  title="Réseau SAM"
                  description="Répertoire des prestataires pour aidants de personnes en santé mentale. Orientation et informations."
                  url="https://reseau-sam.be"
                  type="public"
                  color="amber"
                />
              </section>

              {/* Pro Section */}
              {(userType === 'all' || userType === 'pro') && (
                <section>
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-violet-500 rounded mr-3" />
                    👨‍⚕️ Espace Professionnels
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <GlowCard color="pink">
                      <h4 className="text-lg font-bold text-pink-400 mb-3">Formation Pair-Aidance UMons</h4>
                      <p className="text-gray-300 text-sm mb-4">
                        Formation certifiante gratuite à la pair-aidance en santé mentale et précarités. 
                        Méthodes participatives, stage inclus.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">Gratuit</span>
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">1 an</span>
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">UMons</span>
                      </div>
                    </GlowCard>
                    <GlowCard color="violet">
                      <h4 className="text-lg font-bold text-violet-400 mb-3">PAT - Peer and Team Support</h4>
                      <p className="text-gray-300 text-sm mb-4">
                        Projet du SMES pour accompagner l'intégration de pairs-aidants dans les équipes. 
                        Intervisions, formations, méthodologie.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">SMES</span>
                        <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">Accompagnement</span>
                      </div>
                    </GlowCard>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* URGENCES */}
          {activeSection === 'urgences' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="text-center py-8">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-amber-400">🆘 Besoin d'aide ?</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Des personnes sont là pour vous écouter, 24h/24, 7j/7
                </p>
              </section>

              {/* Emergency Numbers */}
              <section className="grid md:grid-cols-2 gap-6">
                <GlowCard color="pink" className="border-2 border-pink-500/50">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <span className="text-3xl">☎️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-pink-400">0800 32 123</h3>
                      <p className="text-white">Centre de Prévention du Suicide</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">Ligne d'écoute gratuite, disponible 24h/24, 7j/7</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full">Gratuit</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full">24h/24</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full">Anonyme</span>
                  </div>
                </GlowCard>

                <GlowCard color="amber" className="border-2 border-amber-500/50">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <span className="text-3xl">📞</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-400">107</h3>
                      <p className="text-white">Télé-Accueil</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">Écoute anonyme pour toute personne en difficulté</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">Gratuit</span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">24h/24</span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">Anonyme</span>
                  </div>
                </GlowCard>
              </section>

              {/* Other Contacts */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded mr-3" />
                  Autres contacts utiles
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'SOS Psychiatrie (Bruxelles)', tel: '02 538 94 34', desc: 'Urgences psychiatriques' },
                    { name: 'Urgences médicales', tel: '112', desc: 'Numéro européen d\'urgence' },
                    { name: 'Police', tel: '101', desc: 'Assistance policière' },
                    { name: 'Écoute Enfants', tel: '103', desc: 'Ligne d\'écoute pour les jeunes' },
                    { name: 'Drogues Info Service', tel: '0800 23 000', desc: 'Aide addictions' },
                    { name: 'Babel\'zin', tel: '0492/44.88.70', desc: 'Lieu d\'accueil Auderghem' }
                  ].map((contact, i) => (
                    <GlowCard key={i} color="cyan" className="text-center">
                      <p className="text-xl font-bold text-cyan-400">{contact.tel}</p>
                      <p className="font-medium text-white mt-2">{contact.name}</p>
                      <p className="text-sm text-gray-400">{contact.desc}</p>
                    </GlowCard>
                  ))}
                </div>
              </section>

              {/* Message */}
              <section>
                <GlowCard color="emerald" hover={false} className="text-center">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-4">Vous n'êtes pas seul·e</h3>
                  <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                    Quelle que soit votre situation, des personnes formées sont là pour vous écouter sans jugement. 
                    Parler peut aider. Les lieux d'accueil comme Babel'zin ou le Club Norwest sont également ouverts 
                    pour vous accueillir, prendre un café, ou simplement être là.
                  </p>
                  <p className="text-lg text-white italic">
                    "Il est aussi permis de ne rien dire, car ne rien dire ce n'est pas rien."
                  </p>
                </GlowCard>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <span>🧠</span>
                </div>
                <span className="font-bold text-lg">FANClub</span>
              </div>
              <p className="text-sm text-gray-400">
                Hub de référence pour la santé mentale en Belgique. Connecter, informer, accompagner.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-violet-400 cursor-pointer" onClick={() => setActiveSection('accueil')}>Accueil</li>
                <li className="hover:text-violet-400 cursor-pointer" onClick={() => setActiveSection('comprendre')}>Comprendre</li>
                <li className="hover:text-violet-400 cursor-pointer" onClick={() => setActiveSection('reseau')}>Le Réseau</li>
                <li className="hover:text-violet-400 cursor-pointer" onClick={() => setActiveSection('ressources')}>Ressources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Urgences</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="text-pink-400">0800 32 123</span> - Prévention Suicide</li>
                <li><span className="text-amber-400">107</span> - Télé-Accueil</li>
                <li><span className="text-cyan-400">112</span> - Urgences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">À la une</h4>
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-violet-400">Babel'zin</span> - Auderghem
              </p>
              <p className="text-xs text-gray-500">
                Chaussée de Wavre 1688<br/>
                0492/44.88.70
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2026 FANClub - Santé Mentale Belgique
            </p>
            <p className="text-xs text-gray-600 mt-2 md:mt-0">
              Sources: Sciensano, CRéSaM, LBSM, Psy107, AVIQ
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
