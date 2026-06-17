import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

type Props = {
  params: {
    id: string;
  };
};

async function getVideoById(id: string) {
  await connectToDatabase();
  const video = await Video.findById(id).lean();
  if (!video) {
    return null;
  }
  return JSON.parse(JSON.stringify(video)) as {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const video = await getVideoById(params.id);
  if (!video) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 px-4 py-8">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyNywgMCwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {video.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-base text-slate-300">
              {video.description}
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden bg-black shadow-2xl">
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls={video.controls ?? true}
              playsInline
              className="w-full h-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
