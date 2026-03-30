# 🏥 Smart Hospital Management System V2.0

![Hospital Banner](https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop)

A comprehensive, enterprise-grade Next-Generation **Medical Ecosystem** built on the MERN stack. Designed to seamlessly connect Patients, Doctors, and Administrators within a unified, highly optimized digital platform. 

This platform features a breathtaking custom Dark Mode UI, true JWT-based Role-Based Access Control (RBAC), AI-driven Optical Character Recognition (OCR), and a native real-time Web Notification pipeline.

---

## ✨ Power Features

- **🔐 Robust Security Infrastructure**: True JSON Web Token (JWT) stateless interactions. Protected React Router bounds dynamically rendering Dashboards based strictly on verified `[Admin, Doctor, Patient]` Mongo Roles.
- **📅 Advanced Appointment Engine**: Patients can instantly query network Doctors and dynamically book dates/times. Doctors receive native requests to `Accept` or `Reject` with live MongoDB status highlighting.
- **🧠 AI Prescription Extraction**: Integrated **Tesseract.js** paired with deep JavaScript Regular Expressions to intelligently strip messy handwriting and dynamically reconstruct `{ Medicine Name, Dosage, Timing }` structured REST API payloads.
- **🔊 Native Browser Pulse Alerts**: An autonomous chronological chron-job loop evaluates patient medications array and fires both true OS Web-Push Notifications and generates a dual high-pitch medical beep via the native JS `AudioContext` web-engine.
- **🖨️ PDF Codec Exporting**: Generates unique encrypted UUIDs (e.g. `RX-2A4B5...`) and utilizes `html2canvas` + `jsPDF` to instantly convert the React virtual DOM into an offline `.pdf` file for patients to take to local pharmacies.
- **💬 Bidirectional WebSocket-like Chat**: A dedicated secure P2P messaging channel bridging isolated Patient and Doctor network instances dynamically querying user-indexes.
- **📈 Global Admin Architecture**: Real-time analytical dashboard with active statistical extraction arrays (`Recharts`) and a comprehensive dynamic User Network Tracker pipeline mapping over the massive datastores.
- **💅 Premium UI Polish**: Hand-written hyper-smooth CSS transition hover states mapping the entire DOM alongside `Lucide-React` active `Loader2` SVG spinners for asynchronous promise resolutions.

---

## 🛠️ Technology Stack

**Frontend Interface**
- React 18 (Vite)
- Custom CSS3 Transitions (Premium Dark UI)
- Lucide React (Icons)
- Recharts (Analytics Data Visualization)
- JSPDF & HTML2Canvas

**Backend Architecture**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & Bcrypt (Password Hashing)
- Tesseract.js (AI OCR Pipeline)
- Multer (File Handling)

---

## 🚀 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/smart-hospital-system.git
   cd smart-hospital-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `/backend` directory and add your MongoDB Connection String & JWT Secret:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_string
   JWT_SECRET=your_super_secret_key
   ```
   *Start the Backend:*
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   *(Open a new terminal)*
   ```bash
   npm install
   npm run dev
   ```

4. **Wipe Database Utility** 
   *(In case you want to restart your application with a completely clean slate)*
   ```bash
   cd backend
   npm run clear-db
   ```

---

## 👨‍💻 About Me

Hello! I am a passionate highly-driven Software Engineer focused on architecting massive scalable enterprise web ecosystems utilizing modern Javascript Frameworks and robust NoSQL databases. I built this Hospital system to demonstrate my deep understanding of full-stack data mutations, complex role-based routing, and AI integration.

- 💼 **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/)
- 🌐 **Portfolio**: [Your Portfolio Website](https://)
- 📧 **Email**: [Your Email Address](mailto:)

*Feel free to reach out to me for software engineering roles or collaborative projects!*

---
*Built with ❤️ utilizing the MERN Stack.*
