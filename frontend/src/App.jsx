import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import ManageTeamsPage from "./pages/dashboard/admin/ManageTeamsPage";
import ReportsPage from "./pages/dashboard/admin/ReportsPage";
import OrganizationSettingsPage from "./pages/dashboard/admin/OrganizationSettingsPage";
import ProfilePage from './pages/dashboard/ProfilePage';
import ResolutionQueuePage from "./pages/dashboard/committee/ResolutionQueuePage";
import MyGrievancesPage from "./pages/dashboard/student/MyGrievancesPage";
import SubmitGrievancePage from "./pages/dashboard/student/SubmitGrievancePage";

import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {!isDashboard && <Header />}
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      <main className="grow">
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
            
            <Route path="committees" element={<ProtectedRoute allowedRoles={["admin"]}><ManageTeamsPage /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute allowedRoles={["admin"]}><ReportsPage /></ProtectedRoute>} />
            <Route path="student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="submit" element={<ProtectedRoute allowedRoles={["student"]}><SubmitGrievancePage /></ProtectedRoute>} />
            <Route path="grievances" element={<ProtectedRoute allowedRoles={["student"]}><MyGrievancesPage /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><OrganizationSettingsByRole/></ProtectedRoute>} />
            <Route path="reviews" element={<ProtectedRoute allowedRoles={["admin", "committee"]}><ResolutionQueuePage /></ProtectedRoute>} />

            {/* Shared Dashboard Sub-routes */}
            <Route path="profile" element={<ProfilePage />} />

            {/* Super Admin Terminal Routes */}
            <Route path="institutions" element={<ProtectedRoute allowedRoles={["superadmin"]}><AllInstitutionsPage /></ProtectedRoute>} />
            <Route path="create-org" element={<ProtectedRoute allowedRoles={["superadmin"]}><CreateOrganizationPage /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute allowedRoles={["superadmin"]}><GlobalAnalyticsPage /></ProtectedRoute>} />
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
    case "student":
      return <StudentDashboard />;
    case "committee":
      return <CommitteeDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "superadmin":
      return <SuperAdminDashboard />;
    default:
      return (
        <div className="p-10 text-white text-center">
          Role not recognized for terminal access.
        </div>
      );
  }
};

const OrganizationSettingsByRole = () => {
    const user = JSON.parse(localStorage.getItem("voisafe_user") || "null");
    if (user?.role === 'superadmin') return <SuperAdminSettingsPage/>;
    return <OrganizationSettingsPage/>;
};

export default App;
