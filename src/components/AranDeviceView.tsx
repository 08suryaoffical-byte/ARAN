import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import { translations } from '../utils/translations';
import {
  Cpu,
  Layers,
  Eye,
  Radio,
  Wifi,
  BatteryCharging,
  Mic,
  Volume2,
  Activity,
  ShieldAlert,
  Sparkles,
  Bluetooth,
  Server,
  Zap,
} from 'lucide-react';

export const AranDeviceView: React.FC = () => {
  const { sensor, triggerSos, alerts, speakText, language, isSosActive } = useAran();
  const [deviceViewMode, setDeviceViewMode] = useState<'3d-render' | 'exploded' | 'specs'>('3d-render');
  const t = translations[language] || translations.en;

  // Determine LED Ring colors and status state
  const hasCriticalAlert = isSosActive || alerts.some((a) => a.level === 'RED' && a.status === 'active');
  const hasWarningAlert = !hasCriticalAlert && alerts.some((a) => a.level === 'YELLOW' && a.status === 'active');

  const ringGlowClass = hasCriticalAlert
    ? 'shadow-[0_0_50px_rgba(239,68,68,0.7)] border-red-500 animate-pulse'
    : hasWarningAlert
    ? 'shadow-[0_0_35px_rgba(245,158,11,0.6)] border-amber-500'
    : 'shadow-[0_0_35px_rgba(34,197,94,0.5)] border-emerald-500';

  const ringBgColor = hasCriticalAlert
    ? 'bg-red-950/40 text-red-200'
    : hasWarningAlert
    ? 'bg-amber-950/40 text-amber-200'
    : 'bg-emerald-950/40 text-emerald-200';

  const statusLabel = hasCriticalAlert
    ? t.highPriority
    : hasWarningAlert
    ? t.attentionNeeded
    : t.normal;

  const handleDeviceTap = () => {
    const prompt = `${t.goodMorning}! ${t.howAreYou}`;
    speakText(prompt);
  };

  return (
    <div className="bg-[#17232D] rounded-3xl border border-[#263541] shadow-xl overflow-hidden text-[#F5F7FA]">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-[#263541] flex flex-wrap items-center justify-between gap-3 bg-[#111A22]">
        <div className="flex items-center gap-3">
          <img
            src="/ARAN.png"
            alt="ARAN Logo"
            className="w-10 h-10 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] p-0.5 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
              <h2 className="text-base font-bold text-[#F5F7FA] tracking-tight">{t.hubSimulator}</h2>
              <span className="text-xs font-mono text-[#D97706] bg-[#713F12]/30 border border-[#A16207]/40 px-2 py-0.5 rounded-full">
                v3.4.1
              </span>
            </div>
            <p className="text-xs text-[#A8B3BE] mt-0.5">{t.tagline}</p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-[#0B1117] p-1 rounded-xl text-xs font-medium border border-[#263541]">
          <button
            onClick={() => setDeviceViewMode('3d-render')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              deviceViewMode === '3d-render'
                ? 'bg-[#713F12] text-[#F5F7FA] font-bold border border-[#A16207]/40 shadow-sm'
                : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {t.companionView}
          </button>
          <button
            onClick={() => setDeviceViewMode('exploded')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              deviceViewMode === 'exploded'
                ? 'bg-[#713F12] text-[#F5F7FA] font-bold border border-[#A16207]/40 shadow-sm'
                : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.insideAran}
          </button>
          <button
            onClick={() => setDeviceViewMode('specs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              deviceViewMode === 'specs'
                ? 'bg-[#713F12] text-[#F5F7FA] font-bold border border-[#A16207]/40 shadow-sm'
                : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {t.hardwareSpecs}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-6">
        {deviceViewMode === '3d-render' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Device Rendering Mockup */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-[#0B1117] border border-[#263541] rounded-2xl relative overflow-hidden shadow-inner text-[#F5F7FA]">
              {/* Ambient lighting */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
                  hasCriticalAlert ? 'bg-red-500/20' : hasWarningAlert ? 'bg-amber-400/15' : 'bg-[#D97706]/15'
                }`}
              />

              {/* Status header inside rendering */}
              <div className="relative z-10 flex items-center justify-between w-full mb-6 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hasCriticalAlert ? 'bg-[#EF4444] animate-ping' : hasWarningAlert ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                    }`}
                  />
                  <span className="tracking-wider uppercase text-[#F5F7FA]">{statusLabel}</span>
                </div>
                <div className="flex items-center gap-3 text-[#A8B3BE]">
                  <span>12 cm × 5 cm</span>
                  <span>·</span>
                  <span className="text-[#22C55E] font-semibold">{sensor.batteryLevel}% {t.battery.toUpperCase()}</span>
                </div>
              </div>

              {/* ARAN Hardware Physical Dome (Pebble Saucer Shape) */}
              <div className="relative z-10 w-72 sm:w-80 group cursor-pointer my-4" onClick={handleDeviceTap}>
                {/* Glowing LED Ring (Top perimeter) */}
                <div
                  className={`w-full h-32 rounded-t-[100px] border-t-4 border-x-2 transition-all duration-500 ${ringGlowClass} ${ringBgColor} relative flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm`}
                >
                  <div className="w-14 h-14 rounded-full bg-[#0B1117] border border-[#263541] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <img
                      src="/ARAN.png"
                      alt="ARAN Logo"
                      className="w-8 h-8 rounded-lg object-contain"
                    />
                  </div>
                  <span className="text-[10px] tracking-widest text-[#D97706] font-mono uppercase mt-1 font-bold">{t.tapToSpeak}</span>

                  {/* 360 Mic Array dots around edge */}
                  <div className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full bg-[#D97706] animate-ping" />
                  <div className="absolute top-2 right-6 w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  <div className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  <div className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                </div>

                {/* Lower Acoustic Fabric Mesh Base (Charcoal Heather) */}
                <div className="w-full h-20 bg-[#111A22] rounded-b-[40px] border-b-2 border-[#263541] flex items-center justify-center relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
                  <span className="relative z-10 text-xs font-bold tracking-[0.3em] text-[#F5F7FA] font-mono">{t.appName}</span>
                </div>

                <div className="w-64 h-5 mx-auto bg-black/70 rounded-[100%] blur-md mt-2" />
              </div>

              {/* Physical SOS push-button simulator directly on device */}
              <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSos('Physical SOS button on ARAN Hub pressed');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs tracking-wider shadow-lg shadow-red-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-white" />
                  {t.pressPhysicalSos}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeviceTap();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#D97706] text-xs font-semibold border border-[#263541] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.testVoicePrompt}
                </button>
              </div>
            </div>

            {/* Right: Device Telemetry & Sensors */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider font-mono">{t.liveTelemetry}</span>
                <h3 className="text-lg font-bold text-[#F5F7FA]">{t.activeSensorsTitle}</h3>
                <p className="text-xs text-[#A8B3BE]">{t.notMedicalDisclaimer}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {/* Blood Pressure Rate */}
                <div className="p-3 rounded-xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between text-[#A8B3BE] mb-1">
                    <span className="flex items-center gap-1 font-medium text-[#F5F7FA]">
                      <Activity className="w-3.5 h-3.5 text-[#D97706]" />
                      {t.bpRate.split('(')[0]}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="text-base font-black text-[#F5F7FA]">{sensor.bloodPressureRate || '122/82'}</div>
                  <span className="text-[10px] text-[#22C55E]">{t.normal}</span>
                </div>

                {/* Heart Rate */}
                <div className="p-3 rounded-xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between text-[#A8B3BE] mb-1">
                    <span className="flex items-center gap-1 font-medium text-[#F5F7FA]">
                      <Radio className="w-3.5 h-3.5 text-[#D97706]" />
                      {t.heartRate}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="text-base font-black text-[#F5F7FA]">{sensor.heartRate || 72} BPM</div>
                  <span className="text-[10px] text-[#22C55E]">NORMAL (65-85 BPM)</span>
                </div>

                {/* Temperature */}
                <div className="p-3 rounded-xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between text-[#A8B3BE] mb-1">
                    <span className="flex items-center gap-1 font-medium text-[#F5F7FA]">
                      <Radio className="w-3.5 h-3.5 text-[#D97706]" />
                      {t.temperature}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="text-base font-black text-[#F5F7FA]">{sensor.temperature || 36.6}°C</div>
                  <span className="text-[10px] text-[#22C55E]">NORMAL (36.5–37.2°C)</span>
                </div>

                {/* Motion */}
                <div className="p-3 rounded-xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between text-[#A8B3BE] mb-1">
                    <span className="font-medium text-[#F5F7FA]">{t.activity}</span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="text-base font-black text-[#F5F7FA] capitalize">{sensor.motion || 'active'}</div>
                  <span className="text-[10px] text-[#A8B3BE]">IMU 3-Axis</span>
                </div>
              </div>

              {/* Hardware Connection indicators */}
              <div className="p-3.5 bg-[#0B1117] border border-[#263541] text-[#F5F7FA] rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#A8B3BE]">
                    <Wifi className="w-3.5 h-3.5 text-[#22C55E]" />
                    Wi-Fi 6
                  </span>
                  <span className="flex items-center gap-1 text-[#A8B3BE]">
                    <Bluetooth className="w-3.5 h-3.5 text-[#D97706]" />
                    BLE 5.3
                  </span>
                  <span className="flex items-center gap-1 text-[#A8B3BE]">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#22C55E]" />
                    {sensor.batteryLevel}%
                  </span>
                </div>
                <span className="text-[11px] text-[#22C55E] font-mono font-bold uppercase">{t.deviceConnected}</span>
              </div>
            </div>
          </div>
        )}

        {deviceViewMode === 'exploded' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#F5F7FA]">{t.insideAran}</h3>
              <p className="text-xs text-[#A8B3BE]">{t.notMedicalDisclaimer}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Microphone Array */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                  <Mic className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.micArray}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">Quad-beamforming 360° noise cancellation.</p>
              </div>

              {/* 2. Speaker */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                  <Volume2 className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.speakerUnit}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">High-frequency clarity driver tuned for seniors.</p>
              </div>

              {/* 3. AI Chip */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                  <Cpu className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.aiChip}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">On-device neural inference and sensor fusion.</p>
              </div>

              {/* 4. Connectivity Module */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
                  <Wifi className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.wifiBle}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">Wi-Fi 6, Bluetooth 5.3 & Cellular backup.</p>
              </div>

              {/* 5. Memory */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                  <Layers className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.flashMemory}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">Offline storage for baseline routines and voice packs.</p>
              </div>

              {/* 6. Power Management */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
                  <BatteryCharging className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.powerMgmt}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">Magnetic charging and power surge regulation.</p>
              </div>

              {/* 7. Battery */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                  <Activity className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.batteryPack}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">5200 mAh pack with 48 hours continuous monitoring.</p>
              </div>

              {/* 8. LED Ring */}
              <div className="p-4 rounded-xl border border-[#263541] bg-[#111A22]">
                <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                  <Radio className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#F5F7FA]">{t.statusRing}</h4>
                </div>
                <p className="text-xs text-[#A8B3BE] mb-2">Green (Normal), Amber (Attention), Red (SOS Emergency).</p>
              </div>
            </div>
          </div>
        )}

        {deviceViewMode === 'specs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#F5F7FA]">{t.hardwareSpecs}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="font-bold text-[#F5F7FA] block mb-2">Dimensions & Materials</span>
                <p className="text-[#A8B3BE]">Diameter: 12.0 cm · Height: 5.0 cm · Weight: 340g</p>
              </div>
              <div className="p-4 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="font-bold text-[#F5F7FA] block mb-2">Connectivity & Power</span>
                <p className="text-[#A8B3BE]">Wi-Fi 6 · BLE 5.3 · 5200 mAh Battery (48 hrs)</p>
              </div>
              <div className="p-4 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="font-bold text-[#F5F7FA] block mb-2">Accessibility Audio</span>
                <p className="text-[#A8B3BE]">88 dB max senior audio driver · Dual tactile vibration motors</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
