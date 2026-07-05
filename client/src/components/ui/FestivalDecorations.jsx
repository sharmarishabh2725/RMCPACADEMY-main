import React, { useMemo, useState, useEffect } from 'react';
import { useFestival } from '../../context/FestivalContext';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// --- Global Click Bursts ---
const GlobalClickBursts = ({ emojis }) => {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const id = Date.now() + Math.random();
      setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // Remove burst after animation
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {bursts.map(burst => (
          <React.Fragment key={burst.id}>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = 80 + Math.random() * 40;
              const xOffset = Math.cos(angle) * distance;
              const yOffset = Math.sin(angle) * distance;
              const emoji = emojis[Math.floor(Math.random() * emojis.length)];

              return (
                <motion.div
                  key={`${burst.id}-${i}`}
                  initial={{ x: burst.x, y: burst.y, scale: 0, opacity: 1 }}
                  animate={{ 
                    x: burst.x + xOffset, 
                    y: burst.y + yOffset, 
                    scale: [0, 1.5, 0.5], 
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute text-3xl"
                  style={{ left: '-15px', top: '-15px' }} // Center roughly
                >
                  {emoji}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Interactive Floating Emojis ---
const FloatingEmojis = ({ emojis, count = 20, direction = "up", duration = [5, 10], popEmojis = null }) => {
  const { width, height } = useWindowSize();
  const [poppedIds, setPoppedIds] = useState(new Set());

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * width,
      delay: Math.random() * 5,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * (duration[1] - duration[0]) + duration[0],
    }));
  }, [count, emojis, width, duration]);

  const handlePop = (id) => {
    setPoppedIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setPoppedIds(prev => {
        const next = new Set(prev);
        next.delete(id); // Respawn after a while
        return next;
      });
    }, 5000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => {
        const isPopped = poppedIds.has(p.id);
        const startY = direction === "up" ? height + 100 : -100;
        const endY = direction === "up" ? -100 : height + 100;
        const popEmoji = popEmojis ? popEmojis[Math.floor(Math.random() * popEmojis.length)] : p.emoji;

        return (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: startY, opacity: 0, scale: p.scale }}
            animate={isPopped ? {
              scale: 2, opacity: 0, rotate: p.rotate
            } : {
              y: endY,
              opacity: [0, 1, 1, 0],
              x: p.x + (Math.random() * 100 - 50),
              rotate: Math.random() * 360,
            }}
            transition={isPopped ? { duration: 0.3 } : {
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            whileHover={{ scale: p.scale * 1.5 }}
            onClick={() => handlePop(p.id)}
            className="absolute text-4xl drop-shadow-lg cursor-pointer pointer-events-auto"
          >
            {isPopped && popEmojis ? popEmoji : p.emoji}
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Diwali ---
const DiwaliDecorations = () => {
  const { width } = useWindowSize();
  const diyas = useMemo(() => {
    const diyaCount = Math.floor(width / 150);
    return Array.from({ length: diyaCount }).map((_, i) => ({
      id: i,
      left: `${(i / Math.max(diyaCount - 1, 1)) * 95 + 2.5}%`,
    }));
  }, [width]);

  return (
    <>
      <GlobalClickBursts emojis={['✨', '💥', '🎇', '💫']} />
      <FloatingEmojis emojis={['✨', '🎇', '💫']} count={25} direction="up" />
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[60] flex items-end">
        {diyas.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: d.id * 0.1 }}
            className="absolute text-5xl pointer-events-auto cursor-pointer"
            style={{ left: d.left, bottom: '15px' }}
            whileHover={{ scale: 1.5, y: -10 }}
            whileTap={{ scale: 0.8 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  'drop-shadow(0px 0px 5px rgba(255,165,0,0.8))',
                  'drop-shadow(0px 0px 20px rgba(255,165,0,1))',
                  'drop-shadow(0px 0px 5px rgba(255,165,0,0.8))',
                ]
              }}
              transition={{ repeat: Infinity, duration: 1.5 + Math.random() }}
            >
              🪔
            </motion.div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

// --- Holi ---
const HoliDecorations = () => {
  return (
    <>
      <GlobalClickBursts emojis={['💦', '🎨', '💥']} />
      <FloatingEmojis emojis={['🎈', '🎉', '🎨', '💦']} popEmojis={['💥', '💦']} count={30} direction="up" duration={[6, 12]} />
      <motion.div 
        className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-40 opacity-50 bg-[radial-gradient(circle,rgba(233,30,99,0.9)_0%,rgba(0,0,0,0)_70%)] blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div 
        className="fixed bottom-0 right-0 w-80 h-80 pointer-events-none z-40 opacity-50 bg-[radial-gradient(circle,rgba(156,39,176,0.9)_0%,rgba(0,0,0,0)_70%)] blur-2xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </>
  );
};

// --- Christmas ---
const ChristmasDecorations = () => {
  const { width, height } = useWindowSize();
  const [mousePos, setMousePos] = useState({ x: width / 2, y: height / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <GlobalClickBursts emojis={['❄️', '⭐', '🔔']} />
      <Confetti
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={150}
        gravity={0.05}
        wind={(mousePos.x - width / 2) / 5000} // Interactive wind!
        colors={['#ffffff', '#f8f9fa', '#e9ecef']}
        drawShape={(ctx) => {
          ctx.beginPath();
          ctx.arc(0, 0, Math.random() * 4 + 2, 0, 2 * Math.PI);
          ctx.fill();
        }}
        className="fixed inset-0 z-40 pointer-events-none"
      />
      <FloatingEmojis emojis={['⭐', '🌟', '❄️']} count={15} direction="down" duration={[10, 15]} />
    </>
  );
};

// --- Independence / Republic Day ---
const TriColorConfetti = () => {
  const { width, height } = useWindowSize();
  return (
    <>
      <GlobalClickBursts emojis={['🇮🇳', '🎉', '🎊']} />
      <Confetti
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={100}
        gravity={0.1}
        colors={['#FF9933', '#FFFFFF', '#138808']} // Saffron, White, Green
        className="fixed inset-0 z-40 pointer-events-none"
      />
    </>
  );
};

// --- New Year ---
const NewYearDecorations = () => {
  const { width, height } = useWindowSize();
  return (
    <>
      <GlobalClickBursts emojis={['🎆', '🎇', '✨', '🎉']} />
      <Confetti
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={120}
        gravity={0.12}
        colors={['#D4AF37', '#C0C0C0', '#FFD700', '#F5F5F5']} // Golds and Silvers
        className="fixed inset-0 z-40 pointer-events-none"
      />
      <FloatingEmojis emojis={['🎆', '🎇', '✨']} count={20} direction="up" />
    </>
  );
};

const FestivalDecorations = () => {
  const { activeFestival } = useFestival();

  if (!activeFestival) return null;

  const festivalName = activeFestival.name;

  return (
    <div className="festival-decorations">
      {festivalName.includes("Diwali") && <DiwaliDecorations />}
      {festivalName.includes("Holi") && <HoliDecorations />}
      {(festivalName.includes("Republic Day") || festivalName.includes("Independence Day")) && <TriColorConfetti />}
      {festivalName.includes("Christmas") && <ChristmasDecorations />}
      {festivalName.includes("New Year") && <NewYearDecorations />}
      {festivalName.includes("Dussehra") && (
        <>
          <GlobalClickBursts emojis={['🏵️', '🏹', '✨']} />
          <FloatingEmojis emojis={['🏵️', '🏹', '✨']} count={25} direction="down" />
        </>
      )}
      {festivalName.includes("Gandhi") && (
        <>
          <GlobalClickBursts emojis={['🕊️', '🌸', '🤍']} />
          <FloatingEmojis emojis={['🕊️', '🌸', '🤍']} count={20} direction="down" />
        </>
      )}
    </div>
  );
};

export default FestivalDecorations;

