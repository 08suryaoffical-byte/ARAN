import React, { useState } from 'react';
import { useAran } from '../../context/AranContext';
import { translations } from '../../utils/translations';
import {
  ArrowLeft,
  Utensils,
  CheckCircle2,
  Clock,
  Volume2,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Settings,
  Sliders,
  Check,
} from 'lucide-react';

interface MealScreenProps {
  onBack?: () => void;
}

export const MealScreen: React.FC<MealScreenProps> = ({ onBack }) => {
  const { speakText, language } = useAran();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');

  // Meal & Diet settings state
  const [mealSettings, setMealSettings] = useState({
    reminderMinutesBefore: 15,
    dietType: 'Diabetic & Low Sodium',
    waterPromptAfterMeal: true,
    notifyCaregiverOnSkip: true,
  });

  const [meals, setMeals] = useState([
    {
      id: 'breakfast',
      name: 'Breakfast',
      tamilName: 'காலை உணவு',
      time: '08:30 AM',
      menu: 'Idli & Sambar (2 idlis), Warm milk',
      status: 'completed' as 'completed' | 'pending',
      icon: Sun,
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'lunch',
      name: 'Lunch',
      tamilName: 'மதிய உணவு',
      time: '01:15 PM',
      menu: 'Brown rice, Spinach kootu, Rasam, Curd',
      status: 'completed' as 'completed' | 'pending',
      icon: Sunset,
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'dinner',
      name: 'Dinner',
      tamilName: 'இரவு உணவு',
      time: '07:45 PM',
      menu: 'Soft chapati (2), Dal, Boiled vegetables',
      status: 'pending' as 'completed' | 'pending',
      icon: Moon,
      iconColor: 'text-[#A8B3BE]',
    },
  ]);

  const toggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'pending' : 'completed';
          speakText(
            language === 'ta'
              ? `${m.tamilName} நிலை புதுப்பிக்கப்பட்டது.`
              : `${m.name} status updated to ${nextStatus}.`
          );
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleSpeakOverview = () => {
    speakText(
      language === 'ta'
        ? `இன்றைய உணவு விவரம்: காலை உணவு மற்றும் மதிய உணவு முடிந்தது. இரவு உணவு இரவு 7:45 மணிக்கு உள்ளது.`
        : `Meal status: Breakfast and Lunch completed. Dinner scheduled for 7:45 PM tonight.`
    );
  };

  return (
    <div className="rounded-3xl border border-[#263541] bg-[#0B1117] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 text-[#F5F7FA]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263541] pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-[#17232D] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541] transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#D97706]" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#17232D] text-[#D97706] flex items-center justify-center border border-[#263541]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase font-mono text-[#F5F7FA]">
                DAILY MEALS & NUTRITION SETTINGS
              </h1>
              <p className="text-xs text-[#A8B3BE] font-medium">Dietary Care Plan & Meal Timings</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Schedule vs Settings Tabs */}
          <div className="flex items-center bg-[#111A22] p-1 rounded-2xl border border-[#263541]">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              Meal Schedule
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#713F12] text-[#F5F7FA] border border-[#A16207]/40 shadow-xs'
                  : 'text-[#A8B3BE] hover:text-[#F5F7FA] hover:bg-[#17232D]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Feature Settings</span>
            </button>
          </div>

          <button
            onClick={handleSpeakOverview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17232D] text-[#F5F7FA] border border-[#263541] text-xs font-bold transition-all cursor-pointer hover:bg-[#263541]"
            title="Read Status Aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <>
          {/* Main Visualization: Adherence Gauge and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left Column: Progress Widget */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-[#17232D] border border-[#263541] flex flex-col items-center justify-center text-center relative">
              <div className="w-24 h-24 rounded-full bg-[#111A22] flex items-center justify-center border border-[#263541] shadow-xs mb-3">
                <div className="w-16 h-16 rounded-2xl bg-[#713F12] text-[#F5F7FA] flex items-center justify-center shadow-md border border-[#A16207]/40">
                  <Utensils className="w-8 h-8 text-[#D97706]" />
                </div>
              </div>

              <span className="text-3xl font-black font-mono text-[#F5F7FA]">2 / 3</span>
              <span className="text-xs text-[#A8B3BE] font-bold block uppercase tracking-wider mt-0.5">
                MEALS LOGGED TODAY
              </span>

              <div className="w-full bg-[#111A22] h-2.5 rounded-full mt-4 overflow-hidden border border-[#263541]">
                <div className="bg-[#22C55E] h-full w-2/3 rounded-full transition-all duration-500" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#22C55E] mt-2">
                ● Dinner Pending (07:45 PM)
              </span>
            </div>

            {/* Right 2 Columns: Meal Timeline Cards */}
            <div className="lg:col-span-2 space-y-3">
              {meals.map((meal) => {
                const Icon = meal.icon;
                const isDone = meal.status === 'completed';

                return (
                  <div
                    key={meal.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-[#17232D] border-[#263541]'
                        : 'bg-[#17232D] border-[#A16207] shadow-md shadow-[#713F12]/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-[#111A22] border border-[#263541] text-xs font-mono font-bold shrink-0 text-[#D97706] flex items-center gap-1.5">
                          <Icon className={`w-4 h-4 ${meal.iconColor}`} />
                          {meal.time}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#F5F7FA]">{meal.name}</strong>
                            <span className="text-xs text-[#A8B3BE] font-medium">({meal.tamilName})</span>
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22C55E] bg-[#111A22] px-2.5 py-0.5 rounded-full border border-[#22C55E]">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] bg-[#111A22] px-2.5 py-0.5 rounded-full border border-[#F59E0B] animate-pulse">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A8B3BE] mt-1">{meal.menu}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleMeal(meal.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 self-end sm:self-center ${
                          isDone
                            ? 'bg-[#111A22] hover:bg-[#263541] text-[#F5F7FA] border border-[#263541]'
                            : 'bg-[#22C55E] hover:bg-emerald-600 text-black font-black uppercase shadow-md'
                        }`}
                      >
                        {isDone ? 'Mark Pending' : '✓ Mark Completed'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* ======================================================== */
        /* MEAL FEATURE SETTINGS                                   */
        /* ======================================================== */
        <div className="space-y-6">
          <div className="bg-[#17232D] border border-[#263541] rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D97706]" />
                Meal Feature Settings & Dietary Plan
              </h2>
              <p className="text-xs text-[#A8B3BE] mt-1 font-medium">
                Configure meal reminder notifications, dietary care guidelines, and post-meal hydration prompts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Diet Prescription */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Dietary Guideline
                </label>
                <p className="text-xs text-[#A8B3BE]">Clinical nutrition plan configured by doctor:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Diabetic & Low Sodium', 'Renal Friendly', 'Regular Balanced'].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setMealSettings({ ...mealSettings, dietType: diet })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mealSettings.dietType === diet
                          ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                          : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Reminder Lead Time */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] space-y-2">
                <label className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                  Meal Reminder Notice
                </label>
                <p className="text-xs text-[#A8B3BE]">Advance chime before breakfast, lunch, and dinner:</p>
                <div className="flex gap-2 pt-1">
                  {[10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setMealSettings({ ...mealSettings, reminderMinutesBefore: mins })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mealSettings.reminderMinutesBefore === mins
                          ? 'bg-[#713F12] text-[#F5F7FA] border-[#A16207]'
                          : 'bg-[#17232D] text-[#A8B3BE] border-[#263541] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Post-Meal Water Prompt */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Post-Meal Water Prompt
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Remind senior to drink warm water 30 mins after eating</p>
                </div>
                <button
                  onClick={() =>
                    setMealSettings({
                      ...mealSettings,
                      waterPromptAfterMeal: !mealSettings.waterPromptAfterMeal,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    mealSettings.waterPromptAfterMeal ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      mealSettings.waterPromptAfterMeal ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Caregiver Alert on Skip */}
              <div className="p-4 rounded-2xl bg-[#111A22] border border-[#263541] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] uppercase font-mono block">
                    Caregiver Alert on Missed Meal
                  </span>
                  <p className="text-xs text-[#A8B3BE]">Send notification if meal is 45 mins delayed</p>
                </div>
                <button
                  onClick={() =>
                    setMealSettings({
                      ...mealSettings,
                      notifyCaregiverOnSkip: !mealSettings.notifyCaregiverOnSkip,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    mealSettings.notifyCaregiverOnSkip ? 'bg-[#713F12]' : 'bg-[#263541]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                      mealSettings.notifyCaregiverOnSkip ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  speakText('Meal and dietary settings saved.');
                  setActiveTab('schedule');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#713F12] hover:bg-[#A16207] text-[#F5F7FA] text-xs font-bold shadow-md shadow-[#713F12]/30 border border-[#A16207]/40 transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
