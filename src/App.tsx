/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AranProvider, useAran } from './context/AranContext';
import { Header } from './components/Header';
import { NavigationSidebar } from './components/NavigationSidebar';
import { DarkFuturisticBackground } from './components/DarkFuturisticBackground';
import { SimulationPanel } from './components/SimulationPanel';
import { AranDeviceView } from './components/AranDeviceView';
import { SeniorView } from './components/SeniorView';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiChatModal } from './components/AiChatModal';
import { EmergencyModal } from './components/EmergencyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PatientReportModal } from './components/PatientReportModal';
import { LoginPage } from './components/LoginPage';
import { FeatureScreenWrapper } from './components/health/FeatureScreenWrapper';
import { translations } from './utils/translations';
import { LogOut } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    role,
    isSosActive,
    triggerSos,
    language,
    senior,
    activeHealthScreen,
    setActiveHealthScreen,
  } = useAran();
  const t = translations[language] || translations.en;
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showHardwareHub, setShowHardwareHub] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => setIsAuthenticated(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070B0F] text-[#F5F7FA] relative selection:bg-[#713F12] selection:text-white">
      {/* Background Animated Canvas (ECG waveform, particles, AI data-flow nodes) */}
      <DarkFuturisticBackground />

      {/* Left Navigation Sidebar */}
      <NavigationSidebar
        onOpenSos={() => {
          triggerSos('SOS Emergency Button Activated');
          setIsSosOpen(true);
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-35 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Content Area offset by Left Sidebar */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Top Header */}
        <Header
          onOpenSos={() => {
            triggerSos('SOS Emergency Button Activated');
            setIsSosOpen(true);
          }}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          showHardwareHub={showHardwareHub}
          setShowHardwareHub={setShowHardwareHub}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* If an Individual Feature / Settings Screen is Active, Change the Entire Screen to it */}
          {activeHealthScreen !== 'none' ? (
            <div className="animate-in fade-in duration-300">
              <FeatureScreenWrapper
                currentFeature={activeHealthScreen}
                onBack={() => setActiveHealthScreen('none')}
                onSelectFeature={(feature) => setActiveHealthScreen(feature)}
                onOpenSos={() => {
                  triggerSos('Emergency SOS Triggered');
                  setIsSosOpen(true);
                }}
                onOpenChat={() => setIsChatOpen(true)}
              />
            </div>
          ) : (
            <>
              {/* Hackathon Simulation Panel */}
              <SimulationPanel />

              {/* ARAN Hardware Hub Simulator (Expandable) */}
              {showHardwareHub && (
                <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                  <AranDeviceView />
                </div>
              )}

              {/* Dynamic View based on Active Role */}
              {role === 'senior' && (
                <SeniorView
                  onOpenChat={() => setIsChatOpen(true)}
                  onOpenSos={() => {
                    triggerSos('Senior pressed large SOS button on screen');
                    setIsSosOpen(true);
                  }}
                  onOpenReport={() => setIsReportOpen(true)}
                />
              )}

              {role === 'caregiver' && (
                <CaregiverDashboard
                  onOpenChat={() => setIsChatOpen(true)}
                  onOpenSos={() => {
                    triggerSos('Caregiver initiated manual emergency escalation');
                    setIsSosOpen(true);
                  }}
                  onOpenOnboarding={() => setIsOnboardingOpen(true)}
                  onOpenReport={() => setIsReportOpen(true)}
                />
              )}

              {role === 'admin' && <AdminDashboard />}
            </>
          )}
        </main>

        {/* Philosophy & Product Message Footer */}
        <footer className="bg-[#111A22] border-t border-[#263541] py-8 px-4 text-center mt-auto">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2.5 text-[#F5F7FA] font-extrabold text-sm tracking-wide">
              <img
                src="/ARAN.png"
                alt="ARAN Logo"
                className="w-6 h-6 rounded-lg object-contain bg-[#0B1117] border border-[#263541] shrink-0 p-0.5"
                referrerPolicy="no-referrer"
              />
              <span>{t.appName} · {t.tagline.toUpperCase()}</span>
            </div>

            <p className="text-xs text-[#A8B3BE] font-medium italic max-w-xl mx-auto">
              "{t.philosophyQuote}"
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-[#A8B3BE]/70 uppercase tracking-widest pt-2 font-mono">
              <span>{t.monitorAction}</span>
              <span>·</span>
              <span>{t.understandAction}</span>
              <span>·</span>
              <span>{t.communicateAction}</span>
              <span>·</span>
              <span>{t.remindAction}</span>
              <span>·</span>
              <span>{t.alertAction}</span>
              <span>·</span>
              <span>{t.connectAction}</span>
              <span>·</span>
              <span>{t.escalateAction}</span>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#A8B3BE]">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-[#A8B3BE] hover:text-[#F5F7FA] flex items-center gap-1.5 font-semibold bg-[#17232D] hover:bg-[#263541] border border-[#263541] px-3 py-1.5 rounded-xl cursor-pointer transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.switchAccount}
              </button>
              <span>·</span>
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-[#D97706] hover:underline font-semibold cursor-pointer"
              >
                {t.patientReportBtn} ({senior.name}, {t.hospitalName})
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Companion Voice & Chat Modal */}
      <AiChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Emergency & SOS Modal */}
      <EmergencyModal
        isOpen={isSosOpen || isSosActive}
        onClose={() => setIsSosOpen(false)}
      />

      {/* Senior Onboarding & Settings Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Comprehensive Patient Medical & Hospital Report Modal */}
      <PatientReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AranProvider>
      <MainAppContent />
    </AranProvider>
  );
}
