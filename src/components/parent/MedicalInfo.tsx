import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Pill, FileText, Plus, AlertCircle, Calendar } from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: 'medication' | 'allergy' | 'diagnosis' | 'note';
  title: string;
  details: string;
  date: Date;
}

interface Props {
  navigate: NavigateFunction;
}

export default function MedicalInfo({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'medications' | 'allergies' | 'diagnoses' | 'notes'>('medications');
  const [showAddForm, setShowAddForm] = useState(false);

  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      type: 'medication',
      title: 'ADHD Medication',
      details: '10mg daily, taken in morning with food',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'allergy',
      title: 'Peanuts',
      details: 'Severe allergic reaction - carry EpiPen',
      date: new Date('2023-06-10')
    },
    {
      id: '3',
      type: 'diagnosis',
      title: 'Autism Spectrum Disorder',
      details: 'Diagnosed by Dr. Johnson, requires sensory support',
      date: new Date('2022-03-20')
    },
    {
      id: '4',
      type: 'note',
      title: 'Therapy Session Notes',
      details: 'Making good progress with emotional regulation techniques',
      date: new Date('2024-11-01')
    }
  ]);

  const filteredRecords = medicalRecords.filter(record => {
    if (activeTab === 'medications') return record.type === 'medication';
    if (activeTab === 'allergies') return record.type === 'allergy';
    if (activeTab === 'diagnoses') return record.type === 'diagnosis';
    if (activeTab === 'notes') return record.type === 'note';
    return false;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-5 h-5" />;
      case 'allergy':
        return <AlertCircle className="w-5 h-5" />;
      case 'diagnosis':
        return <FileText className="w-5 h-5" />;
      case 'note':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return '#7CBEA1';
      case 'allergy':
        return '#A05556';
      case 'diagnosis':
        return '#80AEDF';
      case 'note':
        return '#CCBB75';
      default:
        return '#8282AC';
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EEF3] pb-20">
      {/* Header */}
      <div className="bg-[#2E5580] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/parent')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Medical Information</h1>
        <Pill className="w-5 h-5" />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Privacy Notice:</strong> Figma Make is not designed for storing sensitive medical 
                information or PII. This is a demonstration interface. Please use secure healthcare 
                systems for actual medical records.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => { setActiveTab('medications'); speak('Medications'); }}
              className={`py-3 rounded-lg transition-colors ${
                activeTab === 'medications'
                  ? 'bg-[#7CBEA1] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Medications
            </button>
            <button
              onClick={() => { setActiveTab('allergies'); speak('Allergies'); }}
              className={`py-3 rounded-lg transition-colors ${
                activeTab === 'allergies'
                  ? 'bg-[#A05556] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Allergies
            </button>
            <button
              onClick={() => { setActiveTab('diagnoses'); speak('Diagnoses'); }}
              className={`py-3 rounded-lg transition-colors ${
                activeTab === 'diagnoses'
                  ? 'bg-[#80AEDF] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Diagnoses
            </button>
            <button
              onClick={() => { setActiveTab('notes'); speak('Notes'); }}
              className={`py-3 rounded-lg transition-colors ${
                activeTab === 'notes'
                  ? 'bg-[#CCBB75] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-[#2E5580]">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <button
              onClick={() => { setShowAddForm(true); speak('Add new record'); }}
              className="bg-[#7CBEA1] hover:bg-[#6BAD90] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No {activeTab} records yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl text-white shrink-0"
                      style={{ backgroundColor: getTypeColor(record.type) }}
                    >
                      {getTypeIcon(record.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-[#2E5580] mb-1">{record.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{record.details}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{record.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl text-[#2E5580] mb-4">Add New Record</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Details</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                    rows={4}
                    placeholder="Enter details"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowAddForm(false); speak('Record added'); }}
                    className="flex-1 bg-[#7CBEA1] hover:bg-[#6BAD90] text-white py-3 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#7CBEA1] to-[#6BAD90] text-white p-4 rounded-xl">
            <p className="text-sm opacity-90 mb-1">Medications</p>
            <p className="text-2xl">{medicalRecords.filter(r => r.type === 'medication').length}</p>
          </div>
          <div className="bg-gradient-to-br from-[#A05556] to-[#8F4A4B] text-white p-4 rounded-xl">
            <p className="text-sm opacity-90 mb-1">Allergies</p>
            <p className="text-2xl">{medicalRecords.filter(r => r.type === 'allergy').length}</p>
          </div>
          <div className="bg-gradient-to-br from-[#80AEDF] to-[#6D9ACC] text-white p-4 rounded-xl">
            <p className="text-sm opacity-90 mb-1">Diagnoses</p>
            <p className="text-2xl">{medicalRecords.filter(r => r.type === 'diagnosis').length}</p>
          </div>
          <div className="bg-gradient-to-br from-[#CCBB75] to-[#B8A866] text-white p-4 rounded-xl">
            <p className="text-sm opacity-90 mb-1">Notes</p>
            <p className="text-2xl">{medicalRecords.filter(r => r.type === 'note').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}