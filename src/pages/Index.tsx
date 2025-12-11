import { useState } from "react";
import RoleSelection from "@/components/RoleSelection";
import PatientAuthChoice from "@/components/PatientAuthChoice";
import PatientRegistration from "@/components/PatientRegistration";
import PatientLogin from "@/components/PatientLogin";
import DentalQuestionnaire from "@/components/DentalQuestionnaire";
import AdminDashboard from "@/components/AdminDashboard";
import { Patient } from "@/lib/patientStore";

type AppState = 
  | 'role-selection'
  | 'admin-dashboard'
  | 'patient-auth-choice'
  | 'patient-register'
  | 'patient-login'
  | 'questionnaire';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const handleRoleSelect = (role: 'admin' | 'patient') => {
    if (role === 'admin') {
      setAppState('admin-dashboard');
    } else {
      setAppState('patient-auth-choice');
    }
  };

  const handlePatientAuthChoice = (choice: 'register' | 'login') => {
    setAppState(choice === 'register' ? 'patient-register' : 'patient-login');
  };

  const handleLoginSuccess = (patient: Patient) => {
    setCurrentPatient(patient);
    setAppState('questionnaire');
  };

  const handleLogout = () => {
    setCurrentPatient(null);
    setAppState('patient-auth-choice');
  };

  const handleQuestionnaireComplete = () => {
    // Stay logged in, allow new assessment
  };

  switch (appState) {
    case 'role-selection':
      return <RoleSelection onSelectRole={handleRoleSelect} />;
    
    case 'admin-dashboard':
      return <AdminDashboard onBack={() => setAppState('role-selection')} />;
    
    case 'patient-auth-choice':
      return (
        <PatientAuthChoice 
          onChoice={handlePatientAuthChoice}
          onBack={() => setAppState('role-selection')}
        />
      );
    
    case 'patient-register':
      return (
        <PatientRegistration 
          onBack={() => setAppState('patient-auth-choice')}
          onSuccess={() => setAppState('patient-auth-choice')}
        />
      );
    
    case 'patient-login':
      return (
        <PatientLogin 
          onBack={() => setAppState('patient-auth-choice')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    
    case 'questionnaire':
      return currentPatient ? (
        <DentalQuestionnaire 
          patient={currentPatient}
          onComplete={handleQuestionnaireComplete}
          onLogout={handleLogout}
        />
      ) : null;
    
    default:
      return <RoleSelection onSelectRole={handleRoleSelect} />;
  }
};

export default Index;