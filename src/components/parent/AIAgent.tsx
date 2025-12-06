import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { MedicationReminder } from '../../App';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Bot, Send, Calendar, Pill, AlertCircle } from 'lucide-react';

interface Props {
  medications: MedicationReminder[];
  addMedication: (medication: MedicationReminder) => void;
  navigate: NavigateFunction;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAgent({ medications, addMedication, navigate }: Props) {
  const { speak } = useAccessibility();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI health assistant. I can help you track medications, schedule appointments, and answer questions about your child's care. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = [
    { id: '1', text: 'Schedule medication refill', icon: <Pill className="w-4 h-4" /> },
    { id: '2', text: 'View medication schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: '3', text: 'Set appointment reminder', icon: <AlertCircle className="w-4 h-4" /> },
    { id: '4', text: 'Medication interactions', icon: <Pill className="w-4 h-4" /> }
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      speak(aiResponse);
    }, 1000);
  };

  const generateAIResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('refill') || lowerText.includes('medication')) {
      return "I can help you with medication refills. Based on your current schedule, you have a refill due in 3 days. Would you like me to send a reminder to your pharmacy?";
    } else if (lowerText.includes('appointment') || lowerText.includes('schedule')) {
      return "Your next OT appointment is in 7 days. Would you like me to set a reminder or help you reschedule?";
    } else if (lowerText.includes('interaction')) {
      return "I can check medication interactions for you. Please note that I'm an AI assistant and cannot replace professional medical advice. Always consult with your healthcare provider for medication concerns.";
    } else if (lowerText.includes('help') || lowerText.includes('support')) {
      return "I'm here to help! I can assist with medication tracking, appointment scheduling, health questions, and connecting you with resources. What would you like to know?";
    } else {
      return "Thank you for your message. I'm continuously learning to better assist you. For specific medical advice, please consult with your healthcare provider. Is there anything else I can help you with?";
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      {/* Header */}
      <div className="bg-[#2E5580] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/parent')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">AI Health Assistant</h1>
        <Bot className="w-5 h-5" />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This AI assistant is for informational purposes only. 
                Always consult healthcare professionals for medical advice. Figma Make is not designed 
                for collecting PII or securing sensitive medical data.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg text-[#2E5580] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.text)}
                onMouseEnter={() => speak(action.text)}
                className="flex items-center gap-3 p-3 bg-[#F5F5F5] hover:bg-[#7CBEA1]/20 rounded-xl transition-colors text-left"
              >
                <div className="text-[#2E5580]">{action.icon}</div>
                <span className="text-sm text-gray-700">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-24">
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#2E5580] text-white'
                      : 'bg-[#F5F5F5] text-gray-800'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-[#7CBEA1]" />
                      <span className="text-xs text-gray-500">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2E5580] focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-[#7CBEA1] hover:bg-[#6BAD90] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Medications Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg text-[#2E5580] mb-4">Upcoming Medication Reminders</h2>
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-xl">
                <div className="flex items-center gap-3">
                  <Pill className="w-5 h-5 text-[#2E5580]" />
                  <div>
                    <p className="text-sm">{med.name}</p>
                    <p className="text-xs text-gray-500">in {med.daysUntil} days</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  med.daysUntil <= 3 ? 'bg-red-100 text-red-700' : 
                  med.daysUntil <= 5 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {med.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}