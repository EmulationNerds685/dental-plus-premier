# Dental Plus Premier

A production-ready dental clinic platform built for real-world clinical workflows. The application enables patients to schedule appointments, complete bilingual digital consent forms, sign documents electronically, and generate downloadable PDF consent records.

Built using **TanStack Start**, **TypeScript**, **MongoDB**, and server-side React functions, the platform demonstrates modern full-stack architecture with SSR, type-safe APIs, and healthcare-focused workflows.

---

## Live Demo

🔗 **Website:** https://dentalplusdehradun.in

---

## Problem Solved

Traditional dental clinics often rely on paper-based patient intake and consent workflows, resulting in manual record management, poor accessibility, and inefficient appointment coordination.

Dental Plus Premier digitizes these operations through:

* online appointment scheduling,
* digital patient consent workflows,
* bilingual medical forms,
* electronic signature capture,
* downloadable PDF consent records,
* centralized patient record storage.

The project was designed for deployment in a real dental clinic environment.

---

## Key Features

* Online appointment booking workflow
* Dynamic time-slot selection system
* WhatsApp-assisted booking confirmation
* Bilingual consent forms (English / Hindi)
* HTML5 Canvas-based digital signature capture
* Automated PDF consent document generation
* MongoDB-powered patient record persistence
* TanStack Start server functions
* SSR-enabled frontend architecture
* Responsive mobile-first UI
* Type-safe full-stack development using TypeScript
* Modern healthcare-focused interface design

---

## Screenshots

### Homepage

Modern dental clinic landing page with appointment-first workflow.

<img width="1366" height="768" alt="Screenshot (92)" src="https://github.com/user-attachments/assets/e7352973-e0f2-4abe-aa7a-1936a9da57b2" />


---

### Appointment Booking

Dynamic appointment scheduling with date and time-slot selection.

<img width="1366" height="768" alt="Screenshot (96)" src="https://github.com/user-attachments/assets/58b5046d-2379-4254-99ec-bf68cd6df303" />
<img width="1366" height="768" alt="Screenshot (97)" src="https://github.com/user-attachments/assets/a7e93ef7-8ef5-41d3-8dd1-bda5850bc162" />


---

### Clinical Consent Form

Structured bilingual patient consent workflow.

<img width="1366" height="768" alt="Screenshot (93)" src="https://github.com/user-attachments/assets/5bd46454-93f9-4172-85fb-15bde15ecd2b" />
<img width="1366" height="768" alt="Screenshot (94)" src="https://github.com/user-attachments/assets/f4990f29-3215-4d13-8b75-05e00580ff60" />


---

### Digital Signature Capture

HTML5 Canvas-based electronic signature system.

<img width="1366" height="768" alt="Screenshot (95)" src="https://github.com/user-attachments/assets/d83422d0-c9b4-4e75-9390-318b42663974" />

---

## Tech Stack

### Frontend

* TanStack Start
* React
* TypeScript
* Tailwind CSS

### Backend / Server

* TanStack Server Functions (`createServerFn`)
* Node.js

### Database

* MongoDB Atlas
* Mongoose

### PDF & Document Processing

* html2pdf.js
* HTML5 Canvas API

### Deployment

* Vercel

---

## System Architecture

```text
Patient
    |
    v
TanStack Start Application
    |
    +------ Server Functions
    |
    +------ MongoDB Atlas
    |
    +------ PDF Generation
```

The application uses TanStack Start server functions instead of a traditional standalone Express backend, simplifying deployment and enabling type-safe server communication.

---

## Consent Workflow

```text
Patient Appointment
        |
        v
Clinical Consent Form
        |
        v
Digital Signature Capture
        |
        v
PDF Generation
        |
        v
Database Storage
```

The workflow digitizes traditional paper-based dental consent procedures into a structured, downloadable, and storable digital format.

---

## Technical Highlights

### Server Functions Architecture

Implemented TanStack Start `createServerFn` handlers for type-safe server-side operations without maintaining a separate Express API layer.

### Digital Signature Capture

Built an HTML5 Canvas-based signature system allowing patients to digitally sign clinical consent documents directly within the browser.

### PDF Document Generation

Generated downloadable patient consent PDFs dynamically using `html2pdf.js`.

### MongoDB Connection Caching

Implemented connection caching strategies to prevent excessive MongoDB reconnections in serverless deployment environments.

### SSR & SEO Optimization

Leveraged server-side rendering for improved performance and local search discoverability.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Environment Variables

Create a `.env` file:

```env
MONGODB_URI=
```

---

## Real-World Usage

This project was designed as an operational platform for a real dental clinic workflow, focusing on patient onboarding, appointment scheduling, consent digitization, and clinical document handling.

---

## Future Improvements

* Admin analytics dashboard
* Patient appointment history
* Cloud-based PDF archival
* Automated reminder notifications
* Role-based clinic staff access
* Secure doctor/patient portals

---

## Author

**Bhaskar Tiwari**

GitHub: https://github.com/EmulationNerds685
