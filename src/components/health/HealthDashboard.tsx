import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { HealthScreenType, Language } from '../../types/aran';
import { translations } from '../../utils/translations';
import { localizedData } from '../../utils/localizedData';
import {
  Menu,
  X,
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
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Ambulance,
  WifiOff,
  Sun,
  ShieldCheck,
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

interface HealthDashboardProps {
  onOpenSos?: () => void;
  onOpenChat?: () => void;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ onOpenSos, onOpenChat }) => {
  const {
    sensor,
    alerts,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    speakText,
    isSosActive,
    activeHealthScreen,
    setActiveHealthScreen,
  } = useAran();

  const t = translations[language] || translations.en;
  const [selectedFeature, setSelectedFeature] = useState<HealthScreenType>('heart');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync external activeHealthScreen with local selection if triggered externally
  useEffect(() => {
    if (activeHealthScreen && activeHealthScreen !== 'none') {
      setSelectedFeature(activeHealthScreen);
    }
  }, [activeHealthScreen]);

  const handleSelectFeature = (feature: HealthScreenType) => {
    setSelectedFeature(feature);
    setActiveHealthScreen(feature);

    // Speak announcement in current language
    const names: Record<string, string> = {
      heart: language === 'ta' ? 'இருதய துடிப்பு திரை' : 'Heart Rate',
      bp: language === 'ta' ? 'இரத்த அழுத்த திரை' : 'Blood Pressure',
      temp: language === 'ta' ? 'உடல் வெப்பநிலை திரை' : 'Temperature',
      spo2: language === 'ta' ? 'ஆக்ஸிஜன் அளவு திரை' : 'SpO2 Oxygen',
      activity: language === 'ta' ? 'உடற்பயிற்சி மற்றும் அசைவு திரை' : 'Activity & Movement',
      hydration: language === 'ta' ? 'நீரேற்ற நிலை திரை' : 'Hydration Status',
      sleep: language === 'ta' ? 'உறக்க நிலை திரை' : 'Sleep Analysis',
      location: language === 'ta' ? 'இருப்பிடம் மற்றும் பாதுகாப்பு திரை' : 'Location & Geofence',
      medication: language === 'ta' ? 'மருந்து அட்டவணை திரை' : 'Medication Schedule',
      checkin: language === 'ta' ? 'தினசரி சரிபார்ப்பு திரை' : 'Daily Check-in',
      meals: language === 'ta' ? 'உணவு அட்டவணை திரை' : 'Daily Meals',
      'ai-talk': language === 'ta' ? 'ARAN செயற்கை நுண்ணறிவு உதவியாளர்' : 'Talk to ARAN',
      alerts: language === 'ta' ? 'பாதுகாப்பு எச்சரிக்கைகள்' : 'Safety Alerts',
      sos: language === 'ta' ? 'அவசர SOS உதவி' : 'Emergency SOS',
      device: language === 'ta' ? 'ARAN சாதனம்' : 'ARAN Device',
      'battery-low': language === 'ta' ? 'பேட்டரி நிலை' : 'Battery Status',
      settings: language === 'ta' ? 'அமைப்புகள் மற்றும் வரம்புகள்' : 'System Settings',
    };
    if (names[feature]) {
      speakText(names[feature]);
    }
  };

  // Navigation Items per prompt specification
  const navSections = [
    {
      title: 'HEALTH',
      items: [
        { id: 'heart', label: 'Heart Rate', tamilLabel: 'இருதய துடிப்பு', icon: Heart, color: 'text-rose-500' },
        { id: 'bp', label: 'Blood Pressure', tamilLabel: 'இரத்த அழுத்தம்', icon: Activity, color: 'text-blue-400' },
        { id: 'temp', label: 'Temperature', tamilLabel: 'உடல் வெப்பநிலை', icon: Thermometer, color: 'text-orange-400' },
        { id: 'spo2', label: 'SpO₂', tamilLabel: 'ஆக்ஸிஜன் அளவு', icon: Wind, color: 'text-cyan-400' },
        { id: 'activity', label: 'Activity', tamilLabel: 'உடற்பயிற்சி', icon: Activity, color: 'text-emerald-400' },
        { id: 'hydration', label: 'Hydration', tamilLabel: 'நீரேற்றம்', icon: Droplets, color: 'text-blue-400' },
        { id: 'sleep', label: 'Sleep', tamilLabel: 'உறக்கம்', icon: Moon, color: 'text-indigo-400' },
      ],
    },
    {
      title: 'SAFETY',
      items: [
        { id: 'location', label: 'Location', tamilLabel: 'இருப்பிடம்', icon: MapPin, color: 'text-yellow-400' },
        { id: 'alerts', label: 'Alerts', tamilLabel: 'எச்சரிக்கைகள்', icon: AlertTriangle, color: 'text-amber-400' },
        { id: 'sos', label: 'Emergency', tamilLabel: 'அவசர உதவி', icon: ShieldAlert, color: 'text-red-500' },
        { id: 'checkin', label: 'Check-in', tamilLabel: 'சரிபார்ப்பு', icon: CheckCircle2, color: 'text-emerald-400' },
      ],
    },
    {
      title: 'CARE',
      items: [
        { id: 'medication', label: 'Medication', tamilLabel: 'மருந்துகள்', icon: Pill, color: 'text-purple-400' },
        { id: 'meals', label: 'Meals', tamilLabel: 'உணவு', icon: Utensils, color: 'text-amber-400' },
        { id: 'ai-talk', label: 'Talk to ARAN', tamilLabel: 'ARAN-உடன் பேசுங்கள்', icon: Bot, color: 'text-cyan-400' },
      ],
    },
    {
      title: 'DEVICE',
      items: [
        { id: 'device', label: 'ARAN Device', tamilLabel: 'சாதனம்', icon: Radio, color: 'text-slate-400' },
        { id: 'battery-low', label: 'Battery', tamilLabel: 'பேட்டரி', icon: BatteryLow, color: 'text-amber-400' },
        { id: 'settings', label: 'Settings', tamilLabel: 'அமைப்புகள்', icon: Settings, color: 'text-cyan-400' },
      ],
    },
  ];

  // Render the Selected Feature in the Right Side Content Area
  const renderSelectedFeature = () => {
    switch (selectedFeature) {
      case 'heart':
        return <HeartRateScreen />;
      case 'bp':
      case 'high-bp':
        return <BloodPressureScreen />;
      case 'temp':
        return <TemperatureScreen />;
      case 'spo2':
      case 'low-spo2':
        return <SpO2Screen />;
      case 'activity':
      case 'low-activity':
        return <ActivityScreen />;
      case 'hydration':
      case 'water-alert':
        return <HydrationScreen />;
      case 'sleep':
        return <SleepScreen />;
      case 'location':
        return <LocationScreen />;
      case 'medication':
        return <MedicationScreen />;
      case 'checkin':
        return <CheckInScreen onOpenChat={onOpenChat} />;
      case 'meals':
        return <MealScreen />;
      case 'ai-talk':
        return <AranAiScreen />;
      case 'alerts':
        return <AlertsScreen onOpenScreen={(scr) => handleSelectFeature(scr)} />;
      case 'settings':
        return <SettingsScreen />;
      case 'device':
        return <DeviceStatusScreen onBack={() => handleSelectFeature('heart')} />;
      case 'battery-low':
        return <LowBatteryScreen onBack={() => handleSelectFeature('heart')} />;
      case 'live':
        return (
          <LiveMonitoringScreen
            onBack={() => handleSelectFeature('heart')}
            onOpenParam={(p) => handleSelectFeature(p as HealthScreenType)}
          />
        );
      case 'normal-baseline':
        return (
          <NormalBaselineScreen
            onBack={() => handleSelectFeature('heart')}
            onOpenParam={(p) => handleSelectFeature(p as HealthScreenType)}
          />
        );
      case 'heart-attention':
        return <HeartRateAttentionScreen onBack={() => handleSelectFeature('heart')} />;
      case 'room-heat':
        return <RoomHeatScreen onBack={() => handleSelectFeature('heart')} onLogWater={() => {}} />;
      case 'fall':
        return <FallSafetyScreen onBack={() => handleSelectFeature('heart')} onOpenSos={onOpenSos || (() => {})} />;
      case 'ambulance-108':
        return <Ambulance108Screen onBack={() => handleSelectFeature('heart')} />;
      case 'missed-checkin':
        return <MissedCheckInScreen onBack={() => handleSelectFeature('heart')} onOpenSos={onOpenSos || (() => {})} />;
      case 'sos':
        return <SosScreen onBack={() => handleSelectFeature('heart')} />;
      case 'offline':
        return <OfflineScreen onBack={() => handleSelectFeature('heart')} />;
      case 'safe-zone-breach':
        return <SafeZoneBreachScreen onBack={() => handleSelectFeature('heart')} />;
      default:
        return <HeartRateScreen />;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[780px]">
      {/* ======================================================== */}
      {/* 1. LEFT SIDE: COMPLETE NAVIGATION WITH ☰ MENU HAMBURGER  */}
      {/* ======================================================== */}
      <aside
        className={`border-r border-slate-800/80 bg-slate-950/95 flex flex-col transition-all duration-300 z-20 shrink-0 ${
          isSidebarOpen ? 'w-full md:w-64 lg:w-72' : 'w-full md:w-20'
        }`}
      >
        {/* Top Hamburger & ARAN Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              title="Toggle Menu"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-300" />}
            </button>

            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-base">ARAN</span>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                  HEALTH
                </span>
              </div>
            )}
          </div>

          {/* Audio speech indicator / toggle */}
          {isSidebarOpen && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 text-xs transition-colors cursor-pointer"
              title={soundEnabled ? 'Voice Announcements Active' : 'Voice Announcements Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Menu Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              {isSidebarOpen ? (
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest px-3 block">
                  {sec.title}
                </span>
              ) : (
                <div className="w-6 mx-auto border-t border-slate-800 my-2" />
              )}

              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedFeature === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectFeature(item.id as HealthScreenType)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border border-slate-700 shadow-md font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                      }`}
                      title={item.label}
                    >
                      <div
                        className={`p-1.5 rounded-xl shrink-0 transition-transform ${
                          isSelected ? 'bg-slate-800 scale-110 shadow-sm' : 'bg-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>

                      {isSidebarOpen && (
                        <div className="flex-1 truncate">
                          <span className="text-xs font-semibold block">{item.label}</span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {item.tamilLabel}
                          </span>
                        </div>
                      )}

                      {isSidebarOpen && isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Access to Clinical Alert Screens */}
          {isSidebarOpen && (
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest px-3 block">
                SPECIAL CLINICAL
              </span>
              <div className="grid grid-cols-2 gap-1.5 px-1">
                <button
                  onClick={() => handleSelectFeature('normal-baseline')}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-left border transition-all cursor-pointer ${
                    selectedFeature === 'normal-baseline'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ● Baseline
                </button>
                <button
                  onClick={() => handleSelectFeature('live')}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-left border transition-all cursor-pointer ${
                    selectedFeature === 'live'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ● Live Mode
                </button>
                <button
                  onClick={() => handleSelectFeature('fall')}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-left border transition-all cursor-pointer ${
                    selectedFeature === 'fall'
                      ? 'bg-red-950 text-red-300 border-red-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ● Fall Alert
                </button>
                <button
                  onClick={() => handleSelectFeature('room-heat')}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-left border transition-all cursor-pointer ${
                    selectedFeature === 'room-heat'
                      ? 'bg-orange-950 text-orange-300 border-orange-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ● Room Heat
                </button>
                <button
                  onClick={() => handleSelectFeature('ambulance-108')}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-left border transition-all cursor-pointer ${
                    selectedFeature === 'ambulance-108'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ● 108 Dispatch
                </button>
                <button
                  onClick={() => handleSelectFeature('safe-zone-breach')}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-left border transition-all cursor-pointer ${
                    selectedFeature === 'safe-zone-breach'
                      ? 'bg-yellow-950 text-yellow-300 border-yellow-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ● Safe Zone
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Multi-Language Speaking Selector */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 px-1 font-bold">
              Speaking Language:
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { code: 'en', label: 'EN' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'tanglish', label: 'Tang' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'ml', label: 'മല' },
                { code: 'te', label: 'தெலு' },
                { code: 'kn', label: 'கன்ன' },
                { code: 'gu', label: 'ગુજ' },
                { code: 'fr', label: 'FR' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code as any);
                    speakText(
                      l.code === 'ta'
                        ? 'மொழி தமிழ் என அமைக்கப்பட்டது.'
                        : `Voice set to ${l.label}.`
                    );
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ======================================================== */}
      {/* 2. RIGHT SIDE: SELECTED FEATURE (BIG VISUALIZATION, ETC.) */}
      {/* ======================================================== */}
      <main className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderSelectedFeature()}
      </main>
    </div>
  );
};
