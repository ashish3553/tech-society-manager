// src/pages/DoubtDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function DoubtDetail() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  
  // Local state for the doubt details and conversation
  const [doubt, setDoubt] = useState(null);
  // For mentor reply
  const [mentorReply, setMentorReply] = useState('');
  // For student follow-up (ask again)
  const [followupText, setFollowupText] = useState('');
  // To toggle display of the follow-up input form
  const [showFollowupForm, setShowFollowupForm] = useState(false);

  // Determine roles
  const isMentor = auth && (auth.user.role === 'mentor' || auth.user.role === 'admin');
  const isStudent = auth && (auth.user.role === 'student' || auth.user.role === 'volunteer')

  // Fetch doubt details
  useEffect(() => {
    const fetchDoubt = async () => {
      try {
        const res = await api.get(`/doubts/${id}`);
        console.log("Doubt data is: ",res.data);
        setDoubt(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load doubt details.');
      }
    };
    fetchDoubt();
  }, [id]);

  // Handler for mentor reply submission
  const handleMentorReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/doubts/${id}/reply`, { reply: mentorReply });
      toast.success('Doubt replied successfully!');
      setDoubt(res.data);
      setMentorReply('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send reply.');
    }
  };

  // Handler for student follow-up (ask again)
  const handleFollowupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/doubts/${id}/followup`, { followup: followupText });
      toast.success('Follow-up sent successfully!');
      setDoubt(res.data);
      setFollowupText('');
      setShowFollowupForm(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to send follow-up.');
    }
  };

  // Handler for student resolving the doubt
  const handleResolve = async () => {
    try {
      const res = await api.put(`/doubts/${id}/resolve`);
      toast.success('Doubt marked as resolved!');
      setDoubt(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark doubt as resolved.');
    }
  };

  if (!doubt) return <p className="text-center text-gray-500">Loading doubt details...</p>;

  // Format dates in Indian locale
  const createdDate = new Date(doubt.createdAt).toLocaleString('en-IN');
  const resolvedDate = doubt.resolvedAt ? new Date(doubt.resolvedAt).toLocaleString('en-IN') : '';

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Doubt Details Section */}
      <div className=" rounded shadow p-6">
        <h2 className="text-3xl font-bold mb-4">Doubt Details</h2>
        <p className="mb-2">
          <strong>Assignment:</strong> {doubt.assignment ? doubt.assignment.title : 'N/A'}
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {doubt.assignment ? doubt.assignment.assignmentTag : 'N/A'}
        </p>
        <p className="mb-2">
          <strong>Question Level:</strong> {doubt.assignment ? doubt.assignment.difficulty : 'N/A'}
        </p>
        <p className="mb-2">
          <strong>Your Doubt:</strong> {doubt.conversation[0] ? doubt.conversation[0].message : 'N/A'}
        </p>
        <p className="mb-2">
          <strong>Raised By:</strong> {doubt.student ? doubt.student.name : 'Unknown'} ({doubt.student ? doubt.student.email : 'N/A'})
        </p>
        <p className="mb-2 text-green-600">
          <strong>Raised At:</strong> {createdDate}
        </p>
      </div>

      {/* Conversation Thread */}
      <div className=" rounded shadow p-6">
        <h3 className="text-2xl font-bold mb-4">Conversation Thread</h3>
        <div className="space-y-3">
          {doubt.conversation.map((entry, index) => (
            <div key={index} className="p-3 border rounded">
              <p className="text-sm font-medium">
                {entry.type === 'reply' || entry.type === 'resolve'
                  ? 'Mentor'
                  : (entry.type === 'follow-up' ? 'You (Follow-up)' : 'Student')}
                :
              </p>
              <div key={index} className=" relative">
    <p className="text-base">{entry.message}</p>
    { (entry.type === 'reply' || entry.type === 'resolve') && entry.sender && (
      <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
        <span>Replied by: {entry.sender.name} ({entry.sender.role})</span>
        <span>{new Date(entry.timestamp).toLocaleString('en-IN')}</span>
      </div>
    )}
    {entry.type === 'doubt' && (
      <div className="mt-1 text-xs text-gray-500">
        {new Date(entry.timestamp).toLocaleString('en-IN')}
      </div>
    )}
  </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Reply Form */}
      {isMentor && !doubt.resolved && (
        <div className=" rounded shadow p-6">
          <h3 className="text-2xl font-bold mb-4">Reply to Doubt</h3>
          <form onSubmit={handleMentorReplySubmit} className="space-y-4">
            <textarea
              className="w-full border rounded p-2"
              placeholder="Enter your reply here..."
              value={mentorReply}
              onChange={(e) => setMentorReply(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Submit Reply
            </button>
          </form>
        </div>
      )}

      {/* Student Action Section (for unresolved doubts) */}
      {isStudent && !doubt.resolved && (
        <div className="bg-white rounded shadow p-6 space-y-4">
          <h3 className="text-2xl font-bold">Your Action</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleResolve}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Mark as Resolved
            </button>
            <button
              onClick={() => setShowFollowupForm(!showFollowupForm)}
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              {showFollowupForm ? 'Cancel Follow-up' : 'Ask Again'}
            </button>
          </div>
          {showFollowupForm && (
            <form onSubmit={handleFollowupSubmit} className="mt-4 space-y-4">
              <textarea
                className="w-full border rounded p-2"
                placeholder="Enter your follow-up message..."
                value={followupText}
                onChange={(e) => setFollowupText(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Submit Follow-up
              </button>
            </form>
          )}
        </div>
      )}

      {/* If the doubt is resolved, display a resolved message */}
      {isStudent && doubt.resolved && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-2xl font-bold text-green-600">This doubt has been resolved.</h3>
          <p className="text-sm text-gray-500">Resolved at: {resolvedDate}</p>
        </div>
      )}
    </div>
  );
}

export default DoubtDetail;
