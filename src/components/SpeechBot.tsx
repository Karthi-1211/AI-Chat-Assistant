import React, { useState, useEffect, useRef } from 'react';
import MicButton from './MicButton';
import MessageBubble from './MessageBubble';
import { toast } from 'sonner';
import { Volume2, Volume1, VolumeX, Sparkles, Send, Loader2, AlertTriangle, StopCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateGeminiResponse } from '@/utils/geminiAPI';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  error?: boolean;
}

const SpeechBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI assistant. What would you like to talk about today?", isUser: false }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const [inputText, setInputText] = useState('');
  const [showApiError, setShowApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const nextId = useRef(2);
  const isMobile = useIsMobile();
  const lastRequestTime = useRef<number>(0);
  const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log("Speech recognized:", transcript);
        
        if (transcript) {
          handleUserMessage(transcript);
        } else {
          toast.error('No speech detected. Please try again.');
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = `Speech recognition error: ${event.error}`;
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak clearly.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Microphone not found or access denied.';
        }
        toast.error(errorMessage);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setIsRecording(false);
      };
    } else {
      toast.error('Speech recognition is not supported in your browser. Try Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      console.log("Stopped recording");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        console.log("Started recording");
        toast.success('Listening... Speak now');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start speech recognition. Check microphone permissions.');
        setIsRecording(false);
      }
    }
  };

  const handleUserMessage = async (text: string) => {
    console.log("Handling user message:", text);
    
    if (!text.trim()) {
      console.log("Empty message, ignoring");
      return;
    }

    // Prevent rapid API calls
    const now = Date.now();
    if (now - lastRequestTime.current < MIN_REQUEST_INTERVAL) {
      toast.error('Please wait a moment before sending another message.');
      console.log("Rate limit: Too many requests");
      return;
    }
    lastRequestTime.current = now;

    const userMessage = {
      id: nextId.current++,
      text,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowApiError(false);
    
    setIsLoading(true);
    
    try {
      const response = await generateGeminiResponse(text);
      console.log("Gemini response:", response);
      
      if (response.error) {
        setApiErrorMessage(response.error.includes('API key') 
          ? 'Invalid Gemini API key. Please check the configuration.'
          : `Error from Gemini: ${response.error}`);
        setShowApiError(true);
        toast.error(`Error: ${response.error}`);
      }
      
      const botMessage = {
        id: nextId.current++,
        text: response.text,
        isUser: false,
        error: !!response.error
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (volume > 0 && !response.error) {
        console.log("Speaking response:", response.text);
        speakResponse(response.text);
      }
    } catch (error) {
      console.error("Error in handleUserMessage:", error);
      const errorMessageText = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to get a response: ${errorMessageText}`);
      
      const errorMessage = {
        id: nextId.current++,
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Ensure any previous speech is cancelled
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Google') || 
        voice.name.includes('Samantha')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log("Using voice:", preferredVoice.name);
      } else {
        console.log("No preferred voice found, using default");
      }
      
      utterance.volume = volume;
      utterance.rate = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        console.log("Started speaking, volume:", volume);
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log("Finished speaking");
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        toast.error('Failed to speak response.');
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
      toast.error('Text-to-speech not supported in your browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking || isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        toast.info('Speech stopped');
        console.log("Speech stopped by user");
      } else {
        console.log("No speech to stop");
      }
    } else {
      console.error("Speech synthesis not supported");
      toast.error('Text-to-speech not supported in your browser.');
    }
  };

  const clearChat = () => {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      console.log("Speech stopped due to chat clear");
    }
    // Reset chatbot state
    setMessages([
      { id: 1, text: "Hello! I'm your AI assistant. What would you like to talk about today?", isUser: false }
    ]);
    setInputText('');
    setVolume(1); // Reset volume to full
    setIsRecording(false);
    setIsLoading(false);
    setShowApiError(false);
    setApiErrorMessage('');
    nextId.current = 2;
    toast.info('Chat cleared and reset');
    console.log("Chat cleared and reset");
  };

  const toggleVolume = () => {
    let newVolume: number;
    if (volume === 1) {
      newVolume = 0.5;
      toast.info("Voice volume set to 50%");
    } else if (volume === 0.5) {
      newVolume = 0;
      toast.info("Voice output muted");
      // Stop speech when muted
      if ('speechSynthesis' in window && (window.speechSynthesis.speaking || isSpeaking)) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        console.log("Speech stopped due to mute");
      }
    } else {
      newVolume = 1;
      toast.info("Voice output enabled");
    }
    
    setVolume(newVolume);
    console.log("Volume changed to:", newVolume);
    
    // Apply new volume to ongoing speech (if not muted)
    if (newVolume > 0 && isSpeaking && currentUtteranceRef.current && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current.volume = newVolume;
      window.speechSynthesis.speak(currentUtteranceRef.current);
      console.log("Reapplied volume to current utterance:", newVolume);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume === 0.5) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
    }
  };

  // Initialize voices for speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Loaded voices:", voices.map(v => v.name));
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    } else {
      console.error("Speech synthesis not supported");
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-indigo-600 to-violet-500 text-white mb-2 md:mb-4 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-xl md:text-2xl font-bold">AI Chat Assistant</h1>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="text-xs md:text-sm bg-white/20 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
            AI Chat Application
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleVolume}
            className="text-white hover:bg-white/20"
            aria-label="Toggle volume"
          >
            {getVolumeIcon()}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={stopSpeaking}
            className="text-white hover:bg-white/20"
            aria-label="Stop speaking"
          >
            <StopCircle className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearChat}
            className="text-white hover:bg-white/20"
            aria-label="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {showApiError && (
        <Alert variant="destructive" className="mb-3 mx-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm ml-2">
            {apiErrorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 overflow-y-auto px-3 md:px-4 space-y-3 md:space-y-4 pb-3 md:pb-4">
        <div className="space-y-3 md:space-y-4">
          {messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message.text} 
              isUser={message.isUser} 
              isAnimating={!message.isUser && isSpeaking && message.id === messages[messages.length - 1].id}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center py-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="px-3 md:px-4 pt-2 pb-3 md:pb-4">
        <Card className="border-0 shadow-lg bg-gray-50">
          <CardContent className="p-2 md:p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 py-2 px-3 bg-white rounded-lg border focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={!inputText.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
              <MicButton 
                isRecording={isRecording} 
                onClick={toggleRecording} 
                disabled={isLoading} 
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechBot;