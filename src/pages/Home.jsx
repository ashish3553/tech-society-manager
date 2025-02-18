// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import MessageCard from '../components/MessageCard';
import AssignmentCard from '../components/AssignmentCard';
import BriefingCard from '../components/BriefingCard';
import AnnouncementCard from '../components/AnnouncementCard';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { auth } = useContext(AuthContext);
  const [briefings, setBriefings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [homeworkAssignments, setHomeworkAssignments] = useState([]);
  const [refresh, setRefresh] = useState(false);


  // For editing a briefing
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch Briefings
  const fetchBriefings = async () => {
    try {
      const res = await api.get('/dailyBriefing/recent');
      setBriefings(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch recent briefings.');
    }
  };

  useEffect(() => {
    fetchBriefings();
  }, []);

  // Fetch Mentor Messages
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

  // Fetch Homework/Classwork Assignments
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

  // Fetch Announcements (max 2)
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/messages/announcement');
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load announcements.');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [refresh]);

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
      setRefresh(prev => !prev); 
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
      setRefresh(prev => !prev); 
      toast.success('Briefing deleted successfully!');
      fetchBriefings();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete briefing.');
    }
  };

  // Handlers for editing/deleting announcements (for mentor/admin users)
  const handleEditAnnouncement = async (updatedAnnouncement) => {
    try {
      await api.put(`/messages/announcement/${updatedAnnouncement._id}`, updatedAnnouncement);
      toast.success('Announcement edited successfully!');
      setRefresh(prev => !prev);  // Toggle refresh to trigger re-fetch
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit announcement.');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      console.log("Delete pressed")
      await api.delete(`/messages/announcement/${announcementId}`);
      toast.success('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete announcement.');
    }
  };

  return (
    <div className=" bg-color container mx-auto p-4 sm:p-12 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Code India</h1>
      
      {/* Announcements Section */}
      <h2 className="text-2xl font-bold mb-2">Recent Announcements</h2>

      {announcements.length > 0 && (
        <section className=" p-4 rounded shadow overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onEdit={handleEditAnnouncement}
                onDelete={handleDeleteAnnouncement}
                isEditable={
                  auth.user &&
                  (auth.user.role === 'mentor' || auth.user.role === 'admin')
                }
              />
            ))}
          </div>
        </section>
      )}
      
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
                  onChange={(e) =>
                    setSelectedBriefing({
                      ...selectedBriefing,
                      classSummary: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Class Questions:</label>
                <textarea
                  className="w-full border rounded p-2"
                  value={selectedBriefing.classQuestions}
                  onChange={(e) =>
                    setSelectedBriefing({
                      ...selectedBriefing,
                      classQuestions: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Homework Questions:</label>
                <textarea
                  className="w-full border rounded p-2"
                  value={selectedBriefing.homeworkQuestions}
                  onChange={(e) =>
                    setSelectedBriefing({
                      ...selectedBriefing,
                      homeworkQuestions: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBriefing(null);
                  }}
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

      {/* Homework/Classwork Assignments Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Today's Homework & Classwork</h2>
        {homeworkAssignments.length === 0 ? (
          <p className="text-gray-500">No HW/CW assignments available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {messages.map((msg) => (
              <MessageCard key={msg._id} isHome={true} message={msg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
