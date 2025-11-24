import React, { useEffect, useState } from 'react';

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, color: string}>>([]);

  useEffect(() => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-20px] w-3 h-3 rounded-full animate-fall"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};