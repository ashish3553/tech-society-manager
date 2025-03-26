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

// Add this utility function before the Home component
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

function Home() {
  const { auth } = useContext(AuthContext);
  const [briefings, setBriefings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [homeworkAssignments, setHomeworkAssignments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading,setLoading]=useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const briefingsPerPage = 8;

  // Calculate pagination values
  const indexOfLastBriefing = currentPage * briefingsPerPage;
  const indexOfFirstBriefing = indexOfLastBriefing - briefingsPerPage;
  const currentBriefings = briefings.slice(indexOfFirstBriefing, indexOfLastBriefing);
  const totalPages = Math.ceil(briefings.length / briefingsPerPage);

  // Add pagination handlers
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // For editing a briefing
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Add these new state variables after the existing ones
  const [showModal, setShowModal] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [editedLinks, setEditedLinks] = useState('');
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState({});

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
   useEffect(() => {
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
    fetchAnnouncements();
  }, [refresh]);

  // Handlers for editing a briefing
  const handleEditBriefing = (briefing) => {
    setSelectedBriefing(briefing);
    setShowEditModal(true);
  };

  const handleUpdateBriefing = async (updatedBriefing) => {
    try {
      setLoading(true)
      await api.put(`/dailyBriefing/${updatedBriefing._id}`, updatedBriefing);
      toast.success('Briefing updated successfully!');
      setLoading(false)
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
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit announcement.');
    }
  };

  const cancelModal = () => {
    setShowModal(false);
    setEditingAnnouncementId(null);
    setEditedSubject('');
    setEditedBody('');
    setEditedLinks('');
  };

  const confirmEdit = async () => {
    try {
      const updatedAnnouncement = {
        _id: editingAnnouncementId,
        subject: editedSubject,
        body: editedBody,
        links: editedLinks.split(',').map(link => link.trim()).filter(Boolean)
      };
      await api.put(`/messages/announcement/${editingAnnouncementId}`, updatedAnnouncement);
      toast.success('Announcement edited successfully!');
      setShowModal(false);
      fetchAnnouncements();
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

  const toggleMessage = (id) => {
    setExpandedMessages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <div className="bg-color mx-auto w-full">
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
            <div className="overflow-x-auto mx-6 pb-10">
              <table className="min-w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Link</th>
                    {(auth?.user?.role === 'mentor' || auth?.user?.role === 'admin') && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {announcements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement._id}
                      announcement={announcement}
                      onEdit={handleEditAnnouncement}
                      onDelete={handleDeleteAnnouncement}
                      isEditable={auth?.user?.role === 'mentor' || auth?.user?.role === 'admin'}
                      expandedMessages={expandedMessages}
                      toggleMessage={toggleMessage}
                    />
                  ))}
                </tbody>
              </table>
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mx-20 gap-6">
                    {currentBriefings.map((briefing) => (
                      <BriefingCard
                        key={briefing._id}
                        briefing={briefing}
                        onEdit={handleUpdateBriefing}
                        onDelete={() => handleDeleteBriefing(briefing._id)}
                        loading={loading}
                      />
                    ))}
                  </div>
                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center gap-4 mt-6 mb-8">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded ${
                        currentPage === 1
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-invertase-blue hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      Previous
                    </button>
                    <span className="text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded ${
                        currentPage === totalPages
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-invertase-blue hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      Next
                    </button>
                  </div>
                </>
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
      </div>  
    </>
  );
}

export default Home;
