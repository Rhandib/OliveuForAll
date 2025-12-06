import { useState, useEffect } from 'react';
import { Pill, Calendar, Bell, Search, Plus, Trash2, Clock, AlertCircle, CheckCircle, Package, ArrowLeft } from 'lucide-react';
import { NavigateFunction } from '../../types/navigation';
import { useAccessibility } from '../AccessibilityProvider';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  dosesPerDay: number;
  pillsPerDose: number;
  pillsRemaining: number;
  prescriber: string;
  pharmacy: string;
  pickupStatus: 'not-ordered' | 'ordered' | 'ready' | 'picked-up';
}

interface AdherenceLog {
  id: number;
  medId: number;
  timestamp: string;
}

interface Props {
  navigate: NavigateFunction;
}

export default function MedicationAgent({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [adherenceLog, setAdherenceLog] = useState<AdherenceLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'tracker' | 'search'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    dosesPerDay: '1',
    pillsPerDose: '1',
    pillsRemaining: '30',
    prescriber: '',
    pharmacy: ''
  });

  useEffect(() => {
    speak('Medication Management Agent');
    loadData();
  }, [speak]);

  const loadData = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).storage) {
        const medsResult = await (window as any).storage.get('medications');
        const logResult = await (window as any).storage.get('adherence-log');
        
        if (medsResult?.value) {
          setMedications(JSON.parse(medsResult.value));
        }
        if (logResult?.value) {
          setAdherenceLog(JSON.parse(logResult.value));
        }
      } else {
        // Fallback to localStorage
        const savedMeds = localStorage.getItem('medications');
        const savedLog = localStorage.getItem('adherence-log');
        if (savedMeds) setMedications(JSON.parse(savedMeds));
        if (savedLog) setAdherenceLog(JSON.parse(savedLog));
      }
    } catch (error) {
      console.log('No existing data found');
    }
    setLoading(false);
  };

  const saveData = async (newMeds?: Medication[], newLog?: AdherenceLog[]) => {
    try {
      const medsToSave = newMeds || medications;
      const logToSave = newLog !== undefined ? newLog : adherenceLog;
      
      if (typeof window !== 'undefined' && (window as any).storage) {
        await (window as any).storage.set('medications', JSON.stringify(medsToSave));
        await (window as any).storage.set('adherence-log', JSON.stringify(logToSave));
      } else {
        // Fallback to localStorage
        localStorage.setItem('medications', JSON.stringify(medsToSave));
        localStorage.setItem('adherence-log', JSON.stringify(logToSave));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMedication = () => {
    if (!formData.name || !formData.dosage) {
      alert('Please fill in required fields');
      speak('Please fill in required fields');
      return;
    }

    const newMed: Medication = {
      id: Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      dosesPerDay: parseInt(formData.dosesPerDay),
      pillsPerDose: parseInt(formData.pillsPerDose),
      pillsRemaining: parseInt(formData.pillsRemaining),
      prescriber: formData.prescriber,
      pharmacy: formData.pharmacy,
      pickupStatus: 'not-ordered'
    };

    const newMeds = [...medications, newMed];
    setMedications(newMeds);
    saveData(newMeds, adherenceLog);
    
    setFormData({
      name: '',
      dosage: '',
      dosesPerDay: '1',
      pillsPerDose: '1',
      pillsRemaining: '30',
      prescriber: '',
      pharmacy: ''
    });
    setActiveTab('dashboard');
    speak(`${newMed.name} added successfully`);
  };

  const deleteMedication = (id: number) => {
    const med = medications.find(m => m.id === id);
    const newMeds = medications.filter(m => m.id !== id);
    setMedications(newMeds);
    saveData(newMeds, adherenceLog);
    speak(`${med?.name} removed`);
  };

  const updateMedication = (id: number, updates: Partial<Medication>) => {
    const newMeds = medications.map(m => m.id === id ? { ...m, ...updates } : m);
    setMedications(newMeds);
    saveData(newMeds, adherenceLog);
  };

  const logDose = (medId: number) => {
    const med = medications.find(m => m.id === medId);
    const newLog: AdherenceLog[] = [...adherenceLog, {
      medId,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }];
    setAdherenceLog(newLog);
    saveData(medications, newLog);
    speak(`Dose of ${med?.name} logged`);
  };

  const calculateRefillDate = (med: Medication) => {
    const dailyUsage = med.dosesPerDay * med.pillsPerDose;
    const daysRemaining = Math.floor(med.pillsRemaining / dailyUsage);
    const refillDate = new Date();
    refillDate.setDate(refillDate.getDate() + daysRemaining);
    return { daysRemaining, refillDate };
  };

  const searchDrugInfo = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    speak(`Searching for ${searchQuery}`);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Search for information about the medication "${searchQuery}" including: common uses, side effects, interactions, and important warnings. Provide accurate, sourced information.`
            }
          ],
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search"
            }
          ]
        })
      });

      const data = await response.json();
      const text = data.content.map((item: any) => item.type === "text" ? item.text : "").join("\n");
      setSearchResults(text);
      speak('Search results loaded');
    } catch (error) {
      setSearchResults("Error searching for drug information. Please try again.");
      speak('Error searching for drug information');
    }
    setSearching(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sage-green/20 to-calm-cream canvas-texture">
        <div className="text-calm-slate">Loading your medications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green/20 to-calm-cream pb-20 canvas-texture">
      {/* Header */}
      <div className="bg-calm-slate text-calm-cream p-4 shadow-md paint-texture">
        <button 
          onClick={() => navigate('/parent')} 
          className="flex items-center gap-2 hover:text-warm-orange transition-colors min-h-[48px] -ml-2 pl-2 focus:outline-none focus:ring-2 focus:ring-warm-orange rounded-lg mb-3"
          aria-label="Go back to parent dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Pill className="w-8 h-8 text-warm-orange" />
          <h1>Medication Management</h1>
        </div>
        <p className="text-xs text-warm-orange/90">
          ⚠️ DISCLAIMER: This tool is for informational and organizational purposes only. 
          It does not replace professional medical advice, diagnosis, or treatment. 
          Always consult your healthcare provider before making medication decisions.
        </p>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="bg-white rounded-3xl shadow-lg mb-6 paper-texture overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { key: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { key: 'add', label: '➕ Add Med', icon: '➕' },
              { key: 'tracker', label: '✓ Tracker', icon: '✓' },
              { key: 'search', label: '🔍 Search', icon: '🔍' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key as any); speak(tab.label); }}
                className={`py-4 px-6 transition-all focus:outline-none focus:ring-4 focus:ring-warm-orange/50 ${
                  activeTab === tab.key
                    ? 'bg-calm-slate text-calm-cream'
                    : 'bg-white text-forest-green hover:bg-sage-green/10'
                }`}
                aria-label={tab.label}
                aria-pressed={activeTab === tab.key}
              >
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden text-2xl">{tab.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {medications.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center paper-texture">
                <Pill className="w-16 h-16 text-sage-green mx-auto mb-4" />
                <h2 className="text-calm-slate mb-2">No Medications Yet</h2>
                <p className="text-forest-green/70 mb-6">Add your first medication to get started</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-calm-slate text-calm-cream px-6 py-3 rounded-2xl hover:bg-forest-green transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-warm-orange/50"
                  aria-label="Add your first medication"
                >
                  Add Medication
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {medications.map(med => {
                  const { daysRemaining, refillDate } = calculateRefillDate(med);
                  const needsRefill = daysRemaining <= 7;
                  
                  return (
                    <div key={med.id} className="bg-white rounded-3xl shadow-lg p-6 paper-texture">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-calm-slate">{med.name}</h3>
                          <p className="text-forest-green/70">{med.dosage}</p>
                          {med.prescriber && <p className="text-sm text-forest-green/60">Prescribed by: {med.prescriber}</p>}
                          {med.pharmacy && <p className="text-sm text-forest-green/60">Pharmacy: {med.pharmacy}</p>}
                        </div>
                        <button
                          onClick={() => deleteMedication(med.id)}
                          className="text-warm-orange/70 hover:text-warm-orange transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-orange"
                          aria-label={`Delete ${med.name}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-forest-green/50" />
                          <span className="text-sm text-forest-green/70">
                            {med.dosesPerDay}x daily, {med.pillsPerDose} pill(s) per dose
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-forest-green/50" />
                          <span className="text-sm text-forest-green/70">
                            {med.pillsRemaining} pills remaining
                          </span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-2xl mb-4 ${needsRefill ? 'bg-warm-orange/10 border-2 border-warm-orange/30' : 'bg-sage-green/10 border-2 border-sage-green/30'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {needsRefill ? (
                            <AlertCircle className="w-5 h-5 text-warm-orange" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-sage-green" />
                          )}
                          <span className={`${needsRefill ? 'text-warm-orange' : 'text-forest-green'}`}>
                            {needsRefill ? 'Refill Needed Soon!' : 'Refill Status: Good'}
                          </span>
                        </div>
                        <p className="text-sm text-forest-green/80">
                          Estimated refill date: <strong>{refillDate.toLocaleDateString()}</strong> ({daysRemaining} days)
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-forest-green/70 mb-1">Pickup Status</label>
                          <select
                            value={med.pickupStatus || 'not-ordered'}
                            onChange={(e) => updateMedication(med.id, { pickupStatus: e.target.value as any })}
                            className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-warm-orange"
                            aria-label={`Pickup status for ${med.name}`}
                          >
                            <option value="not-ordered">Not Ordered</option>
                            <option value="ordered">Ordered</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="picked-up">Picked Up</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => logDose(med.id)}
                            className="w-full md:w-auto bg-calm-slate text-calm-cream px-6 py-3 rounded-2xl hover:bg-forest-green transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-warm-orange/50 whitespace-nowrap"
                            aria-label={`Log dose taken for ${med.name}`}
                          >
                            Log Dose Taken
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Medication Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
            <h2 className="text-calm-slate mb-6">Add New Medication</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-forest-green mb-2">Medication Name *</label>
                <input 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange" 
                  placeholder="e.g., Lisinopril"
                  aria-label="Medication name" 
                />
              </div>
              <div>
                <label className="block text-sm text-forest-green mb-2">Dosage *</label>
                <input 
                  name="dosage" 
                  value={formData.dosage}
                  onChange={handleInputChange}
                  className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange" 
                  placeholder="e.g., 10mg"
                  aria-label="Dosage amount" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-forest-green mb-2">Doses Per Day *</label>
                  <input 
                    name="dosesPerDay" 
                    type="number" 
                    min="1" 
                    value={formData.dosesPerDay}
                    onChange={handleInputChange}
                    className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange"
                    aria-label="Number of doses per day" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-forest-green mb-2">Pills Per Dose *</label>
                  <input 
                    name="pillsPerDose" 
                    type="number" 
                    min="1" 
                    value={formData.pillsPerDose}
                    onChange={handleInputChange}
                    className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange"
                    aria-label="Number of pills per dose" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-forest-green mb-2">Pills Remaining *</label>
                  <input 
                    name="pillsRemaining" 
                    type="number" 
                    min="0" 
                    value={formData.pillsRemaining}
                    onChange={handleInputChange}
                    className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange"
                    aria-label="Number of pills remaining" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-forest-green mb-2">Prescriber (Optional)</label>
                <input 
                  name="prescriber" 
                  value={formData.prescriber}
                  onChange={handleInputChange}
                  className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange" 
                  placeholder="Dr. Smith"
                  aria-label="Prescriber name" 
                />
              </div>
              <div>
                <label className="block text-sm text-forest-green mb-2">Pharmacy (Optional)</label>
                <input 
                  name="pharmacy" 
                  value={formData.pharmacy}
                  onChange={handleInputChange}
                  className="w-full border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange" 
                  placeholder="CVS on Main St"
                  aria-label="Pharmacy name" 
                />
              </div>
              <button 
                onClick={handleAddMedication}
                className="w-full bg-calm-slate text-calm-cream py-4 rounded-2xl hover:bg-forest-green transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50"
                aria-label="Add medication to list"
              >
                Add Medication
              </button>
            </div>
          </div>
        )}

        {/* Adherence Tracker Tab */}
        {activeTab === 'tracker' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
            <h2 className="text-calm-slate mb-6">Adherence Tracker</h2>
            {adherenceLog.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-sage-green/50 mx-auto mb-4" />
                <p className="text-forest-green/70">No doses logged yet. Start tracking from the dashboard!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adherenceLog.slice().reverse().map(log => {
                  const med = medications.find(m => m.id === log.medId);
                  return (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-sage-green/5 rounded-2xl border-2 border-sage-green/20">
                      <div>
                        <p className="text-deep-black">{med?.name || 'Unknown Medication'}</p>
                        <p className="text-sm text-forest-green/70">{med?.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-forest-green">{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p className="text-xs text-forest-green/60">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Drug Search Tab */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 paper-texture">
            <h2 className="text-calm-slate mb-6">Drug Information Search</h2>
            <p className="text-sm text-forest-green/70 mb-4">
              Search for medication information including uses, side effects, interactions, and warnings.
            </p>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchDrugInfo()}
                className="flex-1 border-2 border-sage-green/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-orange"
                placeholder="Enter medication name..."
                aria-label="Search for medication information"
              />
              <button
                onClick={searchDrugInfo}
                disabled={searching}
                className="bg-calm-slate text-calm-cream px-6 py-3 rounded-2xl hover:bg-forest-green transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-warm-orange/50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={searching ? 'Searching...' : 'Search for medication'}
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchResults && (
              <div className="bg-sage-green/10 border-2 border-sage-green/30 rounded-2xl p-6">
                <h3 className="text-calm-slate mb-4">Search Results:</h3>
                <div className="text-sm text-forest-green/80 whitespace-pre-wrap">
                  {searchResults}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
