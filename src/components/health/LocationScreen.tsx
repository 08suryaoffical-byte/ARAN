import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Navigation,
  Radio,
  Home,
  Compass,
  AlertTriangle,
  Volume2,
  Clock,
  Settings,
  Sliders,
} from 'lucide-react';

interface LocationScreenProps {
  onBack?: () => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({ onBack }) => {
  const { speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'map' | 'settings'>('map');

  const [isInSafeZone, setIsInSafeZone] = useState(true);
  const [currentTime, setCurrentTime] = useState('10:09 AM');

  // Location Feature Settings
  const [locSettings, setLocSettings] = useState({
    safeZoneRadiusMeters: 250,
    geofenceAlertDelayMinutes: 2,
    liveGpsPacing: 'Battery Optimized (5 min)',
  });

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

  const toggleSafeZone = () => {
    const next = !isInSafeZone;
    setIsInSafeZone(next);
    if (!next) {
      speakText(
        language === 'ta'
          ? 'எச்சரிக்கை: மூத்தவர் பாதுகாப்பு எல்லையைத் தாண்டியுள்ளார்!'
          : 'Warning: Senior safe zone perimeter breach detected!'
      );
    } else {
      speakText(
        language === 'ta'
          ? 'மூத்தவர் வீடு பாதுகாப்பு எல்லைக்குள் உள்ளார்.'
          : 'Senior is within the home safe zone perimeter.'
      );
    }
  };

  const handleSpeakStatus = () => {
    speakText(
      language === 'ta'
        ? `தற்போதைய இருப்பிடம்: வீடு பாதுகாப்பு மண்டலம். சாதனம் சரியாக இயங்குகிறது.`
        : `Current location: Home Safe Zone. Device GPS and cellular tracking active.`
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
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                LOCATION & SAFETY GEOFENCE
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">GPS Triangulation & Wandering Prevention</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#111A22] p-1 rounded-2xl border border-[#263541]">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-[#713F12] text-[#F5F7FA] shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
              }`}
            >
              Live Geofence
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
              <span>Feature Settings</span>
            </button>
          </div>

          <button
            onClick={handleSpeakStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] text-[#F5F7FA] border border-[#263541] text-xs font-bold transition-all cursor-pointer hover:bg-[#263541]"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>

      {activeTab === 'map' ? (
        <>
          {/* MAP CANVAS & RADAR VISUALIZATION */}
          <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Concentric Radar Rings for Safe Zone */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer boundary */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#263541] animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-[#263541]" />
              <div className="absolute inset-16 rounded-full border border-[#263541]" />

              {/* Safe zone highlight circle */}
              <div
                className={`absolute inset-4 rounded-full transition-all duration-700 flex items-center justify-center ${
                  isInSafeZone ? 'bg-[#22C55E]/10 border-2 border-[#22C55E]/50' : 'bg-[#EF4444]/10 border-2 border-[#EF4444]'
                }`}
              >
                {/* Home Anchor Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#111A22] border border-[#263541] shadow-md flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#D97706]" />
                </div>
              </div>

              {/* Pin pointing to senior position */}
              <div
                className={`absolute transition-all duration-500 transform ${
                  isInSafeZone ? 'translate-x-4 -translate-y-6' : 'translate-x-28 -translate-y-20'
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg text-white ${
                      isInSafeZone ? 'bg-[#22C55E]' : 'bg-[#EF4444] animate-bounce'
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-[#F5F7FA]" />
                  </div>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-[#F5F7FA] whitespace-nowrap bg-[#111A22] px-2 py-0.5 rounded-md border border-[#263541]">
                    Lakshmi
                  </span>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-8">
              {isInSafeZone ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111A22] text-[#22C55E] text-xs font-mono font-bold border border-[#22C55E]/40">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>INSIDE HOME SAFE ZONE ({locSettings.safeZoneRadiusMeters}M RADIUS)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111A22] text-[#EF4444] text-xs font-mono font-bold border border-[#EF4444] animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  <span>SAFE ZONE BREACH · OUTSIDE 250M PERIMETER</span>
                </div>
              )}
            </div>

            {/* Simulation Toggle */}
            <div className="mt-6">
              <button
                onClick={toggleSafeZone}
                className="px-5 py-2.5 rounded-2xl bg-[#111A22] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {isInSafeZone ? 'Simulate Geofence Breach' : 'Reset to Inside Safe Zone'}
              </button>
            </div>
          </div>
        </>
      ) : (
        /* LOCATION SETTINGS TAB */
        <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#D97706]" />
              Safe Zone Perimeter & GPS Tracking Settings
            </h2>
            <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
              Configure safe radius perimeter, wandering alert trigger delays, and battery-optimized GPS updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono">
                  Safe Perimeter Radius
                </span>
                <span className="text-xs font-mono font-bold bg-[#17232D] border border-[#263541] px-2 py-0.5 rounded text-[#D97706]">
                  {locSettings.safeZoneRadiusMeters} meters
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={locSettings.safeZoneRadiusMeters}
                onChange={(e) =>
                  setLocSettings({
                    ...locSettings,
                    safeZoneRadiusMeters: Number(e.target.value),
                  })
                }
                className="w-full accent-[#713F12] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
              <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                Breach Alert Confirmation Delay
              </label>
              <div className="flex gap-2 pt-1">
                {[1, 2, 3, 5].map((mins) => (
                  <button
                    key={mins}
                    onClick={() =>
                      setLocSettings({ ...locSettings, geofenceAlertDelayMinutes: mins })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      locSettings.geofenceAlertDelayMinutes === mins
                        ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                        : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                speakText('Location perimeter settings updated.');
                setActiveTab('map');
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
          Registered Home Address: 42, 4th Cross Street, Besant Nagar, Chennai. Safe zone geofence centered on Hub base station.
        </p>
      </div>
    </div>
  );
};
