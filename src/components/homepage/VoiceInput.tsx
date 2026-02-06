"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface VoiceInputProps {
  onSubmit: (transcript: string) => void;
  isProcessing: boolean;
}

export function VoiceInput({ onSubmit, isProcessing }: VoiceInputProps) {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder with webm format (widely supported)
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
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
      setTranscript(text);
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Hubo un error al transcribir el audio. Por favor, intenta de nuevo o escribe tu solicitud.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onSubmit(transcript.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Necesito un placard de 2 metros de ancho con espacio para vestidos largos, 4 cajones para ropa interior y estantes para zapatos..."
          className="min-h-[120px] pr-14 resize-none"
          disabled={isProcessing || isRecording || isTranscribing}
        />
        
        {/* Microphone button inside textarea */}
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "ghost"}
          className="absolute right-2 bottom-2"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || isTranscribing}
        >
          {isTranscribing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Status messages */}
      {isRecording && (
        <p className="text-sm text-red-600 animate-pulse">
          🔴 Grabando... Presiona el micrófono nuevamente para detener
        </p>
      )}
      
      {isTranscribing && (
        <p className="text-sm text-blue-600">
          Transcribiendo audio con Whisper...
        </p>
      )}

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={!transcript.trim() || isProcessing || isRecording || isTranscribing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando configuración...
          </>
        ) : (
          "Generar Placard con IA"
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Tip: Presiona Ctrl+Enter para enviar
      </p>
    </div>
  );
}
