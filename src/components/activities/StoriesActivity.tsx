import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, BookOpen, Circle, User, Users } from 'lucide-react';

interface Props {
  navigate: NavigateFunction;
}

type StoryPage = {
  id: number;
  content: string;
  illustration: string;
  interactionType?: 'drag' | 'choice' | 'none';
  choices?: { text: string; category: 'control' | 'no-control' }[];
};

const storyPages: StoryPage[] = [
  {
    id: 1,
    content: "Hi there! I'm here to tell you about something really important: the things we CAN control and the things we CAN'T control.",
    illustration: '👋',
    interactionType: 'none'
  },
  {
    id: 2,
    content: "Some things are about US - like our own thoughts, feelings, and actions. These are things WE can control!",
    illustration: '🧠',
    interactionType: 'none'
  },
  {
    id: 3,
    content: "Other things are about OTHER PEOPLE - like what they think, feel, or do. We can't control these things.",
    illustration: '👥',
    interactionType: 'none'
  },
  {
    id: 4,
    content: "Let's practice! Can you choose which things YOU can control?",
    illustration: '🤔',
    interactionType: 'choice',
    choices: [
      { text: 'How I feel when something happens', category: 'control' },
      { text: 'What my friend chooses to play', category: 'no-control' },
      { text: 'My own words and actions', category: 'control' },
      { text: 'The weather outside', category: 'no-control' }
    ]
  },
  {
    id: 5,
    content: "Great job! Remember: YOU control YOUR thoughts, feelings, and actions. That's your special power!",
    illustration: '⭐',
    interactionType: 'none'
  },
  {
    id: 6,
    content: "When something bothers us that we CAN'T control, we can focus on what we CAN control - like how we react!",
    illustration: '💪',
    interactionType: 'none'
  },
  {
    id: 7,
    content: "Let's try more examples! Which of these can YOU control?",
    illustration: '🎯',
    interactionType: 'choice',
    choices: [
      { text: 'Being kind to others', category: 'control' },
      { text: 'If someone is kind back to me', category: 'no-control' },
      { text: 'Asking for help when I need it', category: 'control' },
      { text: 'How fast I grow taller', category: 'no-control' }
    ]
  },
  {
    id: 8,
    content: "You're doing amazing! Here's what to remember: Focus on what YOU can control, and let go of worrying about what you can't.",
    illustration: '🌈',
    interactionType: 'none'
  },
  {
    id: 9,
    content: "When you feel upset about something you can't control, try these: Take deep breaths, talk to someone you trust, or do a calming activity.",
    illustration: '🌬️',
    interactionType: 'none'
  },
  {
    id: 10,
    content: "You are in control of YOU! And that makes you very powerful and special. The end! 🎉",
    illustration: '🏆',
    interactionType: 'none'
  }
];

export default function StoriesActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<{ [key: number]: string[] }>({});
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  const page = storyPages[currentPage];

  const handleNext = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      setShowFeedback(null);
      speak(storyPages[currentPage + 1].content);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setShowFeedback(null);
      speak(storyPages[currentPage - 1].content);
    }
  };

  const handleChoice = (choiceText: string, category: 'control' | 'no-control') => {
    const pageChoices = selectedChoices[currentPage] || [];
    
    if (pageChoices.includes(choiceText)) {
      // Deselect
      setSelectedChoices({
        ...selectedChoices,
        [currentPage]: pageChoices.filter(c => c !== choiceText)
      });
      setShowFeedback(null);
    } else {
      // Select
      setSelectedChoices({
        ...selectedChoices,
        [currentPage]: [...pageChoices, choiceText]
      });

      // Show feedback
      if (category === 'control') {
        setShowFeedback({
          correct: true,
          text: "Yes! That's something YOU can control! 🌟"
        });
        speak("Yes! That's something you can control!");
      } else {
        setShowFeedback({
          correct: false,
          text: "That's something outside your control. It's okay - we can't control everything! 💙"
        });
        speak("That's something outside your control. It's okay - we can't control everything!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-cream to-sage-green/20 pb-20">
      {/* Header */}
      <div className="bg-calm-slate text-white p-4 flex items-center justify-between shadow-md">
        <button 
          onClick={() => navigate('/child')} 
          className="flex items-center gap-2 hover:text-warm-orange transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg px-2"
          aria-label="Go back to child interface"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Social Stories</h1>
        <BookOpen className="w-5 h-5" />
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Story Book Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-sage-green to-calm-slate/80 text-white p-6 text-center">
            <h2 className="text-2xl mb-2">What Can I Control?</h2>
            <p className="text-sm opacity-90">A story about me and my power</p>
            <div className="mt-4 flex justify-center gap-2">
              {storyPages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPage ? 'bg-warm-orange w-6' : 'bg-white/40'
                  }`}
                  aria-label={`Page ${index + 1} of ${storyPages.length}`}
                />
              ))}
            </div>
          </div>

          {/* Story Content */}
          <div className="p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center space-y-8">
            {/* Illustration */}
            <div className="text-9xl animate-bounce-slow">
              {page.illustration}
            </div>

            {/* Story Text */}
            <div className="text-center max-w-2xl">
              <p className="text-xl md:text-2xl text-calm-slate leading-relaxed">
                {page.content}
              </p>
            </div>

            {/* Interactive Choices */}
            {page.interactionType === 'choice' && page.choices && (
              <div className="w-full max-w-2xl space-y-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {page.choices.map((choice, index) => {
                    const isSelected = (selectedChoices[currentPage] || []).includes(choice.text);
                    return (
                      <button
                        key={index}
                        onClick={() => handleChoice(choice.text, choice.category)}
                        className={`p-6 rounded-2xl shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 min-h-[100px] flex items-center gap-4 ${
                          isSelected
                            ? choice.category === 'control'
                              ? 'bg-gradient-to-br from-sage-green to-sage-green/80 text-white ring-4 ring-sage-green'
                              : 'bg-gradient-to-br from-calm-slate to-calm-slate/80 text-white ring-4 ring-calm-slate'
                            : 'bg-gradient-to-br from-white to-gray-50 text-calm-slate hover:shadow-lg'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex-shrink-0">
                          {choice.category === 'control' ? (
                            <User className="w-8 h-8" />
                          ) : (
                            <Users className="w-8 h-8" />
                          )}
                        </div>
                        <span className="text-left">{choice.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div
                    className={`p-4 rounded-xl text-center animate-fade-in ${
                      showFeedback.correct
                        ? 'bg-sage-green/20 text-forest-green'
                        : 'bg-calm-slate/20 text-calm-slate'
                    }`}
                  >
                    <p className="text-lg">{showFeedback.text}</p>
                  </div>
                )}

                {/* Legend */}
                <div className="flex justify-center gap-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-sage-green" />
                    <span className="text-sm text-calm-slate">I can control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-calm-slate" />
                    <span className="text-sm text-calm-slate">Outside my control</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gradient-to-r from-calm-cream to-white p-6 flex justify-between items-center border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`px-6 py-3 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 min-h-[48px] min-w-[120px] ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-calm-slate text-white hover:bg-calm-slate/90 shadow-md'
              }`}
              aria-label="Previous page"
            >
              ← Previous
            </button>

            <span className="text-calm-slate">
              Page {currentPage + 1} of {storyPages.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === storyPages.length - 1}
              className={`px-6 py-3 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 min-h-[48px] min-w-[120px] ${
                currentPage === storyPages.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-sage-green text-white hover:bg-sage-green/90 shadow-md'
              }`}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Things I Can Control */}
          <div className="bg-gradient-to-br from-sage-green/10 to-white rounded-2xl shadow-lg p-6 border-2 border-sage-green/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-sage-green rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-forest-green">I Can Control</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-sage-green mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">My thoughts and feelings</span>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-sage-green mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">My words and actions</span>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-sage-green mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">How I react to things</span>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-sage-green mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">Asking for help</span>
              </li>
            </ul>
          </div>

          {/* Things Outside My Control */}
          <div className="bg-gradient-to-br from-calm-slate/10 to-white rounded-2xl shadow-lg p-6 border-2 border-calm-slate/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-calm-slate rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-calm-slate">Outside My Control</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-calm-slate mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">What others think or feel</span>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-calm-slate mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">What others say or do</span>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-calm-slate mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">The weather and nature</span>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-calm-slate mt-1 flex-shrink-0" fill="currentColor" />
                <span className="text-calm-slate">Things that already happened</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Encouragement Card */}
        <div className="mt-6 bg-gradient-to-r from-warm-orange/20 to-sage-green/20 rounded-2xl p-6 text-center border-2 border-warm-orange/30">
          <p className="text-lg text-calm-slate">
            💡 <strong>Remember:</strong> Focus on what you CAN control, and be kind to yourself about what you can't!
          </p>
        </div>
      </div>
    </div>
  );
}
