const Icon = ({ name, size = 24, className = "" }) => {
  const iconName = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return (
    <span
      data-lucide={iconName}
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    ></span>
  );
};

const AppBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden bg-[#F2F2F7]">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#007AFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#007AFF" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34C759" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#34C759" stopOpacity="0.02" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="5" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="shadow-bottom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="-5" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Wave 1: Top Right */}
      <path
        d="M 400 0 C 600 100, 800 50, 1000 250 L 1000 0 Z"
        fill="url(#grad-blue)"
        filter="url(#shadow)"
      />
      {/* Wave 2: Top Right (Overlap) */}
      <path
        d="M 200 0 C 400 150, 700 100, 1000 150 L 1000 0 Z"
        fill="#007AFF"
        opacity="0.03"
      />

      {/* Wave 3: Bottom Left */}
      <path
        d="M 0 700 C 100 850, 300 750, 600 1000 L 0 1000 Z"
        fill="url(#grad-green)"
        filter="url(#shadow-bottom)"
      />
      {/* Wave 4: Bottom*/}
      <path
        d="M 0 850 C 150 950, 400 850, 800 1000 L 0 1000 Z"
        fill="#34C759"
        opacity="0.03"
      />

      {/* Mid Wave: Orange */}
      <path
        d="M 1000 400 C 850 450, 800 550, 1000 600 Z"
        fill="#FF9500"
        opacity="0.08"
        filter="url(#shadow)"
      />
    </svg>

    {/* Abstract Circles Detail */}
    <div className="absolute left-[10%] top-[20%] opacity-[0.05]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute border border-[#8E8E93] rounded-full"
          style={{
            width: i * 60,
            height: i * 60,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  </div>
);

const StatCard = ({ label, value, icon, delay = "0" }) => (
  <div
    className="glass p-5 flex items-center gap-4 glass-card-hover"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="w-12 h-12 rounded-xl feature-icon-wrapper flex items-center justify-center text-[#007AFF]">
      <Icon name={icon} size={24} />
    </div>
    <div>
      <p className="text-[var(--muted-text)] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
        {label}
      </p>
      <h3 className="text-2xl font-black text-[var(--text-color)]">{value}</h3>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, centered = false }) => (
  <div
    className={`${centered ? "text-center" : "text-left"} mb-12`}
    data-aos="fade-right"
  >
    <div
      className={`inline-flex items-center gap-2 mb-3 ${centered ? "justify-center" : ""}`}
    >
      <span className="w-6 h-[2px] bg-[#007AFF]/50"></span>
      <span className="text-[#007AFF] text-[9px] font-black tracking-[0.4em] uppercase">
        {subtitle}
      </span>
      {!centered && <span className="w-12 h-[2px] bg-[#007AFF]/50"></span>}
    </div>
    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-color)] tracking-tighter">
      {title}
    </h2>
  </div>
);

const ReviewSlider = () => {
  const reviews = [
    {
      name: "@DevNexus",
      role: "Mobile Engineer",
      text: "SENCI delivers zero-overhead precision. My hardware metrics jumped by 40% instantly after the core matrix activation.",
    },
    {
      name: "@HardwarePro",
      role: "Tech Reviewer",
      text: "The hardware scanning is revolutionary. It manages thermal throttling far better than any native mobile OS controls.",
    },
    {
      name: "@CyberPunk_X",
      role: "Pro Gamer",
      text: "Absolute zero lag in every session. This is the gold standard for high-performance hardware tuning globally.",
    },
    {
      name: "@AlphaTech",
      role: "UI Designer",
      text: "The touch digitizer optimization is unlike anything I've used. Fluidity at its absolute peak.",
    },
    {
      name: "@SenciFan_01",
      role: "Optimization Enthusiast",
      text: "Finally, an app that actually does what it says. My battery life and temps are perfectly balanced now.",
    },
  ];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % reviews.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div
      className="glass p-8 relative overflow-hidden h-64 md:h-72 flex flex-col justify-center"
      data-aos="zoom-in"
    >
      <div className="flex flex-col items-center text-center">
        <Icon name="Quote" size={28} className="text-[#007AFF]/30 mb-6" />
        <p className="text-lg md:text-xl text-[var(--text-color)] mb-6 max-w-2xl font-medium line-clamp-2 leading-relaxed h-[3.5rem]">
          "{reviews[index].text}"
        </p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center font-black text-[#007AFF] text-xs">
            {reviews[index].name[1]}
          </div>
          <div className="text-left">
            <h5 className="text-sm font-black text-[var(--text-color)] tracking-widest uppercase">
              {reviews[index].name}
            </h5>
            <p className="text-[10px] uppercase text-[#007AFF] font-black tracking-widest">
              {reviews[index].role}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-[#007AFF] w-8" : "bg-[#007AFF]/20"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const faqs = [
    {
      q: "Is SENCI safe for my device?",
      a: "SENCI operates within safe hardware thresholds using our Dynamic Throttling engine to prevent any overheating.",
    },
    {
      q: "How much performance increase can I expect?",
      a: "Users typically report a 30-45% increase in stability and real-time response accuracy.",
    },
    {
      q: "Does it require root access?",
      a: "No. SENCI works at the application layer to optimize hardware distribution without risky system modifications.",
    },
    {
      q: "Will it consume more battery?",
      a: "On the contrary, Senci's Efficiency core intelligently manages idle CPU cycles, often leading to better battery life over time.",
    },
    {
      q: "Can I use Senci on multiple devices?",
      a: "Yes, your SENCI PRO license supports seamless synchronization across up to three devices simultaneously.",
    },
    {
      q: "How often are the cloud profiles updated?",
      a: "Our Silk Engine Matrix syncs with global telemetry data every 24 hours to deliver the most optimized settings for your hardware.",
    },
  ];

  return (
    <div className="space-y-6">
      {faqs.map((f, i) => (
        <div
          key={i}
          className="glass p-6 md:p-8 hover:border-[#007AFF]/40 group transition-all cursor-pointer overflow-hidden"
          onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          data-aos="fade-up"
          data-aos-delay={i * 100}
        >
          <h4 className="text-lg font-black text-[var(--text-color)] flex items-center justify-between">
            {f.q}
            <Icon
              name={activeIndex === i ? "Minus" : "Plus"}
              size={18}
              className={`text-[#007AFF] transition-all transform ${activeIndex === i ? "rotate-180" : "rotate-0"}`}
            />
          </h4>
          <div
            className={`transition-all duration-500 ease-in-out ${activeIndex === i ? "max-h-40 opacity-100 mt-6" : "max-h-0 opacity-0"}`}
          >
            <p className="text-[var(--muted-text)] font-semibold text-sm leading-relaxed border-t border-white/5 pt-4">
              {f.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const LottieAvatar = () => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "assets/json/avatar.json",
    });

    return () => anim.destroy();
  }, []);

  return (
    <div
      className="relative w-full max-w-[350px] aspect-square mx-auto flex items-center justify-center"
      data-aos="zoom-in"
      data-aos-delay="500"
    >
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

const RadarAnimation = () => null;

const FeatureDetail = ({ title, content, icon, delay }) => (
  <div
    className="glass p-6 md:p-12 glass-card-hover border-white/5"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] mb-6 md:mb-8">
      <Icon name={icon} size={28} />
    </div>
    <h3 className="text-xl md:text-2xl font-black text-[var(--text-color)] mb-4 md:mb-6 uppercase tracking-tight">
      {title}
    </h3>
    <div className="space-y-1 overflow-hidden">
      <p className="text-[var(--muted-text)] text-[8.5px] sm:text-[10px] md:text-xs leading-relaxed font-black uppercase tracking-[0.1em] md:tracking-[0.15em] whitespace-nowrap">
        {content}
      </p>
    </div>
  </div>
);

const AboutHowSection = () => (
  <section className="mb-20 grid lg:grid-cols-2 gap-16 items-center border-t border-white/5 pt-12">
    <div data-aos="fade-right">
      <SectionHeader title="The Senci" subtitle="What & How" />
      <div className="space-y-6">
        <div className="glass p-6 border-l-4 border-l-[#007AFF]">
          <h4 className="text-[var(--text-color)] font-black uppercase text-xs tracking-widest mb-2">
            What is Senci?
          </h4>
          <p className="text-[var(--muted-text)] text-sm font-semibold">
            SENCI is a professional-grade mobile hardware optimization engine
            designed to bridge the gap between software constraints and hardware
            potential. It acts as a high-performance bridge that unlocks hidden
            capability within your device's chipset and display digitizer.
          </p>
        </div>
        <div className="glass p-6 border-l-4 border-l-purple-500">
          <h4 className="text-[var(--text-color)] font-black uppercase text-xs tracking-widest mb-2">
            How it Works?
          </h4>
          <p className="text-[var(--muted-text)] text-sm font-semibold">
            By implementing a real-time Silk Engine Matrix, SENCI bypasses
            standard OS polling limitations. It uses low-level hardware
            abstraction to recalibrate touch sensitivity and CPU frequency
            scaling, ensuring that your device responds with zero latency during
            peak performance loads.
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
      <div className="glass p-8 text-center">
        <div className="text-[#007AFF] mb-4 flex justify-center">
          <Icon name="Zap" size={32} />
        </div>
        <h5 className="text-[var(--text-color)] font-black text-xs uppercase tracking-widest">
          Instant Response
        </h5>
      </div>
      <div className="glass p-8 text-center mt-12">
        <div className="text-purple-500 mb-4 flex justify-center">
          <Icon name="BarChart3" size={32} />
        </div>
        <h5 className="text-[var(--text-color)] font-black text-xs uppercase tracking-widest">
          FPS Stability
        </h5>
      </div>
      <div className="glass p-8 text-center">
        <div className="text-cyan-400 mb-4 flex justify-center">
          <Icon name="Target" size={32} />
        </div>
        <h5 className="text-[var(--text-color)] font-black text-xs uppercase tracking-widest">
          Zero Jitter
        </h5>
      </div>
      <div className="glass p-8 text-center mt-12">
        <div className="text-emerald-400 mb-4 flex justify-center">
          <Icon name="Infinity" size={32} />
        </div>
        <h5 className="text-[var(--text-color)] font-black text-xs uppercase tracking-widest">
          Cloud Sync
        </h5>
      </div>
    </div>
  </section>
);

const WaterWaveGraph = () => {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    let frame;
    const animate = () => {
      setPhase((p) => (p + 0.02) % (Math.PI * 2));
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
    <div
      className="glass mt-6 bg-black/10 overflow-hidden relative aspect-video md:aspect-[4/1] w-full max-w-5xl rounded-[2.5rem]"
      data-aos="fade-up"
    >
      <div className="absolute top-6 left-8 z-10">
        <p className="text-[9px] font-black text-[#007AFF] tracking-[0.4em] uppercase">
          Silk Engine Matrix
        </p>
      </div>

      <div className="absolute top-6 right-8 z-10 flex items-center gap-2 glass-pill px-4 py-1.5 border border-blue-500/20 glitch-text">
        <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse"></span>
        <span className="text-[8px] font-black text-[#007AFF] tracking-widest uppercase text-shadow">
          REAL-TIME DATA FLUX
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-full opacity-60">
        <svg
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          className="w-full h-full scale-[1.1]"
        >
          <path
            d={`M 0,200 L ${ptsA.join(" L ")} L 1000,200 Z`}
            fill="rgba(0, 122, 255, 0.2)"
          />
          <path
            d={`M 0,200 L ${ptsB.join(" L ")} L 1000,200 Z`}
            fill="rgba(0, 122, 255, 0.1)"
          />
          <path
            d={`M 0,${ptsA[0].split(",")[1]} L ${ptsA.join(" L ")}`}
            fill="none"
            stroke="#007AFF"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
          <path
            d={`M 0,${ptsB[0].split(",")[1]} L ${ptsB.join(" L ")}`}
            fill="none"
            stroke="#007AFF"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const cursorRef = React.useRef(null);
  const cursorOutlineRef = React.useRef(null);

  React.useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    lucide.createIcons();

    const moveCursor = (e) => {
      if (cursorRef.current && cursorOutlineRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorOutlineRef.current.style.left = `${e.clientX}px`;
        cursorOutlineRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", moveCursor);

    const handleHover = () => {
      cursorRef.current?.classList.add("hovering");
      cursorOutlineRef.current?.classList.add("hovering");
    };

    const handleLeave = () => {
      cursorRef.current?.classList.remove("hovering");
      cursorOutlineRef.current?.classList.remove("hovering");
    };

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"]',
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setTimeout(() => lucide.createIcons(), 50);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-0 md:pt-16 md:pb-0">
      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        ref={cursorOutlineRef}
        className="custom-cursor-outline hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      ></div>
      <AppBackground />
      <header className="flex justify-between items-center mb-16 md:mb-16 relative z-50">
        <div className="flex items-center gap-3" data-aos="fade-down">
          <span className="text-3xl md:text-5xl font-bold tracking-wide text-gradient-primary">
            Sensi
          </span>
        </div>
        <div
          className="hidden lg:flex items-center gap-10 text-[10px] font-black tracking-[0.3em] text-[var(--muted-text)] uppercase"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <a
            href="https://t.me/senci"
            className="hover:text-[#007AFF] transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://instagram.com/senci"
            className="hover:text-[#007AFF] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://youtube.com/@senci"
            className="hover:text-[#007AFF] transition-colors"
          >
            Youtube
          </a>
        </div>
        <div
          className="lg:hidden flex gap-4 text-[var(--text-color)]"
          data-aos="fade-down"
        >
          <button
            onClick={toggleMenu}
            className="w-10 h-10 rounded-full glass flex items-center justify-center border-blue-500/10"
          >
            <Icon name="Menu" />
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      <div
        className={`menu-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>
      <div className={`side-menu ${isMenuOpen ? "active" : ""}`}>
        <AppBackground />
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold tracking-wide text-gradient-primary">
              Sensi
            </span>
          </div>
          <button
            onClick={toggleMenu}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--text-color)]"
          >
            <Icon name="X" />
          </button>
        </div>
        <div className="flex flex-col gap-8 text-sm md:text-base font-black uppercase tracking-[0.3em] text-[var(--muted-text)]">
          <a
            href="https://t.me/senci"
            className="hover:text-[#007AFF] transition-all flex items-center gap-4 w-full"
          >
            <div className="w-6 flex justify-center">
              <Icon name="Send" size={18} />
            </div>{" "}
            Telegram
          </a>
          <a
            href="https://instagram.com/senci"
            className="hover:text-[#007AFF] transition-all flex items-center gap-4 w-full"
          >
            <div className="w-6 flex justify-center">
              <Icon name="Camera" size={18} />
            </div>{" "}
            Instagram
          </a>
          <a
            href="https://youtube.com/@senci"
            className="hover:text-[#007AFF] transition-all flex items-center gap-4 w-full"
          >
            <div className="w-6 flex justify-center">
              <Icon name="PlaySquare" size={18} />
            </div>{" "}
            Youtube
          </a>
          <a
            href="#"
            className="hover:text-[#007AFF] transition-all flex items-center gap-4 w-full"
          >
            <div className="w-6 flex justify-center">
              <Icon name="Download" size={18} />
            </div>{" "}
            Get App
          </a>
        </div>
      </div>

      <section className="mb-4">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-20 items-center">
          <div className="text-left">
            <h1
              className="mb-2 md:mb-8 text-[var(--text-color)] leading-[1.05]"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Built for <br />
              <span className="text-gradient-primary">Performance.</span>
            </h1>
            <p
              className="text-[var(--muted-text)] text-lg md:text-xl mb-4 md:mb-10 max-w-lg leading-relaxed font-bold"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              Experience absolute precision in every pixel. Senci is the world's
              most advanced engine for hardware optimization.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4"
              data-aos="fade-right"
              data-aos-delay="400"
            >
              <button className="btn-primary">GET SENCI PRO</button>
              <button className="btn-secondary">WATCH DEMO</button>
            </div>
          </div>
          <div className="relative mt-2 lg:mt-0 flex justify-center items-center h-[300px] md:h-[500px]">
            <LottieAvatar />
          </div>
        </div>
      </section>

      <section className="mb-20 border-t border-[var(--glass-border)] pt-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-[var(--text-color)]">
        <StatCard label="App Size" value="12 MB" icon="Activity" delay="500" />
        <StatCard
          label="Success Rate"
          value="99.9%"
          icon="ShieldCheck"
          delay="600"
        />
        <StatCard label="Active Users" value="2.8M+" icon="Users" delay="700" />
      </section>

      <div className="mb-20">
        <WaterWaveGraph />
      </div>

      <AboutHowSection />

      <section className="mb-20">
        <SectionHeader
          title="Core Systems"
          subtitle="Advanced Features"
          centered
        />
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureDetail
            icon="Fingerprint"
            title="Silk Sensitivity"
            delay="100"
            content={
              <>
                Achieve absolute precision with our advanced Silk Engine.
                <br />
                Bypass device polling limits for zero-latency response.
                <br />
                Smooth out every flick and swipe with low-level tuning.
                <br />
                The definitive standard for professional mobile gaming.
              </>
            }
          />
          <FeatureDetail
            icon="ThermometerSnowflake"
            title="Thermal Balancing"
            delay="200"
            content={
              <>
                Maintain high frame rate with our predictive cooling.
                <br />
                Distribute the process load across all available cores.
                <br />
                Prevent thermal throttle during your longest sessions.
                <br />
                Stay at constant 120 FPS without hardware stuttering.
              </>
            }
          />
          <FeatureDetail
            icon="CloudLightning"
            title="Cloud Optima"
            delay="300"
            content={
              <>
                Get thousand of curated profiles for every device.
                <br />
                Get real-time updates based on global community data.
                <br />
                Eliminate trial-and-error with proven pro settings.
                <br />
                Perfectly tuned configurations delivered to your app.
              </>
            }
          />
        </div>
      </section>

      <section className="mb-20">
        <SectionHeader title="Performance Reports." subtitle="User Feedback" />
        <ReviewSlider />
      </section>

      <section className="mb-20 pb-4 text-[var(--text-color)]">
        <SectionHeader title="Got Questions?" subtitle="We’ve got answers" />
        <FAQSection />
      </section>

      <footer className="py-6 pb-2 border-t border-[var(--glass-border)] text-[var(--text-color)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)]">
          <p className="text-[var(--text-color)] text-[10px] tracking-[0.2em]">
            © 2024 SENCI SYSTEMS. ENGINEERED FOR SPEED.
          </p>
          <div className="flex items-center gap-10 text-[var(--muted-text)]">
            <a
              href="privacy.html"
              className="hover:text-[#007AFF] transition-colors"
            >
              Privacy
            </a>
            <a
              href="terms.html"
              className="hover:text-[#007AFF] transition-colors"
            >
              Terms
            </a>
            <a
              href="safety.html"
              className="hover:text-[#007AFF] transition-colors"
            >
              Safety Hub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
