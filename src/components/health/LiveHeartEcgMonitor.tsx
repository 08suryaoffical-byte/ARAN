import React, { useEffect, useRef, useState } from 'react';
import { useAran } from '../../context/AranContext';
import { Heart, Activity, RotateCw, Sparkles } from 'lucide-react';

interface LiveHeartEcgMonitorProps {
  initialBpm?: number;
  interactive?: boolean;
  onOpenHeartScreen?: () => void;
  className?: string;
  showDetails?: boolean;
}

export const LiveHeartEcgMonitor: React.FC<LiveHeartEcgMonitorProps> = ({
  initialBpm = 72,
  interactive = true,
  onOpenHeartScreen,
  className = '',
  showDetails = true,
}) => {
  const { sensor, speakText, language } = useAran();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulated live fluctuating BPM
  const [currentBpm, setCurrentBpm] = useState<number>(sensor.heartRate || initialBpm);
  const [displayBpm, setDisplayBpm] = useState<number>(sensor.heartRate || initialBpm);
  const [isHeartSpike, setIsHeartSpike] = useState<boolean>(false);
  const [measuringStep, setMeasuringStep] = useState<'idle' | 'scanning' | 'measuring' | 'recording' | 'complete'>('idle');

  // Keep display BPM smoothly transitioning with subtle organic variation (e.g. 71, 72, 73, 74)
  useEffect(() => {
    const base = sensor.heartRate || initialBpm;
    setCurrentBpm(base);

    const interval = setInterval(() => {
      // Natural sinus rhythm micro-variation (+/- 1-2 BPM)
      const variation = Math.floor(Math.random() * 3) - 1;
      const target = Math.max(58, Math.min(105, base + variation));
      setDisplayBpm((prev) => {
        if (prev < target) return prev + 1;
        if (prev > target) return prev - 1;
        return target;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [sensor.heartRate, initialBpm]);

  // Status computation based on personal baseline 65–85 BPM
  // Colors: NORMAL #22C55E, ATTENTION #F59E0B, HIGH PRIORITY #EF4444
  const isElevated = displayBpm > 88;
  const isLower = displayBpm < 60;
  const statusText = isElevated || isLower ? 'ATTENTION' : 'NORMAL';
  const statusColor = isElevated || isLower ? '#F59E0B' : '#22C55E';
  const statusBg = isElevated || isLower ? 'rgba(245, 158, 11, 0.14)' : 'rgba(34, 197, 94, 0.14)';

  // Measurement workflow
  const startMeasurement = () => {
    setMeasuringStep('scanning');
    speakText(
      language === 'ta'
        ? 'இருதய துடிப்பு மற்றும் நேரடி ECG அளவிடப்படுகிறது...'
        : 'Scanning optical PPG and live ECG wave sensors...'
    );

    setTimeout(() => {
      setMeasuringStep('measuring');
      setTimeout(() => {
        setMeasuringStep('recording');
        setTimeout(() => {
          setMeasuringStep('complete');
          const finalBpm = sensor.heartRate || 72;
          setDisplayBpm(finalBpm);
          speakText(
            language === 'ta'
              ? `அளவீடு முடிந்தது: நிமிடத்திற்கு ${finalBpm} துடிப்புகள், இயல்பான நிலை.`
              : `Measurement complete: ${finalBpm} BPM. Live monitoring continued.`
          );
        }, 1500);
      }, 1500);
    }, 1200);
  };

  // Canvas Real-Time Continuous Waveform Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let lastBeatTriggerTime = 0;

    // Physiological ECG Waveform generator at time t (in seconds)
    // T = 60 / BPM seconds per cycle
    const getEcgValue = (t: number, bpm: number): number => {
      const cycleDuration = 60 / bpm;
      // Phase between 0 and 1
      const phase = ((t % cycleDuration) + cycleDuration) % cycleDuration / cycleDuration;

      // Baseline: 0.0
      // P wave: 0.12 - 0.22 (small smooth rise)
      if (phase >= 0.12 && phase < 0.22) {
        const pPhase = (phase - 0.12) / 0.10;
        return Math.sin(pPhase * Math.PI) * 0.18;
      }
      // PR segment baseline: 0.22 - 0.32
      if (phase >= 0.22 && phase < 0.32) {
        return 0.0;
      }
      // Q wave: 0.32 - 0.35 (small dip)
      if (phase >= 0.32 && phase < 0.35) {
        const qPhase = (phase - 0.32) / 0.03;
        return -Math.sin(qPhase * Math.PI) * 0.14;
      }
      // R wave (QRS spike): 0.35 - 0.40 (sharp high spike to 1.0)
      if (phase >= 0.35 && phase < 0.40) {
        const rPhase = (phase - 0.35) / 0.05;
        // Triangular sharp peak
        const spike = rPhase < 0.5 ? rPhase * 2 : (1 - rPhase) * 2;
        return spike * 1.0;
      }
      // S wave: 0.40 - 0.44 (sharp downward dip)
      if (phase >= 0.40 && phase < 0.44) {
        const sPhase = (phase - 0.40) / 0.04;
        return -Math.sin(sPhase * Math.PI) * 0.32;
      }
      // ST segment baseline: 0.44 - 0.52
      if (phase >= 0.44 && phase < 0.52) {
        return 0.0;
      }
      // T wave (recovery): 0.52 - 0.68 (medium smooth recovery bump)
      if (phase >= 0.52 && phase < 0.68) {
        const tPhase = (phase - 0.52) / 0.16;
        return Math.sin(tPhase * Math.PI) * 0.28;
      }
      // TP baseline: 0.68 - 1.0
      return 0.0;
    };

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Adjust ECG speed by state
      const speedMultiplier = measuringStep === 'scanning' ? 0.75 : 1.0;
      accumulatedTime += dt * speedMultiplier;

      // Synchronize: HEARTBEAT + ECG SPIKE
      // Trigger heart pulse when R-spike occurs at newest point
      const cycleDuration = 60 / displayBpm;
      const currentPhase = (accumulatedTime % cycleDuration) / cycleDuration;
      if (currentPhase >= 0.36 && currentPhase <= 0.42) {
        if (now - lastBeatTriggerTime > (cycleDuration * 0.7) * 1000) {
          lastBeatTriggerTime = now;
          setIsHeartSpike(true);
          setTimeout(() => setIsHeartSpike(false), 240);
        }
      }

      // Handle Canvas Sizing with Retina / High-DPI support
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep dark canvas background #0F1720
      ctx.fillStyle = '#0F1720';
      ctx.fillRect(0, 0, width, height);

      // 1. Subtle Dark Medical ECG Grid #263541
      ctx.strokeStyle = 'rgba(38, 53, 65, 0.45)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major grid lines every 5 units
      ctx.strokeStyle = 'rgba(38, 53, 65, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize * 5) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize * 5) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Baseline center line
      const baselineY = height * 0.54;
      ctx.strokeStyle = 'rgba(113, 63, 18, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, baselineY);
      ctx.lineTo(width, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Continuous Real-Time ECG Waveform
      // ECG color: #D97706 with subtle orange/brown glow (not extremely bright)
      // New data enters from the RIGHT and travels toward the LEFT
      const timeSpanOnScreen = 3.2; // 3.2 seconds of ECG visible across the width
      const amplitudePixels = height * 0.44;

      ctx.beginPath();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2.6;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(217, 119, 6, 0.55)';
      ctx.shadowBlur = 7;

      const step = 2; // sample every 2px for smooth 60fps performance
      let first = true;
      let lastX = 0;
      let lastY = baselineY;

      for (let x = 0; x <= width; x += step) {
        // x = width is newest (t = accumulatedTime)
        // x = 0 is oldest (t = accumulatedTime - timeSpanOnScreen)
        const pointTime = accumulatedTime - ((width - x) / width) * timeSpanOnScreen;
        const ecgNorm = getEcgValue(pointTime, displayBpm);
        const y = baselineY - ecgNorm * amplitudePixels;

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

      // 4. Subtle Orange Leading Signal Dot at the Right Edge (where new data enters)
      ctx.shadowColor = '#D97706';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(lastX - 1, lastY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Outer ping ring in #A16207
      ctx.strokeStyle = 'rgba(161, 98, 7, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(lastX - 1, lastY, 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [displayBpm, measuringStep]);

  return (
    <div
      className={`rounded-3xl border border-[#263541] bg-[#17232D] shadow-xl text-[#F5F7FA] overflow-hidden ${className}`}
    >
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 border-b border-[#263541] flex flex-wrap items-center justify-between gap-4 bg-[#111A22]/80 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          {/* Animated Heart: #D97706, Heartbeat glow: #713F12, scale 100% -> 108% -> 100% */}
          <div
            className={`w-13 h-13 rounded-2xl bg-[#0B1117] border border-[#263541] flex items-center justify-center transition-all duration-150 ${
              isHeartSpike
                ? 'scale-108 shadow-[0_0_18px_rgba(113,63,18,0.85)] border-[#A16207]'
                : 'scale-100 shadow-md shadow-black/40'
            }`}
            style={{
              transform: isHeartSpike ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
            }}
          >
            <Heart
              className="w-7 h-7 transition-all duration-150"
              style={{
                color: '#D97706',
                fill: '#D97706',
                filter: isHeartSpike
                  ? 'drop-shadow(0 0 10px #713F12) drop-shadow(0 0 6px #D97706)'
                  : 'drop-shadow(0 0 3px rgba(113,63,18,0.5))',
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#F5F7FA] uppercase font-mono">
                HEART RATE
              </h2>
              {onOpenHeartScreen && (
                <button
                  onClick={onOpenHeartScreen}
                  className="text-[11px] font-bold text-[#A16207] hover:text-[#D97706] hover:underline cursor-pointer"
                >
                  (Open Monitor Screen →)
                </button>
              )}
            </div>
            <p className="text-xs text-[#A8B3BE] font-medium">
              Synchronized Optical PPG & Continuous Lifeline
            </p>
          </div>
        </div>

        {/* Live Status Badge: ● LIVE MONITORING (#D97706 with 100% -> 120% -> 100% dot pulse) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111A22] border border-[#263541] text-xs font-mono font-bold text-[#D97706]">
            <span
              className="w-2.5 h-2.5 rounded-full animate-live-dot shrink-0"
              style={{ backgroundColor: '#D97706' }}
            />
            <span className="font-extrabold tracking-wider">● LIVE MONITORING</span>
          </div>

          {/* NORMAL #22C55E / ATTENTION #F59E0B */}
          <div
            className="px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase font-mono border"
            style={{
              color: statusColor,
              backgroundColor: statusBg,
              borderColor: statusColor,
            }}
          >
            {measuringStep === 'scanning'
              ? 'SCANNING...'
              : measuringStep === 'measuring'
              ? 'MEASURING...'
              : measuringStep === 'recording'
              ? 'RECORDING...'
              : statusText}
          </div>
        </div>
      </div>

      {/* Main Center Measurement Numbers */}
      <div className="px-6 pt-6 pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-[#F5F7FA] transition-all duration-300">
              {displayBpm}
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#D97706] tracking-wider">
              BPM
            </span>
          </div>
          <span className="text-xs font-mono text-[#A8B3BE] mt-1 block">
            {displayBpm} BPM · Real-Time Sinus Rhythm
          </span>
        </div>

        {/* Action Button: [ START MEASUREMENT ] (#713F12 primary accent, hover #A16207) */}
        {interactive && (
          <div className="flex items-center gap-3">
            <button
              onClick={startMeasurement}
              disabled={measuringStep !== 'idle' && measuringStep !== 'complete'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] disabled:opacity-50 text-[#F5F7FA] text-xs font-black tracking-wider uppercase transition-all shadow-md shadow-[#713F12]/30 cursor-pointer hover:scale-102 border border-[#A16207]/40"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${
                  measuringStep !== 'idle' && measuringStep !== 'complete' ? 'animate-spin' : ''
                }`}
              />
              <span>
                {measuringStep === 'idle' || measuringStep === 'complete'
                  ? 'START MEASUREMENT'
                  : measuringStep.toUpperCase() + '...'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* REAL-TIME ANIMATED ECG WAVEFORM CANVAS */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#A8B3BE] mb-2 font-bold">
          <span className="flex items-center gap-1.5 text-[#D97706]">
            <Activity className="w-3.5 h-3.5 text-[#D97706]" />
            LIVE ECG (Moving LEFT ← RIGHT)
          </span>
          <span className="text-[11px] text-[#A8B3BE]">Waveform: #D97706 · Glow: #713F12</span>
        </div>

        <div className="relative w-full h-36 sm:h-44 rounded-2xl bg-[#0F1720] border border-[#263541] overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Overlay indicator for measurement */}
          {measuringStep !== 'idle' && measuringStep !== 'complete' && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-[#111A22]/90 border border-[#A16207] text-xs font-mono font-black text-[#D97706] shadow-sm animate-pulse">
              ● {measuringStep.toUpperCase()}...
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar: Personal Baseline & Last Updated */}
      {showDetails && (
        <div className="p-5 sm:p-6 bg-[#111A22]/70 border-t border-[#263541] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#F5F7FA]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="font-bold uppercase text-[#A8B3BE]">Personal Baseline:</span>
            <strong className="text-sm font-black text-[#F5F7FA]">65–85 BPM</strong>
          </div>

          <div className="flex items-center gap-4 text-[#A8B3BE]">
            <span>
              Last updated: <strong className="text-[#F5F7FA]">Just now</strong>
            </span>
            <span>·</span>
            <span className="text-[#22C55E] font-bold">● Continuous Streaming</span>
          </div>
        </div>
      )}
    </div>
  );
};
