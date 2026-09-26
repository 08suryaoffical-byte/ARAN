import React from 'react';
import { useAran } from '../context/AranContext';
import { HealthScreenType, Role, Language } from '../types/aran';
import { translations, availableLanguages } from '../utils/translations';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Moon,
  MapPin,
  Pill,
  Utensils,
  Bot,
  Users,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Radio,
  User,
  Shield,
  Volume2,
  VolumeX,
  Globe,
  FileText,
  ShieldAlert,
} from 'lucide-react';

interface NavigationSidebarProps {
  onOpenSos: () => void;
  onOpenChat: () => void;
  onOpenReport: () => void;
  onOpenOnboarding: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  onOpenSos,
  onOpenChat,
  onOpenReport,
  onOpenOnboarding,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    activeHealthScreen,
    setActiveHealthScreen,
    isSosActive,
  } = useAran();

  const t = translations[language] || translations.en;

  const menuItems: { id: HealthScreenType; label: string; icon: React.ElementType }[] = [
    { id: 'none', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'heart', label: 'Heart Rate & ECG', icon: Heart },
    { id: 'bp', label: 'Blood Pressure', icon: Activity },
    { id: 'temp', label: 'Temperature', icon: Thermometer },
    { id: 'spo2', label: 'SpO₂ Oxygen', icon: Wind },
    { id: 'activity', label: 'Activity & Mobility', icon: Activity },
    { id: 'hydration', label: 'Hydration Intake', icon: Droplets },
    { id: 'sleep', label: 'Sleep Monitoring', icon: Moon },
    { id: 'location', label: 'Safe Zone & GPS', icon: MapPin },
    { id: 'medication', label: 'Medications', icon: Pill },
    { id: 'meals', label: 'Meal Timings', icon: Utensils },
    { id: 'ai-talk', label: 'Talk to ARAN AI', icon: Bot },
    { id: 'care-network', label: 'Care Network', icon: Users },
    { id: 'checkin', label: 'Scheduled Check-in', icon: CheckCircle2 },
    { id: 'alerts', label: 'Clinical Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'device', label: 'Hardware Hub', icon: Radio },
  ];

  const handleSelect = (id: HealthScreenType) => {
    setActiveHealthScreen(id);
    if (id === 'ai-talk') {
      onOpenChat();
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#111A22] border-r border-[#263541] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#263541] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/ARAN.png"
            alt="ARAN Logo"
            className="w-10 h-10 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] p-0.5 shadow-md shadow-black/40 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#F5F7FA]">ARAN</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] bg-[#713F12]/30 border border-[#A16207]/40 px-2 py-0.5 rounded-full">
                Care
              </span>
            </div>
            <p className="text-[10px] text-[#A8B3BE] font-medium leading-tight mt-0.5">
              Every Heartbeat Deserves Safety.
            </p>
          </div>
        </div>

        {/* Live indicator dot */}
        <div className="flex items-center gap-1.5" title="Live Health-Tech Stream">
          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-live-dot" />
          <span className="text-[10px] font-mono font-bold text-[#D97706] hidden xl:inline">LIVE</span>
        </div>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-[#263541]">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#A8B3BE] font-bold">
          Navigation & Sensors
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeHealthScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                isSelected
                  ? 'bg-[#713F12] text-[#F5F7FA] shadow-md shadow-[#713F12]/30 border border-[#A16207]'
                  : 'text-[#A8B3BE] hover:bg-[#17232D] hover:text-[#F5F7FA]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isSelected ? 'text-[#F5F7FA]' : 'text-[#A8B3BE]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Controls: Role, Language, Sound, SOS */}
      <div className="p-4 border-t border-[#263541] bg-[#0B1117]/80 space-y-3">
        {/* Role Switcher */}
        <div className="bg-[#17232D] border border-[#263541] p-1 rounded-xl grid grid-cols-3 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setRole('senior')}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              role === 'senior' ? 'bg-[#713F12] text-[#F5F7FA]' : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Senior</span>
          </button>
          <button
            onClick={() => setRole('caregiver')}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              role === 'caregiver' ? 'bg-[#713F12] text-[#F5F7FA]' : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Caregiver</span>
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              role === 'admin' ? 'bg-[#713F12] text-[#F5F7FA]' : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

        {/* Language & Voice controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex-1 flex items-center gap-1.5 bg-[#17232D] border border-[#263541] px-2.5 py-1.5 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-[#A8B3BE] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full bg-transparent text-[#F5F7FA] font-bold text-xs focus:outline-none cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#111A22] text-[#F5F7FA]">
                  {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#713F12] border-[#A16207] text-[#F5F7FA]'
                : 'bg-[#17232D] border-[#263541] text-[#A8B3BE]'
            }`}
            title="Toggle Voice Speech"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Medical Report Modal */}
          <button
            onClick={onOpenReport}
            className="p-2 rounded-xl bg-[#17232D] hover:bg-[#263541] border border-[#263541] text-[#F5F7FA] transition-all cursor-pointer"
            title="Clinical Patient Report"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* SOS Emergency Button: In emergency red #EF4444 */}
        <button
          onClick={onOpenSos}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            isSosActive
              ? 'bg-[#EF4444] text-white animate-bounce ring-2 ring-[#EF4444]/60'
              : 'bg-[#EF4444] hover:bg-red-600 text-white shadow-red-900/30'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isSosActive ? '🔴 SOS ACTIVATED' : t.sosBtn}</span>
        </button>
      </div>
    </aside>
  );
};
