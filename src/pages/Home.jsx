// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import MessageCard from '../components/MessageCard';
import AssignmentCard from '../components/AssignmentCard';
import BriefingCard from '../components/BriefingCard';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { auth } = useContext(AuthContext);
  const [briefings, setBriefings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [homeworkAssignments, setHomeworkAssignments] = useState([]);
  
  // For editing a briefing
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Function to fetch briefings so we can refresh the list after edit/delete
  const fetchBriefings = async () => {
    try {
      const res = await api.get('/dailyBriefing/recent');
      setBriefings(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch recent briefings.');
    }
  };

  // Initial fetch for briefings
  useEffect(() => {
    fetchBriefings();
  }, []);

  // Fetch recent mentor messages
  useEffect(() => {
    const fetchRecentMentorMessages = async () => {
      try {
        const res = await api.get('/messages/recent-mentor');
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch recent mentor messages.');
      }
    };
    fetchRecentMentorMessages();
  }, []);

  // Fetch HW/CW assignments for Home page (posted in last 48 hrs)
  useEffect(() => {
    const fetchHomeworkAssignments = async () => {
      try {
        const res = await api.get('/assignments/home');
        setHomeworkAssignments(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch homework assignments.');
      }
    };
    fetchHomeworkAssignments();
  }, []);

  const getDisplayDate = (item) => {
    if (!item) return '';
    const createdDate = new Date(item.createdAt);
    const updatedDate = item.updatedAt ? new Date(item.updatedAt) : null;
    const displayDate = updatedDate && updatedDate > createdDate ? updatedDate : createdDate;
    return displayDate.toLocaleString('en-IN');
  };

  // Handlers for editing a briefing
  const handleEditBriefing = (briefing) => {
    setSelectedBriefing(briefing);
    setShowEditModal(true);
  };

  const handleUpdateBriefing = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/dailyBriefing/${selectedBriefing._id}`, selectedBriefing);
      toast.success('Briefing updated successfully!');
      setShowEditModal(false);
      setSelectedBriefing(null);
      fetchBriefings();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update briefing.');
    }
  };

  // Handler for deleting a briefing
  const handleDeleteBriefing = async (briefingId) => {
    
    try {
      await api.delete(`/dailyBriefing/${briefingId}`);
      toast.success('Briefing deleted successfully!');
      fetchBriefings();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete briefing.');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Coding Journey</h1>

      {/* Recent Class Briefings Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Class Briefings</h2>
        {briefings.length === 0 ? (
          <p className="text-gray-500">No briefings available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {briefings.map((briefing) => (
              <BriefingCard 
                key={briefing._id} 
                briefing={briefing}
                onEdit={() => handleEditBriefing(briefing)}
                onDelete={() => handleDeleteBriefing(briefing._id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Edit Briefing Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Briefing</h2>
            <form onSubmit={handleUpdateBriefing} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Class Summary:</label>
                <textarea 
                  className="w-full border rounded p-2" 
                  value={selectedBriefing.classSummary}
                  onChange={(e) => setSelectedBriefing({ ...selectedBriefing, classSummary: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Class Questions:</label>
                <textarea 
                  className="w-full border rounded p-2" 
                  value={selectedBriefing.classQuestions}
                  onChange={(e) => setSelectedBriefing({ ...selectedBriefing, classQuestions: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Homework Questions:</label>
                <textarea 
                  className="w-full border rounded p-2" 
                  value={selectedBriefing.homeworkQuestions}
                  onChange={(e) => setSelectedBriefing({ ...selectedBriefing, homeworkQuestions: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => { setShowEditModal(false); setSelectedBriefing(null); }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework/Class Work Assignments Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Today's Homework & Classwork</h2>
        {homeworkAssignments.length === 0 ? (
          <p className="text-gray-500">No HW/CW assignments available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeworkAssignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Mentor Messages Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Mentor Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No mentor messages available.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageCard key={msg._id} message={msg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
