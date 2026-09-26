import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  ShieldAlert,
  PhoneCall,
  Volume2,
  Ambulance,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Hospital,
} from 'lucide-react';

interface SosScreenProps {
  onBack: () => void;
}

export const SosScreen: React.FC<SosScreenProps> = ({ onBack }) => {
  const { resolveSos, senior, sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeStep, setActiveStep] = useState<number>(0);

  // Animate the red pulse traveling through:
  // PATIENT -> ARAN -> CAREGIVER -> DOCTOR -> HOSPITAL -> AMBULANCE
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleStandDown = () => {
    resolveSos();
    speakText(
      language === 'ta'
        ? 'அவசர நிலை விலக்கிக் கொள்ளப்பட்டது. பாதுகாப்பு உறுதிப்படுத்தப்பட்டது.'
        : 'Emergency stand down confirmed. Safety verified.'
    );
    onBack();
  };

  const chainNodes = [
    { id: 'patient', label: 'PATIENT', sub: senior.name, icon: '👤' },
    { id: 'aran', label: 'ARAN', sub: 'Hub Triage', icon: '🛡️' },
    { id: 'caregiver', label: 'CAREGIVER', sub: 'Primary Family', icon: '👩' },
    { id: 'doctor', label: 'DOCTOR', sub: 'Dr. Kumar, MD', icon: '👨‍⚕️' },
    { id: 'hospital', label: 'HOSPITAL', sub: 'Kauvery ER', icon: '🏥' },
    { id: 'ambulance', label: 'AMBULANCE', sub: '108 Dispatch', icon: '🚑' },
  ];

  return (
    <div className="bg-[#0B1117] rounded-3xl border border-[#263541] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200 text-[#F5F7FA]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D97706]" />
          <span>← Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
          <span className="px-3.5 py-1 rounded-full bg-[#17232D] border border-[#EF4444] text-[#EF4444] text-xs font-mono font-black uppercase tracking-wider">
            HIGH PRIORITY
          </span>
        </div>
      </div>

      {/* Main SOS Beacon Card - Dark card #17232D, NOT solid red */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-5 shadow-2xl">
        {/* SOS icon in #EF4444 with subtle glow */}
        <div className="w-20 h-20 rounded-2xl bg-[#0B1117] border-2 border-[#EF4444] flex items-center justify-center shadow-lg shadow-red-950/60 text-[#EF4444]">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-mono font-black uppercase tracking-widest text-[#EF4444] block mb-1">
            CRITICAL EVENT ESCALATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-[#EF4444]">
            🔴 SOS ACTIVATED
          </h1>
          <p className="text-xs text-[#A8B3BE] mt-2 max-w-lg mx-auto font-medium">
            Emergency alert dispatched across the active care network. Red pulse is currently streaming location & vitals.
          </p>
        </div>

        {/* Live Location & Vitals in Dark cards #111A22 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left text-xs font-mono pt-2">
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[10px] text-[#A8B3BE] font-bold uppercase block mb-1">
              Verified GPS Location
            </span>
            <strong className="block text-[#F5F7FA] text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
              {senior.homeInfo.address}, {senior.homeInfo.city}
            </strong>
            <span className="text-[10px] text-[#D97706] font-mono">13.0067° N, 80.2575° E · Floor 2</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[10px] text-[#A8B3BE] font-bold uppercase block mb-1">
              Telemetry Stream
            </span>
            <strong className="block text-[#F5F7FA] text-sm">
              HR: {sensor.heartRate || 72} BPM · BP: {sensor.bloodPressureRate || '122/82'}
            </strong>
            <span className="text-[10px] text-[#22C55E] font-mono">
              SpO2: {sensor.spo2 || 98}% · Temp: {sensor.temperature || 36.6}°C
            </span>
          </div>
        </div>

        {/* Active Animated Escalation Chain:
            PATIENT -> ARAN -> CAREGIVER -> DOCTOR -> HOSPITAL -> AMBULANCE
            with Red pulse traveling through the active connection */}
        <div className="w-full max-w-2xl bg-[#111A22] border border-[#263541] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#EF4444] font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              ACTIVE ESCALATION CHAIN · RED PULSE TRAVELING
            </span>
            <span className="text-[#A8B3BE]">Step 0{activeStep + 1} of 06</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            {chainNodes.map((node, idx) => {
              const isCurrent = idx === activeStep;
              const isPassed = idx < activeStep;

              return (
                <div
                  key={node.id}
                  className={`p-2.5 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#17232D] border-[#EF4444] text-[#F5F7FA] shadow-lg shadow-red-950/60 ring-1 ring-[#EF4444]'
                      : isPassed
                      ? 'bg-[#17232D] border-[#A16207] text-[#D97706]'
                      : 'bg-[#17232D] border-[#263541] text-[#A8B3BE]'
                  }`}
                >
                  <div className="text-xl mb-0.5">{node.icon}</div>
                  <strong className="block text-[11px] font-black font-mono leading-tight">
                    {node.label}
                  </strong>
                  <span className="text-[10px] opacity-80 block truncate mt-0.5 font-mono">
                    {node.sub}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Animated SVG line with red pulse */}
          <div className="w-full h-4 relative">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 8" preserveAspectRatio="none">
              <line x1="0" y1="4" x2="100" y2="4" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="50" cy="4" r="3" fill="#EF4444">
                <animate attributeName="cx" from="0" to="100" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>

        {/* Immediate Direct Contact Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg pt-2">
          <a
            href="tel:108"
            className="py-3 px-4 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-black text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-900/30 uppercase cursor-pointer"
          >
            <Ambulance className="w-4 h-4 text-white" />
            <span>Call 108</span>
          </a>

          <a
            href="tel:112"
            className="py-3 px-4 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-black text-xs tracking-wider flex items-center justify-center gap-1.5 border border-[#A16207]/40 shadow-md uppercase cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#D97706]" />
            <span>Call 112</span>
          </a>

          <a
            href="tel:+919840123456"
            className="py-3 px-4 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#F5F7FA] font-black text-xs tracking-wider flex items-center justify-center gap-1.5 border border-[#263541] shadow-md uppercase cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#D97706]" />
            <span>Call Family</span>
          </a>
        </div>

        {/* Stand Down Button */}
        <div className="pt-2">
          <button
            onClick={handleStandDown}
            className="py-2.5 px-6 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] font-bold text-xs uppercase tracking-wider border border-[#263541] cursor-pointer transition-colors"
          >
            {t.standDown} / Cancel False Alarm
          </button>
        </div>
      </div>
    </div>
  );
};
