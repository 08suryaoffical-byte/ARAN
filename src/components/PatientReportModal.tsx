import React from 'react';
import { useAran } from '../context/AranContext';
import { translations } from '../utils/translations';
import { localizedData } from '../utils/localizedData';
import {
  X,
  FileText,
  Printer,
  Heart,
  Hospital,
  User,
  Activity,
  Droplets,
  Thermometer,
  ShieldAlert,
  Clock,
  Pill,
  Utensils,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface PatientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientReportModal: React.FC<PatientReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { senior, sensor, language } = useAran();
  const t = translations[language] || translations.en;
  const bundle = localizedData[language] || localizedData.en;
  const medReport = bundle.medicalReport;
  const localizedMeds = bundle.medications;
  const localizedFoods = bundle.foodTimings;
  const localizedFamily = bundle.familyMembers;
  const localizedEmergencies = bundle.neighborhoodEmergencies;

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#17232D] w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#263541] text-[#F5F7FA]">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-[#263541] bg-[#111A22] text-[#F5F7FA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/ARAN.png"
              alt="ARAN Logo"
              className="w-10 h-10 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] shrink-0 p-0.5 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[#F5F7FA]">{t.patientReport}</h2>
                <span className="text-[10px] bg-[#713F12]/30 text-[#D97706] border border-[#A16207]/40 px-2 py-0.5 rounded font-mono font-bold">
                  {t.appName}
                </span>
              </div>
              <p className="text-xs text-[#A8B3BE]">
                {senior.name} ({senior.age}) · {senior.homeInfo.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] hover:bg-[#263541] text-xs font-semibold text-[#F5F7FA] border border-[#263541] transition-all cursor-pointer"
              title={t.printReport}
            >
              <Printer className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="hidden sm:inline">{t.printReport}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-[#F5F7FA] bg-[#0B1117] scrollbar-thin scrollbar-thumb-[#263541]">
          {/* Section 1: Patient Identity & Living Arrangement */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div>
              <span className="text-[#A8B3BE] font-semibold uppercase tracking-wider block text-[10px] mb-1">
                {t.seniorRole}
              </span>
              <p className="text-base font-bold text-[#F5F7FA]">{senior.name}</p>
              <p className="text-[#A8B3BE]">
                {senior.preferredName} · {senior.age} {senior.gender}
              </p>
            </div>

            <div>
              <span className="text-[#A8B3BE] font-semibold uppercase tracking-wider block text-[10px] mb-1">
                {bundle.loginPage.seniorLivingArrangement}
              </span>
              <p className="text-sm font-bold text-[#D97706] capitalize">
                {getLivingArrangementLabel()}
              </p>
              <p className="text-[#A8B3BE]">{senior.homeInfo.address}, {senior.homeInfo.city}</p>
            </div>

            <div>
              <span className="text-[#A8B3BE] font-semibold uppercase tracking-wider block text-[10px] mb-1">
                Blood Group & Allergies
              </span>
              <p className="text-sm font-black text-[#EF4444]">{medReport.bloodGroup}</p>
              <p className="text-[#A8B3BE]">
                Allergies: <strong className="text-[#F5F7FA]">{medReport.allergies.join(', ')}</strong>
              </p>
            </div>
          </div>

          {/* Section 2: Illness & Ongoing Treatment */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm space-y-4 font-mono">
            <div className="flex items-center gap-2 text-[#F5F7FA] font-bold text-sm border-b border-[#263541] pb-2">
              <Hospital className="w-4 h-4 text-[#D97706]" />
              <h3>{t.chronicIllnessesTitle}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-[#A8B3BE] block mb-1">Primary Illnesses / Diagnostics:</span>
                <ul className="space-y-1.5 list-disc pl-4 text-[#F5F7FA]">
                  {medReport.primaryIllness.map((ill, idx) => (
                    <li key={idx} className="font-medium">{ill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-[#A8B3BE] block mb-1">{t.ongoingTreatmentsTitle}:</span>
                <ul className="space-y-1.5 list-disc pl-4 text-[#F5F7FA]">
                  {medReport.ongoingTreatments.map((tr, idx) => (
                    <li key={idx}>{tr}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Which Hospital & Attending Doctor */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
            <div>
              <div className="flex items-center gap-2 text-[#F5F7FA] font-bold text-sm mb-2">
                <Hospital className="w-4 h-4 text-[#D97706]" />
                <h3>{t.treatingHospitalTitle}</h3>
              </div>
              <p className="text-sm font-bold text-[#F5F7FA]">{medReport.hospitalName}</p>
              <p className="text-[#A8B3BE] mt-0.5">{medReport.hospitalAddress}</p>
              <p className="mt-1 text-[#A8B3BE]">
                24/7 Emergency Line: <strong className="text-[#EF4444]">{medReport.hospitalEmergencyPhone}</strong>
              </p>
              <p className="text-[11px] text-[#A8B3BE] mt-1">
                Insurance: {medReport.insuranceProvider} ({medReport.policyNumber})
              </p>
              <p className="text-[10px] text-[#A8B3BE]/70">TPA Helpline: {medReport.tpaHelpline}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#F5F7FA] font-bold text-sm mb-2">
                <User className="w-4 h-4 text-[#D97706]" />
                <h3>{t.attendingDoctorTitle}</h3>
              </div>
              <p className="text-sm font-bold text-[#F5F7FA]">{medReport.doctorName}</p>
              <p className="text-[#A8B3BE]">{medReport.doctorSpecialty}</p>
              <p className="mt-1 text-[#A8B3BE]">
                Clinic / Consultation Phone: <strong className="text-[#D97706]">{medReport.doctorPhone}</strong>
              </p>
              <p className="text-[11px] text-[#22C55E] font-medium mt-1">
                {t.nextFollowup}: <strong>{medReport.nextFollowUpDate}</strong>
              </p>
            </div>
          </div>

          {/* Section 4: Live Vitals & Sensor Readings */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#263541] pb-2">
              <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#D97706]" />
                4. {t.bpRate}, {t.temperature} & {t.waterIntake}
              </h3>
              <span className="text-[11px] text-[#22C55E] font-bold">● {t.deviceConnected}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="text-[#A8B3BE] block text-[10px] font-semibold uppercase">{t.bpRate.split('(')[0]}</span>
                <span className="text-lg font-black text-[#F5F7FA]">{sensor.bloodPressureRate || '122/82'}</span>
                <span className="text-[10px] text-[#22C55E] font-semibold block">{t.normal} (&lt;130/85)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="text-[#A8B3BE] block text-[10px] font-semibold uppercase">{t.heartRate}</span>
                <span className="text-lg font-black text-[#F5F7FA]">{sensor.heartRate || 72} BPM</span>
                <span className="text-[10px] text-[#22C55E] block">NORMAL (65–85 BPM)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="text-[#A8B3BE] block text-[10px] font-semibold uppercase">{t.temperature}</span>
                <span className="text-lg font-black text-[#F5F7FA]">
                  {sensor.temperature || 36.6}°C / {sensor.ambientTemperature || 31}°C
                </span>
                <span className={`text-[10px] font-semibold block ${sensor.heatWarning ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                  {sensor.heatWarning ? t.heatWarning : t.normal}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#111A22] border border-[#263541]">
                <span className="text-[#A8B3BE] block text-[10px] font-semibold uppercase">{t.waterIntake}</span>
                <span className="text-lg font-black text-[#F5F7FA]">
                  {sensor.waterIntakeTodayMl} / {sensor.waterTargetMl} ml
                </span>
                <span className="text-[10px] text-[#D97706] font-semibold block">
                  {Math.round((sensor.waterIntakeTodayMl / sensor.waterTargetMl) * 100)}%
                </span>
              </div>
            </div>

            {sensor.motionWarning && (
              <div className="p-3 rounded-xl bg-[#111A22] border border-[#F59E0B] text-[#F59E0B] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>
                  <strong>{t.motionWarning}:</strong> {sensor.motionWarning}
                </span>
              </div>
            )}
          </div>

          {/* Section 5: Tablets & Food Schedules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#263541] pb-2">
                <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                  <Pill className="w-4 h-4 text-[#22C55E]" />
                  5. {t.tabletsTiming}
                </h3>
              </div>

              <div className="space-y-2">
                {localizedMeds.map((med) => (
                  <div key={med.id} className="p-2.5 rounded-xl border border-[#263541] bg-[#111A22] flex items-center justify-between">
                    <div>
                      <strong className="text-[#F5F7FA] block">{med.name}</strong>
                      <span className="text-[#A8B3BE] text-[11px]">{med.instructions}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#D97706]">{med.time}</span>
                      <span className="block text-[10px] font-semibold text-[#22C55E]">
                        {med.dosage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#263541] pb-2">
                <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#D97706]" />
                  6. {t.foodTiming}
                </h3>
              </div>

              <div className="space-y-2">
                {localizedFoods.map((food) => (
                  <div key={food.id} className="p-2.5 rounded-xl border border-[#263541] bg-[#111A22] flex items-center justify-between">
                    <div>
                      <strong className="text-[#F5F7FA] block">{food.mealName}</strong>
                      <span className="text-[#A8B3BE] text-[11px]">{food.recommendedDiet}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#D97706]">{food.scheduledTime}</span>
                      <span className="block text-[10px] font-semibold text-[#22C55E]">
                        {t.normal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Family Members */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm space-y-3 font-mono">
            <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#263541] pb-2">
              <User className="w-4 h-4 text-[#D97706]" />
              7. {t.familyMembers}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localizedFamily.map((fm) => (
                <div key={fm.id} className="p-3 rounded-xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#F5F7FA]">{fm.name}</strong>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#713F12]/40 text-[#D97706] border border-[#A16207]/40">
                      {fm.relationship}
                    </span>
                  </div>
                  <p className="text-[#A8B3BE] mt-1 text-[11px]">{fm.phone}</p>
                  <p className="text-[#A8B3BE] text-[11px]">{fm.address}</p>
                  <p className="text-[10px] text-[#A8B3BE]/70 mt-0.5">{fm.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Neighborhood Emergency & 108 Ambulance */}
          <div className="p-5 rounded-2xl bg-[#17232D] border border-[#263541] shadow-sm space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#263541] pb-2">
              <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                8. {t.neighborhood108}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {localizedEmergencies.map((ne) => (
                <div key={ne.id} className="p-3 rounded-xl border border-[#263541] bg-[#111A22]">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#F5F7FA] text-xs">{ne.name}</strong>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                      {ne.type}
                    </span>
                  </div>
                  <p className="text-[#A8B3BE] text-[11px] mt-1">{ne.distance}</p>
                  <p className="text-[#F5F7FA] font-bold mt-0.5">{ne.phone}</p>
                  <p className="text-[10px] text-[#A8B3BE]/70 mt-0.5">{ne.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-[#111A22] border border-[#263541] text-center text-[11px] text-[#A8B3BE] font-mono">
            {t.notMedicalDisclaimer}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111A22] border-t border-[#263541] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-bold text-xs border border-[#A16207]/40 cursor-pointer transition-all shadow-md shadow-[#713F12]/30"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
