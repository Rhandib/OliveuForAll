import { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { Note, MedicationReminder, Contact, ChildProgress } from '../App';
import { NavigateFunction } from '../types/navigation';
import { Calendar, Pill, BookOpen, Users, MessageSquare, Sparkles, Bot, Home, Search, TrendingUp, Clock, Smile, Activity, Settings } from 'lucide-react';

interface Props {
  notes: Note[];
  addNote: (text: string, author: 'parent' | 'child' | 'shared') => void;
  medications: MedicationReminder[];
  contacts: Contact[];
  childProgress: ChildProgress;
  updateDailyTimeLimit: (minutes: number) => void;
  navigate: NavigateFunction;
}

export default function ParentInterface({ notes, addNote, medications, contacts, childProgress, updateDailyTimeLimit, navigate }: Props) {
  const { speak } = useAccessibility();
  const [showTimeLimitEditor, setShowTimeLimitEditor] = useState(false);
  const [newTimeLimit, setNewTimeLimit] = useState(childProgress.dailyTimeLimit);

  const handleNavigation = (path: string, label: string) => {
    speak(label);
    navigate(path as any);
  };

  const getMostFrequentEmotion = () => {
    if (childProgress.emotionLogs.length === 0) return { emotion: 'None', count: 0 };
    const emotionCounts: { [key: string]: number } = {};
    childProgress.emotionLogs.slice(0, 10).forEach(log => {
      emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
    });
    const mostFrequent = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    return { emotion: mostFrequent[0], count: mostFrequent[1] };
  };

  const getMostUsedActivity = () => {
    if (childProgress.activitySessions.length === 0) return { activity: 'None', duration: 0 };
    const activityTotals: { [key: string]: number } = {};
    childProgress.activitySessions.forEach(session => {
      activityTotals[session.activity] = (activityTotals[session.activity] || 0) + session.duration;
    });
    const mostUsed = Object.entries(activityTotals).sort((a, b) => b[1] - a[1])[0];
    return { activity: mostUsed[0], duration: mostUsed[1] };
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      'Happy': '😊',
      'Sad': '😢',
      'Angry': '😠',
      'Worried': '😰',
      'Tired': '😴',
      'Excited': '😃',
      'Calm': '😌',
      'Scared': '😨'
    };
    return emojiMap[emotion] || '😊';
  };

  const getActivityIcon = (activity: string) => {
    if (activity.includes('Art')) return '🎨';
    if (activity.includes('Music')) return '🎵';
    if (activity.includes('Games')) return '🎮';
    if (activity.includes('Video')) return '📺';
    return '✨';
  };

  const handleUpdateTimeLimit = () => {
    updateDailyTimeLimit(newTimeLimit);
    setShowTimeLimitEditor(false);
    speak(`Daily time limit updated to ${newTimeLimit} minutes`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-cream to-sage-green/10 relative pb-24 canvas-texture">
      {/* Top Navigation Bar */}
      <div className="bg-calm-slate shadow-md paint-texture">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-calm-cream hover:text-warm-orange transition-colors min-w-[48px] min-h-[48px] -ml-2 pl-2 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg"
            aria-label="Go back to home"
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>
          <h2 className="text-calm-cream">Parent Dashboard</h2>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Greeting Section */}
        <div className="text-center space-y-2">
          <h1 className="text-calm-slate">Hello Jenny!</h1>
          <p className="text-forest-green/70">Supporting your family&apos;s wellbeing journey</p>
        </div>

        {/* Search Bar - Accessible */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-2 flex gap-2 paper-texture">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-green/50" />
              <input
                type="text"
                placeholder="Search resources, contacts, or information..."
                className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange"
                aria-label="Search"
              />
            </div>
            <button 
              className="bg-calm-slate text-calm-cream px-6 py-3 rounded-xl hover:bg-calm-slate/90 transition-colors focus:outline-none focus:ring-2 focus:ring-warm-orange min-w-[80px]"
              aria-label="Submit search"
            >
              Go
            </button>
          </div>
        </div>

        {/* At a Glance - Medication Reminders */}
        <section className="bg-white rounded-3xl shadow-lg p-8 space-y-6 paper-texture paper-card" aria-label="Medication reminders at a glance">
          <div className="flex items-center justify-between">
            <h2 className="text-calm-slate">At a Glance</h2>
            <Calendar className="w-6 h-6 text-calm-slate" aria-hidden="true" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {medications.map((med) => (
              <div 
                key={med.id} 
                className="bg-gradient-to-br from-sage-green/10 to-calm-slate/5 rounded-2xl p-6 border-2 border-sage-green/20 hover:border-sage-green/40 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <div className="text-center">
                      <div className="text-calm-slate">{med.daysUntil}</div>
                      <div className="text-xs text-forest-green/70">Days</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-forest-green/70 capitalize">{med.type}</p>
                  </div>
                </div>
                <button 
                  className="w-full bg-sage-green text-deep-black py-3 rounded-xl hover:bg-sage-green/90 transition-colors focus:outline-none focus:ring-2 focus:ring-warm-orange shadow-sm"
                  onClick={() => speak(`${med.name} in ${med.daysUntil} days`)}
                  aria-label={`${med.name} reminder: ${med.daysUntil} days until ${med.type}`}
                >
                  {med.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Child Progress Overview */}
        <section className="bg-gradient-to-br from-warm-orange/10 to-sage-green/10 rounded-3xl shadow-lg p-8 space-y-6 border-2 border-warm-orange/20" aria-label="Child progress overview">
          <div className="flex items-center justify-between">
            <h2 className="text-calm-slate flex items-center gap-2">
              <TrendingUp className="w-6 h-6" aria-hidden="true" />
              Benny&apos;s Progress
            </h2>
            <button
              onClick={() => setShowTimeLimitEditor(!showTimeLimitEditor)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-calm-cream transition-colors focus:outline-none focus:ring-2 focus:ring-warm-orange"
              aria-label="Adjust daily time limit"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">Settings</span>
            </button>
          </div>

          {/* Time Limit Editor */}
          {showTimeLimitEditor && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-forest-green/80 mb-2">Daily Time Limit (minutes)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="30"
                    max="240"
                    step="15"
                    value={newTimeLimit}
                    onChange={(e) => setNewTimeLimit(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label="Adjust daily time limit slider"
                  />
                  <span className="text-2xl text-calm-slate font-medium w-20 text-center">{newTimeLimit}m</span>
                </div>
                <div className="flex justify-between text-xs text-forest-green/60 mt-2">
                  <span>30 min</span>
                  <span>240 min (4 hrs)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTimeLimitEditor(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTimeLimit}
                  className="flex-1 bg-sage-green hover:bg-sage-green/90 text-deep-black py-2 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Progress Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Screen Time Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-calm-slate/20 to-sage-green/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-calm-slate" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-forest-green/70">Screen Time</p>
                  <p className="text-sm text-calm-slate">Today</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl text-calm-slate">{childProgress.totalTimeToday}</span>
                  <span className="text-forest-green/70 mb-1">/ {childProgress.dailyTimeLimit} min</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sage-green to-warm-orange transition-all duration-500"
                    style={{ 
                      width: `${Math.min((childProgress.totalTimeToday / childProgress.dailyTimeLimit) * 100, 100)}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-forest-green/60">
                  {Math.max(0, childProgress.dailyTimeLimit - childProgress.totalTimeToday)} minutes remaining
                </p>
              </div>
            </div>

            {/* Recent Mood Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-warm-orange/20 to-sage-green/20 rounded-xl flex items-center justify-center">
                  <Smile className="w-6 h-6 text-warm-orange" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-forest-green/70">Recent Mood</p>
                  <p className="text-sm text-calm-slate">Most Frequent</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{getEmotionEmoji(getMostFrequentEmotion().emotion)}</span>
                  <div>
                    <p className="text-lg text-calm-slate">{getMostFrequentEmotion().emotion}</p>
                    <p className="text-xs text-forest-green/60">
                      Logged {getMostFrequentEmotion().count} time{getMostFrequentEmotion().count !== 1 ? 's' : ''} recently
                    </p>
                  </div>
                </div>
                {childProgress.emotionLogs.length > 0 && (
                  <p className="text-xs text-forest-green/60">
                    Last logged: {childProgress.emotionLogs[0].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>

            {/* Activity Usage Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-green/20 to-warm-orange/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-sage-green" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-forest-green/70">Top Activity</p>
                  <p className="text-sm text-calm-slate">Most Used</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getActivityIcon(getMostUsedActivity().activity)}</span>
                  <div>
                    <p className="text-lg text-calm-slate">{getMostUsedActivity().activity}</p>
                    <p className="text-xs text-forest-green/60">
                      {getMostUsedActivity().duration} minutes total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-calm-slate mb-4">Recent Activity</h3>
            {childProgress.activitySessions.length > 0 ? (
              <div className="space-y-3">
                {childProgress.activitySessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-sage-green/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getActivityIcon(session.activity)}</span>
                      <div>
                        <p className="text-sm text-deep-black">{session.activity}</p>
                        <p className="text-xs text-forest-green/60">
                          {session.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-calm-slate font-medium">{session.duration}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-forest-green/60 text-center py-4">No activities logged yet</p>
            )}
          </div>

          {/* Emotion History */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-calm-slate mb-4">Emotion Check-ins</h3>
            {childProgress.emotionLogs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {childProgress.emotionLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-center gap-2 px-4 py-2 bg-warm-orange/10 rounded-full">
                    <span className="text-xl">{getEmotionEmoji(log.emotion)}</span>
                    <span className="text-sm text-calm-slate">{log.emotion}</span>
                    <span className="text-xs text-forest-green/60">
                      {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-forest-green/60 text-center py-4">No emotions logged yet</p>
            )}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="space-y-6" aria-label="Quick actions">
          <h2 className="text-center text-calm-slate">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={<Bot className="w-10 h-10" />}
              label="AI Assistant"
              description="Get help & guidance"
              onClick={() => handleNavigation('/parent/ai-agent', 'AI Assistant')}
              color="#5E718B"
            />
            <QuickActionCard
              icon={<BookOpen className="w-10 h-10" />}
              label="Resources"
              description="Educational materials"
              onClick={() => handleNavigation('/parent/resources', 'Resources')}
              color="#96AA9A"
            />
            <QuickActionCard
              icon={<Pill className="w-10 h-10" />}
              label="Medical Info"
              description="Health records"
              onClick={() => handleNavigation('/parent/medication-agent', 'Medication Agent')}
              color="#E2A55E"
            />
            <QuickActionCard
              icon={<Users className="w-10 h-10" />}
              label="Contacts"
              description="Care team directory"
              onClick={() => handleNavigation('/parent/contacts', 'Contacts')}
              color="#5E718B"
            />
          </div>
        </section>

        {/* Shared Notes Preview */}
        <section className="bg-white rounded-3xl shadow-lg p-8 space-y-4 paper-texture paper-card" aria-label="Recent shared notes">
          <div className="flex items-center justify-between">
            <h3 className="text-calm-slate">Recent Notes</h3>
            <button
              onClick={() => handleNavigation('/notes', 'View all notes')}
              className="text-sm text-warm-orange hover:text-warm-orange/80 transition-colors focus:outline-none focus:ring-2 focus:ring-warm-orange rounded px-2 py-1"
              aria-label="View all notes"
            >
              View All
            </button>
          </div>
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="bg-sage-green/5 rounded-xl p-4 border border-sage-green/20">
                  <p className="text-sm text-deep-black">{note.text}</p>
                  <p className="text-xs text-forest-green/60 mt-2">
                    {note.author} • {note.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-forest-green/60 text-center py-4">No notes yet</p>
          )}
        </section>
      </div>

      {/* Bottom Navigation - Fixed & Accessible */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sage-green/20 shadow-lg paper-texture" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => handleNavigation('/parent/ai-agent', 'AI Agent')}
              className="flex flex-col items-center gap-2 hover:text-warm-orange transition-colors py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange min-h-[72px]"
              onMouseEnter={() => speak('AI Agent')}
              aria-label="AI Agent - Get assistance with medication and care"
            >
              <Bot className="w-7 h-7" aria-hidden="true" />
              <span className="text-xs">AI Agent</span>
            </button>
            <button 
              onClick={() => handleNavigation('/parent/resources', 'Resources')}
              className="flex flex-col items-center gap-2 hover:text-warm-orange transition-colors py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange min-h-[72px]"
              onMouseEnter={() => speak('Resources')}
              aria-label="Resources - Access educational materials"
            >
              <BookOpen className="w-7 h-7" aria-hidden="true" />
              <span className="text-xs">Resources</span>
            </button>
            <button 
              onClick={() => handleNavigation('/parent/medication-agent', 'Medication Agent')}
              className="flex flex-col items-center gap-2 hover:text-warm-orange transition-colors py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange min-h-[72px]"
              onMouseEnter={() => speak('Medication Agent')}
              aria-label="Medication Agent - Track and manage medications"
            >
              <Pill className="w-7 h-7" aria-hidden="true" />
              <span className="text-xs">Medications</span>
            </button>
            <button 
              onClick={() => handleNavigation('/notes', 'Notes')}
              className="flex flex-col items-center gap-2 hover:text-warm-orange transition-colors py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange min-h-[72px]"
              onMouseEnter={() => speak('Notes')}
              aria-label="Shared Notes - View and add family notes"
            >
              <MessageSquare className="w-7 h-7" aria-hidden="true" />
              <span className="text-xs">Notes</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Affirmations Floating Button */}
      <button
        onClick={() => handleNavigation('/parent/affirmations', 'Affirmations')}
        className="fixed bottom-28 right-6 bg-gradient-to-br from-warm-orange to-sage-green text-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 z-10 paint-texture"
        onMouseEnter={() => speak('Daily Affirmations')}
        aria-label="View daily affirmations for parent support"
      >
        <Sparkles className="w-7 h-7" aria-hidden="true" />
      </button>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  color: string;
}

function QuickActionCard({ icon, label, description, onClick, color }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 active:scale-[0.98] flex flex-col items-center gap-4 min-h-[180px] paper-texture paper-card"
      aria-label={`${label}: ${description}`}
    >
      <div className="p-4 rounded-2xl paint-texture" style={{ backgroundColor: color + '20', color: color }}>
        {icon}
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-deep-black">{label}</h3>
        <p className="text-xs text-forest-green/70">{description}</p>
      </div>
    </button>
  );
}