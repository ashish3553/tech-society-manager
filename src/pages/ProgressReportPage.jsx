// src/pages/ProgressReportPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Helper function to assign classes based on rating value
const getRatingClass = (rating) => {
  if (rating === "Satisfied") return "bg-green-200 text-green-800";
  if (rating === "Less Satisfied") return "bg-yellow-200 text-yellow-800";
  if (rating === "Overly Satisfied") return "bg-blue-200 text-blue-800";
  return "bg-gray-200 text-gray-800";
};

// Disclaimer component displayed at the top
const Disclaimer = () => (
  <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-blue-50 border-l-8 border-blue-700 rounded shadow-md">
    <h2 className="text-xl font-bold mb-2 text-blue-800">Things you should keep in mind</h2>
    <p className="mb-2 text-md leading-relaxed text-gray-700">
      This is your progress report – a mirror that reflects your real self. It is designed to
      show you not only your achievements but also your faults, errors, patterns, and recurring mistakes.
      Think of it as an honest experiment to help you understand the obstacles in your progress.
    </p>
    <p className="mb-2 text-md leading-relaxed text-gray-700">
      Reflect on the things you could have avoided but didn't, and later felt regret about. <strong className='font-bold  text-blue-500'>Your honesty
      and integrity are the keys to making this experiment most beneficial for you.</strong> 
    </p>
    <p className="mb-2 text-md leading-relaxed text-gray-700">
      We all make mistakes – so many, in fact, that what might seem like a personal failure is often trivial
      when viewed from a broader perspective. There is no judgment here; we are all here to learn from our
      mistakes and move forward.
    </p>
    <p className="mb-2 text-md leading-relaxed text-gray-700">
      Publicly announcing your goal and having a mentor to track your progress creates a sense of accountability,
      encouraging you to fulfill your commitments. Embrace this process for your own growth!
    </p>
    {/* <p className="text-sm font-semibold text-blue-600">
      Experiment Link: <a href="https://your-experiment-link.com" className="underline">https://your-experiment-link.com</a>
    </p> */}
  </div>
);

// Modal for Editing/Updating the Weekly Goal (with bullet points)
const WeeklyGoalEditor = ({ currentGoal, onClose, onSave }) => {
  const initialBullets = currentGoal && currentGoal.weeklyTarget
    ? JSON.parse(currentGoal.weeklyTarget)
    : [];
  const [bullets, setBullets] = useState(initialBullets);
  const [weeklyJustification, setWeeklyJustification] = useState(
    currentGoal && currentGoal.weeklyJustification ? currentGoal.weeklyJustification : ''
  );
  const [newBullet, setNewBullet] = useState('');

  const addBullet = () => {
    if (newBullet.trim() !== '') {
      setBullets([...bullets, { text: newBullet, completed: false }]);
      setNewBullet('');
    }
  };

  const removeBullet = (index) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const toggleBullet = (index) => {
    setBullets(
      bullets.map((bp, i) =>
        i === index ? { ...bp, completed: !bp.completed } : bp
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      weeklyTarget: JSON.stringify(bullets),
      weeklyJustification: weeklyJustification,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-blue-200 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          {currentGoal ? 'Edit Weekly Goal' : 'Set Weekly Goal'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Enter your goal as bullet points:
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                placeholder="New bullet point"
                className="flex-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addBullet}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            {bullets.length > 0 && (
              <ul className="space-y-2">
                {bullets.map((bp, index) => (
                  <li key={index} className="flex items-center justify-between border border-gray-300 p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bp.completed}
                        onChange={() => toggleBullet(index)}
                        className="mr-2"
                      />
                      <span className={bp.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                        {bp.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBullet(index)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Weekly Justification available on Sunday */}
          {new Date().getDay() === 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Weekly Briefing (Justification):
              </label>
              <textarea
                value={weeklyJustification}
                onChange={(e) => setWeeklyJustification(e.target.value)}
                placeholder="Explain your overall progress or challenges for the week"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Save Weekly Goal
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Adding or Editing a Daily Update (supports edit mode)
const DailyUpdateEditor = ({ currentGoal, onClose, onSave, existingReport, reportIndex }) => {
  const [updateText, setUpdateText] = useState(existingReport ? existingReport.update : '');
  const [dailyJustification, setDailyJustification] = useState(existingReport ? existingReport.justification : '');
  const [dayRating, setDayRating] = useState(existingReport ? existingReport.rating : 'Satisfied');

  const handleSubmit = (e) => {
    e.preventDefault();
    const report = {
      update: updateText,
      isCompleted: existingReport ? existingReport.isCompleted : false,
      justification: dailyJustification,
      rating: dayRating,
      date: existingReport ? existingReport.date : new Date(),
    };
    onSave(report, reportIndex);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-blue-200 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          {existingReport ? 'Edit Daily Update' : 'Add Daily Update'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Daily Update:</label>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="You are here to discover your fault and patterns so that they can be mitigated in future. So be honest while writing --> What progress did you make today?"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Daily Justification <strong className='text-orange-500 font-semibold'>(Be Honest)</strong>:</label>
            <input
              type="text"
              value={dailyJustification}
              onChange={(e) => setDailyJustification(e.target.value)}
              placeholder="Explain any challenges or delays."
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rate your day:</label>
            <select
              value={dayRating}
              onChange={(e) => setDayRating(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Satisfied">अच्छा गया</option>
              <option value="Less Satisfied">थोड़ा और कर सकता था</option>
              <option value="Overly Satisfied">उम्मीद से ज्यादा अच्छा</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              {existingReport ? 'Save Changes' : 'Save Daily Update'}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Weekly Summary Editor (only on Sunday)
const WeeklySummaryEditor = ({ currentGoal, onClose, onSave }) => {
  const [summary, setSummary] = useState(
    currentWeekGoal && currentGoal.weeklyJustification ? currentGoal.weeklyJustification : ''
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ weeklyJustification: summary });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-blue-200 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Weekly Summary</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Enter your weekly summary:</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your weekly summary here..."
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Save Summary
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for viewing previous week report in read-only mode.
const ReadOnlyReportModal = ({ goal, onClose }) => {
  const bullets = goal && goal.weeklyTarget ? JSON.parse(goal.weeklyTarget) : [];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" border border-blue-200 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Weekly Report</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Weekly Goal:</h3>
          <ul className="list-disc list-inside mt-2 text-gray-700">
            {bullets.map((bp, index) => (
              <li key={index} className={bp.completed ? 'line-through text-gray-500' : ''}>
                {bp.text}
              </li>
            ))}
          </ul>
          {goal.weeklyJustification && (
            <p className="mt-2 text-sm text-gray-600">
              Weekly Summary: {goal.weeklyJustification}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Last Updated: {new Date(goal.updatedAt).toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Daily Updates:</h3>
          {goal.dailyReports && goal.dailyReports.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {goal.dailyReports.map((report, index) => (
                <li key={index} className="border border-gray-300 p-2 rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(report.date).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </p>
                    <p className="text-sm font-semibold text-gray-700" dangerouslySetInnerHTML={{ __html: report.update.replace(/(?:\r\n|\r|\n)/g, '<br />') }} />
                    {report.justification && (
                      <p className="text-sm font-bold text-gray-600">Justification: {report.justification}</p>
                    )}
                  </div>
                  {report.rating && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRatingClass(report.rating)}`}>
                      {report.rating}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No daily updates available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProgressReportPage = () => {
  const { auth } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [currentWeekGoal, setCurrentWeekGoal] = useState(null);
  const [previousWeekGoals, setPreviousWeekGoals] = useState([]);
  const [showWeeklyGoalEditor, setShowWeeklyGoalEditor] = useState(false);
  const [showDailyUpdateEditor, setShowDailyUpdateEditor] = useState(false);
  const [editingDailyUpdate, setEditingDailyUpdate] = useState({ active: false, index: null, report: null });
  const [showWeeklySummaryEditor, setShowWeeklySummaryEditor] = useState(false);
  const [showReadOnlyModal, setShowReadOnlyModal] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Function to check if there's already a daily update for today
  const todayUpdateExists = currentWeekGoal && currentWeekGoal.dailyReports &&
    currentWeekGoal.dailyReports.find(r => new Date(r.date).toDateString() === new Date().toDateString());

  // Handler for Weekly Summary button click: only allow on Sunday
  const handleWeeklySummaryClick = () => {
    if (new Date().getDay() === 0) {
      setShowWeeklySummaryEditor(true);
    } else {
      toast.info('Weekly summary can only be added on Sunday.');
    }
  };

  // Fetch all goals for the mentor
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get(`/goals/user/${auth.user.id}`);
        setGoals(res.data);
      } catch (error) {
        toast.error('Failed to fetch your goals');
      }
    };
    fetchGoals();
  }, [auth.user.id, refresh]);

  // Split goals into current week and previous weeks (assuming week starts on Monday)
  useEffect(() => {
    if (goals && goals.length > 0) {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      const current = goals.find(goal => new Date(goal.createdAt) >= monday);
      const previous = goals.filter(goal => new Date(goal.createdAt) < monday);
      setCurrentWeekGoal(current);
      setPreviousWeekGoals(previous);
    } else {
      setCurrentWeekGoal(null);
      setPreviousWeekGoals([]);
    }
  }, [goals]);

  // Handler to update weekly goal via editor
  const handleWeeklyGoalSave = async (data) => {
    try {
      if (currentWeekGoal) {
        await api.put(`/goals/${currentWeekGoal._id}`, data);
        toast.success('Weekly goal updated!');
      } else {
        await api.post('/goals', { user: auth.user.id, ...data });
        toast.success('Weekly goal created!');
      }
      setShowWeeklyGoalEditor(false);
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error('Failed to update weekly goal');
    }
  };

  // Handler to add or edit a daily update
  const handleDailyUpdateSave = async (report, reportIndex = null) => {
    try {
      if (!currentWeekGoal) {
        toast.error('Please set a weekly goal first.');
        return;
      }
      let updatedReports = currentWeekGoal.dailyReports ? [...currentWeekGoal.dailyReports] : [];
      if (reportIndex !== null) {
        // Edit existing report
        updatedReports[reportIndex] = report;
      } else {
        // Only add new report if today's update doesn't exist
        const todayExists = updatedReports.find(r => new Date(r.date).toDateString() === new Date().toDateString());
        if (todayExists) {
          toast.info("Today's update already exists. Please edit your existing update.");
          return;
        }
        updatedReports.push(report);
      }
      await api.put(`/goals/${currentWeekGoal._id}`, { dailyReports: updatedReports });
      toast.success(reportIndex !== null ? 'Daily update updated!' : 'Daily update saved!');
      setShowDailyUpdateEditor(false);
      setEditingDailyUpdate({ active: false, index: null, report: null });
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error('Failed to save daily update');
    }
  };

  // Handler to toggle weekly bullet completion (inline update)
  const handleToggleWeeklyBullet = async (index) => {
    if (!currentWeekGoal) return;
    try {
      const bullets = JSON.parse(currentWeekGoal.weeklyTarget);
      bullets[index].completed = !bullets[index].completed;
      await api.put(`/goals/${currentWeekGoal._id}`, { weeklyTarget: JSON.stringify(bullets) });
      toast.success('Weekly goal updated!');
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error('Failed to update weekly goal bullet');
    }
  };

  // Render daily updates for the current week goal with rating tags and an edit button
  const renderDailyUpdates = () => {
    if (!currentWeekGoal || !currentWeekGoal.dailyReports || currentWeekGoal.dailyReports.length === 0) {
      return <p className="text-gray-500">No daily updates yet.</p>;
    }
    return (
      <ul className="mt-2 space-y-2">
        {currentWeekGoal.dailyReports.map((report, index) => (
          <li key={index} className="border border-gray-300 p-2 rounded flex justify-between items-center">
            <div>
              <p className="mt-2 text-xs font-semibold text-gray-500">
                {new Date(report.date).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}
              </p>
              <p className="text-md font-semibold whitespace-pre-line text-gray-700">{report.update}</p>
              {report.justification && (
                <p className="text-xs text-gray-600">Justification: {report.justification}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {report.rating && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRatingClass(report.rating)}`}>
                  {report.rating}
                </span>
              )}
              <button
                onClick={() => setEditingDailyUpdate({ active: true, index, report })}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-300 transition-colors"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen mx-auto p-4 space-y-8">
      {/* Disclaimer Section */}
      <Disclaimer />

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Your this Week Goal and progress</h1>

      {/* Current Week Section */}
      <section className="mb-8">
        {/* <h2 className="text-2xl font-semibold mb-4 text-blue-800">Current Week Goal</h2> */}
        {currentWeekGoal ? (
          <div className="border border-orange-300 rounded p-4  shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2  text-gray-800">This week plan</h3>
              <ul className="list-disc list-inside text-gray-700">
                {currentWeekGoal.weeklyTarget &&
                  JSON.parse(currentWeekGoal.weeklyTarget).map((bp, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bp.completed}
                        onChange={() => handleToggleWeeklyBullet(index)}
                        className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                      />
                      <span className={bp.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                        {bp.text}
                      </span>
                    </li>
                  ))}
              </ul>
              {currentWeekGoal.weeklyJustification && (
                <p className="mt-2 text-sm text-gray-600">
                  Weekly Summary: {currentWeekGoal.weeklyJustification}
                </p>
              )}
              <p className="mt-2 text-xs font-bold text-gray-500">
                Last Updated: {new Date(currentWeekGoal.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowWeeklyGoalEditor(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Edit Weekly Goal
              </button>
              <button
                onClick={() => {
                  if (todayUpdateExists) {
                    toast.info("Today's update already exists. Please edit your existing update.");
                  } else {
                    setShowDailyUpdateEditor(true);
                  }
                }}
                disabled={!!todayUpdateExists}
                className={`${
                  todayUpdateExists ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                } text-white px-4 py-2 rounded transition-colors`}
              >
                {todayUpdateExists ? "Edit Today's Update" : 'Add Daily Update'}
              </button>
              <button
                onClick={handleWeeklySummaryClick}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                Add Weekly Summary
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Daily Updates</h3>
              {renderDailyUpdates()}
            </div>
          </div>
        ) : (
          <div className="border border-gray-300 rounded p-4 shadow-sm">
            <p className="text-gray-500">You have not set a weekly goal for the current week.</p>
            <button
              onClick={() => setShowWeeklyGoalEditor(true)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Set Weekly Goal
            </button>
          </div>
        )}
      </section>

      {/* Previous Weeks Section */}
      <section className="mb-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Your Previous Week Goal's and progress</h1>
        {previousWeekGoals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previousWeekGoals.map((goal) => {
              const goalDate = new Date(goal.createdAt);
              const weekNumber = Math.ceil(goalDate.getDate() / 7);
              return (
                <div
                  key={goal._id}
                  className="border border-gray-300 rounded p-4 cursor-pointer hover:shadow-lg transition-shadow "
                  onClick={() => setShowReadOnlyModal(goal)}
                >
                  <p className="font-semibold text-gray-800">
                    Week {weekNumber} - {goalDate.toLocaleString('default', { month: 'long' })}
                  </p>
                  <p className="text-sm text-gray-600">{goalDate.toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No previous week goals found.</p>
        )}
      </section>

      {/* Modals */}
      {showWeeklyGoalEditor && (
        <WeeklyGoalEditor
          currentGoal={currentWeekGoal}
          onClose={() => setShowWeeklyGoalEditor(false)}
          onSave={handleWeeklyGoalSave}
        />
      )}
      {showDailyUpdateEditor && !editingDailyUpdate.active && (
        <DailyUpdateEditor
          currentGoal={currentWeekGoal}
          onClose={() => setShowDailyUpdateEditor(false)}
          onSave={handleDailyUpdateSave}
        />
      )}
      {editingDailyUpdate.active && (
        <DailyUpdateEditor
          currentGoal={currentWeekGoal}
          existingReport={editingDailyUpdate.report}
          reportIndex={editingDailyUpdate.index}
          onClose={() => setEditingDailyUpdate({ active: false, index: null, report: null })}
          onSave={handleDailyUpdateSave}
        />
      )}
      {showWeeklySummaryEditor && (
        <WeeklySummaryEditor
          currentGoal={currentWeekGoal}
          onClose={() => setShowWeeklySummaryEditor(false)}
          onSave={handleWeeklyGoalSave}
        />
      )}
      {showReadOnlyModal && (
        <ReadOnlyReportModal
          goal={showReadOnlyModal}
          onClose={() => setShowReadOnlyModal(null)}
        />
      )}
    </div>
  );
};

export default ProgressReportPage;
