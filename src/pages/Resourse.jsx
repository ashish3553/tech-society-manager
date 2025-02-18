// src/pages/Resourse.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import { AuthContext } from '../context/AuthContext';

// Hardcoded array for major topics (same as in your assignment schema)
const majorTopics = [
  "All",
  "Miscellaneous",
  "Basics & Syntax",
  "Data Types & Variables",
  "Operators",
  "Control Structures",
  "Functions",
  "Pointers & Memory Management",
  "Arrays",
  "String",
  "Object-Oriented Programming (OOP)",
  "Templates & Generic Programming",
  "STL",
  "Exception Handling",
  "File I/O",
  "Advanced Topics"
];

function Resourse() {
  const { auth } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  
  // State to track the top-level category selection
  const [activeCategory, setActiveCategory] = useState('questions'); // default: questions
  
  // For questions category, track question type (coding vs conceptual)
  const [activeQuestionType, setActiveQuestionType] = useState('coding'); // default: coding
  
  // For questions category, track the selected major topic
  const [selectedTopic, setSelectedTopic] = useState("All"); // default: All

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (auth?.user?.role === 'mentor' || auth?.user?.role === 'admin') {
          console.log("Calling assignment/allResource route for mentor/admin:");
          const res = await api.get('/assignments/allResource');
          console.log("res:", res.data);
          setAssignments(res.data);
        } else {
          console.log("Calling assignment/general route for students:");
          const res = await api.get('/assignments/general');
          console.log("res:", res.data);
          setAssignments(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, [auth]);

  // Filter assignments based on active category & selections
  let filteredAssignments = assignments;
  if (activeCategory === 'questions') {
    filteredAssignments = assignments.filter((assignment) => {
      const isQuestion = assignment.repoCategory === 'question' && assignment.questionType === activeQuestionType;
      const topicMatch = selectedTopic === "All" ? true : assignment.majorTopic === selectedTopic;
      return isQuestion && topicMatch;
    });
  } else if (activeCategory === 'projects') {
    filteredAssignments = assignments.filter(
      (assignment) => assignment.repoCategory === 'project'
    );
  } else if (activeCategory === 'theory') {
    filteredAssignments = assignments.filter(
      (assignment) => assignment.tags && assignment.tags.includes('theory')
    );
  }

  return (
    <div className="container bg-color mx-auto p-8">
      <h2 className="text-4xl font-bold mb-8 text-center">All Resources</h2>
      
      {/* Top-Level Category Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button 
          onClick={() => setActiveCategory('projects')}
          className={`py-3 px-8 rounded shadow-md transition-colors duration-200 ${activeCategory === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Projects
        </button>
        <button 
          onClick={() => setActiveCategory('questions')}
          className={`py-3 px-8 rounded shadow-md transition-colors duration-200 ${activeCategory === 'questions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Questions
        </button>
        <button 
          onClick={() => setActiveCategory('theory')}
          className={`py-3 px-8 rounded shadow-md transition-colors duration-200 ${activeCategory === 'theory' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Theory
        </button>
      </div>

      {activeCategory === 'questions' ? (
        // Flex layout: on mobile, column; on md+ screens, row with left panel
        <div className="flex flex-col md:flex-row w-full">
          {/* Dropdown filters for mobile */}
          <div className="block md:hidden mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Question Type:</label>
              <select 
                value={activeQuestionType}
                onChange={(e) => setActiveQuestionType(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="coding">Coding Question</option>
                <option value="conceptual">Conceptual Question</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Major Topic:</label>
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full border rounded p-2"
              >
                {majorTopics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Left panel for md+ screens */}
          <div className="hidden md:block md:w-1/5  border-r border-cyan-700 md:pr-4 overflow-y-auto max-h-screen scrollbar-thin">
            <div className="mb-6 flex gap-2">
              <button 
                onClick={() => setActiveQuestionType('coding')}
                className={`py-2 px-4 rounded shadow transition-colors duration-200 ${activeQuestionType === 'coding' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Coding
              </button>
              <button 
                onClick={() => setActiveQuestionType('conceptual')}
                className={`py-2 px-4 rounded shadow transition-colors duration-200 ${activeQuestionType === 'conceptual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Conceptual
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Major Topics</h3>
              <ul className="space-y-3">
                {majorTopics.map((topic) => (
                  <li key={topic}>
                    <button 
                      onClick={() => setSelectedTopic(topic)}
                      className={`block w-full text-left py-2 px-3 rounded transition-colors duration-200 ${selectedTopic === topic ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-50 hover:bg-blue-50 text-gray-700'}`}
                    >
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Main Content Area */}
          <div className="w-full md:w-4/5 md:pl-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAssignments && filteredAssignments.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // For non-questions categories, simply render the assignments full width in a grid.
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssignments && filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Resourse;
