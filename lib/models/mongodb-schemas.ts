import mongoose, { Document, Schema, Model } from 'mongoose';

// Voice Recording Schema
export interface IVoiceRecording extends Document {
  _id: string;
  userId: string;
  interviewId: string;
  recordingUrl: string; // Local path or cloud storage URL
  encryptionKeyId: string;
  processingStatus: 'pending' | 'processed' | 'failed';
  createdAt: Date;
  expiresAt: Date;
  metadata: {
    duration: number;
    fileSize: number;
    mimeType: string;
    originalFileName?: string;
    storageType: 'local' | 'firebase' | 'aws' | 'gcp';
    quality?: string;
    language?: string;
    transcription?: string;
    analysis?: any;
  };
}

const VoiceRecordingSchema = new Schema<IVoiceRecording>({
  userId: { type: String, required: true, index: true },
  interviewId: { type: String, required: true, index: true },
  recordingUrl: { type: String, required: true },
  encryptionKeyId: { type: String, required: true },
  processingStatus: { 
    type: String, 
    enum: ['pending', 'processed', 'failed'], 
    default: 'pending',
    index: true
  },
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: true },
  metadata: {
    duration: { type: Number, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    originalFileName: String,
    storageType: { 
      type: String, 
      enum: ['local', 'firebase', 'aws', 'gcp'], 
      default: 'local' 
    },
    quality: String,
    language: { type: String, default: 'en' },
    transcription: String,
    analysis: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  collection: 'voice_recordings'
});

// Add indexes for performance
VoiceRecordingSchema.index({ userId: 1, createdAt: -1 });
VoiceRecordingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
VoiceRecordingSchema.index({ processingStatus: 1, createdAt: 1 });

// Encryption Keys Schema
export interface IEncryptionKey extends Document {
  _id: string;
  algorithm: string;
  version: number;
  keyData: string; // Base64 encoded key material
  createdAt: Date;
  rotatedAt: Date;
  isActive: boolean;
  public: boolean;
}

const EncryptionKeySchema = new Schema<IEncryptionKey>({
  algorithm: { type: String, required: true, default: 'AES-GCM' },
  version: { type: Number, required: true, default: 1 },
  keyData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rotatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  public: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'encryption_keys'
});

// Voice Analysis Schema
export interface IVoiceAnalysis extends Document {
  _id: string;
  recordingId: string;
  userId: string;
  interviewId: string;
  analysisType: 'sentiment' | 'transcription' | 'keywords' | 'confidence' | 'pace';
  results: any;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

const VoiceAnalysisSchema = new Schema<IVoiceAnalysis>({
  recordingId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  interviewId: { type: String, required: true, index: true },
  analysisType: { 
    type: String, 
    enum: ['sentiment', 'transcription', 'keywords', 'confidence', 'pace'],
    required: true,
    index: true
  },
  results: { type: Schema.Types.Mixed, required: true },
  confidence: { type: Number, min: 0, max: 1 },
  processingTime: Number, // milliseconds
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'voice_analyses'
});

VoiceAnalysisSchema.index({ recordingId: 1, analysisType: 1 });

// User Privacy Settings Schema
export interface IUserPrivacySettings extends Document {
  _id: string;
  userId: string;
  voiceRecording: {
    enabled: boolean;
    autoDelete: boolean;
    retentionDays: number;
  };
  dataSharing: {
    allowAnalytics: boolean;
    allowImprovement: boolean;
    allowThirdParty: boolean;
  };
  notifications: {
    recordingReminders: boolean;
    dataExpiry: boolean;
    analysisComplete: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserPrivacySettingsSchema = new Schema<IUserPrivacySettings>({
  userId: { type: String, required: true, unique: true, index: true },
  voiceRecording: {
    enabled: { type: Boolean, default: true },
    autoDelete: { type: Boolean, default: true },
    retentionDays: { type: Number, default: 30, min: 1, max: 365 }
  },
  dataSharing: {
    allowAnalytics: { type: Boolean, default: false },
    allowImprovement: { type: Boolean, default: false },
    allowThirdParty: { type: Boolean, default: false }
  },
  notifications: {
    recordingReminders: { type: Boolean, default: true },
    dataExpiry: { type: Boolean, default: true },
    analysisComplete: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  collection: 'user_privacy_settings'
});

// Create models with proper typing
export const VoiceRecording: Model<IVoiceRecording> = mongoose.models.VoiceRecording || mongoose.model<IVoiceRecording>('VoiceRecording', VoiceRecordingSchema);
export const EncryptionKey: Model<IEncryptionKey> = mongoose.models.EncryptionKey || mongoose.model<IEncryptionKey>('EncryptionKey', EncryptionKeySchema);
export const VoiceAnalysis: Model<IVoiceAnalysis> = mongoose.models.VoiceAnalysis || mongoose.model<IVoiceAnalysis>('VoiceAnalysis', VoiceAnalysisSchema);
export const UserPrivacySettings: Model<IUserPrivacySettings> = mongoose.models.UserPrivacySettings || mongoose.model<IUserPrivacySettings>('UserPrivacySettings', UserPrivacySettingsSchema);

export default {
  VoiceRecording,
  EncryptionKey,
  VoiceAnalysis,
  UserPrivacySettings
};
