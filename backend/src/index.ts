import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/post.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// Server Init
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});