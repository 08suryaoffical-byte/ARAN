import React from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  MapPin,
  Compass,
  AlertTriangle,
  PhoneCall,
  Navigation,
  ShieldAlert,
  Home,
} from 'lucide-react';

interface SafeZoneBreachScreenProps {
  onBack: () => void;
}

export const SafeZoneBreachScreen: React.FC<SafeZoneBreachScreenProps> = ({ onBack }) => {
  const { sensor, senior, speakText, language } = useAran();
  const t = translations[language] || translations.en;

  const handleNotifyCaregiver = () => {
    speakText(
      language === 'ta'
        ? 'எல்லை கடந்த தகவல் கவிதாவிற்கு அனுப்பப்பட்டது.'
        : 'Safe zone breach notification dispatched to caregiver.'
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
            GEOFENCE STATUS: PERIMETER CROSSED
          </span>
        </div>
      </div>

      {/* Main Breach Presentation */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-[#111A22] border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#F59E0B]/20">
          <MapPin className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            CONSENT-BASED GEOFENCE MONITORING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FA] tracking-tight">
            SAFE ZONE BOUNDARY CROSSED
          </h2>
          <p className="text-xs text-[#A8B3BE] mt-1 max-w-md mx-auto">
            Senior has moved outside the configured 200m/450m home boundary perimeter. Caregiver verification recommended.
          </p>
        </div>

        {/* Location Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left text-xs">
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[10px] text-[#A8B3BE] font-bold uppercase block">Current Detected GPS</span>
            <strong className="block text-[#F5F7FA] text-sm mt-0.5">Besant Nagar Beach Road</strong>
            <p className="text-[#F59E0B] mt-0.5">650 meters outside home safe zone</p>
            <span className="text-[10px] text-[#A8B3BE] font-mono block mt-1">12.9984° N, 80.2678° E</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[10px] text-[#A8B3BE] font-bold uppercase block">Registered Home Base</span>
            <strong className="block text-[#F5F7FA] text-sm mt-0.5">Flat 3A, Lakshmi Illam, Adyar</strong>
            <p className="text-[#22C55E] mt-0.5">Configured Safe Radius: 200m</p>
            <span className="text-[10px] text-[#A8B3BE] font-mono block mt-1">13.0067° N, 80.2575° E</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="tel:+919840123456"
            className="py-3 px-5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#F5F7FA]" />
            <span>CALL LAKSHMI AMMA</span>
          </a>

          <button
            onClick={handleNotifyCaregiver}
            className="py-3 px-5 rounded-2xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D97706]" />
            <span>NOTIFY DAUGHTER KAVITHA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
