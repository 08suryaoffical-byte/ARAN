import React, { useState } from 'react';
import { useAran } from '../context/AranContext';
import { Role, LivingArrangement, Language } from '../types/aran';
import { translations, availableLanguages } from '../utils/translations';
import { localizedData } from '../utils/localizedData';
import { DarkFuturisticBackground } from './DarkFuturisticBackground';
import {
  Phone,
  Mail,
  Lock,
  Globe,
  Sparkles,
  Users,
  Home,
  Heart,
  User,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onOpenOnboarding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onOpenOnboarding }) => {
  const { setRole, senior, updateSenior, language, setLanguage } = useAran();
  const t = translations[language] || translations.en;
  const lp = (localizedData[language] || localizedData.en).loginPage;

  const [authMode, setAuthMode] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('+91 98401 23456');
  const [email, setEmail] = useState('kavitha.r@example.com');
  const [password, setPassword] = useState('••••••••');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('caregiver');
  const [selectedLiving, setSelectedLiving] = useState<LivingArrangement>(senior.livingArrangement);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    updateSenior({ livingArrangement: selectedLiving });
    onLoginSuccess();
  };

  const handleDemoClick = (demoRole: Role, living: LivingArrangement = 'independent') => {
    setRole(demoRole);
    updateSenior({ livingArrangement: living });
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#0B1117] flex flex-col items-center justify-center p-4 text-[#F5F7FA] relative selection:bg-[#713F12]">
      {/* Background visual canvas */}
      <DarkFuturisticBackground />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Language Selector Bar on Login Page */}
        <div className="flex items-center justify-between bg-[#111A22]/90 backdrop-blur-md border border-[#263541] px-4 py-2.5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
            <Globe className="w-4 h-4 shrink-0 text-[#D97706]" />
            <span className="hidden sm:inline">{lp.languageSelectLabel}</span>
            <span className="sm:hidden">Language:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-[#17232D] text-[#F5F7FA] font-bold text-xs py-1.5 px-3 rounded-xl border border-[#263541] focus:outline-none focus:border-[#A16207] cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#111A22] text-[#F5F7FA]">
                  {lang.nativeName} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="/ARAN.png"
            alt="ARAN Logo"
            className="w-20 h-20 rounded-3xl object-contain mx-auto shadow-2xl shadow-black/80 border border-[#263541] bg-[#0B1117] p-1"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7FA]">{t.appName}</h1>
          <p className="text-sm font-semibold text-[#D97706]">{t.subTagline}</p>
          <p className="text-xs text-[#A8B3BE] font-medium">"{t.tagline}"</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#17232D] text-[#F5F7FA] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#263541] space-y-6">
          {/* User Role Selector */}
          <div>
            <label className="block text-xs font-bold text-[#A8B3BE] uppercase tracking-wider mb-2 font-mono">
              {lp.whoAreYou}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111A22] p-1 rounded-2xl text-xs font-bold border border-[#263541]">
              <button
                type="button"
                onClick={() => setSelectedRole('senior')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
                  selectedRole === 'senior'
                    ? 'bg-[#713F12] text-[#F5F7FA] shadow-sm border border-[#A16207]'
                    : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
                }`}
              >
                {lp.seniorPatient}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('caregiver')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
                  selectedRole === 'caregiver'
                    ? 'bg-[#713F12] text-[#F5F7FA] shadow-sm border border-[#A16207]'
                    : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
                }`}
              >
                {lp.familyCaregiver}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-[#713F12] text-[#F5F7FA] shadow-sm border border-[#A16207]'
                    : 'text-[#A8B3BE] hover:text-[#F5F7FA]'
                }`}
              >
                {lp.homeInCharge}
              </button>
            </div>
          </div>

          {/* Living Arrangement Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#A8B3BE] uppercase tracking-wider font-mono">
                {lp.seniorLivingArrangement}
              </label>
              <span className="text-[10px] text-[#D97706] font-semibold bg-[#111A22] border border-[#263541] px-2 py-0.5 rounded-full">
                {lp.careContext}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {/* Option 1: With Family */}
              <button
                type="button"
                onClick={() => setSelectedLiving('family')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedLiving === 'family'
                    ? 'border-[#A16207] bg-[#713F12] text-[#F5F7FA] font-bold shadow-md ring-1 ring-[#A16207]'
                    : 'border-[#263541] bg-[#111A22] text-[#A8B3BE] hover:border-[#A16207]/40 hover:text-[#F5F7FA]'
                }`}
              >
                <span className="text-lg block mb-0.5">👨‍👩‍👧</span>
                <span className="font-extrabold text-xs block leading-tight">{lp.withFamily.title}</span>
                <span className="text-[10px] text-[#A8B3BE] block mt-0.5 leading-tight">{lp.withFamily.subtitle}</span>
              </button>

              {/* Option 2: Living Independently */}
              <button
                type="button"
                onClick={() => setSelectedLiving('independent')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedLiving === 'independent'
                    ? 'border-[#A16207] bg-[#713F12] text-[#F5F7FA] font-bold shadow-md ring-1 ring-[#A16207]'
                    : 'border-[#263541] bg-[#111A22] text-[#A8B3BE] hover:border-[#A16207]/40 hover:text-[#F5F7FA]'
                }`}
              >
                <span className="text-lg block mb-0.5">🏠</span>
                <span className="font-extrabold text-xs block leading-tight">{lp.livingIndependently.title}</span>
                <span className="text-[10px] text-[#A8B3BE] block mt-0.5 leading-tight">{lp.livingIndependently.subtitle}</span>
              </button>

              {/* Option 3: With Relatives */}
              <button
                type="button"
                onClick={() => setSelectedLiving('relatives')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedLiving === 'relatives'
                    ? 'border-[#A16207] bg-[#713F12] text-[#F5F7FA] font-bold shadow-md ring-1 ring-[#A16207]'
                    : 'border-[#263541] bg-[#111A22] text-[#A8B3BE] hover:border-[#A16207]/40 hover:text-[#F5F7FA]'
                }`}
              >
                <span className="text-lg block mb-0.5">👥</span>
                <span className="font-extrabold text-xs block leading-tight">{lp.withRelatives.title}</span>
                <span className="text-[10px] text-[#A8B3BE] block mt-0.5 leading-tight">{lp.withRelatives.subtitle}</span>
              </button>

              {/* Option 4: With Partner */}
              <button
                type="button"
                onClick={() => setSelectedLiving('partner')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedLiving === 'partner'
                    ? 'border-[#A16207] bg-[#713F12] text-[#F5F7FA] font-bold shadow-md ring-1 ring-[#A16207]'
                    : 'border-[#263541] bg-[#111A22] text-[#A8B3BE] hover:border-[#A16207]/40 hover:text-[#F5F7FA]'
                }`}
              >
                <span className="text-lg block mb-0.5">❤️</span>
                <span className="font-extrabold text-xs block leading-tight">{lp.withPartner.title}</span>
                <span className="text-[10px] text-[#A8B3BE] block mt-0.5 leading-tight">{lp.withPartner.subtitle}</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-bold text-[#F5F7FA] font-mono">{lp.authTitle}</span>
              <div className="space-x-3 text-[#A8B3BE]">
                <button
                  type="button"
                  onClick={() => setAuthMode('mobile')}
                  className={authMode === 'mobile' ? 'text-[#D97706] font-bold underline' : 'hover:text-[#F5F7FA]'}
                >
                  {lp.mobileOption}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('email')}
                  className={authMode === 'email' ? 'text-[#D97706] font-bold underline' : 'hover:text-[#F5F7FA]'}
                >
                  {lp.emailOption}
                </button>
              </div>
            </div>

            {authMode === 'mobile' ? (
              <div>
                <label className="block text-[#A8B3BE] font-semibold mb-1">{lp.mobileLabel}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A8B3BE] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#263541] text-sm focus:outline-[#A16207] bg-[#111A22] text-[#F5F7FA] font-medium"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[#A8B3BE] font-semibold mb-1">{lp.emailLabel}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A8B3BE] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#263541] text-sm focus:outline-[#A16207] bg-[#111A22] text-[#F5F7FA] font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#A8B3BE] font-semibold">{lp.passwordOtpLabel}</label>
                <button
                  type="button"
                  onClick={() => setOtpSent(!otpSent)}
                  className="text-[#D97706] hover:underline font-bold text-[11px]"
                >
                  {otpSent ? lp.usePassword : lp.loginViaOtp}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8B3BE] absolute left-3.5 top-3.5" />
                <input
                  type={otpSent ? 'text' : 'password'}
                  value={otpSent ? otpCode : password}
                  onChange={(e) => (otpSent ? setOtpCode(e.target.value) : setPassword(e.target.value))}
                  placeholder={otpSent ? lp.enterOtpPlaceholder : '••••••••'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#263541] text-sm focus:outline-[#A16207] bg-[#111A22] text-[#F5F7FA] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] font-extrabold text-sm tracking-wide shadow-lg shadow-[#713F12]/30 transition-all uppercase border border-[#A16207]/40 cursor-pointer"
            >
              {lp.loginBtn}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-2 border-t border-[#263541] space-y-2">
            <span className="text-[11px] font-bold text-[#A8B3BE] uppercase tracking-wider block text-center font-mono">
              {lp.instantDemoTitle}
            </span>
            <button
              onClick={() => handleDemoClick('caregiver', selectedLiving)}
              className="w-full py-2.5 rounded-xl bg-[#111A22] hover:bg-[#263541] text-[#F5F7FA] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all border border-[#263541] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              {lp.continueDemoBtn}
            </button>

            <button
              onClick={() => {
                onOpenOnboarding();
                onLoginSuccess();
              }}
              className="w-full py-2 rounded-xl text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#111A22] text-xs font-semibold text-center block cursor-pointer transition-colors"
            >
              {lp.createAccountBtn}
            </button>
          </div>

          <div className="text-center text-[10px] text-[#A8B3BE] space-x-3 pt-1">
            <a href="#privacy" className="hover:underline">{lp.privacy}</a>
            <span>·</span>
            <a href="#terms" className="hover:underline">{lp.terms}</a>
            <span>·</span>
            <a href="#forgot" className="hover:underline">{lp.forgotPassword}</a>
          </div>
        </div>
      </div>
    </div>
  );
};
