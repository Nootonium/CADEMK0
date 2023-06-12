import express from 'express';
import connectDB from './database/connectDB';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes';


dotenv.config();

connectDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(contactRoutes);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
