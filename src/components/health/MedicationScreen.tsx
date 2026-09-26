import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Pill,
  CheckCircle2,
  Clock,
  Bell,
  AlertCircle,
  Volume2,
  RotateCw,
  ShieldCheck,
  Calendar,
  Settings,
  Sliders,
  Check,
  Plus,
} from 'lucide-react';

interface MedicationScreenProps {
  onBack?: () => void;
}

export const MedicationScreen: React.FC<MedicationScreenProps> = ({ onBack }) => {
  const { toggleMedication, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [remindMessage, setRemindMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');

  // Medication Settings state
  const [medSettings, setMedSettings] = useState({
    reminderLeadMinutes: 10,
    voiceAnnounce: true,
    caregiverEscalation: true,
    dispenserSync: true,
    autoRefillAlerts: true,
  });

  const [schedule, setSchedule] = useState([
    {
      id: 'med-1',
      time: '08:00 AM',
      name: 'Ecosprin 75mg & Telmisartan 40mg',
      instruction: 'After morning breakfast with water',
      status: 'acknowledged' as 'acknowledged' | 'pending',
      compartment: 'Slot A (AM)',
    },
    {
      id: 'med-2',
      time: '01:00 PM',
      name: 'Metformin 500mg SR',
      instruction: 'After lunch',
      status: 'acknowledged' as 'acknowledged' | 'pending',
      compartment: 'Slot B (Noon)',
    },
    {
      id: 'med-3',
      time: '08:00 PM',
      name: 'Atorvastatin 10mg & Calcium D3',
      instruction: 'After dinner before sleep',
      status: 'pending' as 'acknowledged' | 'pending',
      compartment: 'Slot C (PM)',
    },
  ]);

  const handleAcknowledge = (id: string, name: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'acknowledged' } : item))
    );
    try {
      toggleMedication(id);
    } catch (e) {
      // ignore
    }
    speakText(
      language === 'ta'
        ? `${name} மருந்து உட்கொண்டது உறுதி செய்யப்பட்டது.`
        : `${name} has been acknowledged and marked as taken.`
    );
  };

  const handleRemindMe = (time: string, name: string) => {
    setRemindMessage(`Voice & chime reminder scheduled ${medSettings.reminderLeadMinutes} minutes before ${time}.`);
    speakText(
      language === 'ta'
        ? `${time} மணிக்கு ${name} மருந்து நினைவூட்டல் அமைக்கப்பட்டது.`
        : `Reminder set for ${name} at ${time}. ARAN will notify you.`
    );
    setTimeout(() => setRemindMessage(null), 4000);
  };

  const handleSpeakOverview = () => {
    speakText(
      language === 'ta'
        ? `இன்றைய மருந்து அட்டவணை: 2 மருந்துகள் எடுக்கப்பட்டன, 1 இரவு மருந்து காத்திருக்கிறது.`
        : `Today's medication schedule: Two doses acknowledged, one evening dose pending at 8:00 PM.`
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
            <div className="w-10 h-10 rounded-2xl bg-[#17232D] text-[#D97706] flex items-center justify-center border border-[#263541]">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                MEDICATION & DISPENSER SETTINGS
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">Daily Prescriptions, Reminders & Dispenser Control</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Schedule vs Settings Tabs */}
          <div className="flex items-center bg-[#111A22] p-1 rounded-2xl border border-[#263541]">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              Prescription Schedule
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Feature Settings</span>
            </button>
          </div>

          <button
            onClick={handleSpeakOverview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] text-[#F5F7FA] border border-[#263541] text-xs font-bold transition-all cursor-pointer hover:bg-[#263541]"
            title="Read Schedule Aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <>
          {/* Main Visualization: Compliance Card & Today's Schedule Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left: Pill Adherence Card */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-[#17232D] border border-[#263541] flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-[#111A22] flex items-center justify-center shadow-xs border border-[#263541] mb-3">
                <div className="w-16 h-16 rounded-2xl bg-[#713F12] text-[#F5F7FA] flex items-center justify-center shadow-md border border-[#A16207]/40">
                  <Pill className="w-8 h-8 text-[#D97706]" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-3xl font-black font-mono text-[#F5F7FA]">2 / 3</span>
                <span className="text-xs text-[#A8B3BE] font-bold block uppercase tracking-wider mt-0.5">
                  DOSES ACKNOWLEDGED TODAY
                </span>
              </div>

              <div className="w-full bg-[#111A22] h-2.5 rounded-full mt-4 overflow-hidden border border-[#263541]">
                <div className="bg-[#22C55E] h-full w-2/3 rounded-full transition-all duration-500" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#22C55E] mt-2">
                ● 67% Daily Compliance (NORMAL)
              </span>
            </div>

            {/* Right 2 cols: Today's Schedule Timeline */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-[#F5F7FA] uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Calendar className="w-4 h-4 text-[#D97706]" />
                  Active Prescription Schedule
                </h2>
                <span className="text-xs text-[#A8B3BE] font-medium font-mono">Dr. Sundaram · Apollo Hospital</span>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.status === 'acknowledged'
                        ? 'bg-[#17232D] border-[#263541]'
                        : 'bg-[#17232D] border-[#A16207] shadow-md shadow-[#713F12]/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-[#111A22] border border-[#263541] text-xs font-mono font-bold shrink-0 text-[#D97706] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                          {item.time}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#F5F7FA]">{item.name}</strong>
                            {item.status === 'acknowledged' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22C55E] bg-[#111A22] px-2.5 py-0.5 rounded-full border border-[#22C55E]">
                                <CheckCircle2 className="w-3 h-3" />
                                Taken
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] bg-[#111A22] px-2.5 py-0.5 rounded-full border border-[#F59E0B] animate-pulse">
                                <Clock className="w-3 h-3" />
                                Due Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A8B3BE] mt-1">{item.instruction}</p>
                          <span className="text-[10px] font-mono text-[#A8B3BE]/70 mt-0.5 block">
                            Dispenser: {item.compartment}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {item.status === 'pending' ? (
                          <button
                            onClick={() => handleAcknowledge(item.id, item.name)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-black text-xs font-black tracking-wide uppercase transition-all shadow-md cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>TAKE NOW</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAcknowledge(item.id, item.name)}
                            className="px-3 py-1.5 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] text-xs font-bold cursor-pointer"
                          >
                            Re-verify
                          </button>
                        )}
                        <button
                          onClick={() => handleRemindMe(item.time, item.name)}
                          className="p-2 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#D97706] border border-[#263541] text-xs font-bold transition-all cursor-pointer"
                          title="Set Alarm / Reminder"
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {remindMessage && (
                <div className="p-3 rounded-2xl bg-[#17232D] border border-[#22C55E] text-[#22C55E] text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>{remindMessage}</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ======================================================== */
        /* MEDICATION FEATURE SETTINGS                             */
        /* ======================================================== */
        <div className="space-y-6">
          <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D97706]" />
                Medication Feature Settings & Dispensary Automation
              </h2>
              <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
                Configure reminder intervals, caregiver escalation delays, and smart dispenser sync.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Reminder Lead Time */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Reminder Lead Time
                </label>
                <p className="text-xs text-[#A8B3BE]">How far in advance ARAN announces upcoming doses:</p>
                <div className="flex gap-2 pt-1">
                  {[5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setMedSettings({ ...medSettings, reminderLeadMinutes: mins })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        medSettings.reminderLeadMinutes === mins
                          ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                          : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Voice Audio Announcement */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Voice Reminders
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Speak medicine name and instructions aloud</p>
                </div>
                <button
                  onClick={() => setMedSettings({ ...medSettings, voiceAnnounce: !medSettings.voiceAnnounce })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    medSettings.voiceAnnounce ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      medSettings.voiceAnnounce ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Caregiver Escalation on Missed Dose */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Caregiver Alert Escalation
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Notify primary contact if dose is 30m overdue</p>
                </div>
                <button
                  onClick={() =>
                    setMedSettings({
                      ...medSettings,
                      caregiverEscalation: !medSettings.caregiverEscalation,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    medSettings.caregiverEscalation ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      medSettings.caregiverEscalation ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Smart Dispenser Compartment Sync */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Hardware Dispenser Sync
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Auto-unlock slots at scheduled pill times</p>
                </div>
                <button
                  onClick={() =>
                    setMedSettings({ ...medSettings, dispenserSync: !medSettings.dispenserSync })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    medSettings.dispenserSync ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      medSettings.dispenserSync ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  speakText('Medication settings updated successfully.');
                  setActiveTab('schedule');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-bold shadow-md shadow-[#713F12]/30 border border-[#A16207]/40 transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety & Medical Advice Guardrail Notice */}
      <div className="p-4 rounded-2xl bg-[#17232D] border border-[#263541] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#A8B3BE]">
          <strong className="text-[#F5F7FA] block font-bold font-mono">ARAN CLINICAL DISPENSING GUARDRAIL:</strong>
          <p>
            ARAN monitors schedule compliance and adherence logging only. ARAN does not provide medical advice,
            prescribe drugs, or change medication dosages. Any modifications must be directed to Dr. Sundaram or your primary care physician.
          </p>
        </div>
      </div>
    </div>
  );
};
