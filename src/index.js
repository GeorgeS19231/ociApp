import express from 'express';
import './db/mongoose.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { userRouter } from './routes/user.js';
import { jobRouter } from './routes/job.js';



const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later'
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());


const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(userRouter);
app.use(jobRouter)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});



