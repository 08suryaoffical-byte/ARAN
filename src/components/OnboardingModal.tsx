import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import { translations } from '../utils/translations';
import { LivingArrangement, Language } from '../types/aran';
import {
  X,
  User,
  Heart,
  Home,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Volume2,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { senior, updateSenior, language, setLanguage } = useAran();
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState(senior.name);
  const [preferredName, setPreferredName] = useState(senior.preferredName);
  const [age, setAge] = useState(senior.age);
  const [lang, setLang] = useState<Language>(language);
  const [livingArrangement, setLivingArrangement] = useState<LivingArrangement>(
    senior.livingArrangement || 'independent'
  );

  // Accessibility flags
  const [difficultySeeing, setDiffSeeing] = useState(senior.accessibility.difficultySeeing);
  const [difficultyHearing, setDiffHearing] = useState(senior.accessibility.difficultyHearing);
  const [difficultySpeaking, setDiffSpeaking] = useState(senior.accessibility.difficultySpeaking);
  const [difficultySmartphone, setDiffSmartphone] = useState(senior.accessibility.difficultySmartphone);
  const [limitedMobility, setLimitedMobility] = useState(senior.accessibility.limitedMobility);

  // Caregiver contacts
  const [cgName, setCgName] = useState(senior.emergencyContacts?.[0]?.name || 'Kavitha Ramaswamy');
  const [cgRel, setCgRel] = useState(senior.emergencyContacts?.[0]?.relationship || 'Daughter');
  const [cgPhone, setCgPhone] = useState(senior.emergencyContacts?.[0]?.phone || '+91 98401 23456');

  if (!isOpen) return null;

  const handleSaveAndComplete = () => {
    updateSenior({
      name,
      preferredName,
      age,
      livingArrangement,
      accessibility: {
        difficultySeeing,
        difficultyHearing,
        difficultySpeaking,
        difficultySmartphone,
        limitedMobility,
        highContrast: difficultySeeing,
        extraLargeFont: difficultySeeing,
      },
      emergencyContacts: [
        {
          id: '1',
          name: cgName,
          relationship: cgRel,
          phone: cgPhone,
          priority: 'Primary Contact',
          locationSharing: true,
        },
      ],
    });
    setLanguage(lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#17232D] w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#263541] text-[#F5F7FA]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#263541] flex items-center justify-between bg-[#111A22]">
          <div className="flex items-center gap-3">
            <img
              src="/ARAN.png"
              alt="ARAN Logo"
              className="w-10 h-10 rounded-2xl object-contain bg-[#0B1117] border border-[#263541] shrink-0 p-0.5 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider font-mono">
                  Step 0{step} of 04
                </span>
                <span>·</span>
                <span className="text-xs text-[#A8B3BE] font-medium font-mono">Care & Safety Profile</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#F5F7FA] mt-0.5">
                {step === 1 && 'Senior Identity & Calling Name'}
                {step === 2 && 'Living Arrangement'}
                {step === 3 && 'Accessibility & Interaction Modes'}
                {step === 4 && 'Primary Caregiver & Home Coordinates'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#17232D] hover:bg-[#263541] text-[#A8B3BE] hover:text-[#F5F7FA] border border-[#263541] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#263541]">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-4 text-xs font-mono">
              <p className="text-[#A8B3BE]">
                Tell ARAN who the senior companion will be addressing during daily voice check-ins.
              </p>

              <div>
                <label className="block text-[#F5F7FA] font-bold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lakshmi Ramaswamy"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FA] font-bold mb-1">
                  What should ARAN call you? (Preferred Calling Name)
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Lakshmi Amma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                />
                <span className="text-[11px] text-[#A8B3BE] mt-1 block">
                  ARAN will use this affectionate name in check-ins (e.g. "Good morning, Lakshmi Amma!").
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                  />
                </div>

                <div>
                  <label className="block text-[#F5F7FA] font-bold mb-1">Preferred Companion Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLang(e.target.value as Language)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                  >
                    <option value="en">English (EN)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="fr">Français (French)</option>
                    <option value="tanglish">Tanglish (Tamil + English)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LIVING ARRANGEMENT */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[#A8B3BE]">
                Who does the senior currently live with? Displayed as context for care coordination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. With Family */}
                <div
                  onClick={() => setLivingArrangement('family')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    livingArrangement === 'family'
                      ? 'border-[#A16207] bg-[#713F12]/30 shadow-md ring-1 ring-[#A16207]'
                      : 'border-[#263541] bg-[#111A22] hover:border-[#A16207]/40'
                  }`}
                >
                  <div className="text-3xl mb-1">👨‍👩‍👧</div>
                  <h4 className="font-extrabold text-sm text-[#F5F7FA]">
                    {translations[language]?.livingFamily || 'WITH FAMILY'}
                  </h4>
                  <p className="text-xs text-[#A8B3BE] mt-1">Lives with children or other family members.</p>
                </div>

                {/* 2. Living Independently */}
                <div
                  onClick={() => setLivingArrangement('independent')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    livingArrangement === 'independent'
                      ? 'border-[#A16207] bg-[#713F12]/30 shadow-md ring-1 ring-[#A16207]'
                      : 'border-[#263541] bg-[#111A22] hover:border-[#A16207]/40'
                  }`}
                >
                  <div className="text-3xl mb-1">🏠</div>
                  <h4 className="font-extrabold text-sm text-[#F5F7FA]">
                    {translations[language]?.livingIndependent || 'LIVING INDEPENDENTLY'}
                  </h4>
                  <p className="text-xs text-[#A8B3BE] mt-1">Lives alone and manages daily activities independently.</p>
                </div>

                {/* 3. With Relatives */}
                <div
                  onClick={() => setLivingArrangement('relatives')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    livingArrangement === 'relatives'
                      ? 'border-[#A16207] bg-[#713F12]/30 shadow-md ring-1 ring-[#A16207]'
                      : 'border-[#263541] bg-[#111A22] hover:border-[#A16207]/40'
                  }`}
                >
                  <div className="text-3xl mb-1">👥</div>
                  <h4 className="font-extrabold text-sm text-[#F5F7FA]">
                    {translations[language]?.livingRelatives || 'WITH RELATIVES'}
                  </h4>
                  <p className="text-xs text-[#A8B3BE] mt-1">Lives with extended relatives or community members.</p>
                </div>

                {/* 4. With Partner */}
                <div
                  onClick={() => setLivingArrangement('partner')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    livingArrangement === 'partner'
                      ? 'border-[#A16207] bg-[#713F12]/30 shadow-md ring-1 ring-[#A16207]'
                      : 'border-[#263541] bg-[#111A22] hover:border-[#A16207]/40'
                  }`}
                >
                  <div className="text-3xl mb-1">❤️</div>
                  <h4 className="font-extrabold text-sm text-[#F5F7FA]">
                    {translations[language]?.livingPartner || 'WITH PARTNER'}
                  </h4>
                  <p className="text-xs text-[#A8B3BE] mt-1">Lives with spouse or lifelong partner.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#111A22] border border-[#263541] text-[11px] text-[#A8B3BE]">
                <strong className="text-[#F5F7FA]">Safety Governance:</strong> This information is stored as care context only. ARAN never uses
                living arrangements as a medical or safety diagnosis.
              </div>
            </div>
          )}

          {/* STEP 3: ACCESSIBILITY */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-[#A8B3BE]">
                Select any limitations so ARAN automatically adapts its visual contrast, volume, and interaction strategy.
              </p>

              <div className="space-y-2.5 text-xs">
                {[
                  {
                    id: 'seeing',
                    title: 'Difficulty seeing',
                    desc: 'Enables high contrast, extra large typography, and loud voice prompts.',
                    checked: difficultySeeing,
                    toggle: () => setDiffSeeing(!difficultySeeing),
                  },
                  {
                    id: 'hearing',
                    title: 'Difficulty hearing',
                    desc: 'Enables high-lumen optical LED flashes and prominent visual banners.',
                    checked: difficultyHearing,
                    toggle: () => setDiffHearing(!difficultyHearing),
                  },
                  {
                    id: 'speaking',
                    title: 'Difficulty speaking',
                    desc: 'Prioritizes one-touch pictorial cards, tactile responses, and ambient monitoring.',
                    checked: difficultySpeaking,
                    toggle: () => setDiffSpeaking(!difficultySpeaking),
                  },
                  {
                    id: 'smartphone',
                    title: 'Cannot comfortably use a smartphone',
                    desc: 'Enables 100% hands-free voice on the ARAN physical device with physical SOS.',
                    checked: difficultySmartphone,
                    toggle: () => setDiffSmartphone(!difficultySmartphone),
                  },
                  {
                    id: 'mobility',
                    title: 'Limited mobility',
                    desc: 'Extends grace periods for check-ins from 15 min to 30 min.',
                    checked: limitedMobility,
                    toggle: () => setLimitedMobility(!limitedMobility),
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      item.checked
                        ? 'bg-[#713F12]/30 border-[#A16207]'
                        : 'bg-[#111A22] border-[#263541]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={item.toggle}
                      className="mt-1 w-4 h-4 rounded accent-[#D97706]"
                    />
                    <div>
                      <strong className="text-[#F5F7FA] block">{item.title}</strong>
                      <span className="text-[#A8B3BE] text-[11px]">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CAREGIVER & HOME */}
          {step === 4 && (
            <div className="space-y-4 text-xs font-mono">
              <p className="text-[#A8B3BE]">
                Who should ARAN notify first when help or attention is recommended?
              </p>

              <div>
                <label className="block text-[#F5F7FA] font-bold mb-1">Primary Caregiver Name</label>
                <input
                  type="text"
                  value={cgName}
                  onChange={(e) => setCgName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F7FA] font-bold mb-1">Relationship</label>
                  <select
                    value={cgRel}
                    onChange={(e) => setCgRel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Relative">Relative</option>
                    <option value="Nurse">Home Caregiver / Nurse</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#F5F7FA] font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={cgPhone}
                    onChange={(e) => setCgPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#263541] bg-[#0B1117] text-[#F5F7FA] text-sm focus:outline-[#A16207]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[#F5F7FA] font-bold mb-1">Home Address (For 112 Dispatch)</label>
                <p className="p-3 bg-[#111A22] rounded-xl border border-[#263541] text-[#A8B3BE]">
                  {senior.homeInfo.address}, {senior.homeInfo.city}, {senior.homeInfo.state} (Safe Zone: 450m radius)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-[#111A22] border-t border-[#263541] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-[#263541] bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D97706]" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] border border-[#A16207]/40 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#713F12]/30 cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveAndComplete}
              className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-black text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer uppercase"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
