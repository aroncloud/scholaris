import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

// This is a simple file upload handler that saves files to the local filesystem
// In a production environment, you should use a proper file storage service
// like AWS S3, Google Cloud Storage, or Azure Blob Storage

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to the filesystem
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the URL to access the file
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file. Please try again.' },
      { status: 500 }
    );
  }
}
