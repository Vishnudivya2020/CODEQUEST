

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
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const userid = localStorage.getItem("userId") || null;

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
      alert(res.message || "✅ OTP sent successfully!"); // ✅ Added alert
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send OTP";
      alert(msg);
      setStatusMessage({ text: msg, type: "error" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter the OTP");
    try {
      const res = await verifyVideoOtp(email, otp);
      if (res.success) {
        setOtpVerified(true);
        setStatusMessage({ text: "OTP verified", type: "success" });
        alert("✅ OTP verified successfully!");
      } else {
        setStatusMessage({ text: "Invalid OTP", type: "error" });
        alert("❌ Invalid OTP");
      }
    } catch {
      setStatusMessage({ text: "Verification failed", type: "error" });
      alert("❌ OTP verification failed");
    }
  };

  const handleUploadVideo = async () => {
    if (!otpVerified) {
      setStatusMessage({ text: "Verify OTP first", type: "error" });
      alert("Please verify OTP before uploading.");
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
      const res = await uploadVideo(formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setStatusMessage({ text: res.message || "Uploaded", type: "success" });

      if (res?.video?.videoUrl) {
        onVideoUploadSuccess?.(res.video.videoUrl);
      }

      alert("🎉 Video uploaded successfully!");
      setTimeout(() => navigate("/"), 500);

      setTitle("");
      setBody("");
      setTags([]);
      setVideo(null);
      setOtp("");
      setOtpVerified(false);
      setOtpSent(false);
      setUploadProgress(0);
    } catch (error) {
      const msg = error.response?.data?.message || "Upload failed";
      setStatusMessage({ text: msg, type: "error" });
      alert(`❌ ${msg}`);
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

            {uploadProgress > 0 && (
              <p>⏳ Uploading: {uploadProgress}%</p>
            )}
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
