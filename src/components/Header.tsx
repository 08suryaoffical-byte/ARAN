import React from 'react';
import { useAran } from '../context/AranContext';
import { Role, Language } from '../types/aran';
import { translations, availableLanguages } from '../utils/translations';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  User,
  Users,
  Shield,
  Activity,
  Cpu,
  Globe,
  FileText,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenSos: () => void;
  onOpenChat: () => void;
  onOpenOnboarding: () => void;
  onOpenReport: () => void;
  showHardwareHub: boolean;
  setShowHardwareHub: (val: boolean) => void;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSos,
  onOpenChat,
  onOpenOnboarding,
  onOpenReport,
  showHardwareHub,
  setShowHardwareHub,
  onToggleMobileNav,
}) => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    senior,
    sensor,
    isSosActive,
  } = useAran();

  const t = translations[language] || translations.en;

  return (
    <header className="sticky top-0 z-30 bg-[#111A22]/90 backdrop-blur-md border-b border-[#263541] shadow-lg text-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Mobile menu toggle & brand identity */}
        <div className="flex items-center gap-3">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 rounded-xl bg-[#17232D] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <img
              src="/ARAN.png"
              alt="ARAN Logo"
              className="w-10 h-10 rounded-2xl object-contain shadow-md shadow-black/50 border border-[#263541] bg-[#0B1117] p-0.5 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#F5F7FA]">{t.appName}</span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] bg-[#713F12]/30 border border-[#A16207]/40 px-2 py-0.5 rounded-full">
                  Care
                </span>
              </div>
              <p className="text-[11px] text-[#A8B3BE] font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Monitoring Status Badge */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#17232D] border border-[#263541] text-xs font-mono font-bold text-[#D97706]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-live-dot shrink-0" />
          <span className="font-extrabold tracking-wider">● LIVE MONITORING</span>
          <span className="text-[#A8B3BE]">·</span>
          <span className="text-[#22C55E]">NORMAL</span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Patient Care Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-[#263541] bg-[#17232D] text-[#F5F7FA] hover:bg-[#263541] hover:border-[#A16207] transition-all cursor-pointer"
            title={t.patientReport}
          >
            <FileText className="w-4 h-4 text-[#D97706]" />
            <span className="hidden md:inline">{t.patientReportBtn}</span>
          </button>

          {/* Toggle Physical ARAN Hardware Showcase */}
          <button
            onClick={() => setShowHardwareHub(!showHardwareHub)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showHardwareHub
                ? 'bg-[#713F12] border-[#A16207] text-[#F5F7FA]'
                : 'bg-[#17232D] border-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#263541]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#D97706]" />
            <span>{t.hardwareHub}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#17232D] border border-[#263541] px-2.5 py-1.5 rounded-xl text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-[#A8B3BE] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[#F5F7FA] font-bold focus:outline-none cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#111A22] text-[#F5F7FA]">
                  {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Sound Voice Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Voice Audio Speech"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#713F12] border-[#A16207] text-[#F5F7FA]'
                : 'bg-[#17232D] border-[#263541] text-[#A8B3BE]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F5F7FA]" /> : <VolumeX className="w-4 h-4 text-[#A8B3BE]" />}
          </button>

          {/* Emergency SOS Quick Button */}
          <button
            onClick={onOpenSos}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-lg cursor-pointer ${
              isSosActive
                ? 'bg-[#EF4444] text-white animate-bounce ring-2 ring-[#EF4444]'
                : 'bg-[#EF4444] hover:bg-red-600 text-white shadow-red-950/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSosActive ? '🔴 SOS ACTIVATED' : t.sosBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
