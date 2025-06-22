// Voice data storage and encryption service - MongoDB version

import { connectToMongoDB } from '@/lib/mongodb';
import { 
  VoiceRecording, 
  EncryptionKey, 
  VoiceAnalysis, 
  IVoiceRecording, 
  IEncryptionKey,
  InterviewAnalysis 
} from '@/lib/models/mongodb-schemas';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Constants
const RECORDING_EXPIRY_DAYS = 30;
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'temp', 'encrypted-recordings');

/**
 * Service for handling voice recordings with encryption - MongoDB version
 */
export const voiceDataServiceMongoDB = {
  /**
   * Store an encrypted voice recording
   */
  async storeVoiceRecording(
    userId: string, 
    interviewId: string, 
    recordingBuffer: Buffer,
    metadata: { duration: number; fileSize: number; mimeType: string; originalFileName?: string; [key: string]: any }
  ): Promise<string> {
    try {
      await connectToMongoDB();

      // 1. Generate a new encryption key for this recording
      const { keyId, encryptedData } = await encryptBuffer(recordingBuffer);
      
      // 2. Generate a unique filename
      const filename = `voice-recordings/${userId}/${interviewId}/${crypto.randomUUID()}.enc`;
      
      // 3. Store encrypted data (Firebase Storage or local fallback)
      let fileUrl: string;
      let storageType: 'local' | 'firebase' = 'local';
      
      try {
        // Try Firebase Storage first (if available)
        const { storage } = await import('@/firebase/admin');
        const fileRef = storage.bucket().file(filename);
        await fileRef.save(encryptedData, {
          metadata: {
            contentType: 'application/octet-stream',
            metadata: {
              encryptionKeyId: keyId,
              originalContentType: metadata.mimeType
            }
          }
        });
        
        fileUrl = filename;
        storageType = 'firebase';
        console.log('[MongoDB Voice Service] Stored in Firebase Storage');
      } catch (storageError) {
        console.warn('[MongoDB Voice Service] Firebase Storage failed, using local storage:', storageError);
        
        // Fallback to local file system
        if (!fs.existsSync(LOCAL_STORAGE_PATH)) {
          fs.mkdirSync(LOCAL_STORAGE_PATH, { recursive: true });
        }
        
        const localFilename = `${crypto.randomUUID()}.enc`;
        const localPath = path.join(LOCAL_STORAGE_PATH, localFilename);
        fs.writeFileSync(localPath, encryptedData);
        
        fileUrl = `local://${localFilename}`;
        storageType = 'local';
        console.log('[MongoDB Voice Service] Stored in local storage');
      }
      
      // 4. Calculate expiry date (30 days from now)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + RECORDING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      
      // 5. Store recording metadata in MongoDB
      const voiceRecording = new VoiceRecording({
        userId,
        interviewId,
        recordingUrl: fileUrl,
        encryptionKeyId: keyId,
        processingStatus: 'pending',
        createdAt: now,
        expiresAt: expiresAt,
        metadata: {
          ...metadata,
          originalFileName: metadata.originalFileName,
          storageType
        }
      });
      
      const savedRecording = await voiceRecording.save();
      console.log(`[MongoDB Voice Service] Recording saved with ID: ${savedRecording._id}`);
      
      return savedRecording._id.toString();
    } catch (error) {
      console.error('[MongoDB Voice Service] Error storing voice recording:', error);
      throw new Error('Failed to store voice recording');
    }
  },
  
  /**
   * Retrieve and decrypt a voice recording
   */
  async getVoiceRecording(recordingId: string): Promise<{buffer: Buffer; metadata: IVoiceRecording}> {
    try {
      await connectToMongoDB();

      // 1. Get recording metadata from MongoDB
      const recordingData = await VoiceRecording.findById(recordingId);
      if (!recordingData) {
        throw new Error('Recording not found');
      }
      
      // 2. Check if recording has expired
      if (new Date(recordingData.expiresAt) < new Date()) {
        throw new Error('Recording has expired and has been deleted');
      }
      
      // 3. Get the file from storage
      let encryptedBuffer: Buffer;
      
      if (recordingData.recordingUrl.startsWith('local://')) {
        // Local storage
        const filename = recordingData.recordingUrl.replace('local://', '');
        const localPath = path.join(LOCAL_STORAGE_PATH, filename);
        
        if (!fs.existsSync(localPath)) {
          throw new Error('Recording file not found in local storage');
        }
        
        encryptedBuffer = fs.readFileSync(localPath);
        console.log('[MongoDB Voice Service] Retrieved from local storage');
      } else {
        // Firebase Storage
        const { storage } = await import('@/firebase/admin');
        const fileRef = storage.bucket().file(recordingData.recordingUrl);
        const [exists] = await fileRef.exists();
        if (!exists) {
          throw new Error('Recording file not found in storage');
        }
        
        const [buffer] = await fileRef.download();
        encryptedBuffer = buffer;
        console.log('[MongoDB Voice Service] Retrieved from Firebase Storage');
      }
      
      // 4. Get the encryption key and decrypt
      const decryptedBuffer = await decryptBuffer(encryptedBuffer, recordingData.encryptionKeyId);
      
      // 5. Return the decrypted buffer and metadata
      return {
        buffer: decryptedBuffer,
        metadata: recordingData
      };
    } catch (error) {
      console.error('[MongoDB Voice Service] Error retrieving recording:', error);
      throw new Error('Failed to retrieve voice recording');
    }
  },
  
  /**
   * Get all voice recordings for a user
   */
  async getUserRecordings(userId: string, limit: number = 50): Promise<IVoiceRecording[]> {
    try {
      await connectToMongoDB();
      
      const recordings = await VoiceRecording
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      
      return recordings;
    } catch (error) {
      console.error('[MongoDB Voice Service] Error fetching user recordings:', error);
      throw new Error('Failed to fetch user recordings');
    }
  },

  /**
   * Update recording duration for a specific interview
   */
  async updateRecordingDuration(interviewId: string, duration: number, userId?: string): Promise<boolean> {
    try {
      await connectToMongoDB();
      
      // Ensure duration is an integer and at least 1 second
      const integerDuration = Math.max(1, Math.floor(duration));
      console.log(`[MongoDB Voice Service] Updating recording duration for interview: ${interviewId}, duration: ${integerDuration}s (integer)`);
      
      // Build query - include userId if provided for additional security
      const query: any = { interviewId };
      if (userId) {
        query.userId = userId;
        console.log(`[MongoDB Voice Service] Including userId in query for additional security: ${userId}`);
      }
      
      // First update the recording document
      const result = await VoiceRecording.updateOne(
        query,
        { 
          $set: { 
            rec_length: integerDuration,
            'metadata.duration': integerDuration 
          } 
        }
      );
      
      // Also update any existing analysis records with the duration
      try {
        await InterviewAnalysis.updateMany(
          { interviewId },
          { $set: { 'analysis.duration_seconds': integerDuration } }
        );
        console.log(`[MongoDB Voice Service] ✅ Updated duration in analysis records for interview: ${interviewId}`);
      } catch (analysisError) {
        console.warn(`[MongoDB Voice Service] ⚠️ Could not update analysis records:`, analysisError);
        // Continue even if analysis update fails
      }
      
      if (result.matchedCount > 0) {
        console.log(`[MongoDB Voice Service] ✅ Successfully updated duration for interview: ${interviewId}`);
        return true;
      } else {
        console.warn(`[MongoDB Voice Service] ❌ No recording found for interview: ${interviewId}${userId ? ` and user: ${userId}` : ''}`);
        return false;
      }
    } catch (error) {
      console.error('[MongoDB Voice Service] Error updating recording duration:', error);
      throw new Error('Failed to update recording duration');
    }
  },
  
  /**
   * Delete a voice recording
   */
  async deleteVoiceRecording(recordingId: string, userId: string): Promise<boolean> {
    try {
      await connectToMongoDB();
      
      // 1. Find the recording
      const recording = await VoiceRecording.findOne({ _id: recordingId, userId });
      if (!recording) {
        throw new Error('Recording not found or unauthorized');
      }
      
      // 2. Delete the file from storage
      try {
        if (recording.recordingUrl.startsWith('local://')) {
          // Local storage
          const filename = recording.recordingUrl.replace('local://', '');
          const localPath = path.join(LOCAL_STORAGE_PATH, filename);
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
          }
        } else {
          // Firebase Storage
          const { storage } = await import('@/firebase/admin');
          const fileRef = storage.bucket().file(recording.recordingUrl);
          await fileRef.delete();
        }
      } catch (storageError) {
        console.warn('[MongoDB Voice Service] Error deleting storage file:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
      
      // 3. Delete encryption key
      try {
        await EncryptionKey.findByIdAndDelete(recording.encryptionKeyId);
      } catch (keyError) {
        console.warn('[MongoDB Voice Service] Error deleting encryption key:', keyError);
      }
      
      // 4. Delete recording from database
      await VoiceRecording.findByIdAndDelete(recordingId);
      
      // 5. Delete associated analyses
      await VoiceAnalysis.deleteMany({ recordingId });
      
      console.log(`[MongoDB Voice Service] Recording ${recordingId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('[MongoDB Voice Service] Error deleting recording:', error);
      throw new Error('Failed to delete voice recording');
    }
  },
  
  /**
   * Clean up expired recordings
   */
  async cleanupExpiredRecordings(): Promise<number> {
    try {
      await connectToMongoDB();
      
      const now = new Date();
      const expiredRecordings = await VoiceRecording.find({ 
        expiresAt: { $lt: now } 
      });
      
      let deletedCount = 0;
      
      for (const recording of expiredRecordings) {
        try {
          await this.deleteVoiceRecording(recording._id.toString(), recording.userId);
          deletedCount++;
        } catch (error) {
          console.error(`[MongoDB Voice Service] Failed to delete expired recording ${recording._id}:`, error);
        }
      }
      
      console.log(`[MongoDB Voice Service] Cleaned up ${deletedCount} expired recordings`);
      return deletedCount;
    } catch (error) {
      console.error('[MongoDB Voice Service] Error cleaning up expired recordings:', error);
      throw new Error('Failed to clean up expired recordings');
    }
  }
};

// Helper functions for encryption/decryption (same as before)

/**
 * Encrypt a buffer using AES-GCM
 */
async function encryptBuffer(buffer: Buffer): Promise<{ keyId: string; encryptedData: Buffer }> {
  try {
    await connectToMongoDB();

    // 1. Generate a new AES-256 key
    const symmetricKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    // 2. Encrypt the buffer
    const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // 3. Store the encryption key in MongoDB
    const encryptionKey = new EncryptionKey({
      algorithm: 'AES-GCM',
      version: 1,
      keyData: Buffer.concat([symmetricKey, iv]).toString('base64'),
      createdAt: new Date(),
      rotatedAt: new Date(),
      isActive: true,
      public: false
    });
    
    const savedKey = await encryptionKey.save();
    
    // 4. Combine encrypted data with auth tag
    const encryptedData = Buffer.concat([authTag, encrypted]);
    
    return {
      keyId: savedKey._id.toString(),
      encryptedData
    };
  } catch (error) {
    console.error('[MongoDB Voice Service] Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt a buffer using the stored encryption key
 */
async function decryptBuffer(encryptedBuffer: Buffer, keyId: string): Promise<Buffer> {
  try {
    await connectToMongoDB();

    // 1. Retrieve the encryption key from MongoDB
    const keyData = await EncryptionKey.findById(keyId);
    
    if (!keyData) {
      throw new Error('Encryption key not found');
    }
    
    if (keyData.algorithm !== 'AES-GCM') {
      throw new Error(`Unsupported encryption algorithm: ${keyData.algorithm}`);
    }
    
    // 2. Extract key material from stored data
    const keyMaterial = Buffer.from(keyData.keyData, 'base64');
    const symmetricKey = keyMaterial.subarray(0, 32);
    const iv = keyMaterial.subarray(32, 48);
    
    // 3. Extract components from encrypted data
    const authTag = encryptedBuffer.subarray(0, 16);
    const encrypted = encryptedBuffer.subarray(16);
    
    // 4. Set up the decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', symmetricKey, iv);
    decipher.setAuthTag(authTag);
    
    // 5. Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted;
  } catch (error) {
    console.error('[MongoDB Voice Service] Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export default voiceDataServiceMongoDB;
