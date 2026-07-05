import React, { useState, useEffect, useRef } from 'react';
import { useFestival } from '../../context/FestivalContext';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X } from 'lucide-react';

// Festival Action Effects Component (Overlaying the mascot)
const MascotActionEffects = ({ festivalName }) => {
  if (!festivalName) return null;
  const name = festivalName.toLowerCase();

  if (name.includes('diwali')) {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[60]">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`diwali-${i}`}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#FCD34D]"
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [1, 0], 
              scale: [1, 0.5],
              x: (Math.random() - 0.5) * 120,
              y: -10 - Math.random() * 100 
            }}
            transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "easeOut", delay: Math.random() * 2 }}
          />
        ))}
      </div>
    );
  }

  if (name.includes('holi')) {
    const colors = ['bg-pink-500', 'bg-purple-500', 'bg-yellow-400', 'bg-blue-400'];
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[60]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`holi-${i}`}
            className={`absolute w-3 h-3 rounded-full ${colors[i % colors.length]}`}
            initial={{ opacity: 1, scale: 0, y: 0, x: 0 }}
            animate={{ 
              opacity: [1, 0], 
              scale: [0, 1.5],
              y: -30 - Math.random() * 60,
              x: (Math.random() - 0.5) * 100
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: Math.random() * 1.5 }}
          />
        ))}
      </div>
    );
  }

  if (name.includes('children')) {
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400'];
    return (
      <div className="absolute inset-0 pointer-events-none z-[60]">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`balloon-${i}`}
            className={`absolute w-4 h-5 rounded-full ${colors[i % 3]} opacity-80`}
            initial={{ y: 20, x: (i - 1.5) * 15, opacity: 0 }}
            animate={{ y: -100, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
          >
            <div className="absolute -bottom-2 left-1/2 w-[1px] h-4 bg-gray-400"></div>
          </motion.div>
        ))}
      </div>
    );
  }
  
  if (name.includes('dussehra')) {
     return (
       <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[60]">
         <motion.div 
           className="w-12 h-1 bg-yellow-600 absolute"
           initial={{ x: -30, y: -10, opacity: 0 }}
           animate={{ x: 80, y: -30, opacity: [0, 1, 0] }}
           transition={{ duration: 1.2, repeat: Infinity, ease: "easeIn", delay: 0.5 }}
         >
           <div className="w-3 h-3 border-t-2 border-r-2 border-yellow-600 transform rotate-45 absolute -right-1 -top-1"></div>
         </motion.div>
       </div>
     );
  }

  return null;
};

const ChatbotMascot = () => {
  const { activeFestival } = useFestival();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-25deg", "25deg"]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position relative to the center of the window (-0.5 to 0.5)
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const getMascotImage = () => {
    if (!activeFestival) return '/mascots/mascot_default.png';
    const name = activeFestival.name.toLowerCase();
    if (name.includes('new year')) return '/mascots/mascot_newyear.png';
    if (name.includes('republic')) return '/mascots/mascot_republic.png';
    if (name.includes('holi')) return '/mascots/mascot_holi.png';
    if (name.includes('independence')) return '/mascots/mascot_independence.png';
    if (name.includes('raksha')) return '/mascots/mascot_raksha.png';
    if (name.includes('teacher')) return '/mascots/mascot_teachers.png';
    if (name.includes('ganesh')) return '/mascots/mascot_ganesh.png';
    if (name.includes('gandhi')) return '/mascots/mascot_gandhi.png';
    if (name.includes('dussehra')) return '/mascots/mascot_dussehra.png';
    if (name.includes('diwali')) return '/mascots/mascot_diwali.png';
    if (name.includes('children')) return '/mascots/mascot_childrens.png';
    if (name.includes('christmas')) return '/mascots/mascot_christmas.png';
    return '/mascots/mascot_default.png';
  };

  const getWelcomeMessage = () => {
    if (activeFestival) {
      return `Hello! ${activeFestival.message} I am the RMCP Academy Mascot. How can I help you today?`;
    }
    return "Hello! I am the RMCP Academy Mascot. Welcome to our school! How can I help you today?";
  };

  useEffect(() => {
    setMessages([{ sender: 'bot', text: getWelcomeMessage() }]);
  }, [activeFestival]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const faqs = [
    { q: "How do I apply for admission?", a: "You can apply for admission by navigating to our Admissions page from the main menu!" },
    { q: "What facilities do you offer?", a: "We offer state-of-the-art facilities including a Smart Auditorium, high-tech Labs, and extensive Sports facilities!" },
    { q: "Where is the school located?", a: "RMCP Academy is centrally located. Check the Footer for our address!" }
  ];

  const handleFAQClick = (faq) => {
    setMessages(prev => [...prev, { sender: 'user', text: faq.q }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: faq.a }]);
    }, 500);
  };

  const getContainerAnimation = () => {
    if (!activeFestival) return { y: [-4, 4, -4] };
    const name = activeFestival.name.toLowerCase();
    if (name.includes('holi')) return { y: [-15, 0, -15] }; // High Bounce
    if (name.includes('diwali')) return { x: [-3, 3, -3, 3, 0], y: [-4, 4, -4] }; // Shaking while floating
    return { y: [-4, 4, -4] }; // Default float
  };
  
  const getContainerTransition = () => {
    if (!activeFestival) return { duration: 3, repeat: Infinity, ease: "easeInOut" };
    const name = activeFestival.name.toLowerCase();
    if (name.includes('holi')) return { duration: 0.6, repeat: Infinity, ease: "easeOut" };
    if (name.includes('diwali')) return { duration: 0.3, repeat: Infinity, ease: "linear" };
    return { duration: 3, repeat: Infinity, ease: "easeInOut" };
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start" style={{ perspective: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 mb-4 flex flex-col overflow-hidden"
          >
            <div className="bg-[var(--app-brand-blue)] text-white p-4 flex justify-between items-center shadow-md z-10 transition-colors duration-300">
              <div className="flex items-center gap-3 relative">
                <motion.img 
                  animate={{ y: [-2, 2, -2] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src={getMascotImage()} 
                  alt="Mascot" 
                  className="w-10 h-10 rounded-full bg-white object-cover border-2 border-white shadow-sm" 
                />
                <div>
                  <h3 className="font-heading font-bold text-lg leading-tight">RMCP Mascot</h3>
                  <p className="text-xs opacity-80">Always here to help!</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <img src={getMascotImage()} alt="Mascot" className="w-6 h-6 rounded-full bg-white mr-2 self-end shadow-sm" />
                  )}
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[var(--app-brand-orange)] text-white rounded-br-sm' 
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-medium px-1">Ask me about:</p>
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFAQClick(faq)}
                    className="text-xs bg-[var(--app-brand-blue-light)] text-[var(--app-brand-blue-dark)] px-3 py-1.5 rounded-full hover:bg-[var(--app-brand-blue)] hover:text-white transition-colors border border-[var(--app-brand-blue)]/20 text-left"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 2.5D Mascot Button */}
      <motion.button
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[var(--app-brand-blue-light)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[3px] border-[var(--app-brand-blue)] cursor-pointer preserve-3d"
      >
        {/* Continuous Idle Float + Action Animations */}
        <motion.div 
          className="w-full h-full rounded-full overflow-hidden absolute inset-0 bg-white"
          animate={getContainerAnimation()}
          transition={getContainerTransition()}
        >
          <img 
            src={getMascotImage()} 
            alt="Mascot Bot" 
            className="w-full h-full object-cover relative z-20" 
          />
        </motion.div>
        
        {/* Dynamic Action Effects (Sparks, Splashes, etc) */}
        <MascotActionEffects festivalName={activeFestival?.name} />

        {/* Unread badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse z-30 shadow-md"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatbotMascot;
