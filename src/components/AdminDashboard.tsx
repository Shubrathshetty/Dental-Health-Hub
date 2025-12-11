import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, FileText, Calendar } from "lucide-react";
import { getPatients, getAssessments, Patient, DentalAssessment } from "@/lib/patientStore";

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<DentalAssessment[]>([]);

  useEffect(() => {
    setPatients(getPatients());
    setAssessments(getAssessments());
  }, []);

  const consultationsNeeded = assessments.filter(a => a.consultationNeeded).length;

  return (
    <div className="min-h-screen gradient-hero">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-display font-bold text-foreground">{patients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                <FileText className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-3xl font-display font-bold text-foreground">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consultations Needed</p>
                <p className="text-3xl font-display font-bold text-foreground">{consultationsNeeded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Registered Patients
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