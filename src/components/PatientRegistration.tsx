import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Patient, 
  generatePatientId, 
  generatePassword, 
  savePatient 
} from "@/lib/patientStore";

interface PatientRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

const PatientRegistration = ({ onBack, onSuccess }: PatientRegistrationProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [credentials, setCredentials] = useState<{ patientId: string; password: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    aadharNumber: '',
    rationCardNumber: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyContactPhone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.gender || !formData.age || !formData.phone) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const patientId = generatePatientId();
    const password = generatePassword();

    const patient: Patient = {
      patientId,
      password,
      name: formData.name,
      gender: formData.gender,
      age: parseInt(formData.age),
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      aadharNumber: formData.aadharNumber || undefined,
      rationCardNumber: formData.rationCardNumber || undefined,
      bloodGroup: formData.bloodGroup,
      emergencyContact: formData.emergencyContact,
      emergencyContactPhone: formData.emergencyContactPhone,
      registrationDate: new Date().toISOString(),
    };

    savePatient(patient);
    setCredentials({ patientId, password });
    setStep('success');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (step === 'success' && credentials) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Registration Successful!
            </h1>
            <p className="text-muted-foreground mb-8">
              Please save your credentials securely. You'll need them to login.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-secondary rounded-xl p-4">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Patient ID
                </Label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-mono font-semibold text-foreground">
                    {credentials.patientId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(credentials.patientId, 'Patient ID')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-4">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Password
                </Label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-mono font-semibold text-foreground">
                    {credentials.password}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(credentials.password, 'Password')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={onSuccess} variant="hero" size="lg" className="w-full">
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="max-w-2xl mx-auto animate-slide-up">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Patient Registration
            </h1>
            <p className="text-muted-foreground">
              Fill in your details to register as a new patient
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-foreground">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 w-full h-11 px-3 rounded-lg border border-input bg-background text-foreground"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="age" className="text-foreground">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age in years"
                  className="mt-1"
                  required
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-foreground">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bloodGroup" className="text-foreground">Blood Group</Label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="mt-1 w-full h-11 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-foreground">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground min-h-[80px] resize-none"
                />
              </div>

              <div>
                <Label htmlFor="aadharNumber" className="text-foreground">Aadhar Number</Label>
                <Input
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  placeholder="12-digit Aadhar number"
                  className="mt-1"
                  maxLength={12}
                />
              </div>

              <div>
                <Label htmlFor="rationCardNumber" className="text-foreground">Ration Card Number</Label>
                <Input
                  id="rationCardNumber"
                  name="rationCardNumber"
                  value={formData.rationCardNumber}
                  onChange={handleInputChange}
                  placeholder="Ration card number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emergencyContact" className="text-foreground">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Emergency contact name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emergencyContactPhone" className="text-foreground">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="Emergency contact phone"
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Register as Patient
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;