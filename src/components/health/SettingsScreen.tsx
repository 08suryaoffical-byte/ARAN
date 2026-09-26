import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { translations, availableLanguages } from '../../utils/translations';
import { Language, LivingArrangement } from '../../types/aran';
import {
  ArrowLeft,
  Settings,
  ShieldCheck,
  Heart,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Sliders,
  Volume2,
  Globe,
  Bell,
  CheckCircle2,
  Save,
  RotateCw,
  Users,
  Eye,
  Type,
  MapPin,
} from 'lucide-react';

interface SettingsScreenProps {
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const {
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    speakText,
    senior,
    updateSenior,
  } = useAran();

  const [hrMin, setHrMin] = useState(65);
  const [hrMax, setHrMax] = useState(85);
  const [bpSys, setBpSys] = useState(130);
  const [bpDia, setBpDia] = useState(85);
  const [tempMax, setTempMax] = useState(37.5);
  const [spo2Min, setSpo2Min] = useState(95);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [geofenceRadius, setGeofenceRadius] = useState(250);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const livingArrangement = senior.livingArrangement || 'independent';

  const handleSave = () => {
    setSavedSuccess(true);
    speakText(
      language === 'ta'
        ? 'மருத்துவ அளவுருக்கள் மற்றும் அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன.'
        : 'Baseline medical thresholds and system preferences saved successfully.'
    );
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLivingArrangementChange = (arr: LivingArrangement) => {
    updateSenior({ livingArrangement: arr });
    speakText(
      language === 'ta'
        ? `வாழ்க்கை ஏற்பாடு ${arr} ஆக மாற்றப்பட்டது.`
        : `Living arrangement updated to ${arr}. Care network escalation updated.`
    );
  };

  return (
    <div className="rounded-3xl border border-[#263541] bg-[#0B1117] shadow-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300 text-[#F5F7FA]">
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
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                ARAN SYSTEM & THRESHOLD SETTINGS
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">Physiological Baseline, Living Arrangement & Care Automation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] border border-[#22C55E] text-[#22C55E] text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </div>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-black tracking-wide uppercase transition-all shadow-md shadow-[#713F12]/30 border border-[#A16207]/40 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE ALL</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LIVING ARRANGEMENT & CARE NETWORK PREFERENCE */}
      <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-sm font-black text-[#F5F7FA] uppercase tracking-wider font-mono">
              Living Arrangement & Escalation Chain
            </h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#111A22] text-[#22C55E] border border-[#263541]">
            Adaptive Care Mode
          </span>
        </div>

        <p className="text-xs text-[#A8B3BE]">
          Select the patient's current living arrangement. ARAN dynamically configures the escalation hierarchy:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { id: 'family', title: 'With Family', desc: 'Daughter → Son → Doctor → 108' },
            { id: 'independent', title: 'Independently', desc: 'Caregiver → Neighbor → Doctor → 108' },
            { id: 'relatives', title: 'With Relatives', desc: 'Relative 1 → Caregiver → Doctor → 108' },
            { id: 'partner', title: 'With Partner', desc: 'Partner → Secondary → Doctor → 108' },
            { id: 'home_care', title: 'Home Care In-charge', desc: 'In-charge → Staff → Doctor → 108' },
          ].map((arr) => {
            const isSelected = livingArrangement === arr.id;
            return (
              <button
                key={arr.id}
                onClick={() => handleLivingArrangementChange(arr.id as LivingArrangement)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#713F12] border-[#A16207] text-[#F5F7FA] shadow-md shadow-[#713F12]/30 ring-1 ring-[#A16207]'
                    : 'bg-[#111A22] border-[#263541] text-[#A8B3BE] hover:bg-[#17232D] hover:text-[#F5F7FA]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-xs font-bold text-[#F5F7FA]">{arr.title}</strong>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />}
                </div>
                <span className="text-[10px] text-[#A8B3BE] block leading-tight">{arr.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CLINICAL BASELINE SENSOR THRESHOLDS */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-[#F5F7FA] uppercase tracking-wider flex items-center gap-2 font-mono">
          <Sliders className="w-4 h-4 text-[#D97706]" />
          Personal Physiological Baselines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Heart Rate Baseline */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#D97706]" />
                Heart Rate Baseline
              </span>
              <span className="text-xs font-mono font-bold text-[#D97706] bg-[#111A22] px-2 py-0.5 rounded-lg border border-[#263541]">
                {hrMin}–{hrMax} BPM
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#A8B3BE]">
                <span>Min: {hrMin} BPM</span>
                <span>Max: {hrMax} BPM</span>
              </div>
              <input
                type="range"
                min="50"
                max="75"
                value={hrMin}
                onChange={(e) => setHrMin(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <input
                type="range"
                min="75"
                max="110"
                value={hrMax}
                onChange={(e) => setHrMax(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Blood Pressure Target */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#D97706]" />
                BP Alert Cutoff
              </span>
              <span className="text-xs font-mono font-bold text-[#D97706] bg-[#111A22] px-2 py-0.5 rounded-lg border border-[#263541]">
                &lt; {bpSys}/{bpDia} mmHg
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#A8B3BE]">
                <span>Systolic: {bpSys}</span>
                <span>Diastolic: {bpDia}</span>
              </div>
              <input
                type="range"
                min="115"
                max="155"
                value={bpSys}
                onChange={(e) => setBpSys(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <input
                type="range"
                min="75"
                max="100"
                value={bpDia}
                onChange={(e) => setBpDia(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>
          </div>

          {/* 3. SpO2 Oxygen Floor */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-[#22C55E]" />
                SpO₂ Oxygen Alert
              </span>
              <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#111A22] px-2 py-0.5 rounded-lg border border-[#263541]">
                &lt; {spo2Min}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#A8B3BE]">
                <span>Low Oxygen Alarm Trigger</span>
                <span>{spo2Min}%</span>
              </div>
              <input
                type="range"
                min="90"
                max="98"
                value={spo2Min}
                onChange={(e) => setSpo2Min(Number(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Ambient Room Heat Alarm */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-[#F59E0B]" />
                Ambient Heat Warning
              </span>
              <span className="text-xs font-mono font-bold text-[#F59E0B] bg-[#111A22] px-2 py-0.5 rounded-lg border border-[#263541]">
                &gt; {tempMax}°C
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#A8B3BE]">
                <span>Heat stress warning cutoff</span>
                <span>{tempMax}°C</span>
              </div>
              <input
                type="range"
                min="34"
                max="40"
                step="0.5"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Daily Water Intake Target */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#D97706]" />
                Hydration Goal
              </span>
              <span className="text-xs font-mono font-bold text-[#D97706] bg-[#111A22] px-2 py-0.5 rounded-lg border border-[#263541]">
                {waterGoal} ml
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#A8B3BE]">
                <span>Daily Target</span>
                <span>{waterGoal} ml / day</span>
              </div>
              <input
                type="range"
                min="1200"
                max="3000"
                step="100"
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Geofence Safe Zone */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                Safe Zone Radius
              </span>
              <span className="text-xs font-mono font-bold text-[#F59E0B] bg-[#111A22] px-2 py-0.5 rounded-lg border border-[#263541]">
                {geofenceRadius} meters
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#A8B3BE]">
                <span>Geofence perimeter around home</span>
                <span>{geofenceRadius} m</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ACCESSIBILITY & AUDIO READOUTS */}
      <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-black text-[#F5F7FA] uppercase tracking-wider flex items-center gap-2 font-mono">
          <Eye className="w-4 h-4 text-[#D97706]" />
          Accessibility & Speech Interface
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Audio Chimes */}
          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-[#F5F7FA] block">Voice Announcements</strong>
              <span className="text-xs text-[#A8B3BE]">Read out vitals and alerts</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEnabled ? 'bg-[#713F12]' : 'bg-[#263541]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Large Font */}
          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-[#F5F7FA] block">Extra Large Font</strong>
              <span className="text-xs text-[#A8B3BE]">High readability for seniors</span>
            </div>
            <button
              onClick={() =>
                updateSenior({
                  accessibility: {
                    ...senior.accessibility,
                    extraLargeFont: !senior.accessibility.extraLargeFont,
                  },
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                senior.accessibility.extraLargeFont ? 'bg-[#713F12]' : 'bg-[#263541]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                  senior.accessibility.extraLargeFont ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-[#F5F7FA] block">High Contrast Mode</strong>
              <span className="text-xs text-[#A8B3BE]">Sharper borders & bold glyphs</span>
            </div>
            <button
              onClick={() =>
                updateSenior({
                  accessibility: {
                    ...senior.accessibility,
                    highContrast: !senior.accessibility.highContrast,
                  },
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                senior.accessibility.highContrast ? 'bg-[#713F12]' : 'bg-[#263541]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                  senior.accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
