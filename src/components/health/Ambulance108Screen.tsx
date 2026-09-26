import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import { localizedData } from '../../utils/localizedData';
import {
  ArrowLeft,
  Ambulance,
  PhoneCall,
  MapPin,
  Clock,
  ShieldAlert,
  Hospital,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface Ambulance108ScreenProps {
  onBack: () => void;
}

export const Ambulance108Screen: React.FC<Ambulance108ScreenProps> = ({ onBack }) => {
  const { sensor, cancel108Ambulance, dispatch108Ambulance, language, senior, speakText } = useAran();
  const t = translations[language] || translations.en;
  const bundle = localizedData[language] || localizedData.en;
  const [etaSeconds, setEtaSeconds] = useState(sensor.ambulance108EtaMinutes * 60 || 480);

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const etaMinutes = Math.floor(etaSeconds / 60);
  const etaSecs = etaSeconds % 60;

  const handleCancel = () => {
    cancel108Ambulance();
    speakText(
      language === 'ta'
        ? '108 ஆம்புலன்ஸ் சேவை ரத்து செய்யப்பட்டது.'
        : '108 ambulance dispatch has been cancelled.'
    );
  };

  const handleReDispatch = () => {
    dispatch108Ambulance();
  };

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
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
          <span className="px-3 py-1 rounded-full bg-[#17232D] border border-[#EF4444] text-[#EF4444] text-xs font-mono font-black uppercase tracking-wider">
            108 EMERGENCY DISPATCH ACTIVE
          </span>
        </div>
      </div>

      {/* Main Alert Banner - Dark card #17232D with #EF4444 highlight */}
      <div className="p-8 rounded-3xl bg-[#17232D] border-2 border-[#EF4444] text-[#F5F7FA] text-center relative overflow-hidden shadow-2xl space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-[#0B1117] border-2 border-[#EF4444] flex items-center justify-center mx-auto text-[#EF4444] animate-bounce shadow-lg shadow-red-950/60">
          <Ambulance className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#EF4444] font-mono block mb-1">
            TAMIL NADU EMERGENCY HEALTH RESPONSE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-[#EF4444]">
            108 AMBULANCE DISPATCHED
          </h1>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="bg-[#111A22] px-6 py-3 rounded-2xl border border-[#263541] text-center">
            <span className="text-[10px] text-[#A8B3BE] uppercase font-mono block">ESTIMATED ARRIVAL</span>
            <span className="text-4xl font-black font-mono text-[#D97706]">
              {etaMinutes}:{etaSecs < 10 ? `0${etaSecs}` : etaSecs}
            </span>
            <span className="text-[10px] text-[#A8B3BE] block font-mono">MINUTES</span>
          </div>
        </div>

        <p className="text-xs text-[#A8B3BE] max-w-xl mx-auto font-medium font-mono">
          Assigned Unit: <strong className="text-[#F5F7FA]">TN-01-AMB-1082 (Advanced Life Support)</strong> · Dispatched from Adyar Depot (2.4 km away).
        </p>
      </div>

      {/* Dispatch Logistics & Emergency Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Patient Destination & Standby Hospital */}
        <div className="p-6 rounded-3xl bg-[#17232D] border border-[#263541] space-y-4 text-xs font-mono">
          <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
            <Hospital className="w-4 h-4 text-[#D97706]" />
            Designated Trauma & Emergency Center
          </h3>

          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
            <strong className="text-[#F5F7FA] text-sm block">Fortis Malar Hospital Standby</strong>
            <p className="text-[#A8B3BE]">No. 52, 1st Main Rd, Gandhi Nagar, Adyar, Chennai - 600020</p>
            <div className="pt-2 border-t border-[#263541] flex items-center justify-between text-[#A8B3BE]">
              <span>Distance: 1.8 km</span>
              <span className="text-[#22C55E] font-bold">ER Trauma Bay 3 Reserved</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-1.5">
            <span className="text-[#A8B3BE] font-semibold block text-[10px] uppercase">Senior Identity & Vitals Sync</span>
            <strong className="text-[#F5F7FA] block">{senior.name}, {senior.age} Yrs ({senior.medicalReport.bloodGroup})</strong>
            <p className="text-[#A8B3BE]">
              Live BP: <strong className="text-[#F5F7FA]">{sensor.bloodPressureRate || '122/82'}</strong> · Heart Rate: <strong className="text-[#F5F7FA]">{sensor.heartRate || 72} BPM</strong> · SpO2: <strong className="text-[#F5F7FA]">{sensor.spo2 || 98}%</strong>
            </p>
          </div>
        </div>

        {/* Right: Driver & Paramedic Contact */}
        <div className="p-6 rounded-3xl bg-[#17232D] border border-[#263541] space-y-4 text-xs font-mono">
          <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#22C55E]" />
            Active Responder Communications
          </h3>

          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
            <div>
              <span className="text-[#A8B3BE] font-semibold text-[10px] uppercase block">Emergency EMT Lead</span>
              <strong className="text-[#F5F7FA] text-sm block">Officer R. Karthik (Paramedic)</strong>
              <span className="text-[#22C55E] font-semibold text-[11px]">Direct Radio Link Active</span>
            </div>
            <a
              href="tel:108"
              className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm uppercase cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call 108
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-1">
            <span className="text-[#A8B3BE] font-semibold text-[10px] uppercase block">Family Escort Alert</span>
            <p className="text-[#F5F7FA]">Daughter Kavitha (+91 98401 23456) notified via automated SMS & high-priority IVR call.</p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#111A22] border border-[#EF4444] hover:bg-red-950/30 text-[#EF4444] font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel 108 Dispatch
            </button>
            <button
              onClick={handleReDispatch}
              className="py-3 px-4 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-bold text-xs border border-[#A16207]/40 transition-all cursor-pointer shadow-md"
            >
              Re-sync ETA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
