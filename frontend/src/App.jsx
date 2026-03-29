import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import AnonymityGuarantee from "./pages/legal/AnonymityGuarantee";
import CookiePolicy from "./pages/legal/CookiePolicy";

// Dashboards
import DashboardShell from "./pages/dashboard/DashboardShell";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CommitteeDashboard from "./pages/dashboard/CommitteeDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import AllInstitutionsPage from "./pages/dashboard/superadmin/AllInstitutionsPage";
import GlobalAnalyticsPage from "./pages/dashboard/superadmin/GlobalAnalyticsPage";
import SuperAdminSettingsPage from "./pages/dashboard/superadmin/SuperAdminSettingsPage";
import CreateOrganizationPage from "./pages/dashboard/superadmin/CreateOrganizationPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {!isDashboard && <Header />}
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/anonymity" element={<AnonymityGuarantee />} />
          <Route path="/cookies" element={<CookiePolicy />} />

          {/* Secure Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardSelector />} />
            {/* Super Admin sub-pages */}
            <Route path="institutions" element={<AllInstitutionsPage />} />
            <Route path="create-org" element={<CreateOrganizationPage />} />
            <Route path="analytics" element={<GlobalAnalyticsPage />} />
            <Route path="settings" element={<SuperAdminSettingsPage />} />
          </Route>
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

// Helper component to render the correct dashboard based on role
const DashboardSelector = () => {
  const user = JSON.parse(localStorage.getItem("voisafe_user") || "null");
  if (!user) return null;

  switch (user.role) {
    case "student": return <StudentDashboard />;
    case "committee": return <CommitteeDashboard />;
    case "admin": return <AdminDashboard />;
    case "superadmin": return <SuperAdminDashboard />;
    default: return <div className="p-10 text-white text-center">Role not recognized for terminal access.</div>;
  }
};

export default App;
