import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import { HealthScreenType, Language } from '../types/aran';
import { translations, availableLanguages } from '../utils/translations';
import { localizedData } from '../utils/localizedData';
import { LiveHeartEcgMonitor } from './health/LiveHeartEcgMonitor';
import { HealthWidgetsGrid } from './health/HealthWidgetsGrid';
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Moon,
  MapPin,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Mic,
  Sun,
  Utensils,
  Bot,
  Volume2,
  VolumeX,
  FileText,
  Globe,
  Radio,
  Users,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SeniorViewProps {
  onOpenChat: () => void;
  onOpenSos: () => void;
  onOpenReport?: () => void;
}

export const SeniorView: React.FC<SeniorViewProps> = ({
  onOpenChat,
  onOpenSos,
  onOpenReport,
}) => {
  const {
    senior,
    sensor,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    speakText,
    isSpeaking,
    setActiveHealthScreen,
  } = useAran();

  const t = translations[language] || translations.en;
  const bundle = localizedData[language] || localizedData.en;
  const sv = bundle.seniorView;

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isMorningCheckinCompleted, setIsMorningCheckinCompleted] = useState<boolean>(true);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleImOk = () => {
    setIsMorningCheckinCompleted(true);
    speakText(
      language === 'ta'
        ? 'மிக்க மகிழ்ச்சி அம்மா. உங்கள் உடல்நிலை இயல்பாக உள்ளதை கவிதாவுக்கு தெரிவித்துள்ளேன்.'
        : `Wonderful, ${senior.preferredName}. Check-in confirmed: All vitals normal. Have a peaceful day.`
    );
    showToast(sv.checkinSuccessToast);
  };

  const featureToggles: {
    id: HealthScreenType;
    label: string;
    icon: any;
    color: string;
  }[] = [
    { id: 'heart', label: 'Heart Rate', icon: Heart, color: 'text-[#D97706]' },
    { id: 'bp', label: 'Blood Pressure', icon: Activity, color: 'text-[#D97706]' },
    { id: 'temp', label: 'Temperature', icon: Thermometer, color: 'text-[#D97706]' },
    { id: 'spo2', label: 'SpO₂ Oxygen', icon: Wind, color: 'text-[#D97706]' },
    { id: 'activity', label: 'Activity', icon: Activity, color: 'text-[#22C55E]' },
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: 'text-[#D97706]' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-[#A8B3BE]' },
    { id: 'location', label: 'Location', icon: MapPin, color: 'text-[#A16207]' },
    { id: 'medication', label: 'Medication', icon: Pill, color: 'text-[#D97706]' },
    { id: 'meals', label: 'Meals', icon: Utensils, color: 'text-[#D97706]' },
    { id: 'ai-talk', label: 'Talk to ARAN', icon: Bot, color: 'text-[#D97706]' },
    { id: 'care-network', label: 'Care Network', icon: Users, color: 'text-[#713F12]' },
    { id: 'checkin', label: 'Check-in', icon: CheckCircle2, color: 'text-[#22C55E]' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, color: 'text-[#F59E0B]' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-[#A8B3BE]' },
    { id: 'device', label: 'Device Hub', icon: Radio, color: 'text-[#A8B3BE]' },
  ];

  return (
    <div className="min-h-full pb-16 text-[#F5F7FA]">
      {/* Top Senior Companion Header Bar */}
      <div className="bg-[#111A22] border-b border-[#263541] px-6 py-4 shadow-lg rounded-3xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/ARAN.png"
              alt="ARAN Logo"
              className="w-12 h-12 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] p-0.5 shadow-md shadow-black/40 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#F5F7FA]">ARAN</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#17232D] text-[#22C55E] font-bold border border-[#263541]">
                  {sensor.isConnected ? '● Connected' : '○ Offline'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#17232D] text-[#D97706] font-bold border border-[#263541] hidden sm:inline-block">
                  BP: {sensor.bloodPressureRate}
                </span>
              </div>
              <p className="text-xs text-[#A8B3BE] font-medium">{t.tagline}</p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-2">
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] text-xs font-bold border border-[#263541] transition-all cursor-pointer"
                title={t.patientReport}
              >
                <FileText className="w-4 h-4 text-[#D97706]" />
                <span className="hidden sm:inline">{sv.doctorReportBtn}</span>
              </button>
            )}

            {/* Language Switch Dropdown */}
            <div className="flex items-center bg-[#17232D] border border-[#263541] px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#F5F7FA]">
              <Globe className="w-3.5 h-3.5 text-[#A8B3BE] mr-1 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-[#F5F7FA] font-bold focus:outline-none cursor-pointer"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#111A22] text-[#F5F7FA]">
                    {lang.nativeName} ({lang.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Voice Speech Assistant"
              className={`p-2 rounded-xl border border-[#263541] transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                  : 'bg-[#17232D] text-[#A8B3BE]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F5F7FA]" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Senior Screen Container */}
      <div className="space-y-6">
        {/* ======================================================== */}
        {/* FEATURE TOGGLE BAR                                       */}
        {/* ======================================================== */}
        <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-live-dot" />
              <h2 className="text-xs font-black tracking-wider uppercase text-[#F5F7FA] font-mono">
                TELEMETRY & FEATURE SCREENS
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#A8B3BE]">
              Tap toggle to open dedicated controls
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {featureToggles.map((f) => {
              const IconComp = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveHealthScreen(f.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111A22] hover:bg-[#713F12] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] hover:border-[#A16207] text-xs font-bold transition-all cursor-pointer hover:scale-105 shadow-sm"
                >
                  <IconComp className={`w-3.5 h-3.5 ${f.color}`} />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating feedback message toast */}
        {feedbackToast && (
          <div
            className="p-4 rounded-2xl text-white font-bold text-base sm:text-lg shadow-xl flex items-center justify-between animate-bounce"
            style={{ backgroundColor: '#22C55E' }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-white shrink-0" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-white/80 hover:text-white text-sm font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Big Greeting Card */}
        <div className="p-6 sm:p-7 rounded-3xl border border-[#263541] bg-[#17232D] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#D97706] font-bold text-sm tracking-wide uppercase mb-1 font-mono">
                <Sun className="w-4 h-4 text-[#D97706]" />
                <span>ARAN · {sv.goodMorningGreeting}, {senior.preferredName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] leading-tight">
                {sv.howAreYouFeeling}
              </h1>
              <p className="text-sm text-[#A8B3BE] mt-1 font-medium">
                {sv.monitoringComfortDesc}
              </p>
            </div>

            {/* Speaking animation badge */}
            {isSpeaking && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#111A22] border border-[#A16207] rounded-full text-[#D97706] text-xs font-bold animate-pulse font-mono">
                <Volume2 className="w-4 h-4" />
                <span>ARAN Speaking...</span>
              </div>
            )}
          </div>

          {/* Current Check-in Status Banner */}
          <div
            onClick={() => setActiveHealthScreen('checkin')}
            className="mt-6 p-4 rounded-2xl bg-[#111A22] border border-[#263541] hover:border-[#A16207] flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-all"
            title="Open Morning Check-in Screen"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: isMorningCheckinCompleted ? '#22C55E' : '#F59E0B' }}
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A8B3BE] font-mono">
                  {sv.morningCheckinTitle}
                </span>
                <p className="text-sm font-bold text-[#F5F7FA]">
                  {isMorningCheckinCompleted ? sv.checkinCompletedBadge : sv.checkinDueBadge}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#D97706]">
              <span>Change Screen to Check-in →</span>
            </div>
          </div>
        </div>

        {/* 4 PRIMARY LARGE ACCESSIBILITY BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. I'M OK (Normal Status Green #22C55E) */}
          <button
            onClick={handleImOk}
            className="min-h-[96px] p-5 rounded-3xl flex items-center gap-4 transition-all shadow-lg active:scale-98 cursor-pointer text-white hover:opacity-95 bg-[#22C55E] border border-emerald-400/40"
          >
            <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black tracking-wide leading-tight">
                {t.imOk}
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                {sv.imOkSubtitle}
              </span>
            </div>
          </button>

          {/* 2. NEED HELP (Attention Highlight #A16207) */}
          <button
            onClick={() => setActiveHealthScreen('care-network')}
            className="min-h-[96px] p-5 rounded-3xl flex items-center gap-4 transition-all shadow-lg active:scale-98 cursor-pointer text-white hover:opacity-95 bg-[#A16207] border border-amber-500/40"
          >
            <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black tracking-wide leading-tight">
                {t.needHelp}
              </span>
              <span className="text-xs text-amber-100 font-medium">
                Open Adaptive Care Network →
              </span>
            </div>
          </button>

          {/* 3. TALK TO ARAN (Primary ARAN Accent #713F12) */}
          <button
            onClick={() => {
              setActiveHealthScreen('ai-talk');
              onOpenChat();
            }}
            className="min-h-[96px] p-5 rounded-3xl flex items-center gap-4 transition-all shadow-lg active:scale-98 cursor-pointer text-white hover:opacity-95 bg-[#713F12] border border-[#A16207]/60"
          >
            <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black tracking-wide leading-tight">
                {t.talkToAran}
              </span>
              <span className="text-xs text-orange-100 font-medium">
                Open AI Voice Screen →
              </span>
            </div>
          </button>

          {/* 4. SOS EMERGENCY (High Priority Red #EF4444) */}
          <button
            onClick={() => {
              onOpenSos();
              setActiveHealthScreen('sos');
            }}
            className="min-h-[96px] p-5 rounded-3xl flex items-center gap-4 transition-all shadow-xl active:scale-98 cursor-pointer text-white border-2 border-red-400 bg-[#EF4444] hover:bg-red-600"
          >
            <div className="w-13 h-13 rounded-2xl bg-white/25 flex items-center justify-center shrink-0 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black tracking-wide leading-tight">
                {t.sos}
              </span>
              <span className="text-xs text-red-100 font-medium">
                Open Emergency Escalation →
              </span>
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* MAIN HEART MONITOR (DARK CARD: #17232D, BORDER #263541)  */}
        {/* Animated heart #D97706, 72 BPM #F5F7FA, NORMAL #22C55E   */}
        {/* LIVE ECG continuously moving right to left in #D97706    */}
        {/* ======================================================== */}
        <LiveHeartEcgMonitor
          initialBpm={sensor.heartRate || 72}
          onOpenHeartScreen={() => setActiveHealthScreen('heart')}
          showDetails={true}
        />

        {/* ======================================================== */}
        {/* HEALTH WIDGETS GRID: DARK CARDS (#17232D, BORDER #263541)*/}
        {/* Heart Rate, Temperature, SpO2, Blood Pressure, Activity  */}
        {/* ======================================================== */}
        <HealthWidgetsGrid
          onSelectFeature={(feat) => setActiveHealthScreen(feat)}
        />
      </div>
    </div>
  );
};
