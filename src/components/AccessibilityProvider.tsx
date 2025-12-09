import { createContext, useContext, useState, ReactNode } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AccessibilityContextType {
  language: string;
  setLanguage: (lang: string) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export default function AccessibilityProvider({ children }: Props) {
  const [language, setLanguage] = useState('en');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const speak = (text: string) => {
    if (ttsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ language, setLanguage, ttsEnabled, setTtsEnabled, highContrast, setHighContrast, speak }}>
      <div className={highContrast ? 'high-contrast' : ''}>
        {children}
      </div>
      <AccessibilityControls />
    </AccessibilityContext.Provider>
  );
}

function AccessibilityControls() {
  const { language, setLanguage, ttsEnabled, setTtsEnabled, highContrast, setHighContrast } = useAccessibility();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => setTtsEnabled(!ttsEnabled)}
        className="bg-[rgb(150,170,154)] hover:bg-[#6BAD90] p-3 rounded-full shadow-lg transition-colors"
        aria-label={ttsEnabled ? 'Disable text to speech' : 'Enable text to speech'}
      >
        {ttsEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
      </button>
      
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-[#96AA9A] text-white px-3 py-2 rounded-full shadow-lg cursor-pointer"
        aria-label="Select language"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="fr">FR</option>
        <option value="de">DE</option>
      </select>

      <button
        onClick={() => setHighContrast(!highContrast)}
        className="bg-[#96AA9A] hover:bg-[#6BAD90] px-4 py-2 rounded-full shadow-lg text-white transition-colors"
        aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
      >
        {highContrast ? 'HC OFF' : 'HC ON'}
      </button>
    </div>
  );
}