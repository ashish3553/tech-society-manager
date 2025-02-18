// src/pages/Practice.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Practice() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);

  // Set default assignmentTag filter to 'all' so that both common & personal assignments are returned.
  const [filters, setFilters] = useState({
    assignmentTag: 'all', // Changed default to "all" so the backend returns all assignments.
    difficulty: '',
    tags: '',
    responseStatus: ''
  });

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    } else {
      fetchAssignments();
    }
  }, [auth, filters, navigate]);

  const fetchAssignments = async () => {
    try {
      // Always pass the filters, which now include assignmentTag.
      const params = {
        ...filters
      };
      console.log("Fetching practice assignments with params:", params);
      const res = await api.get('/assignments/practice', { params });
      console.log("Received practice assignments:", res.data);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch practice assignments.');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-color min-h-screen container mx-auto p-4 space-y-8">
      {/* <h1 className="text-3xl font-bold mb-3 text-center">Practice Questions</h1> */}
      
      {/* Filter Form */}
      <div className="bg-white p-6 rounded shadow mb-3">
        <h2 className="text-xl font-bold mb-4">Filter Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Assignment Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Tag:</label>
            <select
              name="assignmentTag"
              value={filters.assignmentTag}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="all">All</option>
              <option value="practice">Practice</option>
              <option value="hw">HW</option>
              <option value="cw">CW</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty:</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags:</label>
            <input
              type="text"
              name="tags"
              value={filters.tags}
              onChange={handleFilterChange}
              placeholder="e.g. array, function, string"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Response Status:</label>
            <select
              name="responseStatus"
              value={filters.responseStatus}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">All</option>
              <option value="solved">Solved</option>
              <option value="partially solved">Partially Solved</option>
              <option value="not understanding">Not Understanding</option>
              <option value="having doubt">Having Doubt</option>
            </select>
          </div>
        </div>
        {/* <div className="mt-4">
          <button
            onClick={fetchAssignments}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div> */}
      </div>

      {/* Practice Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <p className="text-gray-500 text-center">No practice questions available.</p>
        ) : (
          assignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))
        )}
      </div>
    </div>
  );
}

export default Practice;
