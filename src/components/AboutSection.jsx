import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const milestones = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Started as a small Discord community of passionate programmers helping students learn to code during the pandemic.'
  },
  {
    year: '2021',
    title: 'Community Growth',
    description: 'Expanded to 1000+ students across India, launched structured learning paths and mentorship programs.'
  },
  {
    year: '2022',
    title: 'Platform Launch',
    description: 'Developed CodeIndia.Fun platform to provide a seamless learning experience with live coding sessions.'
  },
  {
    year: '2023',
    title: 'Industry Connect',
    description: 'Partnered with tech companies to provide internship opportunities and real-world project experience.'
  }
];

const AboutSection = () => {
  // Get the auth context properly
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.role;
  const isAdmin = role === 'admin';
  const isMentor = role === 'mentor' || role === 'admin';
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get('/users/menters');
        setTeamMembers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setError('Failed to load team members');
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);
  
  const [content, setContent] = useState({
    story: {
      mainText: "CodeIndia.Fun was born from a simple yet powerful idea...",
      subText: "What started as a small group of mentors..."
    },
    mission: "To democratize programming education in India...",
    milestones: [...milestones]
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EditButton = () => (
    isAdmin && (
      <div className="flex justify-end mb-4">
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Content'}
        </button>
      </div>
    )
  );

  // Debug output to check why admin/mentor features aren't working
  console.log('Current user role:', role);
  console.log('Is admin?', isAdmin);
  console.log('Is mentor?', isMentor);

  const renderContent = () => (
    <div className="bg-color rounded-lg shadow-lg p-8 my-8">
      <EditButton />
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-6 ">Our Story</h2>
        <div className=" p-6 rounded-lg mb-8">
          {isEditing ? (
            <>
              <textarea
                className="w-full p-2 mb-4 border rounded"
                value={content.story.mainText}
                onChange={(e) => setContent({...content, story: {...content.story, mainText: e.target.value}})}
              />
              <textarea
                className="w-full p-2 border rounded"
                value={content.story.subText}
                onChange={(e) => setContent({...content, story: {...content.story, subText: e.target.value}})}
              />
            </>
          ) : (
            <>
              <p className="text-gray-400 leading-relaxed text-center mb-4">{content.story.mainText}</p>
              <p className="text-gray-400 leading-relaxed text-center">{content.story.subText}</p>
            </>
          )}
        </div>

        <div className="space-y-8">
          {content.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                {isEditing ? (
                  <input
                    className="w-20 p-1 border rounded"
                    value={milestone.year}
                    onChange={(e) => {
                      const newMilestones = [...content.milestones];
                      newMilestones[index] = {...milestone, year: e.target.value};
                      setContent({...content, milestones: newMilestones});
                    }}
                  />
                ) : (
                  <span className="text-blue-600 font-bold">{milestone.year}</span>
                )}
              </div>
              <div className="w-px h-full bg-blue-300 relative">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1 top-1/2 transform -translate-y-1/2"></div>
              </div>
              <div className="flex-grow p-4 rounded-lg shadow-sm">
                {isEditing ? (
                  <>
                    <input
                      className="w-full p-1 mb-2 border rounded"
                      value={milestone.title}
                      onChange={(e) => {
                        const newMilestones = [...content.milestones];
                        newMilestones[index] = {...milestone, title: e.target.value};
                        setContent({...content, milestones: newMilestones});
                      }}
                    />
                    <textarea
                      className="w-full p-1 border rounded"
                      value={milestone.description}
                      onChange={(e) => {
                        const newMilestones = [...content.milestones];
                        newMilestones[index] = {...milestone, description: e.target.value};
                        setContent({...content, milestones: newMilestones});
                      }}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold mb-1">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <div className="bg-color p-6 rounded-lg inline-block">
          {isEditing ? (
            <textarea
              className="w-full p-2 border rounded"
              value={content.mission}
              onChange={(e) => setContent({...content, mission: e.target.value})}
            />
          ) : (
            <p className="text-gray-400 leading-relaxed">
              {content.mission}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading team members...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member._id} className="bg-color rounded-lg p-6 transform transition-all duration-300 hover:scale-105">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full object-cover w-full h-full shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{member.name}</h3>
                <p className="text-center text-gray-600 mb-4">{member.role}</p>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  
                  <a  href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">No team members found</div>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Quick Contact</h3>
        <div className="space-y-2 text-gray-400">
          <p>General Inquiries: info@codeindia.fun</p>
          <p>Support: support@codeindia.fun</p>
          <p>Phone: +91 123-456-7890</p>
        </div>
      </div>
    </div>
  );

  return renderContent();
};

export default AboutSection;