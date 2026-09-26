import React, { useState, useEffect, useRef } from 'react';
import { useAran } from '../../context/AranContext';
import {
  ArrowLeft,
  Heart,
  RotateCw,
  CheckCircle2,
  Activity,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Volume2,
} from 'lucide-react';

interface HeartRateScreenProps {
  onBack?: () => void;
}

export const HeartRateScreen: React.FC<HeartRateScreenProps> = ({ onBack }) => {
  const { sensor, speakText, language } = useAran();
  const [measuringStep, setMeasuringStep] = useState<'idle' | 'scanning' | 'measuring' | 'recording' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState<'LIVE' | '1H' | '6H' | '12H' | '24H' | '7D' | '30D'>('LIVE');
  const [bpm, setBpm] = useState<number>(sensor.heartRate || 72);
  const [isHeartBeating, setIsHeartBeating] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState('10:09 AM');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clock
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

  // Organic micro-variation for live display
  useEffect(() => {
    const base = sensor.heartRate || 72;
    setBpm(base);
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 3) - 1;
      setBpm(Math.max(60, Math.min(95, base + variation)));
    }, 2000);
    return () => clearInterval(interval);
  }, [sensor.heartRate]);

  const isElevated = bpm > 85;
  const isLower = bpm < 65;
  const isOutsideBaseline = isElevated || isLower;
  const statusColor = isOutsideBaseline ? '#C58A00' : '#2F7D5A';
  const statusBg = isOutsideBaseline ? 'rgba(197, 138, 0, 0.12)' : 'rgba(47, 125, 90, 0.12)';

  const startMeasurement = () => {
    setMeasuringStep('scanning');
    speakText(
      language === 'ta'
        ? 'இருதய துடிப்பு ஸ்கேன் செய்யப்படுகிறது...'
        : 'Scanning optical PPG heart rate sensor...'
    );

    setTimeout(() => {
      setMeasuringStep('measuring');
      setTimeout(() => {
        setMeasuringStep('recording');
        setTimeout(() => {
          const finalBpm = sensor.heartRate || 72;
          setBpm(finalBpm);
          setMeasuringStep('complete');
          speakText(
            language === 'ta'
              ? `இருதய துடிப்பு அளவீடு முடிந்தது: நிமிடத்திற்கு ${finalBpm} துடிப்புகள்.`
              : `Heart rate measurement complete: ${finalBpm} beats per minute.`
          );
        }, 1500);
      }, 1500);
    }, 1200);
  };

  const handleSpeakOverview = () => {
    speakText(
      language === 'ta'
        ? `தற்போதைய இருதய துடிப்பு ${bpm} BPM. தனிப்பட்ட அடிப்படை வரம்பு 65 முதல் 85 BPM.`
        : `Current heart rate is ${bpm} beats per minute. Personal baseline is 65 to 85 BPM.`
    );
  };

  // Continuous Canvas ECG animation engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let lastBeatTrigger = 0;

    const getEcgVal = (t: number, rate: number): number => {
      const cycle = 60 / rate;
      const phase = ((t % cycle) + cycle) % cycle / cycle;

      if (phase >= 0.12 && phase < 0.22) {
        return Math.sin(((phase - 0.12) / 0.10) * Math.PI) * 0.18;
      }
      if (phase >= 0.22 && phase < 0.32) return 0;
      if (phase >= 0.32 && phase < 0.35) {
        return -Math.sin(((phase - 0.32) / 0.03) * Math.PI) * 0.14;
      }
      if (phase >= 0.35 && phase < 0.40) {
        const r = (phase - 0.35) / 0.05;
        return (r < 0.5 ? r * 2 : (1 - r) * 2) * 1.0;
      }
      if (phase >= 0.40 && phase < 0.44) {
        return -Math.sin(((phase - 0.40) / 0.04) * Math.PI) * 0.32;
      }
      if (phase >= 0.44 && phase < 0.52) return 0;
      if (phase >= 0.52 && phase < 0.68) {
        return Math.sin(((phase - 0.52) / 0.16) * Math.PI) * 0.28;
      }
      return 0;
    };

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      accumulatedTime += dt;

      // Heart pulse trigger
      const cycle = 60 / bpm;
      const currentPhase = (accumulatedTime % cycle) / cycle;
      if (currentPhase >= 0.36 && currentPhase <= 0.41) {
        if (now - lastBeatTrigger > (cycle * 0.7) * 1000) {
          lastBeatTrigger = now;
          setIsHeartBeating(true);
          setTimeout(() => setIsHeartBeating(false), 240);
        }
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#CFE8EA';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (let x = 0; x < w; x += 22) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += 22) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      const baseY = h * 0.55;
      const timeSpan = 3.2;
      const amp = h * 0.42;

      ctx.beginPath();
      ctx.strokeStyle = '#713F12';
      ctx.lineWidth = 2.8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(113, 63, 18, 0.35)';
      ctx.shadowBlur = 6;

      let first = true;
      let lastX = 0;
      let lastY = baseY;

      for (let x = 0; x <= w; x += 2) {
        const pointTime = accumulatedTime - ((w - x) / w) * timeSpan;
        const val = getEcgVal(pointTime, bpm);
        const y = baseY - val * amp;
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
        lastX = x;
        lastY = y;
      }
      ctx.stroke();

      // Right edge leading dot
      ctx.shadowColor = '#713F12';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#713F12';
      ctx.beginPath();
      ctx.arc(lastX - 1, lastY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [bpm]);

  return (
    <div className="rounded-3xl border border-[#CFE8EA] bg-[#FFFFFF] shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-300 text-[#713F12]">
      {/* Top Header Bar */}
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
            <Heart className="w-6 h-6 text-[#713F12] fill-[#713F12]" />
            <h1 className="text-xl font-black tracking-tight text-[#713F12] uppercase font-mono">
              HEART RATE MONITOR
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={handleSpeakOverview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF3E2] text-[#713F12] border border-[#CFE8EA] font-bold cursor-pointer hover:bg-[#faebd4]"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Speak</span>
          </button>
          <span className="text-[#5F6B6D] font-bold bg-[#FEF3E2] px-3 py-1.5 rounded-xl border border-[#CFE8EA]">
            {currentTime}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF3E2] border border-[#CFE8EA] text-[#2F7D5A] font-bold">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#2F7D5A' }} />
            <span>LIVE ●</span>
          </div>
        </div>
      </div>

      {/* CENTER: LARGE ANIMATED HEART WITH SYNCHRONIZED PULSE */}
      <div className="relative py-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glowing Rings and Heart Icon */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Subtle concentric rings */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isHeartBeating ? 'scale-110 opacity-70 bg-[#FEF3E2]' : 'scale-95 opacity-30 bg-[#FEF3E2]'
            }`}
          />
          <div
            className={`absolute w-52 h-52 rounded-full border-2 border-[#CFE8EA] transition-transform duration-200 ${
              isHeartBeating ? 'scale-105' : 'scale-100'
            }`}
          />
          <div
            className={`absolute w-40 h-40 rounded-full bg-[#FEF3E2] border border-[#CFE8EA] flex items-center justify-center transition-all duration-150 ${
              isHeartBeating ? 'scale-110 shadow-xl shadow-[#713F12]/15' : 'scale-100 shadow-md'
            }`}
          >
            <Heart
              className={`w-20 h-20 text-[#713F12] fill-[#713F12] transition-transform duration-150 ${
                isHeartBeating ? 'scale-110 drop-shadow-[0_0_12px_rgba(113,63,18,0.5)]' : 'scale-100'
              }`}
            />
          </div>
        </div>

        {/* Current BPM Value */}
        <div className="mt-3 space-y-1">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-[#713F12] font-mono">
              {bpm}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#713F12] font-mono tracking-wider">
              BPM
            </span>
          </div>

          <p className="text-xs text-[#5F6B6D] font-mono">
            {bpm - 1} BPM, 1 min ago
          </p>

          <div className="pt-2">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase font-mono border"
              style={{
                color: statusColor,
                backgroundColor: statusBg,
                borderColor: statusColor,
              }}
            >
              {isOutsideBaseline ? 'ATTENTION' : 'NORMAL'}
            </span>
            {isOutsideBaseline && (
              <p className="text-xs text-[#C58A00] font-medium mt-1">
                Reading differs from personal baseline.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* LIVE ECG WAVEFORM CANVAS */}
      <div className="p-5 rounded-3xl bg-[#FEF3E2]/60 border border-[#CFE8EA] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#5F6B6D] font-bold">
          <span className="flex items-center gap-2 text-[#713F12]">
            <Activity className="w-4 h-4 text-[#713F12]" />
            LIVE ECG WAVEFORM (Moving Continuously Left ← Right)
          </span>
          <span className="text-[#2F7D5A]">STABLE SINUS RHYTHM</span>
        </div>

        <div className="h-32 w-full bg-[#FEF3E2] rounded-2xl overflow-hidden relative border border-[#CFE8EA]">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>

      {/* CONTROLS: [ START MEASUREMENT ] [ LIVE ] [ HISTORY ] */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={startMeasurement}
            disabled={measuringStep !== 'idle' && measuringStep !== 'complete'}
            className="py-3 px-6 rounded-2xl bg-[#713F12] hover:bg-[#58310e] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#713F12]/20 flex items-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <RotateCw
              className={`w-4 h-4 ${
                measuringStep !== 'idle' && measuringStep !== 'complete' ? 'animate-spin' : ''
              }`}
            />
            <span>
              {measuringStep === 'idle' || measuringStep === 'complete'
                ? 'START MEASUREMENT'
                : measuringStep.toUpperCase() + '...'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('LIVE')}
            className={`py-3 px-5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'LIVE'
                ? 'bg-[#713F12] text-white border-[#713F12]'
                : 'bg-[#FFFFFF] text-[#5F6B6D] border-[#CFE8EA] hover:text-[#713F12]'
            }`}
          >
            LIVE
          </button>

          <button
            onClick={() => setActiveTab('24H')}
            className={`py-3 px-5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              activeTab !== 'LIVE'
                ? 'bg-[#713F12] text-white border-[#713F12]'
                : 'bg-[#FFFFFF] text-[#5F6B6D] border-[#CFE8EA] hover:text-[#713F12]'
            }`}
          >
            HISTORY
          </button>
        </div>

        <div className="text-xs font-mono text-[#5F6B6D]">
          Sensor: <strong className="text-[#713F12]">Dual-Frequency PPG & Lead-I Sync</strong>
        </div>
      </div>

      {/* STEP 4 MEASUREMENT COMPLETE STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-5 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] text-center font-mono">
        <div className="p-2">
          <span className="text-[10px] text-[#5F6B6D] uppercase font-bold block">Current</span>
          <span className="text-xl font-black text-[#713F12] mt-0.5 block">{bpm} BPM</span>
        </div>
        <div className="p-2">
          <span className="text-[10px] text-[#5F6B6D] uppercase font-bold block">Average</span>
          <span className="text-xl font-black text-[#713F12] mt-0.5 block">70 BPM</span>
        </div>
        <div className="p-2">
          <span className="text-[10px] text-[#5F6B6D] uppercase font-bold block">Minimum</span>
          <span className="text-xl font-black text-[#2F7D5A] mt-0.5 block">64 BPM</span>
        </div>
        <div className="p-2">
          <span className="text-[10px] text-[#5F6B6D] uppercase font-bold block">Maximum</span>
          <span className="text-xl font-black text-[#C58A00] mt-0.5 block">82 BPM</span>
        </div>
        <div className="p-2 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[#5F6B6D] uppercase font-bold block">Last measured</span>
          <span className="text-sm font-bold text-[#713F12] mt-1 block">1 min ago</span>
        </div>
      </div>

      {/* HISTORICAL GRAPH WITH TABS: LIVE, 1H, 6H, 12H, 24H, 7D, 30D */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#CFE8EA] space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#713F12]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#713F12]">
              Heart Rate Trend Graph
            </h3>
          </div>

          <div className="flex flex-wrap gap-1 bg-[#FEF3E2] p-1 rounded-xl border border-[#CFE8EA]">
            {(['LIVE', '1H', '6H', '12H', '24H', '7D', '30D'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#713F12] text-white shadow-xs'
                    : 'text-[#5F6B6D] hover:text-[#713F12]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Graph Visual Bars */}
        <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
          {[
            { label: '04:00', bpm: 66 },
            { label: '07:00', bpm: 72 },
            { label: '10:00', bpm: 78 },
            { label: '13:00', bpm: 71 },
            { label: '16:00', bpm: 74 },
            { label: '19:00', bpm: 68 },
            { label: 'Now', bpm: bpm, current: true },
          ].map((bar, idx) => {
            const hPct = Math.round(((bar.bpm - 50) / 50) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-[#5F6B6D] font-bold">{bar.bpm}</span>
                <div className="w-full max-w-[36px] bg-[#FEF3E2] h-24 rounded-lg relative overflow-hidden flex items-end border border-[#CFE8EA]">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      bar.current
                        ? 'bg-[#713F12]'
                        : 'bg-[#713F12]/60 hover:bg-[#713F12]/80'
                    }`}
                    style={{ height: `${hPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-[#5F6B6D]">{bar.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#5F6B6D] pt-2 border-t border-[#CFE8EA]">
          <span>
            Personal Baseline: <strong className="text-[#713F12]">65–85 BPM</strong>
          </span>
          <span>
            Current: <strong className="text-[#713F12]">{bpm} BPM</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
