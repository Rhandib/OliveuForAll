import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Gift, Star, Trophy, Heart, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  date?: Date;
}

interface Props {
  navigate: NavigateFunction;
}

export default function TreasureActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Drawing',
      description: 'Created your first artwork',
      icon: <Star className="w-8 h-8" />,
      color: '#CCBB75',
      unlocked: true,
      date: new Date()
    },
    {
      id: '2',
      title: 'Breathing Master',
      description: 'Completed 5 breathing exercises',
      icon: <Heart className="w-8 h-8" />,
      color: '#A05556',
      unlocked: true,
      date: new Date()
    },
    {
      id: '3',
      title: 'Yoga Explorer',
      description: 'Tried all yoga poses',
      icon: <Trophy className="w-8 h-8" />,
      color: '#7CBEA1',
      unlocked: false
    },
    {
      id: '4',
      title: 'Music Maker',
      description: 'Created a melody',
      icon: <Sparkles className="w-8 h-8" />,
      color: '#80AEDF',
      unlocked: false
    },
    {
      id: '5',
      title: 'Memory Champion',
      description: 'Won the memory game',
      icon: <Trophy className="w-8 h-8" />,
      color: '#8282AC',
      unlocked: true,
      date: new Date()
    },
    {
      id: '6',
      title: 'Video Viewer',
      description: 'Watched 3 calming videos',
      icon: <Star className="w-8 h-8" />,
      color: '#2E5580',
      unlocked: false
    }
  ]);

  const [rewards] = useState([
    { id: '1', name: 'Rainbow Sticker', emoji: '🌈', unlocked: true },
    { id: '2', name: 'Star Badge', emoji: '⭐', unlocked: true },
    { id: '3', name: 'Heart Trophy', emoji: '❤️', unlocked: true },
    { id: '4', name: 'Happy Face', emoji: '😊', unlocked: true },
    { id: '5', name: 'Magic Wand', emoji: '🪄', unlocked: false },
    { id: '6', name: 'Crown', emoji: '👑', unlocked: false }
  ]);

  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.unlocked) {
      speak(`${achievement.title}. ${achievement.description}`);
    } else {
      speak(`${achievement.title}. Keep trying to unlock this achievement!`);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5D5E4] to-[#B8C9D9] pb-20">
      {/* Header */}
      <div className="bg-[#1E1E1E] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/child')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Treasure Box</h1>
        <Gift className="w-5 h-5" />
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-[#7CBEA1] to-[#80AEDF] rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Your Progress</h2>
            <Trophy className="w-10 h-10" />
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span>Achievements</span>
              <span>{unlockedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4">
              <div
                className="bg-white rounded-full h-4 transition-all duration-500"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm opacity-90 mt-4">
            Keep exploring activities to unlock more treasures! ✨
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl text-[#2E5580] mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <button
                key={achievement.id}
                onClick={() => handleAchievementClick(achievement)}
                onMouseEnter={() => speak(achievement.title)}
                className={`p-4 rounded-xl shadow-md transition-all transform hover:scale-105 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-white to-gray-50'
                    : 'bg-gray-100 opacity-50'
                }`}
                style={{
                  borderLeft: `4px solid ${achievement.unlocked ? achievement.color : '#ccc'}`
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}
                    style={{ backgroundColor: achievement.unlocked ? achievement.color : '#e5e5e5' }}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`mb-1 ${achievement.unlocked ? 'text-[#2E5580]' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-gray-400 mt-2">
                        Unlocked: {achievement.date.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Sparkles className="w-5 h-5 text-[#CCBB75]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reward Collection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl text-[#2E5580] mb-6">Reward Collection</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`aspect-square rounded-2xl shadow-md flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 ${
                  reward.unlocked
                    ? 'bg-gradient-to-br from-[#7CBEA1] to-[#80AEDF]'
                    : 'bg-gray-200'
                }`}
              >
                <span className={`text-4xl ${reward.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {reward.emoji}
                </span>
                <span className={`text-xs text-center px-2 ${reward.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {reward.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="mt-6 bg-gradient-to-r from-[#CCBB75]/20 to-[#7CBEA1]/20 rounded-2xl p-6 text-center">
          <h3 className="text-xl text-[#2E5580] mb-2">Great Job! 🎉</h3>
          <p className="text-gray-700">
            Every activity helps you grow and learn. Keep being amazing!
          </p>
        </div>
      </div>
    </div>
  );
}