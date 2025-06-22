import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let localUri = searchParams.get('filePath');

  if (!localUri) {
    return new NextResponse(JSON.stringify({ error: 'File path is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (localUri.startsWith('local://')) {
    localUri = localUri.substring('local://'.length);
  }

  // Security check to prevent path traversal
  const safeBasePath = process.cwd();
  const filePath = path.join(safeBasePath, localUri);

  if (!filePath.startsWith(safeBasePath)) {
    return new NextResponse(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const fileStat = await stat(filePath);
    const stream = fs.createReadStream(filePath);

    const extension = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (extension === '.wav') contentType = 'audio/wav';
    else if (extension === '.mp3') contentType = 'audio/mpeg';
    else if (extension === '.m4a') contentType = 'audio/mp4';
    else if (extension === '.enc') contentType = 'audio/webm'; // Vapi's format, assume webm for browser

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStat.size.toString(),
      },
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new NextResponse(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Failed to read file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
