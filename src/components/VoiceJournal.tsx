import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoiceJournalProps {
  onTranscriptionComplete: (text: string, isVoice: boolean) => void;
  isLoading?: boolean;
}

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

export const VoiceJournal: React.FC<VoiceJournalProps> = ({ 
  onTranscriptionComplete, 
  isLoading = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition as SpeechRecognitionConstructor | undefined;
    
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(prev => {
        if (finalTranscript) {
          return prev + finalTranscript;
        }
        return prev;
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice journaling.",
          variant: "destructive",
        });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart if still supposed to be listening
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening, toast]);

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      toast({
        title: "Microphone access required",
        description: "Please enable microphone access to use voice journaling.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSendTranscript = () => {
    if (transcript.trim()) {
      onTranscriptionComplete(transcript.trim(), true);
      setTranscript('');
      stopListening();
    }
  };

  const handleClear = () => {
    setTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        Voice journaling is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-3">
        <AnimatePresence mode="wait">
          {!isListening ? (
            <motion.div
              key="start"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Button
                onClick={startListening}
                disabled={isLoading}
                className={cn(
                  "rounded-full w-14 h-14 p-0",
                  "bg-gradient-to-br from-primary to-primary/80",
                  "hover:from-primary/90 hover:to-primary/70",
                  "shadow-lg hover:shadow-xl transition-all"
                )}
              >
                <Mic className="w-6 h-6" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="stop"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-3"
            >
              {/* Pulsing indicator */}
              <motion.div
                className="relative"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                <Button
                  onClick={stopListening}
                  className={cn(
                    "rounded-full w-14 h-14 p-0 relative z-10",
                    "bg-gradient-to-br from-red-500 to-red-600",
                    "hover:from-red-600 hover:to-red-700",
                    "shadow-lg"
                  )}
                >
                  <Square className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Text */}
      <p className="text-center text-sm text-muted-foreground">
        {isListening ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Listening... Speak freely
          </span>
        ) : (
          "Tap to start voice journaling"
        )}
      </p>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "p-4 rounded-2xl",
              "bg-secondary/50 border border-border/30",
              "max-h-40 overflow-y-auto"
            )}
          >
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {transcript}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="rounded-full"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSendTranscript}
            disabled={isLoading}
            className={cn(
              "rounded-full gap-2",
              "bg-primary/90 hover:bg-primary"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send to companion
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceJournal;

