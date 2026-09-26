import React from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  ShieldAlert,
  Bell,
} from 'lucide-react';

interface MissedCheckInScreenProps {
  onBack: () => void;
  onOpenSos: () => void;
}

export const MissedCheckInScreen: React.FC<MissedCheckInScreenProps> = ({ onBack, onOpenSos }) => {
  const { toggleRoutineStatus, speakText, language } = useAran();
  const t = translations[language] || translations.en;

  const handleResolve = () => {
    toggleRoutineStatus('RT-2', 'completed');
    speakText(
      language === 'ta'
        ? 'செக்-இன் தாமதமாக உறுதிப்படுத்தப்பட்டது. பராமரிப்பாளருக்கு நிம்மதி செய்தி அனுப்பப்பட்டது.'
        : 'Check-in confirmed late. Status resolved and caregiver informed.'
    );
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-ping" />
          <span className="px-2.5 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold font-mono">
            GRACE PERIOD EXPIRED (15 MIN)
          </span>
        </div>
      </div>

      {/* Main Missed Check-in Alert */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#111A22] border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#F59E0B]/20">
          <Clock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            ROUTINE ADHERENCE ALERT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FA] tracking-tight">
            CHECK-IN NOT CONFIRMED
          </h2>
          <p className="text-xs text-[#A8B3BE] mt-1 max-w-md mx-auto">
            Scheduled 08:00 AM morning wellness check-in was not acknowledged within the configured grace period.
          </p>
        </div>

        {/* 3-Tier Escalation Timeline */}
        <div className="w-full max-w-lg p-5 rounded-2xl bg-[#111A22] border border-[#263541] text-left space-y-3">
          <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
            Automated Escalation Protocol (Active)
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 text-[#A8B3BE]">
              <span className="w-5 h-5 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-bold flex items-center justify-center shrink-0 text-[10px]">
                ✓
              </span>
              <div>
                <strong className="text-[#F5F7FA]">Tier 1: ARAN App Audio & Visual Chime</strong>
                <p className="text-[11px] text-[#A8B3BE]">Repeated 3 times through ARAN Hub speaker (08:00 AM - 08:15 AM)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-[#F59E0B] font-semibold bg-[#17232D] p-2.5 rounded-xl border border-[#F59E0B]/30">
              <span className="w-5 h-5 rounded-full bg-[#F59E0B] text-[#0B1117] font-bold flex items-center justify-center shrink-0 text-[10px] animate-pulse">
                2
              </span>
              <div>
                <strong className="text-[#F5F7FA]">Tier 2: Caregiver Alert Sent to Kavitha (Daughter)</strong>
                <p className="text-[11px] text-[#F59E0B]">Push notification and phone call dispatch: +91 98401 23456</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-[#A8B3BE]">
              <span className="w-5 h-5 rounded-full bg-[#263541] text-[#A8B3BE] font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <div>
                <strong className="text-[#F5F7FA]">Tier 3: Neighbor Standby Dispatch</strong>
                <p className="text-[11px] text-[#A8B3BE]">Mr. S. Kumar (Flat 2B, 20m distance) on standby if unverified by 08:45 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleResolve}
            className="py-3 px-6 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-extrabold text-sm tracking-wide shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>I'm Safe · Confirm Now</span>
          </button>

          <a
            href="tel:+919840123456"
            className="py-3 px-6 rounded-2xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#D97706]" />
            <span>Call Daughter</span>
          </a>

          <button
            onClick={onOpenSos}
            className="py-3 px-5 rounded-2xl bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
