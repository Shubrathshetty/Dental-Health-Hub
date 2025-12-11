export interface Patient {
  patientId: string;
  password: string;
  name: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  aadharNumber?: string;
  rationCardNumber?: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyContactPhone: string;
  registrationDate: string;
}

export interface DentalAssessment {
  patientId: string;
  toothPain: boolean;
  foodLodgement: boolean;
  toothDiscoloration: boolean;
  bleedingGums: boolean;
  badBreath: boolean;
  nonHealingUlcer: boolean;
  malalignedTooth: boolean;
  consultationNeeded: boolean;
  assessmentDate: string;
}

const PATIENTS_KEY = 'dental_patients';
const ASSESSMENTS_KEY = 'dental_assessments';

export const generatePatientId = (): string => {
  const prefix = 'DPT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generatePassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(PATIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  patients.push(patient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const findPatient = (patientId: string, password: string): Patient | null => {
  const patients = getPatients();
  return patients.find(p => p.patientId === patientId && p.password === password) || null;
};

export const getPatientById = (patientId: string): Patient | null => {
  const patients = getPatients();
  return patients.find(p => p.patientId === patientId) || null;
};

export const getAssessments = (): DentalAssessment[] => {
  const data = localStorage.getItem(ASSESSMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAssessment = (assessment: DentalAssessment): void => {
  const assessments = getAssessments();
  assessments.push(assessment);
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
};