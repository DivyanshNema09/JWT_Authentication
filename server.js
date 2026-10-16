require("dotenv").config()
const connectToDb = require("./config/db")
const app = require("./app")
const PORT = process.env.PORT || 4000 


const start = async ()=>{
    try {
        await connectToDb()
        app.listen(PORT , ()=>{
            console.log(`server running on port ${PORT}`); 
        })
    } catch (error) {
        console.log(error);
    }
}

start()