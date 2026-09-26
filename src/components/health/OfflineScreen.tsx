import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  WifiOff,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Power,
  HelpCircle,
} from 'lucide-react';

interface OfflineScreenProps {
  onBack: () => void;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ onBack }) => {
  const { updateSensor, speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  const handleReconnect = () => {
    setReconnecting(true);
    setTimeout(() => {
      setReconnecting(false);
      setReconnected(true);
      updateSensor({
        isConnected: true,
        bluetoothConnected: true,
        wifiConnected: true,
      });
      speakText(
        language === 'ta'
          ? 'அரண் சாதனம் மீண்டும் இணைக்கப்பட்டது.'
          : 'ARAN companion hub reconnected successfully.'
      );
    }, 2000);
  };

  return (
    <div className="bg-[#0B1117] rounded-3xl border border-[#263541] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200 text-[#F5F7FA]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] text-xs font-bold transition-all cursor-pointer border border-[#263541]"
        >
          <ArrowLeft className="w-4 h-4 text-[#D97706]" />
          <span>← Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#667085]" />
          <span className="px-2.5 py-1 rounded-full bg-[#667085]/20 border border-[#667085]/40 text-[#667085] text-xs font-bold font-mono">
            STATUS: OFFLINE
          </span>
        </div>
      </div>

      {/* Main Offline Card */}
      <div className="p-8 rounded-3xl bg-[#17232D] border border-[#263541] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#111A22] border border-[#667085]/40 text-[#667085] flex items-center justify-center shadow-lg">
          <WifiOff className="w-8 h-8 text-[#667085]" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#667085] uppercase tracking-widest block mb-1">
            HARDWARE CONNECTIVITY NOTICE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FA] tracking-tight">
            ARAN DEVICE OFFLINE
          </h2>
          <p className="text-xs text-[#A8B3BE] mt-1 max-w-md mx-auto">
            Hub heartbeat signal lost on Wi-Fi and Bluetooth channels for &gt;2 minutes. Physical device may be unplugged or local internet is down.
          </p>
        </div>

        {/* Step-by-Step Reconnection Guide */}
        <div className="w-full max-w-md p-5 rounded-2xl bg-[#111A22] border border-[#263541] text-left space-y-3 text-xs">
          <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
            Quick Diagnostic Steps
          </h4>

          <div className="space-y-2 text-[#A8B3BE]">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#17232D] text-[#F5F7FA] font-bold flex items-center justify-center text-[10px] shrink-0 border border-[#263541]">1</span>
              <span>Verify ARAN Hub power cable is securely plugged into wall outlet.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#17232D] text-[#F5F7FA] font-bold flex items-center justify-center text-[10px] shrink-0 border border-[#263541]">2</span>
              <span>Check home Wi-Fi router (Lakshmi_Home_5G) status.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#17232D] text-[#F5F7FA] font-bold flex items-center justify-center text-[10px] shrink-0 border border-[#263541]">3</span>
              <span>Tap the top dome of ARAN Hub once to trigger automatic cellular failover.</span>
            </div>
          </div>
        </div>

        {/* Reconnect Action */}
        <div className="pt-2 w-full max-w-xs">
          {reconnected ? (
            <div className="p-3.5 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>● Device Reconnected & Live</span>
            </div>
          ) : (
            <button
              onClick={handleReconnect}
              disabled={reconnecting}
              className="w-full py-3.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-4 h-4 text-[#F5F7FA] ${reconnecting ? 'animate-spin' : ''}`} />
              <span>{reconnecting ? 'CONNECTING TO HUB...' : 'RETRY CONNECTION'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
