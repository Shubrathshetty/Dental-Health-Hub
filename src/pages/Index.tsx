import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import RoleSelection from "@/components/RoleSelection";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import PatientAuthChoice from "@/components/PatientAuthChoice";
import PatientRegistration from "@/components/PatientRegistration";
import PatientLogin from "@/components/PatientLogin";
import DentalQuestionnaire from "@/components/DentalQuestionnaire";
import { Patient } from "@/lib/patientStore";

type AppState =
  | 'role-selection'
  | 'admin-login'
  | 'admin-dashboard'
  | 'patient-auth-choice'
  | 'patient-register'
  | 'patient-login'
  | 'questionnaire';

const Index = () => {
  const { user, profile, loading, isAdmin } = useAuth();
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (user && profile) {
    if (isAdmin) {
      return <AdminDashboard onBack={() => setAppState('role-selection')} />;
    } else {
      // For patients, we still need to get their patient profile from Firestore
      // This will be handled in the DentalQuestionnaire component
      return currentPatient ? (
        <DentalQuestionnaire
          patient={currentPatient}
          onComplete={() => {}}
          onLogout={() => setCurrentPatient(null)}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading patient data...</div>
        </div>
      );
    }
  }

  // If not authenticated, show role selection and auth flow
  const handleRoleSelect = (role: 'admin' | 'patient') => {
    if (role === 'admin') {
      setAppState('admin-login');
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

  const handleAdminLoginSuccess = (adminId: string) => {
    setAppState('admin-dashboard');
  };

  switch (appState) {
    case 'role-selection':
      return <RoleSelection onSelectRole={handleRoleSelect} />;

    case 'admin-login':
      return (
        <AdminLogin
          onBack={() => setAppState('role-selection')}
          onLogin={handleAdminLoginSuccess}
        />
      );

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