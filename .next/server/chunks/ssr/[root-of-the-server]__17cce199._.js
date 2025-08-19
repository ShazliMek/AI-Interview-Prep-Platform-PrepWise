module.exports = {

"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/lib/vapi.sdk.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getVapiInstance": (()=>getVapiInstance),
    "startVapiCall": (()=>startVapiCall),
    "validateVapiConfig": (()=>validateVapiConfig),
    "vapi": (()=>vapi)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vapi$2d$ai$2f$web$2f$dist$2f$vapi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@vapi-ai/web/dist/vapi.js [app-ssr] (ecmascript)");
;
const vapi = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vapi$2d$ai$2f$web$2f$dist$2f$vapi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](("TURBOPACK compile-time value", "597c1066-e635-44b9-8cac-2786612ef8b0"));
function getVapiInstance() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vapi$2d$ai$2f$web$2f$dist$2f$vapi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](("TURBOPACK compile-time value", "597c1066-e635-44b9-8cac-2786612ef8b0"));
}
function validateVapiConfig() {
    const webToken = ("TURBOPACK compile-time value", "597c1066-e635-44b9-8cac-2786612ef8b0");
    const assistantId = ("TURBOPACK compile-time value", "8818c857-1551-47e2-8670-217733d80b8d");
    const generateAssistantId = ("TURBOPACK compile-time value", "8818c857-1551-47e2-8670-217733d80b8d");
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    return {
        webToken,
        assistantId,
        generateAssistantId
    };
}
async function startVapiCall(assistantId, overrides) {
    try {
        console.log('Starting VAPI call:', {
            assistantId,
            overrides: JSON.stringify(overrides, null, 2)
        });
        // Add tracing for debugging
        console.log('VAPI SDK Connection Ready:', !!vapi);
        if (overrides) {
            // Log each variable being passed for troubleshooting
            if (overrides.variableValues) {
                console.log('Variables being sent to assistant:');
                Object.entries(overrides.variableValues).forEach(([key, value])=>{
                    console.log(`  - ${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
                });
            }
            // Start with assistant ID and overrides
            await vapi.start(assistantId, overrides);
        } else {
            // Start with just assistant ID
            await vapi.start(assistantId);
        }
        console.log('VAPI call started successfully');
    } catch (error) {
        console.error('Failed to start VAPI call:', error);
        console.error('Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        throw error;
    }
}
}}),
"[project]/lib/services/vapiEncryptionService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "vapiEncryptionService": (()=>vapiEncryptionService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vapi.sdk.ts [app-ssr] (ecmascript)");
;
const vapiEncryptionService = {
    /**
   * Start recording and encrypting a Vapi interview call
   * 
   * @param interviewId The ID of the interview session
   * @returns A cleanup function to stop recording
   */ async startEncryptedRecording (interviewId) {
        // This will hold audio chunks
        const audioChunks = [];
        let isRecording = true;
        let recordingStream = null;
        let mediaRecorder = null;
        try {
            // Get current user via API call instead of direct import
            const userResponse = await fetch('/api/user/current');
            const userData = await userResponse.json();
            if (!userData.success || !userData.user) {
                throw new Error("User not authenticated");
            }
            // Check browser compatibility
            if (!navigator.mediaDevices || !MediaRecorder) {
                console.warn("Recording not supported in this browser");
                return ()=>{}; // Return empty cleanup function
            }
            // Request microphone access
            recordingStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            // Create MediaRecorder instance
            mediaRecorder = new MediaRecorder(recordingStream);
            // Start recording
            mediaRecorder.start();
            // Collect audio chunks
            mediaRecorder.addEventListener('dataavailable', (event)=>{
                if (event.data.size > 0 && isRecording) {
                    audioChunks.push(event.data);
                }
            });
            // Save recording when stopped
            mediaRecorder.addEventListener('stop', async ()=>{
                if (!isRecording || audioChunks.length === 0) return;
                try {
                    // Combine chunks into a single blob
                    const audioBlob = new Blob(audioChunks, {
                        type: 'audio/webm'
                    });
                    // Convert to buffer for encryption
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    const audioBuffer = Buffer.from(arrayBuffer);
                    // Create metadata
                    const metadata = {
                        duration: 0,
                        fileSize: audioBuffer.byteLength,
                        mimeType: 'audio/webm'
                    };
                    // Store encrypted recording via API (try MongoDB first, fallback to Firebase)
                    const formData = new FormData();
                    formData.append('audio', audioBlob);
                    formData.append('interviewId', interviewId);
                    formData.append('metadata', JSON.stringify(metadata));
                    // Try MongoDB endpoint first
                    let response = await fetch('/api/user/recordings-mongodb', {
                        method: 'POST',
                        body: formData
                    });
                    if (!response.ok) {
                        console.log('MongoDB storage failed, trying Firebase fallback...');
                        // Fallback to Firebase endpoint
                        response = await fetch('/api/user/recordings', {
                            method: 'POST',
                            body: formData
                        });
                    }
                    if (response.ok) {
                        const result = await response.json();
                        console.log("Interview recording encrypted and stored successfully:", result);
                    } else {
                        const errorText = await response.text();
                        console.error("Failed to store recording:", errorText);
                    }
                } catch (error) {
                    console.error("Failed to encrypt and store interview recording:", error);
                }
            });
            // Listen for Vapi call end to trigger saving
            const handleCallEnd = ()=>{
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('call-end', handleCallEnd);
            // Return cleanup function
            return ()=>{
                isRecording = false;
                // Clean up Vapi event listener
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('call-end', handleCallEnd);
                // Stop recording
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
                // Stop all tracks
                if (recordingStream) {
                    recordingStream.getTracks().forEach((track)=>track.stop());
                }
            };
        } catch (error) {
            console.error("Error starting encrypted recording:", error);
            return ()=>{}; // Return empty cleanup function
        }
    },
    /**
   * Retrieve and play back an encrypted recording
   * 
   * @param recordingId The ID of the encrypted recording
   * @returns A cleanup function to stop playback
   */ async playEncryptedRecording (recordingId) {
        try {
            console.log(`[Vapi Encryption Service] Playing recording: ${recordingId}`);
            // Check authentication first
            const authResponse = await fetch('/api/user/current');
            const authData = await authResponse.json();
            if (!authData.success) {
                throw new Error('Authentication required. Please sign in to play recordings.');
            }
            // Try MongoDB endpoint first, fallback to Firebase
            let response = await fetch(`/api/user/recordings-mongodb/${recordingId}`);
            if (!response.ok) {
                console.log('MongoDB playback failed, trying Firebase fallback...');
                response = await fetch(`/api/user/recordings/${recordingId}`);
            }
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please sign in to play recordings.');
                } else if (response.status === 404) {
                    throw new Error('Recording not found. It may have been deleted or expired.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. You can only play your own recordings.');
                } else {
                    throw new Error(`Failed to fetch recording: ${response.status} ${response.statusText}`);
                }
            }
            // Get the audio data as blob
            const audioBlob = await response.blob();
            console.log(`[Vapi Encryption Service] Retrieved audio blob: ${audioBlob.size} bytes`);
            if (audioBlob.size === 0) {
                throw new Error('Recording is empty or corrupted.');
            }
            // Create object URL for audio playback
            const audioUrl = URL.createObjectURL(audioBlob);
            // Create audio element
            const audioElement = new Audio(audioUrl);
            // Add error handling for audio playback
            audioElement.addEventListener('error', (e)=>{
                console.error('Audio playback error:', e);
                URL.revokeObjectURL(audioUrl);
            });
            // Start playback
            await audioElement.play();
            console.log(`[Vapi Encryption Service] Started playback for recording: ${recordingId}`);
            // Return cleanup function
            return ()=>{
                audioElement.pause();
                audioElement.currentTime = 0;
                URL.revokeObjectURL(audioUrl);
                console.log(`[Vapi Encryption Service] Stopped playback for recording: ${recordingId}`);
            };
        } catch (error) {
            console.error("Error playing encrypted recording:", error);
            throw error;
        }
    }
};
const __TURBOPACK__default__export__ = vapiEncryptionService;
}}),
"[project]/lib/utils/vapi-debug.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Helper utility for debugging Vapi assistant interactions
 */ /**
 * Send debug information about Vapi interactions to server-side logging
 */ __turbopack_context__.s({
    "checkVariableUsage": (()=>checkVariableUsage),
    "logVapiDebug": (()=>logVapiDebug)
});
async function logVapiDebug(type, details) {
    try {
        // Don't log in production to avoid performance issues
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        console.log(`Logging Vapi debug (${type}):`, details);
        const response = await fetch('/api/vapi-debug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                details
            })
        });
        if (!response.ok) {
            console.error('Failed to send Vapi debug log to server');
        }
    } catch (error) {
        console.error('Error sending Vapi debug log:', error);
    }
}
function checkVariableUsage(message, variables) {
    const results = {};
    // Check each variable
    Object.entries(variables).forEach(([key, value])=>{
        if (typeof value === 'string' && value.trim()) {
            results[key] = message.includes(value);
        }
    });
    return results;
}
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/components/Agent.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vapi.sdk.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$vapiEncryptionService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/vapiEncryptionService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$vapi$2d$debug$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/vapi-debug.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm/v4.js [app-ssr] (ecmascript) <export default as v4>");
"use client";
;
;
;
;
;
;
;
;
;
var CallStatus = /*#__PURE__*/ function(CallStatus) {
    CallStatus["INACTIVE"] = "INACTIVE";
    CallStatus["CONNECTING"] = "CONNECTING";
    CallStatus["ACTIVE"] = "ACTIVE";
    CallStatus["FINISHED"] = "FINISHED";
    return CallStatus;
}(CallStatus || {});
const Agent = ({ userId, interviewId: propInterviewId, type, questions, interviewRole, interviewLevel, company, jobTitle// <-- add this
 })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [callStatus, setCallStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("INACTIVE");
    const [isSpeaking, setIsSpeaking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userIsSpeaking, setUserIsSpeaking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const cleanupRecordingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const microphoneStreamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const userSpeakingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Setup microphone activity monitoring to detect when user is speaking
    const setupMicrophoneMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            // Clean up any existing audio processing
            if (microphoneStreamRef.current) {
                microphoneStreamRef.current.getTracks().forEach((track)=>track.stop());
            }
            if (audioContextRef.current) {
                await audioContextRef.current.close();
            }
            if (userSpeakingTimeoutRef.current) {
                clearTimeout(userSpeakingTimeoutRef.current);
            }
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            microphoneStreamRef.current = stream;
            // Set up audio analysis
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            // Function to check audio levels
            const checkAudioLevel = ()=>{
                if (!analyserRef.current || callStatus !== "ACTIVE") return;
                analyserRef.current.getByteFrequencyData(dataArray);
                // Calculate average volume
                let sum = 0;
                for(let i = 0; i < bufferLength; i++){
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                // Threshold for speaking detection (adjust as needed)
                const threshold = 10; // Lower threshold to make it more sensitive
                if (average > threshold) {
                    // User is speaking - debug log to confirm detection
                    console.log("User speaking detected, audio level:", average);
                    setUserIsSpeaking(true);
                    // Clear any existing timeout
                    if (userSpeakingTimeoutRef.current) {
                        clearTimeout(userSpeakingTimeoutRef.current);
                    }
                    // Set a timeout to consider them done speaking if no audio is detected
                    userSpeakingTimeoutRef.current = setTimeout(()=>{
                        setUserIsSpeaking(false);
                        console.log("User speaking timeout - stopped speaking");
                    }, 500);
                }
                // Continue monitoring
                requestAnimationFrame(checkAudioLevel);
            };
            // Start monitoring
            console.log("Microphone monitoring started");
            requestAnimationFrame(checkAudioLevel); // Ensure we call this on animation frame
            return ()=>{
                // Cleanup function
                console.log("Cleaning up microphone monitoring");
                if (microphoneStreamRef.current) {
                    microphoneStreamRef.current.getTracks().forEach((track)=>track.stop());
                }
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }
                if (userSpeakingTimeoutRef.current) {
                    clearTimeout(userSpeakingTimeoutRef.current);
                }
            };
        } catch (error) {
            console.error("Error setting up microphone monitoring:", error);
            return ()=>{};
        }
    }, [
        callStatus,
        setUserIsSpeaking
    ]);
    const [lastMessage, setLastMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Always have an interviewId for recording/analysis
    const [interviewId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(propInterviewId || (type === 'custom' ? `custom-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])()}` : ''));
    // Debug props for inspection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log("Agent component initialized with props:", {
            userId,
            interviewId,
            type,
            questions: questions?.length ? `${questions.length} questions` : 'none',
            interviewRole,
            interviewLevel,
            company
        });
        // Check if critical values are missing
        if (type === 'interview') {
            if (!interviewRole) console.warn("⚠️ Missing interviewRole prop - variables may not work in assistant");
            if (!interviewLevel) console.warn("⚠️ Missing interviewLevel prop - variables may not work in assistant");
            if (!company) console.warn("⚠️ Missing company prop - variables may not work in assistant");
        }
    }, [
        userId,
        interviewId,
        type,
        questions,
        interviewRole,
        interviewLevel,
        company
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Function to save completed interview
        const saveCompletedInterview = async ()=>{
            // Only save custom or regular interviews, not question generation
            if (type !== 'custom' && type !== 'interview') return;
            try {
                // Debug info before saving
                console.log(`Saving interview with company: "${company}"`);
                if (company?.toLowerCase() === 'meta') {
                    console.log('Meta company detected - should use Facebook logo');
                }
                // Prepare payload with care for Meta company name
                const payload = {
                    interviewId,
                    role: jobTitle || interviewRole || 'Interview',
                    type: type === 'custom' ? 'Custom' : 'Preset',
                    company: company || 'Not specified',
                    techstack: [],
                    level: interviewLevel || 'Not specified'
                };
                console.log('Save interview payload:', payload);
                // Make the API call
                const response = await fetch('/api/save-completed-interview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Interview saved successfully:', data.interview);
                } else {
                    console.error('Failed to save interview:', data.error);
                }
            } catch (error) {
                console.error('Error saving completed interview:', error);
            }
        };
        const handleCallStart = async ()=>{
            console.log("🟢 Call started!");
            setCallStatus("ACTIVE");
            // Reset speaking states at start
            setIsSpeaking(false);
            setUserIsSpeaking(false);
            // Start encrypted recording if we have an interview ID
            if (interviewId && userId) {
                try {
                    const cleanup = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$vapiEncryptionService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].startEncryptedRecording(interviewId);
                    cleanupRecordingRef.current = cleanup;
                    console.log("Encrypted recording started for interview:", interviewId);
                } catch (error) {
                    console.error("Failed to start encrypted recording:", error);
                }
            }
            // Start monitoring user's microphone for speech detection
            console.log("Starting microphone monitoring...");
            try {
                const micCleanup = await setupMicrophoneMonitoring();
                const existingCleanup = cleanupRecordingRef.current;
                if (existingCleanup) {
                    cleanupRecordingRef.current = ()=>{
                        existingCleanup();
                        micCleanup();
                    };
                } else {
                    cleanupRecordingRef.current = micCleanup;
                }
                console.log("Microphone monitoring setup complete");
            } catch (err) {
                console.error("Error setting up microphone monitoring:", err);
            }
        };
        const handleCallEnd = ()=>{
            setCallStatus("FINISHED");
            // Reset speaking states
            setIsSpeaking(false);
            setUserIsSpeaking(false);
            // Stop encrypted recording and microphone monitoring
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
                console.log("Encrypted recording and monitoring stopped");
            }
            // Explicitly stop any microphone tracks
            if (microphoneStreamRef.current) {
                microphoneStreamRef.current.getTracks().forEach((track)=>track.stop());
                microphoneStreamRef.current = null;
            }
            // Clear any pending timeout
            if (userSpeakingTimeoutRef.current) {
                clearTimeout(userSpeakingTimeoutRef.current);
                userSpeakingTimeoutRef.current = null;
            }
            // Save completed interview information
            if ((type === 'interview' || type === 'custom') && interviewId) {
                saveCompletedInterview();
                // Redirect to analysis after a delay
                setTimeout(()=>{
                    router.push(`/interview-analysis?id=${interviewId}`);
                }, 2000);
            }
        };
        const handleMessage = (message)=>{
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                if (message.role && message.transcript) {
                    const newMessage = {
                        role: message.role,
                        content: message.transcript
                    };
                    // Check if first assistant message contains any of our variables
                    // This helps us debug if variables are being used
                    if (message.role === 'assistant' && messages.length === 0) {
                        console.log("First assistant message:", message.transcript);
                        // Check which variables are being used in the response
                        const variableUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$vapi$2d$debug$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkVariableUsage"])(message.transcript, {
                            interviewRole,
                            role: interviewRole,
                            jobTitle: interviewRole,
                            company,
                            interviewLevel,
                            level: interviewLevel,
                            experience: interviewLevel
                        });
                        console.log("Variable usage check:", variableUsage);
                        // Log the results for server-side analysis
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$vapi$2d$debug$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logVapiDebug"])('assistant-response-check', {
                            firstMessage: message.transcript,
                            variableUsage,
                            originalVariables: {
                                interviewRole,
                                company,
                                interviewLevel,
                                questions: questions?.length || 0
                            }
                        });
                        // Create user-friendly list of detected variables
                        const variableCheck = [];
                        if (interviewRole && message.transcript.includes(interviewRole)) variableCheck.push("✅ Contains interviewRole");
                        else if (interviewRole) variableCheck.push("❌ Missing interviewRole");
                        if (company && message.transcript.includes(company)) variableCheck.push("✅ Contains company");
                        else if (company) variableCheck.push("❌ Missing company");
                        if (interviewLevel && message.transcript.includes(interviewLevel)) variableCheck.push("✅ Contains interviewLevel");
                        else if (interviewLevel) variableCheck.push("❌ Missing interviewLevel");
                        console.log("Variable usage summary:", variableCheck);
                    }
                    setMessages((prev)=>[
                            ...prev,
                            newMessage
                        ]);
                    setLastMessage(message.transcript);
                }
            }
        };
        const handleSpeechStart = ()=>{
            console.log("AI speech started");
            setIsSpeaking(true);
        };
        const handleSpeechEnd = ()=>{
            console.log("AI speech ended");
            setIsSpeaking(false);
        };
        const handleError = (error)=>{
            console.error("Vapi error:", error);
            if (error instanceof Error) {
                console.error("Vapi error details:", {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }
        };
        // Add event listeners
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('call-start', handleCallStart);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('call-end', handleCallEnd);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('message', handleMessage);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('speech-start', handleSpeechStart);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('speech-end', handleSpeechEnd);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].on('error', handleError);
        // Cleanup function
        return ()=>{
            // Remove event listeners
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('call-start', handleCallStart);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('call-end', handleCallEnd);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('message', handleMessage);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('speech-start', handleSpeechStart);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('speech-end', handleSpeechEnd);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].off('error', handleError);
            // Stop recording if active
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
            }
        };
    }, [
        interviewId,
        userId,
        type,
        router,
        company,
        interviewLevel,
        interviewRole,
        jobTitle,
        messages.length,
        questions?.length,
        setupMicrophoneMonitoring
    ]);
    // Helper function to prepare variable values for VAPI
    const prepareVariableValues = ()=>{
        const variables = {};
        // Add interview-specific variables
        if (type === 'interview') {
            // Match variable names with what's expected in the VAPI assistant
            if (interviewRole) {
                variables.interviewRole = interviewRole;
                variables.role = interviewRole; // Common variable name
                variables.jobTitle = interviewRole; // Alternate variable name
                variables.position = interviewRole; // Another possible name
            }
            if (interviewLevel) {
                variables.interviewLevel = interviewLevel;
                variables.level = interviewLevel; // Common variable name
                variables.experience = interviewLevel; // Alternate variable name
                variables.seniority = interviewLevel; // Another possible name
            }
            if (company) {
                variables.company = company;
                variables.companyName = company; // Alternate variable name
            }
            // Format questions for the template with multiple format options
            if (questions && questions.length > 0) {
                variables.questionsText = questions.map((q, i)=>`${i + 1}. ${q}`).join('\n');
                variables.questions = questions.join('\n'); // Simple joined string
                variables.totalQuestions = questions.length;
                variables.interviewContext = `This is a ${interviewLevel || 'professional'} ${interviewRole || 'technical'} interview${company ? ` for ${company}` : ''}.`;
            }
        } else if (type === 'custom') {
            if (jobTitle) {
                variables.jobTitle = jobTitle;
                variables.role = jobTitle;
            }
        }
        // Add user info
        if (userId) variables.userId = userId;
        // Add additional interview metadata
        if (interviewId) variables.interviewId = interviewId;
        variables.sessionType = type;
        console.log("Prepared variable values:", variables);
        return variables;
    };
    // Helper function to start a Vapi call with proper configuration
    // Helper function to start a Vapi call with proper configuration
    const startVapiCall = async ()=>{
        const assistantId = type === 'interview' ? ("TURBOPACK compile-time value", "8818c857-1551-47e2-8670-217733d80b8d") : type === 'custom' ? ("TURBOPACK compile-time value", "4f8f3ada-3994-45ab-84ca-bb982c871ba0") : ("TURBOPACK compile-time value", "8818c857-1551-47e2-8670-217733d80b8d");
        if (!assistantId) {
            throw new Error(`Missing VAPI assistant ID for type: ${type}`);
        }
        try {
            const variableValues = prepareVariableValues();
            console.log("Starting call with assistant ID:", assistantId);
            console.log("Variable values:", JSON.stringify(variableValues, null, 2));
            // Log prepared variables for debugging
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$vapi$2d$debug$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logVapiDebug"])('variable-preparation', {
                assistantId,
                variableValues,
                props: {
                    userId,
                    interviewId,
                    type,
                    questionsCount: questions?.length || 0,
                    interviewRole,
                    interviewLevel,
                    company
                }
            });
            // According to VAPI docs, we can pass assistantOverrides as the second parameter
            // to the start() method to override assistant settings and set template variables
            const assistantOverrides = {
                variableValues,
                // Try to add first message with manually injected variables as fallback
                firstMessage: type === 'interview' && interviewRole && company ? `Hello! I'll be conducting your ${interviewLevel || 'professional'} ${interviewRole} interview for ${company}. Let's get started.` : undefined
            };
            console.log("Starting VAPI call with overrides:", JSON.stringify(assistantOverrides, null, 2));
            // Start the call with assistant ID and overrides
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].start(assistantId, assistantOverrides);
            // For interview mode, prepare UI state
            if (type === 'interview' && questions && questions.length > 0) {
                setMessages([
                    {
                        role: 'system',
                        content: `Interview initialized with ${questions.length} preset questions.`
                    }
                ]);
                setLastMessage(`Interview ready. The AI will conduct a structured interview using the preset questions.`);
            }
            console.log("Vapi call started successfully");
            return true;
        } catch (error) {
            console.error("Failed to start Vapi call:", error);
            throw error;
        }
    };
    const handleStartCall = async ()=>{
        if (callStatus === "INACTIVE" || callStatus === "FINISHED") {
            setCallStatus("CONNECTING");
            try {
                await startVapiCall();
            // Call will transition to ACTIVE via the handleCallStart callback when it connects
            } catch (error) {
                console.error("Failed to start call:", error);
                setCallStatus("INACTIVE");
                // Show user-friendly error message
                setLastMessage(`Failed to start call: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };
    const handleEndCall = async ()=>{
        if (callStatus === "ACTIVE") {
            try {
                // End Vapi call
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vapi$2e$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vapi"].stop();
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
                setCallStatus("FINISHED");
            }
        }
    };
    // Check if we have preset questions to display
    const hasPresetQuestions = questions && questions.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "call-view",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-interviewer hover-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `avatar ${isSpeaking ? 'speaking' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/ai-avatar.png",
                                        alt: "AI Interviewer",
                                        width: 90,
                                        height: 75,
                                        className: "object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Agent.tsx",
                                        lineNumber: 579,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "animate-speak"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Agent.tsx",
                                        lineNumber: 586,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Agent.tsx",
                                lineNumber: 578,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "AI Interviewer"
                            }, void 0, false, {
                                fileName: "[project]/components/Agent.tsx",
                                lineNumber: 588,
                                columnNumber: 21
                            }, this),
                            type === 'interview' && company && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base text-gray-300 font-medium",
                                children: company
                            }, void 0, false, {
                                fileName: "[project]/components/Agent.tsx",
                                lineNumber: 590,
                                columnNumber: 25
                            }, this),
                            isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-green-400",
                                children: "Speaking"
                            }, void 0, false, {
                                fileName: "[project]/components/Agent.tsx",
                                lineNumber: 593,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Agent.tsx",
                        lineNumber: 577,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-border hover-card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `avatar ${userIsSpeaking ? 'speaking' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/user-avatar.png",
                                            alt: "user",
                                            width: 540,
                                            height: 540,
                                            className: "rounded-full object-cover size-[160px]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Agent.tsx",
                                            lineNumber: 598,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "animate-speak"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Agent.tsx",
                                            lineNumber: 605,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Agent.tsx",
                                    lineNumber: 597,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Candidate"
                                }, void 0, false, {
                                    fileName: "[project]/components/Agent.tsx",
                                    lineNumber: 607,
                                    columnNumber: 25
                                }, this),
                                type === 'interview' && interviewRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base text-gray-300 font-medium",
                                    children: [
                                        interviewLevel,
                                        " ",
                                        interviewRole
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Agent.tsx",
                                    lineNumber: 609,
                                    columnNumber: 29
                                }, this),
                                userIsSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-green-400",
                                    children: "Speaking"
                                }, void 0, false, {
                                    fileName: "[project]/components/Agent.tsx",
                                    lineNumber: 614,
                                    columnNumber: 44
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Agent.tsx",
                            lineNumber: 596,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Agent.tsx",
                        lineNumber: 595,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Agent.tsx",
                lineNumber: 576,
                columnNumber: 13
            }, this),
            hasPresetQuestions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-16 mb-8 p-6 bg-blue-900/20 rounded-xl border border-blue-600/30 shadow-inner",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-lg font-medium mb-3 text-blue-200",
                        children: "Interview Questions:"
                    }, void 0, false, {
                        fileName: "[project]/components/Agent.tsx",
                        lineNumber: 622,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "list-decimal ml-5 space-y-4",
                        children: questions.map((question, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "text-sm text-blue-100 pb-2 border-b border-blue-700/30 last:border-0",
                                children: question
                            }, index, false, {
                                fileName: "[project]/components/Agent.tsx",
                                lineNumber: 625,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/Agent.tsx",
                        lineNumber: 623,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Agent.tsx",
                lineNumber: 621,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "transcript-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "transcript min-h-16 text-base",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('transition-opacity duration-500', messages.length > 0 ? 'animate-fadeIn opacity-100' : 'text-gray-500'),
                        children: messages.length > 0 ? lastMessage : 'Interview transcript will appear here...'
                    }, void 0, false, {
                        fileName: "[project]/components/Agent.tsx",
                        lineNumber: 633,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Agent.tsx",
                    lineNumber: 632,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Agent.tsx",
                lineNumber: 631,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex justify-center mt-6",
                children: callStatus !== "ACTIVE" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "relative btn-call text-lg px-8 py-4",
                    onClick: handleStartCall,
                    disabled: callStatus === "CONNECTING",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('absolute animate-ping rounded-full opacity-75', callStatus !== "CONNECTING" && 'hidden')
                        }, void 0, false, {
                            fileName: "[project]/components/Agent.tsx",
                            lineNumber: 646,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: callStatus === "INACTIVE" || callStatus === "FINISHED" ? 'Start Interview' : 'Connecting...'
                        }, void 0, false, {
                            fileName: "[project]/components/Agent.tsx",
                            lineNumber: 650,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Agent.tsx",
                    lineNumber: 641,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn-disconnect text-lg px-8 py-4",
                    onClick: handleEndCall,
                    children: "END INTERVIEW"
                }, void 0, false, {
                    fileName: "[project]/components/Agent.tsx",
                    lineNumber: 657,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Agent.tsx",
                lineNumber: 639,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = Agent;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__17cce199._.js.map