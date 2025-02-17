// src/pages/Doubts.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DoubtCard from '../components/DoubCard';
import { toast } from 'react-toastify';

function Doubts() {
  const { auth } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  
  // Filter state variables
  const [assignmentTag, setAssignmentTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [resolved, setResolved] = useState('');
  const [status, setStatus] = useState('');
  const [timeframe, setTimeframe] = useState(''); // "today", "yesterday", or empty

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Function to fetch filtered doubts from backend
  const fetchFilteredDoubts = async () => {
    try {
      const params = {
        assignmentTag,
        difficulty,
        assignmentTitle,
        resolved,
        status,
        timeframe,
        page,
        limit
      };
      const res = await api.get('/doubts/filter-doubts', { params });
      setDoubts(res.data.doubts);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch filtered doubts.');
    }
  };

  // Always call fetchFilteredDoubts for all authenticated users
  useEffect(() => {
    if (!auth) return;
    fetchFilteredDoubts();
  }, [auth, assignmentTag, difficulty, assignmentTitle, resolved, status, timeframe, page, limit]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredDoubts();
  };

  // Pagination control handlers
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  if (!auth) {
    return <p className="text-center text-gray-500">Please log in to view doubts.</p>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Doubts</h1>
      
      {/* Filter Form for All Authenticated Users */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Doubts</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Assignment Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Assignment Tag</label>
            <select
              value={assignmentTag}
              onChange={(e) => setAssignmentTag(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All</option>
              <option value="HW">HW</option>
              <option value="CW">CW</option>
              <option value="practice">Practice</option>
            </select>
          </div>
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Current Status */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Current Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="unsatisfied">Unsatisfied</option>
              <option value="review">Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          {/* Timeframe */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
            </select>
          </div>
        </form>
        
        {/* Pagination Controls placed below the filter section */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={handlePrevPage} disabled={page === 1}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors">
            Previous
          </button>
          <div className="flex items-center gap-4">
            <span>
              Page: 
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                className="w-16 border rounded p-1 text-center mx-2"
                min="1"
              />
            </span>
            <span>
              Cards per page: 
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                className="w-16 border rounded p-1 text-center mx-2"
                min="1"
              />
            </span>
            <span>
              Total Pages: {Math.ceil(total / limit)}
            </span>
          </div>
          <button onClick={handleNextPage} disabled={page * limit >= total}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Doubt Cards */}
      {doubts.length === 0 ? (
        <p className="text-gray-500">No doubts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doubts.map((doubt) => (
            <DoubtCard key={doubt._id} doubt={doubt} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Doubts;
