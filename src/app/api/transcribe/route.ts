import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
});

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo-key") {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    console.log("Transcribing audio with Whisper...");

    // Call Whisper API
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "es", // Spanish
      response_format: "text",
    });

    console.log("Transcription:", transcription);

    return NextResponse.json({ transcript: transcription });
  } catch (error) {
    console.error("Whisper API Error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error al transcribir el audio" },
      { status: 500 }
    );
  }
}
