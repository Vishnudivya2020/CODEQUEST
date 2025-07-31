
import UAParser from 'ua-parser-js';

export const detectLoginDetails = (req) => {
    const ua = UAParser(req.headers['user-agent']);
    const browser = ua.browser.name || "Unknown";
    const os = ua.os.name || "Unknown";
    const deviceType = ua.device.type || "desktop";
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    return { browser, os, deviceType, ip };
};
