"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import vapiEncryptionService from "@/lib/services/vapiEncryptionService";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

interface Message {
    type: string;
    transcriptType?: string;
    role?: 'user' | 'system' | 'assistant';
    transcript?: string;
}

interface AgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

const Agent = ({userName, userId, interviewId, type, questions}: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const cleanupRecordingRef = useRef<(() => void) | null>(null);
    const [lastMessage, setLastMessage] = useState<string>('');

    useEffect(() => {
        const handleCallStart = async () => {
            setCallStatus(CallStatus.ACTIVE);
            
            // Start encrypted recording if we have an interview ID
            if (interviewId && userId) {
                try {
                    const cleanup = await vapiEncryptionService.startEncryptedRecording(interviewId);
                    cleanupRecordingRef.current = cleanup;
                    console.log("Encrypted recording started for interview:", interviewId);
                } catch (error) {
                    console.error("Failed to start encrypted recording:", error);
                }
            }
        };
        
        const handleCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            
            // Stop encrypted recording
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
                console.log("Encrypted recording stopped");
            }
            
            // If this is an interview, redirect to analysis after a delay
            if (type === 'interview' && interviewId) {
                setTimeout(() => {
                    router.push(`/interview-analysis?id=${interviewId}`);
                }, 2000);
            }
        };
        
        const handleMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                if (message.role && message.transcript) {
                    const newMessage = {
                        role: message.role,
                        content: message.transcript
                    };
                    
                    setMessages((prev) => [...prev, newMessage]);
                    setLastMessage(message.transcript);
                }
            }
        };

        const handleSpeechStart = () => setIsSpeaking(true);
        const handleSpeechEnd = () => setIsSpeaking(false);
        const handleError = (error: Error) => console.error("Vapi error:", error);

        // Add event listeners
        vapi.on('call-start', handleCallStart);
        vapi.on('call-end', handleCallEnd);
        vapi.on('message', handleMessage);
        vapi.on('speech-start', handleSpeechStart);
        vapi.on('speech-end', handleSpeechEnd);
        vapi.on('error', handleError);

        // Cleanup function
        return () => {
            // Remove event listeners
            vapi.off('call-start', handleCallStart);
            vapi.off('call-end', handleCallEnd);
            vapi.off('message', handleMessage);
            vapi.off('speech-start', handleSpeechStart);
            vapi.off('speech-end', handleSpeechEnd);
            vapi.off('error', handleError);
            
            // Stop recording if active
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
            }
        };
    }, [interviewId, userId, type, router]);
    
    const handleStartCall = async () => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            setCallStatus(CallStatus.CONNECTING);
            
            try {
                // Start Vapi call with proper configuration based on interview type
                if (type === 'interview' && interviewId) {
                    // For interview mode with encryption
                    const interviewAssistant = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
                    
                    if (!interviewAssistant) {
                        throw new Error("Missing Vapi assistant ID in environment variables");
                    }
                    
                    // Start the Vapi call with assistant ID directly
                    await vapi.start(interviewAssistant);
                    
                    // Start encrypted recording only for interview mode
                    if (userId) {
                        try {
                            const cleanup = await vapiEncryptionService.startEncryptedRecording(interviewId);
                            cleanupRecordingRef.current = cleanup;
                            console.log("Encrypted recording started for interview:", interviewId);
                        } catch (error) {
                            console.error("Failed to start encrypted recording:", error);
                            // Continue with the call even if encryption fails
                        }
                    }
                } else if (type === 'generate') {
                    // For interview generation mode - simpler assistant
                    const generateAssistant = process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
                    
                    if (!generateAssistant) {
                        throw new Error("Missing Vapi generate assistant ID in environment variables");
                    }
                    
                    await vapi.start(generateAssistant);
                } else {
                    throw new Error("Invalid interview configuration");
                }
                
                // Call will transition to ACTIVE via the handleCallStart callback when it connects
            } catch (error) {
                console.error("Failed to start call:", error);
                setCallStatus(CallStatus.INACTIVE);
            }
        }
    };
    
    const handleEndCall = async () => {
        if (callStatus === CallStatus.ACTIVE) {
            try {
                // End Vapi call
                await vapi.stop();
                
                // setCallStatus will be updated by the onCallEnd event handler
                // This ensures our state reflects the actual call state from Vapi
                
                // Stop recording explicitly (also handled by call-end event, this is a safety measure)
                if (cleanupRecordingRef.current) {
                    cleanupRecordingRef.current();
                    cleanupRecordingRef.current = null;
                }
            } catch (error) {
                console.error("Failed to end call:", error);
                // Force status update even if the call end fails
                setCallStatus(CallStatus.FINISHED);
            }
        }
    };

    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src='/ai-avatar.png' alt='vapi' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/user-avatar.png' alt='user' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            
            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p className={cn('transition-opacity duration-500', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}
            
            <div className='w-full flex justify-center'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button 
                        className='relative btn-call'
                        onClick={handleStartCall}
                    >
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatus.CONNECTING && 'hidden')} />
                        <span>
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? 'Call' : '. . .'}
                        </span>
                    </button>
                ) : (
                    <button 
                        className='btn-disconnect'
                        onClick={handleEndCall}
                    >
                        END
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;