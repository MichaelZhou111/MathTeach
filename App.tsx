import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { MusicPlayer } from './components/MusicPlayer';
import { MathOperation, Difficulty } from './types';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<MathOperation | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  return (
    <div className="min-h-screen bg-[#2c3e50] overflow-x-hidden font-fredoka selection:bg-yellow-400 selection:text-black relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      {/* Decorative Road Line */}
      <div className="fixed inset-y-0 left-10 w-20 bg-black/20 border-x-4 border-dashed border-white/10 hidden xl:block pointer-events-none"></div>
      <div className="fixed inset-y-0 right-10 w-20 bg-black/20 border-x-4 border-dashed border-white/10 hidden xl:block pointer-events-none"></div>

      {/* Background Music Player */}
      <MusicPlayer />

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        
        {/* Content Area */}
        <main className="flex-grow flex flex-col justify-center">
          {currentMode ? (
            <GameBoard 
              operation={currentMode} 
              difficulty={difficulty}
              onBack={() => setCurrentMode(null)} 
            />
          ) : (
            <MainMenu 
              onSelectMode={setCurrentMode} 
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-white/40 text-sm py-4 font-medium mt-8">
          <p>为小小赛车手精心制作 • Gemini AI 驱动引擎</p>
        </footer>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .font-fredoka {
            font-family: 'Fredoka', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;
