// src/components/MentorSolutionReview.jsx
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AdvancedTextEditor from './AdvancedTextEditor';

const MentorSolutionReview = ({ assignmentId, studentResponse, onReviewUpdated }) => {
  // Local state for mentor review fields
  const [reviewStatus, setReviewStatus] = useState(studentResponse.mentorReview?.status || 'pending');
  const [mentorComment, setMentorComment] = useState(studentResponse.mentorReview?.comment || '');
  const [loading, setLoading] = useState(false);
  // Use a local state to hold the student solution which can be edited
  const [solutionContent, setSolutionContent] = useState(studentResponse.studentSolution || '');
  const editorRef = useRef(null);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        studentId: studentResponse.student, // Ensure this is the student ID
        reviewStatus,  // e.g. "approved" or "not approved"
        mentorComment,
        updatedStudentSolution: solutionContent // pass along any edits
      };
      const res = await api.put(`/assignments/${assignmentId}/review`, payload);
      toast.success('Review updated successfully!');
      onReviewUpdated && onReviewUpdated(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow my-4">
      <h3 className="text-xl font-bold mb-2">Review Student Solution</h3>
      <div className="mb-4">
        <h4 className="font-semibold mb-1">Student's Solution:</h4>
        {/* AdvancedTextEditor is used here so that mentor can see and edit the solution */}
        <AdvancedTextEditor 
          onChange={setSolutionContent}
          initialContent={solutionContent}
        />
      </div>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Review Status:</label>
          <select 
            value={reviewStatus}
            onChange={(e) => setReviewStatus(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="approved">Approved</option>
            <option value="not approved">Not Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Mentor Comment:</label>
          <textarea 
            value={mentorComment}
            onChange={(e) => setMentorComment(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter your comments here..."
          />
        </div>
        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? "Saving..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorSolutionReview;
