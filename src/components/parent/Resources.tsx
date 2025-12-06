import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, BookOpen, Play, FileText, ExternalLink } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'guide';
  category: string;
  description: string;
  duration?: string;
  url?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Neurodiversity',
    type: 'video',
    category: 'Education',
    description: 'Learn about neurodiversity and how to support your child',
    duration: '12:30'
  },
  {
    id: '2',
    title: 'Emotional Regulation Techniques',
    type: 'guide',
    category: 'Parenting',
    description: 'Practical strategies for helping children manage emotions',
    duration: '15 min read'
  },
  {
    id: '3',
    title: 'Co-regulation: What It Is and Why It Matters',
    type: 'video',
    category: 'Education',
    description: 'Understanding the importance of co-regulation in child development',
    duration: '8:45'
  },
  {
    id: '4',
    title: 'Sensory Processing Guide',
    type: 'article',
    category: 'Education',
    description: 'Understanding sensory needs and creating supportive environments',
    duration: '10 min read'
  },
  {
    id: '5',
    title: 'Building Routines for Success',
    type: 'guide',
    category: 'Parenting',
    description: 'Creating predictable routines that support emotional well-being',
    duration: '12 min read'
  },
  {
    id: '6',
    title: 'Managing Meltdowns with Compassion',
    type: 'video',
    category: 'Parenting',
    description: 'Evidence-based approaches to supporting your child during difficult moments',
    duration: '15:20'
  },
  {
    id: '7',
    title: 'School Accommodations Guide',
    type: 'guide',
    category: 'Advocacy',
    description: 'How to work with schools to get the support your child needs',
    duration: '20 min read'
  },
  {
    id: '8',
    title: 'Self-Care for Caregivers',
    type: 'article',
    category: 'Wellness',
    description: 'Taking care of yourself while caring for your child',
    duration: '8 min read'
  }
];

interface Props {
  navigate: NavigateFunction;
}

export default function Resources({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const categories = ['All', 'Education', 'Parenting', 'Advocacy', 'Wellness'];

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    speak(resource.title);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'article':
        return <FileText className="w-5 h-5" />;
      case 'guide':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return '#80AEDF';
      case 'article':
        return '#7CBEA1';
      case 'guide':
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
        <h1 className="text-xl">Resources & Education</h1>
        <BookOpen className="w-5 h-5" />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); speak(category); }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2E5580] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Resource Detail */}
        {selectedResource && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-xl text-white"
                  style={{ backgroundColor: getTypeColor(selectedResource.type) }}
                >
                  {getTypeIcon(selectedResource.type)}
                </div>
                <div>
                  <h2 className="text-2xl text-[#2E5580] mb-2">{selectedResource.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>{selectedResource.category}</span>
                    <span>•</span>
                    <span>{selectedResource.duration}</span>
                  </div>
                  <p className="text-gray-600">{selectedResource.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {selectedResource.type === 'video' ? (
                <button className="bg-[#80AEDF] hover:bg-[#6D9ACC] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch Now
                </button>
              ) : (
                <button className="bg-[#7CBEA1] hover:bg-[#6BAD90] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <BookOpen className="w-5 h-5" />
                  Read Now
                </button>
              )}
              <button className="border-2 border-gray-300 hover:border-[#2E5580] text-gray-600 hover:text-[#2E5580] px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                <ExternalLink className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        )}

        {/* Resource Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl text-[#2E5580] mb-6">
            {selectedCategory === 'All' ? 'All Resources' : `${selectedCategory} Resources`}
          </h2>
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => handleResourceClick(resource)}
                onMouseEnter={() => speak(resource.title)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                  selectedResource?.id === resource.id
                    ? 'border-[#2E5580] bg-[#2E5580]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl text-white shrink-0"
                    style={{ backgroundColor: getTypeColor(resource.type) }}
                  >
                    {getTypeIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-[#2E5580] mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{resource.category}</span>
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gradient-to-r from-[#7CBEA1]/20 to-[#80AEDF]/20 rounded-2xl p-6">
          <h3 className="text-lg text-[#2E5580] mb-2">Need More Support?</h3>
          <p className="text-gray-700 mb-4">
            Access our community forum, connect with other parents, and get expert advice.
          </p>
          <button className="bg-[#2E5580] hover:bg-[#244566] text-white px-6 py-3 rounded-xl transition-colors">
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
}