export type Role = 'senior' | 'caregiver' | 'admin';

export type LivingArrangement = 'family' | 'independent' | 'relatives' | 'partner' | 'home_care';

export interface CareNetworkContact {
  id: string;
  name: string;
  relationship: string;
  role: string;
  phone: string;
  email?: string;
  availability: 'available' | 'not_responding' | 'offline' | 'emergency_only';
  priority: 1 | 2 | 3 | 4 | 'emergency';
  connectionStatus: 'active' | 'standby' | 'escalated';
  permissions: {
    viewStatus: boolean;
    receiveAlerts: boolean;
    callPatient: boolean;
    receiveHealthSummaries: boolean;
    emergencyOnly: boolean;
  };
  location?: string;
  notes?: string;
}

export type Language =
  | 'en'
  | 'ta'
  | 'hi'
  | 'ml'
  | 'te'
  | 'kn'
  | 'gu'
  | 'fr'
  | 'tanglish';

export interface AccessibilityProfile {
  canSeeNormally?: boolean;
  canHearNormally?: boolean;
  canSpeakNormally?: boolean;
  canUseSmartphone?: boolean;
  difficultySeeing: boolean;
  difficultyHearing: boolean;
  difficultySpeaking: boolean;
  difficultySmartphone: boolean;
  limitedMobility: boolean;
  communicationPreferences?: ('voice' | 'text' | 'vibration' | 'large_buttons' | 'tactile' | 'passive')[];
  highContrast: boolean;
  extraLargeFont: boolean;
  voiceVolumeBoost?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  livingWithSenior: boolean;
  address: string;
  notes?: string;
}

export interface NeighborhoodEmergency {
  id: string;
  name: string;
  type: 'Ambulance' | 'Hospital' | 'Police' | 'Neighborhood Volunteer' | 'Pharmacy';
  phone: string;
  distance: string;
  is24x7: boolean;
  address: string;
}

export interface MedicalReport {
  primaryIllness: string[];
  ongoingTreatments: string[];
  hospitalName: string;
  hospitalAddress: string;
  hospitalEmergencyPhone: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhone: string;
  nextFollowUpDate: string;
  bloodGroup: string;
  allergies: string[];
  insuranceProvider: string;
  policyNumber: string;
  tpaHelpline: string;
}

export interface SeniorProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  dob: string;
  gender: string;
  language: Language;
  livingArrangement: LivingArrangement;
  homeInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    apartment?: string;
    floor?: string;
    room?: string;
    safeZoneRadiusMeters: number;
  };
  deviceId: string;
  accessibility: AccessibilityProfile;
  medicalReport: MedicalReport;
  familyMembers: FamilyMember[];
  neighborhoodEmergencies: NeighborhoodEmergency[];
  emergencyContacts?: EmergencyContact[];
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  priority: 'primary' | 'secondary' | 'emergency';
  permissionLevel: 'full' | 'view_only' | 'emergency_only';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: 'Primary Contact' | 'Secondary Contact' | 'Emergency Contact';
  locationSharing: boolean;
}

export interface RoutineItem {
  id: string;
  name: string;
  time: string;
  repeat: string;
  reminder: boolean;
  gracePeriodMinutes: number;
  type: 'wakeup' | 'meal' | 'hydration' | 'checkin' | 'medication' | 'sleep' | 'activity';
  status: 'pending' | 'completed' | 'missed';
  notes?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  timingCategory: 'Morning' | 'Afternoon' | 'Night';
  frequency: string;
  instructions: string;
  prescribedBy: string;
  status: 'pending' | 'completed' | 'missed';
}

export interface FoodTimingItem {
  id: string;
  mealName: string;
  scheduledTime: string;
  recommendedDiet: string;
  status: 'pending' | 'completed' | 'delayed';
  caloriesApprox?: number;
  loggedAt?: string;
}

export interface SensorReading {
  heartRate: number; // BPM
  temperature: number; // Body °C
  ambientTemperature: number; // Room °C
  heatWarning: boolean;
  heatWarningMessage?: string;
  spO2: number; // %
  spo2?: number; // alias
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  bloodPressureRate: string; // e.g. "122/82 mmHg"
  bloodPressureStatus: 'NORMAL' | 'ELEVATED' | 'HIGH';
  motion: 'normal' | 'minimal' | 'none';
  motionWarning: string | null; // e.g. "Sudden impact deceleration detected"
  activityLevel: 'normal' | 'low' | 'sedentary';
  stepsToday: number;
  steps?: number; // alias
  activeMinutes: number;
  inactivityMinutes: number;
  sleepScore: number;
  sleepDuration: string;
  deepSleep: string;
  lightSleep: string;
  awakeTime: string;
  fallDetected: boolean;
  fallEventDetails?: string;
  lastHydrationTime: string;
  nextHydrationTime: string;
  hydrationStatus: 'Good' | 'Fair' | 'Check Recommended';
  hydrationLevel?: number; // alias
  waterIntakeTodayMl: number;
  waterTargetMl: number;
  batteryLevel: number;
  isCharging: boolean;
  isConnected: boolean;
  bluetoothConnected: boolean;
  wifiConnected: boolean;
  cellularActive: boolean;
  lastSync: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    insideSafeZone: boolean;
  };
  ambulance108Dispatched: boolean;
  ambulance108EtaMinutes: number;
  timestamp: string;
}

export type AlertLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface Alert {
  id: string;
  title: string;
  reason: string;
  aiExplanation: string;
  level: AlertLevel;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionTaken?: string;
  sensorContext?: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    ambientTemperature?: number;
    activity?: string;
    motionWarning?: string;
    checkinStatus?: string;
  };
  escalationLevel: 1 | 2 | 3 | 4;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  level: 'info' | 'warning' | 'critical';
  eventType?: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'aran' | 'senior' | 'caregiver';
  text: string;
  timestamp: string;
  audioSpoken?: boolean;
}

export type SimulationScenario =
  | 'NORMAL'
  | 'SUCCESSFUL_CHECKIN'
  | 'MISSED_CHECKIN'
  | 'ROUTINE_MISSED'
  | 'LOW_ACTIVITY'
  | 'HIGH_HEART_RATE'
  | 'HEART_RATE_ATTENTION'
  | 'HIGH_BP'
  | 'TEMPERATURE_CHANGE'
  | 'LOW_SPO2'
  | 'MOTION_DETECTED'
  | 'POSSIBLE_FALL'
  | 'HEAT_WARNING'
  | 'MOTION_FALL_WARNING'
  | 'WATER_ALERT'
  | 'AMBULANCE_108_DISPATCH'
  | 'SOS'
  | 'DEVICE_OFFLINE'
  | 'LOW_BATTERY'
  | 'HYDRATION_DUE'
  | 'MEAL_PENDING'
  | 'LOCATION_CHANGE';

export type HealthScreenType =
  | 'none'
  | 'normal-baseline'
  | 'heart'
  | 'heart-attention'
  | 'bp'
  | 'high-bp'
  | 'temp'
  | 'room-heat'
  | 'hydration'
  | 'water-alert'
  | 'activity'
  | 'low-activity'
  | 'fall'
  | 'spo2'
  | 'low-spo2'
  | 'sleep'
  | 'location'
  | 'safe-zone-breach'
  | 'device'
  | 'offline'
  | 'battery-low'
  | 'ambulance-108'
  | 'checkin'
  | 'missed-checkin'
  | 'sos'
  | 'live'
  | 'medication'
  | 'meals'
  | 'ai-talk'
  | 'alerts'
  | 'settings'
  | 'care-network';

