// src/pages/DoubtDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function DoubtDetail() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [doubt, setDoubt] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Determine role (for showing reply form to mentors/admins)
  const isMentor = auth && (auth.user.role === 'mentor' || auth.user.role === 'admin');

  useEffect(() => {
    const fetchDoubt = async () => {
      try {
        const res = await api.get(`/doubts/${id}`);
        console.log("Doubt detail me aaya hai:", res.data)
        setDoubt(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load doubt details.');
      }
    };
    fetchDoubt();
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/doubts/${id}/reply`, { reply: replyText });
      toast.success('Doubt resolved successfully!');
      setDoubt(res.data);
      setReplyText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to resolve doubt.');
    }
  };

  if (!doubt) return <p className="text-center text-gray-500">Loading doubt details...</p>;

  const createdDate = new Date(doubt.createdAt).toLocaleString();

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Doubt Details */}
      <div className="bg-white rounded shadow p-6">
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
          <strong>Doubt:</strong> {doubt.doubtText}
        </p>
        <p className="mb-2">
          <strong>Raised By:</strong> {doubt.student ? doubt.student.name : 'Unknown'} ({doubt.student ? doubt.student.email : 'N/A'})
        </p>
        <p className="mb-2 text-green-600">
          <strong>Raised At:</strong> {createdDate}
        </p>
        {doubt.reply ? (
          <div className="mt-4 p-4 bg-gray-50 border rounded">
            <p className="mb-1">
              <strong>Mentor Reply:</strong> {doubt.reply}
            </p>
            <p className="text-xs text-gray-500">
              Replied At: {new Date(doubt.resolvedAt).toLocaleString()} by {doubt.resolvedBy ? doubt.resolvedBy.name : 'N/A'}
            </p>
          </div>
        ) : (
          <p className="text-red-600 font-bold">This doubt has not been resolved yet.</p>
        )}
      </div>

      {/* Mentor Reply Form */}
      {isMentor && !doubt.resolved && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-2xl font-bold mb-4">Reply to Doubt</h3>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <textarea
              className="w-full border rounded p-2"
              placeholder="Enter your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
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
    </div>
  );
}

export default DoubtDetail;
