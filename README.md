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
So we need to form a global obj to track if DB is connected or not or promise is on the way(call has been accept or rejection will happen) that is in types.d.ts
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
