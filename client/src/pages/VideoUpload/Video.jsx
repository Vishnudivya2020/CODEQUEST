// import React, { useState, useEffect } from "react";
// import './video.css';
// import {
//   sendVideoOtp,
//   verifyVideoOtp,
//   uploadVideo,
//   getAllVideos
// } from "../../api/index.js";

// const VideoUpload = ({ onVideoUploadSuccess }) => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [video, setVideo] = useState(null);  // ✅ this was wrong before
//   const [videos, setVideos] = useState([]);
//   const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

//   // ✅ Fetch all uploaded videos
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await getAllVideos();
//         setVideos(res);
//       } catch (err) {
//         console.error("Error fetching videos", err);
//       }
//     };

//     fetchVideos();
//   }, []);

//   const handleSendOtp = async () => {
//     if (!email) return alert("Please enter your email");
//     try {
//       const res = await sendVideoOtp(email, "Video upload request");
//       setStatusMessage({ text: res.message || "OTP sent successfully", type: "info" });
//       setOtpSent(true);
//     } catch (err) {
//       setStatusMessage({ text: "Failed to send OTP", type: "error" });
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp) return alert("Enter the OTP");
//     try {
//       const res = await verifyVideoOtp(email, otp);
//       if (res.success) {
//         setOtpVerified(true);
//         setStatusMessage({ text: "OTP verified successfully", type: "success" });
//       } else {
//         setStatusMessage({ text: "Invalid OTP", type: "error" });
//       }
//     } catch (err) {
//       setStatusMessage({ text: "OTP verification failed", type: "error" });
//     }
//   };

//   const handleUploadVideo = async () => {
//     if (!otpVerified) {
//       setStatusMessage({ text: "Please verify OTP before uploading", type: "error" });
//       return;
//     }

//     if (!video) {
//       alert("Please select a video to upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("video", video);

//     try {
//       const res = await uploadVideo(formData);
//       setStatusMessage({ text: res.message || "Video uploaded successfully", type: "success" });

//       if (res?.video?.videoUrl) {
//         onVideoUploadSuccess(res.video.videoUrl);
//       }

//       // Refresh uploaded videos after upload
//       const updatedVideos = await getAllVideos();
//       setVideos(updatedVideos);
//     } catch (error) {
//       if (error.response?.data?.message) {
//         setStatusMessage({ text: error.response.data.message, type: "error" });
//       } else {
//         setStatusMessage({ text: "Video upload failed", type: "error" });
//       }
//     }
//   };

//   return (
//     <div className="video-upload-container">
//       <div className="uploadHeading">
//         <h2>Upload Your Video</h2>
//       </div>
//       <div className="otpForm">
//         <input
//           type="email"
//           placeholder="Enter your Email"
//           value={email}
//           className="emailInput"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         {!otpSent && <button onClick={handleSendOtp} className="sendOtpButton">Send OTP</button>}

//         {otpSent && !otpVerified && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />
//             <button onClick={handleVerifyOtp} className="sendOtpButton">Verify OTP</button>
//           </>
//         )}

//         {otpVerified && (
//           <>
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setVideo(e.target.files[0])}
//             />
//             <button onClick={handleUploadVideo} className="sendOtpButton">Upload Video</button>
//           </>
//         )}

//         {statusMessage.text && (
//           <p className={`status-message ${statusMessage.type}`}>
//             {statusMessage.text}
//           </p>
//         )}
//       </div>

//       <div className="video-gallery">
//         <h3>Uploaded Videos</h3>
//         {videos.length === 0 && <p>No videos uploaded yet.</p>}
//         {videos.map((v) => (
//           <div key={v._id} className="video-card">
//             <h4>{v.questionTitle}</h4>
//             <video width="320" height="240" controls>
//               <source src={`http://localhost:7000${v.filePath}`} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <p>Uploaded on: {new Date(v.uploadedAt).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoUpload;
// src/components/VideoUpload/Video.jsx
import React, { useState, useEffect } from "react";
import './video.css';
import {
  sendVideoOtp,
  verifyVideoOtp,
  uploadVideo,
  getAllVideos
} from "../../api/index.js";

const VideoUpload = ({ onVideoUploadSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getAllVideos();
        setVideos(res);
      } catch (err) {
        console.error("Error fetching videos", err);
      }
    };
    fetchVideos();
  }, []);

  const handleSendOtp = async () => {
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
    formData.append("email", email);
    formData.append("video", video);

    try {
      const res = await uploadVideo(formData);
      setStatusMessage({ text: res.message || "Uploaded", type: "success" });

      if (res?.video?.videoUrl) {
        onVideoUploadSuccess(res.video.videoUrl); // ✅ set filename path
      }

      const updatedVideos = await getAllVideos();
      setVideos(updatedVideos);
    } catch (error) {
      const msg = error.response?.data?.message || "Upload failed";
      setStatusMessage({ text: msg, type: "error" });
    }
  };

  return (
    <div className="video-upload-container">
      <div className="uploadHeading"><h2>Upload Your Video</h2></div>
      <div className="otpForm">
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="emailInput"
        />
        {!otpSent && (
          <button onClick={handleSendOtp} className="sendOtpButton">Send OTP</button>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} className="sendOtpButton">Verify OTP</button>
          </>
        )}

        {otpVerified && (
          <>
            <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            <button onClick={handleUploadVideo} className="sendOtpButton">Upload Video</button>
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

