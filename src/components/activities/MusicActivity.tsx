import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { Home, Music, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { UpbeatTunes } from '../UpbeatTunes';

interface Sound {
  id: string;
  name: string;
  emoji: string;
  color: string;
  frequency: number;
}

const sounds: Sound[] = [
  { id: '1', name: 'Ocean Waves', emoji: '🌊', color: '#5E718B', frequency: 200 },
  { id: '2', name: 'Rain', emoji: '🌧️', color: '#96AA9A', frequency: 300 },
  { id: '3', name: 'Birds', emoji: '🐦', color: '#E2A55E', frequency: 500 },
  { id: '4', name: 'Wind Chimes', emoji: '🎐', color: '#96AA9A', frequency: 400 },
  { id: '5', name: 'Piano', emoji: '🎹', color: '#5E718B', frequency: 440 },
  { id: '6', name: 'Drum', emoji: '🥁', color: '#E2A55E', frequency: 150 }
];

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  color: string;
  emoji: string;
  baseFrequency: number;
}

const musicTracks: MusicTrack[] = [
  { id: 'm1', title: 'Calming Waves', artist: 'Nature Sounds', duration: 180, color: '#5E718B', emoji: '🌊', baseFrequency: 220 },
  { id: 'm2', title: 'Peaceful Piano', artist: 'Relaxation', duration: 240, color: '#96AA9A', emoji: '🎹', baseFrequency: 261 },
  { id: 'm3', title: 'Gentle Rain', artist: 'Nature Sounds', duration: 200, color: '#E2A55E', emoji: '🌧️', baseFrequency: 329 },
  { id: 'm4', title: 'Soft Lullaby', artist: 'Calm Music', duration: 150, color: '#3A5A41', emoji: '🎵', baseFrequency: 349 },
];

// Piano notes
const pianoNotes = [
  { note: 'C', frequency: 261.63, white: true },
  { note: 'C#', frequency: 277.18, white: false },
  { note: 'D', frequency: 293.66, white: true },
  { note: 'D#', frequency: 311.13, white: false },
  { note: 'E', frequency: 329.63, white: true },
  { note: 'F', frequency: 349.23, white: true },
  { note: 'F#', frequency: 369.99, white: false },
  { note: 'G', frequency: 392.00, white: true },
  { note: 'G#', frequency: 415.30, white: false },
  { note: 'A', frequency: 440.00, white: true },
  { note: 'A#', frequency: 466.16, white: false },
  { note: 'B', frequency: 493.88, white: true },
];

type TabType = 'sounds' | 'music' | 'piano';

interface Props {
  navigate: NavigateFunction;
}

export default function MusicActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [activeTab, setActiveTab] = useState<TabType>('sounds');
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(0));
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const trackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    speak('Music and Sounds Activity');
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (trackIntervalRef.current) {
        clearInterval(trackIntervalRef.current);
      }
      oscillatorsRef.current.forEach(osc => osc.stop());
    };
  }, [speak]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#F0ECE6');
      gradient.addColorStop(1, '#96AA9A20');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw visualizer bars
      const barWidth = width / visualizerData.length;
      const maxBarHeight = height - 40;

      visualizerData.forEach((value, index) => {
        const barHeight = (value / 255) * maxBarHeight;
        const x = index * barWidth;
        const y = height - barHeight - 20;

        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(x, y, x, height);
        
        // Color based on frequency range
        if (index < 8) {
          barGradient.addColorStop(0, '#E2A55E');
          barGradient.addColorStop(1, '#E2A55E80');
        } else if (index < 16) {
          barGradient.addColorStop(0, '#96AA9A');
          barGradient.addColorStop(1, '#96AA9A80');
        } else if (index < 24) {
          barGradient.addColorStop(0, '#5E718B');
          barGradient.addColorStop(1, '#5E718B80');
        } else {
          barGradient.addColorStop(0, '#3A5A41');
          barGradient.addColorStop(1, '#3A5A4180');
        }

        ctx.fillStyle = barGradient;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = barGradient;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visualizerData]);

  const updateVisualizer = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateData = () => {
      if (!analyser || !audioContextRef.current || audioContextRef.current.state === 'closed') {
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      
      const bars = 32;
      const sampledData: number[] = [];
      const step = Math.floor(dataArray.length / bars);
      
      for (let i = 0; i < bars; i++) {
        const start = i * step;
        const end = start + step;
        const slice = dataArray.slice(start, end);
        const average = slice.reduce((a, b) => a + b, 0) / slice.length;
        sampledData.push(average);
      }
      
      setVisualizerData(sampledData);
      requestAnimationFrame(updateData);
    };

    updateData();
  };

  const playSound = (sound: Sound) => {
    speak(sound.name);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);
    
    oscillator.frequency.value = sound.frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = volume;
    
    oscillator.start();
    
    updateVisualizer(analyser);
    
    setTimeout(() => {
      oscillator.stop();
      setTimeout(() => {
        setVisualizerData(new Array(32).fill(0));
      }, 200);
      setPlayingSound(null);
    }, 1500);
    
    setPlayingSound(sound.id);

    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const selectTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(false);
    speak(`Selected ${track.title}`);
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  const playMusic = () => {
    if (!currentTrack) return;
    
    speak(`Playing ${currentTrack.title}`);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    // Create a simple melody with harmonics
    const frequencies = [
      currentTrack.baseFrequency,
      currentTrack.baseFrequency * 1.25,
      currentTrack.baseFrequency * 1.5,
    ];

    oscillatorsRef.current = frequencies.map((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(analyser);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.value = volume * (0.3 / (index + 1)); // Decrease volume for harmonics
      
      oscillator.start();
      return oscillator;
    });

    analyser.connect(audioContext.destination);
    updateVisualizer(analyser);
    
    setIsPlaying(true);
    
    // Progress timer
    if (trackIntervalRef.current) {
      clearInterval(trackIntervalRef.current);
    }
    
    trackIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentTrack.duration) {
          pauseMusic();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const pauseMusic = () => {
    oscillatorsRef.current.forEach(osc => osc.stop());
    oscillatorsRef.current = [];
    
    if (trackIntervalRef.current) {
      clearInterval(trackIntervalRef.current);
    }
    
    setIsPlaying(false);
    setTimeout(() => {
      setVisualizerData(new Array(32).fill(0));
    }, 200);
    
    speak('Paused');
  };

  const nextTrack = () => {
    if (!currentTrack) {
      setCurrentTrack(musicTracks[0]);
      return;
    }
    
    const currentIndex = musicTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % musicTracks.length;
    setCurrentTrack(musicTracks[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(false);
    speak(`Next: ${musicTracks[nextIndex].title}`);
  };

  const previousTrack = () => {
    if (!currentTrack) {
      setCurrentTrack(musicTracks[0]);
      return;
    }
    
    const currentIndex = musicTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrack(musicTracks[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(false);
    speak(`Previous: ${musicTracks[prevIndex].title}`);
  };

  const playPianoNote = (note: typeof pianoNotes[0]) => {
    speak(`Note ${note.note}`);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);
    
    oscillator.frequency.value = note.frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = volume;
    
    oscillator.start();
    updateVisualizer(analyser);
    
    setTimeout(() => {
      oscillator.stop();
      setTimeout(() => {
        setVisualizerData(new Array(32).fill(0));
      }, 200);
    }, 800);

    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green/20 to-calm-cream pb-20 canvas-texture">
      {/* Header */}
      <div className="bg-calm-slate text-calm-cream p-4 flex items-center justify-between shadow-md paint-texture">
        <button 
          onClick={() => navigate('/child')} 
          className="flex items-center gap-2 hover:text-warm-orange transition-colors min-h-[48px] -ml-2 pl-2 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg"
          aria-label="Go back to activities"
        >
          <Home className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1>Music & Sounds</h1>
        <Music className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl shadow-lg p-2 paper-texture">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setActiveTab('sounds'); speak('Sound Effects'); }}
              className={`py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                activeTab === 'sounds' ? 'bg-calm-slate text-calm-cream shadow-md' : 'bg-sage-green/10 text-forest-green hover:bg-sage-green/20'
              }`}
              aria-label="Sound effects tab"
              aria-pressed={activeTab === 'sounds'}
            >
              <span className="text-2xl mb-2 block">🎵</span>
              <span>Sounds</span>
            </button>
            <button
              onClick={() => { setActiveTab('music'); speak('Music Player'); }}
              className={`py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                activeTab === 'music' ? 'bg-calm-slate text-calm-cream shadow-md' : 'bg-sage-green/10 text-forest-green hover:bg-sage-green/20'
              }`}
              aria-label="Music player tab"
              aria-pressed={activeTab === 'music'}
            >
              <span className="text-2xl mb-2 block">🎵</span>
              <span>Music</span>
            </button>
            <button
              onClick={() => { setActiveTab('piano'); speak('Piano'); }}
              className={`py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                activeTab === 'piano' ? 'bg-calm-slate text-calm-cream shadow-md' : 'bg-sage-green/10 text-forest-green hover:bg-sage-green/20'
              }`}
              aria-label="Piano tab"
              aria-pressed={activeTab === 'piano'}
            >
              <span className="text-2xl mb-2 block">🎹</span>
              <span>Piano</span>
            </button>
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 paper-texture">
          <h2 className="text-calm-slate mb-4 text-center">Sound Visualizer</h2>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full rounded-2xl border-2 border-sage-green/20"
              aria-label="Audio visualization display"
            />
            {playingSound === null && !isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-forest-green/50 text-center">
                  {activeTab === 'sounds' && 'Tap a sound to see it visualized'}
                  {activeTab === 'music' && 'Select a track to see it visualized'}
                  {activeTab === 'piano' && 'Play piano keys to see them visualized'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Volume Control */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
          <h3 className="text-forest-green mb-4">Controls</h3>
          
          <div className="space-y-6">
            {/* Volume Slider */}
            <div>
              <label className="text-sm text-forest-green/70 mb-2 block">Volume: {Math.round(volume * 100)}%</label>
              <div className="flex items-center gap-4">
                <VolumeX className="w-5 h-5 text-forest-green/50" aria-hidden="true" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-3 bg-sage-green/20 rounded-lg appearance-none cursor-pointer accent-calm-slate"
                  aria-label={`Volume control, currently at ${Math.round(volume * 100)} percent`}
                />
                <Volume2 className="w-5 h-5 text-calm-slate" aria-hidden="true" />
              </div>
            </div>
            
            {/* Vibration Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-deep-black">Vibration Feedback</span>
                <p className="text-xs text-forest-green/60">Feel the sounds</p>
              </div>
              <button
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`px-6 py-3 rounded-2xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 min-w-[80px] ${
                  vibrationEnabled ? 'bg-sage-green text-deep-black shadow-md' : 'bg-sage-green/20 text-forest-green'
                }`}
                aria-label={`Vibration feedback ${vibrationEnabled ? 'enabled' : 'disabled'}`}
                aria-pressed={vibrationEnabled}
              >
                {vibrationEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sounds' && (
          <>
            {/* Sound Pads */}
            <div>
              <h3 className="text-calm-slate mb-4 text-center">Sound Pads</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sounds.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => playSound(sound)}
                    onMouseEnter={() => speak(sound.name)}
                    className={`aspect-square rounded-3xl shadow-lg flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 paper-texture min-h-[140px] ${
                      playingSound === sound.id ? 'animate-pulse scale-105' : ''
                    }`}
                    style={{ backgroundColor: sound.color }}
                    aria-label={`Play ${sound.name} sound`}
                    aria-pressed={playingSound === sound.id}
                  >
                    <span className="text-6xl" aria-hidden="true">{sound.emoji}</span>
                    <span className="text-calm-cream">{sound.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breathing Exercise */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
              <h2 className="text-calm-slate mb-4">Breathing Exercise</h2>
              <p className="text-forest-green/70 mb-6">
                Tap the sounds in rhythm with your breathing for a calming experience
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-sage-green/20 to-sage-green/10 rounded-2xl p-6 text-center border-2 border-sage-green/20">
                  <p className="text-sm text-forest-green/70 mb-2">Breathe In</p>
                  <p className="text-calm-slate">4s</p>
                </div>
                <div className="bg-gradient-to-br from-calm-slate/20 to-calm-slate/10 rounded-2xl p-6 text-center border-2 border-calm-slate/20">
                  <p className="text-sm text-forest-green/70 mb-2">Hold</p>
                  <p className="text-calm-slate">4s</p>
                </div>
                <div className="bg-gradient-to-br from-warm-orange/20 to-warm-orange/10 rounded-2xl p-6 text-center border-2 border-warm-orange/20">
                  <p className="text-sm text-forest-green/70 mb-2">Breathe Out</p>
                  <p className="text-calm-slate">4s</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'music' && (
          <>
            {/* Featured Song - Upbeat Tunes */}
            <div>
              <h3 className="text-calm-slate mb-4 text-center">Featured Song 🎵</h3>
              <div className="flex justify-center">
                <UpbeatTunes 
                  audioUrl="/audio/upbeat-tunes.mp3"
                  title="Upbeat Tunes"
                  artist="Suno AI"
                  color="#E2A55E"
                />
              </div>
              <div className="mt-4 bg-sage-green/10 rounded-xl p-4 text-center">
                <p className="text-sm text-forest-green/70">
                  💡 <strong>Tip:</strong> To add your audio file, place it in the <code className="bg-white px-2 py-1 rounded text-xs">public/audio/</code> folder as <code className="bg-white px-2 py-1 rounded text-xs">upbeat-tunes.mp3</code>
                </p>
              </div>
            </div>

            {/* Music Player */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
              <h3 className="text-calm-slate mb-6 text-center">Music Player</h3>
              
              {/* Current Track Display */}
              {currentTrack ? (
                <div className="bg-gradient-to-br from-sage-green/10 to-warm-orange/10 rounded-2xl p-6 mb-6 border-2 border-sage-green/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl" style={{ backgroundColor: currentTrack.color }}>
                      {currentTrack.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-deep-black">{currentTrack.title}</h4>
                      <p className="text-sm text-forest-green/70">Artist: {currentTrack.artist}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-forest-green/70 mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                    <div className="h-2 bg-sage-green/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-calm-slate rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-sage-green/10 rounded-2xl p-12 mb-6 text-center border-2 border-dashed border-sage-green/30">
                  <p className="text-forest-green/50">Select a track below to start playing</p>
                </div>
              )}

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={previousTrack}
                  className="w-14 h-14 rounded-full bg-sage-green/20 hover:bg-sage-green/30 flex items-center justify-center transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-6 h-6 text-calm-slate" />
                </button>
                <button
                  onClick={togglePlayPause}
                  disabled={!currentTrack}
                  className="w-16 h-16 rounded-full bg-calm-slate hover:bg-forest-green text-calm-cream flex items-center justify-center transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button
                  onClick={nextTrack}
                  className="w-14 h-14 rounded-full bg-sage-green/20 hover:bg-sage-green/30 flex items-center justify-center transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50"
                  aria-label="Next track"
                >
                  <SkipForward className="w-6 h-6 text-calm-slate" />
                </button>
              </div>
            </div>

            {/* Track List */}
            <div>
              <h3 className="text-calm-slate mb-4 text-center">Music Library</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {musicTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(track)}
                    onMouseEnter={() => speak(track.title)}
                    className={`rounded-2xl shadow-lg p-4 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 text-left ${
                      currentTrack?.id === track.id ? 'ring-4 ring-calm-slate' : ''
                    }`}
                    style={{ backgroundColor: track.color + '20' }}
                    aria-label={`Select ${track.title} by ${track.artist}`}
                    aria-pressed={currentTrack?.id === track.id}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: track.color }}>
                        {track.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-deep-black">{track.title}</h4>
                        <p className="text-xs text-forest-green/60">{track.artist} • {formatTime(track.duration)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'piano' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
            <h3 className="text-calm-slate mb-6 text-center">Piano Keyboard</h3>
            
            {/* Piano Keys */}
            <div className="relative bg-deep-black/5 rounded-2xl p-8 overflow-x-auto">
              <div className="flex justify-center gap-1 min-w-max">
                {pianoNotes.map((note, index) => (
                  note.white ? (
                    <div key={index} className="relative">
                      <button
                        onClick={() => playPianoNote(note)}
                        onMouseEnter={() => speak(`Note ${note.note}`)}
                        className="w-16 h-48 bg-calm-cream hover:bg-sage-green/20 border-2 border-deep-black/20 rounded-b-lg transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 relative flex items-end justify-center pb-4"
                        aria-label={`Piano key ${note.note}`}
                      >
                        <span className="text-xs text-forest-green/50">{note.note}</span>
                      </button>
                      {/* Black key overlay */}
                      {index < pianoNotes.length - 1 && !pianoNotes[index + 1].white && (
                        <button
                          onClick={() => playPianoNote(pianoNotes[index + 1])}
                          onMouseEnter={() => speak(`Note ${pianoNotes[index + 1].note}`)}
                          className="absolute -right-4 top-0 w-10 h-32 bg-deep-black hover:bg-calm-slate text-calm-cream border-2 border-deep-black rounded-b-lg transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 z-10 flex items-end justify-center pb-2"
                          aria-label={`Piano key ${pianoNotes[index + 1].note}`}
                        >
                          <span className="text-xs opacity-60">{pianoNotes[index + 1].note}</span>
                        </button>
                      )}
                    </div>
                  ) : null
                ))}
              </div>
            </div>

            {/* Piano Info */}
            <div className="mt-6 text-center">
              <p className="text-forest-green/70 text-sm">
                Tap the keys to play musical notes and see the sound waves visualize above
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}