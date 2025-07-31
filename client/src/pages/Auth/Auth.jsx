
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UAParser } from 'ua-parser-js';
import axios from 'axios';
import "./Auth.css";
import icon from '../../assets/icon.png';
import Aboutauth from './Aboutauth';
import { signup, login } from '../../action/auth';

const Auth = () => {
    const [issignup, setissignup] = useState(false)
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [otp, setOtp] = useState('');
    const [otpRequired, setOtpRequired] = useState(false);
    const [ip, setIp] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch IP address on mount
    useEffect(() => {
        const fetchIP = async () => {
            try {
                const res = await axios.get('https://api.ipify.org?format=json');
                setIp(res.data.ip);
            } catch (err) {
                console.error('Failed to get IP address', err);
            }
        };
        fetchIP();
    }, []);

     // OTP Countdown Timer
    useEffect(() => {
        let timer;
        if (otpRequired && isResendDisabled) {
            timer = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
         }, [otpRequired, isResendDisabled]);

    const getDeviceInfo = () => {
        const parser = new UAParser();
        const result = parser.getResult();
        return {
            browser: result.browser.name?.toLowerCase() || '',
            deviceType: result.device.type || 'desktop',
            os: result.os.name || '',
        };
    };

   const handlesubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    const { browser, deviceType, os } = getDeviceInfo();
    const now = new Date();
    const hour = now.getHours();

    if (issignup) {
        if (!name) {
            alert("Enter a name to continue");
            return;
        }
        dispatch(signup({ name, email, password }, navigate));
        return;
    }

    if (deviceType === 'mobile' && (hour < 10 || hour >= 13)) {
        alert('Mobile login allowed only between 10 AM and 1 PM');
        return;
    }

    if (browser === 'edge') {
        dispatch(login({ email, password, browser, os, deviceType, ip }, navigate));
        return;
    }

    if (browser === 'chrome' && !otp && !otpRequired) {
        const res = await dispatch(login({ email, password, browser, os, deviceType, ip }));
        if (res?.message?.toLowerCase().includes('otp sent')) {
            alert('OTP sent to your email.');
            setOtpRequired(true);
             setSecondsLeft(60);
             setIsResendDisabled(true);
            return;
        } else {
            alert(res?.message || 'Unexpected error');
            return;
        }
    }

    if (otpRequired) {
        if (!otp) {
            alert("Enter the OTP sent to your email");
            return;
        }

        const res = await dispatch(login({ email, password, otp, browser, os, deviceType, ip }, navigate));
        if (res?.message?.toLowerCase().includes('success')) {
            alert("Login successful");
        } else {
            alert(res?.message || "Invalid OTP or login failed");
        }

        return;
    }
};

const handleResendOTP = async () => {
        try {
            const { browser, deviceType, os } = getDeviceInfo();
            const res = await dispatch(login({ email, password, browser, os, deviceType, ip }));

            if (res?.message?.toLowerCase().includes('otp sent')) {
                alert('OTP resent successfully');
                setSecondsLeft(60);
                setIsResendDisabled(true);
            } else {
                alert(res?.message || "Couldn't resend OTP");
            }
             } catch (err) {
            alert("Error resending OTP");
        }
    };
            
 
 const handleswitch = () => {
        setissignup(!issignup);
        setname("");
        setemail("");
        setpassword("");
        setOtp('');
        setOtpRequired(false);
    };

    return (
        <section className="auth-section">
            {issignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className='login-logo' />
                <form onSubmit={handlesubmit}>
                    {issignup && (
                        <label htmlFor="name">
                            <h4>Display Name</h4>
                            <input
                                type="text"
                                id='name'
                                name='name'
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                            />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>Password</h4>
                            {!issignup && (
                                <p style={{ color: "#007ac6", fontSize: "13px" }}>
                                    Forgot Password?
                                </p>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </label>

                    {!issignup && otpRequired && (
                        <>
                        <label htmlFor="otp">
                            <h4>OTP</h4>
                            <input
                                type="text"
                                name="otp"
                                id="otp"
                                value={otp}
                                inputMode='numeric'
                                pattern='\d*'
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </label>
                        <div style={{ marginTop: '10px' }}>
                            {isResendDisabled ? (
                                    <p style={{ fontSize: '13px', color: '#888' }}>
                                        Resend OTP in {secondsLeft} seconds
                                    </p>
                                    ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="resend-otp-btn"
                                    >Resend OTP</button>
                         )}
                         </div>
                      </>
                    )}
                    <button type='submit' className='auth-btn'>
                        {issignup ? "Sign up" : "Log in"}
                    </button>
                </form>
                <p>
                    {issignup ? "Already have an account?" : "Don't have an account?"}
                    <button
                        type='button'
                        className='handle-switch-btn'
                        onClick={handleswitch}>
                        {issignup ? "Log in" : "Sign up"}
                    </button>
                </p>
            </div>
        </section>
    )
}

export default Auth;
