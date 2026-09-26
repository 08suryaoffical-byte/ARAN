import React, { useState, useEffect } from 'react';
import { useAran } from '../context/AranContext';
import { translations } from '../utils/translations';
import { localizedData } from '../utils/localizedData';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  X,
  CheckCircle,
  Clock,
  Send,
  Share2,
  Ambulance,
  Hospital,
  User,
  Heart,
  Radio,
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const {
    senior,
    caregivers,
    isSosActive,
    cancelSos,
    language,
  } = useAran();

  const t = translations[language] || translations.en;
  const bundle = localizedData[language] || localizedData.en;
  const [confirmCallNumber, setConfirmCallNumber] = useState<string | null>(null);
  const [callInitiatedToast, setCallInitiatedToast] = useState<string | null>(null);
  const [activeChainIndex, setActiveChainIndex] = useState<number>(0);

  // Animate the red pulse through: PATIENT -> ARAN -> CAREGIVER -> DOCTOR -> HOSPITAL -> AMBULANCE
  useEffect(() => {
    if (!isOpen && !isSosActive) return;
    const interval = setInterval(() => {
      setActiveChainIndex((prev) => (prev + 1) % 6);
    }, 1400);
    return () => clearInterval(interval);
  }, [isOpen, isSosActive]);

  if (!isOpen && !isSosActive) return null;

  const handleDialClick = (number: string, label: string) => {
    initiateCall(number, label);
  };

  const initiateCall = (number: string, label: string) => {
    setConfirmCallNumber(null);
    setCallInitiatedToast(`Connecting emergency call to ${label} (${number})...`);
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${number}`;
    }
    setTimeout(() => setCallInitiatedToast(null), 5000);
  };

  const emergencyChain = [
    { id: 'patient', label: 'PATIENT', sub: senior.name, icon: '👤' },
    { id: 'aran', label: 'ARAN AI', sub: 'Hub Triage', icon: '🛡️' },
    { id: 'caregiver', label: 'CAREGIVER', sub: caregivers[0]?.name || 'Daughter', icon: '👩' },
    { id: 'doctor', label: 'DOCTOR', sub: 'Dr. Kumar', icon: '👨‍⚕️' },
    { id: 'hospital', label: 'HOSPITAL', sub: 'Kauvery Hospital', icon: '🏥' },
    { id: 'ambulance', label: 'AMBULANCE', sub: '108 First Response', icon: '🚑' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#17232D] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#263541] animate-in zoom-in-95 duration-200 text-[#F5F7FA]">
        {/* Dark Header (NOT solid red - subtle dark secondary #111A22 with #EF4444 emergency highlights) */}
        <div className="bg-[#111A22] border-b border-[#263541] p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#0B1117] border-2 border-[#EF4444] text-[#EF4444] flex items-center justify-center shadow-lg shadow-red-950/60 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EF4444] font-mono block mb-0.5">
                ● HIGH PRIORITY EMERGENCY
              </span>
              <h2 className="text-2xl font-black text-[#EF4444] tracking-tight">
                🔴 SOS ACTIVATED
              </h2>
              <p className="text-xs text-[#A8B3BE] font-medium mt-0.5 font-mono">
                Location: {senior.homeInfo.city} · Time: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cancelSos();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#263541]">
          {/* Senior & Location Card */}
          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#A8B3BE] font-bold uppercase tracking-wider block mb-1">
                Monitored Patient
              </span>
              <p className="text-sm font-bold text-[#F5F7FA]">{senior.name} (Age {senior.age})</p>
              <p className="text-[#D97706] mt-0.5 font-bold uppercase">{senior.livingArrangement}</p>
            </div>

            <div>
              <span className="text-[#A8B3BE] font-bold uppercase tracking-wider block mb-1">
                Verified GPS Location
              </span>
              <p className="text-[#F5F7FA] font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EF4444] shrink-0" />
                {senior.homeInfo.address}, {senior.homeInfo.city}
              </p>
              <p className="text-[11px] text-[#A8B3BE] mt-0.5">
                {senior.homeInfo.apartment}, {senior.homeInfo.floor}
              </p>
            </div>
          </div>

          {/* Toast */}
          {callInitiatedToast && (
            <div className="p-3 rounded-xl bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{callInitiatedToast}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* ANIMATED RED PULSE ESCALATION CHAIN                      */}
          {/* PATIENT ↓ ARAN ↓ CAREGIVER ↓ DOCTOR ↓ HOSPITAL ↓ AMBULANCE */}
          {/* ======================================================== */}
          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                ACTIVE ESCALATION CHAIN (RED PULSE TRAVELING)
              </span>
              <span className="text-[11px] text-[#A8B3BE] font-mono">Step 0{activeChainIndex + 1} of 06</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              {emergencyChain.map((node, idx) => {
                const isCurrent = idx === activeChainIndex;
                const isPassed = idx < activeChainIndex;

                return (
                  <div
                    key={node.id}
                    className={`p-2.5 rounded-xl border transition-all duration-200 ${
                      isCurrent
                        ? 'bg-[#EF4444]/20 border-[#EF4444] shadow-md shadow-red-950/60 ring-1 ring-[#EF4444]'
                        : isPassed
                        ? 'bg-[#17232D] border-[#A16207] text-[#D97706]'
                        : 'bg-[#17232D] border-[#263541] text-[#A8B3BE]'
                    }`}
                  >
                    <div className="text-lg mb-0.5">{node.icon}</div>
                    <strong className="block text-[11px] font-black font-mono leading-tight">
                      {node.label}
                    </strong>
                    <span className="text-[10px] opacity-80 block truncate mt-0.5">
                      {node.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Direct Call Action Buttons */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#A8B3BE] uppercase tracking-wider font-mono">
              Configured Emergency Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => handleDialClick(caregivers[0]?.phone || '+91 98401 23456', 'Primary Contact')}
                className="p-3.5 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-bold text-xs flex items-center justify-between border border-[#A16207]/40 cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-[#D97706]" />
                  <span>Call Primary Contact ({caregivers[0]?.name?.split(' ')[0] || 'Daughter'})</span>
                </div>
                <span className="font-mono text-[11px] text-[#A8B3BE]">Dial →</span>
              </button>

              <button
                onClick={() => handleDialClick('+91 98410 77123', 'Doctor Dr. Kumar')}
                className="p-3.5 rounded-xl bg-[#111A22] hover:bg-[#17232D] text-[#F5F7FA] font-bold text-xs flex items-center justify-between border border-[#263541] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Hospital className="w-4 h-4 text-[#D97706]" />
                  <span>Call Doctor (Dr. Kumar)</span>
                </div>
                <span className="font-mono text-[11px] text-[#A8B3BE]">Dial →</span>
              </button>

              <button
                onClick={() => handleDialClick('+91 44 4000 6000', 'Kauvery Hospital ER')}
                className="p-3.5 rounded-xl bg-[#111A22] hover:bg-[#17232D] text-[#F5F7FA] font-bold text-xs flex items-center justify-between border border-[#263541] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Hospital className="w-4 h-4 text-[#EF4444]" />
                  <span>Call Configured Hospital (Kauvery ER)</span>
                </div>
                <span className="font-mono text-[11px] text-[#A8B3BE]">Dial →</span>
              </button>

              <button
                onClick={() => handleDialClick('108', '108 Ambulance')}
                className="p-3.5 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-black text-xs flex items-center justify-between shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Ambulance className="w-4 h-4" />
                  <span>CALL 108 AMBULANCE</span>
                </div>
                <span className="font-mono text-[11px]">Free Line →</span>
              </button>

              <button
                onClick={() => handleDialClick('112', '112 Emergency')}
                className="p-3.5 rounded-xl bg-[#111A22] hover:bg-[#17232D] text-[#F5F7FA] font-bold text-xs flex items-center justify-between border border-[#263541] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                  <span>CALL 112 NATIONAL EMERGENCY</span>
                </div>
                <span className="font-mono text-[11px] text-[#A8B3BE]">Dial →</span>
              </button>

              <button
                onClick={() => handleDialClick('102', '102 Pregnant / Senior Line')}
                className="p-3.5 rounded-xl bg-[#111A22] hover:bg-[#17232D] text-[#F5F7FA] font-bold text-xs flex items-center justify-between border border-[#263541] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Ambulance className="w-4 h-4 text-[#D97706]" />
                  <span>CALL 102 MATERNAL & SENIOR</span>
                </div>
                <span className="font-mono text-[11px] text-[#A8B3BE]">Dial →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#263541] bg-[#111A22] flex items-center justify-between">
          <span className="text-xs text-[#A8B3BE] font-mono">
            Do not disconnect until professional responder acknowledges.
          </span>
          <button
            onClick={() => {
              cancelSos();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] text-xs font-bold border border-[#263541] cursor-pointer"
          >
            Acknowledge & Resolve SOS
          </button>
        </div>
      </div>
    </div>
  );
};
