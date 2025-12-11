import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: 'admin' | 'patient') => void;
}

const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-elevated mb-6">
            <span className="text-4xl">🦷</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            DentCare Clinic
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Welcome to our dental patient management system. Please select how you'd like to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => onSelectRole('admin')}
            className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
                Administrator
              </h2>
              <p className="text-muted-foreground">
                Access admin dashboard to manage patients and appointments
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('patient')}
            className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
                Patient
              </h2>
              <p className="text-muted-foreground">
                Register as new patient or login to your existing account
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;