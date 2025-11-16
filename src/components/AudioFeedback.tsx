
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, Gauge } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { speakText, stopSpeaking, getAvailableVoices, VoiceOptions } from "@/services/audioService";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AudioFeedbackProps {
  text: string;
  sectionTitle?: string;
}

const AudioFeedback: React.FC<AudioFeedbackProps> = ({ text, sectionTitle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceOptions[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOptions | null>(null);
  const [speed, setSpeed] = useState<number>(1.0);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = getAvailableVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        const defaultVoice = voices.find(v => v.voiceId.includes('US')) || voices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    loadVoices();

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopSpeaking();
    };
  }, []);

  const generateAudio = async () => {
    try {
      setIsLoading(true);
      
      const speechText = sectionTitle 
        ? `${sectionTitle}. ${text}` 
        : text;
      
      stopSpeaking();
      
      // Create utterance with custom speed
      if (window.speechSynthesis) {
        const synth = window.speechSynthesis;
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(speechText);
        
        const voices = synth.getVoices();
        let selectedSynthVoice = voices.find(v => v.name === selectedVoice?.voiceId);
        
        if (!selectedSynthVoice) {
          selectedSynthVoice = voices.find(v => v.lang.startsWith('en-US')) || voices[0];
        }

        if (selectedSynthVoice) {
          utterance.voice = selectedSynthVoice;
        }
        
        utterance.rate = speed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setIsPlaying(false);
        };

        synth.speak(utterance);
        setIsPlaying(true);
        
        toast({
          title: "Audio playing",
          description: `Reading at ${speed}x speed`,
        });
      }

    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Audio generation failed",
        description: "There was an issue creating the audio. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      generateAudio();
    }
  };

  const handleVoiceChange = (value: string) => {
    const voice = availableVoices.find(v => v.voiceId === value);
    if (voice) {
      setSelectedVoice(voice);
      if (isPlaying) {
        stopSpeaking();
        setIsPlaying(false);
      }
    }
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      toast({
        title: "Speed updated",
        description: `Set to ${value[0]}x. Click play to apply.`,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Controls Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Play/Pause Button */}
        <Button 
          onClick={togglePlayback} 
          disabled={isLoading || !text || availableVoices.length === 0}
          className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700"
          size="sm"
        >
          {isPlaying ? (
            <>
              <Pause size={16} className="mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              {isLoading ? 'Loading...' : 'Listen'}
            </>
          )}
        </Button>

        {/* Voice Selector */}
        {availableVoices.length > 0 && (
          <Select value={selectedVoice?.voiceId} onValueChange={handleVoiceChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Voices</SelectLabel>
                {availableVoices.slice(0, 10).map((voice) => (
                  <SelectItem key={voice.voiceId} value={voice.voiceId} className="text-sm">
                    {voice.displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {/* Speed Control */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Gauge size={16} className="text-gray-600" />
          <span className="text-sm text-gray-600 whitespace-nowrap">Speed: {speed}x</span>
          <Slider
            value={[speed]}
            onValueChange={handleSpeedChange}
            min={0.5}
            max={2.0}
            step={0.1}
            className="flex-1"
          />
        </div>
      </div>

      {/* Status Indicator */}
      {isPlaying && (
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <Volume2 size={16} className="animate-pulse" />
          <span>Playing at {speed}x speed with {selectedVoice?.displayName}</span>
        </div>
      )}
    </div>
  );
};

export default AudioFeedback;
