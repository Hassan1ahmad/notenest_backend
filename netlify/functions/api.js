import express, { Router } from "express";
import cors from "cors"
import connectToMongo from '../../db';
import serverless from "serverless-http";
import dotenv from 'dotenv';
import authRoutes from '../../routes/auth.js';
import notesRoutes from '../../routes/notes.js';

dotenv.config(); 

connectToMongo();
const app = express()
const router = Router();

// const port =  process.env.PORT || 5000

app.use(cors())
app.use(express.json())

//Available routes
router.use('/auth',authRoutes)
router.use('/notes',notesRoutes)

// app.listen(port, () => {
//   console.log(`Example app listening on port  http://localhost:${port}/`)
// })

app.use("/api" , router)
export const handler = serverless(app);

