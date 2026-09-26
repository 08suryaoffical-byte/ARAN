import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import {
  Users,
  Cpu,
  Shield,
  Sliders,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Radio,
  Wifi,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { senior, caregivers, sensor, auditLogs, speakText } = useAran();
  const [activeAdminTab, setActiveAdminTab] = useState<'devices' | 'seniors' | 'rules' | 'audit'>('devices');

  // Rule settings state
  const [checkinGrace, setCheckinGrace] = useState(15);
  const [hrLow, setHrLow] = useState(65);
  const [hrHigh, setHrHigh] = useState(95);
  const [inactivityLimit, setInactivityLimit] = useState(3.5);
  const [rulesSaved, setRulesSaved] = useState(false);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    setRulesSaved(true);
    speakText('System alert threshold policies updated.');
    setTimeout(() => setRulesSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 text-[#F5F7FA]">
      {/* Admin Title Card */}
      <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/ARAN.png"
            alt="ARAN Logo"
            className="w-12 h-12 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] p-0.5 shrink-0 shadow-md shadow-black/40"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D97706]" />
              <h1 className="text-xl font-black text-[#F5F7FA] tracking-tight font-mono">
                ARAN SYSTEM ADMINISTRATION
              </h1>
            </div>
            <p className="text-xs text-[#A8B3BE] mt-0.5 font-medium">
              Fleet telemetry, device provisioning, sensor rule matrix, and immutable security audit logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-[#111A22] text-[#22C55E] border border-[#22C55E]/40 font-mono font-bold">
            ● System Operational
          </span>
          <span className="text-[#A8B3BE] font-mono">Build 2026.09.26</span>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#263541] overflow-x-auto pb-1 text-xs font-semibold scrollbar-thin scrollbar-thumb-[#263541]">
        <button
          onClick={() => setActiveAdminTab('devices')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer font-mono ${
            activeAdminTab === 'devices'
              ? 'border-[#D97706] text-[#F5F7FA] font-bold bg-[#17232D]/40'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#D97706]" />
          Device Fleet (ARAN Hubs)
        </button>

        <button
          onClick={() => setActiveAdminTab('seniors')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer font-mono ${
            activeAdminTab === 'seniors'
              ? 'border-[#D97706] text-[#F5F7FA] font-bold bg-[#17232D]/40'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Users className="w-4 h-4 text-[#D97706]" />
          Senior & Caregiver Directory
        </button>

        <button
          onClick={() => setActiveAdminTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer font-mono ${
            activeAdminTab === 'rules'
              ? 'border-[#D97706] text-[#F5F7FA] font-bold bg-[#17232D]/40'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#D97706]" />
          Sensor Fusion Rules & Thresholds
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer font-mono ${
            activeAdminTab === 'audit'
              ? 'border-[#D97706] text-[#F5F7FA] font-bold bg-[#17232D]/40'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#D97706]" />
          Security Audit Logs
        </button>
      </div>

      {/* TAB 1: DEVICE FLEET */}
      {activeAdminTab === 'devices' && (
        <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5F7FA] font-mono">Provisioned ARAN Hardware Hubs</h3>
            <span className="text-xs text-[#22C55E] font-mono font-bold">● 1 Online Hub</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111A22] text-[#A8B3BE] font-semibold border-b border-[#263541] font-mono">
                <tr>
                  <th className="p-3">Device ID</th>
                  <th className="p-3">Assigned Senior</th>
                  <th className="p-3">Connection</th>
                  <th className="p-3">Battery</th>
                  <th className="p-3">Firmware</th>
                  <th className="p-3">Sensors Status</th>
                  <th className="p-3">Last Heartbeat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263541]">
                <tr>
                  <td className="p-3 font-mono font-bold text-[#D97706]">{senior.deviceId}</td>
                  <td className="p-3 font-semibold text-[#F5F7FA]">{senior.name}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#111A22] border border-[#22C55E]/40 text-[#22C55E] font-semibold font-mono">
                      Wi-Fi 6 + BLE Connected
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-[#F5F7FA]">{sensor.batteryLevel}%</td>
                  <td className="p-3 font-mono text-[#A8B3BE]">v3.4.1-companion</td>
                  <td className="p-3">
                    <span className="text-[#22C55E] font-semibold font-mono">7/7 Normal</span>
                  </td>
                  <td className="p-3 text-[#A8B3BE] font-mono">10s ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SENIORS & CAREGIVERS */}
      {activeAdminTab === 'seniors' && (
        <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F7FA] font-mono">Active Senior Profile & Role Binding</h3>

          <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold text-[#F5F7FA]">{senior.name}</strong>
              <span className="text-xs px-2.5 py-0.5 bg-[#713F12] text-[#F5F7FA] rounded font-semibold capitalize font-mono">
                {senior.livingArrangement}
              </span>
            </div>
            <p className="text-[#A8B3BE]">Preferred name: <strong className="text-[#F5F7FA]">{senior.preferredName}</strong> · Age: {senior.age}</p>
            <p className="text-[#A8B3BE]">Address: {senior.homeInfo.address}, {senior.homeInfo.city}</p>
            <div className="pt-2 border-t border-[#263541]">
              <span className="font-bold text-[#D97706] block mb-1 font-mono">Assigned Caregivers:</span>
              <ul className="list-disc pl-4 space-y-1 text-[#A8B3BE]">
                {caregivers.map((cg) => (
                  <li key={cg.id}>
                    <strong className="text-[#F5F7FA]">{cg.name}</strong> ({cg.relationship}) — {cg.phone} [{cg.priority} contact]
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SENSOR RULES CONFIGURATION */}
      {activeAdminTab === 'rules' && (
        <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F7FA] font-mono">AI Fusion Alert Rules & Thresholds</h3>
          <p className="text-xs text-[#A8B3BE]">
            Set safety limits without clinical diagnostic claims. Generates caregiver alerts when combinations deviate from baseline.
          </p>

          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A8B3BE] font-bold mb-1">
                  Scheduled Check-in Grace Period (Minutes)
                </label>
                <input
                  type="number"
                  value={checkinGrace}
                  onChange={(e) => setCheckinGrace(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-[#263541] bg-[#111A22] text-[#F5F7FA] font-bold focus:border-[#A16207] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A8B3BE] font-bold mb-1">
                  Inactivity Alert Timer (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inactivityLimit}
                  onChange={(e) => setInactivityLimit(parseFloat(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#263541] bg-[#111A22] text-[#F5F7FA] font-bold focus:border-[#A16207] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A8B3BE] font-bold mb-1">
                  Lower Heart Rate Warning Threshold (BPM)
                </label>
                <input
                  type="number"
                  value={hrLow}
                  onChange={(e) => setHrLow(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-[#263541] bg-[#111A22] text-[#F5F7FA] font-bold focus:border-[#A16207] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A8B3BE] font-bold mb-1">
                  Upper Heart Rate Warning Threshold (BPM)
                </label>
                <input
                  type="number"
                  value={hrHigh}
                  onChange={(e) => setHrHigh(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-[#263541] bg-[#111A22] text-[#F5F7FA] font-bold focus:border-[#A16207] focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#713F12]/30 cursor-pointer border border-[#A16207]/40 font-mono"
            >
              {rulesSaved ? '✓ Rules Saved & Dispatched' : 'Save Safety Threshold Policies'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5F7FA] font-mono">Immutable Compliance & Security Audit Logs</h3>
            <span className="text-xs text-[#D97706] font-mono font-bold">● {auditLogs.length} Events Logged</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#263541]">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#111A22] border border-[#263541] text-xs flex items-center justify-between font-mono"
              >
                <div>
                  <span className="text-[#D97706] font-bold mr-2">[{log.eventType}]</span>
                  <span className="text-[#F5F7FA]">{log.description}</span>
                  <span className="text-[#A8B3BE] ml-2">by {log.actor}</span>
                </div>
                <span className="text-[#A8B3BE] shrink-0 text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
