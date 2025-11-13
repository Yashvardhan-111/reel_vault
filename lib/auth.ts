import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

//authOptions is a central blueprint how users log in, how sessions should behave, what fields to include in the session, which pages to use, and how to secure everything.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",  //name of provider
      credentials: {        //creates UI form on sign in page
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "passsword" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or passsword");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    // in NextAuth, a JWT is created by default when a user logs in and callback is executed
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;     //storing user id in token so that wherever token is accessible user id is also accessible and Db call will be not required 
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {                      //Overrides NextAuth’s default auth pages.
    signIn: "/login",           //Instead of using /api/auth/signin UI, it redirects users to your custom /login page.
    error: "/login",            //If there’s an auth error its shown on /login.
  },
  session: {
    strategy: "jwt",            //means sessions are stored in JSON Web Tokens, not in a database.
    maxAge: 30 * 24 * 60 * 60,  //session will last 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,  //Used to sign & encrypt JWTs.
};