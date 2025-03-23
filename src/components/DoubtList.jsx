// src/components/DoubtList.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function DoubtList() {
  const { auth } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);

  useEffect(() => {
    // Only mentors/admins can fetch all doubts.
    const fetchDoubts = async () => {
      try {
        const res = await api.get('/doubts');
        setDoubts(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch doubts.');
      }
    };
    if (auth && (auth.user.role === 'mentor' || auth.user.role === 'admin')) {
      fetchDoubts();
    }
  }, [auth]);

  const handleReplySubmit = async (doubtId) => {
    try {
      const res = await api.put(`/doubts/${doubtId}/reply`, { reply: replyText });
      toast.success('Doubt resolved successfully!');
      // Refresh the doubts list
      const updatedDoubts = doubts.map((doubt) => (doubt._id === doubtId ? res.data : doubt));
      setDoubts(updatedDoubts);
      setReplyText('');
      setSelectedDoubtId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to resolve doubt.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Doubts</h2>
      {doubts.length === 0 ? (
        <p className="text-gray-500">No doubts available.</p>
      ) : (
        doubts.map((doubt) => (
          <div key={doubt._id} className=" rounded shadow p-4">
            <p className="mb-2">
              <strong>Assignment:</strong> {doubt.assignment?.title || 'N/A'}
            </p>
            <p className="mb-2">
              <strong>Student:</strong> {doubt.student?.name || 'Unknown'} ({doubt.student?.email || 'N/A'})
            </p>
            <p className="mb-2">
              <strong>Doubt:</strong> {doubt.doubtText}
            </p>
            {doubt.resolved ? (
              <p className="text-green-600 font-bold">Resolved</p>
            ) : (
              <p className="text-red-600 font-bold">Unresolved</p>
            )}
            {selectedDoubtId === doubt._id ? (
              <div className="mt-2">
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={() => handleReplySubmit(doubt._id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Submit Reply
                </button>
              </div>
            ) : (
              !doubt.resolved && (
                <button
                  onClick={() => setSelectedDoubtId(doubt._id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Reply
                </button>
              )
            )}
            {doubt.reply && (
              <div className="mt-2 p-2 border rounded bg-gray-50">
                <p>
                  <strong>Reply:</strong> {doubt.reply}
                </p>
                <p className="text-xs text-gray-500">
                  Resolved At: {new Date(doubt.resolvedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DoubtList;
