// src/pages/StudentDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import StudentProfile from '../components/StudentProfile';
import MessageCard from '../components/MessageCard';
import StudentMessageForm from '../components/StudentMessageForm';
import VolunteerBriefing from '../components/VolunteerBriefing';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

function Dashboard() {
  const { auth } = useContext(AuthContext);
  
  // Default active section is "class" so that class questions appear by default.
  const [activeSection, setActiveSection] = useState('class');
  
  // Filter state for class questions
  const [filters, setFilters] = useState({
    difficulty: '',
    responseStatus: '',
    tags: ''
  });
  
  // New filter state for personal assignments (filter by mentor name)
  const [personalFilter, setPersonalFilter] = useState({
    mentorName: ''
  });
  
  // Data states
  const [personalAssignments, setPersonalAssignments] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  
  // Additional state to hold the sender filter for messages
  const [messageFilter, setMessageFilter] = useState('');

  // Function to toggle active section (ensures only one is open)
  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? '' : sectionName));
  };

 

  // Fetch personal assignments
  useEffect(() => {
    if (!auth) return;
    const fetchPersonalAssignments = async () => {
      try {
        const res = await api.get('/assignments/personal');
        console.log("Fetching and found this personal assignment data: ", res.data)
        setPersonalAssignments(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch personal assignments.');
      }
    };
    fetchPersonalAssignments();
  }, [auth]);

  // Fetch all messages (sent or received) when "View All Messages" section is active
  useEffect(() => {
    if (!auth || activeSection !== 'msgList') return;
    const fetchMessages = async () => {
      try {
        console.log("allForStudent is being fetched");

        const res = await api.get('/messages/allForStudent');
        setAllMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch messages.');
      }
    };
    fetchMessages();
  }, [auth, activeSection]);

  if (!auth) {
    return <p className="text-center text-gray-500">Please log in to view your dashboard.</p>;
  }

  return (
    <div className=" bg-color min-h-screen container mx-auto p-4 space-y-8">
      <StudentProfile />

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* <button
          onClick={() => toggleSection('class')}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          {activeSection === 'class' ? 'Hide Class Questions' : 'View Class Questions'}
        </button> */}
        <button
          onClick={() => toggleSection('personal')}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          {activeSection === 'personal' ? 'Hide Personal Assignments' : 'View Personal Assignments'}
        </button>
        <button
          onClick={() => toggleSection('msgList')}
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
        >
          {activeSection === 'msgList' ? 'Hide All Messages' : 'View All Messages'}
        </button>
        <button
          onClick={() => toggleSection('sendMsg')}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
        >
          {activeSection === 'sendMsg' ? 'Close Send Message' : 'Send Message'}
        </button>
        {/* Extra Toggle for Volunteer Briefing */}
        {auth.user.role === 'volunteer' && (
          <button
            onClick={() => toggleSection('briefing')}
            className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
          >
            {activeSection === 'briefing' ? 'Close Briefing Form' : 'Create/Update Briefing'}
          </button>
        )}
      </div>

      {/* Render Briefing Section for Volunteers */}
      {activeSection === 'briefing' && auth.user.role === 'volunteer' && (
        <div className="mb-6">
          <VolunteerBriefing />
        </div>
      )}

      {/* Render Class Questions Section */}
      {activeSection === 'class' && (
        <div className="mb-6">
          {/* Filter UI for Class Questions */}
          {/* <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Filter Class Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Difficulty:</label>
                <select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({ ...filters, difficulty: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">All</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Response Status:</label>
                <select
                  name="responseStatus"
                  value={filters.responseStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, responseStatus: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">All</option>
                  <option value="not attempted">Not Attempted</option>
                  <option value="having doubt">Having Doubt</option>
                  <option value="partially solved">Partially Solved</option>
                  <option value="solved">Solved</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Tags:</label>
                <input
                  type="text"
                  name="tags"
                  value={filters.tags}
                  onChange={(e) =>
                    setFilters({ ...filters, tags: e.target.value })
                  }
                  placeholder="e.g. array, string, loop"
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classQuestions.length === 0 ? (
              <p className="text-gray-500">No class questions available.</p>
            ) : (
              classQuestions.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))
            )}
          </div> */}
        </div>
      )}

      {/* Render Personal Assignments Section */}
      {activeSection === 'personal' && (
        <div className="mb-6">
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Filter Personal Assignments by Mentor</h3>
            <input
              type="text"
              placeholder="Enter mentor name"
              value={personalFilter.mentorName}
              onChange={(e) =>
                setPersonalFilter({ ...personalFilter, mentorName: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalAssignments.length === 0 ? (
              <p className="text-gray-500">No personal assignments available.</p>
            ) : (
              personalAssignments
                .filter(assignment =>
                  (assignment.assignedBy?.name || "")
                    .toLowerCase()
                    .includes((personalFilter.mentorName || "").toLowerCase())
                )
                .map((assignment) => (
                  <AssignmentCard key={assignment._id} assignment={assignment} />
                ))
            )}
          </div>
        </div>
      )}

      {/* Render Messages Section with Filter Input */}
      {activeSection === 'msgList' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Messages</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Filter by sender name"
              value={messageFilter}
              onChange={(e) => setMessageFilter(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          {allMessages.length === 0 ? (
            <p className="text-gray-500">No messages available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMessages
                .filter((msg) =>
                  msg.sender?.name
                    .toLowerCase()
                    .includes(messageFilter.toLowerCase())
                )
                .map((msg) => (
                  <MessageCard key={msg._id} message={msg} />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Render Send Message Form */}
      {activeSection === 'sendMsg' && (
        <StudentMessageForm onClose={() => toggleSection('sendMsg')} />
      )}
    </div>
  );
}

export default Dashboard;
