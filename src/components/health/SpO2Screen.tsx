import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Wind,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Clock,
  TrendingUp,
  Activity,
  Settings,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface SpO2ScreenProps {
  onBack?: () => void;
}

export const SpO2Screen: React.FC<SpO2ScreenProps> = ({ onBack }) => {
  const { sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [measuringState, setMeasuringState] = useState<'idle' | 'measuring' | 'recording' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState<'reading' | 'history' | 'settings'>('reading');
  const [historyTab, setHistoryTab] = useState<'TODAY' | '7 DAYS' | '30 DAYS'>('TODAY');

  const [spo2, setSpo2] = useState(sensor.spO2 || 98);
  const [pulse, setPulse] = useState(sensor.heartRate || 72);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // SpO2 Feature Settings
  const [spo2Settings, setSpo2Settings] = useState({
    lowOxygenThreshold: 94,
    continuousMonitoring: true,
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

  const isLowOxygen = spo2 < spo2Settings.lowOxygenThreshold;

  const startMeasurement = () => {
    setMeasuringState('measuring');
    speakText(
      language === 'ta'
        ? 'இரத்த ஆக்ஸிஜன் அளவு அளவிடப்படுகிறது. விரலை அசையாமல் வைக்கவும்.'
        : 'Measuring blood oxygen saturation via multi-wavelength optical PPG.'
    );

    setTimeout(() => {
      setMeasuringState('recording');
      setTimeout(() => {
        setMeasuringState('complete');
        const newSpo2 = Math.floor(Math.random() * 2) + 98;
        setSpo2(newSpo2);
        setPulse(sensor.heartRate || 72);

        speakText(
          language === 'ta'
            ? `அளவீடு முடிந்தது: இரத்த ஆக்ஸிஜன் ${newSpo2} சதவீதம், சிறப்பான நிலை.`
            : `Measurement complete: Blood oxygen is ${newSpo2}%. Normal clinical oxygenation.`
        );
      }, 1500);
    }, 2000);
  };

  const handleSpeakStatus = () => {
    speakText(
      language === 'ta'
        ? `இரத்த ஆக்ஸிஜன் அளவு ${spo2} சதவீதம். நாடித்துடிப்பு ${pulse} BPM.`
        : `Blood oxygen saturation is ${spo2}%, pulse ${pulse} beats per minute.`
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
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3E2] text-[#2F7D5A] flex items-center justify-center border border-[#CFE8EA]">
              <span className="text-xl">🫁</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono">
                BLOOD OXYGEN (SpO₂) MONITOR
              </h1>
              <p className="text-xs text-[#5F6B6D] font-medium">Multi-Wavelength Optical Pulse Oximetry</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#FEF3E2] p-1 rounded-2xl border border-[#CFE8EA]">
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-[#713F12] text-white shadow-xs'
                  : 'text-[#713F12] hover:bg-white/60'
              }`}
            >
              Live Monitor
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

      {activeTab === 'reading' ? (
        <>
          {/* CENTER: LARGE CIRCULAR OXYGEN GAUGE */}
          <div className="p-8 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] flex flex-col items-center justify-center text-center relative overflow-hidden">
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
                  stroke={isLowOxygen ? '#C58A00' : '#2F7D5A'}
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 106}
                  strokeDashoffset={2 * Math.PI * 106 * (1 - spo2 / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-bold text-[#5F6B6D] tracking-widest uppercase">
                  OXYGEN LEVEL
                </span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-6xl font-black font-mono tracking-tight text-[#713F12]">
                    {spo2}
                  </span>
                  <span className="text-2xl font-black text-[#5F6B6D]">%</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#713F12] bg-white px-3 py-1 rounded-full border border-[#CFE8EA] mt-1">
                  <Activity className="w-3.5 h-3.5 text-[#2F7D5A]" />
                  <span>PULSE {pulse} BPM</span>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6">
              {measuringState === 'measuring' ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#713F12] text-xs font-mono font-bold border border-[#CFE8EA] animate-pulse">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  MEASURING BLOOD OXYGEN...
                </span>
              ) : isLowOxygen ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#C58A00] text-xs font-mono font-bold border border-[#C58A00]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C58A00]" />
                  LOW OXYGEN SATURATION (&lt;95%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2F7D5A] text-xs font-mono font-bold border border-[#2F7D5A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D5A]" />
                  OPTIMAL CLINICAL OXYGENATION (95–100%)
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="mt-6">
              <button
                onClick={startMeasurement}
                disabled={measuringState === 'measuring'}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#713F12] hover:bg-[#58310e] text-white text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                <RotateCw className={`w-4 h-4 ${measuringState === 'measuring' ? 'animate-spin' : ''}`} />
                <span>MEASURE OXYGEN AGAIN</span>
              </button>
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
                Pulse Oximetry Trend Log
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
              { time: '10:09 AM', spo2: '98%', pulse: '72 BPM', status: 'Optimal' },
              { time: '08:00 AM', spo2: '97%', pulse: '74 BPM', status: 'Optimal' },
              { time: 'Yesterday 09:00 PM', spo2: '98%', pulse: '71 BPM', status: 'Optimal' },
              { time: 'Yesterday 02:00 PM', spo2: '96%', pulse: '76 BPM', status: 'Optimal' },
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
                  <span className="font-mono font-black text-[#713F12] text-sm">{entry.spo2}</span>
                  <span className="font-mono text-[#5F6B6D]">{entry.pulse}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#2F7D5A] font-bold border border-[#CFE8EA]">
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SPO2 SETTINGS TAB */
        <div className="bg-[#FEF3E2] border border-[#CFE8EA] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#713F12] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#713F12]" />
              Pulse Oximetry Thresholds & Alerts
            </h2>
            <p className="text-xs text-[#5F6B6D] mt-1 font-medium">
              Configure low blood oxygen alarm cutoffs and continuous monitoring intervals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Low Oxygen Trigger Floor
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#2F7D5A]">
                  &lt; {spo2Settings.lowOxygenThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="96"
                value={spo2Settings.lowOxygenThreshold}
                onChange={(e) =>
                  setSpo2Settings({
                    ...spo2Settings,
                    lowOxygenThreshold: Number(e.target.value),
                  })
                }
                className="w-full accent-[#2F7D5A] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono block">
                  Continuous PPG Sensor
                </span>
                <p className="text-xs text-[#5F6B6D]">Continuous sampling every 15 minutes</p>
              </div>
              <button
                onClick={() =>
                  setSpo2Settings({
                    ...spo2Settings,
                    continuousMonitoring: !spo2Settings.continuousMonitoring,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  spo2Settings.continuousMonitoring ? 'bg-[#2F7D5A]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                    spo2Settings.continuousMonitoring ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Blood oxygen thresholds updated.');
                setActiveTab('reading');
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
          Keep finger warm and resting on the contact sensor without pressing excessively for accurate PPG readings.
        </p>
      </div>
    </div>
  );
};
