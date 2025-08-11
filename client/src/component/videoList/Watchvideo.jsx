
import React from "react";
import { useLocation } from "react-router-dom";

const WatchVideo = () => {
  const location = useLocation();
  const videoPath = location.state?.videoPath;

  if (!videoPath) {
    return <div>Video not found.</div>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Watch Video</h2>
      <video controls width="640" height="360">
        <source src={`http://localhost:5000${videoPath}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div>
        
      </div>
    </div>
    
  );
};

export default WatchVideo;
