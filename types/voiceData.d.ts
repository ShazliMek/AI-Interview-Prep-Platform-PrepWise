// Types for voice data storage and processing

export interface VoiceRecording {
  id: string;
  userId: string;
  interviewId: string;
  recordingUrl: string;
  encryptionKeyId: string; // Reference to the encryption key used
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  expiresAt: string; // For 30-day TTL implementation
  metadata: {
    duration: number;
    fileSize: number;
    mimeType: string;
  };
}

export interface VoiceAnalysis {
  id: string;
  recordingId: string;
  userId: string;
  interviewId: string;
  metrics: {
    speakingPace: number; // Words per minute
    fillerWordCount: number;
    clarity: number; // Score from 0-100
    confidence: number; // Score from 0-100
    toneVariation: number; // Score from 0-100
    keywordFrequency: Record<string, number>; // Technical terms used
  };
  segments: Array<{
    startTime: number;
    endTime: number;
    transcript: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  }>;
  summary: string;
  recommendations: string[];
  createdAt: string;
}

export interface UserPrivacySettings {
  id: string;
  userId: string;
  dataRetentionPeriod: number; // in days
  analyticsConsent: boolean;
  voiceProcessingConsent: boolean;
  recommendationsEnabled: boolean;
  lastUpdated: string;
}

// For quantum-resistant encryption implementation
export interface EncryptionKey {
  id: string;
  algorithm: 'AES-GCM' | 'CRYSTALS-Kyber' | 'hybrid';
  version: number;
  createdAt: string;
  rotatedAt: string;
  public: boolean; // Whether this is public key data
  keyData?: string; // Encrypted or public key data
}
