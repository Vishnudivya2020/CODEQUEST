import axios from "axios";


const API = axios.create({
     baseURL: "https://codequest-n1rs.onrender.com"
  
});

const token = localStorage.getItem("token");


// API.interceptors.request.use((req) => {
//     if (localStorage.getItem("Profile")) {
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token
//             }`;
//     }
//     return req;
// })
API.interceptors.request.use((req) => {
  const token = JSON.parse(localStorage.getItem("Profile"))?.token;
  if (token) {
    req.headers.Authorization = `Bearer ${String(token).replace(/[\r\n\s]+/g, '')}`;
  }
  return req;
});


export const login = (authdata) => API.post("user/login", authdata);
export const sendOtp =async (email) =>{
    try{
        const res = await API.post("/api/login/send-otp",{email});
        return res.data;
    } catch (err) {
        console.log("Error sending OTP:", err);
        throw err
    }
};
//Verify OTP 
export const verifyOtp = async (email, otp) => {
    try {
        const res = await API.post("/api/login/verify-otp", { email, otp});
        return res.data;
    } catch (err) {
        console.error("Error verifying OTP:", err);
        throw err;
    }
}

export const fetchLoginHistory = () => API.get("/login-history");



export const signup = (authdata) => API.post("user/signup", authdata);
export const getallusers = () => API.get("/user/getallusers");
export const updateprofile = (id, updatedata) => API.patch(`user/update/${id}`, updatedata)


export const postquestion = (questiondata) => API.post("/questions/Ask", questiondata);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const voteTextquestion = (id, value) => API.patch(`/questions/vote/${id}`, { value });

export const postanswer = (id, noofanswers, answerbody, useranswered, userid) =>
    API.patch(`/answer/post/${id}`, { noofanswers, answerbody, useranswered, userid });

export const deleteanswer = (id, answerid, noofanswers) =>
    API.patch(`/answer/delete/${id}`, { answerid, noofanswers });

//------------------Chatbot---------------------- 
//function to send OTP
export const sendOtpToUser = async (email, question) => {
    try {
        const res = await API.post("/api/chatbot/send-otp", { email, question });
        return res.data;

    } catch (err) {
        console.log("Error sending OTP:", err);
        throw err;
    }
}

//Verify OTP and get answer
export const verifyOtpAnswer = async (email, otp, question) => {
    try {
        const res = await API.post("/api/chatbot/verify-otp", { email, otp, question });
        return res.data;
    } catch (err) {
        console.error("Error verifying OTP:", err);
        throw err;
    }
}

//------------Video Uploading------------------------;

// Send OTP for video upload
export const sendVideoOtp = async (email, purpose) => {
    try {
        const res = await API.post("/api/videoupload/send-otp", { email, purpose }); 
        return res.data;
    } catch (err) {
        console.log("Error sending OTP for video upload:", err);
        throw err;
    }
};

//  Verify OTP for video upload
export const verifyVideoOtp = async (email, otp) => {
    try {
        const res = await API.post("/api/videoupload/verify-otp", { email, otp }); 
        return res.data;
    } catch (err) {
        console.log("Error verifying OTP for video upload:", err);
        throw err;
    }
};

//  Upload video
export const uploadVideo = (formData) => {
    return API.post("/api/videoupload/upload", formData, { // ✅ fixed path
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization:`Bearer ${token}`
        },
    });
};


export const postvideoquestion = (videoquestiondata) => 
  API.post("/video/upload", videoquestiondata);

export const getallvideoquestions = () => 
  API.get("/video/");

export const getSingleVideoQuestion = (id) => 
  API.get(`/video/${id}`);

export const deletevideoquestion = (id) => 
  API.delete(`/video/delete/${id}`);

export const voteVideoQuestion = (id, value) =>
  API.patch(`/video/vote/${id}`, { value }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const postvideoanswer = (id, noofanswers, answerbody, useranswered, userid) =>
    API.patch(`/videoanswer/post/${id}`, { noofanswers, answerbody, useranswered, userid },{headers:{Authorization: `Bearer ${token}`}});

export const deletevideoanswer = (id, answerid, noofanswers) =>
    API.patch(`/videoanswer/delete/${id}`, { answerid, noofanswers });







