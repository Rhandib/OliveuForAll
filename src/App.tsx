import { useState } from 'react';
import StartScreen from './components/StartScreen';
import ChildInterface from './components/ChildInterface';
import ParentInterface from './components/ParentInterface';
import ArtActivity from './components/activities/ArtActivity';
import MusicActivity from './components/activities/MusicActivity';
import GamesActivity from './components/activities/GamesActivity';
import VideoActivity from './components/activities/VideoActivity';
import TreasureActivity from './components/activities/TreasureActivity';
import TimerActivity from './components/activities/TimerActivity';
import StoriesActivity from './components/activities/StoriesActivity';
import EmotionsSelector from './components/EmotionsSelector';
import Resources from './components/parent/Resources';
import MedicalInfo from './components/parent/MedicalInfo';
import Contacts from './components/parent/Contacts';
import AIAgent from './components/parent/AIAgent';
import MedicationAgent from './components/parent/MedicationAgent';
import SharedNotes from './components/SharedNotes';
import Affirmations from './components/parent/Affirmations';
import AccessibilityProvider from './components/AccessibilityProvider';

export interface Note {
  id: string;
  text: string;
  timestamp: Date;
  author: 'parent' | 'child' | 'shared';
  completed?: boolean;
}

export interface MedicationReminder {
  id: string;
  name: string;
  daysUntil: number;
  type: 'refill' | 'pickup' | 'appointment';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface EmotionLog {
  id: string;
  emotion: string;
  timestamp: Date;
}

export interface ActivitySession {
  id: string;
  activity: string;
  duration: number; // in minutes
  timestamp: Date;
}

export interface ChildProgress {
  emotionLogs: EmotionLog[];
  activitySessions: ActivitySession[];
  sessionStartTime: Date | null;
  totalTimeToday: number; // in minutes
  dailyTimeLimit: number; // in minutes
}

type Route = 
  | '/'
  | '/child'
  | '/parent'
  | '/child/art'
  | '/child/music'
  | '/child/games'
  | '/child/video'
  | '/child/treasure'
  | '/child/timer'
  | '/child/stories'
  | '/emotions'
  | '/parent/resources'
  | '/parent/medical'
  | '/parent/contacts'
  | '/parent/ai-agent'
  | '/parent/medication-agent'
  | '/notes'
  | '/parent/affirmations';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [notes, setNotes] = useState<Note[]>([]);
  const [medications, setMedications] = useState<MedicationReminder[]>([
    { id: '1', name: 'Refill Meds', daysUntil: 3, type: 'refill' },
    { id: '2', name: 'Pick Up Meds', daysUntil: 6, type: 'pickup' },
    { id: '3', name: 'O.T. App.', daysUntil: 7, type: 'appointment' }
  ]);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Dr. Sarah Johnson', role: 'Pediatrician', phone: '(555) 123-4567', email: 'dr.johnson@health.com' },
    { id: '2', name: 'Alex Chen', role: 'Occupational Therapist', phone: '(555) 234-5678', email: 'alex.chen@therapy.com' },
    { id: '3', name: 'School Counselor', role: 'School Support', phone: '(555) 345-6789', email: 'counselor@school.edu' }
  ]);

  // Child Progress Tracking
  const [childProgress, setChildProgress] = useState<ChildProgress>({
    emotionLogs: [
      { id: '1', emotion: 'Happy', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', emotion: 'Excited', timestamp: new Date(Date.now() - 7200000) },
      { id: '3', emotion: 'Calm', timestamp: new Date(Date.now() - 10800000) }
    ],
    activitySessions: [
      { id: '1', activity: 'Art Activity', duration: 15, timestamp: new Date(Date.now() - 3600000) },
      { id: '2', activity: 'Music Station', duration: 10, timestamp: new Date(Date.now() - 7200000) },
      { id: '3', activity: 'Games', duration: 20, timestamp: new Date(Date.now() - 10800000) },
      { id: '4', activity: 'Video Corner', duration: 12, timestamp: new Date(Date.now() - 14400000) }
    ],
    sessionStartTime: null,
    totalTimeToday: 57,
    dailyTimeLimit: 120 // 2 hours default
  });

  const logEmotion = (emotion: string) => {
    const newLog: EmotionLog = {
      id: Date.now().toString(),
      emotion,
      timestamp: new Date()
    };
    setChildProgress({
      ...childProgress,
      emotionLogs: [newLog, ...childProgress.emotionLogs]
    });
  };

  const logActivity = (activity: string, duration: number) => {
    const newSession: ActivitySession = {
      id: Date.now().toString(),
      activity,
      duration,
      timestamp: new Date()
    };
    setChildProgress({
      ...childProgress,
      activitySessions: [newSession, ...childProgress.activitySessions],
      totalTimeToday: childProgress.totalTimeToday + duration
    });
  };

  const startSession = () => {
    setChildProgress({
      ...childProgress,
      sessionStartTime: new Date()
    });
  };

  const updateDailyTimeLimit = (minutes: number) => {
    setChildProgress({
      ...childProgress,
      dailyTimeLimit: minutes
    });
  };

  const navigate = (route: Route) => {
    setCurrentRoute(route);
  };

  const addNote = (text: string, author: 'parent' | 'child' | 'shared') => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      author
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleNoteComplete = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const addMedication = (medication: MedicationReminder) => {
    setMedications([...medications, medication]);
  };

  const addContact = (contact: Contact) => {
    setContacts([...contacts, contact]);
  };

  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return <StartScreen navigate={navigate} />;
      case '/child':
        return <ChildInterface notes={notes} addNote={addNote} childProgress={childProgress} logEmotion={logEmotion} navigate={navigate} />;
      case '/parent':
        return <ParentInterface notes={notes} addNote={addNote} medications={medications} contacts={contacts} childProgress={childProgress} updateDailyTimeLimit={updateDailyTimeLimit} navigate={navigate} />;
      case '/child/art':
        return <ArtActivity navigate={navigate} />;
      case '/child/music':
        return <MusicActivity navigate={navigate} />;
      case '/child/games':
        return <GamesActivity navigate={navigate} />;
      case '/child/video':
        return <VideoActivity navigate={navigate} />;
      case '/child/treasure':
        return <TreasureActivity navigate={navigate} />;
      case '/child/timer':
        return <TimerActivity navigate={navigate} />;
      case '/child/stories':
        return <StoriesActivity navigate={navigate} />;
      case '/emotions':
        return <EmotionsSelector navigate={navigate} />;
      case '/parent/resources':
        return <Resources navigate={navigate} />;
      case '/parent/medical':
        return <MedicalInfo navigate={navigate} />;
      case '/parent/contacts':
        return <Contacts contacts={contacts} addContact={addContact} navigate={navigate} />;
      case '/parent/ai-agent':
        return <AIAgent medications={medications} addMedication={addMedication} navigate={navigate} />;
      case '/parent/medication-agent':
        return <MedicationAgent navigate={navigate} />;
      case '/notes':
        return <SharedNotes notes={notes} addNote={addNote} deleteNote={deleteNote} toggleNoteComplete={toggleNoteComplete} navigate={navigate} />;
      case '/parent/affirmations':
        return <Affirmations navigate={navigate} />;
      default:
        return <StartScreen navigate={navigate} />;
    }
  };

  return (
    <AccessibilityProvider>
      {renderRoute()}
    </AccessibilityProvider>
  );
}

export default App;