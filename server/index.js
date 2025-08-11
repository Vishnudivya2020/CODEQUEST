import express from "express"
import mongoose from "mongoose"
import path from "path";
import { fileURLToPath} from 'url';
import cors from "cors"
import dotenv from "dotenv"
import userroutes from "./routes/user.js"
import questionroutes from "./routes/question.js"
import answerroutes from "./routes/answer.js";
import chatbotRoutes from "./routes/chatbotRouter.js"
import videoQuestionRoutes from './routes/videoQuestionRouter.js'
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import authRoutes from "./routes/authRoutes.js";
import videoUploadRoutes from './routes/videoUpload.js';
import VideoAnswerRoutes from './routes/Videoanswer.js'

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}));

app.use("/user", userroutes);

app.use('/questions', questionroutes)
app.use('/answer',answerroutes)
app.use('/api/chatbot', chatbotRoutes);
app.use("/video",videoQuestionRoutes)
app.use('/',authRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/videoupload', videoUploadRoutes);  
app.use("/videoanswer", VideoAnswerRoutes);



app.get('/', (req, res) => {
    res.send("Codequest is running perfect")
})

const PORT = process.env.PORT || 5000
const database_url = process.env.MONGODB_URL;



mongoose.connect(database_url)
    .then(() => app.listen(PORT, () => { console.log(`server running on port ${PORT}`) }))
    .catch((err) => console.log(err.message))

    