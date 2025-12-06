import { useState, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { NavigateFunction } from '../types/navigation';
import { Home, TrendingUp } from 'lucide-react';

interface Emotion {
  id: string;
  name: string;
  color: string;
  face: {
    leftEye: string;
    rightEye: string;
    mouth: string;
  };
  intensity: number;
}

const emotions: Emotion[] = [
  {
    id: 'calm',
    name: 'Calm',
    color: '#789FC9',
    face: {
      leftEye: 'M 35 42 Q 38 38 41 42',
      rightEye: 'M 59 42 Q 62 38 65 42',
      mouth: 'M 40 62 Q 50 68 60 62'
    },
    intensity: 3
  },
  {
    id: 'happy',
    name: 'Happy',
    color: '#E2A55E',
    face: {
      leftEye: 'M 32 40 Q 35 35 38 40',
      rightEye: 'M 62 40 Q 65 35 68 40',
      mouth: 'M 35 58 Q 50 70 65 58'
    },
    intensity: 5
  },
  {
    id: 'excited',
    name: 'Excited',
    color: '#96AA9A',
    face: {
      leftEye: 'M 35 40 A 3 3 0 1 1 35 40.01',
      rightEye: 'M 65 40 A 3 3 0 1 1 65 40.01',
      mouth: 'M 32 55 Q 50 75 68 55'
    },
    intensity: 7
  },
  {
    id: 'sad',
    name: 'Sad',
    color: '#5E718B',
    face: {
      leftEye: 'M 32 42 Q 35 38 38 42',
      rightEye: 'M 62 42 Q 65 38 68 42',
      mouth: 'M 35 68 Q 50 60 65 68'
    },
    intensity: 2
  },
  {
    id: 'angry',
    name: 'Angry',
    color: '#C85A54',
    face: {
      leftEye: 'M 30 38 L 40 44',
      rightEye: 'M 70 38 L 60 44',
      mouth: 'M 35 65 L 65 65'
    },
    intensity: 1
  },
  {
    id: 'worried',
    name: 'Worried',
    color: '#8B7A5E',
    face: {
      leftEye: 'M 35 42 A 3 3 0 1 1 35 42.01',
      rightEye: 'M 65 42 A 3 3 0 1 1 65 42.01',
      mouth: 'M 38 65 Q 50 63 62 65'
    },
    intensity: 2
  },
  {
    id: 'scared',
    name: 'Scared',
    color: '#9B8BA4',
    face: {
      leftEye: 'M 35 40 A 4 4 0 1 1 35 40.01',
      rightEye: 'M 65 40 A 4 4 0 1 1 65 40.01',
      mouth: 'M 45 60 A 5 5 0 1 1 55 60 A 5 5 0 1 1 45 60'
    },
    intensity: 1
  },
  {
    id: 'tired',
    name: 'Tired',
    color: '#96AA9A',
    face: {
      leftEye: 'M 32 42 L 38 42',
      rightEye: 'M 62 42 L 68 42',
      mouth: 'M 40 62 Q 50 64 60 62'
    },
    intensity: 3
  }
];

interface EmotionLog {
  emotion: string;
  timestamp: Date;
  id: string;
}

interface Props {
  navigate: NavigateFunction;
}

export default function EmotionsSelector({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [emotionLog, setEmotionLog] = useState<EmotionLog[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    speak('How are you feeling today?');
    loadEmotionLog();
  }, [speak]);

  const loadEmotionLog = () => {
    try {
      const saved = localStorage.getItem('emotion-log');
      if (saved) {
        const parsed = JSON.parse(saved);
        setEmotionLog(parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
      }
    } catch (error) {
      console.log('No emotion log found');
    }
  };

  const saveEmotionLog = (log: EmotionLog[]) => {
    try {
      localStorage.setItem('emotion-log', JSON.stringify(log));
    } catch (error) {
      console.error('Error saving emotion log:', error);
    }
  };

  const selectEmotion = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    speak(`You selected ${emotion.name}`);
    
    const newLog: EmotionLog = {
      emotion: emotion.id,
      timestamp: new Date(),
      id: Date.now().toString()
    };
    
    const updatedLog = [newLog, ...emotionLog];
    setEmotionLog(updatedLog);
    saveEmotionLog(updatedLog);
    
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const getTodayEmotions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return emotionLog.filter(log => {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green/20 to-calm-cream pb-20 canvas-texture">
      {/* Header */}
      <div className="bg-calm-slate text-calm-cream p-4 shadow-md paint-texture">
        <button 
          onClick={() => navigate('/child')} 
          className="flex items-center gap-2 hover:text-warm-orange transition-colors min-h-[48px] -ml-2 pl-2 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg mb-3"
          aria-label="Go back to activities"
        >
          <Home className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-center text-[36px]">Hello Benny!</h1>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Main Question */}
        <div className="text-center space-y-4">
          <h2 className="text-calm-slate">How are you feeling today?</h2>
          {selectedEmotion && showConfirmation && (
            <div className="bg-sage-green/20 border-2 border-sage-green rounded-3xl p-4 animate-pulse">
              <p className="text-forest-green">
                Thank you for sharing! You&apos;re feeling <strong>{selectedEmotion.name}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Large Featured Emotion Display */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width="210" height="210" viewBox="0 0 210 210" className="drop-shadow-2xl">
              {/* Background Circle with Texture */}
              <defs>
                <filter id="texture" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="1.25" numOctaves="3" seed="7590" />
                  <feColorMatrix type="luminanceToAlpha" />
                  <feComponentTransfer>
                    <feFuncA type="discrete" />
                  </feComponentTransfer>
                </filter>
                <radialGradient id="faceGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor={selectedEmotion?.color || '#789FC9'} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={selectedEmotion?.color || '#789FC9'} stopOpacity="0.6" />
                </radialGradient>
              </defs>
              
              {/* Main Circle */}
              <circle
                cx="105"
                cy="105"
                r="98"
                fill="url(#faceGradient)"
                filter="url(#texture)"
                className="transition-all duration-500"
              />
              
              {/* Face Elements */}
              {selectedEmotion && (
                <g className="animate-fade-in">
                  {/* Left Eye */}
                  <path
                    d={selectedEmotion.face.leftEye}
                    stroke="#484848"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Right Eye */}
                  <path
                    d={selectedEmotion.face.rightEye}
                    stroke="#484848"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Mouth */}
                  <path
                    d={selectedEmotion.face.mouth}
                    stroke="#484848"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </svg>
            
            {selectedEmotion && (
              <p className="text-center mt-4 text-calm-slate animate-fade-in">
                {selectedEmotion.name}
              </p>
            )}
          </div>
        </div>

        {/* Emotion Grid */}
        <div>
          <h3 className="text-center text-forest-green/70 mb-4">Tap how you feel:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => selectEmotion(emotion)}
                onMouseEnter={() => speak(emotion.name)}
                className={`bg-white rounded-3xl p-6 shadow-lg transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 paper-texture ${
                  selectedEmotion?.id === emotion.id ? 'ring-4 ring-calm-slate' : ''
                }`}
                aria-label={`I feel ${emotion.name}`}
                aria-pressed={selectedEmotion?.id === emotion.id}
              >
                <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto mb-3">
                  <defs>
                    <radialGradient id={`grad-${emotion.id}`} cx="50%" cy="50%">
                      <stop offset="0%" stopColor={emotion.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={emotion.color} stopOpacity="0.6" />
                    </radialGradient>
                  </defs>
                  
                  {/* Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill={`url(#grad-${emotion.id})`}
                  />
                  
                  {/* Face */}
                  <g>
                    <path
                      d={emotion.face.leftEye}
                      stroke="#484848"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={emotion.face.rightEye}
                      stroke="#484848"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={emotion.face.mouth}
                      stroke="#484848"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
                <p className="text-center text-deep-black">{emotion.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Emotions Summary */}
        {getTodayEmotions().length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-calm-slate">Today&apos;s Feelings</h3>
              <TrendingUp className="w-6 h-6 text-sage-green" aria-hidden="true" />
            </div>
            
            <div className="space-y-3">
              {getTodayEmotions().slice(0, 5).map((log) => {
                const emotion = emotions.find(e => e.id === log.emotion);
                if (!emotion) return null;
                
                return (
                  <div 
                    key={log.id}
                    className="flex items-center gap-4 p-3 bg-sage-green/5 rounded-2xl border border-sage-green/20"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: emotion.color + '40' }}
                    >
                      <svg width="48" height="48" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill={emotion.color} opacity="0.6" />
                        <g transform="scale(0.8) translate(10, 10)">
                          <path
                            d={emotion.face.leftEye}
                            stroke="#484848"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <path
                            d={emotion.face.rightEye}
                            stroke="#484848"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <path
                            d={emotion.face.mouth}
                            stroke="#484848"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-deep-black">{emotion.name}</p>
                      <p className="text-xs text-forest-green/60">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Helpful Tips Based on Emotion */}
        {selectedEmotion && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
            <h3 className="text-calm-slate mb-4">When feeling {selectedEmotion.name}:</h3>
            <div className="space-y-3 text-forest-green/80">
              {selectedEmotion.id === 'calm' && (
                <>
                  <p>✨ This is a great feeling! Enjoy this peaceful moment.</p>
                  <p>🎨 Try some gentle art or music to stay relaxed.</p>
                </>
              )}
              {selectedEmotion.id === 'happy' && (
                <>
                  <p>🌟 Wonderful! Share your happiness with others.</p>
                  <p>🎵 Dance to your favorite music or play a fun game!</p>
                </>
              )}
              {selectedEmotion.id === 'excited' && (
                <>
                  <p>🎉 Great energy! Channel it into something fun.</p>
                  <p>🏃 Try some active games or treasure hunting!</p>
                </>
              )}
              {selectedEmotion.id === 'sad' && (
                <>
                  <p>💙 It&apos;s okay to feel sad. You&apos;re not alone.</p>
                  <p>🤗 Talk to someone you trust or do a calming activity.</p>
                </>
              )}
              {selectedEmotion.id === 'angry' && (
                <>
                  <p>🌊 Take deep breaths. Breathe in... and out...</p>
                  <p>🎨 Try punching a pillow or doing some art to let it out.</p>
                </>
              )}
              {selectedEmotion.id === 'worried' && (
                <>
                  <p>🫂 Worries are normal. Let&apos;s work through them together.</p>
                  <p>🧘 Try breathing exercises or talk to a grown-up.</p>
                </>
              )}
              {selectedEmotion.id === 'scared' && (
                <>
                  <p>🛡️ You&apos;re safe. Take your time to feel better.</p>
                  <p>💝 Find a safe, cozy space and do something comforting.</p>
                </>
              )}
              {selectedEmotion.id === 'tired' && (
                <>
                  <p>😴 Rest is important. It&apos;s okay to take a break.</p>
                  <p>🌙 Try some quiet activities or just relax for a while.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}