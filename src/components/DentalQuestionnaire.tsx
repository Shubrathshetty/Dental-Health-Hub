import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User, LogOut, ArrowRight, Printer, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Patient, saveAssessment, DentalAssessment } from "@/lib/patientStore";

interface Question {
  id: string;
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
    questions.forEach(q => {
      initial[q.id] = null;
    });
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
      description: needed ? "Your consultation request has been recorded." : "Thank you for completing the assessment.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const yesCount = Object.values(answers).filter(Boolean).length;
    const date = new Date().toLocaleDateString();
    const content = `DENTALCARE CLINIC - DENTAL HEALTH ASSESSMENT
================================================================================
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
=========================================
Thank you for using DentalCare Clinic services.`;
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-scale-in">
          <div ref={summaryRef} className="bg-sky-900 rounded-2xl p-8 shadow-lg border border-sky-300 print:shadow-none print:border-none">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-sky-800 flex items-center justify-center mx-auto mb-6 print:bg-transparent">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Assessment Complete!
              </h1>
              <p className="text-sky-100">
                Thank you for completing your dental health assessment
              </p>
            </div>
            <div className="bg-sky-800 rounded-xl p-6 mb-4 print:bg-transparent print:border print:border-border">
              <h3 className="font-semibold text-white mb-4">Patient Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sky-200">Name</span>
                  <span className="font-medium text-white">{patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-200">Patient ID</span>
                  <span className="font-mono text-white">{patient.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-200">Date</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="bg-sky-800 rounded-xl p-6 mb-4 print:bg-transparent print:border print:border-border">
              <h3 className="font-semibold text-white mb-4">Assessment Responses</h3>
              <div className="space-y-2 text-sm">
                {questions.map(q => (
                  <div key={q.id} className="flex justify-between items-center">
                    <span className="text-sky-200 flex-1 pr-4">{q.question}</span>
                    <span className={`font-medium ${answers[q.id] ? 'text-red-300' : 'text-green-300'}`}>
                      {answers[q.id] ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-sky-800 rounded-xl p-6 mb-6 print:bg-transparent print:border print:border-border">
              <h3 className="font-semibold text-white mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sky-200">Issues Reported</span>
                  <span className="font-medium text-white">{yesCount} of {questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-200">Consultation Requested</span>
                  <span className={`font-medium ${consultationNeeded ? 'text-sky-300' : 'text-sky-200'}`}>
                    {consultationNeeded ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mb-4 print:hidden">
              <Button onClick={handlePrint} variant="outline" size="lg" className="flex-1 bg-white text-sky-900 hover:bg-sky-50">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1 bg-white text-sky-900 hover:bg-sky-50">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="space-y-3 print:hidden">
              {/*<Button onClick={onComplete} variant="hero" size="lg" className="w-full"> Take New Assessment </Button>*/}
              <Button onClick={onLogout} variant="outline" size="lg" className="w-full bg-white text-sky-900 hover:bg-sky-50">
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="bg-sky-900 rounded-2xl p-8 shadow-lg border border-sky-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-sky-800 mb-6">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-3">
                Doctor Consultation
              </h2>
              <p className="text-sky-100 text-lg">
                Based on your responses, would you like to schedule a consultation with our Dentist?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleConsultation(true)} variant="hero" size="xl" className="flex flex-col h-auto py-6 bg-white text-sky-900 hover:bg-sky-50" >
                <CheckCircle className="w-8 h-8 mb-2" />
                Yes
              </Button>
              <Button onClick={() => handleConsultation(false)} variant="secondary" size="xl" className="flex flex-col h-auto py-6 bg-sky-800 text-white hover:bg-sky-400 border-sky-300" >
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-900 border-b border-blue-300 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{patient.name}</p>
              <p className="text-sm text-blue-200 font-mono">{patient.patientId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-blue-200">Assessment Progress</p>
              <p className="font-semibold text-white">{Math.round(progress)}% Complete</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="bg-white text-blue-900 hover:bg-blue-50 border-blue-300">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      {/* Progress Section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="bg-sky-900 rounded-2xl p-6 shadow-lg border border-sky-300">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-white">
              Dental Health Assessment
            </h1>
            <div className="text-right">
              <p className="text-sm text-sky-200">Questions Answered</p>
              <p className="text-2xl font-bold text-white">{answeredCount}/{questions.length}</p>
            </div>
          </div>
          <div className="h-3 bg-sky-800 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-700 ease-out rounded-full shadow-lg" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-sky-200 mt-2 text-center">
            Please answer all questions to proceed with your assessment
          </p>
        </div>
      </div>
      {/* Questions List */}
      <div className="max-w-4xl mx-auto p-4 pb-8">
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-sky-900 rounded-2xl shadow-lg border border-sky-300 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-sky-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-3xl">{question.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-700 text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-white leading-tight">
                        {question.question}
                      </h3>
                    </div>
                    <div className="flex gap-3 ml-11">
                      <button onClick={() => handleAnswer(question.id, true)} className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${ answers[question.id] === true ? 'bg-sky-600 text-white shadow-sky-200' : 'bg-sky-500 text-white hover:bg-sky-600 border border-sky-300' }`} >
                        Yes
                      </button>
                      <button onClick={() => handleAnswer(question.id, false)} className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${ answers[question.id] === false ? 'bg-sky-600 text-white shadow-sky-200' : 'bg-sky-500 text-white hover:bg-sky-600 border border-sky-300' }`} >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Continue Button */}
        <div className="mt-8 bg-sky-900 rounded-2xl p-6 shadow-lg border border-sky-300">
          <Button onClick={handleSubmitAnswers} variant="hero" size="xl" className="w-full bg-white text-sky-900 hover:bg-sky-50 shadow-lg hover:shadow-xl transition-all duration-300" disabled={!allAnswered} >
            <span className="text-lg font-semibold">Complete Assessment</span>
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          {!allAnswered && (
            <p className="text-sm text-sky-200 text-center mt-3">
              Please answer all questions to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DentalQuestionnaire;
