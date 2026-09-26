import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { ArrowLeft, ShieldAlert, CheckCircle2, HelpCircle, PhoneCall, AlertTriangle } from 'lucide-react';

interface FallSafetyScreenProps {
  onBack: () => void;
  onOpenSos: () => void;
}

export const FallSafetyScreen: React.FC<FallSafetyScreenProps> = ({ onBack, onOpenSos }) => {
  const { sensor, triggerSos, sendMessage, speakText, updateSensor, language } = useAran();
  const [okFeedback, setOkFeedback] = useState(false);

  const isFallEvent = sensor.fallDetected || sensor.motionWarning !== null;

  const handleImOk = () => {
    updateSensor({
      fallDetected: false,
      motionWarning: null,
      motion: 'normal',
      activityLevel: 'normal',
    });
    setOkFeedback(true);
    speakText(
      language === 'ta'
        ? 'மகிழ்ச்சி லட்சுமி அம்மா. நீங்கள் நலமாக இருப்பதாக பதிவு செய்யப்பட்டது.'
        : "Glad to hear you are okay, Lakshmi Amma. Normal status restored."
    );
    setTimeout(() => setOkFeedback(false), 4000);
  };

  const handleNeedHelp = () => {
    sendMessage('Senior requested assistance from Motion Safety screen', 'senior');
    speakText(
      language === 'ta'
        ? 'உதவி கோரிக்கை கவிதாவிற்கு அனுப்பப்பட்டுள்ளது.'
        : 'Assistance notice sent to caregiver Kavitha.'
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Health Today</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Protection:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
            ● Continuous Impact & Immobility Guard
          </span>
        </div>
      </div>

      {/* Main Motion Safety Status Card */}
      <div
        className={`p-8 rounded-3xl border text-center transition-all ${
          isFallEvent
            ? 'bg-red-50/70 border-red-300 shadow-lg shadow-red-500/10'
            : 'bg-emerald-50/50 border-emerald-200'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md ${
              isFallEvent
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isFallEvent ? (
              <ShieldAlert className="w-10 h-10" />
            ) : (
              <CheckCircle2 className="w-10 h-10" />
            )}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">
              MOTION STATUS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isFallEvent ? '🔴 POSSIBLE FALL EVENT' : '🟢 NORMAL MOVEMENT'}
            </h2>
          </div>

          {/* Details */}
          {isFallEvent ? (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-red-200 text-left text-xs space-y-1.5 shadow-xs">
              <div className="font-extrabold text-red-900 flex items-center gap-1.5 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Impact Deceleration Detected</span>
              </div>
              <p className="text-slate-700">
                Movement after event: <strong>None detected for &gt;45s</strong>.
              </p>
              <p className="text-slate-900 font-bold pt-1">
                "Please check the senior."
              </p>
              <p className="text-[11px] text-slate-500 italic">
                *ARAN recognizes impact signatures and posture changes; careful caregiver confirmation is recommended.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              No sudden deceleration or unusual immobility events detected. Normal cadence recorded throughout the day.
            </p>
          )}

          {/* Action Response Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg pt-4">
            <button
              onClick={handleImOk}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I'M OK</span>
            </button>

            <button
              onClick={handleNeedHelp}
              className="py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>NEED HELP</span>
            </button>

            <button
              onClick={onOpenSos}
              className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS EMERGENCY</span>
            </button>
          </div>

          {okFeedback && (
            <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs animate-in fade-in">
              Confirmed safe: Normal monitoring active ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
