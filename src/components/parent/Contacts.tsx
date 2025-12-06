import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { Contact as ContactType } from '../../App';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Users, Phone, Mail, Plus, X } from 'lucide-react';

interface Props {
  contacts: ContactType[];
  addContact: (contact: ContactType) => void;
  navigate: NavigateFunction;
}

export default function Contacts({ contacts, addContact, navigate }: Props) {
  const { speak } = useAccessibility();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    phone: '',
    email: ''
  });

  const roleColors: { [key: string]: string } = {
    'Pediatrician': '#7CBEA1',
    'Occupational Therapist': '#80AEDF',
    'School Support': '#CCBB75',
    'Therapist': '#8282AC',
    'Emergency': '#A05556'
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.role) {
      const contact: ContactType = {
        id: Date.now().toString(),
        name: newContact.name,
        role: newContact.role,
        phone: newContact.phone,
        email: newContact.email
      };
      addContact(contact);
      setNewContact({ name: '', role: '', phone: '', email: '' });
      setShowAddForm(false);
      speak('Contact added');
    }
  };

  const handleCall = (phone: string, name: string) => {
    speak(`Calling ${name}`);
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string, name: string) => {
    speak(`Emailing ${name}`);
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-[#E8EEF3] pb-20">
      {/* Header */}
      <div className="bg-[#2E5580] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/parent')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Contacts</h1>
        <Users className="w-5 h-5" />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Add Contact Button */}
        <div className="mb-6">
          <button
            onClick={() => { setShowAddForm(true); speak('Add new contact'); }}
            className="w-full bg-[#7CBEA1] hover:bg-[#6BAD90] text-white p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Contact
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl text-[#2E5580] mb-4 flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            Emergency Contacts
          </h2>
          <div className="space-y-3">
            <ContactCard
              contact={{
                id: 'emergency-1',
                name: 'Emergency Services',
                role: 'Emergency',
                phone: '911',
                email: ''
              }}
              onCall={handleCall}
              onEmail={handleEmail}
              color="#A05556"
            />
          </div>
        </div>

        {/* All Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl text-[#2E5580] mb-6">Healthcare Team</h2>
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No contacts added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onCall={handleCall}
                  onEmail={handleEmail}
                  color={roleColors[contact.role] || '#2E5580'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Contact Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-[#2E5580]">Add New Contact</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                    placeholder="Dr. Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Role *</label>
                  <select
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                  >
                    <option value="">Select role</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Occupational Therapist">Occupational Therapist</option>
                    <option value="School Support">School Support</option>
                    <option value="Therapist">Therapist</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                    placeholder="doctor@example.com"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    className="flex-1 bg-[#7CBEA1] hover:bg-[#6BAD90] text-white py-3 rounded-lg transition-colors"
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ContactCardProps {
  contact: ContactType;
  onCall: (phone: string, name: string) => void;
  onEmail: (email: string, name: string) => void;
  color: string;
}

function ContactCard({ contact, onCall, onEmail, color }: ContactCardProps) {
  return (
    <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all">
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          <span className="text-xl">{contact.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-[#2E5580] mb-1">{contact.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{contact.role}</p>
          <div className="flex flex-wrap gap-2">
            {contact.phone && (
              <button
                onClick={() => onCall(contact.phone, contact.name)}
                className="flex items-center gap-2 px-4 py-2 bg-[#7CBEA1]/10 hover:bg-[#7CBEA1]/20 text-[#2E5580] rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">{contact.phone}</span>
              </button>
            )}
            {contact.email && (
              <button
                onClick={() => onEmail(contact.email, contact.name)}
                className="flex items-center gap-2 px-4 py-2 bg-[#80AEDF]/10 hover:bg-[#80AEDF]/20 text-[#2E5580] rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">{contact.email}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}