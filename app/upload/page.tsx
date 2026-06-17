import VideoUploadForm from "../components/VideoUploadForm";

export default function UploadPage() {
  return (
    <section className="min-h-screen relative px-4 py-10">
      <div className="relative max-w-3xl mx-auto">
        <VideoUploadForm />
      </div>
    </section>
  );
}