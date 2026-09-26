import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  BatteryLow,
  BatteryCharging,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface LowBatteryScreenProps {
  onBack: () => void;
}

export const LowBatteryScreen: React.FC<LowBatteryScreenProps> = ({ onBack }) => {
  const { sensor, updateSensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [isCharging, setIsCharging] = useState(sensor.isCharging || false);

  const handleDock = () => {
    setIsCharging(true);
    updateSensor({
      isCharging: true,
      batteryLevel: 65,
    });
    speakText(
      language === 'ta'
        ? 'அரண் சாதனம் காந்த சார்ஜிங் டாக்கில் வைக்கப்பட்டது. சார்ஜ் ஆகிறது.'
        : 'ARAN hub docked on magnetic charger. Fast charging initiated.'
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="px-2.5 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold font-mono">
            CRITICAL RESERVE: {isCharging ? '65%' : `${sensor.batteryLevel}%`}
          </span>
        </div>
      </div>

      {/* Main Low Battery Presentation */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-colors ${
            isCharging ? 'bg-[#111A22] border border-[#22C55E] text-[#22C55E]' : 'bg-[#111A22] border border-[#F59E0B] text-[#F59E0B] animate-pulse'
          }`}
        >
          {isCharging ? <BatteryCharging className="w-10 h-10" /> : <BatteryLow className="w-10 h-10" />}
        </div>

        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            POWER MANAGEMENT NOTICE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FA] tracking-tight">
            {isCharging ? '⚡ CHARGING ON MAGNETIC DOCK' : 'BATTERY LEVEL LOW (14%)'}
          </h2>
          <p className="text-xs text-[#A8B3BE] mt-1 max-w-md mx-auto">
            {isCharging
              ? 'Fast-charging current flowing. Sensor telemetry remains fully active during charge.'
              : 'Hub internal battery reserve is below the 15% minimum safety threshold. Docking recommended.'}
          </p>
        </div>

        {/* Battery Visual Indicator */}
        <div className="w-full max-w-sm p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-[#A8B3BE]">Internal Li-Po Cell</span>
            <span className={isCharging ? 'text-[#22C55E]' : 'text-[#F59E0B]'}>
              {isCharging ? '65% (Fast Charging)' : `${sensor.batteryLevel}% (Est. 45 min left)`}
            </span>
          </div>

          <div className="w-full bg-[#0B1117] h-4 rounded-full overflow-hidden p-0.5 border border-[#263541]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCharging ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
              }`}
              style={{ width: `${isCharging ? 65 : sensor.batteryLevel}%` }}
            />
          </div>
        </div>

        {/* Dock Action Button */}
        <div className="pt-2 w-full max-w-xs">
          {!isCharging ? (
            <button
              onClick={handleDock}
              className="w-full py-3.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-[#D97706]" />
              <span>SIMULATE PLACING ON DOCK</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Dock Connected · Continuous Vitals Guard Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
