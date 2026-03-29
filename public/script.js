// Lucide icon helper
const Icon = ({ name, size = 24, className = "" }) => {
  const iconName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return (
    <span 
      data-lucide={iconName} 
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    ></span>
  );
};

// --- COMPONENTS ---

const BackgroundParticles = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i}
        className="bg-particle"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
          opacity: Math.random() * 0.3
        }}
      ></div>
    ))}
  </div>
);

const StatCard = ({ label, value, icon, delay = "0" }) => (
  <div 
    className="glass p-5 flex items-center gap-4 glass-card-hover anim-fade-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-12 h-12 rounded-xl feature-icon-wrapper flex items-center justify-center text-[#007AFF]">
      <Icon name={icon} size={24} />
    </div>
    <div>
      <p className="text-[var(--muted-text)] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, centered = false }) => (
  <div className={`${centered ? 'text-center' : 'text-left'} mb-12`}>
    <div className={`inline-flex items-center gap-2 mb-3 ${centered ? 'justify-center' : ''}`}>
      <span className="w-6 h-[2px] bg-[#007AFF]/50"></span>
      <span className="text-[#007AFF] text-[9px] font-black tracking-[0.4em] uppercase">{subtitle}</span>
      {!centered && <span className="w-12 h-[2px] bg-[#007AFF]/50"></span>}
    </div>
    <h2 className="text-3xl md:text-5xl font-black text-white">{title}</h2>
  </div>
);

const ReviewSlider = () => {
  const reviews = [
    { name: "@DevNexus", role: "Mobile Engineer", text: "SENCI delivers zero-overhead precision. My hardware metrics jumped by 40% instantly after the core matrix activation." },
    { name: "@HardwarePro", role: "Tech Reviewer", text: "The hardware scanning is revolutionary. It manages thermal throttling far better than any native mobile OS controls." },
    { name: "@CyberPunk_X", role: "Pro Gamer", text: "Absolute zero lag in every session. This is the gold standard for high-performance hardware tuning globally." }
  ];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass p-8 relative overflow-hidden anim-fade-up h-64 md:h-72 flex flex-col justify-center" style={{animationDelay: '0.8s'}}>
      <div className="flex flex-col items-center text-center">
        <Icon name="Quote" size={28} className="text-[#007AFF]/30 mb-6" />
        <p className="text-lg md:text-xl text-white mb-6 max-w-2xl font-medium line-clamp-2 leading-relaxed h-[3.5rem]">"{reviews[index].text}"</p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center font-black text-[#007AFF] text-xs">{reviews[index].name[1]}</div>
          <div className="text-left">
            <h5 className="text-sm font-black text-white tracking-widest uppercase">{reviews[index].name}</h5>
            <p className="text-[10px] uppercase text-[#007AFF] font-black tracking-widest">{reviews[index].role}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-[#007AFF] w-8' : 'bg-[#007AFF]/20'}`}></div>
        ))}
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const faqs = [
    { q: "Is SENCI safe for my device?", a: "SENCI operates within safe hardware thresholds using our Dynamic Throttling engine to prevent any overheating." },
    { q: "How much performance increase can I expect?", a: "Users typically report a 30-45% increase in stability and real-time response accuracy." },
    { q: "Does it require root access?", a: "No. SENCI works at the application layer to optimize hardware distribution without risky system modifications." }
  ];

  return (
    <div className="space-y-6 anim-fade-up" style={{animationDelay: '1s'}}>
      {faqs.map((f, i) => (
        <div 
          key={i} 
          className="glass p-6 md:p-8 hover:border-[#007AFF]/40 group transition-all cursor-pointer overflow-hidden" 
          onClick={() => setActiveIndex(activeIndex === i ? null : i)}
        >
          <h4 className="text-lg font-black text-white flex items-center justify-between">
            {f.q} 
            <Icon 
              name={activeIndex === i ? "Minus" : "Plus"} 
              size={18} 
              className={`text-[#007AFF] transition-all transform ${activeIndex === i ? 'rotate-180' : 'rotate-0'}`} 
            />
          </h4>
          <div className={`transition-all duration-500 ease-in-out ${activeIndex === i ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
             <p className="text-[var(--muted-text)] font-semibold text-sm leading-relaxed border-t border-white/5 pt-4">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const RadarAnimation = () => (
  <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center anim-fade-up" style={{animationDelay: '0.4s'}}>
    <div className="absolute inset-0 rounded-full border border-[#007AFF]/20 animate-ping"></div>
    <div className="absolute inset-[10%] rounded-full border border-[#007AFF]/10 animate-ping [animation-delay:0.5s]"></div>
    <div className="absolute inset-[20%] rounded-full border border-[#007AFF]/5 animate-ping [animation-delay:1s]"></div>
    
    <div className="absolute inset-0 rounded-full border border-[#007AFF]/10 overflow-hidden">
      <div 
        className="animate-spin-slow w-[100%] h-[100%] rounded-full"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 60%, rgba(0, 122, 255, 0.4) 100%)',
        }}
      ></div>
    </div>
    
    <div className="relative z-10 glass w-24 h-24 rounded-3xl flex items-center justify-center text-[#007AFF] border-[#007AFF]/30 animate-pulse bg-black/40 shadow-2xl">
      <Icon name="Cpu" size={48} />
    </div>
    <div className="absolute top-[20%] right-[30%] w-2 h-2 rounded-full bg-[#007AFF] animate-pulse"></div>
    <div className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-[#007AFF] animate-pulse [animation-delay:0.8s]"></div>
  </div>
);

const WaterWaveGraph = () => {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    let frame;
    const animate = () => {
      setPhase(p => (p + 0.02) % (Math.PI * 2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const generatePoints = (p, freq, amp, offset) => {
    const pts = [];
    for (let x = 0; x <= 1000; x += 20) {
      const y = offset + Math.sin(x * freq + p) * amp;
      pts.push(`${x},${y}`);
    }
    return pts;
  };

  const ptsA = generatePoints(phase, 0.008, 12, 85);
  const ptsB = generatePoints(phase * 1.3, 0.012, 18, 90);

  return (
    <div className="glass mt-12 bg-black/10 overflow-hidden relative aspect-video md:aspect-[4/1] w-full max-w-5xl rounded-[2.5rem] anim-fade-up" style={{animationDelay: '0.6s'}}>
      <div className="absolute top-6 left-8 z-10">
        <p className="text-[9px] font-black text-[#007AFF] tracking-[0.4em] uppercase">Silk Engine Matrix</p>
      </div>
      
      <div className="absolute top-6 right-8 z-10 flex items-center gap-2 glass-pill px-4 py-1.5 border border-blue-500/20 glitch-text">
        <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse"></span>
        <span className="text-[8px] font-black text-[#007AFF] tracking-widest uppercase text-shadow">REAL-TIME DATA FLUX</span>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-full opacity-60">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full scale-[1.1]">
          <path d={`M 0,200 L ${ptsA.join(' L ')} L 1000,200 Z`} fill="rgba(0, 122, 255, 0.2)" />
          <path d={`M 0,200 L ${ptsB.join(' L ')} L 1000,200 Z`} fill="rgba(0, 122, 255, 0.1)" />
          <path d={`M 0,${ptsA[0].split(',')[1]} L ${ptsA.join(' L ')}`} fill="none" stroke="#007AFF" strokeWidth="2" strokeOpacity="0.8" />
          <path d={`M 0,${ptsB[0].split(',')[1]} L ${ptsB.join(' L ')}`} fill="none" stroke="#007AFF" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    lucide.createIcons();
    const t = setTimeout(() => lucide.createIcons(), 500);
    return () => clearTimeout(t);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setTimeout(() => lucide.createIcons(), 50);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-16">
      <BackgroundParticles />
      <header className="flex justify-between items-center mb-16 md:mb-32 relative z-50">
        <div className="flex items-center gap-3 anim-fade-up">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-black text-white">S</div>
          <span className="text-2xl font-black tracking-tighter text-white">SENCI</span>
        </div>
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black tracking-[0.3em] text-[var(--muted-text)] uppercase anim-fade-up" style={{animationDelay: '0.1s'}}>
          <a href="#" className="hover:text-[#007AFF] transition-colors">Core</a>
          <a href="safety.html" className="hover:text-[#007AFF] transition-colors">Safety Hub</a>
          <button className="glass-pill px-8 py-3 text-white border border-blue-500/20 font-black text-[9px] tracking-widest uppercase hover:bg-blue-500/10 transition-all">CONSOLE</button>
        </div>
        <div className="lg:hidden flex gap-4 text-white anim-fade-up">
          <button onClick={toggleMenu} className="w-10 h-10 rounded-full glass flex items-center justify-center border-blue-500/10"><Icon name="Menu" /></button>
        </div>
      </header>

      {/* SIDEBAR */}
      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center font-black text-sm text-black">S</div>
            <span className="text-lg font-black text-white uppercase tracking-tighter">NAVIGATE</span>
          </div>
          <button onClick={toggleMenu} className="w-10 h-10 rounded-full glass flex items-center justify-center"><Icon name="X" /></button>
        </div>
        <div className="flex flex-col gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-[var(--muted-text)]">
          <a href="privacy.html" className="hover:text-[#007AFF] transition-all flex items-center gap-4"><Icon name="Shield" size={16} /> Privacy Policy</a>
          <a href="terms.html" className="hover:text-[#007AFF] transition-all flex items-center gap-4"><Icon name="Scale" size={16} /> Terms</a>
          <a href="safety.html" className="hover:text-[#007AFF] transition-all flex items-center gap-4"><Icon name="Flame" size={16} /> Safety Hub</a>
          <a href="#" className="hover:text-[#007AFF] transition-all flex items-center gap-4"><Icon name="Download" size={16} /> Get Senci App</a>
        </div>
      </div>

      <section className="mb-40">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <h1 className="mb-10 text-white leading-[1.05] anim-fade-up" style={{animationDelay: '0.2s'}}>Built for <br /><span className="text-gradient-primary">Performance.</span></h1>
            <p className="text-[var(--muted-text)] text-lg md:text-xl mb-12 max-w-lg leading-relaxed font-bold anim-fade-up" style={{animationDelay: '0.3s'}}>Experience absolute precision in every pixel. Senci is the world's most advanced engine for hardware optimization.</p>
            <div className="flex flex-col sm:flex-row gap-6 anim-fade-up" style={{animationDelay: '0.4s'}}>
              <button className="btn-primary">GET SENCI PRO</button>
              <button className="btn-secondary">WATCH DEMO</button>
            </div>
          </div>
          <div className="relative mt-20 lg:mt-0"><RadarAnimation /></div>
        </div>
        <WaterWaveGraph />
      </section>

      <section className="mb-40 border-t border-[var(--glass-border)] pt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        <StatCard label="App Size" value="12 MB" icon="Activity" delay="0.5" />
        <StatCard label="Success Rate" value="99.9%" icon="ShieldCheck" delay="0.6" />
        <StatCard label="Active Users" value="2.8M+" icon="Users" delay="0.7" />
      </section>

      <section className="mb-40">
        <SectionHeader title="Performance Reports." subtitle="User Feedback" />
        <ReviewSlider />
      </section>

      <section className="mb-20 pb-4 text-white">
        <SectionHeader title="System Intel." subtitle="Frequency Asked Questions" />
        <FAQSection />
      </section>

      <footer className="py-6 border-t border-[var(--glass-border)] text-white anim-fade-up" style={{animationDelay: '1.2s'}}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)]">
          <p className="text-white text-[10px] tracking-[0.2em]">© 2024 SENCI SYSTEMS. ENGINEERED FOR SPEED.</p>
          <div className="flex items-center gap-10">
             <a href="privacy.html">Privacy</a>
             <a href="terms.html">Terms</a>
             <a href="safety.html">Safety</a>
          </div>
          <div className="flex items-center gap-6 opacity-60">
            <Icon name="Twitter" size={14} />
            <Icon name="Github" size={14} />
          </div>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
