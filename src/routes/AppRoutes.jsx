// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicHome from '../pages/PublicHome';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import Dashboard from '../pages/Dashboard';
import MentorDashboard from '../pages/MentorsDashboards';
import Assignments from '../pages/Assignments';
import AssignmentDetails from '../pages/AssignmentsDetails';
import Doubts from '../pages/Doubts';
import Practice from '../pages/Practice';
import Home from '../pages/Home';
import DoubtDetail from '../pages/DoubtDetail';
import PreviousBriefings from '../pages/PreviousBriefing';
import AdminDashboard from '../pages/AdminDashboard';
import Contact from '../pages/Contact';
import SolutionEditorPage from '../pages/SolutionEditorPage';
import MessageDetail from '../components/MessageDetail';
import Resourse from '../pages/Resourse';
import VerifyEmailPending from '../pages/VerifyEmailPending';
import VerifyOTP from '../pages/OtpVerificationPage';
import ForgotPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/ResetPassword';
import SolutionReview from '../pages/SolutionReview';
import StudentSolutions from '../pages/StudentSolutionPage';
import ProgressReportPage from '../pages/ProgressReportPage';
import About from '../pages/About';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} /> 
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/About" element={<About />} />

      {/* Protected Routes - require authentication */}
      <Route path="/practice" element={
        <ProtectedRoute>
          <Practice />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute>
          <ProgressReportPage />
        </ProtectedRoute>
      } />
      <Route path="/mentor" element={
        <ProtectedRoute>
          <MentorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/assignments" element={
        <ProtectedRoute>
          <Assignments />
        </ProtectedRoute>
      } />
      <Route path="/resourse" element={
        <ProtectedRoute>
          <Resourse />
        </ProtectedRoute>
      } />
      <Route path="/doubts" element={
        <ProtectedRoute>
          <Doubts />
        </ProtectedRoute>
      } />
      <Route path="/assignments/:id" element={
        <ProtectedRoute>
          <AssignmentDetails />
        </ProtectedRoute>
      } />
      <Route path="/solution/:assignmentId" element={
        <ProtectedRoute>
          <SolutionEditorPage />
        </ProtectedRoute>
      } />
      <Route path="/solutions" element={
        <ProtectedRoute>
          <SolutionReview />
        </ProtectedRoute>
      } />
      <Route path="/Student-solutions" element={
        <ProtectedRoute>
          <StudentSolutions />
        </ProtectedRoute>
      } />
      <Route path="/doubts/:id" element={
        <ProtectedRoute>
          <DoubtDetail />
        </ProtectedRoute>
      } />
      <Route path="/messages/:id" element={
        <ProtectedRoute>
          <MessageDetail />
        </ProtectedRoute>
      } />
      <Route path="/briefings/archive" element={
        <ProtectedRoute>
          <PreviousBriefings />
        </ProtectedRoute>
      } />

      {/* Add additional routes as needed */}
    </Routes>
  );
}

export default AppRoutes;
