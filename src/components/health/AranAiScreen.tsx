import React, { useState, useEffect, useRef } from 'react';
import { useAran } from '../../context/AranContext';
import { translations, availableLanguages } from '../../utils/translations';
import { Language } from '../../types/aran';
import {
  ArrowLeft,
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Droplets,
  Heart,
  ShieldAlert,
  RotateCw,
  Settings,
  Sliders,
  Check,
  Globe,
} from 'lucide-react';

interface AranAiScreenProps {
  onBack?: () => void;
}

export const AranAiScreen: React.FC<AranAiScreenProps> = ({ onBack }) => {
  const { speakText, language, setLanguage, messages, sendMessage, soundEnabled, setSoundEnabled } = useAran();
  const t = translations[language] || translations.en;
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // AI Assistant Feature Settings
  const [aiSettings, setAiSettings] = useState({
    speechSpeed: 'Normal',
    wakeWord: true,
    autoSpeakReplies: true,
    compassionateTone: true,
  });

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiState]);

  // Suggested bilingual quick phrases
  const quickPhrases = [
    { label: 'I am okay (Check-in)', text: "I'm okay. Check-in complete.", lang: 'en' },
    { label: 'Enakku thanni venum (Water)', text: 'Enakku thanni venum.', lang: 'tanglish' },
    { label: 'எனக்கு உதவி வேண்டும் (Help)', text: 'எனக்கு உதவி வேண்டும்.', lang: 'ta' },
    { label: 'மருந்து எப்போது எடுக்க வேண்டும்?', text: 'மருந்து எப்போது எடுக்க வேண்டும்?', lang: 'ta' },
    { label: 'What is my heart rate?', text: 'What is my current heart rate?', lang: 'en' },
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    sendMessage(query, 'senior');
    setInputText('');
    setAiState('thinking');

    setTimeout(() => {
      setAiState('speaking');
      let response = '';

      const lower = query.toLowerCase();
      if (lower.includes('thanni') || lower.includes('water')) {
        response =
          language === 'ta'
            ? 'நான் உங்கள் குடும்பத்தினருக்கு தண்ணீர் தேவை என்று தகவல் அனுப்பிவிட்டேன். மெதுவாக வெதுவெதுப்பான தண்ணீர் அருந்துங்கள்.'
            : 'Water request logged. Taking small sips of warm water helps keep your blood pressure stable.';
      } else if (lower.includes('marundhu') || lower.includes('medicine')) {
        response =
          language === 'ta'
            ? 'உங்கள் அடுத்த மருந்து இரவு 8:00 மணிக்கு (Atorvastatin) உள்ளது.'
            : 'Your next scheduled dose is at 8:00 PM tonight (Atorvastatin 10mg).';
      } else if (lower.includes('heart') || lower.includes('bpm')) {
        response =
          language === 'ta'
            ? 'உங்கள் இதய துடிப்பு இயல்பான 72 BPM அளவில் சீராக உள்ளது.'
            : 'Your live heart rate is 72 BPM, which is in your normal healthy baseline.';
      } else if (lower.includes('help') || lower.includes('udhavi')) {
        response =
          language === 'ta'
            ? 'கவலைப்பட வேண்டாம் அம்மா. உங்கள் மகள் கவிதாவிற்கு தகவல் அனுப்பியுள்ளேன்.'
            : "Do not worry. I have alerted your daughter Kavitha. She will call you right away.";
      } else {
        response =
          language === 'ta'
            ? `வணக்கம் அம்மா, நலமாக இருக்கிறீர்களா? உங்கள் ஆரோக்கியம் மற்றும் அறையின் வெப்பநிலை கண்காணிக்கப்படுகிறது.`
            : `Good day! I am here monitoring your vitals and comfort. How can I help you today?`;
      }

      sendMessage(response, 'aran');
      if (aiSettings.autoSpeakReplies) {
        speakText(response);
      }
      setTimeout(() => setAiState('idle'), 3000);
    }, 1200);
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setAiState('listening');

      // Browser Speech Recognition if supported
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // @ts-ignore
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'tanglish' ? 'ta-IN' : 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          setAiState('idle');
          handleSend(transcript);
        };
        recognition.onerror = () => {
          setIsListening(false);
          setAiState('idle');
        };
        recognition.start();
      } else {
        // Fallback simulation for browsers without Web Speech
        setTimeout(() => {
          const sample = language === 'ta' ? 'நான் நலமாக இருக்கிறேன்' : 'I am okay';
          setInputText(sample);
          setIsListening(false);
          setAiState('idle');
          handleSend(sample);
        }, 2500);
      }
    } else {
      setIsListening(false);
      setAiState('idle');
    }
  };

  return (
    <div className="rounded-3xl border border-[#263541] bg-[#0B1117] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 text-[#F5F7FA]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#D97706]" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#17232D] text-[#D97706] flex items-center justify-center border border-[#263541]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                TALK TO ARAN · AI COMPANION
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">Bilingual Speech, Check-ins & Emotional Reassurance</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-[#111A22] p-1 rounded-2xl border border-[#263541]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              Voice Companion
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Feature Settings</span>
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border border-[#263541] text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                : 'bg-[#17232D] text-[#A8B3BE]'
            }`}
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F5F7FA]" /> : <VolumeX className="w-4 h-4 text-[#A8B3BE]" />}
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Main Visualization: Animated Voice Orb and Speech Dialogue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Animated ARAN Avatar Orb */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-[#17232D] border border-[#263541] flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="relative my-4">
                {/* Outer pulsing rings */}
                <div
                  className={`w-36 h-36 rounded-full border-2 border-[#713F12]/60 flex items-center justify-center transition-all duration-700 ${
                    aiState === 'listening'
                      ? 'scale-110 border-[#D97706] animate-ping'
                      : aiState === 'speaking'
                      ? 'scale-105 border-[#22C55E] animate-pulse'
                      : ''
                  }`}
                />
                {/* Central Orb */}
                <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#111A22] border-2 border-[#713F12] flex items-center justify-center shadow-xl shadow-[#713F12]/30">
                  <Bot
                    className={`w-12 h-12 text-[#D97706] transition-all ${
                      aiState === 'listening'
                        ? 'animate-bounce'
                        : aiState === 'speaking'
                        ? 'animate-pulse'
                        : ''
                    }`}
                  />
                </div>
              </div>

              <span className="text-sm font-black font-mono uppercase tracking-wider text-[#F5F7FA] mt-2">
                {aiState === 'listening'
                  ? 'Listening to your voice...'
                  : aiState === 'thinking'
                  ? 'ARAN is thinking...'
                  : aiState === 'speaking'
                  ? 'ARAN speaking...'
                  : 'ARAN Ready'}
              </span>

              <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
                {language === 'ta'
                  ? 'தமிழ் அல்லது ஆங்கிலத்தில் பேசலாம்'
                  : 'Speak naturally in Tamil, English, or Tanglish'}
              </p>

              {/* Big Mic Button */}
              <button
                onClick={toggleMic}
                className={`mt-4 w-full py-3.5 px-4 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-[#A16207]/40 ${
                  isListening
                    ? 'bg-[#EF4444] text-white animate-pulse'
                    : 'bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] hover:scale-102'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'STOP LISTENING' : 'TAP TO SPEAK TO ARAN'}</span>
              </button>
            </div>

            {/* Right 2 cols: Chat History & Input */}
            <div className="lg:col-span-2 flex flex-col h-[420px] rounded-3xl bg-[#17232D] border border-[#263541] overflow-hidden">
              {/* Messages container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-[#263541]">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A8B3BE]">
                    <Sparkles className="w-10 h-10 text-[#D97706] mb-2" />
                    <p className="text-sm font-bold text-[#F5F7FA]">
                      "Good Morning, Lakshmi Amma. How are you feeling today?"
                    </p>
                    <span className="text-xs mt-1">
                      Tap the microphone or choose one of the quick suggestions below.
                    </span>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isUser = m.sender === 'senior';
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-[#713F12] text-[#F5F7FA] rounded-br-xs border border-[#A16207]/40 shadow-sm'
                              : 'bg-[#111A22] text-[#F5F7FA] border border-[#263541] rounded-bl-xs'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold block mb-1 text-[#A8B3BE]">
                            {isUser ? 'Lakshmi (Senior)' : 'ARAN Companion'}
                          </span>
                          <p className="font-medium">{m.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="p-2.5 bg-[#111A22] border-t border-[#263541] flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#263541]">
                {quickPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(phrase.text)}
                    className="px-3 py-1.5 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] text-xs font-semibold shrink-0 transition-all cursor-pointer"
                  >
                    {phrase.label}
                  </button>
                ))}
              </div>

              {/* Text Input Footer */}
              <div className="p-3 bg-[#111A22] border-t border-[#263541] flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={
                    language === 'ta'
                      ? 'ஏதேனும் கேளுங்கள்... (Type in Tamil or English)'
                      : 'Ask ARAN anything or type how you feel...'
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B1117] border border-[#263541] text-xs text-[#F5F7FA] placeholder-[#A8B3BE] focus:outline-none focus:border-[#A16207]"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2.5 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] border border-[#A16207]/40 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ======================================================== */
        /* ARAN AI FEATURE SETTINGS                                 */
        /* ======================================================== */
        <div className="space-y-6">
          <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D97706]" />
                ARAN AI Assistant Voice & Speech Settings
              </h2>
              <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
                Configure preferred interaction language, speech synthesis cadence, and automatic readouts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Language Preference */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Primary Companion Language
                </label>
                <p className="text-xs text-[#A8B3BE]">ARAN speaks and understands multiple Indian languages:</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code as Language)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                        language === l.code
                          ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                          : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {l.nativeName} ({l.code.toUpperCase()})
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Speech Speed */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Voice Speech Pace
                </label>
                <p className="text-xs text-[#A8B3BE]">Adjust voice cadence for senior hearing clarity:</p>
                <div className="flex gap-2 pt-1">
                  {['Gentle / Slow', 'Normal', 'Brisk'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setAiSettings({ ...aiSettings, speechSpeed: speed })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        aiSettings.speechSpeed === speed
                          ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                          : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Auto Speak Replies */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Auto-Speak All Responses
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Read out companion answers without needing to press audio</p>
                </div>
                <button
                  onClick={() =>
                    setAiSettings({
                      ...aiSettings,
                      autoSpeakReplies: !aiSettings.autoSpeakReplies,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    aiSettings.autoSpeakReplies ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      aiSettings.autoSpeakReplies ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Compassionate Tone */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Emotional Reassurance Guardrail
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Provide soothing, calming vocal affirmations</p>
                </div>
                <button
                  onClick={() =>
                    setAiSettings({
                      ...aiSettings,
                      compassionateTone: !aiSettings.compassionateTone,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    aiSettings.compassionateTone ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      aiSettings.compassionateTone ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  speakText('AI Assistant settings configured successfully.');
                  setActiveTab('chat');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-bold shadow-md shadow-[#713F12]/30 border border-[#A16207]/40 transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
