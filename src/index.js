import connectDB from './db/index.js';
import dotenv from "dotenv";
import { app } from './app.js';

dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`http://localhost:${process.env.PORT || 3000}`)
    })
})
.catch((error) => {
    app.on("error", () => {
        console.log(error)
        throw error
    })
    console.log("MONGO DB connection failed !!!", error)
})



















/*
import express from 'express'
const app = express()
;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", () => {
            console.log(error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log(error)
        throw error
    }
})();

*/