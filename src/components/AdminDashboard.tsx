'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Users,
  FileText,
  Calendar,
  ChevronLeft,
  Mail,
  Clock,
} from "lucide-react";

import {
  getPatients,
  getAssessments,
  Patient,
  DentalAssessment,
  Consultation,
  generateConsultationId,
  saveConsultation,
  sendConsultationEmail,
  updateAssessment,
} from "@/lib/patientStore";

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<DentalAssessment[]>([]);
  const [activeView, setActiveView] = useState<
    'overview' | 'patients' | 'assessments' | 'consultations' | 'patient-details'
  >('overview');

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consultationDate, setConsultationDate] = useState('');
  const [consultationTime, setConsultationTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const patientsData = getPatients().sort(
      (a, b) =>
        new Date(b.registrationDate).getTime() -
        new Date(a.registrationDate).getTime()
    );

    const assessmentsData = getAssessments().sort(
      (a, b) =>
        new Date(b.assessmentDate).getTime() -
        new Date(a.assessmentDate).getTime()
    );

    setPatients(patientsData);
    setAssessments(assessmentsData);
  }, []);

  const consultationsNeeded = assessments.filter(
    a => a.consultationNeeded
  ).length;

  const handleCardClick = (
    view: 'patients' | 'assessments' | 'consultations'
  ) => {
    setActiveView(view);
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
  };

  const handlePatientClick = (patientId: string) => {
    const patient = patients.find(p => p.patientId === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setActiveView('patient-details');
    }
  };

  /* =========================
     🔴 FIXED LOGIC HERE
  ========================= */

  const handleScheduleConsultation = async () => {
    if (!selectedPatient || !consultationDate || !consultationTime) {
      alert("Please fill in all consultation details");
      return;
    }

    setIsScheduling(true);

    try {
      const consultation: Consultation = {
        consultationId: generateConsultationId(),
        patientId: selectedPatient.patientId,
        patientName: selectedPatient.name,
        patientEmail: selectedPatient.email,
        consultationDate,
        consultationTime,
        clinicName: "Dental Health Hub",
        clinicLocation:
          "123 Dental Street, Medical District, City - 400001",
        status: "scheduled",
        createdAt: new Date().toISOString(),
      };

      saveConsultation(consultation);

      const emailSent = await sendConsultationEmail(consultation);

      if (!emailSent) {
        alert("Consultation saved, but EMAIL FAILED. Check console.");
        return;
      }

      // Mark consultation as no longer needed after successful email
      updateAssessment(selectedPatient.patientId, { consultationNeeded: false });

      // Refresh assessments data to reflect the change
      const updatedAssessments = getAssessments().sort((a, b) =>
        new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
      );
      setAssessments(updatedAssessments);

      alert(
        `Consultation scheduled successfully! Consultation ID: ${consultation.consultationId}`
      );

      setConsultationDate("");
      setConsultationTime("");
      setActiveView("overview");
    } catch (error) {
      console.error(error);
      alert("Failed to schedule consultation. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };
if (activeView === 'patients') {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-sky-600/90 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToOverview} className="text-white hover:bg-sky-500">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              <h1 className="text-xl font-display font-bold text-white">
                Patient Details
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-sky-600 rounded-2xl shadow-lg border border-sky-300 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-semibold text-foreground">
                All Registered Patients ({patients.length})
              </h2>
            </div>

            {patients.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No patients registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Patient ID</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Age</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Gender</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Phone</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Address</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Blood Group</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Emergency Contact</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-black">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {patients.map((patient) => (
                      <tr key={patient.patientId} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-sm text-foreground">{patient.patientId}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{patient.name}</td>
                        <td className="px-4 py-3 text-foreground">{patient.age}</td>
                        <td className="px-4 py-3 text-foreground capitalize">{patient.gender}</td>
                        <td className="px-4 py-3 text-foreground">{patient.phone}</td>
                        <td className="px-4 py-3 text-foreground">{patient.email}</td>
                        <td className="px-4 py-3 text-foreground max-w-xs truncate" title={patient.address}>{patient.address}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{patient.bloodGroup}</td>
                        <td className="px-4 py-3 text-foreground">
                          <div className="text-sm">
                            <div>{patient.emergencyContact}</div>
                            <div className="text-muted-foreground text-xs">{patient.emergencyContactPhone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">
                          {new Date(patient.registrationDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'assessments') {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-sky-600/90 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToOverview} className="text-white hover:bg-sky-500">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              <h1 className="text-xl font-display font-bold text-white">
                Assessment Details
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-sky-600 rounded-2xl shadow-lg border border-sky-300 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-semibold text-foreground">
                All Assessments ({assessments.length})
              </h2>
            </div>

            {assessments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No assessments completed yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Patient ID</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Issues Reported</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Consultation Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assessments.map((assessment, index) => {
                      const issuesCount = Object.values(assessment).filter((value, i) => {
                        const keys = Object.keys(assessment);
                        return keys[i] !== 'patientId' && keys[i] !== 'assessmentDate' && keys[i] !== 'consultationNeeded' && value === true;
                      }).length;

                      return (
                        <tr key={`${assessment.patientId}-${index}`} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm text-foreground">{assessment.patientId}</td>
                          <td className="px-6 py-4 text-foreground">
                            {new Date(assessment.assessmentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-foreground">{issuesCount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assessment.consultationNeeded
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {assessment.consultationNeeded ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'consultations') {
    const consultationAssessments = assessments.filter(a => a.consultationNeeded);

    return (
      <div className="min-h-screen bg-white">
        <header className="bg-sky-600/90 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToOverview} className="text-white hover:bg-sky-500">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              <h1 className="text-xl font-display font-bold text-white">
                Consultation Required
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-sky-600 rounded-2xl shadow-lg border border-sky-300 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-semibold text-foreground">
                Patients Requiring Consultation ({consultationAssessments.length})
              </h2>
            </div>

            {consultationAssessments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No consultations required at this time</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Patient ID</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Patient Name</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Assessment Date</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Issues Reported</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {consultationAssessments.map((assessment, index) => {
                      const patient = patients.find(p => p.patientId === assessment.patientId);
                      const issuesCount = Object.values(assessment).filter((value, i) => {
                        const keys = Object.keys(assessment);
                        return keys[i] !== 'patientId' && keys[i] !== 'assessmentDate' && keys[i] !== 'consultationNeeded' && value === true;
                      }).length;

                      return (
                        <tr
                          key={`${assessment.patientId}-${index}`}
                          className="hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => handlePatientClick(assessment.patientId)}
                        >
                          <td className="px-6 py-4 font-mono text-sm text-foreground">{assessment.patientId}</td>
                          <td className="px-6 py-4 font-medium text-foreground">{patient?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-foreground">
                            {new Date(assessment.assessmentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-foreground">{issuesCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'patient-details' && selectedPatient) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-sky-600/90 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToOverview} className="text-white hover:bg-sky-500">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              <h1 className="text-xl font-display font-bold text-white">
                Patient Details
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-sky-600 rounded-2xl shadow-lg border border-sky-300 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-semibold text-foreground">
                Patient Information - {selectedPatient.patientId}
              </h2>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                    <p className="text-foreground font-mono">{selectedPatient.patientId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                    <p className="text-foreground">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-foreground capitalize">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-foreground">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-foreground">{selectedPatient.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{selectedPatient.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <p className="text-foreground font-medium">{selectedPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                    <p className="text-foreground">{selectedPatient.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Emergency Contact Phone</label>
                    <p className="text-foreground">{selectedPatient.emergencyContactPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                    <p className="text-foreground">{new Date(selectedPatient.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Consultation Scheduling Form */}
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Consultation
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultation-date">Consultation Date</Label>
                    <Input
                      id="consultation-date"
                      type="date"
                      value={consultationDate}
                      onChange={(e) => setConsultationDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultation-time">Consultation Time</Label>
                    <Input
                      id="consultation-time"
                      type="time"
                      value={consultationTime}
                      onChange={(e) => setConsultationTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleScheduleConsultation}
                    disabled={isScheduling || !consultationDate || !consultationTime}
                    className="w-full md:w-auto"
                  >
                    {isScheduling ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Schedule Consultation & Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-sky-600/90 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-sky-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-display font-bold text-white">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-sky-600 rounded-2xl p-6 shadow-lg border border-sky-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            onClick={() => handleCardClick('patients')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-sky-500 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-sky-100">Total Patients Registered</p>
                <p className="text-3xl font-display font-bold text-white">{patients.length}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-sky-600 rounded-2xl p-6 shadow-lg border border-sky-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            onClick={() => handleCardClick('assessments')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-sky-500 flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-sky-100">Total Assessments Undertaken</p>
                <p className="text-3xl font-display font-bold text-white">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-sky-600 rounded-2xl p-6 shadow-lg border border-sky-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            onClick={() => handleCardClick('consultations')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-sky-500 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-sky-100">Total Consultations Required</p>
                <p className="text-3xl font-display font-bold text-white">{consultationsNeeded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-sky-600 rounded-2xl shadow-lg border border-sky-300 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Total Registered Patients
            </h2>
          </div>

          {patients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No patients registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Patient ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Age</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Gender</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {patients.map((patient) => (
                    <tr key={patient.patientId} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-foreground">{patient.patientId}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{patient.name}</td>
                      <td className="px-6 py-4 text-foreground">{patient.age}</td>
                      <td className="px-6 py-4 text-foreground capitalize">{patient.gender}</td>
                      <td className="px-6 py-4 text-foreground">{patient.phone}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(patient.registrationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


