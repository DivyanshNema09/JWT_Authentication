const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next) => {
    try {
        // is we have tokens 
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode;
        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }

}

module.exports = authMiddleware