import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app= express()

// app.use(({
//     origin : process.env.CORS_ORIGIN,
//     Credential : true
// }))

app.use(express.json({limit:"16kb"}))
app.use( express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




//Routes Import
import  userRouter from "./routes/user.routes.js"


// routes declaration
 app.use("/api/v1/users", userRouter)
23


export { app }