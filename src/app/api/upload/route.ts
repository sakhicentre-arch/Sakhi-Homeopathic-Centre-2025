import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials from .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    // Convert the file to a buffer
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'patient_reports', // Optional: organize uploads into a folder
    });

    // Return the secure URL of the uploaded file
    return NextResponse.json({ url: result.secure_url });

  } catch (error) {
    console.error("API Error in POST /api/upload:", error);
    return new NextResponse(
      JSON.stringify({ message: 'An unexpected error occurred while uploading the file.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}