import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layouts/AdminLayout'; // Revised Layout
import ManagerLayout from './layouts/ManagerLayout'; // New Layout
import UserLayout from './components/layout/UserLayout'; // User Layout

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

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

// Manager Pages
import ManagerDashboard from './pages/manager/dashboard/ManagerDashboard';
import ManagerExpenseList from './pages/manager/expenses/ManagerExpenseList';
import TeamList from './pages/manager/team/TeamList';
import ManagerReports from './pages/manager/reports/ManagerReports';
import ManagerProfile from './pages/manager/profile/ManagerProfile';
import ManagerAIDashboard from './pages/manager/ai/ManagerAIDashboard';

// Shared Pages
import Chatbot from './pages/ai/Chatbot';

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
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> }, // Default to dashboard
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'expenses', element: <ExpenseList /> },
      { path: 'teams', element: <AdminTeamManagement /> },
      { path: 'categories', element: <CategoryList /> },
      { path: 'reports', element: <Reports /> },
      { path: 'ai', element: <AdminAIDashboard /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'profile', element: <AdminProfile /> },
    ]
  },
  // Manager Routes
  {
    path: '/manager',
    element: (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <ManagerLayout />
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
      { path: 'profile', element: <ManagerProfile /> },
    ]
  },
  // User Routes
  {
    path: '/user',
    element: (
      <ProtectedRoute allowedRoles={['USER']}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'expenses', element: <UserExpenseList /> },
      { path: 'reports', element: <UserReports /> },
      { path: 'ai', element: <UserAIDashboard /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'profile', element: <UserProfile /> },
    ]
  },
  // Default Redirect
  {
    path: '/',
    element: <ProtectedRoute><Navigate to="/user/dashboard" /></ProtectedRoute> // ProtectedRoute will handle role-based redirect
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
