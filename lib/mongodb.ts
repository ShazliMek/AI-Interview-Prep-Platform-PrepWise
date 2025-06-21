import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ai-interview-prep';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Mongoose connection (for schemas)
let mongoose_connection: typeof mongoose | null = null;

export async function connectToMongoDB() {
  try {
    if (mongoose_connection?.connection?.readyState === 1) {
      return mongoose_connection;
    }

    console.log('[MongoDB] Connecting to database...');
    mongoose_connection = await mongoose.connect(uri, {
      dbName: dbName,
    });
    
    console.log(`[MongoDB] Connected successfully to database: ${dbName}`);
    return mongoose_connection;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error);
    throw error;
  }
}

// Get MongoDB client (for direct operations)
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

// Get MongoDB database
export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

// Close connection
export async function closeConnection() {
  if (mongoose_connection) {
    await mongoose_connection.disconnect();
    mongoose_connection = null;
  }
  
  const client = await getMongoClient();
  await client.close();
}

export default clientPromise;
