import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./layouts/AdminLayout";
import BidderLayout from "./layouts/BidderLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfilesPage from "./pages/admin/AdminProfilesPage";
import AdminAppliesPage from "./pages/admin/AdminAppliesPage";
import AdminAppliesProfilePage from "./pages/admin/AdminAppliesProfilePage";
import AdminInterviewsPage from "./pages/admin/AdminInterviewsPage";
import AdminBiddersPage from "./pages/admin/AdminBiddersPage";
import BidderDashboardPage from "./pages/bidder/BidderDashboardPage";
import BidderProfilesPage from "./pages/bidder/BidderProfilesPage";
import BidderApplyPage from "./pages/bidder/BidderApplyPage";

export default function App() {
  const { user, booting } = useAuth();

  if (booting) return <Loader text="Starting app..." fullScreen />;

  if (!user) return <AuthPage />;

  if (user.role === "admin") {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/profiles" element={<AdminProfilesPage />} />
          <Route path="/admin/applies" element={<AdminAppliesPage />} />
          <Route path="/admin/applies/profile/:profileId" element={<AdminAppliesProfilePage />} />
          <Route path="/admin/interviews" element={<AdminInterviewsPage />} />
          <Route path="/admin/bidders" element={<AdminBiddersPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <BidderLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<BidderDashboardPage />} />
        <Route path="/profiles" element={<BidderProfilesPage />} />
        <Route path="/profiles/:profileId/apply" element={<BidderApplyPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BidderLayout>
  );
}
