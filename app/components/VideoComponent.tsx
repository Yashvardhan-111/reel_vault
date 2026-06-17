"use client"
//reusable card that displays an uploaded video

import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/30 hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group block w-full">
          <div
            className="rounded-3xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              src={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-contain bg-black"
            />
          </div>
        </Link>
      </figure>

      <div className="p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="text-lg font-semibold text-slate-100">{video.title}</h2>
        </Link>

        <p className="text-sm text-slate-400 line-clamp-2 mt-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}