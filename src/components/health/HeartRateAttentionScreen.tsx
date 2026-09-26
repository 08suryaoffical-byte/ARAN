import React from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Heart,
  Activity,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  Clock,
  RotateCw,
} from 'lucide-react';

interface HeartRateAttentionScreenProps {
  onBack: () => void;
}

export const HeartRateAttentionScreen: React.FC<HeartRateAttentionScreenProps> = ({ onBack }) => {
  const { sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const pulseDuration = (60 / 104).toFixed(2);

  const handleNotifyCaregiver = () => {
    speakText(
      language === 'ta'
        ? 'இருதய துடிப்பு தகவல் கவிதாவிற்கு அனுப்பப்பட்டது.'
        : 'Heart rate notification sent to caregiver.'
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
            PULSE: 104 BPM (ELEVATED)
          </span>
        </div>
      </div>

      {/* Main Alert Banner */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        {/* Pulsing Animated Heart Graphic */}
        <div
          className="w-20 h-20 rounded-3xl bg-[#111A22] border border-[#713F12] text-[#D97706] flex items-center justify-center shadow-lg shadow-[#713F12]/30"
          style={{ animation: `heartbeat ${pulseDuration}s ease-in-out infinite` }}
        >
          <Heart className="w-10 h-10 fill-[#D97706] text-[#D97706] filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            ROUTINE DEVIATION · CARDIAC PULSE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7FA] tracking-tight">
            104 BPM
          </h2>
          <span className="text-xs font-extrabold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-1 rounded-full uppercase mt-2 inline-block">
            ATTENTION RECOMMENDED
          </span>
          <p className="text-xs text-[#A8B3BE] mt-2 max-w-md mx-auto">
            Resting heart rate reading is noticeably higher than personal resting baseline (68–85 BPM).
          </p>
        </div>

        {/* Rapid ECG Line */}
        <div className="w-full max-w-md bg-[#111A22] rounded-2xl p-3 border border-[#263541] shadow-inner">
          <div className="flex justify-between text-[10px] text-[#A8B3BE] font-mono mb-1">
            <span>LEAD-I ECG (104 BPM CADENCE)</span>
            <span className="text-[#F59E0B] font-bold">ELEVATED CADENCE</span>
          </div>
          <div className="h-12 w-full overflow-hidden relative flex items-center">
            <div
              className="flex items-center absolute whitespace-nowrap"
              style={{ animation: `ecgMove ${pulseDuration}s linear infinite` }}
            >
              {[...Array(4)].map((_, i) => (
                <svg key={i} className="h-8 w-48 text-[#D97706] stroke-current shrink-0 filter drop-shadow-[0_0_4px_rgba(217,119,6,0.5)]" viewBox="0 0 128 30" fill="none">
                  <path
                    d="M 0 15 L 20 15 L 25 15 L 30 7 L 35 24 L 40 3 L 45 27 L 50 15 L 60 15 L 128 15"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Reassurance & Caregiver Guidance */}
        <div className="w-full max-w-md p-4 rounded-2xl bg-[#111A22] border border-[#263541] text-left text-xs text-[#A8B3BE] space-y-1">
          <span className="font-bold text-[#F5F7FA] block">Caregiver Guidance:</span>
          <p>• Encourage Lakshmi Amma to sit comfortably and take 5 slow deep breaths.</p>
          <p>• Check if she recently walked up stairs or felt anxious.</p>
          <p className="text-[11px] text-[#A8B3BE]/70 italic pt-1">
            *ARAN alerts family to verify resting comfort; not a clinical diagnostic replacement.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="tel:+919840123456"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#F5F7FA]" />
            <span>Call Daughter Kavitha</span>
          </a>

          <button
            onClick={handleNotifyCaregiver}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] font-bold text-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>Notify Care Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
