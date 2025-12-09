import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Eraser, Palette, Download, Sparkles, Circle, Minus, Brush } from 'lucide-react';

const colors = [
  '#E2A55E', '#96AA9A', '#5E718B', '#3A5A41', '#F0ECE6',
  '#A05556', '#7CBEA1', '#80AEDF', '#CCBB75', '#8282AC', 
  '#2E5580', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'
];

const stickers = [
  { emoji: '⭐', label: 'Star' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '😊', label: 'Happy Face' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🌟', label: 'Sparkle' },
  { emoji: '🎨', label: 'Palette' },
  { emoji: '🌸', label: 'Flower' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '☀️', label: 'Sun' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '✨', label: 'Stars' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🌺', label: 'Hibiscus' },
  { emoji: '🍀', label: 'Clover' },
  { emoji: '💫', label: 'Dizzy' },
  { emoji: '🎭', label: 'Theater' },
];

type BrushType = 'round' | 'spray' | 'marker' | 'crayon' | 'calligraphy';

interface Props {
  navigate: NavigateFunction;
}

export default function ArtActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#5E718B');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'sticker'>('brush');
  const [brushType, setBrushType] = useState<BrushType>('round');
  const [selectedSticker, setSelectedSticker] = useState(stickers[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    speak('Art Activity');
  }, [speak]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    // Scale coordinates for canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (tool === 'sticker') {
      placeSticker(scaledX, scaledY);
    } else {
      setIsDrawing(true);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(scaledX, scaledY);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'sticker') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    // Scale coordinates for canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawWithBrush(ctx, scaledX, scaledY);
    }
  };

  const drawWithBrush = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    switch (brushType) {
      case 'round':
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        break;
      
      case 'spray':
        // Spray paint effect with random dots
        for (let i = 0; i < 10; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 2;
          const offsetY = (Math.random() - 0.5) * brushSize * 2;
          ctx.fillStyle = selectedColor;
          ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
        }
        break;
      
      case 'marker':
        // Marker with slight transparency
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor + 'CC'; // Add transparency
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'square';
        ctx.stroke();
        break;
      
      case 'crayon':
        // Crayon with textured effect
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 0.5;
          const offsetY = (Math.random() - 0.5) * brushSize * 0.5;
          ctx.lineTo(x + offsetX, y + offsetY);
          ctx.strokeStyle = selectedColor;
          ctx.lineWidth = brushSize * 0.8;
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        break;
      
      case 'calligraphy':
        // Calligraphy brush with variable width
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize * 1.5;
        ctx.lineCap = 'butt';
        ctx.stroke();
        break;
    }
  };

  const placeSticker = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const fontSize = brushSize * 8;
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker.emoji, x, y);
      speak(`${selectedSticker.label} sticker placed`);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        speak('Canvas cleared');
      }
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'my-artwork.png';
      link.href = url;
      link.click();
      speak('Artwork saved');
    }
  };

  const brushTypes: { type: BrushType; label: string; icon: React.ReactNode }[] = [
    { type: 'round', label: 'Round', icon: <Circle className="w-5 h-5" /> },
    { type: 'spray', label: 'Spray', icon: <Sparkles className="w-5 h-5" /> },
    { type: 'marker', label: 'Marker', icon: <Minus className="w-5 h-5" /> },
    { type: 'crayon', label: 'Crayon', icon: <Brush className="w-5 h-5" /> },
    { type: 'calligraphy', label: 'Calligraphy', icon: <Brush className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green/20 to-calm-cream pb-20 canvas-texture">
      {/* Header */}
      <div className="bg-calm-slate text-calm-cream p-4 flex items-center justify-between shadow-md paint-texture">
        <button 
          onClick={() => navigate('/child')} 
          className="flex items-center gap-2 hover:text-warm-orange transition-colors min-h-[48px] -ml-2 pl-2 pr-4 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg"
          aria-label="Go back to activities"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1>Art Studio</h1>
        <Palette className="w-5 h-5" aria-hidden="true" />
      </div>

      {/* Canvas */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 paper-texture">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="border-4 border-calm-slate rounded-2xl w-full touch-none"
            style={{ cursor: tool === 'sticker' ? 'copy' : 'crosshair' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Tools Panel */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-6 paper-texture">
          {/* Tool Selection */}
          <div>
            <h3 className="text-forest-green mb-3">Tool</h3>
            <div className="flex gap-3">
              <button
                onClick={() => { setTool('brush'); speak('Brush selected'); }}
                className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                  tool === 'brush' ? 'bg-calm-slate text-calm-cream shadow-lg' : 'bg-sage-green/20 text-deep-black hover:bg-sage-green/30'
                }`}
                aria-label="Select brush tool"
                aria-pressed={tool === 'brush'}
              >
                <Brush className="w-6 h-6" />
                <span>Brush</span>
              </button>
              <button
                onClick={() => { setTool('sticker'); speak('Sticker mode'); }}
                className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                  tool === 'sticker' ? 'bg-warm-orange text-deep-black shadow-lg' : 'bg-sage-green/20 text-deep-black hover:bg-sage-green/30'
                }`}
                aria-label="Select sticker tool"
                aria-pressed={tool === 'sticker'}
              >
                <Sparkles className="w-6 h-6" />
                <span>Stickers</span>
              </button>
            </div>
          </div>

          {/* Brush Options */}
          {tool === 'brush' && (
            <>
              {/* Brush Type Selection */}
              <div>
                <h3 className="text-forest-green mb-3">Brush Style</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {brushTypes.map(({ type, label, icon }) => (
                    <button
                      key={type}
                      onClick={() => { setBrushType(type); speak(`${label} brush`); }}
                      className={`py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 min-h-[80px] ${
                        brushType === type ? 'bg-sage-green text-deep-black shadow-md' : 'bg-sage-green/10 text-forest-green hover:bg-sage-green/20'
                      }`}
                      aria-label={`${label} brush`}
                      aria-pressed={brushType === type}
                    >
                      {icon}
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <h3 className="text-forest-green mb-3">Colors</h3>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); speak('Color selected'); }}
                      className={`w-14 h-14 rounded-full border-4 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                        selectedColor === color ? 'border-deep-black scale-110' : 'border-sage-green/30'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} color`}
                      aria-pressed={selectedColor === color}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div>
                <h3 className="text-forest-green mb-3">Brush Size: {brushSize}px</h3>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full h-3 bg-sage-green/20 rounded-lg appearance-none cursor-pointer accent-calm-slate"
                  aria-label={`Brush size: ${brushSize} pixels`}
                />
              </div>
            </>
          )}

          {/* Sticker Options */}
          {tool === 'sticker' && (
            <>
              <div>
                <h3 className="text-forest-green mb-3">Choose a Sticker</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {stickers.map((sticker) => (
                    <button
                      key={sticker.label}
                      onClick={() => { setSelectedSticker(sticker); speak(`${sticker.label} selected`); }}
                      className={`aspect-square py-4 rounded-2xl flex items-center justify-center text-4xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                        selectedSticker.label === sticker.label ? 'bg-warm-orange/30 scale-110 shadow-lg' : 'bg-sage-green/10 hover:bg-sage-green/20'
                      }`}
                      aria-label={sticker.label}
                      aria-pressed={selectedSticker.label === sticker.label}
                    >
                      {sticker.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticker Size */}
              <div>
                <h3 className="text-forest-green mb-3">Sticker Size: {brushSize}</h3>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full h-3 bg-sage-green/20 rounded-lg appearance-none cursor-pointer accent-warm-orange"
                  aria-label={`Sticker size: ${brushSize}`}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-sage-green/20">
            <button
              onClick={clearCanvas}
              className="flex-1 bg-gradient-to-r from-calm-slate/80 to-forest-green text-calm-cream py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-warm-orange/50 paint-texture min-h-[56px]"
              onMouseEnter={() => speak('Clear Canvas')}
              aria-label="Clear canvas and start over"
            >
              <Eraser className="w-5 h-5" />
              <span>Clear</span>
            </button>
            <button
              onClick={downloadDrawing}
              className="flex-1 bg-gradient-to-r from-sage-green to-warm-orange/80 text-deep-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-warm-orange/50 paint-texture min-h-[56px]"
              onMouseEnter={() => speak('Save Artwork')}
              aria-label="Download your artwork"
            >
              <Download className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}