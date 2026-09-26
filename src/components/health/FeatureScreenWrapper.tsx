import React from 'react';
import { useAran } from '../../context/AranContext';
import { HealthScreenType } from '../../types/aran';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Heart,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Moon,
  MapPin,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Utensils,
  Bot,
  Radio,
  BatteryLow,
  Settings,
  Volume2,
  VolumeX,
  LayoutDashboard,
  Sparkles,
  Users,
} from 'lucide-react';

import { HeartRateScreen } from './HeartRateScreen';
import { BloodPressureScreen } from './BloodPressureScreen';
import { TemperatureScreen } from './TemperatureScreen';
import { SpO2Screen } from './SpO2Screen';
import { ActivityScreen } from './ActivityScreen';
import { HydrationScreen } from './HydrationScreen';
import { SleepScreen } from './SleepScreen';
import { LocationScreen } from './LocationScreen';
import { MedicationScreen } from './MedicationScreen';
import { CheckInScreen } from './CheckInScreen';
import { MealScreen } from './MealScreen';
import { AranAiScreen } from './AranAiScreen';
import { AlertsScreen } from './AlertsScreen';
import { SettingsScreen } from './SettingsScreen';
import { DeviceStatusScreen } from './DeviceStatusScreen';
import { LowBatteryScreen } from './LowBatteryScreen';
import { LiveMonitoringScreen } from './LiveMonitoringScreen';
import { NormalBaselineScreen } from './NormalBaselineScreen';
import { HeartRateAttentionScreen } from './HeartRateAttentionScreen';
import { RoomHeatScreen } from './RoomHeatScreen';
import { FallSafetyScreen } from './FallSafetyScreen';
import { Ambulance108Screen } from './Ambulance108Screen';
import { MissedCheckInScreen } from './MissedCheckInScreen';
import { SosScreen } from './SosScreen';
import { OfflineScreen } from './OfflineScreen';
import { SafeZoneBreachScreen } from './SafeZoneBreachScreen';
import { CareNetworkScreen } from './CareNetworkScreen';

interface FeatureScreenWrapperProps {
  currentFeature: HealthScreenType;
  onBack: () => void;
  onSelectFeature: (feature: HealthScreenType) => void;
  onOpenSos?: () => void;
  onOpenChat?: () => void;
}

export const FeatureScreenWrapper: React.FC<FeatureScreenWrapperProps> = ({
  currentFeature,
  onBack,
  onSelectFeature,
  onOpenSos,
  onOpenChat,
}) => {
  const { language, setLanguage, soundEnabled, setSoundEnabled, speakText } = useAran();
  const t = translations[language] || translations.en;

  const featureTabs: { id: HealthScreenType; label: string; icon: any; color: string }[] = [
    { id: 'heart', label: 'Heart Rate', icon: Heart, color: 'text-[#713F12]' },
    { id: 'bp', label: 'Blood Pressure', icon: Activity, color: 'text-[#713F12]' },
    { id: 'temp', label: 'Temperature', icon: Thermometer, color: 'text-[#C58A00]' },
    { id: 'spo2', label: 'SpO₂', icon: Wind, color: 'text-[#2F7D5A]' },
    { id: 'activity', label: 'Activity', icon: Activity, color: 'text-[#2F7D5A]' },
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: 'text-[#713F12]' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-[#713F12]' },
    { id: 'location', label: 'Location', icon: MapPin, color: 'text-[#C58A00]' },
    { id: 'medication', label: 'Medication', icon: Pill, color: 'text-[#713F12]' },
    { id: 'meals', label: 'Meals', icon: Utensils, color: 'text-[#713F12]' },
    { id: 'ai-talk', label: 'Talk to ARAN', icon: Bot, color: 'text-[#713F12]' },
    { id: 'care-network', label: 'Care Network', icon: Users, color: 'text-[#713F12]' },
    { id: 'checkin', label: 'Check-in', icon: CheckCircle2, color: 'text-[#2F7D5A]' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, color: 'text-[#C58A00]' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-[#713F12]' },
    { id: 'device', label: 'Device Hub', icon: Radio, color: 'text-[#5F6B6D]' },
    { id: 'sos', label: 'Emergency', icon: ShieldAlert, color: 'text-[#B42318]' },
  ];

  const renderActiveScreen = () => {
    switch (currentFeature) {
      case 'care-network':
        return <CareNetworkScreen onBack={onBack} />;
      case 'heart':
        return <HeartRateScreen onBack={onBack} />;
      case 'bp':
      case 'high-bp':
        return <BloodPressureScreen onBack={onBack} />;
      case 'temp':
        return <TemperatureScreen onBack={onBack} />;
      case 'spo2':
      case 'low-spo2':
        return <SpO2Screen onBack={onBack} />;
      case 'activity':
      case 'low-activity':
        return <ActivityScreen onBack={onBack} />;
      case 'hydration':
      case 'water-alert':
        return <HydrationScreen onBack={onBack} />;
      case 'sleep':
        return <SleepScreen onBack={onBack} />;
      case 'location':
        return <LocationScreen onBack={onBack} />;
      case 'medication':
        return <MedicationScreen onBack={onBack} />;
      case 'meals':
        return <MealScreen onBack={onBack} />;
      case 'ai-talk':
        return <AranAiScreen onBack={onBack} />;
      case 'checkin':
        return <CheckInScreen onBack={onBack} onOpenChat={onOpenChat} />;
      case 'alerts':
        return <AlertsScreen onBack={onBack} onOpenScreen={onSelectFeature} />;
      case 'settings':
        return <SettingsScreen onBack={onBack} />;
      case 'device':
        return <DeviceStatusScreen onBack={onBack} />;
      case 'battery-low':
        return <LowBatteryScreen onBack={onBack} />;
      case 'sos':
        return <SosScreen onBack={onBack} />;
      case 'live':
        return <LiveMonitoringScreen onBack={onBack} onOpenParam={(p) => onSelectFeature(p as HealthScreenType)} />;
      case 'normal-baseline':
        return <NormalBaselineScreen onBack={onBack} onOpenParam={(p) => onSelectFeature(p as HealthScreenType)} />;
      case 'heart-attention':
        return <HeartRateAttentionScreen onBack={onBack} />;
      case 'room-heat':
        return <RoomHeatScreen onBack={onBack} onLogWater={() => {}} />;
      case 'fall':
        return <FallSafetyScreen onBack={onBack} onOpenSos={onOpenSos || (() => {})} />;
      case 'ambulance-108':
        return <Ambulance108Screen onBack={onBack} />;
      case 'missed-checkin':
        return <MissedCheckInScreen onBack={onBack} onOpenSos={onOpenSos || (() => {})} />;
      case 'offline':
        return <OfflineScreen onBack={onBack} />;
      case 'safe-zone-breach':
        return <SafeZoneBreachScreen onBack={onBack} />;
      default:
        return <HeartRateScreen onBack={onBack} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Feature Switcher & Navigation Header */}
      <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Back to Dashboard Button */}
        <div className="flex items-center gap-3">
          <img
            src="/ARAN.png"
            alt="ARAN Logo"
            className="w-9 h-9 rounded-xl object-contain bg-[#0B1117] border border-[#263541] shrink-0 p-0.5"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-black tracking-wide uppercase shadow-md shadow-[#713F12]/30 transition-all cursor-pointer hover:scale-105 shrink-0 border border-[#A16207]/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Dashboard</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#A8B3BE] hidden sm:inline-block">
            FEATURE SCREEN ACTIVE
          </span>
        </div>

        {/* Horizontal Scrollable Feature Switcher Toggle */}
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 px-1 max-w-full scrollbar-thin scrollbar-thumb-[#263541]">
          {featureTabs.map((item) => {
            const Icon = item.icon;
            const isSelected =
              currentFeature === item.id ||
              (item.id === 'bp' && currentFeature === 'high-bp') ||
              (item.id === 'temp' && currentFeature === 'room-heat') ||
              (item.id === 'spo2' && currentFeature === 'low-spo2') ||
              (item.id === 'heart' && currentFeature === 'heart-attention');

            return (
              <button
                key={item.id}
                onClick={() => onSelectFeature(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207] shadow-md shadow-[#713F12]/30'
                    : 'bg-[#111A22] text-[#A8B3BE] hover:bg-[#17232D] hover:text-[#F5F7FA] border border-[#263541]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F5F7FA]' : 'text-[#A8B3BE]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio speech indicator */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border border-[#263541] text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                : 'bg-[#111A22] text-[#A8B3BE]'
            }`}
            title={soundEnabled ? 'Speech Announcements On' : 'Speech Announcements Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F5F7FA]" /> : <VolumeX className="w-4 h-4 text-[#A8B3BE]" />}
          </button>
        </div>
      </div>

      {/* The Full Feature Screen */}
      <div>{renderActiveScreen()}</div>
    </div>
  );
};
