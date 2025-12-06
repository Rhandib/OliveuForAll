import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { Home, Play, Pause, RotateCcw, Clock, Bell, Volume2 } from 'lucide-react';

interface Props {
  navigate: NavigateFunction;
}

const presetTimes = [
  { label: '1 min', seconds: 60, color: '#96AA9A' },
  { label: '2 min', seconds: 120, color: '#96AA9A' },
  { label: '5 min', seconds: 300, color: '#E2A55E' },
  { label: '10 min', seconds: 600, color: '#E2A55E' },
  { label: '15 min', seconds: 900, color: '#5E718B' },
  { label: '20 min', seconds: 1200, color: '#5E718B' },
  { label: '30 min', seconds: 1800, color: '#3A5A41' },
  { label: '45 min', seconds: 2700, color: '#3A5A41' }
];

export default function TimerActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 minutes
  const [initialTime, setInitialTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    speak('Timer Activity');
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [speak]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          
          // Warning at 10 seconds
          if (prev === 11 && soundEnabled) {
            speak('10 seconds remaining');
            playBeep(400, 0.1);
          }
          
          // Countdown last 5 seconds
          if (prev <= 5 && prev > 0 && soundEnabled) {
            playBeep(600, 0.1);
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, soundEnabled]);

  const playBeep = (frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    speak('Time is up! Great job!');
    
    if (soundEnabled) {
      // Play completion melody
      playBeep(523, 0.2); // C
      setTimeout(() => playBeep(659, 0.2), 200); // E
      setTimeout(() => playBeep(784, 0.4), 400); // G
    }
    
    // Show celebration
    if (typeof window !== 'undefined') {
      alert('⏰ Time\'s Up!\n\nGreat job! 🎉');
    }
  };

  const handleStartPause = () => {
    if (timeLeft === 0) {
      speak('Timer is finished. Please reset to start again');
      return;
    }
    
    setIsRunning(!isRunning);
    speak(isRunning ? 'Timer paused' : 'Timer started');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    speak('Timer reset');
  };

  const setPresetTime = (seconds: number, label: string) => {
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
    speak(`Timer set to ${label}`);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 50) return '#96AA9A'; // Sage green
    if (percentage > 20) return '#E2A55E'; // Warm orange
    return '#C85A54'; // Red for urgency
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green/20 to-calm-cream pb-20 canvas-texture">
      {/* Header */}
      <div className="bg-calm-slate text-calm-cream p-4 shadow-md paint-texture">
        <button 
          onClick={() => navigate('/child')} 
          className="flex items-center gap-2 hover:text-warm-orange transition-colors min-h-[48px] -ml-2 pl-2 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg mb-3"
          aria-label="Go back to child interface"
        >
          <Home className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-7 h-7" aria-hidden="true" />
          <h1 className="text-center">My Timer</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 paper-texture">
          <p className="text-center text-forest-green/80">
            Use the timer to help manage your activities and transitions!
          </p>
        </div>

        {/* Main Timer Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 paper-texture">
          <div className="flex flex-col items-center space-y-8">
            {/* Circular Progress */}
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#F0ECE6"
                  strokeWidth="12"
                />
                {/* Progress circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={getTimeColor()}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="transition-colors duration-500"
                  style={{ color: getTimeColor() }}
                >
                  <p className="text-6xl md:text-7xl" style={{ fontFamily: 'Dangrek, sans-serif' }}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <p className="text-forest-green/60 mt-2">
                  {timeLeft === 0 ? 'Time\'s Up!' : isRunning ? 'Running...' : 'Paused'}
                </p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartPause}
                onMouseEnter={() => speak(isRunning ? 'Pause' : 'Start')}
                className={`min-w-[120px] px-8 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 text-white ${
                  isRunning 
                    ? 'bg-warm-orange focus:ring-warm-orange/50' 
                    : 'bg-sage-green focus:ring-sage-green/50'
                }`}
                aria-label={isRunning ? 'Pause timer' : 'Start timer'}
              >
                <div className="flex items-center justify-center gap-2">
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  <span>{isRunning ? 'Pause' : 'Start'}</span>
                </div>
              </button>

              <button
                onClick={handleReset}
                onMouseEnter={() => speak('Reset')}
                className="min-w-[120px] px-8 py-4 rounded-2xl bg-calm-slate text-calm-cream shadow-lg transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-calm-slate/50 focus:ring-offset-2"
                aria-label="Reset timer"
              >
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-6 h-6" />
                  <span>Reset</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Time Presets */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
          <h2 className="text-calm-slate mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6" aria-hidden="true" />
            Quick Times
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetTimes.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => setPresetTime(preset.seconds, preset.label)}
                onMouseEnter={() => speak(preset.label)}
                className={`p-4 rounded-2xl shadow-md transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                  initialTime === preset.seconds
                    ? 'ring-4 ring-offset-2'
                    : ''
                }`}
                style={{
                  backgroundColor: preset.color + '20',
                  borderColor: preset.color,
                  borderWidth: initialTime === preset.seconds ? '3px' : '2px',
                  color: preset.color
                }}
                aria-label={`Set timer to ${preset.label}`}
                aria-pressed={initialTime === preset.seconds}
              >
                <div className="flex flex-col items-center gap-1">
                  <Clock className="w-6 h-6" aria-hidden="true" />
                  <span className="font-medium">{preset.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
          <h2 className="text-calm-slate mb-4">Settings</h2>
          <div className="flex items-center justify-between p-4 bg-sage-green/10 rounded-2xl">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-forest-green" aria-hidden="true" />
              <div>
                <p className="text-deep-black">Sound Effects</p>
                <p className="text-sm text-forest-green/60">Beeps and alerts</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                speak(soundEnabled ? 'Sound disabled' : 'Sound enabled');
              }}
              className={`relative w-16 h-8 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-sage-green/50 focus:ring-offset-2 ${
                soundEnabled ? 'bg-sage-green' : 'bg-gray-300'
              }`}
              aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
              aria-pressed={soundEnabled}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  soundEnabled ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-br from-warm-orange/10 to-sage-green/10 rounded-3xl p-6 md:p-8 border-2 border-sage-green/20">
          <h3 className="text-calm-slate mb-3">💡 Timer Tips</h3>
          <ul className="space-y-2 text-forest-green/80">
            <li>• Use the timer for activity transitions</li>
            <li>• Set a timer for calming down exercises</li>
            <li>• Time your art projects or games</li>
            <li>• Use it as a visual countdown for tasks</li>
            <li>• Practice time awareness with different durations</li>
          </ul>
        </div>

        {/* Visual Time Helpers */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
          <h3 className="text-calm-slate mb-4">Understanding Time</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-sage-green/10 rounded-2xl">
              <p className="text-3xl mb-2">⚡</p>
              <p className="text-sm text-deep-black">1-2 minutes</p>
              <p className="text-xs text-forest-green/60">Super quick</p>
            </div>
            <div className="text-center p-4 bg-warm-orange/10 rounded-2xl">
              <p className="text-3xl mb-2">⭐</p>
              <p className="text-sm text-deep-black">5-10 minutes</p>
              <p className="text-xs text-forest-green/60">Short activity</p>
            </div>
            <div className="text-center p-4 bg-calm-slate/10 rounded-2xl">
              <p className="text-3xl mb-2">🌟</p>
              <p className="text-sm text-deep-black">15-20 minutes</p>
              <p className="text-xs text-forest-green/60">Medium activity</p>
            </div>
            <div className="text-center p-4 bg-forest-green/10 rounded-2xl">
              <p className="text-3xl mb-2">🎯</p>
              <p className="text-sm text-deep-black">30 minutes</p>
              <p className="text-xs text-forest-green/60">Long activity</p>
            </div>
            <div className="text-center p-4 bg-sage-green/20 rounded-2xl">
              <p className="text-3xl mb-2">🏆</p>
              <p className="text-sm text-deep-black">45 minutes</p>
              <p className="text-xs text-forest-green/60">Extended time</p>
            </div>
            <div className="text-center p-4 bg-warm-orange/20 rounded-2xl">
              <p className="text-3xl mb-2">⏰</p>
              <p className="text-sm text-deep-black">Custom</p>
              <p className="text-xs text-forest-green/60">Your choice!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
