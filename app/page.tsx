"use client";
import { useState } from 'react';
import { Play } from 'lucide-react';

const VideoFeedPage = () => {
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const videos = [
    { id: 1, title: 'Epic Sunset Timelapse', duration: '2:34', thumbnail: '🌅' },
    { id: 2, title: 'Urban Exploration', duration: '5:12', thumbnail: '🏙️' },
    { id: 3, title: 'Nature Documentary', duration: '8:45', thumbnail: '🌲' },
    { id: 4, title: 'Cooking Tutorial', duration: '12:20', thumbnail: '🍳' },
    { id: 5, title: 'Travel Vlog Japan', duration: '15:30', thumbnail: '🗾' },
    { id: 6, title: 'Tech Review 2024', duration: '10:15', thumbnail: '💻' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Your Videos
          </h1>
          <p className="text-gray-400">Browse and manage your uploaded content</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              onMouseEnter={() => setHoveredVideo(null)}
              onMouseLeave={() => setHoveredVideo(null)}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center text-6xl">
                {video.thumbnail}
              </div>
              
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex space-x-4">
                  <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{video.duration}</span>
                  <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-400 text-xs">
                    HD
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoFeedPage;