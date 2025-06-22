'use server';

import { MongoClient } from 'mongodb';
import { getCurrentUser } from './auth.actions';

const client = new MongoClient(process.env.MONGODB_URI!);

async function connectToDatabase() {
  await client.connect();
  return client.db('prepwise');
}

export async function getRecordings() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const db = await connectToDatabase();
  const recordings = await db.collection('recordings').find({ userId: user.id }).toArray();
  return recordings;
}

export async function getAnalysisForRecording(recordingId: string, interviewId: string) {
  const db = await connectToDatabase();
  let analysis = await db.collection('analyses').findOne({ recordingId });

  if (!analysis) {
    // If analysis doesn't exist, call the analysis service and store the result
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interview-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId, interviewId })
    });
    analysis = await response.json();
    await db.collection('analyses').insertOne({ recordingId, ...analysis });
  }

  return analysis;
}
