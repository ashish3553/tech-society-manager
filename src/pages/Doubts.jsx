// src/pages/Doubts.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DoubtCard from '../components/DoubCard';
import { toast } from 'react-toastify';

function Doubts() {
  const { auth } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  
  // Filter state variables.
  const [assignmentTag, setAssignmentTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [resolved, setResolved] = useState('');

  // Function to fetch filtered doubts.
  const fetchFilteredDoubts = async () => {
    try {
      const res = await api.get('/doubts/filter-doubts', {
        params: {
          assignmentTag: assignmentTag,  // your state variable for assignmentTag
          difficulty: difficulty,        // your state variable for difficulty
          assignmentTitle: assignmentTitle,  // your state variable for assignmentTitle
          resolved: resolved             // your state variable for resolved status ("true" or "false")
        }
      });
      setDoubts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch filtered doubts.');
    }
  };
  

  // For mentors/admins we use the filter endpoint; for students, you may wish to use the simpler GET route
  useEffect(() => {
    if (auth) {
      // For mentors and admins, we always call the filter endpoint.
      if (auth.user.role === 'mentor' || auth.user.role === 'admin') {
        fetchFilteredDoubts();
      } else if (auth.user.role === 'student') {
        // For students, fetch only their doubts.
        const fetchMyDoubts = async () => {
          try {
            const res = await api.get('/doubts');
            setDoubts(res.data);
          } catch (err) {
            console.error(err);
            toast.error('Failed to fetch doubts.');
          }
        };
        fetchMyDoubts();
      }
    }
    // We want to re-run filtering when filter values change for mentors/admins.
  }, [auth, assignmentTag, difficulty, assignmentTitle, resolved]);

  // Handler for form submission.
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredDoubts();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Doubts</h1>
      
      {/* Filter Form for Mentors/Admins */}
      {(auth && (auth.user.role === 'mentor' || auth.user.role === 'admin')) && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Filter Doubts</h2>
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Assignment Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Tag</label>
              <select
                value={assignmentTag}
                onChange={(e) => setAssignmentTag(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">All</option>
                <option value="HW">HW</option>
                <option value="CW">CW</option>
                <option value="practice">Practice</option>
              </select>
            </div>
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {/* Assignment Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="e.g., array, loop, oops"
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            {/* Resolved Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resolved Status</label>
              <select
                value={resolved}
                onChange={(e) => setResolved(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">All</option>
                <option value="true">Resolved</option>
                <option value="false">Unresolved</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}

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
