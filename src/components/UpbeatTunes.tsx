import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

interface Props {
  audioUrl?: string;
  title?: string;
  artist?: string;
  color?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const UpbeatTunes = ({ 
  audioUrl = "/audio/upbeat-tunes.mp3",
  title = "Upbeat Tunes",
  artist = "Suno AI",
  color = "#E2A55E",
  onPlayStateChange
}: Props): JSX.Element => {
  const { speak } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onPlayStateChange) onPlayStateChange(false);
    };
    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onPlayStateChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      speak('Paused');
    } else {
      audio.play();
      speak(`Playing ${title}`);
    }
    
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    if (onPlayStateChange) onPlayStateChange(newPlayState);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      speak(isMuted ? 'Unmuted' : 'Muted');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="w-full max-w-[436px] bg-white rounded-2xl shadow-lg p-6 paper-texture"
      role="region"
      aria-label={`${title} music player`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-md"
          style={{ backgroundColor: color }}
        >
          🎵
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-deep-black truncate">{title}</h3>
          <p className="text-sm text-forest-green/70 truncate">{artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-forest-green/70 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-sage-green/20 rounded-lg appearance-none cursor-pointer accent-calm-slate"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${progress}%, #96AA9A33 ${progress}%, #96AA9A33 100%)`
          }}
          aria-label={`Seek slider, ${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-calm-slate hover:bg-forest-green text-calm-cream flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        {/* Volume Control */}
        <div className="flex-1 flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="text-calm-slate hover:text-forest-green transition-colors focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg p-1"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-sage-green/20 rounded-lg appearance-none cursor-pointer accent-calm-slate"
            aria-label={`Volume control, currently at ${Math.round(volume * 100)} percent`}
          />
        </div>
      </div>

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="mt-4 flex items-center justify-center gap-1 animate-fade-in">
          <div className="w-1 h-4 bg-warm-orange rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-6 bg-warm-orange rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-8 bg-warm-orange rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="w-1 h-6 bg-warm-orange rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
          <div className="w-1 h-4 bg-warm-orange rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
        </div>
      )}
    </div>
  );
};