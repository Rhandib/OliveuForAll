import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider';
import { NavigateFunction } from '../../types/navigation';
import { ArrowLeft, Video, Play } from 'lucide-react';

const videos = [
  {
    id: '1',
    title: 'Calming Ocean Waves',
    description: 'Relax with peaceful ocean sounds',
    thumbnail: '🌊',
    color: '#80AEDF',
    duration: '5:00'
  },
  {
    id: '2',
    title: 'Breathing with Buddy',
    description: 'Learn breathing techniques',
    thumbnail: '🫁',
    color: '#7CBEA1',
    duration: '3:30'
  },
  {
    id: '3',
    title: 'Feelings Story Time',
    description: 'Understanding emotions through stories',
    thumbnail: '📚',
    color: '#CCBB75',
    duration: '8:00'
  },
  {
    id: '4',
    title: 'Mindful Movement',
    description: 'Gentle exercises for kids',
    thumbnail: '🧘',
    color: '#8282AC',
    duration: '6:15'
  },
  {
    id: '5',
    title: 'Nature Sounds',
    description: 'Forest birds and gentle rain',
    thumbnail: '🌳',
    color: '#7CBEA1',
    duration: '10:00'
  },
  {
    id: '6',
    title: 'Happy Songs',
    description: 'Uplifting music for kids',
    thumbnail: '🎵',
    color: '#A05556',
    duration: '4:45'
  }
];

interface Props {
  navigate: NavigateFunction;
}

export default function VideoActivity({ navigate }: Props) {
  const { speak } = useAccessibility();
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  const handleVideoSelect = (video: typeof videos[0]) => {
    setSelectedVideo(video);
    speak(`Playing ${video.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5D5E4] to-[#B8C9D9]">
      {/* Header */}
      <div className="bg-[#1E1E1E] text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/child')} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl">Videos & Stories</h1>
        <Video className="w-5 h-5" />
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Video Player */}
        {selectedVideo && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div 
              className="aspect-video rounded-xl mb-4 flex items-center justify-center text-9xl"
              style={{ backgroundColor: selectedVideo.color }}
            >
              {selectedVideo.thumbnail}
            </div>
            <h2 className="text-2xl text-[#2E5580] mb-2">{selectedVideo.title}</h2>
            <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
            <div className="flex items-center gap-4">
              <button className="bg-[#7CBEA1] hover:bg-[#6BAD90] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                <Play className="w-5 h-5" />
                Play
              </button>
              <span className="text-gray-500">{selectedVideo.duration}</span>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl text-[#2E5580] mb-6">Choose a Video</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                onMouseEnter={() => speak(video.title)}
                className={`rounded-xl shadow-md overflow-hidden transition-all transform hover:scale-105 ${
                  selectedVideo?.id === video.id ? 'ring-4 ring-[#2E5580]' : ''
                }`}
              >
                <div 
                  className="aspect-video flex items-center justify-center text-6xl"
                  style={{ backgroundColor: video.color }}
                >
                  {video.thumbnail}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm mb-1">{video.title}</h3>
                  <p className="text-xs text-gray-500">{video.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-6 bg-gradient-to-r from-[#7CBEA1]/20 to-[#80AEDF]/20 rounded-2xl p-6">
          <h3 className="text-lg text-[#2E5580] mb-2">Helpful Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Take breaks between videos</li>
            <li>• Practice the breathing exercises together</li>
            <li>• Talk about feelings after watching</li>
            <li>• Use headphones for a calming experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}