import * as api from '../api';
import { setcurrentuser } from './currentuser';
import { fetchallusers } from './users';

export const signup =(authdata,naviagte)=> async(dispatch)=>{
    try {
        const{data}=await api.signup(authdata);
        dispatch({type:"AUTH",data})
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
        dispatch(fetchallusers())
        naviagte("/")
    } catch (error) {
        console.log("signup error:",error.response?.data || error.message)
    }
}
export const login =(authData,naviagte)=> async(dispatch)=>{
    try {
        const{data}=await api.login(authData);

        // If OTP is required, just return message to handle in component
        if (data?.message?.toLowerCase().includes('otp send')) {
            return data;
        }

       dispatch({type:"AUTH",data})
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
       naviagte("/");
       return {message:"Login success"};
    } catch (error) {
        return { message: error.response?.data?.message || "Login error" };

    }
}

// OTP-triggered login flow
export const sendOtpLogin = (email) => async () => {
    return await api.sendOtp(email); // calls /api/login/send-otp
};

export const verifyOtpLogin = (email, otp) => async (dispatch) => {
    const data = await api.verifyOtp(email, otp);
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
};
