const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing",
        });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format",
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in first.",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Administrator privileges required.",
        });
    }

    next();
}

module.exports = { authMiddleware, adminMiddleware };