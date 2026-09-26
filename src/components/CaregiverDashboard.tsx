import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import { translations } from '../utils/translations';
import { localizedData } from '../utils/localizedData';
import { HealthDashboard } from './health/HealthDashboard';
import {
  Heart,
  Activity,
  Radio,
  Clock,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  PhoneCall,
  Bell,
  Droplets,
  Utensils,
  Pill,
  User,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  History,
  FileText,
  Volume2,
  Check,
  Send,
  Hospital,
  Sun,
  Shield,
  Ambulance,
} from 'lucide-react';

interface CaregiverDashboardProps {
  onOpenChat: () => void;
  onOpenSos: () => void;
  onOpenOnboarding: () => void;
  onOpenReport?: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  onOpenChat,
  onOpenSos,
  onOpenOnboarding,
  onOpenReport,
}) => {
  const {
    senior,
    language,
    sensor,
    alerts,
    acknowledgeAlert,
    escalateAlert,
    routines,
    toggleRoutineStatus,
    addRoutine,
    medications,
    toggleMedication,
    foodTimings,
    toggleFoodTiming,
    logWaterIntake,
    dispatch108Ambulance,
    cancel108Ambulance,
    auditLogs,
    isSosActive,
    resolveSos,
    speakText,
  } = useAran();

  const t = translations[language] || translations.en;
  const bundle = localizedData[language] || localizedData.en;
  const medReport = bundle.medicalReport;
  const localizedMeds = bundle.medications;
  const localizedFoods = bundle.foodTimings;
  const localizedFamily = bundle.familyMembers;
  const localizedEmergencies = bundle.neighborhoodEmergencies;

  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'vitals' | 'timings' | 'family' | 'routines' | 'emergency' | 'audit'>('overview');
  const [ackNote, setAckNote] = useState('');
  const [selectedAlertForAck, setSelectedAlertForAck] = useState<string | null>(null);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('04:00 PM');
  const [isAddingRoutine, setIsAddingRoutine] = useState(false);

  // Status calculation
  const hasCriticalAlert = isSosActive || alerts.some((a) => a.level === 'RED' && a.status === 'active');
  const hasWarningAlert = !hasCriticalAlert && alerts.some((a) => a.level === 'YELLOW' && a.status === 'active');

  const overallStatus = hasCriticalAlert
    ? { label: t.highPriority, color: 'bg-red-500 text-white', border: 'border-red-300' }
    : hasWarningAlert
    ? { label: t.attentionNeeded, color: 'bg-amber-400 text-[#F5F7FA]', border: 'border-amber-300' }
    : { label: t.normal, color: 'bg-emerald-500 text-white', border: 'border-emerald-300' };

  const activeAlerts = alerts.filter((a) => a.status === 'active' || a.status === 'escalated');

  const handleHydrationDone = () => {
    logWaterIntake(250);
  };

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    addRoutine({
      name: newRoutineName,
      time: newRoutineTime,
      repeat: 'Daily',
      reminder: true,
      gracePeriodMinutes: 20,
      type: 'activity',
      status: 'pending',
      notes: 'Custom caregiver scheduled routine',
    });
    setNewRoutineName('');
    setIsAddingRoutine(false);
  };

  const handleAcknowledgeSubmit = (alertId: string) => {
    acknowledgeAlert(alertId, 'Kavitha (Daughter)', ackNote || 'Checked with Lakshmi Amma via phone call. Everything settled.');
    setSelectedAlertForAck(null);
    setAckNote('');
  };

  const getLivingArrangementLabel = () => {
    switch (senior.livingArrangement) {
      case 'family':
        return t.livingFamily;
      case 'relatives':
        return t.livingRelatives;
      case 'partner':
        return t.livingPartner;
      case 'independent':
      default:
        return t.livingIndependent;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Senior Profile Banner Card */}
      <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
              {senior.name[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#F5F7FA] tracking-tight">{senior.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#111A22] text-[#A8B3BE] font-semibold">
                  {senior.age} years old
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${overallStatus.color}`}>
                  ● {overallStatus.label}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                  {medReport.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-[#A8B3BE] mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#A8B3BE]">{bundle.loginPage.seniorLivingArrangement}:</span>
                <span className="capitalize font-bold text-[#D97706]">{getLivingArrangementLabel()}</span>
                <span>·</span>
                <span className="font-semibold text-[#A8B3BE]">{t.doctorName}:</span>
                <span>{medReport.doctorName}</span>
                <span>·</span>
                <span className="font-semibold text-[#A8B3BE]">{t.hospitalName}:</span>
                <span>{medReport.hospitalName.split(',')[0]}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons for Caregiver */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                {t.patientReportBtn}
              </button>
            )}

            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              {t.talkToAran}
            </button>

            <a
              href="tel:+919840123456"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              {t.callSenior}
            </a>

            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111A22] hover:bg-slate-200 text-[#A8B3BE] text-xs font-semibold transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              {t.editSetup}
            </button>
          </div>
        </div>

        {/* 6 Key Metric Tiles with BP Rate and Water */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-[#263541]">
          {/* 1. BP Rate */}
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[11px] font-semibold text-[#A8B3BE] uppercase tracking-wider block mb-1">
              {t.bpRate.split('(')[0]}
            </span>
            <div className="text-base font-black text-[#F5F7FA]">{sensor.bloodPressureRate}</div>
            <span className="text-[10px] text-emerald-600 font-semibold block">{t.normal} (&lt;130/85)</span>
          </div>

          {/* 2. Heart Rate */}
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[11px] font-semibold text-[#A8B3BE] uppercase tracking-wider block mb-1">
              {t.heartRate}
            </span>
            <span className="text-base font-bold text-[#F5F7FA]">{sensor.heartRate} BPM</span>
            <span className="text-[10px] text-[#A8B3BE] block">70–85 BPM</span>
          </div>

          {/* 3. Water Intake */}
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[11px] font-semibold text-[#A8B3BE] uppercase tracking-wider block mb-1">
              {t.waterIntake}
            </span>
            <span className="text-base font-bold text-[#F5F7FA]">
              {sensor.waterIntakeTodayMl} / {sensor.waterTargetMl} ml
            </span>
            <button
              onClick={handleHydrationDone}
              className="text-[10px] font-bold text-[#D97706] hover:underline block cursor-pointer"
            >
              + {t.logWater.split('(')[0]}
            </button>
          </div>

          {/* 4. Room & Body Temp */}
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[11px] font-semibold text-[#A8B3BE] uppercase tracking-wider block mb-1">
              {t.temperature}
            </span>
            <span className="text-base font-bold text-[#F5F7FA]">
              {sensor.ambientTemperature}° / {sensor.temperature}°C
            </span>
            <span className={`text-[10px] block font-semibold ${sensor.heatWarning ? 'text-amber-600' : 'text-[#A8B3BE]'}`}>
              {sensor.heatWarning ? t.heatWarning : t.normal}
            </span>
          </div>

          {/* 5. Device Battery */}
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[11px] font-semibold text-[#A8B3BE] uppercase tracking-wider block mb-1">
              {t.hardwareHub}
            </span>
            <span className="text-base font-bold text-[#F5F7FA]">{sensor.batteryLevel}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">{t.deviceConnected}</span>
          </div>

          {/* 6. Today's Check-ins */}
          <div className="p-3.5 rounded-2xl bg-[#111A22] border border-[#263541]">
            <span className="text-[11px] font-semibold text-[#A8B3BE] uppercase tracking-wider block mb-1">
              {t.tabRoutines.split('&')[0]}
            </span>
            <span className="text-base font-bold text-[#F5F7FA]">
              {routines.filter((r) => r.type === 'checkin' && r.status === 'completed').length} /{' '}
              {routines.filter((r) => r.type === 'checkin').length}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block">{t.nextCheckin}: 06:00 PM</span>
          </div>
        </div>
      </div>

      {/* 108 Ambulance Dispatch Alert Banner */}
      {sensor.ambulance108Dispatched && (
        <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl border-4 border-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#17232D] text-red-600 flex items-center justify-center font-black text-2xl shrink-0">
              🚑
            </div>
            <div>
              <h2 className="text-xl font-black">{bundle.seniorView.ambulance108DispatchedTitle}</h2>
              <p className="text-xs text-red-100">
                {bundle.seniorView.ambulance108DispatchedDesc} (ETA: <strong>{sensor.ambulance108EtaMinutes} min</strong>) · Fortis Malar Hospital Standby
              </p>
            </div>
          </div>
          <button
            onClick={cancel108Ambulance}
            className="px-4 py-2.5 rounded-xl bg-[#17232D] text-red-700 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-50 shrink-0 cursor-pointer"
          >
            {t.cancel108Btn}
          </button>
        </div>
      )}

      {/* SOS Active Banner */}
      {isSosActive && (
        <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl border-4 border-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#17232D] text-red-600 flex items-center justify-center font-black text-2xl shrink-0">
              !
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{t.sos}</h2>
              <p className="text-xs text-red-100">
                Triggered from ARAN Hub. Family & emergency services alerted.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSos}
              className="px-4 py-2.5 rounded-xl bg-[#17232D] text-red-600 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-50 cursor-pointer"
            >
              Emergency Center
            </button>
            <button
              onClick={resolveSos}
              className="px-4 py-2.5 rounded-xl bg-red-800 text-white font-semibold text-xs hover:bg-red-900 cursor-pointer"
            >
              {t.standDown}
            </button>
          </div>
        </div>
      )}

      {/* Caregiver Navigation Tabs (All using translations) */}
      <div className="flex items-center gap-2 border-b border-[#263541] overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Bell className="w-4 h-4" />
          {t.tabOverview}
          {activeAlerts.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {activeAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('medical')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'medical'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Hospital className="w-4 h-4" />
          {t.tabMedical}
        </button>

        <button
          onClick={() => setActiveTab('timings')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'timings'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Pill className="w-4 h-4" />
          {t.tabTimings}
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'vitals'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Activity className="w-4 h-4" />
          {t.tabVitals}
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'family'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <User className="w-4 h-4" />
          {t.tabFamily}
        </button>

        <button
          onClick={() => setActiveTab('routines')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'routines'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {t.tabRoutines}
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'emergency'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          {t.tabEmergency}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-cyan-600 text-[#D97706] font-bold'
              : 'border-transparent text-[#A8B3BE] hover:text-[#F5F7FA]'
          }`}
        >
          <History className="w-4 h-4" />
          {t.tabAudit}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#F5F7FA]">Caregiver Attention Queue</h3>
                <p className="text-xs text-[#A8B3BE]">
                  ARAN alerts explain the reason and sensor context. Never an unexplained alarm.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#111A22] text-[#A8B3BE]">
                {activeAlerts.length} Active Notice{activeAlerts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center bg-[#111A22] rounded-2xl border border-dashed border-[#263541]">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#F5F7FA]">{t.normal} - All Routines & Sensors Normal</h4>
                <p className="text-xs text-[#A8B3BE] max-w-md mx-auto mt-1">
                  Lakshmi Amma's morning check-in is complete, BP rate ({sensor.bloodPressureRate}) is stable, and no
                  unusual inactivity or fall motion has been detected.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      alert.level === 'RED'
                        ? 'bg-red-50/60 border-red-300 shadow-sm'
                        : 'bg-amber-50/60 border-amber-300 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            alert.level === 'RED' ? 'bg-red-600 animate-ping' : 'bg-amber-500'
                          }`}
                        />
                        <h4 className="font-bold text-sm text-[#F5F7FA]">{alert.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17232D] text-[#A8B3BE] border border-[#263541] font-semibold">
                          Level {alert.escalationLevel} Escalation
                        </span>
                      </div>
                      <span className="text-xs text-[#A8B3BE] font-mono font-medium">{alert.timestamp}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#17232D]/90 border border-[#263541] mb-3 text-xs text-[#A8B3BE] space-y-1">
                      <div className="font-bold text-[#F5F7FA] flex items-center gap-1.5 text-xs text-[#D97706]">
                        <Cpu className="w-3.5 h-3.5" />
                        ARAN Sensor Fusion Explanation:
                      </div>
                      <p className="leading-relaxed font-medium">{alert.aiExplanation}</p>
                      <p className="text-[#A8B3BE] text-[11px] pt-1">
                        <strong>Reason:</strong> {alert.reason}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedAlertForAck(selectedAlertForAck === alert.id ? null : alert.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {t.acknowledge}
                        </button>
                        <button
                          onClick={() => escalateAlert(alert.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {t.escalate}
                        </button>
                      </div>

                      <a
                        href="tel:+919840123456"
                        className="text-xs font-semibold text-[#D97706] hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        {t.callSenior}
                      </a>
                    </div>

                    {selectedAlertForAck === alert.id && (
                      <div className="mt-3 pt-3 border-t border-[#263541] flex items-center gap-2">
                        <input
                          type="text"
                          value={ackNote}
                          onChange={(e) => setAckNote(e.target.value)}
                          placeholder="Action note (e.g. Spoke to mother, brought warm water)"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-[#263541] text-xs focus:outline-cyan-500 bg-[#17232D]"
                        />
                        <button
                          onClick={() => handleAcknowledgeSubmit(alert.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                        >
                          {t.confirm}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PATIENT MEDICAL & HOSPITAL DETAILS (Localized!) */}
      {activeTab === 'medical' && (
        <div className="space-y-6">
          <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#F5F7FA]">{t.patientReport}</h3>
              <p className="text-xs text-[#A8B3BE]">
                Detailed clinical history, active treatments, hospital and attending doctor details for Lakshmi Amma.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Illness & Treatment */}
              <div className="p-5 rounded-2xl bg-[#111A22] border border-[#263541] space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] block mb-1">{t.chronicIllnessesTitle}:</span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-[#A8B3BE]">
                    {medReport.primaryIllness.map((ill, i) => (
                      <li key={i} className="font-medium">{ill}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#263541]">
                  <span className="text-xs font-bold text-[#F5F7FA] block mb-1">{t.ongoingTreatmentsTitle}:</span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-[#A8B3BE]">
                    {medReport.ongoingTreatments.map((tr, i) => (
                      <li key={i}>{tr}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hospital & Doctor */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4 text-xs">
                <div>
                  <span className="font-bold text-indigo-950 block text-sm">{t.treatingHospitalTitle}:</span>
                  <p className="font-bold text-[#F5F7FA] text-sm mt-0.5">{medReport.hospitalName}</p>
                  <p className="text-[#A8B3BE]">{medReport.hospitalAddress}</p>
                  <p className="mt-1 font-mono text-[#A8B3BE]">
                    24/7 Emergency: <strong className="text-rose-600">{medReport.hospitalEmergencyPhone}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-indigo-200">
                  <span className="font-bold text-indigo-950 block text-sm">{t.attendingDoctorTitle}:</span>
                  <p className="font-bold text-[#F5F7FA] text-sm mt-0.5">{medReport.doctorName}</p>
                  <p className="text-[#A8B3BE]">{medReport.doctorSpecialty}</p>
                  <p className="mt-1">
                    Clinic Contact: <strong className="text-[#D97706]">{medReport.doctorPhone}</strong>
                  </p>
                  <p className="text-emerald-700 font-semibold mt-1">
                    {t.nextFollowup}: <strong>{medReport.nextFollowUpDate}</strong>
                  </p>
                </div>
              </div>
            </div>

            {onOpenReport && (
              <div className="pt-2">
                <button
                  onClick={onOpenReport}
                  className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-[#713F12] text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {t.printReport} / {t.patientReportBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TABLETS & FOOD TIMINGS (Localized!) */}
      {activeTab === 'timings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tablet Timing Schedule */}
            <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  {t.tabletsTiming}
                </h3>
                <span className="text-xs text-emerald-700 font-semibold">ARAN Smart Dispenser Sync</span>
              </div>

              <div className="space-y-3">
                {localizedMeds.map((med) => (
                  <div key={med.id} className="p-3.5 rounded-2xl border border-[#263541] bg-[#111A22] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-[#F5F7FA] text-sm">{med.name}</strong>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-[#A8B3BE] font-semibold text-[10px]">
                          {med.category}
                        </span>
                      </div>
                      <p className="text-[#A8B3BE] mt-0.5">{med.instructions}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Dosage: {med.dosage}</p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="font-mono font-bold text-[#F5F7FA] block">{med.time}</span>
                      <button
                        onClick={() => toggleMedication(med.id)}
                        className="mt-1 px-3 py-1 rounded-lg text-xs font-bold transition-all bg-emerald-600 text-white cursor-pointer"
                      >
                        ✓ {t.markTaken}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food & Meal Timing Schedule */}
            <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-600" />
                  {t.foodTiming}
                </h3>
                <span className="text-xs text-[#A8B3BE]">Dietary Care Plan</span>
              </div>

              <div className="space-y-3">
                {localizedFoods.map((food) => (
                  <div key={food.id} className="p-3.5 rounded-2xl border border-[#263541] bg-[#111A22] flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#F5F7FA] text-sm block">{food.mealName}</strong>
                      <p className="text-[#A8B3BE] mt-0.5">{food.recommendedDiet}</p>
                      <span className="text-[10px] text-slate-400">{food.notes}</span>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="font-mono font-bold text-[#F5F7FA] block">{food.scheduledTime}</span>
                      <button
                        onClick={() => toggleFoodTiming(food.id)}
                        className="mt-1 px-3 py-1 rounded-lg text-xs font-bold transition-all bg-[#17232D] border border-[#263541] text-[#A8B3BE] hover:bg-[#111A22] cursor-pointer"
                      >
                        {t.markMealDone}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BP RATE, HEAT & MOTION SENSORS (Interactive Smartwatch Health Interface) */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <HealthDashboard onOpenSos={onOpenSos} onOpenChat={onOpenChat} />
        </div>
      )}

      {/* TAB 5: FAMILY MEMBERS & NEIGHBORHOOD (Localized!) */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#F5F7FA]">{t.familyMembers}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localizedFamily.map((fm) => (
                <div key={fm.id} className="p-4 rounded-2xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-[#F5F7FA] font-bold text-sm">{fm.name}</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#713F12] text-[#F5F7FA]">
                      {fm.relationship}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#A8B3BE]">{fm.phone}</p>
                  <p className="text-xs text-[#A8B3BE] mt-1">{fm.address}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{fm.notes}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#263541]">
              <h3 className="text-base font-bold text-[#F5F7FA] mb-3">{t.neighborhood108}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {localizedEmergencies.map((ne) => (
                  <div key={ne.id} className="p-3.5 rounded-2xl border border-[#263541] bg-[#111A22]">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#F5F7FA] text-xs">{ne.name}</strong>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                        {ne.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#A8B3BE] mt-1">{ne.distance}</p>
                    <p className="text-xs font-mono font-bold text-[#F5F7FA] mt-0.5">{ne.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ROUTINES */}
      {activeTab === 'routines' && (
        <div className="space-y-6">
          <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F5F7FA]">{t.tabRoutines}</h3>
              <button
                onClick={() => setIsAddingRoutine(!isAddingRoutine)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-700 text-white font-bold text-xs hover:bg-[#713F12] cursor-pointer"
              >
                {t.addRoutineBtn}
              </button>
            </div>

            {isAddingRoutine && (
              <form onSubmit={handleCreateRoutine} className="p-4 rounded-2xl bg-[#111A22]/50 border border-cyan-200 flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Routine name (e.g. Afternoon BP check)"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#263541] text-xs bg-[#17232D] flex-1"
                />
                <input
                  type="text"
                  placeholder="04:00 PM"
                  value={newRoutineTime}
                  onChange={(e) => setNewRoutineTime(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#263541] text-xs bg-[#17232D] w-28"
                />
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-700 text-white font-bold text-xs cursor-pointer">
                  {t.save}
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {routines.map((rt) => (
                <div key={rt.id} className="p-3.5 rounded-2xl border border-[#263541] bg-[#111A22] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#F5F7FA] text-sm block">{rt.name}</strong>
                    <span className="text-[#A8B3BE]">{rt.repeat} · Grace {rt.gracePeriodMinutes} mins</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#F5F7FA] block">{rt.time}</span>
                    <button
                      onClick={() => toggleRoutineStatus(rt.id, rt.status === 'completed' ? 'pending' : 'completed')}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer ${
                        rt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rt.status === 'completed' ? `✓ ${t.normal}` : t.attentionNeeded}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: 108 EMERGENCY MATRIX */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#F5F7FA]">{t.tabEmergency}</h3>
            <p className="text-xs text-[#A8B3BE]">
              ARAN integrates with 108 Emergency Ambulance Services and local hospital casualty departments.
            </p>

            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-red-950 text-sm">GVK-EMRI 108 Emergency Dispatch</h4>
                  <p className="text-xs text-red-800">Direct dispatch protocol with live GPS coordinates broadcast</p>
                </div>
                <button
                  onClick={() => dispatch108Ambulance()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t.dispatch108Btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-[#17232D] rounded-3xl border border-[#263541] p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-[#F5F7FA]">{t.tabAudit}</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-[#263541] bg-[#111A22] text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#F5F7FA] block">{log.action}</span>
                    <span className="text-[#A8B3BE] text-[11px]">{log.details} · By {log.actor}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
