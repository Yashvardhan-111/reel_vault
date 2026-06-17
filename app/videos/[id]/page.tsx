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
    <section className="min-h-screen relative px-4 py-8">
      <div className="relative max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-100">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {video.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-base text-slate-300">
              {video.description}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl aspect-video min-h-[360px] border border-slate-800">
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl ?? undefined}
              controls={video.controls ?? true}
              playsInline
              className="absolute inset-0 w-full h-full object-contain bg-slate-900"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
