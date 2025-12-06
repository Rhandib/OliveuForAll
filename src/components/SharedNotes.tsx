import { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { Note } from '../App';
import { NavigateFunction } from '../types/navigation';
import { ArrowLeft, MessageSquare, Plus, X, Filter, Trash2, Check } from 'lucide-react';

interface Props {
  notes: Note[];
  addNote: (text: string, author: 'parent' | 'child' | 'shared') => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  navigate: NavigateFunction;
}

export default function SharedNotes({ notes, addNote, deleteNote, toggleNoteComplete, navigate }: Props) {
  const { speak } = useAccessibility();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [filterAuthor, setFilterAuthor] = useState<'all' | 'parent' | 'child' | 'shared'>('all');

  const filteredNotes = filterAuthor === 'all' 
    ? notes 
    : notes.filter(note => note.author === filterAuthor);

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      addNote(newNoteText, 'shared');
      setNewNoteText('');
      setShowAddForm(false);
      speak('Note added');
    }
  };

  const getAuthorColor = (author: string) => {
    switch (author) {
      case 'parent':
        return '#2E5580';
      case 'child':
        return '#7CBEA1';
      case 'shared':
        return '#80AEDF';
      default:
        return '#8282AC';
    }
  };

  const getAuthorIcon = (author: string) => {
    switch (author) {
      case 'parent':
        return '👨‍👩‍👧';
      case 'child':
        return '👦';
      case 'shared':
        return '💬';
      default:
        return '📝';
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
        <h1 className="text-xl">Shared Notes</h1>
        <MessageSquare className="w-5 h-5" />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-[#7CBEA1]/20 to-[#80AEDF]/20 rounded-2xl p-6 mb-6">
          <h2 className="text-lg text-[#2E5580] mb-2">Communication Hub</h2>
          <p className="text-gray-700">
            Share important notes, observations, and reminders between parent and child interfaces. 
            Stay connected and informed about your child's day.
          </p>
        </div>

        {/* Add Note Button */}
        <div className="mb-6">
          <button
            onClick={() => { setShowAddForm(true); speak('Add new note'); }}
            className="w-full bg-[#7CBEA1] hover:bg-[#6BAD90] text-white p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Note
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterAuthor('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterAuthor === 'all'
                  ? 'bg-[#2E5580] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Notes
            </button>
            <button
              onClick={() => setFilterAuthor('parent')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterAuthor === 'parent'
                  ? 'bg-[#2E5580] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👨‍👩‍👧 Parent
            </button>
            <button
              onClick={() => setFilterAuthor('child')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterAuthor === 'child'
                  ? 'bg-[#7CBEA1] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👦 Child
            </button>
            <button
              onClick={() => setFilterAuthor('shared')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterAuthor === 'shared'
                  ? 'bg-[#80AEDF] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💬 Shared
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl text-[#2E5580] mb-6">
            {filterAuthor === 'all' ? 'All Notes' : `${filterAuthor.charAt(0).toUpperCase() + filterAuthor.slice(1)} Notes`}
            <span className="ml-2 text-sm text-gray-500">({filteredNotes.length})</span>
          </h2>
          
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No notes yet</p>
              <p className="text-sm mt-2">Start sharing updates and observations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    note.completed 
                      ? 'border-green-300 bg-green-50/50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: getAuthorColor(note.author)
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getAuthorIcon(note.author)}</span>
                      <span 
                        className="text-sm px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: getAuthorColor(note.author) }}
                      >
                        {note.author.charAt(0).toUpperCase() + note.author.slice(1)}
                      </span>
                      {note.completed && (
                        <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Done
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {note.timestamp.toLocaleDateString()} {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-gray-700 mb-3 ${note.completed ? 'line-through opacity-60' : ''}`}>
                    {note.text}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        toggleNoteComplete(note.id);
                        speak(note.completed ? 'Marked as incomplete' : 'Marked as complete');
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] ${
                        note.completed
                          ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
                      }`}
                      aria-label={note.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm">{note.completed ? 'Done' : 'Mark Done'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this note?')) {
                          deleteNote(note.id);
                          speak('Note deleted');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px]"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Note Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-[#2E5580]">Add New Note</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Note</label>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
                    rows={6}
                    placeholder="Enter your note here..."
                    autoFocus
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
                    onClick={handleAddNote}
                    className="flex-1 bg-[#7CBEA1] hover:bg-[#6BAD90] text-white py-3 rounded-lg transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Note Templates */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg text-[#2E5580] mb-4">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => {
                addNote('Great day today! 😊', 'shared');
                speak('Note added');
              }}
              className="p-3 bg-[#7CBEA1]/10 hover:bg-[#7CBEA1]/20 rounded-xl text-left transition-colors"
            >
              <p className="text-sm text-gray-700">Great day today! 😊</p>
            </button>
            <button
              onClick={() => {
                addNote('Need to discuss something when you have time', 'shared');
                speak('Note added');
              }}
              className="p-3 bg-[#80AEDF]/10 hover:bg-[#80AEDF]/20 rounded-xl text-left transition-colors"
            >
              <p className="text-sm text-gray-700">Need to discuss something when you have time</p>
            </button>
            <button
              onClick={() => {
                addNote('Tried a new breathing technique - it helped!', 'shared');
                speak('Note added');
              }}
              className="p-3 bg-[#CCBB75]/10 hover:bg-[#CCBB75]/20 rounded-xl text-left transition-colors"
            >
              <p className="text-sm text-gray-700">Tried a new breathing technique - it helped!</p>
            </button>
            <button
              onClick={() => {
                addNote('Reminder: Doctor appointment next week', 'shared');
                speak('Note added');
              }}
              className="p-3 bg-[#8282AC]/10 hover:bg-[#8282AC]/20 rounded-xl text-left transition-colors"
            >
              <p className="text-sm text-gray-700">Reminder: Doctor appointment next week</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}