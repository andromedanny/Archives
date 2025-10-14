import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Components
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ThesisList from './pages/Thesis/ThesisList';
import ThesisDetail from './pages/Thesis/ThesisDetail';
import ThesisCreate from './pages/Thesis/ThesisCreate';
import ThesisEdit from './pages/Thesis/ThesisEdit';
import MyTheses from './pages/Thesis/MyTheses';

// Calendar Pages
import Calendar from './pages/Calendar/Calendar';
import CalendarEvent from './pages/Calendar/CalendarEvent';
import CalendarCreate from './pages/Calendar/CalendarCreate';

// User Pages
import Profile from './pages/User/Profile';
import Users from './pages/User/Users';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminTheses from './pages/Admin/AdminTheses';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminDepartments from './pages/Admin/AdminDepartments';
import AdminAnalytics from './pages/Admin/AdminAnalytics';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

// 404 Page
import NotFound from './pages/NotFound';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Main App Routes */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="thesis" element={<ThesisList />} />
          <Route path="thesis/:id" element={<ThesisDetail />} />

          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Thesis Management */}
          <Route path="thesis/create" element={
            <ProtectedRoute allowedRoles={['student', 'faculty']}>
              <ThesisCreate />
            </ProtectedRoute>
          } />
          <Route path="thesis/:id/edit" element={
            <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
              <ThesisEdit />
            </ProtectedRoute>
          } />
          <Route path="my-theses" element={
            <ProtectedRoute>
              <MyTheses />
            </ProtectedRoute>
          } />

          {/* Calendar Management */}
          <Route path="calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="calendar/event/:id" element={
            <ProtectedRoute>
              <CalendarEvent />
            </ProtectedRoute>
          } />
          <Route path="calendar/create" element={
            <ProtectedRoute allowedRoles={['faculty', 'admin', 'adviser']}>
              <CalendarCreate />
            </ProtectedRoute>
          } />

          {/* User Management */}
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/theses" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTheses />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="admin/departments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDepartments />
            </ProtectedRoute>
          } />
          <Route path="admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
