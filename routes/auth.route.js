const express = require("express")
const authRoute = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const {testing , register , login , profile , logout} = require("../controllers/auth.controller")


authRoute.get("/testing" ,testing)
authRoute.post("/register" , register)
authRoute.post("/login" , login)
authRoute.get("/profile" , authMiddleware, profile)
authRoute.get("/logout" , logout)
module.exports = authRoute