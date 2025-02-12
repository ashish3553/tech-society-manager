// src/pages/AssignmentDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AssignmentDetails() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [responseData, setResponseData] = useState({
    responseStatus: '',
    submissionUrl: '',
    learningNotes: ''
  });
  const [solutionText, setSolutionText] = useState('');
console.log("Auth is", auth);
  const isMentor = auth && (auth.user.role === 'mentor' || auth.user.role === 'admin');
  const canRespond = auth && (auth.user.role === 'student' || auth.user.role === 'volunteer');

  // Fetch assignment details on mount.
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/assignments/${id}`);
        console.log("current data is:", res.data)
        setAssignment(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load assignment details.');
      }
    };
    fetchAssignment();
  }, [id]);

  // Once assignment details are fetched, preload the student's previous response if available.
  useEffect(() => {
    if (assignment && auth && auth.user && assignment.responses) {
      const currentUserId = auth.user.id;
      const found = assignment.responses.find((resp) => {
        // If resp.student is populated as an object, use its _id; otherwise, use resp.student.
        const studentId =
          typeof resp.student === 'object' && resp.student !== null && resp.student._id
            ? String(resp.student._id)
            : String(resp.student);
        return studentId === String(currentUserId);
      });
      if (found) {
        // Preload the response fields from the found response.
        setResponseData({
          responseStatus: found.responseStatus || '',
          submissionUrl: found.submissionUrl || '',
          learningNotes: found.learningNotes || ''
        });
      } else {
        // If no response is found, you may choose to default to "not attempted" or leave blank.
        setResponseData({
          responseStatus: 'not attempted',
          submissionUrl: '',
          learningNotes: ''
        });
      }
    }
  }, [assignment, auth]);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the student's response on the backend.
      await api.put(`/assignments/${id}/status`, responseData);
      toast.success('Response updated successfully!');
      // Re-fetch the assignment details to update the UI.
      const res = await api.get(`/assignments/${id}`);
      setAssignment(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update response.');
    }
  };

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${id}/solution`, { solution: solutionText });
      toast.success('Solution updated successfully!');
      setSolutionText('');
      // Optionally, re-fetch assignment details to update the UI.
    } catch (err) {
      console.error(err);
      toast.error('Failed to update solution.');
    }
  };

  const handleToggleSolutionVisibility = async () => {
    try {
      const newVisibility = !assignment.solutionVisible;
      const res = await api.put(`/assignments/${id}/solution-visibility`, { solutionVisible: newVisibility });
      setAssignment(res.data);
      toast.success(`Solution is now ${newVisibility ? 'visible' : 'hidden'}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update solution visibility.');
    }
  };

  if (!assignment)
    return <p className="text-center text-gray-500">Loading assignment details...</p>;

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Assignment Details */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-3xl font-bold mb-4">{assignment.title}</h2>
        <div className="mb-4">
          <h3 className="text-2xl font-semibold mb-2">Explanation</h3>
          <div className="prose" dangerouslySetInnerHTML={{ __html: assignment.explanation }} />
        </div>
        {assignment.testCases && assignment.testCases.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Test Cases</h3>
            <ul className="list-disc list-inside">
              {assignment.testCases.map((tc, idx) => (
                <li key={idx}>{tc}</li>
              ))}
            </ul>
          </div>
        )}
        {assignment.files && assignment.files.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Attachments</h3>
            <div className="flex flex-wrap gap-4">
              {assignment.files.map((fileUrl, idx) => (
                <a key={idx} href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View File {idx + 1}
                </a>
              ))}
            </div>
          </div>
        )}
        {assignment.codingPlatformLink && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Coding Platform</h3>
            <a href={assignment.codingPlatformLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Visit Coding Platform
            </a>
          </div>
        )}
        {assignment.solution && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Solution</h3>
            {assignment.solutionVisible ? (
              <p>{assignment.solution}</p>
            ) : (
              <p className="text-gray-500 italic">Solution is hidden by the admin.</p>
            )}
            {isMentor && (
              <div className="mt-2">
                <button 
                  onClick={handleToggleSolutionVisibility} 
                  className="bg-blue-600 text-white py-1 px-2 rounded"
                >
                  {assignment.solutionVisible ? 'Hide Solution' : 'Show Solution'}
                </button>
              </div>
            )}
          </div>
        )}
        {assignment.assignedBy && (
          <div className="text-gray-600">
            <p><strong>Uploaded By:</strong> {assignment.assignedBy.name}</p>
            <p><strong>Mentor Branch:</strong> {assignment.assignedBy.branch || 'N/A'}</p>
          </div>
        )}
      </div>

      {/* Student Response Form */}
      {canRespond && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-2xl font-bold mb-4">Your Response</h3>
          <form onSubmit={handleResponseSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Update Your Status:</label>
              <select 
                value={responseData.responseStatus}
                onChange={(e) => setResponseData({ ...responseData, responseStatus: e.target.value })}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select status</option>
                <option value="solved">Solved</option>
                <option value="partially solved">Partially Solved</option>
                <option value="not understanding">Not Understanding</option>
                <option value="having doubt">Having Doubt</option>
              </select>
            </div>
            {responseData.responseStatus === 'solved' && (
              <div>
                <label className="block font-medium mb-1">Submission URL (Proof):</label>
                <input 
                  type="text"
                  value={responseData.submissionUrl}
                  onChange={(e) => setResponseData({ ...responseData, submissionUrl: e.target.value })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            )}
            {responseData.responseStatus && responseData.responseStatus !== 'solved' && (
              <div>
                <label className="block font-medium mb-1">Describe Your Problem:</label>
                <textarea 
                  value={responseData.learningNotes}
                  onChange={(e) => setResponseData({ ...responseData, learningNotes: e.target.value })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            )}
            {responseData.responseStatus === 'solved' && (
              <div>
                <label className="block font-medium mb-1">Optional Learning Notes:</label>
                <textarea 
                  value={responseData.learningNotes}
                  onChange={(e) => setResponseData({ ...responseData, learningNotes: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
            )}
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              Update Response
            </button>
          </form>
        </div>
      )}

      {/* Mentor Solution Option */}
      {isMentor && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-2xl font-bold mb-4">Add / Update Solution</h3>
          <form onSubmit={handleSolutionSubmit} className="space-y-4">
            <textarea 
              name="solution"
              placeholder="Enter solution here..."
              className="w-full border rounded p-2"
              required
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
            />
            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
              Update Solution
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AssignmentDetails;
