import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

import LandingPage from './pages/Public/LandingPage';
import Features from './pages/Public/Features';
import Intelligence from './pages/Public/Intelligence';
import Security from './pages/Public/Security';
import Global from './pages/Public/Global';

// User Pages
import UserDashboard from './pages/user/dashboard/UserDashboard';
import UserExpenseList from './pages/user/expenses/UserExpenseList';
import UserReports from './pages/user/reports/UserReports';
import UserProfile from './pages/user/profile/UserProfile';
import UserAIDashboard from './pages/user/ai/UserAIDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import ExpenseList from './pages/admin/expenses/ExpenseList';
import CategoryList from './pages/admin/categories/CategoryList';
import Reports from './pages/admin/reports/Reports';
import AdminProfile from './pages/admin/profile/AdminProfile';
import AdminTeamManagement from './pages/admin/teams/AdminTeamManagement';
import AdminAIDashboard from './pages/admin/ai/AdminAIDashboard';
import VendorAnalytics from './pages/admin/analytics/VendorAnalytics';
import FraudFlags from './pages/admin/expenses/FraudFlags';

// Manager Pages
import ManagerDashboard from './pages/manager/dashboard/ManagerDashboard';
import ManagerExpenseList from './pages/manager/expenses/ManagerExpenseList';
import TeamList from './pages/manager/team/TeamList';
import ManagerReports from './pages/manager/reports/ManagerReports';
import ManagerProfile from './pages/manager/profile/ManagerProfile';
import ManagerAIDashboard from './pages/manager/ai/ManagerAIDashboard';

// Shared Pages
import Chatbot from './pages/ai/Chatbot';
import VoiceAssistantPage from './pages/ai/VoiceAssistantPage';

import './index.css';
import useAuthStore from './store/authStore';

// Protected Route with Role Check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Return Access Denied page instead of redirecting
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

// Intelligent Redirect based on Role
const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <LandingPage />;

  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'MANAGER':
      return <Navigate to="/manager" replace />;
    default:
      return <Navigate to="/user" replace />;
  }
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> }, // Default to dashboard
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'expenses', element: <ExpenseList /> },
      { path: 'teams', element: <AdminTeamManagement /> },
      { path: 'vendors', element: <VendorAnalytics /> },
      { path: 'fraud-flags', element: <FraudFlags /> },
      { path: 'categories', element: <CategoryList /> },
      { path: 'reports', element: <Reports /> },
      { path: 'ai', element: <AdminAIDashboard /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'voice', element: <VoiceAssistantPage /> },
      { path: 'profile', element: <AdminProfile /> },
    ]
  },
  // Manager Routes
  {
    path: '/manager',
    element: (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/manager/dashboard" replace /> },
      { path: 'dashboard', element: <ManagerDashboard /> },
      { path: 'expenses', element: <ManagerExpenseList /> },
      { path: 'team', element: <TeamList /> },
      { path: 'reports', element: <ManagerReports /> },
      { path: 'ai', element: <ManagerAIDashboard /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'voice', element: <VoiceAssistantPage /> },
      { path: 'profile', element: <ManagerProfile /> },
    ]
  },
  // User Routes
  {
    path: '/user',
    element: (
      <ProtectedRoute allowedRoles={['USER']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'expenses', element: <UserExpenseList /> },
      { path: 'reports', element: <UserReports /> },
      { path: 'ai', element: <UserAIDashboard /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'voice', element: <VoiceAssistantPage /> },
      { path: 'profile', element: <UserProfile /> },
    ]
  },
  // Default Redirect based on Role
  {
    path: '/',
    element: <RoleBasedRedirect />
  },
  {
    path: '/features',
    element: <Features />
  },
  {
    path: '/intelligence',
    element: <Intelligence />
  },
  {
    path: '/security',
    element: <Security />
  },
  {
    path: '/global',
    element: <Global />
  },
  // 404 Route
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: '/access-denied',
    element: <AccessDenied />
  }
]);



function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
