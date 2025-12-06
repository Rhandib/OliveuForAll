import { useState, useEffect } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Sparkles, RefreshCw, Heart, Copy, Check } from 'lucide-react';

const affirmations = [
  "You are doing an amazing job as a parent.",
  "Your love and patience make a difference every single day.",
  "It's okay to ask for help. You don't have to do this alone.",
  "Your child is lucky to have you as their advocate.",
  "Take time for yourself. You deserve care and rest too.",
  "Every small victory is worth celebrating.",
  "You are learning and growing alongside your child.",
  "Your dedication and commitment are truly inspiring.",
  "It's okay to have difficult days. Tomorrow is a new start.",
  "You are building a foundation of love and understanding.",
  "Your efforts create a safe and nurturing environment.",
  "Trust yourself. You know your child best.",
  "Be gentle with yourself. Parenting is a journey.",
  "Your resilience teaches your child how to be strong.",
  "You are making a lasting positive impact on your child's life."
];

const childAffirmations = [
  "I am brave and strong.",
  "My feelings are okay and important.",
  "I can ask for help when I need it.",
  "I am learning and growing every day.",
  "It's okay to make mistakes. They help me learn.",
  "I am loved just the way I am.",
  "I can do hard things.",
  "My uniqueness makes me special.",
  "I am a good friend.",
  "Taking deep breaths helps me feel calm."
];

interface Props {
  navigate: NavigateFunction;
}

export default function Affirmations({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [affirmationType, setAffirmationType] = useState<'parent' | 'child'>('parent');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateAffirmation();
  }, [affirmationType]);

  const generateAffirmation = () => {
    const list = affirmationType === 'parent' ? affirmations : childAffirmations;
    const randomAffirmation = list[Math.floor(Math.random() * list.length)];
    setCurrentAffirmation(randomAffirmation);
    speak(randomAffirmation);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentAffirmation);
    setCopied(true);
    speak('Affirmation copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5D5E4] to-[#E8EEF3]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7CBEA1] to-[#80AEDF] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/parent')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Daily Affirmations</h1>
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Type Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAffirmationType('parent')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                affirmationType === 'parent'
                  ? 'bg-gradient-to-r from-[#7CBEA1] to-[#80AEDF] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-5 h-5" />
              For Parents
            </button>
            <button
              onClick={() => setAffirmationType('child')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                affirmationType === 'child'
                  ? 'bg-gradient-to-r from-[#7CBEA1] to-[#80AEDF] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              For Children
            </button>
          </div>
        </div>

        {/* Affirmation Card */}
        <div className="bg-gradient-to-br from-[#7CBEA1] to-[#80AEDF] rounded-3xl shadow-2xl p-12 mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 text-6xl">✨</div>
            <div className="absolute bottom-10 right-10 text-6xl">💫</div>
            <div className="absolute top-1/2 left-1/4 text-4xl">⭐</div>
            <div className="absolute top-1/3 right-1/4 text-4xl">🌟</div>
          </div>
          
          <div className="relative z-10">
            <Sparkles className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <p className="text-2xl md:text-3xl text-white mb-8 leading-relaxed">
              "{currentAffirmation}"
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={generateAffirmation}
                onMouseEnter={() => speak('Generate new affirmation')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all backdrop-blur-sm"
              >
                <RefreshCw className="w-5 h-5" />
                New Affirmation
              </button>
              <button
                onClick={copyToClipboard}
                onMouseEnter={() => speak('Copy affirmation')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all backdrop-blur-sm"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl text-[#2E5580] mb-4">Using Affirmations</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🌅</span>
              <span>Start your day with a positive affirmation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🔄</span>
              <span>Repeat affirmations throughout the day when needed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl shrink-0">👨‍👩‍👧</span>
              <span>Practice affirmations together with your child</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl shrink-0">📝</span>
              <span>Write down your favorites and keep them visible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl shrink-0">💭</span>
              <span>Create your own personalized affirmations</span>
            </li>
          </ul>
        </div>

        {/* Breathing Exercise Suggestion */}
        <div className="mt-6 bg-gradient-to-r from-[#CCBB75]/20 to-[#7CBEA1]/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg text-[#2E5580] mb-2">Combine with Breathing</h3>
          <p className="text-gray-700 mb-4">
            Try repeating an affirmation while doing a breathing exercise for maximum calm and positivity.
          </p>
          <button
            onClick={() => navigate('/child/games')}
            className="bg-[#7CBEA1] hover:bg-[#6BAD90] text-white px-6 py-3 rounded-xl transition-colors"
          >
            Try Breathing Exercise
          </button>
        </div>
      </div>
    </div>
  );
}