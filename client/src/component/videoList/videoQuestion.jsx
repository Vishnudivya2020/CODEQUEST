
import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoQuestionList.css";
import VideoInfo from "../Homemainbar/videoInfo.jsx";

const VideoQuestion = ({ videoquestion }) => {
  const navigate = useNavigate();

  return (
    <div className="video-item">
      <VideoInfo videoquestion={videoquestion} />
      <button
        onClick={() =>
          navigate("/watch-video", {
            state: { videoPath: videoquestion.videopath },
          })
        }
        style={{ marginTop: "10px"}}
      >
        Watch Video
      </button>
    </div>
  );
};

export default VideoQuestion;
