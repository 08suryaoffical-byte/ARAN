import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Heart,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Radio,
  Clock,
  Sparkles,
  Footprints,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface LiveMonitoringScreenProps {
  onBack: () => void;
  onOpenParam: (param: string) => void;
}

export const LiveMonitoringScreen: React.FC<LiveMonitoringScreenProps> = ({ onBack, onOpenParam }) => {
  const { sensor, language } = useAran();
  const t = translations[language] || translations.en;
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [liveTick, setLiveTick] = useState(0);

  // Periodic simulated live stream tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 5 ? 1 : prev + 1));
      setLiveTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pulseDuration = (60 / sensor.heartRate).toFixed(2);
  const hydrationPct = Math.min(100, Math.round((sensor.waterIntakeTodayMl / sensor.waterTargetMl) * 100));
  const isHighBp = sensor.bloodPressureSystolic >= 140 || sensor.bloodPressureDiastolic >= 90;
  const isLowSpO2 = sensor.spO2 < 95;
  const isWarm = sensor.temperature > 37.5 || sensor.heatWarning;

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>← Back to Health Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-black tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE MONITORING</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Last updated: {secondsAgo}s ago
          </span>
        </div>
      </div>

      {/* Top Quick Status Pill Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Heart className="w-4 h-4 animate-pulse fill-rose-500/20" />
            <span className="font-bold">{sensor.heartRate} BPM</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Thermometer className="w-4 h-4" />
            <span className="font-bold">{sensor.temperature}°C</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Wind className="w-4 h-4" />
            <span className="font-bold">{sensor.spO2}% SpO₂</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Activity className="w-4 h-4" />
            <span className="font-bold">{sensor.bloodPressureRate}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Footprints className="w-4 h-4" />
            <span className="font-bold uppercase">{sensor.motion}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-sky-400">
            <Droplets className="w-4 h-4" />
            <span className="font-bold">{hydrationPct}% HYD</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Real-time Multi-Sensor Sync</span>
        </div>
      </div>

      {/* Professional Multi-Sensor Live Waveform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. HEART RATE & ECG */}
        <div
          onClick={() => onOpenParam('heart')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              HEART RATE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-bold">
              PPG ACTIVE
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-white tracking-tight">{sensor.heartRate}</span>
              <span className="text-xs font-bold text-rose-400 ml-1.5 uppercase">BPM</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
              NORMAL (68-85)
            </span>
          </div>

          {/* Continuous Moving ECG line */}
          <div className="h-16 w-full bg-slate-950 rounded-xl overflow-hidden relative flex items-center border border-slate-800 shadow-inner">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #f43f5e 1px, transparent 1px), linear-gradient(to bottom, #f43f5e 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />
            <div
              className="flex items-center absolute whitespace-nowrap"
              style={{ animation: `ecgMove ${pulseDuration}s linear infinite` }}
            >
              {[...Array(3)].map((_, i) => (
                <svg key={i} className="h-12 w-64 text-rose-500 stroke-current shrink-0" viewBox="0 0 256 50" fill="none">
                  <path
                    d="M 0 25 L 30 25 L 40 25 L 50 15 L 60 38 L 70 5 L 80 45 L 90 25 L 105 25 L 120 22 L 135 25 L 256 25"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex justify-between">
            <span>R-R Interval: {(60000 / sensor.heartRate).toFixed(0)}ms</span>
            <span className="text-rose-400 group-hover:underline">Detailed Screen →</span>
          </div>
        </div>

        {/* 2. BLOOD PRESSURE OSCILLOMETRIC */}
        <div
          onClick={() => onOpenParam('bp')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              BLOOD PRESSURE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">
              SYS / DIA
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-white tracking-tight">{sensor.bloodPressureRate}</span>
              <span className="text-xs font-bold text-slate-400 ml-1.5">mmHg</span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isHighBp
                  ? 'text-amber-400 bg-amber-950/60 border border-amber-800'
                  : 'text-emerald-400 bg-emerald-950/60'
              }`}
            >
              {isHighBp ? 'HIGH READING' : 'NORMAL'}
            </span>
          </div>

          {/* Dual Bar Graphic for SYS / DIA */}
          <div className="h-16 w-full bg-slate-950 rounded-xl p-2.5 flex flex-col justify-around border border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>SYS {sensor.bloodPressureSystolic}</span>
                <span>Max 160</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sensor.bloodPressureSystolic >= 140 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(sensor.bloodPressureSystolic / 180) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>DIA {sensor.bloodPressureDiastolic}</span>
                <span>Max 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${(sensor.bloodPressureDiastolic / 120) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex justify-between">
            <span>Pulse: {sensor.heartRate} BPM</span>
            <span className="text-indigo-400 group-hover:underline">Detailed Screen →</span>
          </div>
        </div>

        {/* 3. SpO2 CIRCULAR OXYGEN RING */}
        <div
          onClick={() => onOpenParam('spo2')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              BLOOD OXYGEN
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              SpO₂ %
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-4xl font-black text-white tracking-tight">{sensor.spO2}%</span>
              <span className="text-xs font-bold text-cyan-400 ml-1.5 uppercase">SAT</span>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Baseline: 97–99%</p>
            </div>

            {/* Circular Mini Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke={isLowSpO2 ? '#f59e0b' : '#06b6d4'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset={100 - sensor.spO2}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-bold text-cyan-300">
                {sensor.spO2}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex justify-between pt-2 border-t border-slate-800">
            <span className={isLowSpO2 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
              {isLowSpO2 ? 'LOW READING' : 'NORMAL'}
            </span>
            <span className="text-cyan-400 group-hover:underline">Detailed Screen →</span>
          </div>
        </div>

        {/* 4. BODY TEMPERATURE & AMBIENT */}
        <div
          onClick={() => onOpenParam('temp')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              TEMPERATURE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">
              THERMISTOR
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-white tracking-tight">{sensor.temperature}</span>
              <span className="text-sm font-bold text-amber-400 ml-1">°C</span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isWarm ? 'text-amber-400 bg-amber-950/60 border border-amber-800' : 'text-emerald-400 bg-emerald-950/60'
              }`}
            >
              {isWarm ? 'WARM READING' : 'NORMAL (36.6°C)'}
            </span>
          </div>

          {/* Animated mercury / temperature bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Ambient Room: {sensor.ambientTemperature}°C</span>
              <span>{sensor.heatWarning ? 'Heat Warning' : 'Normal'}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isWarm ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                }`}
                style={{ width: `${Math.min(100, ((sensor.temperature - 35) / 5) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex justify-between pt-2 border-t border-slate-800">
            <span>Range: 36.2°C – 37.2°C</span>
            <span className="text-amber-400 group-hover:underline">Detailed Screen →</span>
          </div>
        </div>

        {/* 5. MOTION & 6-AXIS IMU */}
        <div
          onClick={() => onOpenParam('activity')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-400" />
              ACTIVITY & IMU
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              ACCELEROMETER
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-white tracking-tight">
                {sensor.stepsToday?.toLocaleString() || '4,238'}
              </span>
              <span className="text-xs font-bold text-emerald-400 ml-1.5 uppercase">Steps</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded uppercase">
              {sensor.motion}
            </span>
          </div>

          {/* Animated Cadence Waveform */}
          <div className="h-10 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center px-3 gap-1 border border-slate-800">
            {[...Array(18)].map((_, i) => {
              const h = Math.abs(Math.sin((i + liveTick) * 0.6)) * 24 + 4;
              return (
                <div
                  key={i}
                  className="flex-1 bg-emerald-400 rounded-full transition-all duration-300"
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex justify-between pt-1 border-t border-slate-800">
            <span>Active: 3h 24m · Rest: 12m</span>
            <span className="text-emerald-400 group-hover:underline">Detailed Screen →</span>
          </div>
        </div>

        {/* 6. HYDRATION FLUID LEVEL */}
        <div
          onClick={() => onOpenParam('hydration')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              HYDRATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-bold">
              SCHEDULE SYNC
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-white tracking-tight">{hydrationPct}%</span>
              <span className="text-xs font-bold text-sky-400 ml-1.5 uppercase">Target</span>
            </div>
            <span className="text-xs font-semibold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded">
              {sensor.waterIntakeTodayMl} / {sensor.waterTargetMl} ml
            </span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${hydrationPct}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex justify-between pt-2 border-t border-slate-800">
            <span>Next Check: 03:00 PM</span>
            <span className="text-sky-400 group-hover:underline">Detailed Screen →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
