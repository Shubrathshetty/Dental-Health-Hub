import { savePatient, saveAssessment } from './patientStore';

// Sample test data for consultation scheduling testing
export const createTestData = () => {
  // Create a test patient
  const testPatient = {
    patientId: 'DPT001',
    password: 'qGCERNMh',
    name: 'John Doe',
    gender: 'male',
    age: 35,
    dateOfBirth: '1989-01-15',
    phone: '+91-9876543210',
    email: 'john.doe@example.com',
    address: '123 Test Street, Mumbai, Maharashtra - 400001',
    bloodGroup: 'O+',
    emergencyContact: 'Jane Doe',
    emergencyContactPhone: '+91-9876543211',
    registrationDate: new Date().toISOString(),
  };

  // Create a test assessment that requires consultation
  const testAssessment = {
    patientId: 'DPT001',
    toothPain: true,
    foodLodgement: true,
    toothDiscoloration: false,
    bleedingGums: true,
    badBreath: false,
    nonHealingUlcer: false,
    malalignedTooth: true,
    consultationNeeded: true,
    assessmentDate: new Date().toISOString(),
  };

  // Save the test data
  savePatient(testPatient);
  saveAssessment(testAssessment);

  console.log('✅ Test data created successfully!');
  console.log('Patient ID: DPT001');
  console.log('Assessment requires consultation: Yes');

  return { patient: testPatient, assessment: testAssessment };
};

// Function to clear all test data
export const clearTestData = () => {
  localStorage.removeItem('dental_patients');
  localStorage.removeItem('dental_assessments');
  localStorage.removeItem('dental_consultations');
  console.log('🗑️ All test data cleared!');
};
