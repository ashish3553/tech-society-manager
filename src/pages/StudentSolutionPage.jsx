// src/pages/StudentSolutions.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AssignmentDisplay from '../components/AssignmentDisplay';

function StudentSolutions() {
  const { auth } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states – for student, we can filter by mentor review status and assignment title.
  const [reviewStatus, setReviewStatus] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  
  // Detailed view state: when a card is clicked, show the full assignment details.
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchStudentSolutions = async () => {
    try {
      setLoading(true);
      const params = {
        studentId: auth.user.id,
        reviewStatus,       // e.g., approved, not approved, pending
        assignmentTitle,    // search by assignment title
        page,
        limit
      };
      const res = await api.get('/assignments/solved', { params });
      // Assume the backend returns { assignments, total }
      console.log("Fetched assignments is: ",res.data);
      setAssignments(res.data.assignments);
      console.log("Swlwcted assignment is:",selectedAssignment)
          
        const myResponse = selectedAssignment.responses.find(resp => {
          const respStudentId =
            typeof resp.student === 'object' && resp.student !== null && resp.student._id
              ? String(resp.student._id)
              : String(resp.student);
          return respStudentId === String(auth.user.id);
        })


      // setTotal(res.data.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch your solutions");  ---->> later on when solution is edited.
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchStudentSolutions();
    }
  }, [auth, reviewStatus, assignmentTitle, page, limit]);

  // When a card is clicked, fetch the full assignment details.
  const handleCardClick = async (assignmentCard) => {

    setSelectedAssignment(null);
    try {
      const res = await api.get(`/assignments/${assignmentCard._id}`);
      setSelectedAssignment(res.data);
   
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assignment details");
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudentSolutions();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-center">My Submitted Solutions</h1>
      
      {/* Filter Form */}
      <div className=" p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter My Solutions</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Review Status</label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="not approved">Not Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assignment Title</label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Search by title"
            />
          </div>
          {/* <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button> */}
        </form>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <div>
          Page: 
          <input
            type="number"
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value) || 1)}
            className="w-16 border rounded p-1 text-center mx-2"
            min="1"
          />
          <span>Total Pages: {Math.ceil(total / limit)}</span>
        </div>
        <button 
          onClick={() => setPage(page * limit < total ? page + 1 : page)}
          disabled={page * limit >= total}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Display Loader or Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p>Loading...</p>
        </div>
      ) : !selectedAssignment ? (
        assignments.length === 0 ? (
          <p className="text-center text-gray-500">No solutions submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div 
                key={assignment._id}
                className=" p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => handleCardClick(assignment)}
              >
                <h2 className="text-xl font-bold mb-2">{assignment.title}</h2>
                <p className="text-sm text-gray-700">Mentor Review: <span className="font-semibold bg-slate-800 text-white px-2 py-1 rounded">{assignment.myResponse?.mentorReview?.status || 'pending'}</span></p>
                <p className="text-sm text-gray-700 mt-1">Submitted on: {new Date(assignment.createdAt).toLocaleString('en-IN')}</p>
                <p className="mt-2 text-blue-600 font-semibold">Click to view details</p>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <button 
            onClick={() => {
              setSelectedAssignment(null);
            }}
            className="mb-4 text-blue-600 underline px-4 py-2 bg-green-800 text-white rounded"
          >
            Back to list
          </button>

          
          {console.log("Selected assignment is:", selectedAssignment)}
          <div className="min-h-screen">

          <AssignmentDisplay assignment={selectedAssignment} />


{(() => {
  // Extract the logged-in student's response from the responses array.
  const myResponse = selectedAssignment.responses.find((resp) => {
    const respStudentId =
      typeof resp.student === 'object' && resp.student !== null && resp.student._id
        ? String(resp.student._id)
        : String(resp.student);
    return respStudentId === String(auth.user.id);
  });
  return (
    <div className="mt-6  p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">My Response</h2>
      <div className="mb-2">
        <strong>Solution:</strong>
        {myResponse && myResponse.studentSolution ? (
          <div
            className="border p-4 rounded whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: myResponse.studentSolution }}
          />
        ) : (
          <p>No solution submitted.</p>
        )}
      </div>
      {myResponse?.submissionUrl && (
        <div className="mb-2">
          <strong>Submission URL:</strong>
          <p className="text-blue-600">
            <a href={myResponse.submissionUrl} target="_blank" rel="noopener noreferrer">
              {myResponse.submissionUrl}
            </a>
          </p>
        </div>
      )}
      {myResponse?.learningNotes && (
        <div className="mb-2">
          <strong>Learning Notes:</strong>
          <p className="whitespace-pre-wrap">{myResponse.learningNotes}</p>
        </div>
      )}
      <div>
        <strong>Mentor Review:</strong> {myResponse?.mentorReview?.status || "pending"}
        {myResponse?.mentorReview?.comment && (
          <p className="mt-1 text-sm text-gray-700">
            Comment: {myResponse.mentorReview.comment}
          </p>
        )}
      </div>
    </div>
  );
})()}
            </div>


        </div>
      )}
    </div>
  );
}

export default StudentSolutions;
