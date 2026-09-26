import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Activity,
  CheckCircle2,
  RotateCw,
  AlertTriangle,
  Volume2,
  Clock,
  TrendingUp,
  Settings,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface BloodPressureScreenProps {
  onBack?: () => void;
}

export const BloodPressureScreen: React.FC<BloodPressureScreenProps> = ({ onBack }) => {
  const { sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [measuringState, setMeasuringState] = useState<'idle' | 'measuring' | 'recording' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState<'reading' | 'history' | 'settings'>('reading');
  const [historyTab, setHistoryTab] = useState<'TODAY' | '7 DAYS' | '30 DAYS'>('TODAY');

  const [sys, setSys] = useState(sensor.bloodPressureSystolic || 122);
  const [dia, setDia] = useState(sensor.bloodPressureDiastolic || 82);
  const [pulse, setPulse] = useState(sensor.heartRate || 72);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // BP Feature Settings
  const [bpSettings, setBpSettings] = useState({
    sysAlertThreshold: 130,
    diaAlertThreshold: 85,
    autoCheckIntervalHours: 4,
    cuffInflationPace: 'Gentle',
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

  const isHighBp = sys > bpSettings.sysAlertThreshold || dia > bpSettings.diaAlertThreshold;

  const startMeasurement = () => {
    setMeasuringState('measuring');
    speakText(
      language === 'ta'
        ? 'இரத்த அழுத்தம் அளவிடப்படுகிறது. கையை அசையாமல் வையுங்கள்.'
        : 'Inflating ARAN cuff and measuring arterial blood pressure. Please remain seated and relaxed.'
    );

    setTimeout(() => {
      setMeasuringState('recording');
      setTimeout(() => {
        setMeasuringState('complete');
        const newSys = Math.floor(Math.random() * 8) + 120;
        const newDia = Math.floor(Math.random() * 6) + 80;
        setSys(newSys);
        setDia(newDia);
        setPulse(sensor.heartRate || 72);

        speakText(
          language === 'ta'
            ? `அளவீடு முடிந்தது: இரத்த அழுத்தம் ${newSys} கீழ் ${newDia} mmHg.`
            : `Measurement complete: Blood pressure is ${newSys} over ${newDia} mmHg. Normal reading.`
        );
      }, 1500);
    }, 2000);
  };

  const handleSpeakStatus = () => {
    speakText(
      language === 'ta'
        ? `தற்போதைய இரத்த அழுத்தம் ${sys} மேல் ${dia} mmHg. நாடித்துடிப்பு ${pulse} BPM.`
        : `Current blood pressure is ${sys} over ${dia} mmHg, pulse ${pulse} beats per minute.`
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
              <span className="text-xl">🩸</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono">
                BLOOD PRESSURE & ARTERIAL MONITOR
              </h1>
              <p className="text-xs text-[#5F6B6D] font-medium">Oscillometric Sensor & Systolic/Diastolic Analysis</p>
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
          {/* CIRCULAR MEASUREMENT GAUGE CARD */}
          <div className="p-8 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Animated Gauge Ring */}
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
                  stroke={isHighBp ? '#C58A00' : '#2F7D5A'}
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 106}
                  strokeDashoffset={
                    measuringState === 'measuring'
                      ? 2 * Math.PI * 106 * 0.3
                      : 2 * Math.PI * 106 * (1 - (sys / 180))
                  }
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>

              {/* Inside Measurement Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-bold text-[#5F6B6D] tracking-widest uppercase">
                  ARTERIAL BP
                </span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-5xl font-black font-mono tracking-tight text-[#713F12]">
                    {sys}
                  </span>
                  <span className="text-2xl font-black text-[#5F6B6D]">/</span>
                  <span className="text-4xl font-black font-mono text-[#713F12]">
                    {dia}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#5F6B6D] font-bold">mmHg</span>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#713F12] bg-white px-3 py-1 rounded-full border border-[#CFE8EA]">
                  <Activity className="w-3.5 h-3.5 text-[#2F7D5A]" />
                  <span>PULSE {pulse} BPM</span>
                </div>
              </div>
            </div>

            {/* Status Indicator Badge */}
            <div className="mt-6">
              {measuringState === 'measuring' ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#713F12] text-xs font-mono font-bold border border-[#CFE8EA] animate-pulse">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>MEASURING BLOOD PRESSURE...</span>
                </div>
              ) : isHighBp ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#C58A00] text-xs font-mono font-bold border border-[#C58A00]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C58A00]" />
                  <span>HIGH READING · REST & RETAKE</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2F7D5A] text-xs font-mono font-bold border border-[#2F7D5A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D5A]" />
                  <span>NORMAL BLOOD PRESSURE</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={startMeasurement}
                disabled={measuringState === 'measuring'}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#713F12] hover:bg-[#58310e] disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                <RotateCw className={`w-4 h-4 ${measuringState === 'measuring' ? 'animate-spin' : ''}`} />
                <span>MEASURE AGAIN</span>
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
                Blood Pressure Trend Log
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
              { time: '10:09 AM', sys: 122, dia: 82, pulse: 72, status: 'Normal' },
              { time: '08:00 AM', sys: 124, dia: 83, pulse: 74, status: 'Normal' },
              { time: 'Yesterday 08:30 PM', sys: 126, dia: 84, pulse: 71, status: 'Normal' },
              { time: 'Yesterday 01:15 PM', sys: 121, dia: 80, pulse: 70, status: 'Normal' },
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
                  <span className="font-mono font-black text-[#713F12] text-sm">
                    {entry.sys}/{entry.dia} mmHg
                  </span>
                  <span className="font-mono text-[#5F6B6D]">{entry.pulse} BPM</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#2F7D5A] font-bold border border-[#CFE8EA]">
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* BP SETTINGS TAB */
        <div className="bg-[#FEF3E2] border border-[#CFE8EA] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#713F12] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#713F12]" />
              Blood Pressure Thresholds & Measurement Frequency
            </h2>
            <p className="text-xs text-[#5F6B6D] mt-1 font-medium">
              Configure cutoff alerts for Systolic and Diastolic limits, and automatic testing interval.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Systolic Alert Limit */}
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Systolic Alert Cutoff
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#713F12]">
                  {bpSettings.sysAlertThreshold} mmHg
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="160"
                value={bpSettings.sysAlertThreshold}
                onChange={(e) =>
                  setBpSettings({ ...bpSettings, sysAlertThreshold: Number(e.target.value) })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            {/* Diastolic Alert Limit */}
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Diastolic Alert Cutoff
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#713F12]">
                  {bpSettings.diaAlertThreshold} mmHg
                </span>
              </div>
              <input
                type="range"
                min="75"
                max="100"
                value={bpSettings.diaAlertThreshold}
                onChange={(e) =>
                  setBpSettings({ ...bpSettings, diaAlertThreshold: Number(e.target.value) })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            {/* Auto Check Frequency */}
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <label className="text-xs font-bold text-[#713F12] uppercase font-mono block">
                Auto-Measurement Interval
              </label>
              <div className="flex gap-2 pt-1">
                {[2, 4, 6, 8].map((hours) => (
                  <button
                    key={hours}
                    onClick={() =>
                      setBpSettings({ ...bpSettings, autoCheckIntervalHours: hours })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      bpSettings.autoCheckIntervalHours === hours
                        ? 'bg-[#713F12] text-white border-[#713F12]'
                        : 'bg-[#FEF3E2] text-[#713F12] border-[#CFE8EA]'
                    }`}
                  >
                    Every {hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Cuff Inflation Pace */}
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <label className="text-xs font-bold text-[#713F12] uppercase font-mono block">
                Cuff Inflation Pace
              </label>
              <div className="flex gap-2 pt-1">
                {['Gentle / Senior Care', 'Standard', 'Rapid'].map((pace) => (
                  <button
                    key={pace}
                    onClick={() => setBpSettings({ ...bpSettings, cuffInflationPace: pace })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      bpSettings.cuffInflationPace === pace
                        ? 'bg-[#713F12] text-white border-[#713F12]'
                        : 'bg-[#FEF3E2] text-[#713F12] border-[#CFE8EA]'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Blood pressure settings updated.');
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
          Rest for 5 minutes before taking blood pressure. Keep arm at heart level for maximum oscillometric sensor precision.
        </p>
      </div>
    </div>
  );
};
