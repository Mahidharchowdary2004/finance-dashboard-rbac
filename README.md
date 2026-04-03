# 💰 Zorvyn Finance Dashboard (FinDash)

A premium, secure financial management system built with the **MERN** stack, featuring robust **Role-Based Access Control (RBAC)** and professional data visualization.

![Dashboard Preview](https://via.placeholder.com/1200x600/0c0f16/ffffff?text=FinDash+MERN+Dashboard+Preview)

## 🚀 Key Features

*   **🔒 Secure Authentication**: Multi-step registration and login with real-time password visibility toggling.
*   **🎭 RBAC (Role-Based Access Control)**:
    *   **Admin**: Full system control (User management, all CRUD operations).
    *   **Analyst**: Full access to financial data and trends.
    *   **Viewer**: Read-only access to dashboard statistics.
*   **📊 Dynamic Analytics**: Interactive Area and Bar charts powered by **Recharts** for tracking monthly trends and category-wise spending.
*   **📠 User Management**: Comprehensive administrative tools to manage account status, roles, and deletions with built-in safety constraints.
*   **💸 Financial Records**: Full lifecycle management of Income and Expenses with localized **Indian Rupee (₹)** support.
*   **🎨 Premium UI**: Modern aesthetic featuring:
    *   **Animated Mesh Backgrounds**
    *   **Glassmorphic Design**
    *   **Custom Confirmation Modals**
    *   **Responsive Typography (Inter)**

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Axios (Global error interceptors)
- Recharts (Data Viz)
- Lucide React (Iconography)
- Vanilla CSS (Custom Design System)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for session management
- Centralized Error Handling Middlewares

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB Atlas or local MongoDB instance
- Git

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mahidharchowdary2004/finance-dashboard-rbac.git
   cd finance-dashboard-rbac
   ```

2. **Backend Configuration**
   - Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
   - Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Configuration**
   - Install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application**
   - In one terminal (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   - In another terminal (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

## 🔐 Safety & Security Practices

- **Admin Lockdown**: The system prevents the deletion or downgrade of the last administrator to ensure permanent system access.
- **Input Validation**: Strict server-side validation for all financial amounts and user profiles.
- **Error Transparency**: Standardized global error handling provides human-readable feedback for all API interactions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ by [Mahidhar Chowdary](https://github.com/Mahidharchowdary2004)
