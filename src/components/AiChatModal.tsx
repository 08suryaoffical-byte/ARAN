import React, { useState, useRef, useEffect } from 'react';
import { useAran } from '../context/AranContext';
import { translations, availableLanguages } from '../utils/translations';
import { Language } from '../types/aran';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Heart,
} from 'lucide-react';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose }) => {
  const {
    messages,
    sendMessage,
    senior,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
  } = useAran();

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = translations[language] || translations.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListen = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);

    // Support Web Speech API for Tamil / English dictation
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: mock listening prompt for demo environment
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const demoTranscripts: Record<string, string> = {
          ta: 'எனக்கு கொஞ்சம் தண்ணீர் வேண்டும்',
          tanglish: 'Enakku thanni venum',
          en: 'I need some water please',
          hi: 'मुझे थोड़ा पानी चाहिए',
        };
        const transcript = demoTranscripts[language] || 'I am doing well today';
        setInputText(transcript);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Locale mapping
      const localeMap: Record<Language, string> = {
        ta: 'ta-IN',
        tanglish: 'ta-IN',
        en: 'en-IN',
        hi: 'hi-IN',
        ml: 'ml-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        gu: 'gu-IN',
        fr: 'fr-FR',
      };
      recognition.lang = localeMap[language] || 'ta-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setSpeechError(`Microphone audio: ${event.error}.`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error(err);
      setIsListening(false);
      setSpeechError('Microphone permission required for speech.');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), 'senior');
    setInputText('');
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText, 'senior');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#17232D] w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-[#263541] text-[#F5F7FA]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#263541] flex items-center justify-between bg-[#111A22] text-[#F5F7FA]">
          <div className="flex items-center gap-3">
            <img
              src="/ARAN.png"
              alt="ARAN Logo"
              className="w-10 h-10 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] p-0.5 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-[#F5F7FA]">ARAN AI Companion</h3>
                <span className="text-[10px] bg-[#713F12]/40 text-[#D97706] border border-[#A16207]/40 px-2 py-0.5 rounded font-mono font-bold">
                  Every Heartbeat Deserves Safety
                </span>
              </div>
              <p className="text-xs text-[#A8B3BE]">
                Speaking with Lakshmi Amma · {language === 'ta' ? 'தமிழ் ஆதரவு' : 'English / Tanglish'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled ? 'bg-[#713F12] border-[#A16207] text-[#F5F7FA]' : 'bg-[#17232D] border-[#263541] text-[#A8B3BE]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick prompt chips based on selected language */}
        {(() => {
          const quickChipsByLang: Record<string, { label: string; text: string }[]> = {
            ta: [
              { label: '💧 "எனக்கு தண்ணீர் வேண்டும்"', text: 'எனக்கு தண்ணீர் வேண்டும்' },
              { label: '✓ "நான் நலமாக உள்ளேன்"', text: 'நான் நலமாக உள்ளேன்' },
              { label: '❓ "எனக்கு உதவி வேண்டும்"', text: 'எனக்கு உதவி வேண்டும்' },
              { label: '📞 "மகளிடம் பேச வேண்டும்"', text: 'மகள் கவிதாவிடம் பேச வேண்டும்' },
            ],
            hi: [
              { label: '💧 "मुझे पानी चाहिए"', text: 'मुझे पानी चाहिए' },
              { label: '✓ "मैं ठीक हूँ"', text: 'मैं ठीक हूँ' },
              { label: '❓ "मुझे मदद चाहिए"', text: 'मुझे मदद चाहिए' },
              { label: '📞 "बेटी से बात करनी है"', text: 'बेटी कविता से बात करनी है' },
            ],
            tanglish: [
              { label: '💧 "Enakku thanni venum"', text: 'Enakku thanni venum' },
              { label: '✓ "Naan nalla irukken"', text: 'Naan nalla irukken' },
              { label: '❓ "Enakku udhavi venum"', text: 'Enakku udhavi venum' },
              { label: '📞 "Kavitha kitta pesanum"', text: 'Kavitha kitta pesanum' },
            ],
            en: [
              { label: '💧 "I need a glass of water"', text: 'I need a glass of water' },
              { label: '✓ "I am feeling good today"', text: 'I am feeling good today' },
              { label: '❓ "What medicines are next?"', text: 'What medicines are scheduled next?' },
              { label: '📞 "Call daughter Kavitha"', text: 'Please call my daughter Kavitha' },
            ],
          };

          const chips = quickChipsByLang[language] || quickChipsByLang.en;

          return (
            <div className="px-6 py-2.5 bg-[#111A22] border-b border-[#263541] flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#263541]">
              <span className="text-[11px] font-bold text-[#A8B3BE] self-center shrink-0">
                Quick:
              </span>
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(chip.text)}
                  className="px-3 py-1 rounded-full bg-[#17232D] hover:bg-[#263541] text-xs font-semibold text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] shrink-0 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          );
        })()}

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0B1117] scrollbar-thin scrollbar-thumb-[#263541]">
          {messages.map((msg) => {
            const isAran = msg.sender === 'aran';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAran ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
              >
                {isAran && (
                  <div className="w-8 h-8 rounded-xl bg-[#713F12] border border-[#A16207]/40 text-[#F5F7FA] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    A
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm font-medium shadow-sm leading-relaxed ${
                    isAran
                      ? 'bg-[#17232D] border border-[#263541] text-[#F5F7FA] rounded-tl-none'
                      : 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 rounded-tr-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-white/10 text-[10px] text-[#A8B3BE]">
                    <span>{isAran ? 'ARAN Companion' : senior.name}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
                {!isAran && (
                  <div className="w-8 h-8 rounded-xl bg-[#111A22] border border-[#263541] text-[#F5F7FA] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {senior.name[0]}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Speech error toast */}
        {speechError && (
          <div className="px-6 py-2 bg-[#713F12]/20 border-t border-[#A16207] text-[#D97706] text-xs">
            {speechError}
          </div>
        )}

        {/* Input Footer */}
        <div className="p-4 bg-[#111A22] border-t border-[#263541]">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListen}
              className={`p-3 rounded-2xl transition-all shadow-sm cursor-pointer ${
                isListening
                  ? 'bg-[#EF4444] text-white animate-pulse'
                  : 'bg-[#17232D] hover:bg-[#263541] text-[#D97706] border border-[#263541]'
              }`}
              title="Hold to speak in Tamil or English"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : 'Type in English, தமிழ் or Tanglish (e.g. Enakku thanni venum)...'
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-[#263541] text-xs sm:text-sm focus:outline-[#A16207] bg-[#0B1117] text-[#F5F7FA] placeholder-[#A8B3BE]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#713F12] hover:bg-[#A16207] disabled:opacity-40 text-[#F5F7FA] shadow-md border border-[#A16207]/40 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-2 text-center text-[11px] text-[#A8B3BE]">
            ARAN Companion is safe, respectful, and not a medical diagnostic substitute.
          </div>
        </div>
      </div>
    </div>
  );
};
