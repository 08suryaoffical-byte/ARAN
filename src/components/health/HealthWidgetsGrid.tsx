import React from 'react';
import { useAran } from '../../context/AranContext';
import { HealthScreenType } from '../../types/aran';
import {
  Heart,
  Thermometer,
  Wind,
  Activity,
  Droplets,
  ChevronRight,
  TrendingUp,
  Waves,
} from 'lucide-react';

interface HealthWidgetsGridProps {
  onSelectFeature: (feature: HealthScreenType) => void;
}

export const HealthWidgetsGrid: React.FC<HealthWidgetsGridProps> = ({ onSelectFeature }) => {
  const { sensor } = useAran();

  const widgets = [
    {
      id: 'heart' as HealthScreenType,
      title: 'HEART RATE',
      icon: Heart,
      iconColor: '#D97706',
      iconBg: '#713F12',
      value: `${sensor.heartRate || 72}`,
      unit: 'BPM',
      status: sensor.heartRate && (sensor.heartRate < 60 || sensor.heartRate > 88) ? 'ATTENTION' : 'NORMAL',
      statusColor: sensor.heartRate && (sensor.heartRate < 60 || sensor.heartRate > 88) ? '#F59E0B' : '#22C55E',
      statusBg: sensor.heartRate && (sensor.heartRate < 60 || sensor.heartRate > 88) ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
      description: 'Continuous sinus rhythm',
      bars: [45, 52, 48, 88, 56, 50, 48, 92, 54, 50, 48, 85, 52],
    },
    {
      id: 'temp' as HealthScreenType,
      title: 'TEMPERATURE',
      icon: Thermometer,
      iconColor: '#D97706',
      iconBg: '#713F12',
      value: `${sensor.temperature || 36.6}°`,
      unit: 'C',
      status: sensor.temperature && sensor.temperature > 37.5 ? 'ATTENTION' : 'NORMAL',
      statusColor: sensor.temperature && sensor.temperature > 37.5 ? '#F59E0B' : '#22C55E',
      statusBg: sensor.temperature && sensor.temperature > 37.5 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
      description: 'Axillary thermistor normal',
      bars: [36, 36.2, 36.4, 36.5, 36.6, 36.6, 36.7, 36.6, 36.6, 36.5, 36.6, 36.6, 36.6],
    },
    {
      id: 'spo2' as HealthScreenType,
      title: 'SpO₂',
      icon: Wind,
      iconColor: '#D97706',
      iconBg: '#713F12',
      value: `${sensor.spo2 || 98}`,
      unit: '%',
      status: sensor.spo2 && sensor.spo2 < 95 ? 'ATTENTION' : 'NORMAL',
      statusColor: sensor.spo2 && sensor.spo2 < 95 ? '#F59E0B' : '#22C55E',
      statusBg: sensor.spo2 && sensor.spo2 < 95 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
      description: 'Blood oxygen saturation',
      bars: [97, 98, 98, 99, 98, 97, 98, 98, 99, 98, 98, 98, 98],
    },
    {
      id: 'bp' as HealthScreenType,
      title: 'BLOOD PRESSURE',
      icon: Activity,
      iconColor: '#D97706',
      iconBg: '#713F12',
      value: sensor.bloodPressureRate || '122/82',
      unit: 'mmHg',
      status: 'NORMAL',
      statusColor: '#22C55E',
      statusBg: 'rgba(34,197,94,0.15)',
      description: 'Systolic / Diastolic range',
      bars: [120, 122, 121, 124, 122, 123, 122, 121, 123, 122, 122, 124, 122],
    },
    {
      id: 'activity' as HealthScreenType,
      title: 'ACTIVITY',
      icon: Activity,
      iconColor: '#D97706',
      iconBg: '#713F12',
      value: 'ACTIVE',
      unit: `${sensor.steps || 4820} steps`,
      status: 'NORMAL',
      statusColor: '#22C55E',
      statusBg: 'rgba(34,197,94,0.15)',
      description: 'Accelerometer & gait steady',
      bars: [20, 40, 65, 80, 45, 90, 75, 60, 85, 95, 70, 60, 80],
    },
    {
      id: 'hydration' as HealthScreenType,
      title: 'HYDRATION',
      icon: Droplets,
      iconColor: '#D97706',
      iconBg: '#713F12',
      value: `${sensor.hydrationLevel || 65}`,
      unit: '%',
      status: sensor.hydrationLevel && sensor.hydrationLevel < 40 ? 'ATTENTION' : 'NORMAL',
      statusColor: sensor.hydrationLevel && sensor.hydrationLevel < 40 ? '#F59E0B' : '#22C55E',
      statusBg: sensor.hydrationLevel && sensor.hydrationLevel < 40 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
      description: '1,300 mL consumed today',
      bars: [30, 45, 50, 55, 60, 65, 65, 65, 65, 65, 65, 65, 65],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-live-dot" />
          <h3 className="text-sm font-black font-mono tracking-wider uppercase text-[#F5F7FA]">
            REAL-TIME HEALTH TELEMETRY WIDGETS
          </h3>
        </div>
        <span className="text-xs text-[#A8B3BE] font-mono">Click card to open dedicated controls</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => {
          const Icon = w.icon;

          return (
            <div
              key={w.id}
              onClick={() => onSelectFeature(w.id)}
              className="bg-[#17232D] border border-[#263541] hover:border-[#A16207] p-5 rounded-3xl transition-all duration-200 cursor-pointer group hover:scale-102 hover:shadow-xl hover:shadow-black/50 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Row: Icon, Title & Status */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border border-[#263541] group-hover:border-[#A16207] transition-all bg-[#111A22]"
                      style={{
                        boxShadow: '0 0 10px rgba(113,63,18,0.3)',
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-transform group-hover:scale-110"
                        style={{ color: w.iconColor }}
                      />
                    </div>
                    <span className="text-xs font-black font-mono tracking-wider text-[#A8B3BE] group-hover:text-[#F5F7FA] transition-colors">
                      {w.title}
                    </span>
                  </div>

                  <span
                    className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                    style={{
                      color: w.statusColor,
                      backgroundColor: w.statusBg,
                      borderColor: w.statusColor,
                    }}
                  >
                    ● {w.status}
                  </span>
                </div>

                {/* Main Metric Value */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black font-mono tracking-tight text-[#F5F7FA]">
                    {w.value}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#D97706] tracking-wide">
                    {w.unit}
                  </span>
                </div>
                <p className="text-[11px] text-[#A8B3BE] font-medium mb-4">
                  {w.description}
                </p>
              </div>

              {/* Bottom: Mini animated telemetry graph */}
              <div className="pt-2 border-t border-[#263541]/80 flex items-end justify-between gap-1">
                <div className="flex items-end gap-1 flex-1 h-8">
                  {w.bars.map((val, idx) => {
                    const min = Math.min(...w.bars);
                    const max = Math.max(...w.bars);
                    const heightPercent = max === min ? 50 : Math.max(20, Math.min(100, ((val - min) / (max - min)) * 100));

                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-[#263541] group-hover:bg-[#713F12] transition-colors rounded-t-sm"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: idx === w.bars.length - 1 ? '#D97706' : undefined,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center text-[10px] font-mono font-bold text-[#A8B3BE] group-hover:text-[#D97706] transition-colors ml-2 shrink-0">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
