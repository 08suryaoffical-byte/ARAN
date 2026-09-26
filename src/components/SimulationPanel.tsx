import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import { SimulationScenario } from '../types/aran';
import { translations } from '../utils/translations';
import {
  Play,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Thermometer,
  ShieldAlert,
  WifiOff,
  BatteryLow,
  Droplets,
  Utensils,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
  Sun,
  Ambulance,
  Wind,
} from 'lucide-react';

export const SimulationPanel: React.FC = () => {
  const {
    runSimulation,
    currentScenario,
    setRole,
    setLanguage,
    updateAccessibility,
    senior,
    speakText,
    language,
  } = useAran();

  const t = translations[language] || translations.en;
  const [isOpen, setIsOpen] = useState(true);
  const [activeDemoStep, setActiveDemoStep] = useState<number | null>(null);

  const scenarios: {
    id: SimulationScenario;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'NORMAL',
      label: t.btnNormal,
      description: 'Reset: BP 122/82 mmHg, HR 72 BPM, 29.4°C.',
      icon: <CheckCircle className="w-4 h-4 text-[#22C55E]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#22C55E]/40 hover:border-[#22C55E]',
    },
    {
      id: 'HIGH_BP',
      label: t.btnHighBp,
      description: 'BP 158/98 mmHg. Caregiver alert.',
      icon: <Heart className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B] font-bold',
    },
    {
      id: 'HEAT_WARNING',
      label: t.btnHeat,
      description: '38.6°C room heat index alert.',
      icon: <Sun className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B] font-bold',
    },
    {
      id: 'MOTION_FALL_WARNING',
      label: t.btnMotion,
      description: 'Fall deceleration & immobility warning.',
      icon: <ShieldAlert className="w-4 h-4 text-[#EF4444]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#EF4444]/40 hover:border-[#EF4444] font-bold',
    },
    {
      id: 'WATER_ALERT',
      label: t.btnWater,
      description: 'Daily water deficit check reminder.',
      icon: <Droplets className="w-4 h-4 text-[#D97706]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#263541] hover:border-[#A16207]',
    },
    {
      id: 'LOW_SPO2',
      label: 'SpO₂ Low (93%)',
      description: 'Blood oxygen saturation drops to 93%. Caregiver verification.',
      icon: <Wind className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B] font-bold',
    },
    {
      id: 'POSSIBLE_FALL',
      label: '🔴 Possible Fall Event',
      description: 'Sudden deceleration impact followed by no movement.',
      icon: <ShieldAlert className="w-4 h-4 text-[#EF4444]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#EF4444]/60 hover:border-[#EF4444] font-bold',
    },
    {
      id: 'AMBULANCE_108_DISPATCH',
      label: '🚑 108 Dispatch',
      description: 'Emergency 108 dispatched with active ETA.',
      icon: <Ambulance className="w-4 h-4 text-[#EF4444]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#EF4444]/60 hover:border-[#EF4444] font-bold',
    },
    {
      id: 'ROUTINE_MISSED',
      label: (t as Record<string, any>).btnMissed || 'Missed Check-in',
      description: 'Morning check-in missed alert.',
      icon: <Clock className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B]',
    },
    {
      id: 'HEART_RATE_ATTENTION',
      label: 'HR Spike (104 BPM)',
      description: 'Resting heart rate jumps to 104 BPM.',
      icon: <Heart className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B]',
    },
    {
      id: 'SOS',
      label: t.sos,
      description: 'Emergency broadcast to family & 108/112.',
      icon: <ShieldAlert className="w-4 h-4 text-[#EF4444]" />,
      color: 'bg-[#111A22] text-[#EF4444] border-[#EF4444] hover:bg-[#EF4444]/10 font-bold',
    },
    {
      id: 'DEVICE_OFFLINE',
      label: t.deviceOffline,
      description: 'Hub Wi-Fi or battery disconnect simulation.',
      icon: <WifiOff className="w-4 h-4 text-[#667085]" />,
      color: 'bg-[#111A22] text-[#667085] border-[#263541] hover:border-[#667085]',
    },
    {
      id: 'LOW_BATTERY',
      label: t.battery + ' (14%)',
      description: 'Dock charging reminder for family.',
      icon: <BatteryLow className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B]',
    },
    {
      id: 'LOCATION_CHANGE',
      label: 'Safe Zone Breach',
      description: 'Senior moves outside 450m geofence.',
      icon: <MapPin className="w-4 h-4 text-[#F59E0B]" />,
      color: 'bg-[#111A22] text-[#F5F7FA] border-[#F59E0B]/40 hover:border-[#F59E0B]',
    },
  ];

  const runHackathonStep = (stepNumber: number) => {
    setActiveDemoStep(stepNumber);
    switch (stepNumber) {
      case 1:
        setRole('senior');
        runSimulation('SUCCESSFUL_CHECKIN');
        break;
      case 2:
        setRole('senior');
        runSimulation('HIGH_BP');
        break;
      case 3:
        setRole('caregiver');
        runSimulation('HEAT_WARNING');
        break;
      case 4:
        setRole('senior');
        runSimulation('WATER_ALERT');
        break;
      case 5:
        setRole('senior');
        runSimulation('MOTION_FALL_WARNING');
        break;
      case 6:
        setRole('caregiver');
        runSimulation('AMBULANCE_108_DISPATCH');
        break;
      case 7:
        setRole('senior');
        updateAccessibility({
          canSeeNormally: false,
          canHearNormally: false,
          canSpeakNormally: false,
          canUseSmartphone: false,
          difficultySeeing: true,
          difficultyHearing: true,
          difficultySpeaking: true,
          difficultySmartphone: true,
          highContrast: true,
          extraLargeFont: true,
        });
        speakText('Adaptive accessibility profile activated for maximum senior assistance.');
        break;
    }
  };

  return (
    <div className="bg-[#17232D] text-[#F5F7FA] rounded-3xl border border-[#263541] shadow-2xl overflow-hidden mb-6">
      {/* Top Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 flex items-center justify-between cursor-pointer bg-[#111A22] hover:bg-[#17232D] transition-colors border-b border-[#263541]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#713F12] text-[#F5F7FA] flex items-center justify-center font-bold border border-[#A16207]">
            <Sliders className="w-4 h-4 text-[#D97706]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wide uppercase text-[#D97706] font-mono">
                {t.simulationTitle}
              </span>
              <span className="text-[10px] bg-[#17232D] text-[#D97706] border border-[#263541] px-2 py-0.5 rounded font-mono font-bold">
                14 {t.liveTelemetry}
              </span>
            </div>
            <p className="text-xs text-[#A8B3BE] mt-0.5 font-mono">
              {t.activeStateLabel}:{' '}
              <strong className="text-[#F5F7FA] uppercase">{currentScenario}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A8B3BE] hidden sm:inline font-mono">
            {isOpen ? t.close : 'Expand'}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-[#A8B3BE]" /> : <ChevronDown className="w-5 h-5 text-[#A8B3BE]" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 space-y-6 bg-[#17232D]">
          {/* Quick Guided Walkthrough */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8B3BE] font-mono">
                {t.featureDemos}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
              {[
                { num: 1, label: t.btnNormal },
                { num: 2, label: t.btnHighBp },
                { num: 3, label: t.btnHeat },
                { num: 4, label: t.btnWater },
                { num: 5, label: t.btnMotion },
                { num: 6, label: t.btnAmbulance108 },
                { num: 7, label: t.seniorRole + ' ' + t.normal },
              ].map((step) => (
                <button
                  key={step.num}
                  onClick={() => runHackathonStep(step.num)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeDemoStep === step.num
                      ? 'bg-[#713F12] text-[#F5F7FA] font-bold border-[#A16207] shadow-md shadow-[#713F12]/40'
                      : 'bg-[#111A22] border-[#263541] text-[#A8B3BE] hover:bg-[#17232D] hover:text-[#F5F7FA]'
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-80 block text-[#D97706]">DEMO 0{step.num}</span>
                  <span className="text-xs leading-tight block mt-0.5 truncate">{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Simulation Scenarios */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8B3BE] mb-3 font-mono">
              {t.triggerSpecific}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {scenarios.map((sc) => {
                const isSelected = currentScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => runSimulation(sc.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#D97706] shadow-lg scale-102 ' + sc.color
                        : sc.color
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{sc.icon}</div>
                    <div>
                      <div className="font-extrabold text-xs tracking-tight">{sc.label}</div>
                      <p className="text-[11px] opacity-80 leading-snug mt-0.5">{sc.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
