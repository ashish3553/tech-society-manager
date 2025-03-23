// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import MessageCard from '../components/MessageCard';
import AssignmentCard from '../components/AssignmentCard';
import BriefingCard from '../components/BriefingCard';
import AnnouncementCard from '../components/AnnouncementCard';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { HashLoader } from "react-spinners";
import { motion, AnimatePresence } from 'framer-motion';
import HeroSectionCard from '../components/HeroSectionCard';


function Home() {
  const { auth } = useContext(AuthContext);
  const [briefings, setBriefings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [homeworkAssignments, setHomeworkAssignments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading,setLoading]=useState(false)


  // For editing a briefing
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch Briefings
  const fetchBriefings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/dailyBriefing/recent');
      setLoading(false)
      setBriefings(res.data);
    } catch (err) {
      setLoading(false)
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
        setLoading(true)
        const res = await api.get('/messages/recent-mentor');
        setLoading(false)
        setMessages(res.data);
      } catch (err) {
        setLoading(false)
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
        setLoading(true)
        const res = await api.get('/assignments/home');
      
        setHomeworkAssignments(res.data);
      } catch (err) {
        setLoading(false)
        console.error(err);
        toast.error('Failed to fetch homework assignments.');
      }
    };
    fetchHomeworkAssignments();
  }, []);

  // Fetch Announcements (max 2)
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await api.get('/messages/announcement');
      setLoading(false)
      setAnnouncements(res.data);
    } catch (err) {
      setLoading(false)
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
      setLoading(true)
      await api.put(`/dailyBriefing/${selectedBriefing._id}`, selectedBriefing);
      toast.success('Briefing updated successfully!');
      setLoading(false)
      setRefresh(prev => !prev); 
      setShowEditModal(false);
      setSelectedBriefing(null);
      fetchBriefings();
    } catch (error) {
      setLoading(false)
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
    <>
    <div className="bg-color mx-auto  w-full">
      {/* Hero */}
      <AnimatePresence>
        <section className="relative overflow-hidden bg-gradient-to-b from-dark via-dark-lighter to-dark pt-10 flex items-center">
          {/* Decorative elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-invertase-purple/10 blur-3xl"></div>
            <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-invertase-blue/10 blur-3xl"></div>
          </motion.div>

          <div className="mx-auto px-6 relative z-10">
            <div className="max-w-4xl text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-invertase-blue via-invertase-purple to-invertase-pink"
              >
                Welcome to the Future of Coding Education Code India
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-dark-text-secondary mb-8 max-w-2xl mx-auto"
              >
                Join our community of passionate learners and expert mentors. 
                Master coding through hands-on practice and real-world projects.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center gap-4"
              >
                <button className="px-8 py-3 rounded-lg bg-invertase-gradient text-white font-medium hover:shadow-lg hover:shadow-invertase-purple/20 transition-all duration-300 transform hover:-translate-y-0.5">
                  Get Started
                </button>
                <button className="px-8 py-3 rounded-lg border border-dark-border text-dark-text-primary font-medium hover:bg-dark-lighter transition-all duration-300">
                  Learn More
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-12"
              >
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-invertase-purple">500+</div>
                    <div className="text-sm text-dark-text-secondary">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-invertase-blue">50+</div>
                    <div className="text-sm text-dark-text-secondary">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-invertase-pink">100%</div>
                    <div className="text-sm text-dark-text-secondary">Success Rate</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatePresence>

      <h1 className="welcome-title ">
        <HeroSectionCard/>
      </h1>
      {/* <HeroSectionCard/> */}
      
      {/* Announcements Section */}
      <section id="announcements-section" className="announcement-section hidden">
        <h2 className="section-title">Recent Announcements</h2>
        {loading && <HashLoader className="mx-auto" size={35} color="red" />}
        {!loading && announcements.length > 0 && (
          <div className="home-section">
            <div className="grid sm:grid-cols-2 mx-20 gap-6">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id}
                  announcement={announcement}
                  onEdit={handleEditAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                  isEditable={auth?.user?.role === 'mentor' || auth?.user?.role === 'admin'}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      
      {/* Recent Class Briefings Section */}
      <section id="briefings-section" className="briefing-section hidden">
        <h2 className="section-title">Recent Class Briefings</h2>
        {loading && <HashLoader className="mx-auto" size={35} color="red" />}
        {!loading && (
          <div className="home-section col-span-2 row-span-2">
            {briefings.length === 0 ? (
              <p className="text-gray-500 text-center">No briefings available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 mx-20 gap-6">
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
          </div>
        )}
      </section>

      {/* Homework/Classwork Assignments Section */}
      <section id="assignments-section" className="assignment-section hidden">
        <h2 className="section-title">Today's Homework & Classwork</h2>
        <div className="home-section">
          {homeworkAssignments.length === 0 ? (
            <p className="text-gray-500 text-center">No HW/CW assignments available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-20 gap-6">
              {homeworkAssignments.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Mentor Messages Section */}
      <section id="messages-section" className="messages-section hidden">
        <h2 className="section-title">Recent Mentor Messages</h2>
        <div className="home-section">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No mentor messages available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 mx-20 gap-6">
              {messages.map((msg) => (
                <MessageCard key={msg._id} isHome={true} message={msg} />
              ))}
            </div>
          )}
        </div>
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
                  {loading &&    <HashLoader className="text-center px-4 py-2" size={35} color="white" />}
                  {!loading &&  "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>  
    </>
    );

}

export default Home;
