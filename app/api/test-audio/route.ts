import { NextResponse } from "next/server";

export async function GET() {
  // Create a simple test audio file (minimal WAV)
  const sampleRate = 44100;
  const duration = 2; // 2 seconds
  const numSamples = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  
  // Write WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // Generate simple sine wave (440 Hz tone)
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.3;
    const intSample = Math.max(-32768, Math.min(32767, sample * 32767));
    view.setInt16(44 + i * 2, intSample, true);
  }
  
  const audioBuffer = Buffer.from(buffer);
  
  return new Response(audioBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/wav',
      'Content-Length': audioBuffer.length.toString(),
      'Content-Disposition': 'inline; filename="test-tone.wav"',
      'Cache-Control': 'no-cache'
    }
  });
}
