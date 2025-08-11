import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoginHistory } from "../../action/auth";
import "./LoginHistory.css";

const LoginHistory = () => {
    const dispatch = useDispatch();
    
    const history = useSelector((state) => state.auth.loginHistory || []);

    useEffect(() => {
        dispatch(getLoginHistory());
    }, [dispatch]);

    return (
        <div className="history-container">
            <h2>Login History</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>IP Address</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Device</th>
                        <th>OTP Verified</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <tr key={index}>
                                <td>{new Date(entry.loginTime).toLocaleString()}</td>
                                <td>{entry.ipAddress}</td>
                                <td>{entry.browser}</td>
                                <td>{entry.os}</td>
                                <td>{entry.deviceType}</td>
                                <td>{entry.otpVerified ? "✅" : "❌"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No login history found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LoginHistory;
