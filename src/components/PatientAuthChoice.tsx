import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, ArrowLeft } from "lucide-react";

interface PatientAuthChoiceProps {
  onChoice: (choice: 'register' | 'login') => void;
  onBack: () => void;
}

const PatientAuthChoice = ({ onChoice, onBack }: PatientAuthChoiceProps) => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-xl animate-slide-up">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Button>

        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Patient Portal
            </h1>
            <p className="text-muted-foreground">
              Are you a new patient or returning?
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => onChoice('register')}
              variant="hero"
              size="xl"
              className="w-full"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register as New Patient
            </Button>

            <Button
              onClick={() => onChoice('login')}
              variant="outline"
              size="xl"
              className="w-full"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login to Existing Account
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New patients will receive a unique Patient ID and password after registration
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientAuthChoice;