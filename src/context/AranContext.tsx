import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Role,
  Language,
  LivingArrangement,
  AccessibilityProfile,
  SeniorProfile,
  Caregiver,
  EmergencyContact,
  RoutineItem,
  MedicationItem,
  FoodTimingItem,
  MedicalReport,
  FamilyMember,
  NeighborhoodEmergency,
  SensorReading,
  Alert,
  AuditLog,
  ChatMessage,
  SimulationScenario,
  HealthScreenType,
} from '../types/aran';
import { getLocalizedSpeech } from '../utils/localizedVoice';

interface AranContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeHealthScreen: HealthScreenType;
  setActiveHealthScreen: (screen: HealthScreenType) => void;
  senior: SeniorProfile;
  updateSenior: (updates: Partial<SeniorProfile>) => void;
  updateAccessibility: (updates: Partial<AccessibilityProfile>) => void;
  updateMedicalReport: (updates: Partial<MedicalReport>) => void;
  caregivers: Caregiver[];
  updateCaregiver: (id: string, updates: Partial<Caregiver>) => void;
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => void;
  familyMembers: FamilyMember[];
  neighborhoodEmergencies: NeighborhoodEmergency[];
  emergencyContacts: EmergencyContact[];
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => void;
  routines: RoutineItem[];
  toggleRoutineStatus: (id: string, status: RoutineItem['status']) => void;
  addRoutine: (item: Omit<RoutineItem, 'id'>) => void;
  medications: MedicationItem[];
  toggleMedication: (id: string) => void;
  foodTimings: FoodTimingItem[];
  toggleFoodTiming: (id: string) => void;
  sensor: SensorReading;
  updateSensor: (updates: Partial<SensorReading>) => void;
  logWaterIntake: (amountMl?: number) => void;
  dispatch108Ambulance: () => void;
  cancel108Ambulance: () => void;
  alerts: Alert[];
  acknowledgeAlert: (alertId: string, acknowledgedBy: string, actionNote?: string) => void;
  escalateAlert: (alertId: string) => void;
  createAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'status' | 'escalationLevel'>) => void;
  messages: ChatMessage[];
  sendMessage: (text: string, sender?: 'senior' | 'caregiver' | 'aran') => Promise<void>;
  clearChat: () => void;
  auditLogs: AuditLog[];
  runSimulation: (scenario: SimulationScenario) => void;
  currentScenario: SimulationScenario;
  isSosActive: boolean;
  triggerSos: (reason?: string) => void;
  resolveSos: () => void;
  cancelSos: () => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  deviceViewMode: '3d-render' | 'exploded' | 'specs';
  setDeviceViewMode: (mode: '3d-render' | 'exploded' | 'specs') => void;
}

const defaultMedicalReport: MedicalReport = {
  primaryIllness: [
    'Hypertension (Stage 1 Essential, under pharmacological management)',
    'Mild Bilateral Knee Osteoarthritis (Degenerative joint disease)',
    'Type 2 Diabetes Mellitus (HbA1c: 6.7%, diet & medication stabilized)',
  ],
  ongoingTreatments: [
    'Telmisartan 40mg tablet daily morning after breakfast for cardiovascular & arterial stability',
    'Metformin 500mg SR tablet once daily after dinner for blood glucose regulation',
    'Glucosamine Sulfate 500mg + Calcium Carbonate & Vitamin D3 for joint cartilage support',
    'Prescribed 20-minute daily assisted indoor corridor walking and low-sodium DASH dietary regimen',
  ],
  hospitalName: 'Apollo Hospitals, Greams Road, Chennai',
  hospitalAddress: '21 Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006',
  hospitalEmergencyPhone: '044 2829 0200 / 1066',
  doctorName: 'Dr. Sundaram Ramanathan, MD, DM',
  doctorSpecialty: 'Senior Consultant Cardiologist & Geriatric Medicine Specialist',
  doctorPhone: '+91 98410 55443',
  nextFollowUpDate: '2026-10-18 (Cardiology Consultation & Renal Function Test)',
  bloodGroup: 'O Positive (O+)',
  allergies: ['Penicillin group (causes mild urticarial skin rash)', 'Sulfa antibiotics'],
  insuranceProvider: 'Star Health Senior Citizen Red Carpet Health Insurance',
  policyNumber: 'SH-SC-8849201-CHN',
  tpaHelpline: '1800 425 2255 (Cashless Hospitalization Desk)',
};

const defaultFamilyMembers: FamilyMember[] = [
  {
    id: 'FM-1',
    name: 'Kavitha Ramaswamy',
    relationship: 'Daughter (Primary Caregiver)',
    phone: '+91 98401 23456',
    email: 'kavitha.r@example.com',
    livingWithSenior: false,
    address: '14, 4th Seaward Road, Valmiki Nagar, Thiruvanmiyur, Chennai (3.2 km away)',
    notes: 'Visits every evening at 06:30 PM. Handles daily medication and grocery logistics.',
  },
  {
    id: 'FM-2',
    name: 'Vignesh Ramaswamy',
    relationship: 'Son (Secondary Caregiver)',
    phone: '+91 98840 87654',
    email: 'vignesh.r@example.com',
    livingWithSenior: false,
    address: 'B-402, Green Meadows, Velachery, Chennai (6.8 km away)',
    notes: 'Available for weekend hospital appointments and emergency escalation.',
  },
  {
    id: 'FM-3',
    name: 'Rajesh Kannan',
    relationship: 'Son-in-law',
    phone: '+91 97900 11223',
    email: 'rajesh.k@example.com',
    livingWithSenior: false,
    address: '14, 4th Seaward Road, Thiruvanmiyur, Chennai',
    notes: 'Coordinates vehicle logistics and hospital transport when required.',
  },
  {
    id: 'FM-4',
    name: 'Ananya Rajesh',
    relationship: 'Granddaughter',
    phone: '+91 98400 99881',
    email: 'ananya.student@example.com',
    livingWithSenior: false,
    address: 'Thiruvanmiyur, Chennai',
    notes: 'Speaks with grandmother every afternoon via ARAN video/audio companion.',
  },
];

const defaultNeighborhoodEmergencies: NeighborhoodEmergency[] = [
  {
    id: 'NE-1',
    name: '108 Tamil Nadu State Emergency Ambulance (GVK-EMRI)',
    type: 'Ambulance',
    phone: '108',
    distance: '1.2 km (Adyar Depot Station)',
    is24x7: true,
    address: 'Near Adyar Depot, Lattice Bridge Road, Chennai',
  },
  {
    id: 'NE-2',
    name: 'Fortis Malar Hospital 24/7 Emergency Casualty',
    type: 'Hospital',
    phone: '044 4289 2222',
    distance: '900 meters (2.5 mins drive)',
    is24x7: true,
    address: '52, 1st Main Rd, Gandhi Nagar, Adyar, Chennai 600020',
  },
  {
    id: 'NE-3',
    name: 'Apollo Speciality Hospital Kotturpuram',
    type: 'Hospital',
    phone: '044 2473 2473',
    distance: '2.4 km',
    is24x7: true,
    address: 'Kotturpuram High Road, Chennai',
  },
  {
    id: 'NE-4',
    name: 'Mr. Narayanan (Neighborhood Volunteer & Resident)',
    type: 'Neighborhood Volunteer',
    phone: '+91 94441 88990',
    distance: '30 meters (Ground Floor Apartment #102)',
    is24x7: true,
    address: 'Block B, Ground Floor, Temple View Avenue, Adyar',
  },
  {
    id: 'NE-5',
    name: 'Apollo Pharmacy 24/7 Adyar',
    type: 'Pharmacy',
    phone: '044 2441 1234',
    distance: '450 meters',
    is24x7: true,
    address: 'MG Road, Adyar, Chennai',
  },
];

const defaultFoodTimings: FoodTimingItem[] = [
  {
    id: 'FT-1',
    mealName: 'Morning Breakfast',
    scheduledTime: '08:30 AM',
    recommendedDiet: 'Idli / Oats Pongal with vegetable sambar & tender coconut water',
    status: 'completed',
    caloriesApprox: 340,
    loggedAt: '08:34 AM',
  },
  {
    id: 'FT-2',
    mealName: 'Afternoon Lunch',
    scheduledTime: '12:30 PM',
    recommendedDiet: 'Warm steamed brown rice, drumstick sambar, snake gourd kootu & buttermilk',
    status: 'pending',
    caloriesApprox: 480,
  },
  {
    id: 'FT-3',
    mealName: 'Evening Healthy Snack',
    scheduledTime: '04:30 PM',
    recommendedDiet: 'Steamed sundal (chickpeas) with light green tea or warm milk',
    status: 'pending',
    caloriesApprox: 180,
  },
  {
    id: 'FT-4',
    mealName: 'Night Dinner',
    scheduledTime: '08:00 PM',
    recommendedDiet: 'Two soft phulkas (rotis) with dal palak or vegetable soup (Low sodium)',
    status: 'pending',
    caloriesApprox: 320,
  },
];

const defaultMedications: MedicationItem[] = [
  {
    id: 'MED-1',
    name: 'Telmisartan (Blood Pressure)',
    dosage: '40 mg',
    time: '08:30 AM',
    timingCategory: 'Morning',
    frequency: 'Once daily after breakfast',
    instructions: 'Take with warm water. Crucial for arterial hypertension maintenance.',
    prescribedBy: 'Dr. Sundaram Ramanathan (Apollo)',
    status: 'completed',
  },
  {
    id: 'MED-2',
    name: 'Calcium Carbonate & Vitamin D3',
    dosage: '500 mg',
    time: '01:00 PM',
    timingCategory: 'Afternoon',
    frequency: 'Once daily after lunch',
    instructions: 'Bone density and osteoarthritis joint support.',
    prescribedBy: 'Dr. Sundaram Ramanathan (Apollo)',
    status: 'pending',
  },
  {
    id: 'MED-3',
    name: 'Metformin SR (Blood Sugar)',
    dosage: '500 mg',
    time: '08:30 PM',
    timingCategory: 'Night',
    frequency: 'Once daily after dinner',
    instructions: 'Glycemic stabilization. Take immediately after dinner.',
    prescribedBy: 'Dr. Sundaram Ramanathan (Apollo)',
    status: 'pending',
  },
  {
    id: 'MED-4',
    name: 'Atorvastatin (Lipid Support)',
    dosage: '10 mg',
    time: '09:30 PM',
    timingCategory: 'Night',
    frequency: 'Once daily at bedtime',
    instructions: 'Vascular and cardiovascular protection.',
    prescribedBy: 'Dr. Sundaram Ramanathan (Apollo)',
    status: 'pending',
  },
];

const defaultSenior: SeniorProfile = {
  id: 'SEN-001',
  name: 'Lakshmi Ramaswamy',
  preferredName: 'Lakshmi Amma',
  age: 72,
  dob: '1954-04-12',
  gender: 'Female',
  language: 'ta',
  livingArrangement: 'independent',
  homeInfo: {
    address: '42, Temple View Avenue, Gandhi Nagar, Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    apartment: 'Block B, 204',
    floor: '2nd Floor',
    room: 'Master Bedroom',
    safeZoneRadiusMeters: 450,
  },
  deviceId: 'ARAN-001',
  accessibility: {
    canSeeNormally: false,
    canHearNormally: true,
    canSpeakNormally: true,
    canUseSmartphone: false,
    difficultySeeing: true,
    difficultyHearing: false,
    difficultySpeaking: false,
    difficultySmartphone: true,
    limitedMobility: false,
    communicationPreferences: ['voice', 'large_buttons', 'tactile'],
    highContrast: true,
    extraLargeFont: true,
    voiceVolumeBoost: true,
  },
  medicalReport: defaultMedicalReport,
  familyMembers: defaultFamilyMembers,
  neighborhoodEmergencies: defaultNeighborhoodEmergencies,
};

const defaultCaregivers: Caregiver[] = [
  {
    id: 'CG-1',
    name: 'Kavitha Ramaswamy',
    relationship: 'Daughter',
    phone: '+91 98401 23456',
    email: 'kavitha.r@example.com',
    priority: 'primary',
    permissionLevel: 'full',
  },
  {
    id: 'CG-2',
    name: 'Vignesh Ramaswamy',
    relationship: 'Son',
    phone: '+91 98840 87654',
    email: 'vignesh.r@example.com',
    priority: 'secondary',
    permissionLevel: 'full',
  },
];

const defaultEmergencyContacts: EmergencyContact[] = [
  {
    id: 'EC-1',
    name: 'Kavitha Ramaswamy (Daughter)',
    relationship: 'Primary Family Caregiver',
    phone: '+91 98401 23456',
    priority: 'Primary Contact',
    locationSharing: true,
  },
  {
    id: 'EC-2',
    name: '108 Tamil Nadu State Ambulance Service',
    relationship: 'Government Emergency Medical Dispatch',
    phone: '108',
    priority: 'Emergency Contact',
    locationSharing: true,
  },
  {
    id: 'EC-3',
    name: '112 National Emergency Response',
    relationship: 'Emergency Authority',
    phone: '112',
    priority: 'Emergency Contact',
    locationSharing: true,
  },
  {
    id: 'EC-4',
    name: 'Mr. Narayanan (Ground Floor Neighbor)',
    relationship: 'Neighborhood Volunteer (30m away)',
    phone: '+91 94441 88990',
    priority: 'Secondary Contact',
    locationSharing: true,
  },
];

const defaultRoutines: RoutineItem[] = [
  {
    id: 'RT-1',
    name: 'Morning Wakeup & Ambient Light',
    time: '07:30 AM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 30,
    type: 'wakeup',
    status: 'completed',
    notes: 'Gentle sunrise lighting and temple flute chime',
  },
  {
    id: 'RT-2',
    name: 'Morning Check-in & Are You Okay Voice Prompt',
    time: '08:00 AM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 15,
    type: 'checkin',
    status: 'completed',
    notes: 'Spoken in Tamil & Tanglish with audio reply listener',
  },
  {
    id: 'RT-3',
    name: 'Breakfast & Morning Tablets (Telmisartan)',
    time: '08:30 AM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 30,
    type: 'meal',
    status: 'completed',
    notes: 'Dietary adherence & BP tablet confirmation',
  },
  {
    id: 'RT-4',
    name: 'Morning Hydration Glass (250ml)',
    time: '10:00 AM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 30,
    type: 'hydration',
    status: 'completed',
    notes: 'Target 250ml warm water or herbal infusion',
  },
  {
    id: 'RT-5',
    name: 'Lunch & Afternoon Pills',
    time: '12:30 PM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 30,
    type: 'meal',
    status: 'pending',
    notes: 'Steamed rice, sambar, kootu and Calcium D3',
  },
  {
    id: 'RT-6',
    name: 'Afternoon Hydration Glass (250ml)',
    time: '03:00 PM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 30,
    type: 'hydration',
    status: 'pending',
    notes: 'Tender coconut or fresh lemon water',
  },
  {
    id: 'RT-7',
    name: 'Evening Check-in & Daughter Sync',
    time: '06:00 PM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 15,
    type: 'checkin',
    status: 'pending',
    notes: 'Caregiver sync and day review',
  },
  {
    id: 'RT-8',
    name: 'Dinner & Night Tablets (Metformin + Atorvastatin)',
    time: '08:00 PM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 30,
    type: 'meal',
    status: 'pending',
    notes: 'Low-sodium dinner and bedtime cardiac medication',
  },
  {
    id: 'RT-9',
    name: 'Night Sleep Routine & Passive Motion Tracking',
    time: '10:00 PM',
    repeat: 'Daily',
    reminder: true,
    gracePeriodMinutes: 45,
    type: 'sleep',
    status: 'pending',
    notes: 'Night light activation and radar fall detection on',
  },
];

const defaultSensor: SensorReading = {
  heartRate: 72,
  temperature: 36.6,
  ambientTemperature: 29.4,
  heatWarning: false,
  spO2: 98,
  bloodPressureSystolic: 122,
  bloodPressureDiastolic: 82,
  bloodPressureRate: '122/82 mmHg',
  bloodPressureStatus: 'NORMAL',
  motion: 'normal',
  motionWarning: null,
  activityLevel: 'normal',
  stepsToday: 4238,
  activeMinutes: 204,
  inactivityMinutes: 12,
  sleepScore: 82,
  sleepDuration: '7h 24m',
  deepSleep: '2h 10m',
  lightSleep: '4h 12m',
  awakeTime: '1h 02m',
  fallDetected: false,
  fallEventDetails: undefined,
  lastHydrationTime: '11:00 AM',
  nextHydrationTime: '03:00 PM',
  hydrationStatus: 'Good',
  waterIntakeTodayMl: 1250,
  waterTargetMl: 2000,
  batteryLevel: 82,
  isCharging: false,
  isConnected: true,
  bluetoothConnected: true,
  wifiConnected: true,
  cellularActive: true,
  lastSync: 'Just now (10s ago)',
  location: {
    lat: 13.0067,
    lng: 80.2575,
    address: 'Adyar, Chennai, Tamil Nadu',
    insideSafeZone: true,
  },
  ambulance108Dispatched: false,
  ambulance108EtaMinutes: 8,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const defaultAlerts: Alert[] = [
  {
    id: 'ALT-101',
    title: 'Morning Check-in Verified',
    reason: 'Morning check-in confirmed via voice response at 08:04 AM.',
    aiExplanation: 'Normal routine observed. Senior replied "I am okay" clearly to ARAN voice prompt.',
    level: 'GREEN',
    timestamp: '08:04 AM',
    status: 'resolved',
    acknowledgedBy: 'System Auto-Log',
    acknowledgedAt: '08:04 AM',
    actionTaken: 'Normal day routine continued',
    escalationLevel: 1,
    sensorContext: {
      heartRate: 74,
      bloodPressure: '122/82 mmHg',
      activity: 'normal',
      checkinStatus: 'Confirmed',
    },
  },
];

const defaultAuditLogs: AuditLog[] = [
  {
    id: 'LOG-01',
    timestamp: '07:30 AM',
    actor: 'ARAN-001 Hardware Hub',
    action: 'Device Self-Test & Diagnostic Passed',
    details: 'Sensors: HR, Thermal, Ambient Temp, IMU Accelerometer, BP rate sync operational.',
    level: 'info',
  },
  {
    id: 'LOG-02',
    timestamp: '08:04 AM',
    actor: 'Lakshmi Amma',
    action: 'Morning Check-in Voice Confirmation',
    details: 'Spoke "Aama, naan nalla irukken" with high acoustic confidence.',
    level: 'info',
  },
  {
    id: 'LOG-03',
    timestamp: '08:34 AM',
    actor: 'Smart Pill Dispenser',
    action: 'Morning Tablet Intake Confirmed',
    details: 'Telmisartan 40mg taken on time with water.',
    level: 'info',
  },
];

const defaultChatMessages: ChatMessage[] = [
  {
    id: 'MSG-1',
    sender: 'aran',
    text: 'காலை வணக்கம் அம்மா! (Good morning, Amma!) Your morning check-in is due. Are you feeling okay?',
    timestamp: '08:00 AM',
  },
  {
    id: 'MSG-2',
    sender: 'senior',
    text: 'Aama, naan nalla irukken. (Yes, I am okay.)',
    timestamp: '08:04 AM',
  },
  {
    id: 'MSG-3',
    sender: 'aran',
    text: 'Thank you, Lakshmi Amma! Your check-in and blood pressure (122/82 mmHg) are logged as normal. Breakfast & Telmisartan tablet reminder scheduled for 08:30 AM.',
    timestamp: '08:04 AM',
  },
];

const AranContext = createContext<AranContextType | undefined>(undefined);

export const AranProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('caregiver');
  const [language, setLanguage] = useState<Language>('ta');
  const [senior, setSenior] = useState<SeniorProfile>(defaultSenior);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(defaultCaregivers);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(defaultFamilyMembers);
  const [neighborhoodEmergencies, setNeighborhoodEmergencies] = useState<NeighborhoodEmergency[]>(defaultNeighborhoodEmergencies);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(defaultEmergencyContacts);
  const [routines, setRoutines] = useState<RoutineItem[]>(defaultRoutines);
  const [medications, setMedications] = useState<MedicationItem[]>(defaultMedications);
  const [foodTimings, setFoodTimings] = useState<FoodTimingItem[]>(defaultFoodTimings);
  const [sensor, setSensor] = useState<SensorReading>(defaultSensor);
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(defaultAuditLogs);
  const [messages, setMessages] = useState<ChatMessage[]>(defaultChatMessages);
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>('NORMAL');
  const [activeHealthScreen, setActiveHealthScreen] = useState<HealthScreenType>('none');
  const [isSosActive, setIsSosActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deviceViewMode, setDeviceViewMode] = useState<'3d-render' | 'exploded' | 'specs'>('3d-render');

  // Text-to-speech engine using Web Speech API
  const speakText = useCallback(
    (text: string) => {
      if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      const langLocaleMap: Record<Language, string> = {
        ta: 'ta-IN',
        hi: 'hi-IN',
        ml: 'ml-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        gu: 'gu-IN',
        fr: 'fr-FR',
        en: 'en-US',
        tanglish: 'ta-IN',
      };

      const targetLocale = langLocaleMap[language] || 'en-US';
      utterance.lang = targetLocale;
      const targetPrefix = targetLocale.split('-')[0].toLowerCase();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(targetPrefix) ||
          v.name.toLowerCase().includes(targetPrefix),
      );
      if (matchedVoice) utterance.voice = matchedVoice;
      
      utterance.rate = language === 'fr' ? 1.0 : 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [soundEnabled, language],
  );

  const updateSenior = (updates: Partial<SeniorProfile>) => {
    setSenior((prev) => ({ ...prev, ...updates }));
  };

  const updateAccessibility = (updates: Partial<AccessibilityProfile>) => {
    setSenior((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...updates },
    }));
  };

  const updateMedicalReport = (updates: Partial<MedicalReport>) => {
    setSenior((prev) => ({
      ...prev,
      medicalReport: { ...prev.medicalReport, ...updates },
    }));
  };

  const updateCaregiver = (id: string, updates: Partial<Caregiver>) => {
    setCaregivers((prev) => prev.map((cg) => (cg.id === id ? { ...cg, ...updates } : cg)));
  };

  const addCaregiver = (caregiver: Omit<Caregiver, 'id'>) => {
    const newCg: Caregiver = {
      ...caregiver,
      id: `CG-${Date.now().toString().slice(-4)}`,
    };
    setCaregivers((prev) => [...prev, newCg]);
  };

  const updateEmergencyContact = (id: string, updates: Partial<EmergencyContact>) => {
    setEmergencyContacts((prev) => prev.map((ec) => (ec.id === id ? { ...ec, ...updates } : ec)));
  };

  const toggleRoutineStatus = (id: string, status: RoutineItem['status']) => {
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const addRoutine = (item: Omit<RoutineItem, 'id'>) => {
    const newItem: RoutineItem = {
      ...item,
      id: `RT-${Date.now().toString().slice(-4)}`,
    };
    setRoutines((prev) => [...prev, newItem]);
  };

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m,
      ),
    );
  };

  const toggleFoodTiming = (id: string) => {
    setFoodTimings((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === 'completed' ? 'pending' : 'completed',
              loggedAt: f.status === 'completed' ? undefined : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : f,
      ),
    );
  };

  const updateSensor = (updates: Partial<SensorReading>) => {
    setSensor((prev) => ({
      ...prev,
      ...updates,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  };

  const logWaterIntake = (amountMl = 250) => {
    setSensor((prev) => {
      const newTotal = prev.waterIntakeTodayMl + amountMl;
      return {
        ...prev,
        waterIntakeTodayMl: newTotal,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });

    const msg =
      language === 'ta'
        ? `தண்ணீர் குடித்தது பதிவு செய்யப்பட்டது. இன்று மொத்தம் ${sensor.waterIntakeTodayMl + amountMl} மிலி.`
        : `Water intake recorded (+${amountMl}ml). Today's total: ${sensor.waterIntakeTodayMl + amountMl}ml / 2000ml.`;
    speakText(msg);

    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Lakshmi Amma (Senior)',
      action: 'Hydration Intake Logged',
      details: `Added ${amountMl}ml glass of water. Daily total: ${sensor.waterIntakeTodayMl + amountMl}ml.`,
      level: 'info',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const dispatch108Ambulance = () => {
    updateSensor({
      ambulance108Dispatched: true,
      ambulance108EtaMinutes: 7,
    });

    createAlert({
      title: '🚑 108 Ambulance Dispatched to Residence',
      reason: 'Emergency dispatch triggered for Adyar address (42, Temple View Avenue).',
      aiExplanation:
        'Attention recommended: Government 108 Ambulance (GVK-EMRI Adyar unit) en route. Estimated arrival in 7 minutes. Nearby Fortis Malar Hospital and family alerted.',
      level: 'RED',
      sensorContext: {
        bloodPressure: sensor.bloodPressureRate,
        heartRate: sensor.heartRate,
      },
    });

    const msg =
      language === 'ta'
        ? 'அவசர 108 ஆம்புலன்ஸ் அனுப்பப்பட்டுள்ளது. இன்னும் 7 நிமிடங்களில் வந்தடையும். அமைதியாக இருங்கள்.'
        : '108 Ambulance dispatched to your home. Estimated arrival time 7 minutes. Stay calm.';
    speakText(msg);
  };

  const cancel108Ambulance = () => {
    updateSensor({
      ambulance108Dispatched: false,
    });
    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Family Caregiver',
      action: '108 Ambulance Stand Down',
      details: 'False alarm cleared. Senior verified safe by caregiver.',
      level: 'info',
    };
    setAuditLogs((prev) => [log, ...prev]);
    speakText('108 Ambulance emergency stand down confirmed.');
  };

  const createAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'status' | 'escalationLevel'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `ALT-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      escalationLevel: alertData.level === 'RED' ? 4 : alertData.level === 'YELLOW' ? 2 : 1,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: newAlert.timestamp,
      actor: 'ARAN AI Fusion Engine',
      action: `Alert Raised: ${newAlert.title}`,
      details: `${newAlert.reason} — ${newAlert.aiExplanation}`,
      level: newAlert.level === 'RED' ? 'critical' : newAlert.level === 'YELLOW' ? 'warning' : 'info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const acknowledgeAlert = (alertId: string, acknowledgedBy: string, actionNote = 'Verification completed by caregiver') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'acknowledged',
              acknowledgedBy,
              acknowledgedAt: nowTime,
              actionTaken: actionNote,
            }
          : a,
      ),
    );

    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: nowTime,
      actor: acknowledgedBy,
      action: `Alert Acknowledged: ${alertId}`,
      details: `Action Taken: ${actionNote}`,
      level: 'info',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const escalateAlert = (alertId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const nextLevel = Math.min(4, (a.escalationLevel + 1)) as 1 | 2 | 3 | 4;
          return {
            ...a,
            status: 'escalated',
            escalationLevel: nextLevel,
            level: nextLevel >= 3 ? 'RED' : 'YELLOW',
          };
        }
        return a;
      }),
    );

    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: nowTime,
      actor: 'Caregiver Escalation Matrix',
      action: `Escalated alert ${alertId} to next hierarchy level`,
      details: 'Automated notification dispatched to secondary emergency contacts.',
      level: 'warning',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const triggerSos = (reason = 'Physical / App SOS button activated by senior') => {
    setIsSosActive(true);
    createAlert({
      title: '🚨 HIGH PRIORITY: SOS Activated',
      reason,
      aiExplanation:
        'Attention recommended because: • Physical SOS trigger confirmed on ARAN device • Emergency broadcast sent to primary & secondary family caregivers • Location shared with 108 Emergency Service.',
      level: 'RED',
      sensorContext: {
        heartRate: sensor.heartRate,
        bloodPressure: sensor.bloodPressureRate,
        activity: 'SOS Event Triggered',
      },
    });

    const sosMsg =
      language === 'ta'
        ? 'அவசர உதவி கோரப்பட்டுள்ளது! கவிதா மற்றும் 108 ஆம்புலன்ஸ் சேவைக்கு தகவல் அனுப்பப்படுகிறது.'
        : 'SOS Activated. Help is being notified immediately. Daughter Kavitha and 108 emergency response alerted.';
    speakText(sosMsg);
  };

  const resolveSos = () => {
    setIsSosActive(false);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: nowTime,
      actor: 'Family Caregiver',
      action: 'SOS Emergency Stand Down',
      details: 'Senior confirmed safe. Status returned to normal monitoring.',
      level: 'info',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const sendMessage = async (text: string, sender: 'senior' | 'caregiver' | 'aran' = 'senior') => {
    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          seniorName: senior.name,
          seniorContext: {
            age: senior.age,
            livingArrangement: senior.livingArrangement,
            lastHydration: '4 hours ago',
            bloodPressureRate: sensor.bloodPressureRate,
            doctorName: senior.medicalReport.doctorName,
            hospitalName: senior.medicalReport.hospitalName,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply;
        const aranMsg: ChatMessage = {
          id: `MSG-${Date.now() + 1}`,
          sender: 'aran',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aranMsg]);
        speakText(replyText);
        return;
      }
    } catch (e) {
      console.warn('API chat failed, using local companion response', e);
    }

    let reply = `Thank you, ${senior.name}. I have recorded your note and notified your daughter Kavitha.`;
    if (text.toLowerCase().includes('water') || text.toLowerCase().includes('thanni')) {
      reply =
        language === 'ta'
          ? 'சரி அம்மா, தண்ணீர் உதவியை பதிவு செய்துள்ளேன். தயவுசெய்து சிறிது அமருங்கள்.'
          : 'Hydration check recommended. I have noted your water request and notified your caregiver.';
    }
    const aranMsg: ChatMessage = {
      id: `MSG-${Date.now() + 1}`,
      sender: 'aran',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aranMsg]);
    speakText(reply);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Hackathon simulation engine with all requested scenarios
  const runSimulation = (scenario: SimulationScenario) => {
    setCurrentScenario(scenario);

    const scenarioScreenMap: Partial<Record<SimulationScenario, HealthScreenType>> = {
      NORMAL: 'normal-baseline',
      HIGH_BP: 'high-bp',
      HEAT_WARNING: 'room-heat',
      MOTION_FALL_WARNING: 'fall',
      POSSIBLE_FALL: 'fall',
      WATER_ALERT: 'water-alert',
      AMBULANCE_108_DISPATCH: 'ambulance-108',
      SUCCESSFUL_CHECKIN: 'checkin',
      MISSED_CHECKIN: 'missed-checkin',
      LOW_ACTIVITY: 'low-activity',
      HIGH_HEART_RATE: 'heart-attention',
      TEMPERATURE_CHANGE: 'temp',
      LOW_SPO2: 'low-spo2',
      MOTION_DETECTED: 'activity',
      SOS: 'sos',
      DEVICE_OFFLINE: 'offline',
      LOW_BATTERY: 'battery-low',
      HYDRATION_DUE: 'water-alert',
      LOCATION_CHANGE: 'safe-zone-breach',
    };
    if (scenarioScreenMap[scenario]) {
      setActiveHealthScreen(scenarioScreenMap[scenario]!);
    }

    const localizedSpeech = getLocalizedSpeech(scenario, language);
    if (localizedSpeech) {
      speakText(localizedSpeech);
    }

    switch (scenario) {
      case 'NORMAL': {
        setIsSosActive(false);
        updateSensor({
          heartRate: 72,
          temperature: 36.6,
          ambientTemperature: 29.4,
          heatWarning: false,
          spO2: 98,
          bloodPressureSystolic: 122,
          bloodPressureDiastolic: 82,
          bloodPressureRate: '122/82 mmHg',
          bloodPressureStatus: 'NORMAL',
          motion: 'normal',
          motionWarning: null,
          activityLevel: 'normal',
          stepsToday: 4238,
          activeMinutes: 204,
          inactivityMinutes: 12,
          sleepScore: 82,
          fallDetected: false,
          fallEventDetails: undefined,
          hydrationStatus: 'Good',
          lastHydrationTime: '11:00 AM',
          nextHydrationTime: '03:00 PM',
          batteryLevel: 82,
          isConnected: true,
          ambulance108Dispatched: false,
          location: { ...sensor.location, insideSafeZone: true },
        });
        createAlert({
          title: 'All Sensor Signals Normal',
          reason: 'Blood pressure rate (122/82 mmHg) and vitals are aligned with personal baseline.',
          aiExplanation:
            'Baseline established: Heart rate within regular range, ambient room comfortable (29.4°C), motion steady.',
          level: 'GREEN',
        });
        speakText('System status normal. Blood pressure, room comfort and all sensors operating within baseline.');
        break;
      }

      case 'HIGH_BP': {
        updateSensor({
          bloodPressureSystolic: 158,
          bloodPressureDiastolic: 98,
          bloodPressureRate: '158/98 mmHg',
          bloodPressureStatus: 'HIGH',
        });
        createAlert({
          title: '⚠️ Blood Pressure Rate Deviation (158/98 mmHg)',
          reason: 'Systolic/diastolic rate reading is elevated above personal baseline target (120-130 / 80-85 mmHg).',
          aiExplanation:
            'Attention recommended because: • Arterial sensor recorded 158/98 mmHg. • Morning Telmisartan 40mg adherence verified. • Caregiver verification recommended; suggest rest and quiet environment. ARAN does not provide medical diagnosis.',
          level: 'YELLOW',
          sensorContext: {
            bloodPressure: '158/98 mmHg',
            heartRate: 84,
          },
        });
        speakText(
          language === 'ta'
            ? 'கவனம்: இரத்த அழுத்த அளவு (158/98 mmHg) சற்று உயர்ந்துள்ளது. சிறிது நேரம் ஓய்வெடுக்கவும்.'
            : 'Attention recommended: Blood pressure rate is elevated at 158/98 mmHg. Please rest in a comfortable chair.',
        );
        break;
      }

      case 'HEAT_WARNING': {
        updateSensor({
          ambientTemperature: 38.6,
          temperature: 37.4,
          heatWarning: true,
          heatWarningMessage: 'High room ambient heat index detected (38.6°C). Risk of senior thermal discomfort.',
        });
        createAlert({
          title: '☀️ Ambient Room Heat Warning (38.6°C)',
          reason: 'Indoor thermal environment sensor detected heat wave conditions inside senior residence.',
          aiExplanation:
            'Attention recommended: Heat warning active. High ambient temperature increases senior dehydration risk. ARAN recommends turning on fan/AC and offering cold water or buttermilk.',
          level: 'YELLOW',
          sensorContext: {
            ambientTemperature: 38.6,
            temperature: 37.4,
          },
        });
        speakText(
          language === 'ta'
            ? 'அறை வெப்ப எச்சரிக்கை: வெப்பநிலை 38.6 டிகிரி செல்சியஸாக உள்ளது. மின்விசிறி அல்லது ஏசி போட்டு தண்ணீர் குடிக்கவும்.'
            : 'Ambient heat warning: Room temperature is 38.6°C. Please turn on cooling and drink cool water.',
        );
        break;
      }

      case 'MOTION_FALL_WARNING': {
        updateSensor({
          motion: 'none',
          motionWarning: 'Sudden deceleration impact detected followed by prolonged immobility.',
          activityLevel: 'sedentary',
        });
        createAlert({
          title: '🚨 Motion Sensor Warning: Possible Fall Deceleration',
          reason: '3-axis accelerometer recorded rapid velocity transition and no subsequent movement for 90 seconds.',
          aiExplanation:
            'High priority alert: Fall pattern detected. ARAN is initiating immediate caregiver call and stand-by for 108 ambulance dispatch.',
          level: 'RED',
          sensorContext: {
            motionWarning: 'Sudden fall impact detected',
            heartRate: 98,
          },
        });
        speakText(
          language === 'ta'
            ? 'இயக்க எச்சரிக்கை: திடீர் சறுக்கல் கண்டறியப்பட்டது! நீங்கள் நலமா? உதவி அனுப்பப்படுகிறது.'
            : 'Motion sensor warning: Sudden impact detected. Are you okay, Lakshmi Amma? Caregiver notified.',
        );
        break;
      }

      case 'WATER_ALERT': {
        createAlert({
          title: '💧 Water Alert: Hydration Deficit Recommended',
          reason: 'Daily water intake is currently 500ml, below recommended 1500ml afternoon target.',
          aiExplanation:
            'Hydration check recommended based on timing schedule and warm weather. Regular fluids prevent lethargy.',
          level: 'YELLOW',
        });
        speakText(
          language === 'ta'
            ? 'அம்மா, தண்ணீர் எச்சரிக்கை: தயவுசெய்து ஒரு டம்ளர் தண்ணீர் குடியுங்கள்.'
            : 'Water alert: Hydration check recommended. Please take a glass of water.',
        );
        break;
      }

      case 'AMBULANCE_108_DISPATCH': {
        dispatch108Ambulance();
        break;
      }

      case 'SUCCESSFUL_CHECKIN': {
        updateSensor({
          motion: 'normal',
          activityLevel: 'normal',
        });
        toggleRoutineStatus('RT-2', 'completed');
        createAlert({
          title: 'Scheduled Check-in Completed',
          reason: 'Senior confirmed presence within grace period.',
          aiExplanation:
            'Confirmation received promptly. No signs of distress or delayed responsiveness detected.',
          level: 'GREEN',
        });
        speakText(
          language === 'ta'
            ? 'உங்கள் காலை செக்-இன் வெற்றிகரமாக பதிவு செய்யப்பட்டது.'
            : 'Good morning! Check-in confirmed successfully.',
        );
        break;
      }

      case 'MISSED_CHECKIN': {
        toggleRoutineStatus('RT-2', 'missed');
        createAlert({
          title: 'Scheduled Check-in Missed',
          reason: 'No scheduled confirmation was received within the configured 15-minute grace period.',
          aiExplanation:
            'Attention recommended because: • Morning check-in was missed. • Expected activity was lower than personal baseline. • Last successful contact was 11 hours ago.',
          level: 'YELLOW',
          sensorContext: {
            heartRate: 75,
            activity: 'low',
            checkinStatus: 'Missed',
          },
        });
        speakText(
          language === 'ta'
            ? 'கவனம் தேவை: காலை செக்-இன் உறுதி செய்யப்படவில்லை. பராமரிப்பாளருக்கு தகவல் அனுப்பப்படுகிறது.'
            : 'Attention recommended: Scheduled check-in missed. Caregiver notification initiated.',
        );
        break;
      }

      case 'LOW_ACTIVITY': {
        updateSensor({
          motion: 'minimal',
          activityLevel: 'low',
        });
        createAlert({
          title: 'Unusual Activity Pattern Detected',
          reason: 'Sensor fusion indicates zero movement in common living areas for over 3.5 hours.',
          aiExplanation:
            'Attention recommended because: • Accelerometer readings indicate prolonged immobility during active hours (10:00 AM). • Caregiver verification recommended.',
          level: 'YELLOW',
        });
        speakText('Unusual inactivity pattern detected. Caregiver check recommended.');
        break;
      }

      case 'HIGH_HEART_RATE': {
        updateSensor({
          heartRate: 104,
          motion: 'minimal',
        });
        createAlert({
          title: 'Routine Deviation: Elevated Heart Rate Pattern',
          reason: 'Heart rate reading (104 BPM) is noticeably higher than personal baseline (70–85 BPM) while at rest.',
          aiExplanation:
            'Caregiver verification recommended. ARAN does not diagnose cardiac conditions, but alerts family to review resting comfort.',
          level: 'YELLOW',
          sensorContext: {
            heartRate: 104,
          },
        });
        speakText('Resting heart rate pattern is higher than your personal baseline. Caregiver notified.');
        break;
      }

      case 'TEMPERATURE_CHANGE': {
        updateSensor({
          temperature: 38.2,
        });
        createAlert({
          title: 'Temperature Variation Observed',
          reason: 'Body temperature sensor recorded 38.2°C, above typical comfort baseline (36.6°C).',
          aiExplanation:
            'Attention recommended: Thermal sensor trend indicates warmth. Caregiver advised to check room ventilation and fluids.',
          level: 'YELLOW',
        });
        speakText('Body temperature variation observed. Attention recommended.');
        break;
      }

      case 'LOW_SPO2': {
        updateSensor({
          spO2: 93,
        });
        createAlert({
          title: 'SpO2 Variation Observed (93%)',
          reason: 'Blood oxygen saturation reading recorded 93%, below personal baseline (97–99%).',
          aiExplanation:
            'Caregiver verification recommended. Low reading observed. Ensure sensor probe fit and verify breathing comfort.',
          level: 'YELLOW',
          sensorContext: {
            heartRate: sensor.heartRate,
          },
        });
        speakText('SpO2 reading differs from baseline. Caregiver verification recommended.');
        break;
      }

      case 'MOTION_DETECTED': {
        updateSensor({
          motion: 'normal',
          activityLevel: 'normal',
          stepsToday: sensor.stepsToday + 160,
          activeMinutes: sensor.activeMinutes + 12,
          inactivityMinutes: 0,
          fallDetected: false,
          motionWarning: null,
        });
        createAlert({
          title: 'Active Senior Movement Detected',
          reason: 'Continuous natural motion registered by 3-axis accelerometer.',
          aiExplanation: 'Normal walking and room activity detected. Steps updated.',
          level: 'GREEN',
        });
        speakText('Movement detected. Daily activity progress recorded.');
        break;
      }

      case 'POSSIBLE_FALL': {
        updateSensor({
          motion: 'none',
          activityLevel: 'sedentary',
          motionWarning: 'Impact detected. Movement after event: None',
          fallDetected: true,
          fallEventDetails: 'Possible fall event detected. Please check the senior.',
        });
        createAlert({
          title: '🚨 Possible Fall Event',
          reason: 'Impact deceleration detected with no post-impact movement for 60 seconds.',
          aiExplanation:
            'Attention recommended: Possible fall event. Movement after event: None. Please check the senior immediately.',
          level: 'RED',
          sensorContext: {
            motionWarning: 'Impact detected. Movement after event: None',
            heartRate: 96,
          },
        });
        speakText('Possible fall event detected. Please check the senior.');
        break;
      }

      case 'SOS': {
        triggerSos('Physical SOS emergency button depressed on ARAN device.');
        break;
      }

      case 'DEVICE_OFFLINE': {
        updateSensor({
          isConnected: false,
          bluetoothConnected: false,
          wifiConnected: false,
        });
        createAlert({
          title: 'ARAN Device Disconnected',
          reason: 'Device heartbeat lost on Wi-Fi and Bluetooth channels for >2 minutes.',
          aiExplanation:
            'Device offline alert: Hub is unreachable. May be unplugged or local internet is down.',
          level: 'YELLOW',
        });
        speakText('Warning: ARAN companion device has gone offline.');
        break;
      }

      case 'LOW_BATTERY': {
        updateSensor({
          batteryLevel: 14,
          isCharging: false,
        });
        createAlert({
          title: 'ARAN Device Battery Low (14%)',
          reason: 'Internal rechargeable battery reserve below 15% safety threshold.',
          aiExplanation:
            'Please place the ARAN hub on its magnetic charging dock to maintain uninterrupted continuous monitoring.',
          level: 'YELLOW',
        });
        speakText('ARAN device battery is low. Please dock for charging.');
        break;
      }

      case 'HYDRATION_DUE': {
        updateSensor({
          hydrationStatus: 'Check Recommended',
        });
        createAlert({
          title: 'Hydration Check Recommended',
          reason: 'Last hydration record was 4 hours ago and ambient sensor detects warm conditions.',
          aiExplanation:
            'Hydration check recommended based on schedule and time elapsed. Not a biological measurement of thirst.',
          level: 'YELLOW',
        });
        speakText('Hydration check recommended. Lakshmi Amma, would you like a glass of water?');
        break;
      }

      case 'MEAL_PENDING': {
        createAlert({
          title: 'Meal Check Pending',
          reason: 'Scheduled lunch (12:30 PM) is not yet confirmed by senior or caregiver.',
          aiExplanation:
            'Meal check pending: Routine adherence notice. ARAN does not detect hunger, but tracks daily dietary routine.',
          level: 'YELLOW',
        });
        speakText('Meal check pending for afternoon schedule.');
        break;
      }

      case 'LOCATION_CHANGE': {
        updateSensor({
          location: {
            ...sensor.location,
            insideSafeZone: false,
            address: 'Besant Nagar Beach Road (650m outside home safe perimeter)',
          },
        });
        createAlert({
          title: 'Location Boundary Crossed',
          reason: 'Senior has moved outside the configured 450m home safe zone.',
          aiExplanation:
            'Consent-based GPS geofence crossed. Attention recommended to verify senior has accompanied assistance.',
          level: 'YELLOW',
        });
        speakText('Location safe zone boundary crossed. Caregiver alerted.');
        break;
      }
    }
  };

  return (
    <AranContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        activeHealthScreen,
        setActiveHealthScreen,
        senior,
        updateSenior,
        updateAccessibility,
        updateMedicalReport,
        caregivers,
        updateCaregiver,
        addCaregiver,
        familyMembers,
        neighborhoodEmergencies,
        emergencyContacts,
        updateEmergencyContact,
        routines,
        toggleRoutineStatus,
        addRoutine,
        medications,
        toggleMedication,
        foodTimings,
        toggleFoodTiming,
        sensor,
        updateSensor,
        logWaterIntake,
        dispatch108Ambulance,
        cancel108Ambulance,
        alerts,
        acknowledgeAlert,
        escalateAlert,
        createAlert,
        messages,
        sendMessage,
        clearChat,
        auditLogs,
        runSimulation,
        currentScenario,
        isSosActive,
        triggerSos,
        resolveSos,
        cancelSos: resolveSos,
        speakText,
        isSpeaking,
        soundEnabled,
        setSoundEnabled,
        deviceViewMode,
        setDeviceViewMode,
      }}
    >
      {children}
    </AranContext.Provider>
  );
};

export const useAran = () => {
  const context = useContext(AranContext);
  if (!context) {
    throw new Error('useAran must be used within an AranProvider');
  }
  return context;
};
