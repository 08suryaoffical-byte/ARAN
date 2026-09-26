import React, { useState, useEffect } from 'react';
import { useAran } from '../../context/AranContext';
import { LivingArrangement, CareNetworkContact } from '../../types/aran';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  Ambulance,
  Hospital,
  Stethoscope,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Edit2,
  Sliders,
  Volume2,
  Lock,
  Eye,
  Bell,
  Home,
  Heart,
  Sparkles,
  Info,
  X,
  Radio,
  Share2,
} from 'lucide-react';

interface CareNetworkScreenProps {
  onBack?: () => void;
}

export const CareNetworkScreen: React.FC<CareNetworkScreenProps> = ({ onBack }) => {
  const { senior, updateSenior, speakText, language, triggerSos, isSosActive, cancelSos } = useAran();
  const t = translations[language] || translations.en;

  const currentArrangement: LivingArrangement = senior.livingArrangement || 'independent';

  // Configured Care Network Contacts state with adaptive templates
  const [contacts, setContacts] = useState<CareNetworkContact[]>([
    {
      id: 'c-1',
      name: 'Kavitha Ramaswamy',
      relationship: 'Daughter',
      role: 'Primary Contact & Family Caregiver',
      phone: '+91 98401 23456',
      email: 'kavitha.r@example.com',
      availability: 'available',
      priority: 1,
      connectionStatus: 'active',
      permissions: {
        viewStatus: true,
        receiveAlerts: true,
        callPatient: true,
        receiveHealthSummaries: true,
        emergencyOnly: false,
      },
      location: 'Valmiki Nagar, Chennai (3.2 km)',
      notes: 'Visits daily at 06:30 PM. Authorized to receive vital summaries & routine alerts.',
    },
    {
      id: 'c-2',
      name: 'Dr. R. Kumar, MD',
      relationship: 'Consulting Physician',
      role: 'Geriatric Specialist',
      phone: '+91 98410 77123',
      email: 'dr.kumar@kauveryhealth.org',
      availability: 'available',
      priority: 2,
      connectionStatus: 'active',
      permissions: {
        viewStatus: true,
        receiveAlerts: true,
        callPatient: true,
        receiveHealthSummaries: true,
        emergencyOnly: false,
      },
      location: 'Kauvery Hospital Chennai (4.5 km)',
      notes: 'Monthly vitals review. Consented for cardiac alerts.',
    },
    {
      id: 'c-3',
      name: 'Mr. Narayanan',
      relationship: 'Trusted Ground Floor Neighbour',
      role: 'Local Physical Contact',
      phone: '+91 94441 88990',
      availability: 'available',
      priority: 3,
      connectionStatus: 'standby',
      permissions: {
        viewStatus: false,
        receiveAlerts: false,
        callPatient: true,
        receiveHealthSummaries: false,
        emergencyOnly: true,
      },
      location: 'Flat G-2, Same Apartment Building',
      notes: 'Physical key access. Contact ONLY if family does not respond in grace period.',
    },
    {
      id: 'c-4',
      name: 'Kauvery Hospital Emergency',
      relationship: 'Configured Hospital',
      role: 'Hospital ER & Trauma Care',
      phone: '+91 44 4000 6000',
      email: 'er@kauveryhospital.com',
      availability: 'available',
      priority: 'emergency',
      connectionStatus: 'active',
      permissions: {
        viewStatus: false,
        receiveAlerts: true,
        callPatient: true,
        receiveHealthSummaries: true,
        emergencyOnly: true,
      },
      location: 'No. 199, Luz Church Rd, Mylapore, Chennai',
      notes: 'Designated hospital with electronic ICU bed reservation link.',
    },
    {
      id: 'c-5',
      name: '108 State Emergency Ambulance',
      relationship: 'Emergency Medical Service',
      role: 'Rapid Medical First Response',
      phone: '108',
      availability: 'available',
      priority: 'emergency',
      connectionStatus: 'active',
      permissions: {
        viewStatus: false,
        receiveAlerts: true,
        callPatient: true,
        receiveHealthSummaries: false,
        emergencyOnly: true,
      },
      location: 'Tamil Nadu EMRI Ambulance Fleet',
      notes: 'Direct VoIP / GSM automated triage dispatch.',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'network' | 'manage' | 'timeline'>('network');
  const [selectedContactForDetails, setSelectedContactForDetails] = useState<CareNetworkContact | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [escalationStep, setEscalationStep] = useState<number>(0);

  // Animate escalation steps when SOS is active
  useEffect(() => {
    if (isSosActive) {
      setEscalationStep(1);
      const t1 = setTimeout(() => setEscalationStep(2), 1800);
      const t2 = setTimeout(() => setEscalationStep(3), 3600);
      const t3 = setTimeout(() => setEscalationStep(4), 5400);
      const t4 = setTimeout(() => setEscalationStep(5), 7200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setEscalationStep(0);
    }
  }, [isSosActive]);

  const handleSimulateCall = (contact: CareNetworkContact) => {
    setActionNotice(`Initiating line to ${contact.name} (${contact.phone})...`);
    speakText(
      language === 'ta'
        ? `${contact.name} அவர்களுக்கு அழைப்பு விடுக்கப்படுகிறது.`
        : `Calling ${contact.name} at ${contact.phone}...`
    );
    if (typeof window !== 'undefined' && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSimulateMessage = (contact: CareNetworkContact) => {
    setActionNotice(`Priority alert & location dispatched to ${contact.name}.`);
    speakText(
      language === 'ta'
        ? `${contact.name} அவர்களுக்கு அவசர செய்தி அனுப்பப்பட்டது.`
        : `Notification sent to ${contact.name}.`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Status mapping
  const getStatusBadge = (status: CareNetworkContact['availability'], isEmergency?: boolean) => {
    if (isEmergency) {
      return {
        label: 'EMERGENCY CONTACT',
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.16)',
        dot: '#EF4444',
      };
    }
    switch (status) {
      case 'available':
        return {
          label: 'AVAILABLE',
          color: '#22C55E',
          bg: 'rgba(34, 197, 94, 0.14)',
          dot: '#22C55E',
        };
      case 'not_responding':
        return {
          label: 'NOT RESPONDING',
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.14)',
          dot: '#F59E0B',
        };
      case 'offline':
      default:
        return {
          label: 'OFFLINE',
          color: '#667085',
          bg: 'rgba(102, 112, 133, 0.14)',
          dot: '#667085',
        };
    }
  };

  // Primary care chain nodes according to user spec:
  // PATIENT -> ARAN -> FAMILY / CAREGIVER -> DOCTOR -> HOSPITAL -> EMERGENCY SERVICE
  const chainNodes = [
    {
      id: 'patient',
      role: 'PATIENT',
      name: `${senior.name} (Lakshmi)`,
      sub: 'Monitored Senior',
      icon: '👤',
      step: 0,
      active: true,
      emergency: false,
    },
    {
      id: 'aran',
      role: 'ARAN AI',
      name: 'ARAN Health Hub',
      sub: 'Decision & Triage Logic',
      icon: '🛡️',
      step: 1,
      active: escalationStep >= 1,
      emergency: false,
    },
    {
      id: 'caregiver',
      role: 'PRIMARY CAREGIVER',
      name: contacts[0]?.name || 'Daughter (Kavitha)',
      sub: 'Priority 1 Family',
      icon: '👩',
      step: 2,
      active: escalationStep >= 2,
      emergency: false,
    },
    {
      id: 'doctor',
      role: 'DOCTOR',
      name: contacts[1]?.name || 'Dr. Kumar, MD',
      sub: 'Geriatric Specialist',
      icon: '👨‍⚕️',
      step: 3,
      active: escalationStep >= 3,
      emergency: false,
    },
    {
      id: 'hospital',
      role: 'HOSPITAL',
      name: 'Kauvery Hospital',
      sub: 'Configured ER Desk',
      icon: '🏥',
      step: 4,
      active: escalationStep >= 4,
      emergency: false,
    },
    {
      id: 'ambulance',
      role: 'EMERGENCY SERVICE',
      name: '108 Ambulance',
      sub: 'Rapid First Response',
      icon: '🚑',
      step: 5,
      active: escalationStep >= 5,
      emergency: true,
    },
  ];

  return (
    <div className="rounded-3xl border border-[#263541] bg-[#0B1117] shadow-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300 text-[#F5F7FA]">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-6">
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-live-dot" />
              <h1 className="text-xl font-black tracking-tight text-[#F5F7FA] uppercase font-mono">
                ARAN CARE NETWORK
              </h1>
            </div>
            <p className="text-xs text-[#A8B3BE] font-medium mt-0.5">
              Configurable escalation chain · Automatically connects appropriate people based on living arrangement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] border border-[#A16207]/40 text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#713F12]/30"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage Care Network</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111A22] border border-[#263541] text-[#D97706] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full animate-live-dot" style={{ backgroundColor: '#D97706' }} />
            <span>ACTIVE CHAIN</span>
          </div>
        </div>
      </div>

      {/* Emergency Mode Banner: ONLY highlighted in #EF4444 when SOS is active */}
      {isSosActive ? (
        <div className="p-5 rounded-3xl bg-[#17232D] border-2 border-[#EF4444] text-[#F5F7FA] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-red-950/40 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444] flex items-center justify-center text-[#EF4444]">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-black font-mono text-[#EF4444] uppercase tracking-wider block">
                HIGH PRIORITY
              </span>
              <h2 className="text-xl font-black text-[#EF4444] tracking-tight">
                🔴 SOS ACTIVATED
              </h2>
              <p className="text-xs text-[#A8B3BE] font-medium mt-0.5">
                Patient: <strong className="text-[#F5F7FA]">{senior.name}</strong> · Location: <strong className="text-[#F5F7FA]">{senior.homeInfo.city}</strong> · Red pulse traveling along active escalation chain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateCall(contacts[0])}
              className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Call Primary
            </button>
            <button
              onClick={() => handleSimulateCall(contacts[4])}
              className="px-4 py-2 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-black text-xs uppercase tracking-wider border border-[#A16207]/40 cursor-pointer"
            >
              Call 108
            </button>
            <button
              onClick={cancelSos}
              className="px-4 py-2 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#A8B3BE] text-xs font-bold border border-[#263541] cursor-pointer"
            >
              Cancel SOS
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span className="font-bold">🟢 CHECK-IN COMPLETED · NORMAL STATUS</span>
          </div>
          <span className="text-[#A8B3BE]">No escalation required · ARAN monitoring ambient baseline</span>
        </div>
      )}

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-[#17232D] border border-[#A16207] text-[#D97706] text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-xs font-mono text-[#A8B3BE] hover:text-[#F5F7FA]">
            ✕
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LIVING ARRANGEMENT SELECTOR TABS                      */}
      {/* ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#17232D] border border-[#263541] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-[#A8B3BE] block">
              1. Living Arrangement Configuration
            </span>
            <h2 className="text-sm font-black text-[#F5F7FA] tracking-tight">
              "Who is currently responsible for your care?"
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#111A22] border border-[#263541] text-[#D97706]">
            Active: <strong className="uppercase">{currentArrangement}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          {[
            { id: 'family' as LivingArrangement, label: 'WITH FAMILY', icon: '👨‍👩‍👧', desc: 'Family prioritized' },
            { id: 'independent' as LivingArrangement, label: 'LIVING INDEPENDENTLY', icon: '🏠', desc: 'Caregiver + Neighbour' },
            { id: 'relatives' as LivingArrangement, label: 'WITH RELATIVES', icon: '👥', desc: 'Relatives 1 & 2' },
            { id: 'partner' as LivingArrangement, label: 'WITH PARTNER', icon: '❤️', desc: 'Partner primary' },
            { id: 'home_care' as LivingArrangement, label: 'HOME CARE IN-CHARGE', icon: '🩺', desc: 'Nurse in-charge' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updateSenior({ livingArrangement: item.id })}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                currentArrangement === item.id
                  ? 'bg-[#713F12] border-[#A16207] text-[#F5F7FA] shadow-lg shadow-[#713F12]/30 ring-1 ring-[#A16207]'
                  : 'bg-[#111A22] border-[#263541] text-[#A8B3BE] hover:bg-[#17232D] hover:text-[#F5F7FA]'
              }`}
            >
              <span className="text-xl mb-1 block">{item.icon}</span>
              <strong className="text-xs font-black block leading-tight">{item.label}</strong>
              <span className="text-[10px] block mt-1 text-[#A8B3BE]">
                {item.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ADAPTIVE ESCALATION CHAIN DIAGRAM WITH ANIMATED PULSE */}
      {/* PATIENT -> ARAN -> CAREGIVER -> DOCTOR -> HOSPITAL -> EMERGENCY */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#17232D] border border-[#263541] space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#F5F7FA] font-mono">
              VISUAL ESCALATION CHAIN ({currentArrangement.replace('_', ' ').toUpperCase()})
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#A8B3BE]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#713F12] rounded" /> Normal: #713F12
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#D97706] rounded" /> Active: #D97706
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#EF4444] rounded" /> Emergency: #EF4444
            </span>
          </div>
        </div>

        {/* Chain Flow Visualizer with Animated Connection Lines */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 scrollbar-thin scrollbar-thumb-[#263541]">
          {chainNodes.map((node, index) => {
            const isLast = index === chainNodes.length - 1;
            const lineColor = isSosActive
              ? '#EF4444'
              : node.active
              ? '#D97706'
              : '#713F12';

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`p-4 rounded-2xl border min-w-[155px] text-center shrink-0 transition-all duration-200 ${
                    node.emergency && isSosActive
                      ? 'bg-[#111A22] border-[#EF4444] shadow-lg shadow-red-950/60 ring-1 ring-[#EF4444]'
                      : node.active
                      ? 'bg-[#111A22] border-[#A16207] shadow-md shadow-[#713F12]/30'
                      : 'bg-[#111A22] border-[#263541]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.emergency && isSosActive
                          ? 'bg-[#EF4444] animate-ping'
                          : node.active
                          ? 'bg-[#D97706] animate-pulse'
                          : 'bg-[#22C55E]'
                      }`}
                    />
                    <span className="text-[10px] font-mono uppercase font-bold text-[#A8B3BE]">
                      {node.role}
                    </span>
                  </div>
                  <div className="text-xl mb-1">{node.icon}</div>
                  <strong className="text-xs font-black text-[#F5F7FA] block truncate">
                    {node.name}
                  </strong>
                  <span className="text-[10px] text-[#A8B3BE] font-semibold block truncate mt-0.5">
                    {node.sub}
                  </span>
                </div>

                {/* Animated Connection Line between nodes */}
                {!isLast && (
                  <div className="relative w-12 h-6 flex items-center justify-center shrink-0">
                    <svg className="w-full h-4 overflow-visible" viewBox="0 0 48 16">
                      {/* Base connection line */}
                      <line
                        x1="0"
                        y1="8"
                        x2="48"
                        y2="8"
                        stroke={lineColor}
                        strokeWidth="2.5"
                        strokeDasharray={node.active ? 'none' : '4 3'}
                      />
                      {/* Animated traveling data pulse along connection line */}
                      <circle cx="24" cy="8" r="3.5" fill={lineColor}>
                        <animate
                          attributeName="cx"
                          from="0"
                          to="48"
                          dur={isSosActive ? '0.8s' : '1.8s'}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;1;0.3"
                          dur={isSosActive ? '0.8s' : '1.8s'}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INDIVIDUAL INTERACTIVE CONTACT CARDS GRID             */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D97706]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#F5F7FA] font-mono">
              Configured People & Services ({contacts.length} Active Nodes)
            </h3>
          </div>
          <span className="text-xs text-[#A8B3BE] font-mono">
            Each card shows: Name · Role · Phone · Availability · Priority · Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => {
            const isEmergency = contact.priority === 'emergency';
            const badge = getStatusBadge(contact.availability, isEmergency);

            return (
              <div
                key={contact.id}
                className="p-5 rounded-3xl bg-[#17232D] border border-[#263541] hover:border-[#A16207] shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Top: Name, Role & Status Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: badge.dot }}
                        />
                        <span
                          className="text-[10px] font-mono font-bold uppercase tracking-wider"
                          style={{ color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#F5F7FA] tracking-tight mt-1">
                        {contact.name}
                      </h4>
                      <p className="text-xs text-[#A8B3BE] font-semibold mt-0.5">
                        {contact.role}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#111A22] border border-[#263541] text-[#A8B3BE] shrink-0">
                      {isEmergency ? 'EMERGENCY' : `PRIORITY ${contact.priority}`}
                    </span>
                  </div>

                  <p className="text-xs text-[#A8B3BE] font-mono mt-2 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#D97706]" />
                    <span>{contact.phone}</span>
                  </p>
                  <p className="text-[11px] text-[#A8B3BE] mt-1.5 line-clamp-2">
                    {contact.notes}
                  </p>
                </div>

                {/* Buttons: [ CALL ], [ MESSAGE ], [ VIEW DETAILS ] */}
                <div className="pt-3 border-t border-[#263541] grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSimulateCall(contact)}
                    className="py-2 px-2.5 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-black tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer border border-[#A16207]/40"
                  >
                    <Phone className="w-3 h-3" />
                    <span>CALL</span>
                  </button>

                  <button
                    onClick={() => handleSimulateMessage(contact)}
                    className="py-2 px-2.5 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#F5F7FA] text-xs font-bold tracking-wider uppercase transition-all border border-[#263541] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>MESSAGE</span>
                  </button>

                  <button
                    onClick={() => setSelectedContactForDetails(contact)}
                    className="py-2 px-2.5 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] text-xs font-bold tracking-wider uppercase transition-all border border-[#263541] flex items-center justify-center cursor-pointer"
                  >
                    <span>DETAILS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      {selectedContactForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#17232D] border border-[#263541] w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 text-[#F5F7FA]">
            <div className="flex items-center justify-between border-b border-[#263541] pb-3">
              <div>
                <h3 className="text-lg font-black">{selectedContactForDetails.name}</h3>
                <p className="text-xs text-[#A8B3BE]">{selectedContactForDetails.role}</p>
              </div>
              <button
                onClick={() => setSelectedContactForDetails(null)}
                className="p-1.5 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#111A22] border border-[#263541] space-y-1">
                <span className="text-[#A8B3BE] font-mono uppercase text-[10px]">Contact Info</span>
                <p className="text-sm font-bold text-[#F5F7FA]">{selectedContactForDetails.phone}</p>
                {selectedContactForDetails.email && (
                  <p className="text-[#A8B3BE]">{selectedContactForDetails.email}</p>
                )}
                {selectedContactForDetails.location && (
                  <p className="text-[#D97706] mt-1">{selectedContactForDetails.location}</p>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <span className="text-[#A8B3BE] font-mono uppercase text-[10px]">Privacy & Permissions</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className={selectedContactForDetails.permissions.viewStatus ? 'text-[#22C55E]' : 'text-[#667085]'}>
                    {selectedContactForDetails.permissions.viewStatus ? '✓ View Status' : '✕ No Status Access'}
                  </span>
                  <span className={selectedContactForDetails.permissions.receiveAlerts ? 'text-[#22C55E]' : 'text-[#667085]'}>
                    {selectedContactForDetails.permissions.receiveAlerts ? '✓ Receives Alerts' : '✕ No Alerts'}
                  </span>
                  <span className={selectedContactForDetails.permissions.receiveHealthSummaries ? 'text-[#22C55E]' : 'text-[#667085]'}>
                    {selectedContactForDetails.permissions.receiveHealthSummaries ? '✓ Health Summaries' : '✕ No Private Vitals'}
                  </span>
                  <span className={selectedContactForDetails.permissions.emergencyOnly ? 'text-[#EF4444]' : 'text-[#A8B3BE]'}>
                    {selectedContactForDetails.permissions.emergencyOnly ? '⚠️ Emergency Only' : '✓ Normal Check-in Backup'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#A8B3BE] italic">
                "{selectedContactForDetails.notes}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleSimulateCall(selectedContactForDetails);
                  setSelectedContactForDetails(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-white text-xs font-black uppercase tracking-wider"
              >
                Direct Call
              </button>
              <button
                onClick={() => setSelectedContactForDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#A8B3BE] text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
