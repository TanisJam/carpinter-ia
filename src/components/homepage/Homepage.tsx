"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Grid3x3, Sparkles, Mic, MicOff, Loader2 } from "lucide-react";
import { Logo } from "./Logo";
import copy from "@/copy/homepage.json";

export function Homepage() {
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const router = useRouter();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = () => {
    if (description.trim()) {
      router.push(`/configurador?ai=${encodeURIComponent(description)}`);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await transcribeAudio(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "No se pudo acceder al micrófono. Por favor, verifica los permisos."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al transcribir el audio");
      }

      const { transcript: text } = await response.json();
      setDescription(text);
    } catch (error) {
      console.error("Transcription error:", error);
      alert(
        "Hubo un error al transcribir el audio. Por favor, intenta de nuevo o escribe tu solicitud."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const quickPrompts = [
    "Minimalist bedroom closet",
    "Luxury walk-in with island",
  ];

  return (
    <div className="min-h-screen bg-gray-50 sm:bg-linear-to-br sm:from-blue-100 sm:via-purple-50 sm:to-pink-100 flex items-center justify-center sm:p-4">
      {/* Phone frame on desktop, full width on mobile */}
      <div className="w-full min-h-screen sm:min-h-0 sm:max-h-[calc(100vh-2rem)] bg-white sm:rounded-3xl sm:shadow-2xl overflow-auto flex flex-col">
        {/* Navigation */}
        <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <Logo appName={copy.header.appName} className="justify-center" />
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:pt-20">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16 w-full">
            <h1
              className="text-4xl font-bold mb-5 md:mb-6 text-gray-900 leading-tight"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              }}
            >
              {copy.hero.title}
            </h1>
            <p
              className="text-gray-600 text-base md:text-lg leading-relaxed px-4 mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Our AI-powered architect will generate a custom structural design
              based on your needs, dimensions, and style preferences. Just tell
              us what you imagine.
            </p>
          </div>

          {/* Input Card */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-48 md:h-56 p-5 md:p-6 pr-20 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 resize-none text-sm md:text-base leading-relaxed"
                placeholder={copy.hero.placeholder}
                disabled={isRecording || isTranscribing}
              />

              {/* Mic Button - Top Right */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`absolute right-5 top-5 p-2 rounded-full transition-colors ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isTranscribing ? (
                  <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>

            {/* Status messages */}
            {isRecording && (
              <p className="text-sm text-red-600 mt-3 animate-pulse">
                🔴 Grabando... Presiona el micrófono nuevamente para detener
              </p>
            )}

            {isTranscribing && (
              <p className="text-sm text-blue-600 mt-3">
                Transcribiendo audio con Whisper...
              </p>
            )}

            {/* Bottom Section */}
            <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Quick Prompts */}
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">
                  TRY:
                </span>
                <button
                  onClick={() => setDescription("Minimalist bedroom closet")}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors whitespace-nowrap shrink-0"
                >
                  "Minimalist bedroom closet"
                </button>
                <button
                  onClick={() => setDescription("Luxury walk-in with island")}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors whitespace-nowrap shrink-0"
                >
                  "Luxury walk-in with island"
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleSubmit}
                disabled={!description.trim() || isRecording || isTranscribing}
                className="w-full md:w-auto px-6 py-3 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                GENERATE DESIGN
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4 text-sm text-gray-500">
            <div className="text-center">{copy.footer.text}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
