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