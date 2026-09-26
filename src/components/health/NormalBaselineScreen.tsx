import React from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Thermometer,
  Activity,
  Wind,
  Droplets,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface NormalBaselineScreenProps {
  onBack: () => void;
  onOpenParam: (param: string) => void;
}

export const NormalBaselineScreen: React.FC<NormalBaselineScreenProps> = ({ onBack, onOpenParam }) => {
  const { sensor, senior, language } = useAran();
  const t = translations[language] || translations.en;
  const pulseDuration = (60 / sensor.heartRate).toFixed(2);

  return (
    <div className="bg-[#0B1117] rounded-3xl border border-[#263541] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200 text-[#F5F7FA]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] text-xs font-bold transition-all cursor-pointer border border-[#263541]"
        >
          <ArrowLeft className="w-4 h-4 text-[#D97706]" />
          <span>← Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 text-xs font-black uppercase tracking-wider">
            ALL SENSORS NORMAL
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-[#111A22] border border-[#263541] flex items-center justify-center">
          <ShieldCheck className="w-12 h-12 text-[#22C55E]" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#22C55E] block mb-1">
            PERSONALIZED HEALTH PROFILE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7FA]">
            NORMAL BASELINE ESTABLISHED
          </h1>
          <p className="text-xs text-[#A8B3BE] mt-2 max-w-lg mx-auto font-medium">
            All biometrics and environmental channels for {senior.name} are operating within configured clinical resting limits.
          </p>
        </div>

        {/* 5 Normal Values Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full text-left pt-2">
          <div onClick={() => onOpenParam('heart')} className="p-3 bg-[#111A22] border border-[#263541] rounded-2xl cursor-pointer hover:border-[#D97706] transition-all">
            <span className="text-[10px] text-[#A8B3BE] uppercase font-bold block">Heart Rate</span>
            <strong className="text-lg font-black text-[#F5F7FA]">72 BPM</strong>
            <span className="text-[10px] text-[#22C55E] block font-mono">NORMAL</span>
          </div>

          <div onClick={() => onOpenParam('bp')} className="p-3 bg-[#111A22] border border-[#263541] rounded-2xl cursor-pointer hover:border-[#D97706] transition-all">
            <span className="text-[10px] text-[#A8B3BE] uppercase font-bold block">Blood Pressure</span>
            <strong className="text-lg font-black text-[#F5F7FA]">122/82</strong>
            <span className="text-[10px] text-[#22C55E] block font-mono">NORMAL</span>
          </div>

          <div onClick={() => onOpenParam('temp')} className="p-3 bg-[#111A22] border border-[#263541] rounded-2xl cursor-pointer hover:border-[#D97706] transition-all">
            <span className="text-[10px] text-[#A8B3BE] uppercase font-bold block">Temperature</span>
            <strong className="text-lg font-black text-[#F5F7FA]">36.6°C</strong>
            <span className="text-[10px] text-[#22C55E] block font-mono">NORMAL</span>
          </div>

          <div onClick={() => onOpenParam('spo2')} className="p-3 bg-[#111A22] border border-[#263541] rounded-2xl cursor-pointer hover:border-[#D97706] transition-all">
            <span className="text-[10px] text-[#A8B3BE] uppercase font-bold block">SpO₂</span>
            <strong className="text-lg font-black text-[#F5F7FA]">98%</strong>
            <span className="text-[10px] text-[#22C55E] block font-mono">NORMAL</span>
          </div>

          <div onClick={() => onOpenParam('activity')} className="p-3 bg-[#111A22] border border-[#263541] rounded-2xl cursor-pointer hover:border-[#D97706] transition-all">
            <span className="text-[10px] text-[#A8B3BE] uppercase font-bold block">Activity</span>
            <strong className="text-lg font-black text-[#F5F7FA]">ACTIVE</strong>
            <span className="text-[10px] text-[#22C55E] block font-mono">NORMAL</span>
          </div>
        </div>

        {/* Moving Waveform */}
        <div className="w-full max-w-lg mt-4 pt-3 border-t border-[#263541]">
          <div className="flex justify-between text-[11px] text-[#A8B3BE] mb-1 font-mono">
            <span>RHYTHM: REGULAR SINUS</span>
            <span className="text-[#22C55E]">TELEMETRY: STABLE</span>
          </div>
          <div className="h-12 w-full bg-[#111A22] border border-[#263541] rounded-xl overflow-hidden relative flex items-center">
            <div
              className="flex items-center absolute whitespace-nowrap"
              style={{ animation: `ecgMove ${pulseDuration}s linear infinite` }}
            >
              {[...Array(4)].map((_, i) => (
                <svg key={i} className="h-8 w-48 text-[#D97706] stroke-current shrink-0 filter drop-shadow-[0_0_4px_rgba(217,119,6,0.5)]" viewBox="0 0 128 30" fill="none">
                  <path
                    d="M 0 15 L 20 15 L 25 15 L 30 7 L 35 24 L 40 3 L 45 27 L 50 15 L 60 15 L 128 15"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-2">
          <h4 className="font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            Continuous Health Telemetry
          </h4>
          <p className="text-xs text-[#A8B3BE] leading-relaxed">
            ARAN's continuous millimeter-wave and optical sensors run local edge analysis every 10 seconds. Any deviation from baseline triggers an instant caregiver notification.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-2">
          <h4 className="font-bold text-sm text-[#F5F7FA] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A16207]" />
            AI Adaptive Baselines
          </h4>
          <p className="text-xs text-[#A8B3BE] leading-relaxed">
            Baselines adjust according to time of day, circadian sleep cycles, post-meal resting phases, and ambient weather telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
