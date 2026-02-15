import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EngineerDashboard from "./pages/EngineerDashboard";
import StockManagerDashboard from "./pages/StockManagerDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UpdateUser from "./components/UpdateUser";
import DashboardDirecteur from "./pages/DashboardDirecteur";
import RegisterPage from "./pages/Register"
import DeletePage from "./pages/DeleteUser"
import AddProduct from "./pages/AddProduct"
import UpdateProduct from "./pages/UpdateProduct";
// Composant pour protéger les routes selon le rôle
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user?.role) {
    // pas connecté
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // rôle non autorisé
    return <div>Accès refusé : rôle non autorisé</div>;
  }

  return children;
};

function App() {
  // Récupère le rôle depuis le localStorage
  const role = localStorage.getItem("role");
  const currentUser = { role };

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Ingénieur */}
        <Route
          path="/engineer-dashboard"
          element={
            <ProtectedRoute user={currentUser} allowedRoles={["ingénieur", "ingenieur"]}>
              <EngineerDashboard user={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard-directeur" element={<DashboardDirecteur />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Dashboard Responsable Stock */}
        <Route
          path="/stock-dashboard"
          element={
            <ProtectedRoute user={currentUser} allowedRoles={["responsable_stock"]}>
              <StockManagerDashboard user={currentUser} />
            </ProtectedRoute>
          }
        />

        {/* Pages mot de passe */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Page mise à jour utilisateur */}
        <Route
          path="/update-user/:id"
          element={
            <ProtectedRoute
              user={currentUser}
              allowedRoles={["ingénieur", "ingenieur", "directeur"]}
            >
              <UpdateUser />
            </ProtectedRoute>
          }
        />

        {/* Route par défaut */}
        <Route path="*" element={<div>Page non trouvée</div>} />
        <Route path="/delete-user" element={<DeletePage />} />

        <Route path="/Add-product" element={<AddProduct />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
