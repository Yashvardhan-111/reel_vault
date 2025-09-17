import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define mongo_uri in env variables");
}

let cached = global.mongoose;

//If no cache exists yet create it as we will return that
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    //If we already have a live connection return it
    if (cached.conn) {
        return cached.conn;
    }

    //If there’s no promise yet start connecting
    if (!cached.promise) {
        const opts = {  //optional stuff
        bufferCommands: true,
        maxPoolSize: 10,
        };

        mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}