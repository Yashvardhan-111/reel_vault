// "use client";
// import { useState } from 'react';
// import { Play } from 'lucide-react';

// const VideoFeedPage = () => {
//   const [hoveredVideo, setHoveredVideo] = useState(null);

//   const videos = [
//     { id: 1, title: 'Epic Sunset Timelapse', duration: '2:34', thumbnail: '🌅' },
//     { id: 2, title: 'Urban Exploration', duration: '5:12', thumbnail: '🏙️' },
//     { id: 3, title: 'Nature Documentary', duration: '8:45', thumbnail: '🌲' },
//     { id: 4, title: 'Cooking Tutorial', duration: '12:20', thumbnail: '🍳' },
//     { id: 5, title: 'Travel Vlog Japan', duration: '15:30', thumbnail: '🗾' },
//     { id: 6, title: 'Tech Review 2024', duration: '10:15', thumbnail: '💻' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pt-20 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
//             Your Videos
//           </h1>
//           <p className="text-gray-400">Browse and manage your uploaded content</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {videos.map((video) => (
//             <div
//               key={video.id}
//               onMouseEnter={() => setHoveredVideo(null)}
//               onMouseLeave={() => setHoveredVideo(null)}
//               className="group relative bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer"
//             >
//               <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center text-6xl">
//                 {video.thumbnail}
//               </div>
              
//               <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
//                 hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
//               }`}>
//                 <div className="flex space-x-4">
//                   <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors">
//                     <Play size={24} fill="currentColor" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
//                   {video.title}
//                 </h3>
//                 <div className="flex items-center justify-between text-sm text-gray-400">
//                   <span>{video.duration}</span>
//                   <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-400 text-xs">
//                     HD
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default VideoFeedPage;
// import VideoFeed from "./components/VideoFeed"
// export default function Home() {
//   return (
//     <main className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Video Gallery</h1>
//       <VideoFeed videos={[]} />
//     </main>
//   )
// }
"use client";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import { Film, TrendingUp, Clock } from "lucide-react";


export default async function HomePage() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/video");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: IVideo[] = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 px-4 py-8">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyNywgMCwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎥 Featured Videos
          </span>
        </h1>
        <VideoFeed videos={videos} />
      </div>
    </section>
  );
}
