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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/register" element={<Registration />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mentor" element={<MentorDashboard />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/doubts" element={<Doubts/>} />
      <Route path="/assignments/:id" element={<AssignmentDetails />} />
      <Route path="/doubts" element={<Doubts />} />
      <Route path="/doubts/:id" element={<DoubtDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/briefings/archive" element={<PreviousBriefings />} />


      {/* Add additional routes as needed */}
    </Routes>
  );
}

export default AppRoutes;
