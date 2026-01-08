import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, User, Heart, Phone, ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
//import favicon.ico from "@public/favicon.ico.png";

interface RoleSelectionProps {
  onSelectRole: (role: 'admin' | 'patient') => void;
}

const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here (e.g., send to API)
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setShowContactForm(false);
    setFormData({ name: '', email: '', issue: '' });
  };

  if (showContactForm) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContactForm(false)}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Contact Us
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email (Gmail)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="Enter your Gmail address"
                />
              </div>
              <div>
                <Label htmlFor="issue" className="text-sm font-medium text-foreground">
                  Issue Description
                </Label>
                <Textarea
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="Describe the issue you're facing with the website"
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-100 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-sky-200 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-sky-150 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-sky-100 rounded-full animate-float-slow"></div>
      </div>

      <div className="w-full max-w-4xl animate-fade-in relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-50 rounded-3xl gradient-primary shadow-elevated mb-8 animate-float-gentle hover:scale-110 transition-transform duration-300">
            <span className="animate-pulse">
              {/*<img src="/favicon.ico.jpeg" alt="Logo" className="w-60 h-55" />*/}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-blue mb-6 animate-slide-up">
            DentCare
          </h1>
          <p className="text-xl text-black max-w-lg mx-auto animate-slide-up animation-delay-200">
            Welcome to DentCare - A Dental Health Hub.
           </p>
           <br></br>
           <br></br>
           <h1 className="text-xl text-black max-w-lg mx-auto animate-slide-up animation-delay-200">
              Please select your Role below
           </h1>
          
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <button
            onClick={() => onSelectRole('admin')}
            className="group bg-sky-600 rounded-3xl p-10 shadow-lg border border-sky-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-slide-up animation-delay-400 hover:bg-sky-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-sky-500 flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300 animate-bounce-gentle">
                <Shield className="w-10 h-10 text-white group-hover:text-sky-600" />
              </div>
              <h2 className="text-3xl font-display font-semibold text-white mb-3 group-hover:text-white transition-colors duration-300">
                Admin
              </h2>
              <p className="text-sky-100 group-hover:text-white transition-colors duration-300">
                Access Admin Dashboard to Manage Patients and Appointments
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('patient')}
            className="group bg-sky-600 rounded-3xl p-10 shadow-lg border border-sky-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-slide-up animation-delay-600 hover:bg-sky-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-sky-500 flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300 animate-bounce-gentle">
                <User className="w-10 h-10 text-white group-hover:text-sky-600" />
              </div>
              <h2 className="text-3xl font-display font-semibold text-white mb-3 group-hover:text-white transition-colors duration-300">
                Patient
              </h2>
              <p className="text-sky-100 group-hover:text-white transition-colors duration-300">
                Register as New patient or Login to your Existing Account
              </p>
            </div>
          </button>
        </div>

        {/* Introduction to Dental Care */}
        <div className="mt-20 text-center max-w-4xl mx-auto animate-slide-up animation-delay-800">
          <h2 className="text-4xl font-display font-bold text-black mb-8">
            Why Choose DentCare?
          </h2>
          <p className="text-xl text-black mb-10 leading-relaxed">
            At DentCare, we prioritize your oral health with personalized treatments, advanced technology, and a compassionate team. Whether you're an admin managing appointments or a patient seeking care, our hub ensures a seamless experience for all.
          </p>
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-3 bg-red backdrop-blur-sm rounded-2xl p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-float-gentle">
              <Heart className="w-8 h-8 text-black animate-pulse" />
              <span className="text-black font-medium">Compassionate Care</span>
            </div>
            <div className="flex items-center space-x-3 bg-green backdrop-blur-sm rounded-2xl p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-float-gentle">
              <Shield className="w-8 h-8 text-black animate-pulse" />
              <span className="text-black font-medium">Trusted Professionals</span>
            </div>
          </div>
        </div>

        {/* About Dental Care Accordion */}
        <div className="mt-16 max-w-4xl mx-auto animate-slide-up animation-delay-1000">
          <h2 className="text-4xl font-display font-bold text-black text-center mb-10">
            About DentCare
          </h2>
          <div className="bg-white backdrop-blur-sm rounded-3xl p-8 shadow-card border border-gray-300">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-gray-300">
                <AccordionTrigger className="text-left text-lg font-medium text-black hover:text-black transition-colors duration-300">
                  What is DentCare?
                </AccordionTrigger>
                <AccordionContent className="text-black leading-relaxed">
                  DentCare encompasses a comprehensive range of services focused on maintaining optimal oral health, preventing dental diseases, and diagnosing as well as treating conditions affecting the teeth, gums, and overall oral cavity. These services include routine dental check-ups, professional cleanings, preventive care, and timely treatments that help identify potential issues at an early stage. By emphasizing both preventive and corrective care, DentCare plays a vital role in reducing the risk of cavities, gum disease, and other oral health problems. Regular visits not only help preserve strong teeth and healthy gums but also contribute to overall well-being, confidence, and a long-lasting, healthy smile.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-gray-300">
                <AccordionTrigger className="text-left text-lg font-medium text-black hover:text-black transition-colors duration-300">
                  Importance of Regular Dental Visits
                </AccordionTrigger>
                <AccordionContent className="text-black leading-relaxed">
                  Regular dental visits play a crucial role in maintaining overall oral health by enabling the early detection of common issues such as cavities, gum disease, and even oral cancer before they become serious. These visits also focus on preventive care, including professional cleanings that remove plaque and tartar buildup, as well as fluoride treatments that help strengthen tooth enamel. By addressing potential problems early and reinforcing preventive measures, regular dental check-ups help preserve healthy teeth and gums, reduce the need for extensive treatments, and support long-term oral well-being.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-gray-300">
                <AccordionTrigger className="text-left text-lg font-medium text-black hover:text-black transition-colors duration-300">
                  Our Services
                </AccordionTrigger>
                <AccordionContent className="text-black leading-relaxed">
                  We offer a wide range of comprehensive dental services designed to meet the diverse needs of our patients, including routine check-ups that support preventive care, cosmetic dentistry to enhance the appearance of your smile, orthodontic treatments to correct alignment issues, and prompt emergency care to address urgent dental concerns. Our experienced team is committed to delivering high-quality care by utilizing the latest dental technologies and advanced treatment techniques. This approach allows us to ensure precise diagnoses, effective treatments, and the best possible outcomes, all while prioritizing patient comfort, safety, and long-term oral health.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-20 text-center max-w-3xl mx-auto animate-slide-up animation-delay-1200">
          <h2 className="text-4xl font-display font-bold text-black mb-8">
            Get in Touch
          </h2>
          <p className="text-xl text-black mb-10 leading-relaxed">
            Have questions or need assistance? Contact us today!
          </p>
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-3 bg-white backdrop-blur-sm rounded-2xl p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-float-gentle">
              <Phone className="w-8 h-8 text-black animate-pulse" />
              <span className="text-black font-medium">Call: +123 456 7890</span>
            </div>
            <div className="flex items-center space-x-3 bg-white backdrop-blur-sm rounded-2xl p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-float-gentle">
              <span className="text-black font-medium">Email: admin@dentalcare.com</span>
            </div>
          </div>
          <Button
            onClick={() => setShowContactForm(true)}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-2xl text-lg font-medium shadow-elevated hover:shadow-card transition-all duration-300 hover:scale-105 animate-bounce-gentle"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;