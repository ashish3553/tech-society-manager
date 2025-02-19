// src/pages/AssignmentDetails.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

import AssignmentDisplay from '../components/AssignmentDisplay';
import AssignmentEditForm from '../components/AssignmentEditForm';
import StudentResponseForm from '../components/StudentResponseForm';
import MentorActions from '../components/MentorAction';
import MentorSolutionSection from '../components/MentorSolutionSection';
import StudentSolutionSection from '../components/StudentSolutionSection';
import QuestionForm from '../components/QuestionForm';

function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [responseData, setResponseData] = useState({
    responseStatus: '',
    submissionUrl: '',
    learningNotes: ''
  });
  const [solutionContent, setSolutionContent] = useState('');
  const [editingSolution, setEditingSolution] = useState(false);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPersonalInput, setShowPersonalInput] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Control inline solution display for student
  const [showSolutionInline, setShowSolutionInline] = useState(false);
  const solutionRef = useRef(null); // Ref for solution section

  const isMentor = auth && (auth.user.role === 'mentor' || auth.user.role === 'admin');
  const canRespond = auth && (auth.user.role === 'student' || auth.user.role === 'volunteer');

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        console.log("Trying to get assignment details:");
        const res = await api.get(`/assignments/${id}`);
        console.log("Here is details: ", res.data);
        setAssignment(res.data);
        setSolutionContent(res.data.solution || '');
        setEditData({
          title: res.data.title,
          explanation: res.data.explanation,
          testCases: JSON.stringify(res.data.testCases || [], null, 2),
          tags: res.data.tags ? res.data.tags.join(', ') : '',
          repoCategory: res.data.repoCategory,
          questionType: res.data.questionType,
          majorTopic: res.data.majorTopic,
          similarQuestions: JSON.stringify(res.data.similarQuestions || [], null, 2),
          codingPlatformLink: res.data.codingPlatformLink
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load assignment details.');
      }
    };
    fetchAssignment();
  }, [id]);

 // In AssignmentDetails.jsx, inside the useEffect that preloads student response:
useEffect(() => {
  if (assignment && auth && auth.user && assignment.responses) {
    const currentUserId = auth.user.id;
    const found = assignment.responses.find((resp) => {
      const studentId =
        typeof resp.student === 'object' && resp.student !== null && resp.student._id
          ? String(resp.student._id)
          : String(resp.student);
      return studentId === String(currentUserId);
    });
    if (found) {
      setResponseData({
        responseStatus: found.responseStatus || '',
        submissionUrl: found.submissionUrl || '',
        learningNotes: found.learningNotes || '',
        studentSolution: found.studentSolution || ''  // preload student's solution if available
      });
    } else {
      setResponseData({
        responseStatus: 'not attempted',
        submissionUrl: '',
        learningNotes: '',
        studentSolution: ''
      });
    }
  }
}, [assignment, auth]);


  // Handler for student response submission
  const handleResponseSubmit = async (responseData) => {
    // e.preventDefault();
    console.log("Response data aaya hai:", responseData)
    try {
      await api.put(`/assignments/${id}/status`, responseData);
      toast.success('Response updated successfully!');
      const res = await api.get(`/assignments/${id}`);
      setAssignment(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update response.');
    }
  };

  // Fetch the solution from your API
  useEffect(() => {
    const fetchSolution = async () => {
      try {
        console.log("Fetching mentor page solution");
        const res = await api.get(`/assignments/${id}/solution`);
        console.log("Found mentor page solution", res.data);
        setSolutionContent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSolution();
  }, [id]);

  useEffect(() => {
    if (showSolutionInline && solutionRef.current) {
      solutionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showSolutionInline]);

  // Handler for updating solution (mentor)
  const handleSolutionUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${id}/solution`, { solution: solutionContent });
      toast.success('Solution updated successfully!');
      setEditingSolution(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update solution.');
    }
  };

  // Toggle solution visibility (mentor)
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

  // Handler for saving edited assignment details (mentor)
  const handleAssignmentEditSubmit = async (editData) => {
    // e.preventDefault();
    try {
      const updatePayload = {
        ...editData,
        tags: editData.tags.split(',').map(t => t.trim())
      };
      const res = await api.put(`/assignments/${id}`, updatePayload);
      setAssignment(res.data);
      setIsEditingAssignment(false);
      toast.success('Assignment updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update assignment.');
    }
  };

  // Handler for assigning personally (mentor)
  const handleAssignPersonal = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student.');
      return;
    }
    try {
      const res = await api.put(`/assignments/${id}/assign-personal`, { assignedTo: selectedStudents });
      setAssignment(res.data);
      setShowPersonalInput(false);
      toast.success('Assignment updated with personal assignees!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign personally.');
    }
  };

  if (!assignment) {
    return <p className="text-center text-gray-500">Loading assignment details...</p>;
  }

  const displayDate = new Date(assignment.updatedAt || assignment.createdAt).toLocaleString('en-IN');

  return (
    <div className="container bg-color min-h-screen mx-auto p-4 space-y-8">
      {/* If mentor can respond, show a merged block with assignment display and student response */}
      {canRespond ? (
        <div className="border rounded-lg shadow p-4 md:flex md:items-stretch">
          <div className="md:w-2/3 border-r md:pr-4">
            <AssignmentDisplay assignment={assignment} />
          </div>
          <div className="md:w-1/3 md:pl-4">
            <div className="bg-white rounded p-4 h-full">
              <h3 className="text-2xl font-bold mb-4">Your Response</h3>
              <StudentResponseForm 
                assignmentId={id}
                responseData={responseData} 
                setResponseData={setResponseData} 
                onSubmit={handleResponseSubmit} 
                initialContent={solutionContent || {}} 
                showSolution={showSolutionInline}
                setShowSolution={setShowSolutionInline}
              />
            </div>
          </div>
        </div>
      ) : (
        <AssignmentDisplay assignment={assignment} />
      )}

      {/* If solution is meant to be displayed inline */}
      {canRespond && showSolutionInline && (
        <StudentSolutionSection assignmentId={id} />
      )}

      {/* If the mentor clicks the Edit button, show the edit form */}
      {isMentor && isEditingAssignment ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Edit Assignment</h2>
          <QuestionForm
          isEdit={true} 
          initialData={editData}
            setEditData={setEditData}
            onSubmit={handleAssignmentEditSubmit}
            onCancel={() => setIsEditingAssignment(false)}
          />
        </div>
      ) : (
        // Otherwise, show mentor actions (which include the "Edit Question" button)
        isMentor && (
          <MentorActions 
            displayDate={displayDate}
            setIsEditingAssignment={setIsEditingAssignment}
            showPersonalInput={showPersonalInput}
            setShowPersonalInput={setShowPersonalInput}
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
            handleAssignPersonal={handleAssignPersonal}
          />
        )
      )}

      {isMentor && (
        <MentorSolutionSection
          assignment={assignment}
          solutionContent={solutionContent}
          editingSolution={editingSolution}
          setEditingSolution={setEditingSolution}
          setSolutionContent={setSolutionContent}
          handleSolutionUpdate={handleSolutionUpdate}
          handleToggleSolutionVisibility={handleToggleSolutionVisibility}
        />
      )}
    </div>
  );
}

export default AssignmentDetails;
