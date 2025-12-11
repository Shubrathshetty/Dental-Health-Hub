import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User, LogOut, ArrowRight, Printer, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Patient, saveAssessment, DentalAssessment } from "@/lib/patientStore";

interface Question {
  id: keyof Omit<DentalAssessment, 'patientId' | 'assessmentDate' | 'consultationNeeded'>;
  question: string;
  icon: string;
}

const questions: Question[] = [
  { id: 'toothPain', question: 'Are you experiencing any tooth pain?', icon: '🦷' },
  { id: 'foodLodgement', question: 'Do you have food lodgement between teeth?', icon: '🍽️' },
  { id: 'toothDiscoloration', question: 'Have you noticed any tooth discoloration?', icon: '🎨' },
  { id: 'bleedingGums', question: 'Do your gums bleed while brushing?', icon: '🩸' },
  { id: 'badBreath', question: 'Do you suffer from bad breath?', icon: '💨' },
  { id: 'nonHealingUlcer', question: 'Do you have any non-healing ulcer in your mouth?', icon: '⚠️' },
  { id: 'malalignedTooth', question: 'Do you have malaligned or crooked teeth?', icon: '↔️' },
];

interface DentalQuestionnaireProps {
  patient: Patient;
  onComplete: () => void;
  onLogout: () => void;
}

const DentalQuestionnaire = ({ patient, onComplete, onLogout }: DentalQuestionnaireProps) => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    questions.forEach(q => { initial[q.id] = null; });
    return initial;
  });
  const [showConsultation, setShowConsultation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [consultationNeeded, setConsultationNeeded] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (questionId: string, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const allAnswered = Object.values(answers).every(a => a !== null);

  const handleSubmitAnswers = () => {
    if (!allAnswered) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setShowConsultation(true);
  };

  const handleConsultation = (needed: boolean) => {
    setConsultationNeeded(needed);
    const assessment: DentalAssessment = {
      patientId: patient.patientId,
      toothPain: answers.toothPain || false,
      foodLodgement: answers.foodLodgement || false,
      toothDiscoloration: answers.toothDiscoloration || false,
      bleedingGums: answers.bleedingGums || false,
      badBreath: answers.badBreath || false,
      nonHealingUlcer: answers.nonHealingUlcer || false,
      malalignedTooth: answers.malalignedTooth || false,
      consultationNeeded: needed,
      assessmentDate: new Date().toISOString(),
    };

    saveAssessment(assessment);
    setShowSummary(true);

    toast({
      title: "Assessment Complete",
      description: needed 
        ? "Your consultation request has been recorded."
        : "Thank you for completing the assessment.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const yesCount = Object.values(answers).filter(Boolean).length;
    const date = new Date().toLocaleDateString();
    
    const content = `
DENTCARE CLINIC - DENTAL HEALTH ASSESSMENT
==========================================

Date: ${date}

PATIENT INFORMATION
-------------------
Patient Name: ${patient.name}
Patient ID: ${patient.patientId}
Age: ${patient.age}
Gender: ${patient.gender}
Phone: ${patient.phone}

ASSESSMENT RESULTS
------------------
${questions.map(q => `${q.question}: ${answers[q.id] ? 'Yes' : 'No'}`).join('\n')}

SUMMARY
-------
Issues Reported: ${yesCount} of ${questions.length}
Consultation Requested: ${consultationNeeded ? 'Yes' : 'No'}

==========================================
Thank you for using DentCare Clinic services.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dental-assessment-${patient.patientId}-${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Assessment report has been downloaded.",
    });
  };

  if (showSummary) {
    const yesCount = Object.values(answers).filter(Boolean).length;
    
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-scale-in">
          <div ref={summaryRef} className="bg-card rounded-2xl p-8 shadow-elevated border border-border print:shadow-none print:border-none">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 print:bg-transparent">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Assessment Complete!
              </h1>
              <p className="text-muted-foreground">
                Thank you for completing your dental health assessment
              </p>
            </div>

            <div className="bg-secondary rounded-xl p-6 mb-4 print:bg-transparent print:border print:border-border">
              <h3 className="font-semibold text-foreground mb-4">Patient Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID</span>
                  <span className="font-mono text-foreground">{patient.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-6 mb-4 print:bg-transparent print:border print:border-border">
              <h3 className="font-semibold text-foreground mb-4">Assessment Responses</h3>
              <div className="space-y-2 text-sm">
                {questions.map(q => (
                  <div key={q.id} className="flex justify-between items-center">
                    <span className="text-muted-foreground flex-1 pr-4">{q.question}</span>
                    <span className={`font-medium ${answers[q.id] ? 'text-destructive' : 'text-success'}`}>
                      {answers[q.id] ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-6 mb-6 print:bg-transparent print:border print:border-border">
              <h3 className="font-semibold text-foreground mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issues Reported</span>
                  <span className="font-medium text-foreground">{yesCount} of {questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Requested</span>
                  <span className={`font-medium ${consultationNeeded ? 'text-primary' : 'text-muted-foreground'}`}>
                    {consultationNeeded ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4 print:hidden">
              <Button onClick={handlePrint} variant="outline" size="lg" className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="space-y-3 print:hidden">
              <Button onClick={onComplete} variant="hero" size="lg" className="w-full">
                Take New Assessment
              </Button>
              <Button onClick={onLogout} variant="outline" size="lg" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showConsultation) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent mb-6">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                Doctor Consultation
              </h2>
              <p className="text-muted-foreground text-lg">
                Based on your responses, would you like to schedule a consultation with our dentist?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleConsultation(true)}
                variant="hero"
                size="xl"
                className="flex flex-col h-auto py-6"
              >
                <CheckCircle className="w-8 h-8 mb-2" />
                Yes
              </Button>
              <Button
                onClick={() => handleConsultation(false)}
                variant="secondary"
                size="xl"
                className="flex flex-col h-auto py-6"
              >
                <XCircle className="w-8 h-8 mb-2" />
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{patient.name}</p>
              <p className="text-xs text-muted-foreground">{patient.patientId}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Dental Health Assessment
            </h2>
            <p className="text-muted-foreground mt-1">
              Please answer the following questions about your dental health
            </p>
          </div>

          <div className="divide-y divide-border">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 md:p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{question.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">
                    {index + 1}. {question.question}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAnswer(question.id, true)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      answers[question.id] === true
                        ? 'bg-destructive text-destructive-foreground shadow-soft'
                        : 'bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(question.id, false)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      answers[question.id] === false
                        ? 'bg-success text-success-foreground shadow-soft'
                        : 'bg-secondary text-secondary-foreground hover:bg-success/10 hover:text-success'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-secondary/50">
            <Button 
              onClick={handleSubmitAnswers} 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={!allAnswered}
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalQuestionnaire;