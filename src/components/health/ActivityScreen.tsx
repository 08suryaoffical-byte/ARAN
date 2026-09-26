import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Footprints,
  Activity,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  TrendingUp,
  Settings,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface ActivityScreenProps {
  onBack?: () => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ onBack }) => {
  const { sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'activity' | 'history' | 'settings'>('activity');
  const [historyTab, setHistoryTab] = useState<'TODAY' | '7 DAYS' | '30 DAYS'>('TODAY');

  const [steps, setSteps] = useState(sensor.stepsToday || 4238);
  const [activeMinutes, setActiveMinutes] = useState(38);
  const [calories, setCalories] = useState(182);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // Activity Feature Settings
  const [actSettings, setActSettings] = useState({
    dailyStepGoal: 5000,
    sedentaryAlertMinutes: 45,
    fallDetectionSensitivity: 'High (Elderly Safety)',
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
        ? `இன்றைய நடை ${steps} அடிகள். சுறுசுறுப்பான நேரம் ${activeMinutes} நிமிடங்கள்.`
        : `Today's activity: ${steps} steps, ${activeMinutes} active minutes, and ${calories} active calories burned.`
    );
  };

  const progressPercent = Math.min(100, Math.round((steps / actSettings.dailyStepGoal) * 100));

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
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3E2] text-[#2F7D5A] flex items-center justify-center border border-[#CFE8EA]">
              <span className="text-xl">🏃</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono">
                ACTIVITY & MOVEMENT MONITOR
              </h1>
              <p className="text-xs text-[#5F6B6D] font-medium">6-Axis Inertial Pedometer & Motion Guard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#FEF3E2] p-1 rounded-2xl border border-[#CFE8EA]">
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-[#713F12] text-white shadow-xs'
                  : 'text-[#713F12] hover:bg-white/60'
              }`}
            >
              Daily Activity
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

      {activeTab === 'activity' ? (
        <>
          {/* CENTER: ANIMATED ACTIVITY VISUALIZATION */}
          <div className="p-8 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Circular Step Ring */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
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
                  stroke="#2F7D5A"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 106}
                  strokeDashoffset={2 * Math.PI * 106 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Footprints className="w-6 h-6 text-[#2F7D5A] mb-1" />
                <span className="text-xs font-mono font-bold text-[#5F6B6D] tracking-widest uppercase">
                  DAILY STEPS
                </span>
                <span className="text-5xl font-black font-mono tracking-tight text-[#713F12] my-1">
                  {steps.toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-[#2F7D5A]">
                  Goal: {actSettings.dailyStepGoal.toLocaleString()} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Metrics Row: Calories, Active Minutes */}
            <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-sm">
              <div className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#5F6B6D] font-bold uppercase font-mono mb-1">
                  <Flame className="w-3.5 h-3.5 text-[#C58A00]" />
                  <span>Calories</span>
                </div>
                <span className="text-2xl font-black font-mono text-[#713F12]">
                  {calories} <span className="text-xs font-normal text-[#5F6B6D]">kcal</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#5F6B6D] font-bold uppercase font-mono mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#2F7D5A]" />
                  <span>Active Time</span>
                </div>
                <span className="text-2xl font-black font-mono text-[#713F12]">
                  {activeMinutes} <span className="text-xs font-normal text-[#5F6B6D]">min</span>
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
                Activity & Mobility Log
              </h3>
            </div>

            <div className="flex items-center bg-white p-1 rounded-xl border border-[#CFE8EA]">
              {(['TODAY', '7 DAYS', '30 DAYS'] as const).map((tab) => (
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
              { day: 'Today', steps: 4238, active: '38 min', cal: '182 kcal' },
              { day: 'Yesterday', steps: 4890, active: '44 min', cal: '210 kcal' },
              { day: '2 days ago', steps: 3950, active: '32 min', cal: '168 kcal' },
              { day: '3 days ago', steps: 5120, active: '50 min', cal: '225 kcal' },
            ].map((entry, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] flex items-center justify-between text-xs"
              >
                <span className="font-bold text-[#713F12]">{entry.day}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-black text-[#713F12] text-sm">
                    {entry.steps.toLocaleString()} steps
                  </span>
                  <span className="font-mono text-[#5F6B6D]">{entry.active}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#2F7D5A] font-bold border border-[#CFE8EA]">
                    {entry.cal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVITY SETTINGS TAB */
        <div className="bg-[#FEF3E2] border border-[#CFE8EA] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#713F12] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#713F12]" />
              Activity Goals & Inactivity Safety Rules
            </h2>
            <p className="text-xs text-[#5F6B6D] mt-1 font-medium">
              Configure daily senior step target, sedentary reminder timer, and fall detection sensitivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Daily Step Goal
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#713F12]">
                  {actSettings.dailyStepGoal} steps
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="8000"
                step="500"
                value={actSettings.dailyStepGoal}
                onChange={(e) =>
                  setActSettings({ ...actSettings, dailyStepGoal: Number(e.target.value) })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <label className="text-xs font-bold text-[#713F12] uppercase font-mono block">
                Sedentary Prompt Interval
              </label>
              <div className="flex gap-2 pt-1">
                {[30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() =>
                      setActSettings({ ...actSettings, sedentaryAlertMinutes: mins })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      actSettings.sedentaryAlertMinutes === mins
                        ? 'bg-[#713F12] text-white border-[#713F12]'
                        : 'bg-[#FEF3E2] text-[#713F12] border-[#CFE8EA]'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Activity settings updated.');
                setActiveTab('activity');
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
          Gentle daily walking maintains joint mobility and cardiac health without strain.
        </p>
      </div>
    </div>
  );
};
