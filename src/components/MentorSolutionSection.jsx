// src/components/MentorSolutionSection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
// Import the shared CSS (adjust path as necessary)
import "../style/Solution-style.css";

const MentorSolutionSection = ({ assignment }) => {
  const navigate = useNavigate();
  const assignmentId = assignment._id;
  const [solution, setSolution] = useState(null);

  // Fetch the solution from your API
  useEffect(() => {
    const fetchSolution = async () => {
      try {
        console.log("Fetching mentor page solution")
        const res = await api.get(`/assignments/${assignmentId}/solution`);
        console.log("Found mentor page solution", res.data)

        setSolution(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSolution();
  }, [assignmentId]);

  // Attach a click event to images inside the solution content for zoom
  useEffect(() => {
    if (solution) {
      // Query for images inside the container with class "solution-content"
      const container = document.querySelector(".solution-content");
      if (container) {
        const images = container.querySelectorAll("img");
        images.forEach((img) => {
          // Ensure images use the zoom cursor (this may already be in CSS)
          img.style.cursor = "zoom-in";
          // Remove any existing listener to avoid duplicates
          img.removeEventListener("click", toggleZoom);
          img.addEventListener("click", toggleZoom);
        });
      }
    }
    // Cleanup: remove listeners on unmount
    return () => {
      const container = document.querySelector(".solution-content");
      if (container) {
        const images = container.querySelectorAll("img");
        images.forEach((img) => {
          img.removeEventListener("click", toggleZoom);
        });
      }
    };
  }, [solution]);

  // The toggle function for zoom
  const toggleZoom = (e) => {
    const img = e.currentTarget;
    if (img.classList.contains("zoomed")) {
      img.classList.remove("zoomed");
    } else {
      img.classList.add("zoomed");
    }
  };

  if (!solution) {
    return <div>No solution found. Click { <button
      onClick={() => navigate(`/solution/${assignmentId}`)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Edit Solution
    </button>}</div>;
  }

  return (
    <div className=" rounded shadow p-6">
      <h3 className="text-2xl font-bold mb-4">Solution</h3>

      {/* Wrap the solution content in a container with the shared class */}
      <div
        className="solution-content"
        dangerouslySetInnerHTML={{ __html: solution.content }}
      />

      <div className="mt-4">
        <button
          onClick={() => navigate(`/solution/${assignmentId}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Solution
        </button>
      </div>
    </div>
  );
};

export default MentorSolutionSection;
