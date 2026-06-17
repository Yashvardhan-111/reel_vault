
import VideoFeed from "./components/VideoFeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login")

  // const res = await fetch("http://localhost:3000/api/video", {
  //   cache: "no-store",
  // });
  // const videos = await res.json();

  return (
    <section className="min-h-screen relative px-4 py-8">
      <div className="relative max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-slate-100">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎥 Featured Videos
          </span>
        </h1>
        <VideoFeed />
      </div>
    </section>
  );
}
