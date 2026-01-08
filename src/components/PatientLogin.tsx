import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { findPatient, Patient } from "@/lib/patientStore";

interface PatientLoginProps {
  onBack: () => void;
  onLoginSuccess: (patient: Patient) => void;
}

const PatientLogin = ({ onBack, onLoginSuccess }: PatientLoginProps) => {
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Patient ID and Password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const patient = findPatient(patientId.trim(), password.trim());
    
    if (patient) {
      toast({
        title: "Welcome back!",
        description: `Logged in as ${patient.name}`,
      });
      onLoginSuccess(patient);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid Patient ID or Password. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-sky-600 rounded-2xl p-8 shadow-lg border border-sky-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-sky-500 mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Patient Login
            </h1>
            <p className="text-sky-100">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="patientId" className="text-white">Patient ID</Label>
              <Input
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g., DPT123456789"
                className="mt-1 bg-white text-gray-900 border-sky-300"
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 bg-white text-gray-900 border-sky-300"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full bg-white text-sky-600 hover:bg-sky-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-sky-200 mt-6">
            Don't have an account? Go back and register as a new patient.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;