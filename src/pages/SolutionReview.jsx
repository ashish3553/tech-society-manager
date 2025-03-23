// src/pages/SolutionReview.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import AssignmentDisplay from '../components/AssignmentDisplay';
import MentorSolutionReview from '../components/MentorSolutionReview';

function SolutionReview() {
  const { auth } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  // Filter states
  const [reviewStatus, setReviewStatus] = useState('');
  const [studentName, setStudentName] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  
  const [selectedReview, setSelectedReview] = useState(null);
  const [assignmentDetail, setAssignmentDetail] = useState(null);
  
  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        reviewStatus,
        studentName,
        assignmentTitle,
        page,
        limit
      };
      const res = await api.get('/assignments/reviews', { params });
      const sortedReviews = res.data.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReviews(sortedReviews);
      setTotal(res.data.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviews");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchReviews();
    }
  }, [auth, reviewStatus, studentName, assignmentTitle, page, limit]);

  // When a review card is clicked, fetch the full assignment details using its assignmentId
  const handleCardClick = async (review) => {
    console.log("Clicked reviw card is: ", review)
    setSelectedReview(review);
    try {
      const res = await api.get(`/assignments/${review.assignmentId}`);
      setAssignmentDetail(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assignment details");
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Solution Reviews</h1>
      
      {/* Filter Form */}
      <div className=" p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Reviews</h2>
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
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Search by student name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assignment Title</label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Search by assignment title"
            />
          </div>
          {/* <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
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

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p>Loading...</p>
        </div>
      ) : !selectedReview ? (
        reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div 
                key={`${review.assignmentId}-${review.student._id}`} 
                className=" p-4 rounded shadow relative cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(review)}
              >
                <h2 className="text-xl font-bold mb-2">{review.assignmentTitle}</h2>
                <p className="text-sm text-gray-700">Submitted by: {review.student.name}</p>
                <p > <span className="text-sm absolute  top-0 right-2 font-semibold text-white bg-slate-800 px-2 py-1 rounded-md" >{review.mentorReview?.status || 'pending'}</span></p>
                {/* <p className="mt-2 text-gray-600 line-clamp-3">
                  {review.studentSolution 
                    ? review.studentSolution.substring(0, 100) + "..." 
                    : "No solution submitted."}
                </p> */}

                <p className="mt-2 text-blue-600 font-semibold">Click to review</p>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <button 
            onClick={() => {
              setSelectedReview(null);
              setAssignmentDetail(null);
            }}
            className="mb-4 text-white px-2 py-2 font-medium rounded-lg bg-green-800 "
          >
            Back to list
          </button>
          {assignmentDetail ? (
            <>
                  <div className=' font-bold text-center text-orange-500 text-4xl mb-4'>Assignment Details</div>

              <AssignmentDisplay assignment={assignmentDetail} />
              <div className="my-4">
                <MentorSolutionReview 
                  assignmentId={assignmentDetail._id}
                  studentResponse={selectedReview}
                  onReviewUpdated={(updatedData) => {
                    toast.success("Review updated successfully");
                    setSelectedReview(null);
                    fetchReviews();
                  }}
                />
              </div>
            </>
          ) : (
            <p>Loading assignment details...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SolutionReview;
