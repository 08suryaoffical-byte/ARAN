import React from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Fan,
} from 'lucide-react';

interface RoomHeatScreenProps {
  onBack: () => void;
  onLogWater: () => void;
}

export const RoomHeatScreen: React.FC<RoomHeatScreenProps> = ({ onBack, onLogWater }) => {
  const { sensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;

  const handleDrinkWater = () => {
    onLogWater();
    speakText(
      language === 'ta'
        ? 'தண்ணீர் பதிவு செய்யப்பட்டது. குளிர்ச்சியான இடத்தில் ஓய்வெடுக்கவும்.'
        : 'Water intake recorded. Please rest in a cool room.'
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
            THERMAL INDEX: 38.6°C (HEAT ALERT)
          </span>
        </div>
      </div>

      {/* Main Room Heat Card */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-[#111A22] border border-[#F59E0B]/40 flex items-center justify-center animate-pulse">
          <Sun className="w-12 h-12 text-[#F59E0B]" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B] block mb-1">
            ENVIRONMENTAL SENSOR ALERT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7FA]">
            ROOM HEAT WARNING (38.6°C)
          </h1>
          <p className="text-xs text-[#A8B3BE] mt-2 max-w-lg mx-auto font-medium">
            Indoor ambient thermistor detected extreme thermal wave conditions inside the senior residence. High heat accelerates senior dehydration and fatigue.
          </p>
        </div>

        {/* Temperature Comparison Matrix */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md text-left text-xs pt-2">
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[10px] text-[#A8B3BE] font-bold uppercase block">Ambient Room Index</span>
            <strong className="block text-2xl font-black text-[#F59E0B]">{sensor.ambientTemperature}°C</strong>
            <span className="text-[10px] text-[#F59E0B] font-semibold">⚠️ Exceeds comfort (30°C)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[10px] text-[#A8B3BE] font-bold uppercase block">Senior Body Temp</span>
            <strong className="block text-2xl font-black text-[#F5F7FA]">{sensor.temperature}°C</strong>
            <span className="text-[10px] text-[#22C55E] font-semibold">Baseline: 36.6°C (Regulated)</span>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="w-full max-w-md p-4 rounded-2xl bg-[#111A22] border border-[#263541] text-left text-xs space-y-2 text-[#A8B3BE]">
          <span className="font-bold text-[#F5F7FA] block uppercase tracking-wider text-[11px]">
            Recommended Immediate Care Steps:
          </span>
          <p>• Turn on room fan or air conditioner (set to 24°C–26°C).</p>
          <p>• Offer cold water, tender coconut water, or fresh buttermilk.</p>
          <p>• Avoid corridor walking until room temperature cools down.</p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleDrinkWater}
            className="py-3.5 px-6 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Droplets className="w-4 h-4 text-[#D97706]" />
            <span>Record Water Intake (+250 ml)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
