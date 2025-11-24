import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, Volume2, Trophy, Flag } from 'lucide-react';
import { MathOperation, MathProblem, GameState, Difficulty } from '../types';
import { generateProblem } from '../utils/mathUtils';
import { generateMathStory, generateCheer } from '../services/geminiService';
import { Button } from './Button';
import { Confetti } from './Confetti';

interface GameBoardProps {
  operation: MathOperation;
  difficulty: Difficulty;
  onBack: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ operation, difficulty, onBack }) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [story, setStory] = useState<string>("");
  const [loadingStory, setLoadingStory] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  
  const [stats, setStats] = useState<GameState>({
    score: 0,
    streak: 0,
    level: 1,
    stars: 0
  });

  // Initial load
  useEffect(() => {
    loadNewProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, difficulty]);

  // Fetch story when problem changes
  useEffect(() => {
    if (problem) {
      setLoadingStory(true);
      generateMathStory(problem).then((text) => {
        setStory(text);
        setLoadingStory(false);
      });
    }
  }, [problem]);

  const loadNewProblem = () => {
    const newProblem = generateProblem(operation, difficulty);
    setProblem(newProblem);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback("");
  };

  // Simulate a car horn sound using Web Audio API
  const playHornSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const t = ctx.currentTime;

      // Create two oscillators for a discordant "honk" sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sawtooth wave sounds raspy like a horn
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      // Use two frequencies that create a "honk" texture (e.g., ~200Hz and ~250Hz)
      osc1.frequency.setValueAtTime(180, t);
      osc2.frequency.setValueAtTime(235, t);

      // Volume envelope: attack fast, decay quickly
      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      // Connect nodes
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      // Play
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.4);
      osc2.stop(t + 0.4);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleOptionClick = async (option: number) => {
    if (!problem || selectedOption !== null) return; // Prevent double clicks
    
    setSelectedOption(option);
    
    if (option === problem.answer) {
      setIsCorrect(true);
      const cheer = await generateCheer();
      setFeedback(cheer);
      setStats(prev => ({
        ...prev,
        score: prev.score + 10,
        streak: prev.streak + 1,
        stars: prev.stars + 1
      }));
      
      // Auto advance after success
      setTimeout(() => {
        loadNewProblem();
      }, 2500);
    } else {
      setIsCorrect(false);
      playHornSound(); // Play the honk sound
      setFeedback("哎呀！轮胎打滑了，再试一次！ 🔧");
      setStats(prev => ({
        ...prev,
        streak: 0
      }));
      // Allow retrying after a short delay
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        setFeedback("");
      }, 1500);
    }
  };

  const speakStory = () => {
    if (!story) return;
    const utterance = new SpeechSynthesisUtterance(story);
    utterance.lang = 'zh-CN'; // Set language to Chinese
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // Calculate progress for visual track (simple loop every 5 stars)
  const trackProgress = (stats.streak % 6) * 20; 

  if (!problem) return <div className="flex justify-center items-center h-full"><RefreshCw className="animate-spin w-12 h-12 text-white" /></div>;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full animate-fadeIn p-4">
      {isCorrect && <Confetti />}
      
      {/* Header Stats & Navigation */}
      <div className="w-full flex justify-between items-center mb-6 bg-black/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border-b-4 border-gray-600">
        <button onClick={onBack} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Race Progress Bar */}
        <div className="flex-1 mx-4 h-8 bg-gray-800 rounded-full relative overflow-hidden border-2 border-gray-600">
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-30">
                {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-full bg-gray-600 transform skew-x-12"></div>)}
            </div>
            <div 
                className="h-full bg-gradient-to-r from-green-500 to-yellow-400 transition-all duration-500 ease-out flex items-center justify-end pr-1"
                style={{ width: `${Math.max(5, Math.min(100, trackProgress))}%` }}
            >
                <span className="text-xl drop-shadow-md transform translate-x-3">🏎️</span>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-xl border-b-4 border-yellow-600 shadow-lg transform -rotate-1">
            <Trophy className="w-5 h-5 text-yellow-800" />
            <span className="font-black text-yellow-900 text-xl">{stats.stars}</span>
        </div>
      </div>

      {/* AI Story Card - Dashboard Style */}
      <div className="w-full bg-gray-900 text-white rounded-3xl p-6 shadow-2xl mb-6 border-4 border-gray-700 relative overflow-hidden">
        {/* Glossy reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        
        <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 rounded-bl-2xl z-10">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 领航员播报
            </span>
        </div>
        
        <div className="flex flex-col items-center text-center min-h-[80px] justify-center relative z-10">
            {loadingStory ? (
                <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                    <Sparkles className="w-5 h-5" />
                    <span>正在接收赛道指令...</span>
                </div>
            ) : (
                <div className="relative group w-full">
                    <p className="text-xl md:text-2xl text-white font-medium leading-relaxed cursor-pointer drop-shadow-md" onClick={speakStory}>
                        {story}
                    </p>
                     <button 
                        onClick={speakStory}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 bg-white/10 hover:bg-white/20 rounded-full transition-all opacity-60 group-hover:opacity-100"
                        title="朗读"
                    >
                        <Volume2 className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Main Math Problem - License Plate Style */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 w-full">
        <div className="flex-1 h-28 md:h-32 flex items-center justify-center bg-yellow-300 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.2)] border-4 border-black relative">
            <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <span className="text-6xl md:text-7xl font-black text-black font-mono tracking-tighter">{problem.num1}</span>
        </div>
        
        <span className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">{operation}</span>
        
        <div className="flex-1 h-28 md:h-32 flex items-center justify-center bg-yellow-300 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.2)] border-4 border-black relative">
            <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
            <span className="text-6xl md:text-7xl font-black text-black font-mono tracking-tighter">{problem.num2}</span>
        </div>
        
        <span className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">=</span>
        
        {/* High Contrast Answer Box */}
        <div className={`flex-1 h-28 md:h-32 flex items-center justify-center rounded-lg border-4 transition-all duration-300 relative ${
            isCorrect === true ? 'bg-green-500 border-green-800 shadow-[0_0_30px_rgba(74,222,128,0.6)]' : 
            isCorrect === false ? 'bg-red-500 border-red-800' : 'bg-white border-gray-800'
        }`}>
             {isCorrect === true && <Flag className="absolute -top-6 -right-4 text-green-300 w-10 h-10 animate-bounce" />}
             {/* Using pure black for question mark and text when not selected for maximum contrast */}
            <span className={`text-6xl md:text-7xl font-black font-mono tracking-tighter ${
              isCorrect ? 'text-white' : 'text-black'
            }`}>
                {isCorrect ? problem.answer : '?'}
            </span>
        </div>
      </div>

      {/* Feedback Message */}
      <div className={`h-12 mb-4 text-center transition-all transform ${feedback ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <span className={`text-xl md:text-2xl font-black px-8 py-2 rounded-full shadow-xl border-2 ${
            isCorrect === true ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'
        }`}>
            {feedback}
        </span>
      </div>

      {/* Options Grid - High Contrast */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 w-full">
        {problem.options.map((option, idx) => (
          <Button
            key={`${problem.id}-opt-${idx}`}
            onClick={() => handleOptionClick(option)}
            size="xl"
            variant={
                selectedOption === option 
                    ? (option === problem.answer ? 'success' : 'danger') 
                    : 'primary'
            }
            className={`text-4xl md:text-5xl font-black py-6 md:py-8 shadow-xl border-b-8 active:border-b-0 active:translate-y-2 transition-all
                ${selectedOption === null ? 'bg-white text-black border-gray-800 hover:bg-gray-100 ring-2 ring-black/10' : ''}
            `}
            disabled={selectedOption !== null && selectedOption !== option}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
