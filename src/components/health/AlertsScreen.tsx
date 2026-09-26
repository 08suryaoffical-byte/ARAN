import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { HealthScreenType } from '../../types/aran';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  AlertTriangle,
  Bell,
  Heart,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Ambulance,
  Radio,
  WifiOff,
  BatteryLow,
  MapPin,
  CheckCircle2,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Settings,
  Sliders,
  Check,
} from 'lucide-react';

interface AlertsScreenProps {
  onBack?: () => void;
  onOpenScreen: (screen: HealthScreenType) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ onBack, onOpenScreen }) => {
  const { alerts, acknowledgeAlert, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'triage' | 'settings'>('triage');

  // Alert Settings state
  const [alertSettings, setAlertSettings] = useState({
    audibleSirenOnCritical: true,
    autoEscalateDelayMinutes: 5,
    nightDoNotDisturbForLow: true,
    smsAlertToCaregiver: true,
  });

  const alertCategories: {
    id: HealthScreenType;
    label: string;
    tamilLabel: string;
    description: string;
    level: 'HIGH PRIORITY' | 'ATTENTION' | 'NORMAL';
    icon: any;
    color: string;
    badgeBg: string;
    borderColor: string;
  }[] = [
    {
      id: 'high-bp',
      label: 'High Blood Pressure',
      tamilLabel: 'உயர் இரத்த அழுத்தம்',
      description: 'Persistent arterial systolic >130 mmHg or diastolic >85 mmHg.',
      level: 'ATTENTION',
      icon: Activity,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'room-heat',
      label: 'Room Heat Stress',
      tamilLabel: 'அறை வெப்ப எச்சரிக்கை',
      description: 'Indoor ambient temperature >35°C without adequate air flow.',
      level: 'ATTENTION',
      icon: Thermometer,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'fall',
      label: 'Fall Safety & Motion Alert',
      tamilLabel: 'வீழ்ச்சி மற்றும் இயக்க எச்சரிக்கை',
      description: 'Tri-axial accelerometer impact detected followed by prolonged rest.',
      level: 'HIGH PRIORITY',
      icon: AlertTriangle,
      color: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'border-[#EF4444]/60',
    },
    {
      id: 'ambulance-108',
      label: '108 Ambulance Dispatch',
      tamilLabel: '108 ஆம்புலன்ஸ் அனுப்பப்பட்டது',
      description: 'Emergency medical services notified and ambulance vehicle en route.',
      level: 'HIGH PRIORITY',
      icon: Ambulance,
      color: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'border-[#EF4444]/60',
    },
    {
      id: 'water-alert',
      label: 'Hydration Deficit Alert',
      tamilLabel: 'நீர் அருந்துதல் குறைவு',
      description: 'Water intake below 500ml by mid-afternoon. Dehydration risk.',
      level: 'ATTENTION',
      icon: Droplets,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#263541]',
    },
    {
      id: 'low-spo2',
      label: 'Low Blood Oxygen (SpO₂ <95%)',
      tamilLabel: 'குறைந்த ஆக்ஸிஜன் அளவு',
      description: 'Peripheral oxygen saturation below clinical baseline.',
      level: 'ATTENTION',
      icon: Wind,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'low-activity',
      label: 'Prolonged Sedentary Inactivity',
      tamilLabel: 'நீண்ட நேரம் அசைவின்மை',
      description: 'No physical movement registered for 60+ minutes during daytime.',
      level: 'ATTENTION',
      icon: Activity,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#263541]',
    },
    {
      id: 'heart-attention',
      label: 'Elevated / Irregular Pulse',
      tamilLabel: 'இதயத் துடிப்பு மாறுபாடு',
      description: 'Heart rate sustained outside 65-85 BPM resting baseline.',
      level: 'ATTENTION',
      icon: Heart,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'missed-checkin',
      label: 'Missed Routine Check-in',
      tamilLabel: 'தவறிய காலை உறுதிப்படுத்தல்',
      description: 'Morning 8:00 AM check-in was not acknowledged within grace period.',
      level: 'ATTENTION',
      icon: Bell,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'sos',
      label: 'SOS Emergency Triggered',
      tamilLabel: 'அவசர SOS செயல்படுத்தப்பட்டது',
      description: 'Senior or caregiver triggered full emergency broadcast protocol.',
      level: 'HIGH PRIORITY',
      icon: ShieldAlert,
      color: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'border-[#EF4444]/60',
    },
    {
      id: 'safe-zone-breach',
      label: 'Safe Zone Breach',
      tamilLabel: 'பாதுகாப்பு எல்லை விலகல்',
      description: 'Senior moved outside the configured 250m safe perimeter geofence.',
      level: 'ATTENTION',
      icon: MapPin,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'offline',
      label: 'Device Offline',
      tamilLabel: 'சாதனம் ஆஃப்லைனில் உள்ளது',
      description: 'ARAN Hub disconnected from cellular LTE and home Wi-Fi gateway.',
      level: 'ATTENTION',
      icon: WifiOff,
      color: '#667085',
      badgeBg: 'rgba(102, 112, 133, 0.15)',
      borderColor: 'border-[#263541]',
    },
    {
      id: 'battery-low',
      label: 'Low Battery (<15%)',
      tamilLabel: 'குறைந்த பேட்டரி அளவு',
      description: 'Device battery level is critical. Connect magnetic charging dock.',
      level: 'ATTENTION',
      icon: BatteryLow,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-[#F59E0B]/40',
    },
    {
      id: 'normal-baseline',
      label: 'Normal Baseline Overview',
      tamilLabel: 'இயல்பான உடல்நிலை கண்ணோட்டம்',
      description: 'Personalized baseline configuration and target physiological ranges.',
      level: 'NORMAL',
      icon: ShieldCheck,
      color: '#22C55E',
      badgeBg: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'border-[#22C55E]/40',
    },
  ];

  const handleSpeakSummary = () => {
    speakText(
      language === 'ta'
        ? `எச்சரிக்கைகள் பிரிவு: உயர் இரத்த அழுத்தம், வீழ்ச்சி, அறை வெப்பம், ஆக்ஸிஜன் மற்றும் அவசர 108 ஆம்புலன்ஸ் ஆகிய ஒவ்வொரு திரையையும் கிளிக் செய்து பார்க்கலாம்.`
        : `Alerts and Emergency triage: Click any component to open its dedicated individual screen.`
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
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                SAFETY & CLINICAL ALERTS
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">Individual Component Emergency Triage Hub</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-[#111A22] p-1 rounded-2xl border border-[#263541]">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'triage'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              Alerts Hub
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
              <span>Threshold Settings</span>
            </button>
          </div>

          <button
            onClick={handleSpeakSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] text-[#F5F7FA] border border-[#263541] text-xs font-bold transition-all cursor-pointer hover:bg-[#263541]"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>

      {activeTab === 'triage' ? (
        <>
          {/* Active Banner Notice */}
          <div className="p-4 rounded-2xl bg-[#17232D] border border-[#263541] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-[#F5F7FA] block font-bold font-mono">INDIVIDUAL COMPONENT ACCESS:</strong>
              <p className="text-[#A8B3BE]">
                Tap any alert below to navigate directly into that feature's dedicated screen, inspect live readings,
                and review triggered actions or emergency dispatches.
              </p>
            </div>
          </div>

          {/* Grid of Alert Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenScreen(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-101 hover:shadow-xl bg-[#17232D] hover:border-[#A16207] ${item.borderColor}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#111A22] border border-[#263541] shrink-0 shadow-xs">
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-[#F5F7FA]">{item.label}</strong>
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider"
                            style={{
                              color: item.color,
                              backgroundColor: item.badgeBg,
                              borderColor: item.color,
                            }}
                          >
                            ● {item.level}
                          </span>
                        </div>
                        <span className="text-xs text-[#A8B3BE] font-medium block mt-0.5">
                          {item.tamilLabel}
                        </span>
                        <p className="text-xs text-[#A8B3BE]/80 mt-1.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#111A22] border border-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* ======================================================== */
        /* ALERTS THRESHOLD SETTINGS                               */
        /* ======================================================== */
        <div className="space-y-6">
          <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D97706]" />
                Alerts & Clinical Escalation Settings
              </h2>
              <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
                Configure auto-escalation timer, audible alarm sirens, and SMS broadcast triggers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Audible Siren */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Audible Alarm Siren
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Loud audio tone on Hub for Fall or Critical SOS</p>
                </div>
                <button
                  onClick={() =>
                    setAlertSettings({
                      ...alertSettings,
                      audibleSirenOnCritical: !alertSettings.audibleSirenOnCritical,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    alertSettings.audibleSirenOnCritical ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      alertSettings.audibleSirenOnCritical ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Auto-escalation delay */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Escalation Chain Delay
                </label>
                <p className="text-xs text-[#A8B3BE]">Time before notifying secondary contact if primary doesn't answer:</p>
                <div className="flex gap-2 pt-1">
                  {[3, 5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      onClick={() =>
                        setAlertSettings({ ...alertSettings, autoEscalateDelayMinutes: mins })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        alertSettings.autoEscalateDelayMinutes === mins
                          ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                          : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Night Do Not Disturb */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Night Quiet Hours for Low Priority
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Silence minor reminders between 10 PM and 6 AM</p>
                </div>
                <button
                  onClick={() =>
                    setAlertSettings({
                      ...alertSettings,
                      nightDoNotDisturbForLow: !alertSettings.nightDoNotDisturbForLow,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    alertSettings.nightDoNotDisturbForLow ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      alertSettings.nightDoNotDisturbForLow ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. SMS Broadcast */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    SMS Broadcast to Family
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Send immediate SMS in addition to app push notifications</p>
                </div>
                <button
                  onClick={() =>
                    setAlertSettings({
                      ...alertSettings,
                      smsAlertToCaregiver: !alertSettings.smsAlertToCaregiver,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    alertSettings.smsAlertToCaregiver ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      alertSettings.smsAlertToCaregiver ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  speakText('Alert thresholds and escalation settings saved.');
                  setActiveTab('triage');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-bold shadow-md shadow-[#713F12]/30 border border-[#A16207]/40 transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
