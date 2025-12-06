import { useState, useEffect } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Gamepad2, RefreshCw, Star } from 'lucide-react';

const yogaPoses = [
  { name: 'Tree Pose', emoji: '🌳', instruction: 'Stand on one leg like a tree' },
  { name: 'Star Pose', emoji: '⭐', instruction: 'Stretch arms and legs wide like a star' },
  { name: 'Cat Pose', emoji: '🐱', instruction: 'Get on all fours and arch your back' },
  { name: 'Butterfly', emoji: '🦋', instruction: 'Sit and flutter your legs like wings' },
  { name: 'Mountain', emoji: '⛰️', instruction: 'Stand tall with arms up high' },
  { name: 'Boat Pose', emoji: '⛵', instruction: 'Balance on your bottom like a boat' }
];

const memoryCards = [
  { id: 1, emoji: '🌈', color: '#7CBEA1' },
  { id: 2, emoji: '🌟', color: '#CCBB75' },
  { id: 3, emoji: '🎨', color: '#80AEDF' },
  { id: 4, emoji: '🎵', color: '#8282AC' },
  { id: 5, emoji: '🦋', color: '#A05556' },
  { id: 6, emoji: '🌺', color: '#2E5580' }
];

interface Props {
  navigate: NavigateFunction;
}

export default function GamesActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [gameMode, setGameMode] = useState<'yoga' | 'memory' | 'breathing'>('yoga');
  const [currentPose, setCurrentPose] = useState(yogaPoses[0]);
  const [poseTimer, setPoseTimer] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'hold' | 'out' | 'hold2'>('in');
  const [breathingCount, setBreathingCount] = useState(4);

  // Shuffle and double cards for memory game
  const [cards, setCards] = useState(() => {
    const doubled = [...memoryCards, ...memoryCards];
    return doubled.sort(() => Math.random() - 0.5).map((card, index) => ({
      ...card,
      uniqueId: index
    }));
  });

  useEffect(() => {
    if (gameMode === 'yoga') {
      speak(currentPose.name);
    }
  }, [currentPose, gameMode, speak]);

  // Breathing exercise timer
  useEffect(() => {
    if (gameMode === 'breathing') {
      const interval = setInterval(() => {
        setBreathingCount((prev) => {
          if (prev === 1) {
            if (breathingPhase === 'in') {
              setBreathingPhase('hold');
              speak('Hold');
              return 4;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('out');
              speak('Breathe out');
              return 4;
            } else if (breathingPhase === 'out') {
              setBreathingPhase('hold2');
              speak('Hold');
              return 4;
            } else {
              setBreathingPhase('in');
              speak('Breathe in');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameMode, breathingPhase, speak]);

  const nextPose = () => {
    const currentIndex = yogaPoses.indexOf(currentPose);
    const nextIndex = (currentIndex + 1) % yogaPoses.length;
    setCurrentPose(yogaPoses[nextIndex]);
    setPoseTimer(0);
  };

  const handleCardClick = (uniqueId: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(uniqueId) || matchedCards.includes(uniqueId)) {
      return;
    }

    const newFlipped = [...flippedCards, uniqueId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.uniqueId === first);
      const secondCard = cards.find(c => c.uniqueId === second);

      if (firstCard?.id === secondCard?.id) {
        speak('Match found!');
        setMatchedCards([...matchedCards, first, second]);
        setFlippedCards([]);
      } else {
        speak('Try again');
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const resetMemoryGame = () => {
    const doubled = [...memoryCards, ...memoryCards];
    setCards(doubled.sort(() => Math.random() - 0.5).map((card, index) => ({
      ...card,
      uniqueId: index
    })));
    setFlippedCards([]);
    setMatchedCards([]);
    speak('Game reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5D5E4] to-[#B8C9D9] pb-20">
      {/* Header */}
      <div className="bg-[#1E1E1E] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/child')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Games & Movement</h1>
        <Gamepad2 className="w-5 h-5" />
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Game Mode Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex gap-2">
          <button
            onClick={() => { setGameMode('yoga'); speak('Yoga poses'); }}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              gameMode === 'yoga' ? 'bg-[#7CBEA1] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🧘 Yoga
          </button>
          <button
            onClick={() => { setGameMode('memory'); speak('Memory game'); }}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              gameMode === 'memory' ? 'bg-[#80AEDF] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🎮 Memory
          </button>
          <button
            onClick={() => { setGameMode('breathing'); speak('Breathing exercise'); }}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              gameMode === 'breathing' ? 'bg-[#CCBB75] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🌬️ Breathing
          </button>
        </div>

        {/* Yoga Mode */}
        {gameMode === 'yoga' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-8xl mb-6">{currentPose.emoji}</div>
            <h2 className="text-3xl text-[#2E5580] mb-4">{currentPose.name}</h2>
            <p className="text-xl text-gray-600 mb-8">{currentPose.instruction}</p>
            <button
              onClick={nextPose}
              className="bg-[#7CBEA1] hover:bg-[#6BAD90] text-white px-8 py-4 rounded-xl flex items-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Next Pose
            </button>
          </div>
        )}

        {/* Memory Game Mode */}
        {gameMode === 'memory' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-[#2E5580]">Memory Match</h2>
              <button
                onClick={resetMemoryGame}
                className="bg-[#80AEDF] hover:bg-[#6D9ACC] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card) => (
                <button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card.uniqueId)}
                  className={`aspect-square rounded-xl shadow-md transition-all transform hover:scale-105 ${
                    flippedCards.includes(card.uniqueId) || matchedCards.includes(card.uniqueId)
                      ? 'bg-white'
                      : 'bg-gradient-to-br from-[#2E5580] to-[#1E3A55]'
                  } ${matchedCards.includes(card.uniqueId) ? 'opacity-50' : ''}`}
                >
                  {(flippedCards.includes(card.uniqueId) || matchedCards.includes(card.uniqueId)) && (
                    <span className="text-4xl">{card.emoji}</span>
                  )}
                </button>
              ))}
            </div>
            {matchedCards.length === cards.length && (
              <div className="mt-6 text-center">
                <Star className="w-16 h-16 text-[#CCBB75] mx-auto mb-2" />
                <p className="text-2xl text-[#2E5580]">Great job! 🎉</p>
              </div>
            )}
          </div>
        )}

        {/* Breathing Mode */}
        {gameMode === 'breathing' && (
          <div className="bg-gradient-to-br from-calm-cream to-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl text-calm-slate text-center mb-2" style={{ color: '#2E5580', fontFamily: 'Uchen, serif' }}>Box Breathing Buddy</h2>
            <p className="text-center text-forest-green/70 mb-8">Follow the buddy around the box!</p>

            {/* Box Breathing Video Container */}
            <div className="relative bg-gradient-to-br from-sage-green/10 to-calm-slate/10 rounded-3xl p-12 mb-8">
              {/* The Box Path */}
              <svg className="w-full max-w-md mx-auto" viewBox="0 0 400 400" style={{ height: '400px' }}>
                <defs>
                  {/* Gradient for the box path */}
                  <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#96AA9A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#5E718B" stopOpacity="0.3" />
                  </linearGradient>

                  {/* Glow filter for buddy */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Box outline with rounded corners */}
                <rect
                  x="50"
                  y="50"
                  width="300"
                  height="300"
                  rx="30"
                  fill="none"
                  stroke="url(#boxGradient)"
                  strokeWidth="8"
                  strokeDasharray="20 10"
                  className="opacity-50"
                />

                {/* Corner Labels */}
                <text x="50" y="35" className="fill-calm-slate text-sm" textAnchor="middle" style={{ fontSize: '14px', fill: '#5E718B' }}>Start</text>
                <text x="350" y="35" className="fill-warm-orange text-sm" textAnchor="middle" style={{ fontSize: '14px', fill: '#E2A55E' }}>Hold</text>
                <text x="365" y="365" className="fill-calm-slate text-sm" textAnchor="start" style={{ fontSize: '14px', fill: '#5E718B' }}>Exhale</text>
                <text x="35" y="365" className="fill-warm-orange text-sm" textAnchor="end" style={{ fontSize: '14px', fill: '#E2A55E' }}>Hold</text>

                {/* Breathing Buddy - Video Character */}
                <foreignObject
                  className="transition-all duration-1000 ease-in-out overflow-visible"
                  width="100"
                  height="100"
                  x={
                    breathingPhase === 'in' ? 0 :
                    breathingPhase === 'hold' ? 300 :
                    breathingPhase === 'out' ? 300 :
                    0
                  }
                  y={
                    breathingPhase === 'in' ? 0 :
                    breathingPhase === 'hold' ? 0 :
                    breathingPhase === 'out' ? 300 :
                    300
                  }
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(150, 170, 154, 0.6))'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <video 
                      autoPlay 
                      loop 
                      playsInline
                      muted
                      className="w-24 h-24 object-cover rounded-full"
                      style={{
                        transform: breathingPhase === 'in' || breathingPhase === 'out' ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 1s ease-in-out'
                      }}
                    >
                      <source src="/_videos/v1/ae3d6cbb22295eef81256feff4cc46e140693165" />
                    </video>
                  </div>
                </foreignObject>

                {/* Progress dots showing which side we're on */}
                <circle cx="50" cy="50" r="6" fill={breathingPhase === 'in' ? '#E2A55E' : '#5E718B'} opacity="0.5" />
                <circle cx="350" cy="50" r="6" fill={breathingPhase === 'hold' ? '#E2A55E' : '#5E718B'} opacity="0.5" />
                <circle cx="350" cy="350" r="6" fill={breathingPhase === 'out' ? '#E2A55E' : '#5E718B'} opacity="0.5" />
                <circle cx="50" cy="350" r="6" fill={breathingPhase === 'hold2' ? '#E2A55E' : '#5E718B'} opacity="0.5" />
              </svg>
            </div>

            {/* Instruction Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="text-6xl mb-4 animate-pulse">{breathingCount}</div>
              <div className="text-2xl text-calm-slate mb-2">
                {breathingPhase === 'in' && '🌬️ Breathe In'}
                {breathingPhase === 'hold' && '⏸️ Hold Your Breath'}
                {breathingPhase === 'out' && '💨 Breathe Out'}
                {breathingPhase === 'hold2' && '⏸️ Hold Your Breath'}
              </div>
              <p className="text-forest-green/70">
                {breathingPhase === 'in' && 'Fill your lungs with air'}
                {breathingPhase === 'hold' && 'Keep the air inside'}
                {breathingPhase === 'out' && 'Let the air out slowly'}
                {breathingPhase === 'hold2' && 'Rest before breathing in'}
              </p>
            </div>

            {/* Info box */}
            <div className="mt-6 bg-sage-green/10 rounded-xl p-4 text-center">
              <p className="text-sm text-forest-green">
                💡 Box breathing helps you feel calm and focused. Follow the buddy around all 4 sides of the box!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}