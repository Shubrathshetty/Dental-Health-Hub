// EmailJS Configuration for Dental Health Hub
// Sign up at https://www.emailjs.com/ and create a service, template, and get your public key

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_n7sd7g8', // Your EmailJS service ID
  TEMPLATE_ID: 'template_wkcmfv8', // Your EmailJS template ID
  PUBLIC_KEY: 'GexZJfsDq7ySEZPhP', // Your EmailJS public key
};

// EmailJS Template Variables (these should match your EmailJS template):
// - {{to_email}} - Patient's email address
// - {{to_name}} - Patient's name
// - {{consultation_id}} - Unique consultation ID
// - {{consultation_date}} - Formatted consultation date
// - {{consultation_time}} - Consultation time
// - {{clinic_name}} - Clinic name
// - {{clinic_location}} - Clinic location
// - {{from_name}} - Sender name (Dental Health Hub Team)

// Example EmailJS Template HTML:
// Subject: Dental Consultation Scheduled - {{consultation_id}}
//
// Dear {{to_name}},
//
// Your dental consultation has been scheduled successfully!
//
// Consultation Details:
// - Consultation ID: {{consultation_id}}
// - Date: {{consultation_date}}
// - Time: {{consultation_time}}
// - Clinic: {{clinic_name}}
// - Location: {{clinic_location}}
//
// Please arrive 15 minutes before your scheduled time.
// Bring your ID and any relevant medical records.
//
// If you need to reschedule, please contact us at least 24 hours in advance.
//
// Best regards,
// {{from_name}}
