import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Moon,
  Clock,
  CheckCircle2,
  TrendingUp,
  Volume2,
  ShieldCheck,
  Settings,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface SleepScreenProps {
  onBack?: () => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({ onBack }) => {
  const { speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'sleep' | 'history' | 'settings'>('sleep');
  const [historyTab, setHistoryTab] = useState<'LAST NIGHT' | '7 DAYS' | '30 DAYS'>('LAST NIGHT');

  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(20);
  const [deepSleep, setDeepSleep] = useState('2h 15m');
  const [remSleep, setRemSleep] = useState('1h 45m');
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // Sleep Feature Settings
  const [sleepSettings, setSleepSettings] = useState({
    targetHours: 7.5,
    bedtimeReminder: '10:00 PM',
    wakeUpAlarm: '06:30 AM',
    disturbanceAlert: true,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSpeakStatus = () => {
    speakText(
      language === 'ta'
        ? `நேற்றைய தூக்கம் ${hours} மணி நேரம் ${minutes} நிமிடங்கள். ஆழ்ந்த தூக்கம் ${deepSleep}. அமைதியான தூக்க சுழற்சி.`
        : `Last night's sleep duration was ${hours} hours and ${minutes} minutes, with ${deepSleep} of deep restorative sleep.`
    );
  };

  return (
    <div className="rounded-3xl border border-[#CFE8EA] bg-[#FFFFFF] shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 text-[#713F12]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#CFE8EA] pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-[#FEF3E2] hover:bg-[#faebd4] text-[#713F12] border border-[#CFE8EA] transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3E2] text-[#713F12] flex items-center justify-center border border-[#CFE8EA]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono">
                SLEEP & RESTORATIVE RECOVERY
              </h1>
              <p className="text-xs text-[#5F6B6D] font-medium">Nighttime Hypnogram & Sleep Architecture</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#FEF3E2] p-1 rounded-2xl border border-[#CFE8EA]">
            <button
              onClick={() => setActiveTab('sleep')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sleep'
                  ? 'bg-[#713F12] text-white shadow-xs'
                  : 'text-[#713F12] hover:bg-white/60'
              }`}
            >
              Sleep Architecture
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#713F12] text-white shadow-xs'
                  : 'text-[#713F12] hover:bg-white/60'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#713F12] text-white shadow-xs'
                  : 'text-[#713F12] hover:bg-white/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Feature Settings</span>
            </button>
          </div>

          <button
            onClick={handleSpeakStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF3E2] text-[#713F12] border border-[#CFE8EA] text-xs font-bold transition-all cursor-pointer hover:bg-[#faebd4]"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>

      {activeTab === 'sleep' ? (
        <>
          {/* CENTER: ANIMATED SLEEP VISUALIZATION & DURATION */}
          <div className="p-8 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Concentric Night Ring */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="106"
                  stroke="#CFE8EA"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="106"
                  stroke="#713F12"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 106}
                  strokeDashoffset={2 * Math.PI * 106 * (1 - 7.33 / 8)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Moon className="w-7 h-7 text-[#713F12] mb-1" />
                <span className="text-xs font-mono font-bold text-[#5F6B6D] tracking-widest uppercase">
                  SLEEP DURATION
                </span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-5xl font-black font-mono tracking-tight text-[#713F12]">
                    {hours}
                  </span>
                  <span className="text-xl font-black text-[#5F6B6D]">h</span>
                  <span className="text-4xl font-black font-mono tracking-tight text-[#713F12] ml-1">
                    {minutes}
                  </span>
                  <span className="text-xl font-black text-[#5F6B6D]">m</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#2F7D5A]">
                  ● 92% Sleep Quality
                </span>
              </div>
            </div>

            {/* Stages Row */}
            <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-sm">
              <div className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] text-center">
                <span className="text-[11px] text-[#5F6B6D] font-bold uppercase font-mono block mb-1">
                  Deep Restorative
                </span>
                <span className="text-2xl font-black font-mono text-[#713F12]">
                  {deepSleep}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] text-center">
                <span className="text-[11px] text-[#5F6B6D] font-bold uppercase font-mono block mb-1">
                  REM Dreaming
                </span>
                <span className="text-2xl font-black font-mono text-[#713F12]">
                  {remSleep}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'history' ? (
        /* HISTORY TAB */
        <div className="p-6 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#713F12]" />
              <h3 className="text-xs font-black tracking-wider uppercase text-[#713F12] font-mono">
                Sleep Trend History
              </h3>
            </div>

            <div className="flex items-center bg-white p-1 rounded-xl border border-[#CFE8EA]">
              {(['LAST NIGHT', '7 DAYS', '30 DAYS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHistoryTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyTab === tab
                      ? 'bg-[#713F12] text-white shadow-xs'
                      : 'text-[#713F12] hover:bg-[#FEF3E2]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {[
              { night: 'Last Night', total: '7h 20m', deep: '2h 15m', quality: 'Excellent' },
              { night: 'Thursday', total: '7h 45m', deep: '2h 30m', quality: 'Excellent' },
              { night: 'Wednesday', total: '6h 50m', deep: '1h 50m', quality: 'Good' },
              { night: 'Tuesday', total: '8h 05m', deep: '2h 40m', quality: 'Excellent' },
            ].map((entry, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] flex items-center justify-between text-xs"
              >
                <span className="font-bold text-[#713F12]">{entry.night}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-black text-[#713F12] text-sm">{entry.total}</span>
                  <span className="text-[#5F6B6D]">Deep: {entry.deep}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#2F7D5A] font-bold border border-[#CFE8EA]">
                    {entry.quality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SLEEP SETTINGS TAB */
        <div className="bg-[#FEF3E2] border border-[#CFE8EA] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#713F12] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#713F12]" />
              Sleep Targets & Bedtime Schedule
            </h2>
            <p className="text-xs text-[#5F6B6D] mt-1 font-medium">
              Configure nighttime target sleep duration, gentle bedtime reminders, and nocturnal disturbance monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Nightly Target Duration
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#713F12]">
                  {sleepSettings.targetHours} hours
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="9"
                step="0.5"
                value={sleepSettings.targetHours}
                onChange={(e) =>
                  setSleepSettings({ ...sleepSettings, targetHours: Number(e.target.value) })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono block">
                  Nocturnal Restlessness Alert
                </span>
                <p className="text-xs text-[#5F6B6D]">Notify caregiver if out of bed for &gt;20 mins at night</p>
              </div>
              <button
                onClick={() =>
                  setSleepSettings({
                    ...sleepSettings,
                    disturbanceAlert: !sleepSettings.disturbanceAlert,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  sleepSettings.disturbanceAlert ? 'bg-[#2F7D5A]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                    sleepSettings.disturbanceAlert ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Sleep settings updated.');
                setActiveTab('sleep');
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#58310e] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-[#FEF3E2] border border-[#CFE8EA] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2F7D5A] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5F6B6D]">
          Consistently regular sleep schedules protect cognitive sharpness and cardiovascular health in seniors.
        </p>
      </div>
    </div>
  );
};
