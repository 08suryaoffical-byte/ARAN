import React from 'react';
import { useAran } from '../../context/AranContext';
import { ArrowLeft, Cpu, Battery, Wifi, Bluetooth, Radio, ShieldCheck, Heart, Thermometer, Footprints, Wind, MapPin } from 'lucide-react';

interface DeviceStatusScreenProps {
  onBack: () => void;
}

export const DeviceStatusScreen: React.FC<DeviceStatusScreenProps> = ({ onBack }) => {
  const { sensor, senior } = useAran();

  const isLowBattery = sensor.batteryLevel <= 20;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Health Today</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Firmware:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
            v3.4.1-companion
          </span>
        </div>
      </div>

      {/* Main 3D / Illustrated ARAN Device Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Illustrated ARAN Device */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white text-center relative overflow-hidden flex flex-col items-center justify-center shadow-xl">
          {/* Glowing Aura Ring */}
          <div className="w-44 h-44 rounded-full bg-cyan-500/20 absolute blur-xl animate-pulse" />

          {/* Hub Mockup Device */}
          <div className="w-36 h-36 rounded-3xl bg-slate-800 border-2 border-cyan-400/40 p-4 relative z-10 flex flex-col items-center justify-between shadow-2xl">
            {/* Top Status LED */}
            <div className="flex items-center justify-between w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold text-cyan-400">{sensor.batteryLevel}%</span>
            </div>

            {/* Central ARAN Logo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Cpu className="w-7 h-7 text-white" />
            </div>

            {/* Bottom Label */}
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              ARAN-001 HUB
            </span>
          </div>

          <div className="mt-6 z-10">
            <h3 className="text-2xl font-black tracking-tight text-white">ARAN Companion Hub</h3>
            <p className="text-xs text-cyan-300 font-medium mt-0.5">Device ID: {senior.deviceId}</p>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              🟢 Connected & Telemetry Syncing
            </div>
          </div>
        </div>

        {/* Right: Connectivity & Sensor Status Matrix */}
        <div className="space-y-6">
          {/* Battery State Box */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isLowBattery ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Battery className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Battery Level
                </span>
                <strong className={`text-2xl font-black ${isLowBattery ? 'text-amber-600' : 'text-slate-900'}`}>
                  {sensor.batteryLevel}%
                </strong>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
              {sensor.isCharging ? '⚡ Charging' : 'Magnetic Dock Standby'}
            </span>
          </div>

          {/* Wireless Radios */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Bluetooth className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Bluetooth</span>
              <strong className="text-xs font-bold text-emerald-700">Connected</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Wifi className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Wi-Fi</span>
              <strong className="text-xs font-bold text-emerald-700">Connected</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Radio className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Cellular</span>
              <strong className="text-xs font-bold text-emerald-700">Active</strong>
            </div>
          </div>

          {/* Sensor Channels Status List */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sensor Channels
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Heart Rate
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Connected</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Temperature
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Connected</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Footprints className="w-4 h-4 text-emerald-500" />
                  Motion & IMU
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Connected</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Wind className="w-4 h-4 text-cyan-500" />
                  SpO2 Pulse
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Connected</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between sm:col-span-2">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  Safe Zone Location (Adyar, Chennai)
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Inside Zone ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
