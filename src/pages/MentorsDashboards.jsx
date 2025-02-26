// src/pages/MentorDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Import the modular components for various sections:
import BriefingPanel from '../components/BriefingPanne';      // Briefing form component
import QuestionForm from '../components/QuestionForm';          // Question creation form
import MessageForm from '../components/MessageFrom';            // Message creation form
import StudentListSection from '../components/StudentListSection';// Component to display student list
import AdminPanel from '../components/AdminPannel';             // Admin-specific user management
import MessageListSection from '../components/MessageListSection';// Component to display all messages
import MentorProfile from '../components/MentorProfile';        // Mentor profile summary component
import AdminProfile from '../components/AdminProfile';          // Admin profile summary component
import ContactMessageCard from '../components/ContactMessageCard';// Component to display contact messages
import AssignmentCard from '../components/AssignmentCard';      // Component to display assignment cards
import AnnouncementForm from '../components/AnnouncementForm';
import GoalForm from '../components/GoalForm';

function MentorDashboard() {
  const { auth } = useContext(AuthContext);

  // Determine role flags
  const isMentor = auth.user.role === 'mentor';
  const isAdmin = auth.user.role === 'admin';

  // State for toggling different sections
  const [activeSection, setActiveSection] = useState('');
  // State to toggle the Weekly Goal modal form (for mentors)
  const [showWeeklyGoalModal, setShowWeeklyGoalModal] = useState(false);

  // Data fetched from backend
  const [students, setStudents] = useState([]);
  const [personalMessages, setPersonalMessages] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]); // For contact messages (admin)
  const [personalAssigned, setPersonalAssigned] = useState([]); // For mentor's personal assignments

  // --- Data Fetching ---

  // Fetch students for student list & message recipients
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/users/students');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  // Fetch personal messages for the logged-in user
  useEffect(() => {
    if (!auth) return;
    const fetchPersonalMessages = async () => {
      try {
        const res = await api.get('/messages/personal');
        setPersonalMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPersonalMessages();
  }, [auth]);

  // Fetch all users for Admin Panel (only if admin)
  useEffect(() => {
    if (!auth || !isAdmin) return;
    const fetchAllUsers = async () => {
      try {
        const res = await api.get('/users');
        setAdminUsers(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch users.');
      }
    };
    fetchAllUsers();
  }, [auth, isAdmin]);

  // Fetch messages for Message List when active section is 'msgList'
  useEffect(() => {
    if (!auth || activeSection !== 'msgList') return;
    const fetchMessages = async () => {
      try {
        let params = {};
        if (auth.user.role === 'mentor') {
          params.sender = auth.user.id;
        }
        const res = await api.get('/messages/allForMentor', { params });
        setAllMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch messages.');
      }
    };
    fetchMessages();
  }, [auth, activeSection]);

  // Fetch contact messages when active section is 'contactMsg' (admin only)
  useEffect(() => {
    if (!auth || activeSection !== 'contactMsg') return;
    const fetchContactMessages = async () => {
      try {
        const res = await api.get('/contact'); // Public endpoint for contact messages
        setContactMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch contact messages.');
      }
    };
    fetchContactMessages();
  }, [auth, activeSection]);

  // Fetch personal assignments assigned by mentor (for mentors/admins)
  useEffect(() => {
    if (!auth || activeSection !== 'personalAssign') return;
    const fetchPersonalAssigned = async () => {
      try {
        const res = await api.get('/assignments/personalAssigned');
        setPersonalAssigned(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch personal assignments.');
      }
    };
    fetchPersonalAssigned();
  }, [auth, activeSection]);

  // --- Toggle Function ---
  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? '' : sectionName));
  };

  // Dummy functions for user management (update, delete, disable)
  const handleUpdateUser = (user) => {
    toast.info(`Update user: ${user.name}`);
  };
  const handleDeleteUser = (userId) => {
    toast.info(`Delete user id: ${userId}`);
  };
  const handleDisableUser = (userId, hours) => {
    toast.info(`Disable user ${userId} for ${hours} hours`);
  };

  return (
    <div className="container bg-color min-h-screen mx-auto p-4 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? 'Admin Dashboard' : 'Mentor Dashboard'}
      </h1>

      {/* Profile Section */}
      {isAdmin ? <AdminProfile /> : <MentorProfile />}

      {/* Toggle Buttons for Other Sections */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => toggleSection('briefing')}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          {activeSection === 'briefing'
            ? 'Close Briefing Form'
            : 'Create/Update Briefing'}
        </button>
        {(auth.user.role === 'mentor' || auth.user.role === 'admin') && (
          <button
            onClick={() => toggleSection('announcement')}
            className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
          >
            {activeSection === 'announcement'
              ? 'Close Announcement Form'
              : 'Create Announcement'}
          </button>
        )}
        <button
          onClick={() => toggleSection('question')}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          {activeSection === 'question'
            ? 'Close Question Form'
            : 'Create Question'}
        </button>
        <button
          onClick={() => toggleSection('message')}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
        >
          {activeSection === 'message'
            ? 'Close Message Form'
            : 'Create Message'}
        </button>
        {(auth.user.role === 'mentor' || auth.user.role === 'admin') && (
          <button
            onClick={() => toggleSection('students')}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            {activeSection === 'students'
              ? 'Hide Student List'
              : 'View All Students'}
          </button>
        )}
        {(auth.user.role === 'mentor' || auth.user.role === 'admin') && (
          <button
            onClick={() => toggleSection('msgList')}
            className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
          >
            {activeSection === 'msgList'
              ? 'Hide All Messages'
              : 'View All Messages'}
          </button>
        )}
        {(auth.user.role === 'mentor' || auth.user.role === 'admin') && (
          <button
            onClick={() => toggleSection('personalAssign')}
            className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
          >
            {activeSection === 'personalAssign'
              ? 'Hide Personal Assignments'
              : 'View Personal Assignments'}
          </button>
        )}
        {auth.user.role === 'admin' && (
          <>
            <button
              onClick={() => toggleSection('admin')}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              {activeSection === 'admin'
                ? 'Hide Admin Panel'
                : 'Admin Panel'}
            </button>
            <button
              onClick={() => toggleSection('contactMsg')}
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              {activeSection === 'contactMsg'
                ? 'Hide Contact Messages'
                : 'Contact Messages'}
            </button>
          </>
        )}
      </div>

      {/* Render Sections Based on Active Toggle */}
      {activeSection === 'briefing' && <BriefingPanel />}
      {activeSection === 'question' && <QuestionForm />}
      {activeSection === 'message' && <MessageForm />}
      {activeSection === 'students' && (
        <StudentListSection 
          students={students}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}
      {activeSection === 'announcement' && (
        <AnnouncementForm onSuccess={() => toggleSection('announcement')} />
      )}
      {activeSection === 'msgList' && (
        <MessageListSection 
          messages={allMessages}
          onUpdate={(msg) => toast.info(`Update message: ${msg.subject}`)}
        />
      )}
      {activeSection === 'personalAssign' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Personal Assignments You Assigned
          </h2>
          {personalAssigned.length === 0 ? (
            <p>No personal assignments assigned.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalAssigned.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          )}
        </div>
      )}
      {activeSection === 'admin' && isAdmin && (
        <AdminPanel 
          adminUsers={adminUsers}
          onDisable={handleDisableUser}
          onDelete={handleDeleteUser}
        />
      )}
      {activeSection === 'contactMsg' && isAdmin && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
          {contactMessages.length === 0 ? (
            <p className="text-gray-500">
              No contact messages available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactMessages.map((msg) => (
                <ContactMessageCard key={msg._id} message={msg} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom: Button to open Weekly Goal Form for mentors */}
      {isMentor && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowWeeklyGoalModal((prev) => !prev)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            {showWeeklyGoalModal
              ? 'Close Weekly Goal Form'
              : 'Create/Edit Weekly Goal'}
          </button>
        </div>
      )}
      {showWeeklyGoalModal && (
        <GoalForm onClose={() => setShowWeeklyGoalModal(false)} />
      )}
    </div>
  );
}

export default MentorDashboard;
