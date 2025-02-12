// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const { auth } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);

  // Fetch students (all users with role 'student')
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/users/students');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch students.');
      }
    };
    fetchStudents();
  }, []);

  // Fetch mentors (if you have a separate backend endpoint, for example, filtering by role)
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Assuming you have an endpoint to get mentors or you can call the same /users route and filter
        const res = await api.get('/users', { params: { role: 'mentor' } });
        setMentors(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch mentors.');
      }
    };
    fetchMentors();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Section to view all students */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Students</h2>
        {students.length === 0 ? (
          <p className="text-gray-500">No students available.</p>
        ) : (
          <ul className="space-y-2">
            {students.map((student) => (
              <li key={student._id} className="p-2 border rounded">
                <p className="font-bold">{student.name}</p>
                <p>{student.email}</p>
                <p>{student.branch}, {student.year}</p>
                <p>Role: {student.role}</p>
                {/* You can add update/delete buttons here */}
                <div className="flex gap-2 mt-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                    Update
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section to view all mentors */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Mentors</h2>
        {mentors.length === 0 ? (
          <p className="text-gray-500">No mentors available.</p>
        ) : (
          <ul className="space-y-2">
            {mentors.map((mentor) => (
              <li key={mentor._id} className="p-2 border rounded">
                <p className="font-bold">{mentor.name}</p>
                <p>{mentor.email}</p>
                <p>Role: {mentor.role}</p>
                {/* You can add update/delete buttons here */}
                <div className="flex gap-2 mt-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                    Update
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Additional buttons to create mentor/admin/volunteer can be added here */}
      <div className="flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm">
          Create Mentor
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm">
          Create Admin
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors text-sm">
          Create Volunteer
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
