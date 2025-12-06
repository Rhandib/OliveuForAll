import { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { Note, ChildProgress } from '../App';
import { NavigateFunction } from '../types/navigation';
import { Pencil, Gamepad2, Music, Video, Gift, ArrowLeft, Home, Smile, Timer, Clock, BookOpen } from 'lucide-react';

interface Props {
  notes: Note[];
  addNote: (text: string, author: 'parent' | 'child' | 'shared') => void;
  childProgress: ChildProgress;
  logEmotion: (emotion: string) => void;
  navigate: NavigateFunction;
}

const feelings = [
  { emoji: '😊', label: 'Happy', color: '#96AA9A' },
  { emoji: '😢', label: 'Sad', color: '#5E718B' },
  { emoji: '😠', label: 'Angry', color: '#E2A55E' },
  { emoji: '😰', label: 'Worried', color: '#F0ECE6' },
  { emoji: '😴', label: 'Tired', color: '#96AA9A' },
  { emoji: '😃', label: 'Excited', color: '#E2A55E' }
];

export default function ChildInterface({ notes, addNote, childProgress, logEmotion, navigate }: Props) {
  const { speak } = useAccessibility();
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const handleActivity = (activity: string) => {
    speak(`Opening ${activity} activity`);
    navigate(`/child/${activity.toLowerCase()}`);
  };

  const handleFeelingSelect = (feeling: typeof feelings[0]) => {
    setSelectedFeeling(feeling.label);
    speak(`I'm feeling ${feeling.label}`);
    addNote(`Child is feeling ${feeling.label}`, 'child');
    logEmotion(feeling.label);
  };

  const getTimeColor = () => {
    const percentage = (childProgress.totalTimeToday / childProgress.dailyTimeLimit) * 100;
    if (percentage < 50) return '#96AA9A'; // Sage green
    if (percentage < 75) return '#E2A55E'; // Warm orange
    return '#C85A54'; // Red
  };

  const getTimeRemaining = () => {
    return Math.max(0, childProgress.dailyTimeLimit - childProgress.totalTimeToday);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-green/10 to-calm-cream relative pb-24 canvas-texture">
      {/* Top Navigation Bar */}
      <div className="bg-calm-slate shadow-md paint-texture">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-calm-cream hover:text-warm-orange transition-colors min-w-[48px] min-h-[48px] -ml-2 pl-2 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg"
            aria-label="Go back to home"
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>
          <h2 className="text-calm-cream">Child Mode</h2>
          {/* Time Limit Indicator */}
          <button
            onClick={() => speak(`${getTimeRemaining()} minutes remaining today`)}
            className="flex items-center gap-2 bg-calm-cream/10 px-3 py-2 rounded-full hover:bg-calm-cream/20 transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-warm-orange"
            aria-label={`${getTimeRemaining()} minutes remaining today`}
            style={{ color: getTimeColor() }}
          >
            <Clock className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">{getTimeRemaining()}m</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        {/* Greeting */}
        <div className="text-center space-y-2">
          <h1 className="text-calm-slate">Hello Benny!</h1>
          <p className="text-forest-green/70">Let&apos;s explore together</p>
        </div>

        {/* Feelings Check-in Section */}
        <section className="bg-white rounded-3xl shadow-lg p-8 space-y-6 paper-texture" aria-label="Feelings Check-in">
          <h2 className="text-center text-calm-slate">How are you feeling today?</h2>
          
          {/* Large Featured Emotion Display */}
          <div className="flex justify-center">
            <div className="relative">
              {selectedFeeling ? (
                <div className="flex flex-col items-center animate-fade-in">
                  <video 
                    autoPlay 
                    loop 
                    playsInline
                    muted
                    className="w-48 h-48 object-cover rounded-full shadow-2xl mb-4"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(150, 170, 154, 0.6))',
                    }}
                  >
                    <source src="/_videos/v1/ae3d6cbb22295eef81256feff4cc46e140693165" />
                  </video>
                  <div 
                    className="px-8 py-3 rounded-full shadow-lg"
                    style={{ backgroundColor: feelings.find(f => f.label === selectedFeeling)?.color || '#96AA9A' }}
                  >
                    <p className="text-2xl text-white">
                      {feelings.find(f => f.label === selectedFeeling)?.emoji} {selectedFeeling}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-sage-green/30 to-calm-slate/30 rounded-full shadow-xl flex items-center justify-center">
                    <span className="text-7xl">😊</span>
                  </div>
                  <p className="text-center mt-4 text-calm-slate/60">
                    Choose a feeling
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Emotion Grid with SVG Faces */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
            {feelings.map((feeling) => (
              <button
                key={feeling.label}
                onClick={() => handleFeelingSelect(feeling)}
                onMouseEnter={() => speak(feeling.label)}
                className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-md transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 min-h-[120px] flex flex-col items-center justify-center ${
                  selectedFeeling === feeling.label ? 'ring-4 ring-calm-slate shadow-xl' : ''
                }`}
                aria-label={`I feel ${feeling.label}`}
                aria-pressed={selectedFeeling === feeling.label}
              >
                <svg width="60" height="60" viewBox="0 0 100 100" className="mb-2">
                  <defs>
                    <radialGradient id={`grad-${feeling.label}`} cx="50%" cy="50%">
                      <stop offset="0%" stopColor={feeling.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={feeling.color} stopOpacity="0.6" />
                    </radialGradient>
                  </defs>
                  
                  {/* Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill={`url(#grad-${feeling.label})`}
                  />
                  
                  {/* Face based on emotion */}
                  {feeling.label === 'Happy' && (
                    <g>
                      <path d="M 32 40 Q 35 35 38 40" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 62 40 Q 65 35 68 40" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 35 58 Q 50 70 65 58" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                  {feeling.label === 'Sad' && (
                    <g>
                      <path d="M 32 42 Q 35 38 38 42" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 62 42 Q 65 38 68 42" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 35 68 Q 50 60 65 68" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                  {feeling.label === 'Angry' && (
                    <g>
                      <path d="M 30 38 L 40 44" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 70 38 L 60 44" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 35 65 L 65 65" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                  {feeling.label === 'Worried' && (
                    <g>
                      <circle cx="35" cy="42" r="3" fill="#484848" />
                      <circle cx="65" cy="42" r="3" fill="#484848" />
                      <path d="M 38 65 Q 50 63 62 65" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                  {feeling.label === 'Tired' && (
                    <g>
                      <path d="M 32 42 L 38 42" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 62 42 L 68 42" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 40 62 Q 50 64 60 62" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                  {feeling.label === 'Excited' && (
                    <g>
                      <circle cx="35" cy="40" r="4" fill="#484848" />
                      <circle cx="65" cy="40" r="4" fill="#484848" />
                      <path d="M 32 55 Q 50 75 68 55" stroke="#484848" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                </svg>
                <span className="text-xs text-deep-black text-center">{feeling.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Sensory Corner Activities */}
        <section className="space-y-6" aria-label="Sensory Corner Activities">
          <h2 className="text-center text-calm-slate">Sensory Corner</h2>
          <p className="text-center text-forest-green/70 text-sm">Choose an activity to explore</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActivityCard
              icon={<Pencil className="w-12 h-12" />}
              label="Art Activity"
              description="Draw and create"
              color="#E2A55E"
              onClick={() => handleActivity('art')}
              onHover={() => speak('Art Activity')}
            />
            <ActivityCard
              icon={<Gamepad2 className="w-12 h-12" />}
              label="Games"
              description="Breathing & yoga"
              color="#96AA9A"
              onClick={() => handleActivity('games')}
              onHover={() => speak('Games Activity')}
            />
            <ActivityCard
              icon={<Music className="w-12 h-12" />}
              label="Music Station"
              description="Sounds & rhythms"
              color="#5E718B"
              onClick={() => handleActivity('music')}
              onHover={() => speak('Music Activity')}
            />
            <ActivityCard
              icon={<Video className="w-12 h-12" />}
              label="Video Corner"
              description="Watch & learn"
              color="#96AA9A"
              onClick={() => handleActivity('video')}
              onHover={() => speak('Video Activity')}
            />
            <ActivityCard
              icon={<Timer className="w-12 h-12" />}
              label="My Timer"
              description="Track your time"
              color="#3A5A41"
              onClick={() => handleActivity('timer')}
              onHover={() => speak('My Timer')}
            />
            <ActivityCard
              icon={<BookOpen className="w-12 h-12" />}
              label="Social Stories"
              description="Learn and explore"
              color="#5E718B"
              onClick={() => handleActivity('stories')}
              onHover={() => speak('Social Stories')}
            />
          </div>
          
          {/* Treasure Box - Full Width */}
          <div className="mt-4">
            <ActivityCard
              icon={<Gift className="w-12 h-12" />}
              label="Treasure Box"
              description="Your special rewards"
              color="#E2A55E"
              onClick={() => handleActivity('treasure')}
              onHover={() => speak('Treasure Box')}
              wide
            />
          </div>
        </section>
      </div>
      
      {/* Floating Emotions Button */}
      <button
        onClick={() => navigate('/emotions')}
        onMouseEnter={() => speak('My Feelings')}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-warm-orange to-sage-green text-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 z-10 paint-texture"
        aria-label="Open feelings selector"
      >
        <Smile className="w-7 h-7" aria-hidden="true" />
      </button>
    </div>
  );
}

interface ActivityCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
  onHover: () => void;
  wide?: boolean;
}

function ActivityCard({ icon, label, description, color, onClick, onHover, wide }: ActivityCardProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={`${wide ? 'md:col-span-2' : ''} bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 active:scale-[0.98] flex flex-col items-center gap-4 min-h-[160px] border-4 border-transparent hover:border-opacity-30 paper-texture`}
      style={{ 
        borderColor: color,
        borderOpacity: 0
      }}
      aria-label={`${label}: ${description}`}
    >
      <div className="p-4 rounded-2xl paint-texture" style={{ backgroundColor: color + '20', color: color }}>
        {icon}
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-deep-black">{label}</h3>
        <p className="text-sm text-forest-green/70">{description}</p>
      </div>
    </button>
  );
}