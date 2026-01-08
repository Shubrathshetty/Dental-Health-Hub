# Dental Health Hub

A comprehensive web application for managing dental health consultations, built with modern React technologies. This application allows patients to register, complete dental questionnaires, and schedule consultations, while providing administrators with a dashboard to manage patients and assessments.

## Features

### For Patients
- **User Registration & Authentication**: Secure patient registration and login system
- **Dental Questionnaire**: Comprehensive dental health assessment form
- **Consultation Scheduling**: Automated consultation booking with email notifications
- **Profile Management**: Patient information and consultation history tracking

### For Administrators
- **Admin Dashboard**: Centralized management interface
- **Patient Management**: View and manage all registered patients
- **Assessment Overview**: Review completed dental questionnaires
- **Consultation Management**: Schedule and track patient consultations
- **Email Notifications**: Automated email confirmations for scheduled appointments

### Technical Features
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern UI Components**: Built with ShadCN UI components
- **Type-Safe Development**: Full TypeScript implementation
- **Email Integration**: EmailJS for consultation notifications
- **State Management**: React Query for efficient data fetching and caching
- **Form Handling**: React Hook Form with Zod validation

## Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Vite 5.4.19** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **ShadCN UI** - Modern, accessible UI components built on Radix UI
- **Lucide React** - Beautiful icon library
- **Tailwind Animate** - CSS animation utilities

### State Management & Data Fetching
- **TanStack React Query 5.83.0** - Powerful data synchronization for React
- **React Router DOM 6.30.1** - Declarative routing for React

### Form Handling & Validation
- **React Hook Form 7.61.1** - Performant forms with easy validation
- **Zod 3.25.76** - TypeScript-first schema validation
- **@hookform/resolvers 3.10.0** - Integration between React Hook Form and Zod

### Email Integration
- **EmailJS 4.4.1** - Send emails directly from client-side JavaScript

### Development Tools
- **ESLint 9.32.0** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS 8.5.6** - CSS processing tool
- **Autoprefixer 10.4.21** - CSS vendor prefixing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control system

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dental-health-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (default Vite port)

## Setup

### EmailJS Configuration

This application uses EmailJS for sending consultation confirmation emails. To set up email functionality:

1. **Sign up for EmailJS:**
   - Visit [emailjs.com](https://www.emailjs.com/) and create an account

2. **Configure Email Service:**
   - Follow the detailed setup guide in `EMAILJS_SETUP_GUIDE.md`
   - Create an email service (Gmail, Outlook, etc.)
   - Create an email template for consultation notifications

3. **Update Configuration:**
   - Open `src/lib/emailConfig.ts`
   - Replace placeholder values with your EmailJS credentials:
     ```typescript
     export const EMAIL_CONFIG = {
       SERVICE_ID: 'your_service_id',
       TEMPLATE_ID: 'your_template_id',
       PUBLIC_KEY: 'your_public_key'
     };
     ```

### Environment Variables (Optional)

For production deployment, consider using environment variables for EmailJS credentials:

1. Create a `.env` file in the root directory
2. Add your EmailJS credentials:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

## Usage

### For Patients

1. **Access the Application:**
   - Open the application in your browser
   - Select "Patient" from the role selection screen

2. **Register or Login:**
   - Choose to register a new account or login to an existing one
   - Fill out the required information

3. **Complete Dental Questionnaire:**
   - Answer all questions in the dental health assessment
   - Submit the form to complete your assessment

4. **Receive Consultation Confirmation:**
   - After assessment, a consultation will be scheduled automatically
   - Check your email for confirmation details

### For Administrators

1. **Admin Login:**
   - Select "Admin" from the role selection screen
   - Enter admin credentials (default: check `src/lib/testData.ts`)

2. **Dashboard Overview:**
   - View all registered patients
   - Review completed assessments
   - Manage consultation schedules

3. **Patient Management:**
   - Search and filter patients
   - View detailed patient information
   - Schedule consultations manually if needed

## Project Structure

```
dental-health-hub/
├── public/                    # Static assets
│   ├── favicon.ico.jpeg      # Application favicon
│   ├── placeholder.svg       # Placeholder images
│   └── robots.txt            # SEO robots file
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── ui/              # ShadCN UI components
│   │   ├── AdminDashboard.tsx    # Admin management interface
│   │   ├── AdminLogin.tsx        # Admin authentication
│   │   ├── DentalQuestionnaire.tsx # Patient assessment form
│   │   ├── PatientAuthChoice.tsx  # Login/register choice
│   │   ├── PatientLogin.tsx       # Patient authentication
│   │   ├── PatientRegistration.tsx # Patient registration
│   │   └── RoleSelection.tsx      # Initial role selection
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── emailConfig.ts   # EmailJS configuration
│   │   ├── patientStore.ts  # Patient data management
│   │   ├── testData.ts      # Sample data for testing
│   │   └── utils.ts         # General utilities
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Main application page
│   │   └── NotFound.tsx     # 404 error page
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── EMAILJS_SETUP_GUIDE.md   # Email configuration guide
├── TODO.md                  # Development tasks
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Development

### Code Quality
- **ESLint**: Configured for React and TypeScript best practices
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (integrated with ESLint)

### Component Library
The application uses ShadCN UI components, which are:
- Built on Radix UI primitives
- Fully accessible (WCAG compliant)
- Customizable with Tailwind CSS
- Tree-shakeable for optimal bundle size

### State Management
- Local state managed with React hooks
- Server state handled by TanStack React Query
- Form state managed by React Hook Form

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Environment Variables for Production
Make sure to set your EmailJS credentials as environment variables in your hosting platform:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Ensure all tests pass before submitting PR
- Update documentation for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the `EMAILJS_SETUP_GUIDE.md` for email configuration issues
2. Review the browser console for error messages
3. Ensure all dependencies are properly installed
4. Check that EmailJS credentials are correctly configured

For additional support, please open an issue in the repository.
