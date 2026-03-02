import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import StandardPublicPage from './components/StandardPublicPage';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import ErrorPage from './pages/ErrorPage';

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

// Complaint Management
import ComplaintManagementPage from './pages/complaints/ComplaintManagementPage';

// Shared Pages
import Chatbot from './pages/ai/Chatbot';
import VoiceAssistantPage from './pages/ai/VoiceAssistantPage';

import './index.css';
import useAuthStore from './store/authStore';

// Protected Route with Role Check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
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
      { path: 'complaints', element: <ComplaintManagementPage /> },
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
    errorElement: <ErrorPage />,
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
      { path: 'complaints', element: <ComplaintManagementPage /> },
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
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'expenses', element: <UserExpenseList /> },
      { path: 'reports', element: <UserReports /> },
      { path: 'ai', element: <UserAIDashboard /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'voice', element: <VoiceAssistantPage /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'complaints', element: <ComplaintManagementPage /> },
    ]
  },
  {
    path: '/dashboard',
    element: <RoleBasedRedirect />,
    errorElement: <ErrorPage />
  },
  // Default Redirect based on Role
  {
    path: '/',
    element: <RoleBasedRedirect />,
    errorElement: <ErrorPage />
  },
  {
    path: '/features',
    element: <Features />,
    errorElement: <ErrorPage />
  },
  {
    path: '/intelligence',
    element: <Intelligence />,
    errorElement: <ErrorPage />
  },
  {
    path: '/security',
    element: <Security />,
    errorElement: <ErrorPage />
  },
  {
    path: '/global',
    element: <Global />,
    errorElement: <ErrorPage />
  },
  {
    path: '/protocol/:id',
    element: <StandardPublicPage />,
    errorElement: <ErrorPage />
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
