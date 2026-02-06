import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { placardConfigSchema } from "@/schemas/wardrobe-schema";
import { SYSTEM_PROMPT } from "@/lib/prompts/nl-to-config-prompt";

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
});

export async function POST(req: NextRequest) {
  let transcript = "";
  
  try {
    const body = await req.json();
    transcript = body.transcript;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    console.log("Processing transcript:", transcript);

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo-key") {
      console.error("OPENAI_API_KEY not configured");
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada. Por favor, agrega tu API key en .env.local" },
        { status: 500 }
      );
    }

    console.log("Calling OpenAI API...");

    // Call OpenAI API with GPT-4o-mini (fast, cheap, and excellent for structured outputs)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const rawConfig = JSON.parse(completion.choices[0].message.content || "{}");
    
    console.log("Validating config with Zod...");
    
    // Import sanitization function
    const { sanitizePlacardConfig } = await import("@/lib/utils/sanitize-config");
    
    // Sanitize config before validation (auto-correct invalid values)
    const sanitizedConfig = sanitizePlacardConfig(rawConfig);
    
    // Validate with Zod schema
    const validatedConfig = placardConfigSchema.parse(sanitizedConfig);

    console.log("Generated config:", validatedConfig.id);

    return NextResponse.json({ config: validatedConfig });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // Check if it's a rate limit or quota error
    if (error instanceof Error && (error.message.includes("429") || error.message.includes("quota"))) {
      console.log("Using mock config generator due to API quota/rate limit");
      
      // Import and use mock generator
      const { generateMockConfig } = await import("@/lib/mock-config-generator");
      const mockConfig = generateMockConfig(transcript);
      
      return NextResponse.json({ 
        config: mockConfig,
        warning: "Usando generador mock (límite de API alcanzado). Verifica tu cuenta de OpenAI."
      });
    }

    // Return detailed error message
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
