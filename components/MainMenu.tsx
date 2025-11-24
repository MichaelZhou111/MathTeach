import React from 'react';
import { MathOperation, Difficulty } from '../types';
import { Plus, Minus, X, Divide, Star, Zap, Trophy, CarFront, Gauge, Flag } from 'lucide-react';

interface MainMenuProps {
  onSelectMode: (op: MathOperation) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode, difficulty, setDifficulty }) => {
  const modes = [
    { op: MathOperation.ADD, label: '加法挑战', color: 'bg-red-500', shadow: 'shadow-red-800', icon: <Plus className="w-10 h-10" />, desc: "加油冲刺!" },
    { op: MathOperation.SUBTRACT, label: '减法挑战', color: 'bg-blue-500', shadow: 'shadow-blue-800', icon: <Minus className="w-10 h-10" />, desc: "倒车入库!" },
    { op: MathOperation.MULTIPLY, label: '乘法加速', color: 'bg-yellow-500', shadow: 'shadow-yellow-800', icon: <X className="w-10 h-10" />, desc: "极速狂飙!" },
    { op: MathOperation.DIVIDE, label: '除法分配', color: 'bg-purple-500', shadow: 'shadow-purple-800', icon: <Divide className="w-10 h-10" />, desc: "团队合作!" },
  ];

  const difficulties: { id: Difficulty; label: string; subLabel: string; icon: React.ReactNode; color: string }[] = [
    { id: 'easy', label: '新手', subLabel: '50 km/h', icon: <CarFront className="w-5 h-5" />, color: 'bg-green-500' },
    { id: 'medium', label: '车手', subLabel: '100 km/h', icon: <Gauge className="w-5 h-5" />, color: 'bg-orange-500' },
    { id: 'hard', label: '赛车神', subLabel: '300 km/h', icon: <Trophy className="w-5 h-5" />, color: 'bg-red-600' },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="text-center mb-8 relative">
        <div className="absolute -top-12 -left-12 animate-bounce hidden md:block">
            <span className="text-6xl">🏁</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] mb-2 tracking-tight italic transform -skew-x-12">
          小小赛车手
          <br/>
          <span className="text-yellow-300">算术大奖赛</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-medium bg-black/30 inline-block px-6 py-2 rounded-full backdrop-blur-md">
          准备好出发了吗？选一个速度开始吧！ 🏎️💨
        </p>
      </div>

      {/* Difficulty Selector - Styled like a gear shifter or speedometer settings */}
      <div className="bg-black/40 backdrop-blur-md p-3 rounded-3xl flex flex-wrap justify-center gap-3 mb-10 shadow-xl border-4 border-white/20">
        {difficulties.map((diff) => (
          <button
            key={diff.id}
            onClick={() => setDifficulty(diff.id)}
            className={`
              flex flex-col items-center justify-center px-6 py-3 rounded-2xl transition-all duration-200
              ${difficulty === diff.id 
                ? `${diff.color} text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] scale-105 ring-4 ring-white/50` 
                : 'bg-white/10 text-white/70 hover:bg-white/20'}
            `}
          >
            <div className="flex items-center gap-2 font-bold text-xl">
                {diff.icon}
                {diff.label}
            </div>
            <span className="text-xs opacity-80 font-mono">{diff.subLabel}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {modes.map((mode) => (
          <button
            key={mode.label}
            onClick={() => onSelectMode(mode.op)}
            className={`
              group relative overflow-hidden
              ${mode.color} hover:brightness-110
              text-white rounded-3xl p-6
              transition-all duration-200 transform hover:scale-[1.02] active:scale-95
              shadow-[0_8px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-[8px]
              flex flex-row items-center justify-between gap-4
              border-4 border-white/20
            `}
          >
             {/* Checkered flag pattern overlay */}
            <div className="absolute top-0 right-0 w-24 h-full opacity-10 skew-x-12 bg-[repeating-linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),repeating-linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>

            <div className="flex flex-col items-start z-10">
                <span className="text-3xl font-black tracking-wider italic">{mode.label}</span>
                <span className="text-sm font-medium opacity-90 bg-black/20 px-2 py-1 rounded mt-1">{mode.desc}</span>
            </div>
            
            <div className="bg-white/20 p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300 backdrop-blur-sm border-2 border-white/30 z-10">
              {mode.icon}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-12 flex gap-4 justify-center w-full">
         <div className="bg-yellow-400 p-1 rounded-2xl shadow-lg transform rotate-1">
             <div className="bg-white p-4 rounded-xl flex items-center gap-4 border-4 border-black">
                <span className="text-4xl">🏎️</span>
                <div className="text-left">
                    <p className="font-black text-gray-800 text-xs uppercase tracking-wider">你的教练</p>
                    <p className="font-bold text-red-600 text-lg">闪电赛车</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};