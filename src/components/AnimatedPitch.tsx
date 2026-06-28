import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Player {
  id: number;
  name: string;
  number: string;
  position: string;
  x: number; // percentage left
  y: number; // percentage top
}

export default function AnimatedPitch() {
  const [ballOwner, setBallOwner] = useState(0); // Index of the player holding the ball
  const [isPassing, setIsPassing] = useState(false);
  const [passTarget, setPassTarget] = useState(0);

  // Stateful positions for players strategically clearing the center circle logo
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Kabo", number: "8", position: "MID", x: 15, y: 72 },     // Bottom Left
    { id: 2, name: "Tshepo", number: "11", position: "LW", x: 18, y: 24 },    // Top Left
    { id: 3, name: "Luka", number: "9", position: "ST", x: 82, y: 24 },      // Top Right
    { id: 4, name: "Sipho", number: "7", position: "RW", x: 85, y: 72 },      // Bottom Right
  ]);

  // Practice session training drill coordinates: players jog/run within their designated quadrants
  useEffect(() => {
    const drillInterval = setInterval(() => {
      setPlayers((currentPlayers) =>
        currentPlayers.map((p) => {
          // 65% chance a player decides to adjust position/jog in the practice session
          if (Math.random() > 0.65) return p;

          let newX = p.x;
          let newY = p.y;

          // Define safe boundaries for each player position to keep center logo clear
          if (p.id === 1) { // Kabo (MID, Bottom Left quadrant)
            newX = Math.floor(Math.random() * (26 - 12 + 1)) + 12;
            newY = Math.floor(Math.random() * (78 - 62 + 1)) + 62;
          } else if (p.id === 2) { // Tshepo (LW, Top Left quadrant)
            newX = Math.floor(Math.random() * (26 - 12 + 1)) + 12;
            newY = Math.floor(Math.random() * (36 - 18 + 1)) + 18;
          } else if (p.id === 3) { // Luka (ST, Top Right quadrant)
            newX = Math.floor(Math.random() * (88 - 74 + 1)) + 74;
            newY = Math.floor(Math.random() * (36 - 18 + 1)) + 18;
          } else if (p.id === 4) { // Sipho (RW, Bottom Right quadrant)
            newX = Math.floor(Math.random() * (88 - 74 + 1)) + 74;
            newY = Math.floor(Math.random() * (78 - 62 + 1)) + 62;
          }

          return { ...p, x: newX, y: newY };
        })
      );
    }, 2500);

    return () => clearInterval(drillInterval);
  }, []);

  useEffect(() => {
    // Pass the ball every 3.2 seconds
    const interval = setInterval(() => {
      if (isPassing) return;

      const nextTarget = (ballOwner + 1) % players.length;
      setPassTarget(nextTarget);
      setIsPassing(true);

      // Pass duration is 0.9 seconds
      setTimeout(() => {
        setBallOwner(nextTarget);
        setIsPassing(false);
      }, 900);
    }, 3200);

    return () => clearInterval(interval);
  }, [ballOwner, isPassing, players.length]);

  // Determine current ball absolute display position
  const getBallCoordinates = () => {
    if (isPassing) {
      return players[passTarget];
    }
    return players[ballOwner];
  };

  const ballPos = getBallCoordinates();

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center shrink-0">
      {/* Soccer Pitch Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center select-none"
        style={{ backgroundImage: "url('https://donotdelete.wonderlandstudio.co.za/legends/SoccerPitch.jpg')" }}
      />
      
      {/* Overlay to darken slightly and enhance high-contrast UI details */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* SVG Vector Passing Lines connecting the players (subtle design accent) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <defs>
          <linearGradient id="passGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {players.map((p, idx) => {
          const nextPlayer = players[(idx + 1) % players.length];
          const isCurrentPassPath = isPassing && ballOwner === idx && passTarget === (idx + 1) % players.length;

          return (
            <g key={`path-${p.id}`}>
              {/* Permanent elegant faint line */}
              <line
                x1={`${p.x}%`}
                y1={`${p.y}%`}
                x2={`${nextPlayer.x}%`}
                y2={`${nextPlayer.y}%`}
                stroke="white"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                className="opacity-25"
              />
              {/* Highlight line when passing */}
              {isCurrentPassPath && (
                <motion.line
                  x1={`${p.x}%`}
                  y1={`${p.y}%`}
                  x2={`${nextPlayer.x}%`}
                  y2={`${nextPlayer.y}%`}
                  stroke="url(#passGradient)"
                  strokeWidth="3"
                  initial={{ strokeDasharray: "10 100", strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Animated Players */}
      {players.map((p, idx) => {
        const hasBall = ballOwner === idx && !isPassing;
        const isReceiving = passTarget === idx && isPassing;
        const isKicking = ballOwner === idx && isPassing;

        return (
          <motion.div
            key={p.id}
            className="absolute z-10 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300"
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 0.5,
            }}
            style={{
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.05, opacity: 0.8 }}
            animate={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: hasBall ? 0.8 : 0.45,
              ...(hasBall
                ? {
                    y: [0, -2, 0],
                    scale: 1.01,
                  }
                : isReceiving
                ? {
                    scale: [1, 1.05, 1],
                  }
                : isKicking
                ? {
                    scale: [1, 0.95, 1.02, 1],
                  }
                : { y: 0, scale: 1 })
            }}
            transition={{
              left: { type: "spring", stiffness: 35, damping: 15 },
              top: { type: "spring", stiffness: 35, damping: 15 },
              y: hasBall
                ? {
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }
                : { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
          >
            {/* Player Aura/Glow */}
            <div className="relative flex items-center justify-center">
              <span className={`absolute -inset-2 rounded-full blur-md transition-opacity duration-500 ${
                hasBall 
                  ? "bg-emerald-500/10 opacity-40 animate-pulse" 
                  : isReceiving 
                  ? "bg-emerald-500/10 opacity-30" 
                  : "bg-transparent opacity-0"
              }`} />

              {/* Jersey Badge Container */}
              <div className={`relative h-12 w-12 md:h-15 md:w-15 rounded-full flex items-center justify-center shadow-md border bg-slate-950/40 backdrop-blur-xs select-none transition-all duration-300 ${
                hasBall ? "border-emerald-500/40" : "border-white/10"
              }`}>
                {/* Custom Stylized Football Jersey SVG */}
                <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none">
                  {/* Jersey Body - subtle green-grey */}
                  <path 
                    d="M6 5 L9 2.5 L15 2.5 L18 5 L20 7 L17 9.5 L15 7.5 L15 21 L9 21 L9 7.5 L7 9.5 L4 7 Z" 
                    fill="#526352" 
                    stroke="#94a3b8" 
                    strokeWidth="0.75" 
                  />
                  {/* Jersey Stripes/Details - subtle grey and a tiny red accent */}
                  <path d="M11 2.5 L11 21" stroke="#94a3b8" strokeWidth="0.5" opacity="0.4" />
                  <path d="M13 2.5 L13 21" stroke="#d22630" strokeWidth="0.5" opacity="0.5" />
                  <path d="M10 2.5 L12 5 L14 2.5" stroke="#94a3b8" strokeWidth="0.75" />
                </svg>

                {/* Jersey Number */}
                <span className="absolute bottom-1 right-1 text-[7px] font-mono font-bold px-1 py-0.2 rounded-sm bg-white/40 text-slate-900 leading-none">
                  {p.number}
                </span>
              </div>
            </div>

            {/* Player Information Tag */}
            <div className="mt-1 flex flex-col items-center bg-slate-950/30 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/5 shadow-xs">
              <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-wider text-white/70 uppercase leading-none">
                {p.name}
              </span>
              <span className="text-[7px] md:text-[8px] font-mono text-slate-400/80 uppercase tracking-widest leading-none mt-0.5">
                {p.position}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* The Animated Soccer Ball */}
      <motion.div
        className="absolute z-20 pointer-events-none opacity-50"
        animate={{
          left: `${ballPos.x}%`,
          top: `${ballPos.y}%`,
          rotate: isPassing ? 720 : [0, 4, -4, 0],
          scale: isPassing ? [1, 1.4, 1] : [1, 1.03, 1],
        }}
        transition={
          isPassing
            ? {
                duration: 0.9,
                ease: "easeInOut",
              }
            : {
                rotate: { repeat: Infinity, duration: 2 },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              }
        }
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative">
          {/* Subtle realistic drop shadow for the ball that changes with the ball's height (scale) */}
          <motion.div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-xs"
            animate={
              isPassing 
                ? { scale: [1, 0.6, 1], opacity: [0.6, 0.3, 0.6], blur: ["1px", "3px", "1px"] }
                : { scale: 1, opacity: 0.6 }
            }
            transition={{ duration: 0.9 }}
          />

          {/* High-fidelity Soccer Ball SVG representation - subtle grey/green style */}
          <svg 
            className="w-5 h-5 md:w-6.5 md:h-6.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] select-none" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <circle cx="12" cy="12" r="10" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" opacity="0.9" />
            
            {/* Pentagons & Seams */}
            <path d="M12 2 L9.5 5.5 L12 7.5 L14.5 5.5 Z" fill="#475569" opacity="0.8" />
            <path d="M4.5 12 L7 10 L8.5 12.5 L6.5 14.5 Z" fill="#475569" opacity="0.8" />
            <path d="M19.5 12 L17 10 L15.5 12.5 L17.5 14.5 Z" fill="#475569" opacity="0.8" />
            <path d="M12 22 L9.5 18.5 L12 16.5 L14.5 18.5 Z" fill="#475569" opacity="0.8" />
          </svg>
        </div>
      </motion.div>

      {/* Logo overlay in the center of the soccer pitch - brought to front */}
      <div className="absolute z-25 inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center h-52 w-52 md:h-72 md:w-72">
          {/* SVG Curved Text around the logo */}
          <svg 
            className="absolute inset-0 w-full h-full select-none animate-[spin_40s_linear_infinite]" 
            viewBox="0 0 200 200"
          >
            <defs>
              {/* Upper curve path for top text (clockwise) */}
              <path 
                id="curve-top" 
                d="M 18,100 A 82,82 0 0,1 182,100" 
                fill="none" 
              />
              {/* Lower curve path for bottom text (clockwise) */}
              <path 
                id="curve-bottom" 
                d="M 182,100 A 82,82 0 0,1 18,100" 
                fill="none" 
              />
            </defs>
            
            {/* Upper Text */}
            <text className="font-sans font-black tracking-[0.25em] text-[18px] uppercase fill-brand-red drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
                Soccer
              </textPath>
            </text>
            
            {/* Bottom Text */}
            <text className="font-sans font-black tracking-[0.25em] text-[18px] uppercase fill-brand-red drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
                Legends
              </textPath>
            </text>
          </svg>

          <img 
            src="http://donotdelete.wonderlandstudio.co.za/legends/LegendsFootballAcademyLogo.png" 
            referrerPolicy="no-referrer"
            alt="Legends Academy Center Logo" 
            className="absolute h-24 w-24 md:h-36 md:w-36 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] select-none"
          />
        </div>
      </div>
      
      {/* Scroll Down Hint Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <button
          onClick={() => {
            const formContainer = document.querySelector(".overflow-y-auto");
            if (formContainer) {
              formContainer.scrollBy({ top: 400, behavior: "smooth" });
            }
          }}
          className="group pointer-events-auto flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
          title="Scroll down to registration form"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 group-hover:opacity-100 select-none">
            Scroll Down
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="p-1.5 rounded-full bg-slate-900/80 border border-white/15 group-hover:bg-slate-900 group-hover:border-white/30 backdrop-blur-md transition-all duration-200 shadow-lg"
          >
            <svg 
              className="w-4 h-4 text-brand-red" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3.5" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </button>
      </div>
      
      {/* Graphical elements matching the image */}
      <div className="absolute bottom-8 left-8 flex space-x-4 opacity-30">
        <div className="w-16 h-1.5 bg-white/50 rounded-full overflow-hidden">
          <div className="h-full bg-white w-2/3"></div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 flex space-x-4 opacity-30">
        <div className="w-16 h-1.5 bg-white/50 rounded-full overflow-hidden">
          <div className="h-full bg-white w-1/3"></div>
        </div>
      </div>
    </section>
  );
}
