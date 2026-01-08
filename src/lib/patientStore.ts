console.log("🔥 patientStore.ts LOADED");

import emailjs from '@emailjs/browser';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

/* =======================
   Interfaces
======================= */

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

export interface Consultation {
  consultationId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  consultationDate: string;
  consultationTime: string;
  clinicName: string;
  clinicLocation: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

/* =======================
   Storage Keys
======================= */

const PATIENTS_KEY = 'dental_patients';
const ASSESSMENTS_KEY = 'dental_assessments';
const CONSULTATIONS_KEY = 'dental_consultations';

/* =======================
   Utilities
======================= */

export const generatePatientId = (): string => {
  const prefix = 'DPT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generatePassword = (): string => {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/* =======================
   Patient Storage
======================= */

export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(PATIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  patients.push(patient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const findPatient = (
  patientId: string,
  password: string
): Patient | null => {
  return (
    getPatients().find(
      p => p.patientId === patientId && p.password === password
    ) || null
  );
};

export const getPatientById = (patientId: string): Patient | null => {
  return getPatients().find(p => p.patientId === patientId) || null;
};

/* =======================
   Assessment Storage
======================= */

export const getAssessments = async (): Promise<DentalAssessment[]> => {
  try {
    const assessmentsRef = collection(db, 'assessments');
    const querySnapshot = await getDocs(assessmentsRef);
    const assessments: DentalAssessment[] = [];
    querySnapshot.forEach((doc) => {
      assessments.push(doc.data() as DentalAssessment);
    });
    return assessments;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
};

export const saveAssessment = async (
  assessment: DentalAssessment
): Promise<void> => {
  try {
    console.log('🔥 saveAssessment called with:', assessment);
    const assessmentsRef = collection(db, 'assessments');
    const docRef = await addDoc(assessmentsRef, assessment);
    console.log('✅ Assessment saved successfully with ID:', docRef.id);
  } catch (error) {
    console.error('❌ Error saving assessment:', error);
    throw error; // Re-throw to let caller handle it
  }
};

export const updateAssessment = async (
  patientId: string,
  updates: Partial<DentalAssessment>
): Promise<void> => {
  try {
    const assessmentsRef = collection(db, 'assessments');
    const q = query(assessmentsRef, where('patientId', '==', patientId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await updateDoc(doc(db, 'assessments', document.id), updates);
    });
  } catch (error) {
    console.error('Error updating assessment:', error);
  }
};

/* =======================
   Consultation Storage
======================= */

export const generateConsultationId = (): string => {
  const prefix = 'DCN';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const getConsultations = (): Consultation[] => {
  const data = localStorage.getItem(CONSULTATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveConsultation = (
  consultation: Consultation
): void => {
  const consultations = getConsultations();
  consultations.push(consultation);
  localStorage.setItem(
    CONSULTATIONS_KEY,
    JSON.stringify(consultations)
  );
};

export const getConsultationByPatientId = (
  patientId: string
): Consultation | null => {
  return (
    getConsultations().find(
      c => c.patientId === patientId && c.status === 'scheduled'
    ) || null
  );
};

/* =======================
   EMAIL SENDING (FINAL)
======================= */

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_n7sd7g8',
  TEMPLATE_ID: 'template_ygus98l',
  PUBLIC_KEY: 'GexZJfsDq7ySEZPhP',
};

// ✅ Initialize EmailJS ONCE
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export const sendConsultationEmail = async (
  consultation: Consultation
): Promise<boolean> => {
  console.log(
    '🚨 sendConsultationEmail EXECUTED for:',
    consultation.patientEmail
  );

  try {
    const formattedDate = new Date(
      consultation.consultationDate
    ).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const templateParams = {
      to_email: consultation.patientEmail,
      to_name: consultation.patientName || 'Patient',
      consultation_id: consultation.consultationId,
      consultation_date: formattedDate,
      consultation_time: consultation.consultationTime,
      clinic_name: consultation.clinicName,
      clinic_location: consultation.clinicLocation,
      from_name: 'Dental Health Hub Team',
    };

    console.log('📧 Sending email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('✅ EmailJS SUCCESS:', result);
    return true;
  } catch (error) {
    console.error('❌ EmailJS FAILED:', error);
    return false;
  }
};
