import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Droplets,
  Plus,
  CheckCircle2,
  Clock,
  Volume2,
  ShieldCheck,
  TrendingUp,
  Settings,
  Sliders,
} from 'lucide-react';

interface HydrationScreenProps {
  onBack?: () => void;
}

export const HydrationScreen: React.FC<HydrationScreenProps> = ({ onBack }) => {
  const { sensor, logWaterIntake, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'hydration' | 'history' | 'settings'>('hydration');
  const [historyTab, setHistoryTab] = useState<'TODAY' | '7 DAYS' | '30 DAYS'>('TODAY');

  const [currentIntake, setCurrentIntake] = useState(sensor.waterIntakeTodayMl || 1300);
  const [justLogged, setJustLogged] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // Hydration Feature Settings
  const [hydroSettings, setHydroSettings] = useState({
    dailyTargetMl: 2000,
    reminderIntervalHours: 2,
    warmWaterPrompt: true,
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

  const percentage = Math.min(100, Math.round((currentIntake / hydroSettings.dailyTargetMl) * 100));

  const handleDrinkWater = (amount: number = 250) => {
    logWaterIntake(amount);
    setCurrentIntake((prev) => prev + amount);
    setJustLogged(true);
    speakText(
      language === 'ta'
        ? `தண்ணீர் அருந்தியது பதிவு செய்யப்பட்டது: ${amount} மில்லி.`
        : `Water intake recorded: ${amount} milliliters logged.`
    );
    setTimeout(() => setJustLogged(false), 3500);
  };

  const handleSpeakStatus = () => {
    speakText(
      language === 'ta'
        ? `நீரேற்ற நிலை ${percentage} சதவீதம். குடித்துள்ள அளவு ${currentIntake} மில்லி.`
        : `Hydration status: ${percentage} percent reached today (${currentIntake} of ${hydroSettings.dailyTargetMl} ml).`
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
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono">
                HYDRATION & FLUID INTAKE
              </h1>
              <p className="text-xs text-[#5F6B6D] font-medium">Daily Fluid Balance & Dehydration Prevention</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#FEF3E2] p-1 rounded-2xl border border-[#CFE8EA]">
            <button
              onClick={() => setActiveTab('hydration')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hydration'
                  ? 'bg-[#713F12] text-white shadow-xs'
                  : 'text-[#713F12] hover:bg-white/60'
              }`}
            >
              Water Tracker
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

      {activeTab === 'hydration' ? (
        <>
          {/* CENTER: LARGE ANIMATED WATER GAUGE & BOTTLE */}
          <div className="p-8 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              {/* Animated Water Flask */}
              <div className="relative w-24 h-56 bg-white rounded-3xl p-2 border-2 border-[#CFE8EA] shadow-inner flex flex-col justify-end items-center overflow-hidden">
                {/* Water Level Liquid */}
                <div
                  className="w-full bg-[#713F12]/80 rounded-2xl transition-all duration-700 relative overflow-hidden"
                  style={{ height: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              {/* Digits & Status */}
              <div className="text-left space-y-2">
                <span className="text-xs font-mono font-bold text-[#5F6B6D] tracking-wider uppercase block">
                  WATER CONSUMED TODAY
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-mono tracking-tight text-[#713F12]">
                    {currentIntake}
                  </span>
                  <span className="text-xl font-black text-[#5F6B6D]">/ {hydroSettings.dailyTargetMl} ml</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-sm font-black font-mono text-[#713F12] bg-white px-3 py-1 rounded-full border border-[#CFE8EA]">
                    {percentage}% TARGET REACHED
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white text-[#2F7D5A] font-bold border border-[#CFE8EA]">
                    ● Balanced
                  </span>
                </div>

                {/* Quick Log Buttons */}
                <div className="pt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDrinkWater(250)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#58310e] text-white text-xs font-black tracking-wide uppercase transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ 1 GLASS (250 ML)</span>
                  </button>
                  <button
                    onClick={() => handleDrinkWater(500)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#faebd4] text-[#713F12] border border-[#CFE8EA] text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ 500 ML BOTTLE</span>
                  </button>
                </div>
              </div>
            </div>

            {justLogged && (
              <div className="mt-4 p-3 rounded-2xl bg-white border border-[#2F7D5A] text-[#2F7D5A] text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Water intake successfully logged to ARAN cloud records!</span>
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'history' ? (
        /* HISTORY TAB */
        <div className="p-6 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#713F12]" />
              <h3 className="text-xs font-black tracking-wider uppercase text-[#713F12] font-mono">
                Hydration Log
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
              { time: '10:09 AM', amount: '250 ml', type: 'Warm water with medicine' },
              { time: '08:30 AM', amount: '250 ml', type: 'Post-breakfast water' },
              { time: '07:15 AM', amount: '300 ml', type: 'Morning waking hydration' },
              { time: 'Yesterday total', amount: '1,850 ml', type: '92% goal achieved' },
            ].map((entry, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#CFE8EA] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#5F6B6D]" />
                  <span className="font-mono text-[#5F6B6D]">{entry.time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-black text-[#713F12] text-sm">{entry.amount}</span>
                  <span className="text-[#5F6B6D]">{entry.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* HYDRATION SETTINGS TAB */
        <div className="bg-[#FEF3E2] border border-[#CFE8EA] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#713F12] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#713F12]" />
              Hydration Goals & Reminders
            </h2>
            <p className="text-xs text-[#5F6B6D] mt-1 font-medium">
              Configure daily fluid target, automated reminder frequency, and temperature recommendation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Daily Water Target
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#713F12]">
                  {hydroSettings.dailyTargetMl} ml
                </span>
              </div>
              <input
                type="range"
                min="1200"
                max="3000"
                step="100"
                value={hydroSettings.dailyTargetMl}
                onChange={(e) =>
                  setHydroSettings({ ...hydroSettings, dailyTargetMl: Number(e.target.value) })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <label className="text-xs font-bold text-[#713F12] uppercase font-mono block">
                Chime Reminder Interval
              </label>
              <div className="flex gap-2 pt-1">
                {[1, 1.5, 2, 3].map((hours) => (
                  <button
                    key={hours}
                    onClick={() =>
                      setHydroSettings({ ...hydroSettings, reminderIntervalHours: hours })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      hydroSettings.reminderIntervalHours === hours
                        ? 'bg-[#713F12] text-white border-[#713F12]'
                        : 'bg-[#FEF3E2] text-[#713F12] border-[#CFE8EA]'
                    }`}
                  >
                    Every {hours}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Hydration settings updated.');
                setActiveTab('hydration');
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
          Drinking warm water helps prevent blood pressure spikes and maintains healthy kidney filtration.
        </p>
      </div>
    </div>
  );
};
