import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Thermometer,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Clock,
  TrendingUp,
  Sun,
  Flame,
  Settings,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface TemperatureScreenProps {
  onBack?: () => void;
}

export const TemperatureScreen: React.FC<TemperatureScreenProps> = ({ onBack }) => {
  const { sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [measuringState, setMeasuringState] = useState<'idle' | 'measuring' | 'recording' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState<'reading' | 'history' | 'settings'>('reading');
  const [historyTab, setHistoryTab] = useState<'TODAY' | '7 DAYS' | '30 DAYS'>('TODAY');

  const [bodyTemp, setBodyTemp] = useState(sensor.temperature || 36.6);
  const [roomTemp, setRoomTemp] = useState(sensor.ambientTemperature || 31.5);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // Temp Feature Settings
  const [tempSettings, setTempSettings] = useState({
    feverAlertThreshold: 37.8,
    ambientHeatAlertThreshold: 35.0,
    unit: 'Celsius',
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

  const isFever = bodyTemp > tempSettings.feverAlertThreshold;
  const isRoomHot = roomTemp > tempSettings.ambientHeatAlertThreshold;

  const startMeasurement = () => {
    setMeasuringState('measuring');
    speakText(
      language === 'ta'
        ? 'உடல் வெப்பநிலை அளவிடப்படுகிறது...'
        : 'Measuring skin and core temperature via medical infrared thermopile.'
    );

    setTimeout(() => {
      setMeasuringState('recording');
      setTimeout(() => {
        setMeasuringState('complete');
        const newTemp = +(36.4 + Math.random() * 0.4).toFixed(1);
        setBodyTemp(newTemp);

        speakText(
          language === 'ta'
            ? `அளவீடு முடிந்தது: உடல் வெப்பநிலை ${newTemp} டிகிரி செல்சியஸ், இயல்பான நிலை.`
            : `Measurement complete: Temperature is ${newTemp}°C. Normal physiological range.`
        );
      }, 1500);
    }, 2000);
  };

  const handleSpeakStatus = () => {
    speakText(
      language === 'ta'
        ? `உடல் வெப்பநிலை ${bodyTemp}°C. அறை வெப்பநிலை ${roomTemp}°C.`
        : `Body temperature is ${bodyTemp}°C. Ambient room temperature is ${roomTemp}°C.`
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
              <span className="text-xl">🌡</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono">
                BODY & AMBIENT TEMPERATURE
              </h1>
              <p className="text-xs text-[#5F6B6D] font-medium">Dual-Channel Contact Thermopile & Room Heat Monitor</p>
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
          {/* CENTER: LARGE ANIMATED THERMOMETER */}
          <div className="p-8 rounded-3xl bg-[#FEF3E2] border border-[#CFE8EA] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              {/* Thermometer Graphic */}
              <div className="relative w-16 h-56 bg-white rounded-full p-2 border-2 border-[#CFE8EA] shadow-inner flex flex-col justify-end items-center">
                {/* Mercury Liquid Column */}
                <div
                  className={`w-8 rounded-full transition-all duration-700 shadow-md ${
                    isFever ? 'bg-[#C58A00]' : 'bg-[#713F12]'
                  }`}
                  style={{
                    height: `${Math.min(100, Math.max(15, ((bodyTemp - 34) / 6) * 100))}%`,
                  }}
                />
                {/* Mercury Bulb at Bottom */}
                <div
                  className={`w-12 h-12 rounded-full absolute -bottom-2 border-2 border-white shadow-md flex items-center justify-center ${
                    isFever ? 'bg-[#C58A00]' : 'bg-[#713F12]'
                  }`}
                >
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
              </div>

              {/* Temperature Digits & Status */}
              <div className="text-left space-y-2">
                <span className="text-xs font-mono font-bold text-[#5F6B6D] tracking-wider uppercase block">
                  CORE BODY TEMPERATURE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black font-mono tracking-tight text-[#713F12]">
                    {bodyTemp}
                  </span>
                  <span className="text-2xl font-black text-[#5F6B6D]">°C</span>
                </div>

                <div className="pt-2">
                  {measuringState === 'measuring' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#713F12] text-xs font-mono font-bold border border-[#CFE8EA] animate-pulse">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      CALIBRATING SENSOR...
                    </span>
                  ) : isFever ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#C58A00] text-xs font-mono font-bold border border-[#C58A00]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      MILD FEVER ELEVATION
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F7D5A] text-xs font-mono font-bold border border-[#2F7D5A]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      NORMAL RANGE (36.0–37.2°C)
                    </span>
                  )}
                </div>

                {/* Ambient Room Temperature Card */}
                <div className="mt-4 p-4 rounded-2xl bg-white border border-[#CFE8EA] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3E2] text-[#C58A00] flex items-center justify-center border border-[#CFE8EA]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#5F6B6D] block uppercase font-mono">
                      Ambient Room Climate
                    </span>
                    <strong className="text-base font-black text-[#713F12] font-mono">
                      {roomTemp}°C
                    </strong>
                    <span className="text-[11px] text-[#2F7D5A] font-bold ml-2">
                      {isRoomHot ? 'Heat Alert' : 'Comfortable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurement Button */}
            <div className="mt-8">
              <button
                onClick={startMeasurement}
                disabled={measuringState === 'measuring'}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#713F12] hover:bg-[#58310e] text-white text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                <RotateCw className={`w-4 h-4 ${measuringState === 'measuring' ? 'animate-spin' : ''}`} />
                <span>SCAN TEMPERATURE</span>
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
                Thermal Trend Log
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
              { time: '10:09 AM', body: '36.6°C', room: '31.5°C', status: 'Normal' },
              { time: '08:00 AM', body: '36.5°C', room: '29.8°C', status: 'Normal' },
              { time: 'Yesterday 09:00 PM', body: '36.7°C', room: '32.1°C', status: 'Normal' },
              { time: 'Yesterday 02:00 PM', body: '36.8°C', room: '34.2°C', status: 'Normal' },
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
                    {entry.body}
                  </span>
                  <span className="font-mono text-[#5F6B6D]">Room: {entry.room}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#2F7D5A] font-bold border border-[#CFE8EA]">
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TEMP SETTINGS TAB */
        <div className="bg-[#FEF3E2] border border-[#CFE8EA] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#713F12] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#713F12]" />
              Temperature & Ambient Heat Thresholds
            </h2>
            <p className="text-xs text-[#5F6B6D] mt-1 font-medium">
              Configure fever alerts and room heat stress notifications for senior protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fever Threshold */}
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Body Fever Alert Limit
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#713F12]">
                  {tempSettings.feverAlertThreshold}°C
                </span>
              </div>
              <input
                type="range"
                min="37.0"
                max="39.0"
                step="0.1"
                value={tempSettings.feverAlertThreshold}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    feverAlertThreshold: Number(e.target.value),
                  })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            {/* Ambient Heat Stress Limit */}
            <div className="p-4 rounded-2xl bg-white border border-[#CFE8EA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#713F12] uppercase font-mono">
                  Room Heat Stress Warning
                </span>
                <span className="text-xs font-mono font-bold bg-[#FEF3E2] px-2 py-0.5 rounded text-[#C58A00]">
                  {tempSettings.ambientHeatAlertThreshold}°C
                </span>
              </div>
              <input
                type="range"
                min="32.0"
                max="38.0"
                step="0.5"
                value={tempSettings.ambientHeatAlertThreshold}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    ambientHeatAlertThreshold: Number(e.target.value),
                  })
                }
                className="w-full accent-[#C58A00] cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Temperature thresholds updated.');
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
          Ensure sensor contact surface is dry and free of moisture for accurate clinical infrared readings.
        </p>
      </div>
    </div>
  );
};
