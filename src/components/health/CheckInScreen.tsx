import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Volume2,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Settings,
  Sliders,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface CheckInScreenProps {
  onBack?: () => void;
  onOpenChat?: () => void;
}

export const CheckInScreen: React.FC<CheckInScreenProps> = ({ onBack, onOpenChat }) => {
  const { routines, toggleRoutineStatus, triggerSos, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'checkin' | 'settings'>('checkin');

  const [isOkConfirmed, setIsOkConfirmed] = useState(false);
  const [helpRequested, setHelpRequested] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // Check-In Feature Settings
  const [checkinSettings, setCheckinSettings] = useState({
    gracePeriodMinutes: 20,
    escalateToCareNetworkOnMiss: true,
    repeatDaily: true,
  });

  const morningCheckin = routines.find((r) => r.id === 'RT-2');
  const isCompleted = isOkConfirmed || morningCheckin?.status === 'completed';

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

  const handleImOk = () => {
    setIsOkConfirmed(true);
    toggleRoutineStatus('RT-2', 'completed');
    speakText(
      language === 'ta'
        ? 'மிக்க நன்றி அம்மா. நீங்கள் நலமாக உள்ளீர்கள் என்பது உறுதி செய்யப்பட்டது.'
        : 'Thank you Lakshmi Amma. Your check-in is confirmed. Have a peaceful day.'
    );
  };

  const handleNeedHelp = () => {
    setHelpRequested(true);
    speakText(
      language === 'ta'
        ? 'உதவி கோரப்பட்டது. பராமரிப்பாளர் கவிதாவிற்கு உடனடியாக தகவல் தெரிவிக்கப்படுகிறது.'
        : 'Help request initiated. Caregiver Kavitha has been notified to assist you.'
    );
    if (onOpenChat) onOpenChat();
  };

  const handleSos = () => {
    triggerSos('Senior pressed SOS during Check-In screen');
    speakText(
      language === 'ta'
        ? 'அவசர உதவி செயல்படுத்தப்பட்டது! 108 ஆம்புலன்ஸ் மற்றும் குடும்பத்தினர் இணைக்கப்படுகிறார்கள்.'
        : 'SOS emergency activated! Alerting family, caregivers, and medical services.'
    );
  };

  return (
    <div className="rounded-3xl border border-[#263541] bg-[#0B1117] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 text-[#F5F7FA]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#D97706]" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#17232D] text-[#22C55E] flex items-center justify-center border border-[#263541]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                MORNING ROUTINE CHECK-IN
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">Daily Non-Intrusive Safety Confirmation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#111A22] p-1 rounded-2xl border border-[#263541]">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'checkin'
                  ? 'bg-[#713F12] text-[#F5F7FA] shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
              }`}
            >
              Check-In View
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#713F12] text-[#F5F7FA] shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Schedule Settings</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'checkin' ? (
        <>
          {/* CENTER: CHECK-IN PROMPT CARD */}
          <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-[#111A22] flex items-center justify-center border border-[#263541] shadow-xs mb-4">
              <CheckCircle2
                className={`w-12 h-12 transition-all ${
                  isCompleted ? 'text-[#22C55E]' : 'text-[#D97706] animate-pulse'
                }`}
              />
            </div>

            <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
              {isCompleted ? 'Check-in Completed for Today!' : 'Are You Feeling Okay This Morning?'}
            </h2>
            <p className="text-xs text-[#A8B3BE] mt-1 max-w-md">
              {isCompleted
                ? 'Your family and care team have received confirmation that you are safe and sound.'
                : 'Please acknowledge your scheduled morning check-in or request help below.'}
            </p>

            {/* Status Pill */}
            <div className="mt-4">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111A22] text-[#22C55E] text-xs font-mono font-bold border border-[#22C55E]/40">
                  <CheckCircle2 className="w-4 h-4" />
                  CHECK-IN CONFIRMED AT 08:15 AM
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111A22] text-[#F59E0B] text-xs font-mono font-bold border border-[#F59E0B]/40 animate-pulse">
                  <Clock className="w-4 h-4" />
                  CHECK-IN PENDING (GRACE: {checkinSettings.gracePeriodMinutes} MIN)
                </span>
              )}
            </div>

            {/* 3 PRIMARY BUTTONS: [ I'M OK ], [ NEED HELP ], [ SOS ] */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-xl">
              {/* I'M OK */}
              <button
                onClick={handleImOk}
                className="py-4 px-4 rounded-2xl bg-[#22C55E]/20 hover:bg-[#22C55E]/30 text-[#22C55E] border border-[#22C55E]/40 font-black text-sm tracking-wide uppercase transition-all shadow-md cursor-pointer flex flex-col items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                <span>I'M OK</span>
              </button>

              {/* NEED HELP */}
              <button
                onClick={handleNeedHelp}
                className="py-4 px-4 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-black text-sm tracking-wide uppercase transition-all shadow-md cursor-pointer flex flex-col items-center justify-center gap-1"
              >
                <HelpCircle className="w-6 h-6 text-[#D97706]" />
                <span>NEED HELP</span>
              </button>

              {/* SOS */}
              <button
                onClick={handleSos}
                className="py-4 px-4 rounded-2xl bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 font-black text-sm tracking-wide uppercase transition-all shadow-md cursor-pointer flex flex-col items-center justify-center gap-1 animate-pulse"
              >
                <ShieldAlert className="w-6 h-6 text-[#EF4444]" />
                <span>EMERGENCY SOS</span>
              </button>
            </div>

            {helpRequested && (
              <div className="mt-6 p-3 rounded-2xl bg-[#111A22] border border-[#D97706] text-[#F5F7FA] text-xs font-bold animate-in fade-in">
                Assistance requested. Connecting with primary caregiver Kavitha...
              </div>
            )}
          </div>
        </>
      ) : (
        /* CHECK-IN SETTINGS TAB */
        <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#D97706]" />
              Check-In Schedule & Escalation Rules
            </h2>
            <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
              Configure daily scheduled check-in times and automated Care Network escalation delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
              <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                Grace Period Before Escalation
              </label>
              <div className="flex gap-2 pt-1">
                {[15, 20, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() =>
                      setCheckinSettings({ ...checkinSettings, gracePeriodMinutes: mins })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      checkinSettings.gracePeriodMinutes === mins
                        ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                        : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Auto-Escalate to Care Network
                </span>
                <p className="text-xs text-[#A8B3BE]">Call family if senior fails to confirm in grace period</p>
              </div>
              <button
                onClick={() =>
                  setCheckinSettings({
                    ...checkinSettings,
                    escalateToCareNetworkOnMiss: !checkinSettings.escalateToCareNetworkOnMiss,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  checkinSettings.escalateToCareNetworkOnMiss ? 'bg-[#713F12]' : 'bg-[#263541]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-[#F5F7FA] transition-transform transform mt-1 ml-1 ${
                    checkinSettings.escalateToCareNetworkOnMiss ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Check-in settings updated.');
                setActiveTab('checkin');
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-[#17232D] border border-[#263541] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
        <p className="text-xs text-[#A8B3BE]">
          ARAN never triggers false 108 emergency alarms on missed check-ins. ARAN contacts family and trusted caregivers first.
        </p>
      </div>
    </div>
  );
};
