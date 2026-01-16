import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ExpenseList from './pages/admin/expenses/ExpenseList';
import CategoryList from './pages/admin/categories/CategoryList';
import Reports from './pages/admin/reports/Reports';
import AdminProfile from './pages/admin/profile/AdminProfile';
import './index.css';

// Protected Route Wrapper (Simple check for now)
const ProtectedRoute = ({ children }) => {
  // In a real app, check auth token validity
  // const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
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
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'admin/expenses',
        element: <ExpenseList />,
      },
      {
        path: 'admin/categories',
        element: <CategoryList />,
      },
      {
        path: 'admin/reports',
        element: <Reports />,
      },
      {
        path: 'admin/profile',
        element: <AdminProfile />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
