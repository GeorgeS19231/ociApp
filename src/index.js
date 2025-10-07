import express from 'express';
import './db/mongoose.js';
import { userRouter } from './routes/user.js';



const app = express();


const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});



