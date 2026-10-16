const user = require("../models/user.schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const testing = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Testing Done"
    })
}

const register = async (req, res) => {
    try {
        const { userName, age, email, password } = req.body
        if (!userName || !age === undefined || !email || !password) {
            res.status(400).json({
                success: false,
                message: "all field are requied"
            })
        }

        const checkEmail = await user.findOne({ email: email })
        if (checkEmail)
            return res.status(409).json({
                success: false,
                message: "Email already Exist "
            })

        //Hashing the password

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await user.create({
            userName,
            age,
            email,
            password: hashPassword
        })

        return res.status(201).json({
            success: true,
            message: "userCreated"
        })

    }


    catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(209).json({
                success: false,
                message: "all details are requied"
            })
        }

        const findEmail = await user.findOne({ email: email });

        if (!findEmail) {
            return res.status(401).json({
                success: false,
                message: "User Not Found , incorrect email or not register"
            })
        }

        const isPassword = await bcrypt.compare(password, findEmail.password)

        if (!isPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        //token banana hai
        const token = jwt.sign({
            userId: findEmail._id,
            email: findEmail.email
        },
            process.env.JWT_SECRET
            , {
                expiresIn: "1d"
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false
        })

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            token
        }
        )
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
const profile = async (req, res) => {
    try {
        const findUser = await user.findById(req.user.userId);

        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile Found",
            user: findUser
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("token")
    return res.status(200).json({
        success: true,
        message: "user LogOut"
    })
}
module.exports = { testing, register, login, profile, logout }