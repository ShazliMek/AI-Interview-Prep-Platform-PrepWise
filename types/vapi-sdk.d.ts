// Type definitions for @vapi-ai/web
import { Message } from './vapi';

// All event types that Vapi can emit
export type VapiEventType = 
  | 'call-start' 
  | 'call-end' 
  | 'message' 
  | 'speech-start' 
  | 'speech-end' 
  | 'error';

// Configuration for starting a Vapi call
export interface VapiCallConfig {
  // The assistant ID to use for the call
  // Either assistantId or assistant can be used depending on SDK version
  assistantId?: string;
  assistant?: string;
  // Optional assistant overrides including variable values
  assistantOverrides?: {
    variableValues?: Record<string, string | number>;
  };
  // Optional messages to initialize the conversation
  messages?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

// Event handlers
export type VapiCallStartHandler = () => void;
export type VapiCallEndHandler = () => void;
export type VapiMessageHandler = (message: Message) => void;
export type VapiSpeechStartHandler = () => void;
export type VapiSpeechEndHandler = () => void;
export type VapiErrorHandler = (error: Error) => void;

// Main Vapi SDK interface
export interface VapiSdk {
  // Start a call with the given configuration
  start(config: VapiCallConfig | string): Promise<void>;
  
  // Stop the active call
  stop(): Promise<void>;
  
  // Event listeners
  on(event: 'call-start', handler: VapiCallStartHandler): void;
  on(event: 'call-end', handler: VapiCallEndHandler): void;
  on(event: 'message', handler: VapiMessageHandler): void;
  on(event: 'speech-start', handler: VapiSpeechStartHandler): void;
  on(event: 'speech-end', handler: VapiSpeechEndHandler): void;
  on(event: 'error', handler: VapiErrorHandler): void;
  
  // Remove event listeners
  off(event: 'call-start', handler: VapiCallStartHandler): void;
  off(event: 'call-end', handler: VapiCallEndHandler): void;
  off(event: 'message', handler: VapiMessageHandler): void;
  off(event: 'speech-start', handler: VapiSpeechStartHandler): void;
  off(event: 'speech-end', handler: VapiSpeechEndHandler): void;
  off(event: 'error', handler: VapiErrorHandler): void;
}
