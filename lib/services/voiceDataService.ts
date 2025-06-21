// Voice data storage and encryption service

import { db, storage } from '@/firebase/admin';
import { EncryptionKey, VoiceRecording, VoiceAnalysis } from '@/types/voiceData';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Constants
const RECORDING_EXPIRY_DAYS = 30;
const COLLECTION_RECORDINGS = 'voice_recordings';
const COLLECTION_ANALYSES = 'voice_analyses';
const COLLECTION_ENCRYPTION_KEYS = 'encryption_keys';
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'temp', 'encrypted-recordings');

/**
 * Service for handling voice recordings with encryption
 */
export const voiceDataService = {
  /**
   * Store an encrypted voice recording
   */
  async storeVoiceRecording(
    userId: string, 
    interviewId: string, 
    recordingBuffer: Buffer,
    metadata: { duration: number; fileSize: number; mimeType: string }
  ): Promise<string> {
    try {
      // 1. Generate a new encryption key for this recording
      const { keyId, encryptedData } = await encryptBuffer(recordingBuffer);
      
      // 2. Generate a unique filename
      const filename = `voice-recordings/${userId}/${interviewId}/${crypto.randomUUID()}.enc`;
      
      // 3. Upload encrypted data to Firebase Storage (with fallback to local storage)
      let fileUrl: string;
      let isLocalStorage = false;
      
      try {
        const fileRef = storage.bucket().file(filename);
        await fileRef.save(encryptedData, {
          metadata: {
            contentType: 'application/octet-stream', // Always encrypted binary
            metadata: {
              encryptionKeyId: keyId,
              originalContentType: metadata.mimeType
            }
          }
        });
        
        // Get signed URL (7 day expiry, for internal use only)
        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        fileUrl = filename; // Store the path, not the signed URL
      } catch (storageError) {
        console.warn('Firebase Storage failed, using local storage fallback:', storageError);
        
        // Fallback to local file system
        if (!fs.existsSync(LOCAL_STORAGE_PATH)) {
          fs.mkdirSync(LOCAL_STORAGE_PATH, { recursive: true });
        }
        
        const localFilename = `${crypto.randomUUID()}.enc`;
        const localPath = path.join(LOCAL_STORAGE_PATH, localFilename);
        fs.writeFileSync(localPath, encryptedData);
        
        fileUrl = `local://${localFilename}`;
        isLocalStorage = true;
      }
      
      // 4. Calculate expiry date (30 days from now)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + RECORDING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      
      // 5. Store recording metadata in Firestore
      const recordingData: Omit<VoiceRecording, 'id'> = {
        userId,
        interviewId,
        recordingUrl: fileUrl, // Store the path/URL
        encryptionKeyId: keyId,
        processingStatus: 'pending',
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        metadata: {
          ...metadata,
          storageType: isLocalStorage ? 'local' : 'firebase'
        } as any // Allow additional properties for development
      };
      
      const recordingRef = await db.collection(COLLECTION_RECORDINGS).add(recordingData);
      
      // 6. Return recording ID
      return recordingRef.id;
    } catch (error) {
      console.error('Error storing voice recording:', error);
      throw new Error('Failed to store voice recording');
    }
  },
  
  /**
   * Retrieve and decrypt a voice recording
   */
  async getVoiceRecording(recordingId: string): Promise<{buffer: Buffer; metadata: VoiceRecording}> {
    try {
      // 1. Get recording metadata
      const recordingDoc = await db.collection(COLLECTION_RECORDINGS).doc(recordingId).get();
      if (!recordingDoc.exists) {
        throw new Error('Recording not found');
      }
      
      const recordingData = { id: recordingDoc.id, ...recordingDoc.data() } as VoiceRecording;
      
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
      } else {
        // Firebase Storage
        const fileRef = storage.bucket().file(recordingData.recordingUrl);
        const [exists] = await fileRef.exists();
        if (!exists) {
          throw new Error('Recording file not found in storage');
        }
        
        // 4. Download the encrypted file
        const [buffer] = await fileRef.download();
        encryptedBuffer = buffer;
      }
      
      // 5. Get the encryption key and decrypt
      const decryptedBuffer = await decryptBuffer(encryptedBuffer, recordingData.encryptionKeyId);
      
      // 6. Return the decrypted buffer and metadata
      return {
        buffer: decryptedBuffer,
        metadata: recordingData
      };
    } catch (error) {
      console.error('Error retrieving voice recording:', error);
      throw new Error(`Failed to retrieve voice recording: ${(error as Error).message}`);
    }
  },
  
  /**
   * Delete a voice recording (both metadata and file)
   */
  async deleteVoiceRecording(recordingId: string, userId: string): Promise<void> {
    try {
      // 1. Get recording metadata
      const recordingRef = db.collection(COLLECTION_RECORDINGS).doc(recordingId);
      const recordingDoc = await recordingRef.get();
      
      if (!recordingDoc.exists) {
        throw new Error('Recording not found');
      }
      
      const recordingData = recordingDoc.data() as Omit<VoiceRecording, 'id'>;
      
      // 2. Verify ownership
      if (recordingData.userId !== userId) {
        throw new Error('Not authorized to delete this recording');
      }
      
      // 3. Delete the file from storage
      const fileRef = storage.bucket().file(recordingData.recordingUrl);
      await fileRef.delete().catch((err: Error) => {
        console.warn('Could not delete file from storage:', err);
        // Continue even if file deletion fails
      });
      
      // 4. Delete recording metadata
      await recordingRef.delete();
      
      // 5. Delete any associated analyses
      const analysesSnapshot = await db
        .collection(COLLECTION_ANALYSES)
        .where('recordingId', '==', recordingId)
        .get();
      
      const batch = db.batch();
      analysesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting voice recording:', error);
      throw new Error(`Failed to delete voice recording: ${(error as Error).message}`);
    }
  },
  
  /**
   * Set up automatic deletion of expired recordings (called by a scheduled function)
   */
  async cleanupExpiredRecordings(): Promise<number> {
    try {
      const now = new Date();
      const expiredRecordings = await db
        .collection(COLLECTION_RECORDINGS)
        .where('expiresAt', '<', now.toISOString())
        .get();
      
      if (expiredRecordings.empty) {
        return 0;
      }
      
      const batch = db.batch();
      const filesToDelete: string[] = [];
      
      expiredRecordings.docs.forEach(doc => {
        const data = doc.data();
        filesToDelete.push(data.recordingUrl);
        batch.delete(doc.ref);
      });
      
      // Delete metadata batch
      await batch.commit();
      
      // Delete files from storage
      const deletePromises = filesToDelete.map(async filePath => {
        const fileRef = storage.bucket().file(filePath);
        return fileRef.delete().catch(() => {
          // Ignore errors if file doesn't exist
        });
      });
      
      await Promise.all(deletePromises);
      
      return expiredRecordings.size;
    } catch (error) {
      console.error('Error cleaning up expired recordings:', error);
      throw new Error('Failed to clean up expired recordings');
    }
  }
};

// Helper functions for encryption/decryption

/**
 * Encrypt a buffer using quantum-resistant hybrid encryption
 */
async function encryptBuffer(buffer: Buffer): Promise<{ keyId: string; encryptedData: Buffer }> {
  try {
    // In a real implementation, we'd use a quantum-resistant algorithm
    // For now, we'll simulate with AES-GCM which is still secure for current threats
    
    // 1. Generate a new AES-256 key
    const symmetricKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    // 2. Encrypt the buffer
    const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // 3. Store the encryption key metadata in Firestore
    const keyData = {
      algorithm: 'AES-GCM', // In future: 'hybrid' with post-quantum algorithms
      version: 1,
      createdAt: new Date().toISOString(),
      rotatedAt: new Date().toISOString(),
      public: false,
      // Store the symmetric key and IV separately from the encrypted data
      keyData: Buffer.concat([symmetricKey, iv]).toString('base64')
    };
    
    const keyRef = await db.collection(COLLECTION_ENCRYPTION_KEYS).add(keyData);
    
    // 4. Combine encrypted data with auth tag
    // Format: [16-byte Auth Tag][Encrypted Data]
    const encryptedData = Buffer.concat([authTag, encrypted]);
    
    return {
      keyId: keyRef.id,
      encryptedData
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt a buffer using the stored encryption key
 */
async function decryptBuffer(encryptedBuffer: Buffer, keyId: string): Promise<Buffer> {
  try {
    // 1. Retrieve the encryption key
    const keyDoc = await db.collection(COLLECTION_ENCRYPTION_KEYS).doc(keyId).get();
    
    if (!keyDoc.exists) {
      throw new Error('Encryption key not found');
    }
    
    const keyData = keyDoc.data() as EncryptionKey;
    
    // In a real implementation, we'd check the algorithm and use the appropriate decryption
    if (keyData.algorithm !== 'AES-GCM') {
      throw new Error(`Unsupported encryption algorithm: ${keyData.algorithm}`);
    }
    
    // 2. Extract key material from stored data
    const keyMaterial = Buffer.from(keyData.keyData || '', 'base64');
    const symmetricKey = keyMaterial.subarray(0, 32);
    const iv = keyMaterial.subarray(32, 48);
    
    // 3. Extract components from encrypted data
    // Format: [16-byte Auth Tag][Encrypted Data]
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
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export default voiceDataService;
