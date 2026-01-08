# EmailJS Setup Guide for Dental Health Hub

## Step-by-Step Guide After Signing Up

### Step 1: Create an Email Service
1. After logging into your EmailJS dashboard, click on **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the authentication steps:
   - For Gmail: Enable 2-factor authentication, generate an App Password
   - For Outlook: Use your account password or generate an App Password
5. Give your service a name (e.g., "Dental Health Hub Email")
6. Click **"Create Service"**
7. **Copy the Service ID** - you'll need this later

### Step 2: Create an Email Template
1. Click on **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Configure the template with these settings:

#### Template Settings:
- **Template Name:** Dental Consultation Notification
- **Subject:** Dental Consultation Scheduled - {{consultation_id}}

#### Template HTML Body:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dental Consultation Scheduled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Dental Consultation Scheduled</h2>

        <p>Dear {{to_name}},</p>

        <p>Your dental consultation has been scheduled successfully!</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Consultation Details:</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Consultation ID:</strong> {{consultation_id}}</li>
                <li><strong>Date:</strong> {{consultation_date}}</li>
                <li><strong>Time:</strong> {{consultation_time}}</li>
                <li><strong>Clinic:</strong> {{clinic_name}}</li>
                <li><strong>Location:</strong> {{clinic_location}}</li>
            </ul>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">Important Instructions:</h4>
            <ul>
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring your ID and any relevant medical records</li>
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
            </ul>
        </div>

        <p>If you have any questions, please don't hesitate to contact us.</p>

        <p>Best regards,<br>
        <strong>{{from_name}}</strong></p>
    </div>
</body>
</html>
```

4. Click **"Save"**

### Step 3: Get Your Public Key
1. Click on **"Account"** in the left sidebar
2. Scroll down to find your **"Public Key"**
3. **Copy the Public Key** - you'll need this later

### Step 4: Update Your Application Code
1. Open `src/lib/patientStore.ts` in your project
2. Find the EmailJS configuration section (around line 126)
3. Replace the placeholder values with your actual credentials:

```typescript
// EmailJS configuration - you'll need to set up these values in your EmailJS dashboard
const SERVICE_ID = 'your_service_id'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'your_template_id'; // Replace with your EmailJS template ID
const PUBLIC_KEY = 'your_public_key'; // Replace with your EmailJS public key
```

**Example:**
```typescript
const SERVICE_ID = 'service_abc123def456';
const TEMPLATE_ID = 'template_xyz789uvw012';
const PUBLIC_KEY = 'abcdefghijklmnopqrstuvwx';
```

### Step 5: Test the Email Functionality
1. Start your development server: `npm run dev`
2. Navigate to the admin dashboard
3. Create a test patient and assessment
4. Schedule a consultation for the patient
5. Check your email - you should receive the consultation notification

### Step 6: Verify Email Delivery
1. Check the browser console for success messages
2. Verify the email was sent to the correct address
3. Confirm all template variables were populated correctly

## Troubleshooting

### Common Issues:

1. **"Service ID not found" error:**
   - Double-check your Service ID in the EmailJS dashboard
   - Make sure the service is connected and active

2. **"Template not found" error:**
   - Verify your Template ID matches the one in EmailJS
   - Ensure the template is saved and active

3. **Emails not being received:**
   - Check your spam/junk folder
   - Verify the recipient email address is correct
   - Ensure your email service provider isn't blocking the emails

4. **Template variables not working:**
   - Make sure variable names in your template match exactly: `{{to_name}}`, `{{consultation_id}}`, etc.

### Security Notes:
- Never commit your EmailJS credentials to version control
- Consider using environment variables for production deployment
- Regularly rotate your EmailJS keys for security

## Support
If you encounter issues, check the EmailJS documentation at https://www.emailjs.com/docs/ or their support forums.
