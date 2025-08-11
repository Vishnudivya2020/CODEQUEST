
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './video.css';
import {
  sendVideoOtp,
  verifyVideoOtp,
  uploadVideo,
} from "../../api/index.js";
import VideoQuestionForm from "./videoQuestionForm.jsx";

const VideoUpload = ({ onVideoUploadSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState("");
  const [userid, setUserid] = useState(localStorage.getItem("userId") || null);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate(); 

  const handleSendOtp = async () => {
     const now = new Date();
  const hour = now.getHours();

  if (hour < 14 || hour >= 19) {
    alert("⏰ Video uploads are allowed only between 2 PM and 7 PM.");
    setEmail(""); 
    return;
  }
    if (!email) return alert("Please enter your email");
    try {
      const res = await sendVideoOtp(email, "Video upload request");
      setStatusMessage({ text: res.message || "OTP sent", type: "info" });
      setOtpSent(true);
    } catch {
      setStatusMessage({ text: "Failed to send OTP", type: "error" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter the OTP");
    try {
      const res = await verifyVideoOtp(email, otp);
      if (res.success) {
        setOtpVerified(true);
        setStatusMessage({ text: "OTP verified", type: "success" });
      } else {
        setStatusMessage({ text: "Invalid OTP", type: "error" });
      }
    } catch {
      setStatusMessage({ text: "Verification failed", type: "error" });
    }
  };

  const handleUploadVideo = async () => {
    if (!otpVerified) {
      setStatusMessage({ text: "Verify OTP first", type: "error" });
      return;
    }

    if (!video) return alert("Please select a video");

    const formData = new FormData();
    formData.append("Videoquestiontitle", title);
    formData.append("Videoquestionbody", body);
    formData.append("Videoquestiontags", JSON.stringify(tags));
    formData.append("userposted", email);
    formData.append("userid", userid);
    formData.append("video", video);

    try {
      const res = await uploadVideo(formData);
      setStatusMessage({ text: res.message || "Uploaded", type: "success" });

      if (res?.video?.videoUrl) {
        onVideoUploadSuccess?.(res.video.videoUrl);
      }

      
      alert("Video uploaded successfully!");

     
      setTimeout(() => {
        navigate("/");
      }, 500); 

     
      setTitle("");
      setBody("");
      setTags([]);
      setVideo(null);
      setOtp("");
      setOtpVerified(false);
      setOtpSent(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Upload failed";
      setStatusMessage({ text: msg, type: "error" });
    }
  };

  return (
    <div className="video-upload-container">
      <div className="uploadHeading">
        <h2>Upload Your Video</h2>
      </div>

      <div className="otpForm">
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="emailInput"
        />

        {!otpSent && (
          <button onClick={handleSendOtp} className="sendOtpButton">
            Send OTP
          </button>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} className="sendOtpButton">
              Verify OTP
            </button>
          </>
        )}

        {otpVerified && (
          <>
            <VideoQuestionForm
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              tags={tags}
              setTags={setTags}
              onVideoChange={(e) => setVideo(e.target.files[0])}
            />

            <button onClick={handleUploadVideo} className="sendOtpButton">
              Upload Video
            </button>
          </>
        )}

        {statusMessage.text && (
          <p className={`status-message ${statusMessage.type}`}>
            {statusMessage.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
