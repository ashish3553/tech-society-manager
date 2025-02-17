import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import SolutionEditorTinyMCE from '../components/TinyMICSolutionEditor';
import { AuthContext } from '../context/AuthContext';

const SolutionEditorPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // assume auth.user.id is available
  const [solutionContent, setSolutionContent] = useState('');
  const [title, setTitle] = useState('Ashish');
  const [loading, setLoading] = useState(true);

  // 1) Fetch existing solution (if any)
  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await api.get(`/assignments/${assignmentId}/solution`);
        // Populate state from existing solution
        console.log("Here trying to fetch data", res.data.content)
        setSolutionContent(res.data.content || '');
        setTitle(res.data.title || 'Ashish');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load solution data (or no solution yet).');
      } finally {
        setLoading(false);
      }
    };
    fetchSolution();
  }, [assignmentId]);

  // 2) Save the solution
  const handleSaveSolution = async (e) => {
    e.preventDefault();

    // Log the content to verify
    console.log('About to send solution content:', solutionContent);
    console.log('Title:', title);
    console.log('User ID:', auth.user.id);

    // Validate content is not empty
    if (!solutionContent.trim()) {
      toast.error('Solution content is empty. Please provide some content.');
      return;
    }

    try {
      await api.put(`/assignments/${assignmentId}/solution`, {
        title,                      // The solution title
        content: solutionContent,   // The HTML content from TinyMCE
        userId: auth.user.id        // The logged-in user's ID
      });
      toast.success('Solution saved successfully!');
      navigate(-1); // Navigate back
    } catch (error) {
      console.error(error);
      toast.error('Failed to save solution.');
    }
  };

  // useEffect(() => {
  //   console.log('Updated solutionContent:', solutionContent);
  // }, [solutionContent]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading editor...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Solution Editor</h1>
      
      {/* Optional: Input for solution title */}
      <input
        type="text"
        placeholder="Solution Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <SolutionEditorTinyMCE
        initialData={solutionContent || '<p></p>'}
        onChange={setSolutionContent}
      />
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={handleSaveSolution}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Save Solution
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SolutionEditorPage;
