
import { toast } from "@/hooks/use-toast";

export interface VoiceOptions {
  voiceId: string;
  displayName: string;
  description: string;
}

// Available voices will be populated from browser's speech synthesis
export const availableVoices: VoiceOptions[] = [];

// Function to get available voices from the browser
export const getAvailableVoices = (): VoiceOptions[] => {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  
  return voices
    .filter(voice => voice.lang.startsWith('en'))
    .map(voice => ({
      voiceId: voice.name,
      displayName: voice.name,
      description: `${voice.lang} - ${voice.name}`
    }));
};

// Populate available voices when they're loaded
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = getAvailableVoices();
    availableVoices.length = 0;
    availableVoices.push(...voices);
  };
  
  // Try to get voices immediately
  const initialVoices = getAvailableVoices();
  if (initialVoices.length > 0) {
    availableVoices.push(...initialVoices);
  }
}

/**
 * Convert text to speech using browser's Web Speech API
 * This creates an audio blob that can be played
 */
export const textToSpeech = async (text: string, voiceName?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!window.speechSynthesis) {
        throw new Error("Speech synthesis not supported in this browser");
      }

      const synth = window.speechSynthesis;
      
      // Cancel any ongoing speech
      synth.cancel();

      // Split text into chunks (Web Speech API has limits)
      const chunks = chunkText(text, 200);
      
      // Create a MediaRecorder to capture the audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioContext.createMediaStreamDestination();
      const recorder = new MediaRecorder(dest.stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve(audioUrl);
      };

      // Find the requested voice
      const voices = synth.getVoices();
      let selectedVoice = voices.find(v => v.name === voiceName);
      
      // Fallback to first English voice if requested voice not found
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en-US')) || voices[0];
      }

      // Start recording
      recorder.start();

      // Speak the first chunk to trigger audio
      const utterance = new SpeechSynthesisUtterance(chunks[0]);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        // Stop recording after a short delay
        setTimeout(() => {
          recorder.stop();
          synth.cancel();
        }, 100);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        recorder.stop();
        reject(new Error("Speech synthesis failed"));
      };

      synth.speak(utterance);

    } catch (error) {
      console.error("Error converting text to speech:", error);
      toast({
        title: "Audio generation failed",
        description: "There was an issue creating the audio. Please try again.",
        variant: "destructive",
      });
      reject(error);
    }
  });
};

/**
 * Simpler version that just speaks without recording
 * Use this if you want real-time playback
 */
export const speakText = (text: string, voiceName?: string): void => {
  if (!window.speechSynthesis) {
    toast({
      title: "Speech not supported",
      description: "Your browser doesn't support text-to-speech.",
      variant: "destructive",
    });
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel(); // Cancel any ongoing speech

  const chunks = chunkText(text, 200);
  let currentChunk = 0;

  const speakChunk = () => {
    if (currentChunk >= chunks.length) return;

    const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
    
    // Find the requested voice
    const voices = synth.getVoices();
    let selectedVoice = voices.find(v => v.name === voiceName);
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-US')) || voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      currentChunk++;
      speakChunk();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      toast({
        title: "Speech failed",
        description: "There was an error speaking the text.",
        variant: "destructive",
      });
    };

    synth.speak(utterance);
  };

  speakChunk();
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = (): void => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Chunk text into smaller pieces for better speech synthesis
 */
const chunkText = (text: string, maxLength: number): string[] => {
  const chunks: string[] = [];
  
  // Split by sentences to maintain coherence
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
};
