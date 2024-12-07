import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Define a global type for cached mongoose connection
declare global {
  // Allow using `global` for the cached connection
  var mongoose: MongooseConnection | undefined;
}

let cached: MongooseConnection = global.mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;
  
    if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');
  
    cached.promise = 
      cached.promise || 
      mongoose.connect(MONGODB_URL, { 
        dbName: 'imaginify', bufferCommands: false 
      })
  
    cached.conn = await cached.promise;
  
    return cached.conn;
}