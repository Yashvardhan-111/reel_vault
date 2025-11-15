This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


In dev mode, you run next dev → a local dev server handles everything.
In production, Next.js can run in serverless mode (like on Vercel) → your backend code isn’t one long-running server, it’s split into many tiny serverless functions.
Example: /api/users is one function, /api/videos another
Each request may hit a different server instance.
React Components → Some run on the server (Server Components), some on the client (Client Components).

Models 
.User model
const User = models?.User || model<IUser>("User", userSchema);
Hot reload in Next.js re-executes your file without clearing Mongoose’s model cache → need a conditional check to avoid re-registering the same model.
Hot reloading in Next.js means that when you save code changes in development, Next.js reloads only the modified files without restarting the entire server. This makes updates appear instantly, but with tools like Mongoose it can cause issues, because re-running model definitions on each reload tries to overwrite existing models. To avoid errors, developers check if a model already exists in mongoose.models before creating it again.
models is an object provided by Mongoose.basically a cache that stores all compiled models.A model created with mongoose.model("User", userSchema), Mongoose saves it in mongoose.models.User.

DB Connection 
Cache DB connections (so each serverless call doesn’t open a new one).If you don’t cache the connection, each function will open a new MongoDB connection → you’ll quickly hit connection limits and crash the DB.
So we need to form a global obj to track if DB is connected or not or promise is on the way(call has been sent accept or rejection will happen) that is in types.d.ts
db connection in lib\db.ts

AUTHORIZATION 
NextAuth’s Session - A session is the object you get when a user is authenticated.By default, it looks like this (from DefaultSession):
interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string; // ISO date when session expires
}
Most apps need more than just name,email,image.So you extend Session like in next-auth.d.ts
Final type after augmentation
Your Session type now looks like:
interface Session {
  user: {
    id: string;          // ✅ custom field
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}

register is handled by api. api folder is created only by name "api".
NextRequest-A wrapper around the standard Web API Request object, provided by Next.js in App Router (app/api routes).
NextResponse used to give response easily like ApiResponse 

Login 
login options are configured.There can be multiple ways such as google,discord or by credentials. In credentials dev needs to define the logic in authorize func.NextAuth expects a value back.return null → reject login.return user object → login success.
Done in lib/auth.ts
callbacks are just functions that let you control what happens at certain points in the authentication flow.The main callbacks
 jwt → runs whenever a JWT is created/updated.Purpose is to Decide what data to put inside the token.
 session → runs whenever a session is checked/created.
 signIn → runs when someone tries to sign in
 redirect → runs after login/logout to control where the user goes.
.
NextAuth(authOptions) creates a request handler function based on your configuration (providers, callbacks, etc.).That handler knows how to respond to GET and POST requests (for login, logout, session fetching, etc.).You save it in handler so you can export it.
export { handler as GET, handler as POST } wires that API into Next.js routing.In App Router, API routes (e.g. app/api/auth/[...nextauth]/route.ts) must export functions named after HTTP methods (GET, POST, etc.).When a client calls GET /api/auth/... → Next.js runs handler
Done in app/api/auth/[...nextauth]/route.ts this file naming is necessary


ImageKit
NEXT_PUBLIC_ prefix needs to be used for environment variable if it is to be made available for frontend.
Done in app\api\auth\imagekit-auth\route.ts
The auth parameters = a short-lived “upload pass” proving that your backend (and therefore your app) approved this upload.
When you call getUploadAuthParams() on your server, it generates three things token,expire,signature. authenticationParameters ={ token, expire, signature }
These together form a temporary credential that allows the frontend to upload to your ImageKit account securely.The image is directly uploaded to ImageKit’s CDN, without exposing private key.
.upload is on hold rn
Done in app\api\video\route.ts
the frontend uploads to imageKit and ImageKit send a response. Details fron this response and other details(title,description) taken through a form on front end is sent to backend to be saved.
GET to get all videos , POST to create new video record


FRONTEND
In regular React The whole app loads in the browser, then React hydrates it (makes it interactive) which is slow and low SEO.Next.js introduced a new hybrid model:
Server Components (default):Run on the server → send ready-to-render HTML to the browser.Faster, smaller bundle size, SEO-friendly.
Client Components:Marked with "use client" → run in browser → handle state, events, interactivity.React hooks like useState, useEffect, and useRouter are enabled.
login and register frontend done in app

Middleware 
runs before a request. Used to check authentication. Created in root folder.function (from next-auth/middleware) is a wrapper that adds built-in authentication logic to your middleware.
It automatically Parses cookies,Validates JWT/session,Gives you access to the token(we didn t use though).
The inner callbacks.authorized() runs on every request the middleware intercepts.
It returns true for routes you want open (like /login, /register, /api/auth, /api/videos, /) and !!token (user must be logged in) for everything else.If it returns false, NextAuth blocks or redirects the request.
The config.matcher line limits where this middleware runs so it skips static files, images, and things in /public.
NextResponse.next() tells Next.js middleware to pass the request through to the next stage

ImageKit upload 
provider.ts exists to be used in layout to wrap your entire Next.js app with global context providers — in this case, for NextAuth (session) and ImageKit (media handling).
SessionProvider
From next-auth/react, it keeps track of whether the user is logged in.
It makes the useSession() hook work anywhere in your app.refetchInterval means it will refresh session data every 5 minutes.
ImageKitProvider
From @imagekit/next, it gives upload and URL transformation capabilities to all child components.It provides the useImageKit() hook.It uses urlEndpoint (your ImageKit endpoint) to generate optimized image URLs automatically.
Change in layout 
gives auth + image upload context to your whole app without needing to import them separately on each page.

FileUpload.tsx component - handles the upload 
onSuccess → a function called when the upload finishes successfully.
Takes one argument res (the ImageKit response).
onProgress → an optional callback that receives a number (the % uploaded).
fileType → an optional prop that specifies what kind of file to accept
uploading → a boolean to track whether an upload is happening.
error → stores an error message (if any).
A file’s MIME type (Multipurpose Internet Mail Extensions type) is a string that tells the browser or server what kind of file it is.Image: File JPEG	has MIME TYPE image/jpeg, Video: file MP4 has MIME type video/mp4. startsWith("video/") checks that it’s any kind of video (MP4, MOV, etc.).
validateFile() - Ensures the uploaded file is valid (type & size).
onSuccess() - Notifies parent that upload finished.It receives res, which is the response     from ImageKit — usually contains the file URL, file ID, etc.
User selects a file → onChange fires → handleFileChange(event) runs.
FileUpload by itself doesn’t do anything until a parent component renders it and passes props, including onSuccess.eg
 <FileUpload
  fileType="video"
  onSuccess={(res) => {
    console.log("Uploaded file URL:", res.url);
    setVideoUrl(res.url); // save uploaded file info
  }}
/>
OnProgress - upload() from @imagekit/next supports an internal onProgress event.
Every time some bytes are uploaded, this function runs.
event.loaded = bytes uploaded so far
event.total = total file size
We calculate % uploaded and call the parent’s onProgress callback.

ApiClient is a custom wrapper around the built-in fetch() function — it simplifies and standardizes how your app talks to your backend (/api routes).

NEW COMPONENTS
Header
This component creates a responsive navigation bar (navbar) for your app with:
A home link and logo (Video with AI)
A user profile menu (dropdown)
Conditional options depending on whether a user is logged in or not

Notifications 
global notification system
NotificationContext stores the showNotification function, which can be used anywhere.
NotificationProvider wraps the app, manages notification state, and displays a toast for 3 seconds whenever showNotification is called.
useNotification() is a custom hook to access showNotification easily inside any component.

VideoComponents
Displays a video card with a preview, title, and description. It uses ImageKit for optimized video rendering and Next.js’s <Link> for smooth navigation to the video’s detail page.
IKVideo is a React component provided by ImageKit, a media management and optimization platform.It’s a wrapper around the regular HTML <video> tag, but adds automatic optimization, CDN delivery, and transformations.Loads videos directly from ImageKit using your project’s urlEndpoint.Applies transformations like resizing, cropping, or format changes on the fly without editing the original video. Reduces load time and bandwidth by serving the most optimized version depending on the device.Link is a special component in Next.js that enables client-side routing — meaning when you click a link, it doesn’t reload the page like a normal <a> tag.Navigates between pages instantly without a full refresh.

VideoFeed-Main component displaying a collection of video cards
VideoUploadForm-lets users upload videos (and optionally thumbnails) to your app.
It collects title, description, video, and thumbnail data, then sends it to an API route (/api/video) for saving to a database

DEBUGGING 
-Connection string used in MongoDB for connection.Put .env in root file i.e the same folder as your package.json and next.config.js.
-React Context (like SessionProvider, ImageKitProvider, etc.) is client-side only — it relies on the browser environment. Used "use client" in layout.tsx
-Error Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. Avoid client side rendering of layout.tsx modify layout.tsx to render a small client wrapper component that imports Providers (keeps layout as server). This is a compatible pattern with the app router and avoids possible transform issues.
-The moment a <IKVideo /> component renders, it tries to do getIKClient() that requires urlEndpoint If missing error.
To fix it wrap the entire app with ImageKitProvider