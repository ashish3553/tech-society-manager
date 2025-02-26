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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/register" element={<Registration />} /> 
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />



      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/progress" element={<ProgressReportPage />} />
      <Route path="/mentor" element={<MentorDashboard />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/resourse" element={<Resourse />} />
      <Route path="/doubts" element={<Doubts/>} />
      <Route path="/assignments/:id" element={<AssignmentDetails />} />
      <Route path="/solution/:assignmentId" element={<SolutionEditorPage />} />
      <Route path="/solutions" element={<SolutionReview />} />
      <Route path="/Student-solutions" element={<StudentSolutions/>} />


      <Route path="/doubts" element={<Doubts />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/doubts/:id" element={<DoubtDetail />} />
      <Route path="/messages/:id" element={<MessageDetail />} />

      <Route path="/briefings/archive" element={<PreviousBriefings />} />


      {/* Add additional routes as needed */}
    </Routes>
  );
}

export default AppRoutes;
